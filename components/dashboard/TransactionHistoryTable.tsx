import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/lib/types";

const statusColor: Record<string, string> = {
  completed: "rgba(16,185,129,0.2)",
  pending: "rgba(233,215,88,0.2)",
  rejected: "rgba(239,68,68,0.2)",
};
const statusText: Record<string, string> = {
  completed: "#10b981",
  pending: "#e9d758",
  rejected: "#ef4444",
};

export default function TransactionHistoryTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Transaction History</h3>
      {transactions.length === 0 ? (
        <p className="text-sm text-[#cdcacc] text-center py-8">No transactions yet</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow style={{ borderBottomColor: "rgba(255,255,255,0.08)" }}>
              {["Date", "Transaction Type", "Amount", "Status"].map((h) => (
                <TableHead key={h} className="text-[#cdcacc] text-sm font-medium">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx._id} style={{ borderBottomColor: "rgba(255,255,255,0.05)" }}>
                <TableCell className="text-white text-sm py-4">
                  {format(new Date(tx.createdAt), "dd-MM-yyyy")}
                </TableCell>
                <TableCell className="text-white text-sm capitalize py-4">{tx.type}</TableCell>
                <TableCell className="text-white text-sm py-4 font-medium" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  ${tx.amount.toLocaleString()}
                </TableCell>
                <TableCell className="py-4">
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full capitalize"
                    style={{
                      background: statusColor[tx.status] || "rgba(255,255,255,0.1)",
                      color: statusText[tx.status] || "#cdcacc",
                    }}
                  >
                    {tx.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
