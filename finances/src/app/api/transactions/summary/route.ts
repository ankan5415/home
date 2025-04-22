import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path as needed
import { prisma } from "@/lib/prisma";
import { AccountType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export async function GET() {
  console.log("GET /api/transactions/summary request received");
  const session = await getServerSession(authOptions);

  // --- Authentication ---
  if (
    !session ||
    !session.user?.email ||
    session.user.email !== "ankur.boyed@gmail.com"
  ) {
    console.error("Summary Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userEmail = session.user.email;

  try {
    // --- Get User ---
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      console.error(`User not found for email: ${userEmail}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // --- Fetch Transactions ---
    console.log(`Fetching transactions for user ${user.id}`);
    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      select: { accountType: true, amount: true }, // Only select necessary fields
    });
    console.log(`Found ${transactions.length} transactions.`);

    // --- Calculate Summaries ---
    const summary: Record<AccountType, { inflow: Decimal; outflow: Decimal }> =
      {
        CASH: { inflow: new Decimal(0), outflow: new Decimal(0) },
        SAVE: { inflow: new Decimal(0), outflow: new Decimal(0) },
        WISE: { inflow: new Decimal(0), outflow: new Decimal(0) },
        CORP: { inflow: new Decimal(0), outflow: new Decimal(0) },
      };
    let totalInflow = new Decimal(0);
    let totalOutflow = new Decimal(0);

    for (const tx of transactions) {
      if (tx.amount.isPositive()) {
        summary[tx.accountType].inflow = summary[tx.accountType].inflow.plus(
          tx.amount
        );
        totalInflow = totalInflow.plus(tx.amount);
      } else {
        // Outflow is stored as negative, add its absolute value to outflow totals
        const outflowAmount = tx.amount.abs();
        summary[tx.accountType].outflow =
          summary[tx.accountType].outflow.plus(outflowAmount);
        totalOutflow = totalOutflow.plus(outflowAmount);
      }
    }

    const netTotal = totalInflow.minus(totalOutflow);

    console.log("Summary calculated successfully");

    // Convert Decimals to strings for JSON serialization
    const serializableSummary = Object.entries(summary).reduce(
      (acc, [key, value]) => {
        acc[key as AccountType] = {
          inflow: value.inflow.toFixed(2),
          outflow: value.outflow.toFixed(2),
        };
        return acc;
      },
      {} as Record<AccountType, { inflow: string; outflow: string }>
    );

    return NextResponse.json({
      success: true,
      summary: serializableSummary,
      totals: {
        inflow: totalInflow.toFixed(2),
        outflow: totalOutflow.toFixed(2),
        net: netTotal.toFixed(2),
      },
    });
  } catch (error) {
    console.error("Error fetching transaction summary:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch summary.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
