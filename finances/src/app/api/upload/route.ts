import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route"; // Assuming authOptions is exported from your [...nextauth] route
import { AccountType } from "@prisma/client";
// Import refactored utilities
import { prisma } from "@/lib/prisma";
import {
  getOrCreateUser,
  getOrCreateAccount,
  parseTransactionsFromCsv,
  getDateRangeFromCsv,
} from "@/lib/processing";

// Instantiate S3 Client (can also be moved to a lib file if needed elsewhere)
const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

async function streamToBuffer(
  stream: ReadableStream<Uint8Array>
): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    if (value) {
      chunks.push(value);
    }
  }

  return Buffer.concat(chunks);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    // Ensure email exists
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userEmail = session.user.email;

  let file: File | null = null;
  let accountInput: string | null = null;
  let buffer: Buffer;
  let s3Key: string | null = null;

  try {
    const formData = await request.formData();
    file = formData.get("file") as File | null;
    accountInput = formData.get("account") as string | null;

    // --- 1. Validation ---
    if (!file) throw new Error("File is required.");
    if (
      !accountInput ||
      !Object.values(AccountType).includes(
        accountInput.toUpperCase() as AccountType
      )
    ) {
      throw new Error("Invalid account type specified.");
    }
    const accountType = accountInput.toUpperCase() as AccountType;
    const bucket = process.env.AWS_BUCKET;
    if (!bucket)
      throw new Error("Server configuration error: AWS_BUCKET missing.");

    // --- 2. Read Buffer & Determine Date Range ---
    buffer = await streamToBuffer(file.stream());
    let dateRange = getDateRangeFromCsv(buffer);
    if (!dateRange) {
      console.warn("Falling back to upload date for S3 key generation.");
      const uploadDate = new Date();
      const year = uploadDate.getFullYear();
      const month = String(uploadDate.getMonth() + 1).padStart(2, "0");
      dateRange = {
        startDate: `${year}-${month}-01`,
        endDate: `${year}-${month}-01`,
      };
    }

    // --- 3. Upload to S3 ---
    const filename = encodeURIComponent(file.name);
    const dateRangeString = `${dateRange.startDate}_to_${dateRange.endDate}`;
    s3Key = `uploads/${userEmail}/${accountType}/${dateRangeString}/${filename}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: s3Key,
      Body: buffer,
      ContentType: file.type,
    });
    await s3Client.send(command);
    console.log(`Successfully uploaded ${filename} to ${bucket}/${s3Key}`);

    // --- 4. Process & Insert into DB (Using Utilities) ---
    console.log(`Processing file ${s3Key} for database insertion...`);

    // Use utility functions
    const user = await getOrCreateUser(userEmail, session.user.name);
    const account = await getOrCreateAccount(user.id, accountType);
    const transactionsToCreate = parseTransactionsFromCsv(buffer);

    if (transactionsToCreate.length === 0) {
      console.log(
        `No transactions found or parsed in ${filename}. Skipping database insertion.`
      );
      return NextResponse.json({
        success: true,
        message: "File uploaded to S3, but no transactions processed.",
        key: s3Key,
      });
    }

    const transactionsWithKeys = transactionsToCreate.map((tx) => ({
      ...tx,
      userId: user.id,
      accountId: account.id,
      accountType: accountType,
    }));

    const result = await prisma.transaction.createMany({
      data: transactionsWithKeys,
      skipDuplicates: true,
    });

    console.log(
      `Database insertion complete for ${filename}. Inserted ${result.count} new transactions.`
    );

    return NextResponse.json({
      success: true,
      message: `File uploaded and ${result.count} transactions processed.`,
      key: s3Key,
      transactionsProcessed: result.count,
    });
  } catch (error) {
    console.error("Error in POST /api/upload:", error);

    // Optional: Attempt to delete the file from S3 if DB processing failed after upload
    if (s3Key && process.env.AWS_BUCKET) {
      console.warn(
        `DB processing failed after S3 upload. Attempting to delete ${s3Key} from S3.`
      );
      // TODO: Add S3 delete logic here if desired
    }

    // Check error type for message
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to upload or process file.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
