"use client";

import React from "react";
import { AccountType } from "@prisma/client";

// Define the structure of a transaction object expected by the table
interface Transaction {
  id: string;
  date: string; // Comes as string from API
  description: string;
  amount: string; // Comes as string
  balance: string | null; // Comes as string or null
  accountType: AccountType;
  // Add other fields if needed
}

// Define the props for the component
interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

// Utility function to format date string (optional)
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString; // Return original if parsing fails
  }
};

// The Table Component
const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
}) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={5} className="text-center py-10 text-black">
            Loading transactions...
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={5} className="text-center py-10 text-black">
            Error loading transactions: {error}
          </td>
        </tr>
      );
    }

    if (transactions.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="text-center py-10 text-black">
            No transactions found.
          </td>
        </tr>
      );
    }

    return transactions.map((tx) => (
      <tr key={tx.id}>
        <td className="px-4 py-3 text-sm text-black whitespace-nowrap">
          {formatDate(tx.date)}
        </td>
        <td className="px-4 py-3 text-sm text-black">{tx.description}</td>
        <td className="px-4 py-3 text-sm text-black capitalize">
          {tx.accountType.toLowerCase()}
        </td>
        <td className="px-4 py-3 text-sm font-medium text-black whitespace-nowrap">
          {parseFloat(tx.amount) >= 0 ? "+" : "-"}$
          {Math.abs(parseFloat(tx.amount)).toFixed(2)}
        </td>
        <td className="px-4 py-3 text-sm text-black whitespace-nowrap">
          {tx.balance !== null ? `$${parseFloat(tx.balance).toFixed(2)}` : "-"}
        </td>
      </tr>
    ));
  };

  return (
    <div className="overflow-x-auto rounded border border-black bg-white">
      <table className="min-w-full divide-y divide-black">
        <thead className="bg-white">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
            >
              Account
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
            >
              Balance
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-black">
          {renderContent()}
        </tbody>
      </table>
      {/* Pagination Controls */}
      {!isLoading && !error && transactions.length > 0 && totalPages > 1 && (
        <div className="flex justify-between items-center px-4 py-3 bg-white border-t border-black">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 text-sm font-medium text-black bg-white border border-black rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-black">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 text-sm font-medium text-black bg-white border border-black rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
