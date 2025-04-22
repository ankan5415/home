"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AccountType } from "@prisma/client";
import TransactionsTable from "@/components/TransactionsTable";

interface AccountSummary {
  inflow: string;
  outflow: string;
}

interface TotalsSummary {
  inflow: string;
  outflow: string;
  net: string;
}

interface SummaryData {
  summary: Record<AccountType, AccountSummary>;
  totals: TotalsSummary;
}

interface TimeSeriesDataPoint {
  period: string;
  inflow: string;
  outflow: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  balance: string | null;
  accountType: AccountType;
}

const timePeriods = [
  { value: "month", label: "Monthly" },
  { value: "week", label: "Weekly" },
  { value: "quarter", label: "Quarterly" },
] as const;

type TimePeriod = (typeof timePeriods)[number]["value"];

const accountTypes = Object.values(AccountType);

export default function Home() {
  const { data: session, status } = useSession();
  const [uploadStatus, setUploadStatus] = useState<
    Record<
      string,
      { status: string; message: string; count?: number; total?: number }
    >
  >({});
  const [reprocessStatus, setReprocessStatus] = useState<{
    status: string;
    message: string;
  } | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("month");
  const [selectedAccounts, setSelectedAccounts] = useState<AccountType[]>([
    ...accountTypes,
  ]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesDataPoint[]>(
    []
  );
  const [timeSeriesLoading, setTimeSeriesLoading] = useState<boolean>(true);
  const [timeSeriesError, setTimeSeriesError] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState<boolean>(true);
  const [transactionsError, setTransactionsError] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const handleFileUpload =
    (account: string) => async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        const totalFiles = files.length;
        setUploadStatus((prev) => ({
          ...prev,
          [account]: {
            status: "uploading",
            message: `Uploading 1 of ${totalFiles}...`,
            count: 1,
            total: totalFiles,
          },
        }));

        for (let i = 0; i < totalFiles; i++) {
          const file = files[i];
          setUploadStatus((prev) => ({
            ...prev,
            [account]: {
              ...prev[account],
              status: "uploading",
              message: `Uploading ${i + 1} of ${totalFiles}: ${file.name}...`,
              count: i + 1,
            },
          }));

          console.log(
            `Uploading ${file.name} (${
              i + 1
            }/${totalFiles}) to ${account} account...`
          );

          const formData = new FormData();
          formData.append("file", file);
          formData.append("account", account);

          try {
            const response = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
              throw new Error(result.error || `Failed to upload ${file.name}`);
            }

            console.log("Upload successful:", result);
          } catch (error) {
            console.error("Upload error:", error);
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Upload failed. Please try again.";
            setUploadStatus((prev) => ({
              ...prev,
              [account]: {
                status: "error",
                message: `Error uploading ${file.name}: ${errorMessage}`,
                count: i + 1,
                total: totalFiles,
              },
            }));
            event.target.value = "";
            return;
          }
        }

        setUploadStatus((prev) => ({
          ...prev,
          [account]: {
            status: "success",
            message: `Successfully uploaded ${totalFiles} file(s).`,
            count: totalFiles,
            total: totalFiles,
          },
        }));
        event.target.value = "";
        fetchSummaryData();
        fetchTimeSeriesData();
        fetchTransactions(1);
      }
    };

  const handleReprocess = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete ALL existing transactions and reprocess everything from S3? This cannot be undone."
      )
    ) {
      return;
    }

    setReprocessStatus({
      status: "loading",
      message: "Starting reprocessing... Deleting old data...",
    });

    try {
      const response = await fetch("/api/reprocess", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Reprocessing failed");
      }

      setReprocessStatus({
        status: "success",
        message: result.message || "Reprocessing completed successfully.",
      });
      console.log("Reprocessing successful:", result);
      fetchSummaryData();
      fetchTimeSeriesData();
      fetchTransactions(1);
    } catch (error) {
      console.error("Reprocessing error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Reprocessing failed. Please try again.";
      setReprocessStatus({ status: "error", message: errorMessage });
    }
  };

  const fetchSummaryData = async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    console.log("Fetching summary data...");
    try {
      const response = await fetch("/api/transactions/summary");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch summary");
      }
      setSummaryData(data);
      console.log("Summary data fetched:", data);
    } catch (error) {
      console.error("Failed to fetch summary data:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      setSummaryError(message);
      setSummaryData(null);
    } finally {
      setSummaryLoading(false);
    }
  };

  const fetchTimeSeriesData = useCallback(async () => {
    setTimeSeriesLoading(true);
    setTimeSeriesError(null);
    console.log(
      `Fetching timeseries data for period: ${selectedPeriod}, accounts: ${
        selectedAccounts.join(",") || "ALL"
      }`
    );

    const accountsQueryParam =
      selectedAccounts.length === accountTypes.length
        ? "ALL"
        : selectedAccounts.join(",");
    const url = `/api/transactions/timeseries?period=${selectedPeriod}&accounts=${accountsQueryParam}`;

    try {
      const response = await fetch(url);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch timeseries data");
      }
      setTimeSeriesData(result.data);
      console.log("Timeseries data fetched:", result.data);
    } catch (error) {
      console.error("Failed to fetch timeseries data:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      setTimeSeriesError(message);
      setTimeSeriesData([]);
    } finally {
      setTimeSeriesLoading(false);
    }
  }, [selectedPeriod, selectedAccounts]);

  const fetchTransactions = useCallback(async (page: number) => {
    setTransactionsLoading(true);
    setTransactionsError(null);
    console.log(`Fetching transactions page: ${page}`);
    try {
      const response = await fetch(`/api/transactions?page=${page}&limit=20`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch transactions");
      }
      setTransactions(result.data);
      setCurrentPage(result.pagination.page);
      setTotalPages(result.pagination.totalPages);
      console.log("Transactions data fetched:", result);
    } catch (error) {
      console.error("Failed to fetch transactions data:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      setTransactionsError(message);
      setTransactions([]);
    } finally {
      setTransactionsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.email === "ankur.boyed@gmail.com"
    ) {
      fetchSummaryData();
      fetchTimeSeriesData();
      fetchTransactions(1);
    }
  }, [status, session]);

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.email === "ankur.boyed@gmail.com"
    ) {
      fetchTimeSeriesData();
    }
  }, [fetchTimeSeriesData, status, session]);

  const handleAccountSelectionChange = (account: AccountType) => {
    setSelectedAccounts((prev) =>
      prev.includes(account)
        ? prev.filter((a) => a !== account)
        : [...prev, account]
    );
  };

  const handleSelectAllAccounts = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      setSelectedAccounts([...accountTypes]);
    } else {
      setSelectedAccounts([]);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      fetchTransactions(newPage);
    }
  };

  if (status === "loading") {
    return <div className="text-center py-10 text-black">Loading...</div>;
  }

  if (status === "authenticated") {
    if (session.user?.email !== "ankur.boyed@gmail.com") {
      return (
        <div className="text-center py-10">
          <p className="mb-4">Access Denied.</p>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-white text-black border border-black rounded hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      );
    }

    const chartData = summaryData
      ? Object.entries(summaryData.summary).map(([account, data]) => ({
          name: account,
          Inflow: parseFloat(data.inflow),
          Outflow: parseFloat(data.outflow),
        }))
      : [];

    const timeSeriesChartData = timeSeriesData.map((d) => ({
      ...d,
      inflow: parseFloat(d.inflow),
      outflow: parseFloat(d.outflow),
    }));

    return (
      <div className="p-4 md:p-8 bg-white">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-black">
            Personal Finance Tracker
          </h1>
          <div>
            <span className="text-black">
              Welcome, {session.user?.name} ({session.user?.email})
            </span>
            <button
              onClick={() => signOut()}
              className="ml-4 px-4 py-2 bg-white text-black border border-black rounded hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-black">
              Upload Monthly Statements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {accountTypes.map((account) => (
                <div
                  key={account}
                  className="border border-black p-4 rounded bg-white"
                >
                  <h3 className="font-medium capitalize mb-2 text-black">
                    {account.toLowerCase()} Account
                  </h3>
                  <label
                    className="block mb-2 text-sm font-medium text-black"
                    htmlFor={`${account}-file-input`}
                  >
                    Upload file(s)
                  </label>
                  <input
                    className="block w-full text-sm text-black border border-black rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-100"
                    id={`${account}-file-input`}
                    type="file"
                    accept=".csv"
                    multiple
                    onChange={handleFileUpload(account)}
                  />
                  {uploadStatus[account] && (
                    <p
                      className={`mt-1 text-xs ${
                        uploadStatus[account].status === "error"
                          ? "text-black font-bold"
                          : "text-black"
                      }`}
                    >
                      {uploadStatus[account].message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-black">
                    CSV file(s) for {account.toLowerCase()}.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-black">
              Overall Summary
            </h2>
            {summaryLoading && <p className="text-black">Loading summary...</p>}
            {summaryError && (
              <p className="text-black font-bold">Error: {summaryError}</p>
            )}
            {summaryData && !summaryLoading && !summaryError && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 border border-black rounded bg-white">
                    <h3 className="text-lg font-medium text-black">
                      Total Inflow
                    </h3>
                    <p className="text-2xl font-bold text-black">
                      ${summaryData.totals.inflow}
                    </p>
                  </div>
                  <div className="p-4 border border-black rounded bg-white">
                    <h3 className="text-lg font-medium text-black">
                      Total Outflow
                    </h3>
                    <p className="text-2xl font-bold text-black">
                      ${summaryData.totals.outflow}
                    </p>
                  </div>
                  <div className="p-4 border border-black rounded bg-white">
                    <h3 className="text-lg font-medium text-black">
                      Net Total
                    </h3>
                    <p className="text-2xl font-bold text-black">
                      {parseFloat(summaryData.totals.net) >= 0 ? "$" : "-"}
                      {Math.abs(parseFloat(summaryData.totals.net)).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-black">
                    Inflow/Outflow per Account (All Time)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={chartData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                      <XAxis dataKey="name" stroke="black" />
                      <YAxis stroke="black" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid black",
                        }}
                        itemStyle={{ color: "black" }}
                        cursor={{ fill: "#eee" }}
                      />
                      <Legend wrapperStyle={{ color: "black" }} />
                      <Bar dataKey="Inflow" fill="#555" />
                      <Bar dataKey="Outflow" fill="#aaa" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-black">
              Inflow/Outflow Over Time
            </h2>
            <div className="flex flex-wrap gap-4 items-center mb-4">
              <div>
                <label
                  htmlFor="period-select"
                  className="block text-sm font-medium mb-1 text-black"
                >
                  Period:
                </label>
                <select
                  id="period-select"
                  value={selectedPeriod}
                  onChange={(e) =>
                    setSelectedPeriod(e.target.value as TimePeriod)
                  }
                  className="p-2 rounded border border-black bg-white text-black focus:ring-black focus:border-black"
                >
                  {timePeriods.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Accounts:
                </label>
                <div className="flex flex-wrap gap-x-4 gap-y-1 items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="select-all-accounts"
                      checked={selectedAccounts.length === accountTypes.length}
                      onChange={handleSelectAllAccounts}
                      className="w-4 h-4 text-black bg-white border-black rounded focus:ring-black focus:ring-offset-white"
                    />
                    <label
                      htmlFor="select-all-accounts"
                      className="ml-2 text-sm font-medium text-black"
                    >
                      All
                    </label>
                  </div>
                  {accountTypes.map((acc) => (
                    <div key={acc} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`account-${acc}`}
                        value={acc}
                        checked={selectedAccounts.includes(acc)}
                        onChange={() => handleAccountSelectionChange(acc)}
                        className="w-4 h-4 text-black bg-white border-black rounded focus:ring-black focus:ring-offset-white"
                      />
                      <label
                        htmlFor={`account-${acc}`}
                        className="ml-2 text-sm font-medium capitalize text-black"
                      >
                        {acc.toLowerCase()}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {timeSeriesLoading && (
              <p className="text-black">Loading timeseries data...</p>
            )}
            {timeSeriesError && (
              <p className="text-black font-bold">Error: {timeSeriesError}</p>
            )}
            {!timeSeriesLoading &&
              !timeSeriesError &&
              timeSeriesData.length === 0 && (
                <p className="text-black">No data available.</p>
              )}
            {!timeSeriesLoading &&
              !timeSeriesError &&
              timeSeriesData.length > 0 && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={timeSeriesChartData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="period" stroke="black" />
                    <YAxis stroke="black" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid black",
                      }}
                      itemStyle={{ color: "black" }}
                      cursor={{ fill: "#eee" }}
                    />
                    <Legend wrapperStyle={{ color: "black" }} />
                    <Bar dataKey="inflow" name="Inflow" fill="#555" />
                    <Bar dataKey="outflow" name="Outflow" fill="#aaa" />
                  </BarChart>
                </ResponsiveContainer>
              )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-black">
              Recent Transactions
            </h2>
            <TransactionsTable
              transactions={transactions}
              isLoading={transactionsLoading}
              error={transactionsError}
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-black">
              Data Management
            </h2>
            <button
              onClick={handleReprocess}
              disabled={reprocessStatus?.status === "loading"}
              className="px-4 py-2 bg-white text-black border border-black rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reprocessStatus?.status === "loading"
                ? "Reprocessing..."
                : "Drop & Reprocess All Data"}
            </button>
            {reprocessStatus && (
              <p
                className={`mt-2 text-sm ${
                  reprocessStatus.status === "error"
                    ? "text-black font-bold"
                    : "text-black"
                }`}
              >
                {reprocessStatus.message}
              </p>
            )}
            <p className="mt-1 text-xs text-black">
              Deletes all transactions and re-imports from all CSV files in S3.
            </p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="text-center py-10">
      <h1 className="text-2xl font-bold mb-4">Personal Finance Tracker</h1>
      <p className="mb-4">Please sign in with your Google account.</p>
      <button
        onClick={() => signIn("google")}
        className="px-6 py-2 bg-white text-black border border-black rounded hover:bg-gray-100 flex items-center gap-2 mx-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 488 512"
          fill="black"
        >
          {/*!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.*/}
          <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
        </svg>
        Sign in with Google
      </button>
    </div>
  );
}
