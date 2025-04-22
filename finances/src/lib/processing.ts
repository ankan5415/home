import { prisma } from "./prisma";
import { AccountType, Prisma } from "@prisma/client";
import Papa from "papaparse";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Finds or creates a user based on email.
 */
export async function getOrCreateUser(email: string, name?: string | null) {
  if (!email) throw new Error("Email is required to get or create user.");
  return await prisma.user.upsert({
    where: { email: email },
    update: { name: name ?? undefined },
    create: { email: email, name: name ?? undefined },
  });
}

/**
 * Finds or creates a specific account type for a given user ID.
 */
export async function getOrCreateAccount(
  userId: string,
  accountType: AccountType
) {
  return await prisma.account.upsert({
    where: { userId_type: { userId: userId, type: accountType } },
    update: {},
    create: { userId: userId, type: accountType },
  });
}

/**
 * Extracts the start and end date from a CSV buffer.
 * Tries to detect format based on headers.
 */
export function getDateRangeFromCsv(
  buffer: Buffer
): { startDate: string; endDate: string } | null {
  try {
    const csvString = buffer.toString("utf-8");
    const parsed = Papa.parse<Record<string, string>>(csvString, {
      header: true,
      skipEmptyLines: true,
      preview: 1,
    }); // Preview 1 row for headers
    const headers = parsed.meta.fields || [];

    let dateColumnHeader: string | undefined;
    // Detect format and get date column header
    if (headers.includes("Created on")) {
      // Wise format
      dateColumnHeader = "Created on";
    } else if (headers.includes("date")) {
      // Original format
      dateColumnHeader = headers[0]; // Assume first column if 'date' exists
    } else {
      console.error("Could not determine date column for getDateRangeFromCsv");
      return null;
    }

    // Now parse the whole file again to get all dates (inefficient but simple)
    const fullParsed = Papa.parse<Record<string, string>>(csvString, {
      header: true,
      skipEmptyLines: true,
    });

    if (fullParsed.errors.length > 0)
      console.error(
        "CSV Parsing errors (getDateRangeFromCsv):",
        fullParsed.errors
      );
    if (!fullParsed.data || fullParsed.data.length === 0) return null;

    let minDate: Date | null = null,
      maxDate: Date | null = null;

    fullParsed.data.forEach((row) => {
      const dateStr = row[dateColumnHeader!]; // Use the determined header
      if (dateStr) {
        const currentDate = new Date(dateStr);
        if (!isNaN(currentDate.getTime())) {
          if (minDate === null || currentDate < minDate) minDate = currentDate;
          if (maxDate === null || currentDate > maxDate) maxDate = currentDate;
        }
      }
    });

    if (minDate && maxDate) {
      const formatDate = (date: Date) => date.toISOString().split("T")[0];
      return { startDate: formatDate(minDate), endDate: formatDate(maxDate) };
    } else return null;
  } catch (error) {
    console.error("Error processing CSV for date range:", error);
    return null;
  }
}

// Define hardcoded rate
const USDCAD_RATE = new Decimal(1.39);

/**
 * Parses transactions from a CSV buffer, detecting format.
 * Uses hardcoded USDCAD rate.
 * Returns an array of transaction data ready for createMany (without foreign keys).
 */
export function parseTransactionsFromCsv(
  buffer: Buffer
): Omit<
  Prisma.TransactionUncheckedCreateInput,
  "userId" | "accountId" | "accountType"
>[] {
  const transactions: Omit<
    Prisma.TransactionUncheckedCreateInput,
    "userId" | "accountId" | "accountType"
  >[] = [];
  try {
    const csvString = buffer.toString("utf-8");
    const result = Papa.parse<Record<string, string>>(csvString, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });
    const headers = result.meta.fields || [];
    console.log("[Parse] Detected Headers:", headers);
    if (result.errors.length > 0)
      console.error("CSV Parsing errors:", result.errors);

    const isWiseFormat =
      headers.includes("Source currency") &&
      headers.includes("Target currency") &&
      headers.includes("Direction");
    const isOriginalFormat =
      headers.includes("date") &&
      headers.includes("description") &&
      headers.includes("amount");

    if (isWiseFormat) {
      console.log("[Parse] Detected Wise Format");
      const findHeader = (possibleNames: string[]) =>
        headers.find((h) =>
          possibleNames.some((n) => n.toLowerCase() === h.toLowerCase())
        );
      const dateHeader = "Created on",
        statusHeader = findHeader(["Status"]),
        directionHeader = findHeader(["Direction"]);
      const sourceAmountHeader = findHeader(["Source amount (after fees)"]),
        sourceCurrencyHeader = findHeader(["Source currency"]);
      const targetAmountHeader = findHeader(["Target amount (after fees)"]),
        targetCurrencyHeader = findHeader(["Target currency"]);
      const sourceNameHeader = findHeader(["Source name"]),
        targetNameHeader = findHeader(["Target name"]),
        referenceHeader = findHeader(["Reference"]);

      if (
        !statusHeader ||
        !directionHeader ||
        !sourceAmountHeader ||
        !sourceCurrencyHeader ||
        !targetAmountHeader
      ) {
        console.error(
          "Missing required headers for Wise format processing. Found:",
          headers
        );
        throw new Error("Missing required headers for Wise format processing.");
      }

      result.data.forEach((row, index) => {
        try {
          const status = row[statusHeader!]?.toUpperCase();
          const direction = row[directionHeader!]?.toUpperCase();
          const sourceCurrency = row[sourceCurrencyHeader!]?.toUpperCase();
          const targetCurrency = row[targetCurrencyHeader!]?.toUpperCase();
          const dateStr = row[dateHeader];
          const sourceAmountStr = row[sourceAmountHeader!];
          const targetAmountStr = row[targetAmountHeader!];

          if (status !== "COMPLETED") {
            console.log(
              `[Parse] Skipping Wise row ${index + 2}: Status is ${status}.`
            );
            return;
          }
          if (
            !dateStr ||
            !sourceCurrency ||
            !targetCurrency ||
            !sourceAmountStr ||
            !targetAmountStr ||
            !direction
          ) {
            console.warn(
              `[Parse] Skipping Wise row ${
                index + 2
              }: Missing essential fields.`
            );
            return;
          }
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) {
            console.warn(
              `[Parse] Skipping Wise row ${index + 2}: Invalid date format.`
            );
            return;
          }

          let cadEquivalentAmount: Decimal | null = null;

          // --- Calculate the POSITIVE CAD equivalent amount ---
          if (targetCurrency === "CAD" && sourceCurrency === "CAD") {
            // Use source amount for CAD<->CAD
            cadEquivalentAmount = new Decimal(
              sourceAmountStr.replace(/[^\d.-]/g, "")
            );
          } else if (targetCurrency === "CAD") {
            // Use target amount if target is CAD
            cadEquivalentAmount = new Decimal(
              targetAmountStr.replace(/[^\d.-]/g, "")
            );
          } else if (sourceCurrency === "CAD") {
            // Use source amount if source is CAD
            cadEquivalentAmount = new Decimal(
              sourceAmountStr.replace(/[^\d.-]/g, "")
            );
          } else if (sourceCurrency === "USD") {
            // Convert USD source amount to CAD
            const sourceAmount = new Decimal(
              sourceAmountStr.replace(/[^\d.-]/g, "")
            );
            if (!sourceAmount.isFinite()) {
              console.warn(
                `[Parse] Skipping Wise row ${
                  index + 2
                }: Invalid USD source amount format.`
              );
              return;
            }
            cadEquivalentAmount = sourceAmount.mul(USDCAD_RATE);
            console.log(
              `[Parse] Row ${
                index + 2
              }: Converted USD to CAD using rate ${USDCAD_RATE}. Base CAD value: ${cadEquivalentAmount.toFixed(
                2
              )}`
            );
          } else {
            console.log(
              `[Parse] Skipping Wise row ${
                index + 2
              }: No direct CAD or USD source/target. (${sourceCurrency} -> ${targetCurrency})`
            );
            return;
          }

          // Ensure we have a valid positive amount before applying direction
          if (cadEquivalentAmount === null || !cadEquivalentAmount.isFinite()) {
            console.warn(
              `[Parse] Skipping Wise row ${
                index + 2
              }: CAD equivalent calculation failed.`
            );
            return;
          }
          // Make sure it's positive before applying direction sign
          cadEquivalentAmount = cadEquivalentAmount.abs();

          // --- Apply Sign based ONLY on Direction ---
          const finalCadAmount =
            direction === "OUT"
              ? cadEquivalentAmount.negated()
              : cadEquivalentAmount;

          // Construct description safely
          let description = "";
          const sourceName = sourceNameHeader
            ? row[sourceNameHeader] ?? ""
            : "";
          const targetName = targetNameHeader
            ? row[targetNameHeader] ?? ""
            : "";
          const reference = referenceHeader ? row[referenceHeader] ?? "" : "";
          if (sourceName && targetName)
            description = `${sourceName} -> ${targetName}`;
          else if (sourceName) description = sourceName;
          else if (targetName) description = targetName;
          if (reference) description += ` (${reference})`;
          description = description.trim() || "Wise Transaction";

          transactions.push({
            date: date,
            description: description,
            amount: finalCadAmount,
            balance: null,
          });
        } catch (rowError) {
          console.error(
            `[Parse] Error processing Wise row ${index + 2}:`,
            rowError,
            `Row data: ${JSON.stringify(row)}`
          );
        }
      });
    } else if (isOriginalFormat) {
      console.log("[Parse] Detected Original Format");
      // For simplicity, keep the original forEach here unless async needed
      const findHeader = (possibleNames: string[]) =>
        headers.find((h) =>
          possibleNames.some((n) => n.toLowerCase() === h.toLowerCase())
        );
      const dateHeader = findHeader(["date", "transaction date"]);
      const descriptionHeader = findHeader(["description"]);
      const amountHeader = findHeader(["amount", "value"]);
      const balanceHeader = findHeader(["balance", "running balance"]);

      if (!dateHeader || !descriptionHeader || !amountHeader) {
        throw new Error(
          "Missing required CSV headers for original format (date, description, amount)."
        );
      }
      result.data.forEach((row, index) => {
        try {
          if (index === 0) {
            console.log(
              `[Debug][Original] First Row Data -> Date Str: ${row[dateHeader]}, Desc Str: ${row[descriptionHeader]}, Amount Str: ${row[amountHeader]}`
            );
          }
          const dateStr = row[dateHeader];
          const amountStr = row[amountHeader];
          const descriptionStr = row[descriptionHeader];
          const balanceStr = balanceHeader ? row[balanceHeader] : undefined;

          if (!dateStr || !amountStr || !descriptionStr) {
            console.warn(
              `[Parse][Original] Skipping row ${
                index + 2
              }: Missing required fields.`
            );
            return;
          }
          const date = new Date(dateStr);
          const amount = new Decimal(amountStr.replace(/[^\d.-]/g, ""));
          const balance = balanceStr
            ? new Decimal(balanceStr.replace(/[^\d.-]/g, ""))
            : null;

          if (isNaN(date.getTime()) || !amount.isFinite()) {
            console.warn(
              `[Parse][Original] Skipping row ${
                index + 2
              }: Invalid date or amount format.`
            );
            return;
          }
          transactions.push({
            date: date,
            description: descriptionStr,
            amount: amount,
            balance: balance,
          });
        } catch (rowError) {
          console.error(
            `[Parse][Original] Error processing row ${index + 2}:`,
            rowError,
            `Row data: ${JSON.stringify(row)}`
          );
        }
      });
    } else {
      console.error(
        "[Parse] Could not detect known CSV format based on headers.",
        headers
      );
      throw new Error("Unknown or unsupported CSV format.");
    }
  } catch (error) {
    console.error("Error parsing transactions from CSV:", error);
    if (error instanceof Error) throw error;
    throw new Error("Failed to parse transactions from CSV");
  }
  console.log(
    `[Parse] Finished parsing. Extracted ${transactions.length} valid transactions.`
  );
  return transactions;
}
