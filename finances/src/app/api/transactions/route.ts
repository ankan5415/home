import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const DEFAULT_LIMIT = 20;

export async function GET(request: NextRequest) {
  console.log("GET /api/transactions request received");
  const session = await getServerSession(authOptions);

  // --- Authentication ---
  if (
    !session ||
    !session.user?.email ||
    session.user.email !== "ankur.boyed@gmail.com"
  ) {
    console.error("Transactions Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userEmail = session.user.email;

  try {
    // --- Get User ---
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // --- Parse Pagination Parameters ---
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(
      searchParams.get("limit") || DEFAULT_LIMIT.toString()
    );
    const skip = (page - 1) * limit;

    // --- Fetch Transactions (Paginated) ---
    console.log(
      `Fetching transactions for user ${user.id}, page: ${page}, limit: ${limit}`
    );
    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: {
        date: "desc", // Default sort: newest first
      },
      skip: skip,
      take: limit,
    });

    // --- Get Total Count for Pagination ---
    const totalTransactions = await prisma.transaction.count({
      where: { userId: user.id },
    });

    console.log(
      `Found ${transactions.length} transactions for page ${page}. Total: ${totalTransactions}`
    );

    // --- Prepare Response (Convert Decimal to String) ---
    const serializableTransactions = transactions.map((tx) => ({
      ...tx,
      amount: tx.amount.toFixed(2),
      balance: tx.balance?.toFixed(2) ?? null, // Handle optional balance
    }));

    return NextResponse.json({
      success: true,
      data: serializableTransactions,
      pagination: {
        page: page,
        limit: limit,
        total: totalTransactions,
        totalPages: Math.ceil(totalTransactions / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch transactions.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
