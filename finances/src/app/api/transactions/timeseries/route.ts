import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { AccountType } from "@prisma/client";
import { Prisma } from "@prisma/client"; // Import Prisma namespace
import { Decimal } from "@prisma/client/runtime/library";

// Helper to get date truncation format for PostgreSQL
function getDateFormat(period: "month" | "week" | "quarter"): string {
  switch (period) {
    case "week":
      return "YYYY-WW"; // ISO week
    case "quarter":
      return "YYYY-Q";
    case "month":
    default:
      return "YYYY-MM";
  }
}

// Helper to get date truncation function for PostgreSQL
function getDateTrunc(period: "month" | "week" | "quarter"): string {
  switch (period) {
    case "week":
      return "week";
    case "quarter":
      return "quarter";
    case "month":
    default:
      return "month";
  }
}

export async function GET(request: NextRequest) {
  console.log("GET /api/transactions/timeseries request received");
  const session = await getServerSession(authOptions);

  // --- Authentication ---
  if (
    !session ||
    !session.user?.email ||
    session.user.email !== "ankur.boyed@gmail.com"
  ) {
    console.error("Timeseries Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userEmail = session.user.email;

  try {
    // --- Get User ---
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // --- Parse Query Parameters ---
    const searchParams = request.nextUrl.searchParams;
    const period = (searchParams.get("period") || "month") as
      | "month"
      | "week"
      | "quarter";
    const accountsParam = searchParams.get("accounts") || "ALL";

    let selectedAccounts: AccountType[];
    if (accountsParam.toUpperCase() === "ALL") {
      selectedAccounts = Object.values(AccountType);
    } else {
      selectedAccounts = accountsParam
        .split(",")
        .map((a) => a.trim().toUpperCase())
        .filter((a) =>
          Object.values(AccountType).includes(a as AccountType)
        ) as AccountType[];
      if (selectedAccounts.length === 0) {
        return NextResponse.json(
          { error: "No valid accounts selected" },
          { status: 400 }
        );
      }
    }

    console.log(
      `Fetching timeseries for user ${
        user.id
      }, period: ${period}, accounts: ${selectedAccounts.join(",")}`
    );

    // --- Database Query using $queryRaw with CTE ---
    const dateFormat = getDateFormat(period);
    const dateTruncUnit = getDateTrunc(period);

    // Use a CTE to first group by the truncated date, then format
    const query = Prisma.sql`
            WITH GroupedTransactions AS (
                SELECT 
                    DATE_TRUNC(${dateTruncUnit}, date) as truncated_date,
                    SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as inflow,
                    SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as outflow
                FROM "Transaction"
                WHERE "userId" = ${user.id}
                  AND "accountType" = ANY(${selectedAccounts}::"AccountType"[]) 
                GROUP BY truncated_date -- Group by the result of DATE_TRUNC here
            )
            SELECT 
                TO_CHAR(truncated_date, ${dateFormat}) as period,
                inflow,
                outflow
            FROM GroupedTransactions
            ORDER BY truncated_date ASC; -- Order by the original truncated date
        `;

    const result = await prisma.$queryRaw<
      {
        period: string;
        inflow: Decimal;
        outflow: Decimal;
      }[]
    >(query);

    console.log(`Found ${result.length} time periods.`);

    // Convert Decimals to strings for JSON serialization
    const serializableResult = result.map((item) => ({
      period: item.period,
      inflow: item.inflow.toFixed(2),
      outflow: item.outflow.toFixed(2),
    }));

    return NextResponse.json({ success: true, data: serializableResult });
  } catch (error) {
    console.error("Error fetching timeseries data:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch timeseries data.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
