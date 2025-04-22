import { NextResponse } from "next/server";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { AccountType, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  getOrCreateUser,
  getOrCreateAccount,
  parseTransactionsFromCsv,
} from "@/lib/processing";

// Use shared S3 client (consider moving this to its own lib file too)
const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// streamToString helper needed for GetObject response
const streamToString = (stream: NodeJS.ReadableStream): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });

export async function POST() {
  console.log("Reprocess request received");
  const session = await getServerSession(authOptions);

  // --- Authentication ---
  if (
    !session ||
    !session.user?.email ||
    session.user.email !== "ankur.boyed@gmail.com"
  ) {
    console.error("Reprocess Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userEmail = session.user.email;
  console.log(`Reprocessing for user: ${userEmail}`);

  const bucket = process.env.AWS_BUCKET;
  if (!bucket) {
    console.error("Reprocess Server configuration error: AWS_BUCKET missing.");
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 }
    );
  }

  let user: User;
  try {
    // --- Get User ---
    // Use upsert to ensure user exists, even if they have no transactions yet
    user = await getOrCreateUser(userEmail, session.user.name);
    console.log(`User ID: ${user.id}`);

    // --- Delete Existing Transactions for User ---
    console.log(`Deleting existing transactions for user ${user.id}...`);
    const deleteResult = await prisma.transaction.deleteMany({
      where: { userId: user.id },
    });
    console.log(`Deleted ${deleteResult.count} transactions.`);

    // --- List S3 Objects ---
    const prefix = `uploads/${userEmail}/`;
    console.log(`Listing objects in s3://${bucket}/${prefix}`);
    const listCommand = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    });
    const listResponse = await s3Client.send(listCommand);

    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      console.log("No files found in S3 to reprocess.");
      return NextResponse.json({
        success: true,
        message: "No files found in S3 to reprocess.",
        filesProcessed: 0,
        transactionsInserted: 0,
      });
    }

    let totalFilesProcessed = 0;
    let totalTransactionsInserted = 0;

    // --- Process Each S3 Object ---
    for (const object of listResponse.Contents) {
      const key = object.Key;
      if (!key || !key.toLowerCase().endsWith(".csv")) {
        // Simple check for CSV files
        console.log(`Skipping non-CSV or invalid key: ${key}`);
        continue;
      }
      console.log(`Processing S3 object: ${key}`);
      totalFilesProcessed++;

      try {
        // Extract account type from key (e.g., uploads/email/CASH/date/file.csv -> CASH)
        const parts = key.split("/");
        if (parts.length < 4) {
          // Expecting at least uploads/email/ACCOUNT/file or uploads/email/ACCOUNT/folder/file
          console.warn(
            `Could not determine account type from key: ${key}. Skipping.`
          );
          continue;
        }
        const accountTypeStr = parts[2].toUpperCase();
        if (
          !Object.values(AccountType).includes(accountTypeStr as AccountType)
        ) {
          console.warn(
            `Invalid account type found in key ${key}: ${accountTypeStr}. Skipping.`
          );
          continue;
        }
        const accountType = accountTypeStr as AccountType;

        // Download file content
        const getCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
        const getResponse = await s3Client.send(getCommand);
        if (!getResponse.Body) {
          console.warn(`Could not get body for S3 object: ${key}. Skipping.`);
          continue;
        }
        // Assuming Body is a ReadableStream (Node.js) from AWS SDK v3
        const csvContent = await streamToString(
          getResponse.Body as NodeJS.ReadableStream
        );
        const buffer = Buffer.from(csvContent, "utf-8");

        // Get or create account
        const account = await getOrCreateAccount(user.id, accountType);

        // Parse transactions (now synchronous again)
        const transactionsToCreate = parseTransactionsFromCsv(buffer);

        if (transactionsToCreate.length > 0) {
          const transactionsWithKeys = transactionsToCreate.map((tx) => ({
            ...tx,
            userId: user.id,
            accountId: account.id,
            accountType: accountType,
          }));

          // Insert transactions
          const insertResult = await prisma.transaction.createMany({
            data: transactionsWithKeys,
            skipDuplicates: true,
          });
          console.log(
            `Inserted ${insertResult.count} transactions from ${key}.`
          );
          totalTransactionsInserted += insertResult.count;
        } else {
          console.log(`No transactions parsed from ${key}.`);
        }
      } catch (fileError) {
        console.error(`Error processing file ${key}:`, fileError);
        // Decide whether to continue processing other files or stop
        // For now, let's log and continue
      }
    } // End loop through S3 objects

    console.log(
      `Reprocessing finished. Processed ${totalFilesProcessed} files, inserted ${totalTransactionsInserted} new transactions.`
    );
    return NextResponse.json({
      success: true,
      message: `Reprocessing complete. Processed ${totalFilesProcessed} files.`,
      filesProcessed: totalFilesProcessed,
      transactionsInserted: totalTransactionsInserted,
    });
  } catch (error) {
    console.error("Error during reprocessing:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Reprocessing failed.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
