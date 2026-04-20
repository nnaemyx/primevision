"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";
import { Transaction } from "@/lib/types";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";

const statusColor: Record<string, { bg: string; text: string }> = {
  completed: { bg: "rgba(16,185,129,0.15)", text: "#10b981" },
  pending: { bg: "rgba(233,215,88,0.15)", text: "#e9d758" },
  rejected: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
};

export default function AdminTransactionsPage() {
  const qc = useQueryClient();
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["admin-transactions", filterStatus, filterType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (filterType !== "all") params.set("type", filterType);
      const { data } = await api.get(`/admin/transactions?${params}`);
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.put(`/admin/transactions/${id}`, { status });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-transactions"] });
      toast.success("Transaction updated");
    },
    onError: () => toast.error("Failed to update transaction"),
  });

  const selectStyle = "bg-transparent border text-white rounded-[12px] h-9 text-sm";
  const selectBorderStyle = { borderColor: "rgba(255,255,255,0.2)", background: "#150578" };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold text-white">Transactions</h2>
        <div className="flex items-center gap-3">
          <Select value={filterType} onValueChange={(v) => setFilterType(v ?? "all")}>
            <SelectTrigger className={selectStyle} style={selectBorderStyle}>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent style={{ background: "#150578", border: "1px solid rgba(255,255,255,0.1)" }}>
              {["all", "deposit", "withdrawal"].map((v) => (
                <SelectItem key={v} value={v} className="text-white capitalize focus:bg-white/10">{v === "all" ? "All Types" : v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v ?? "all")}>
            <SelectTrigger className={selectStyle} style={selectBorderStyle}>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent style={{ background: "#150578", border: "1px solid rgba(255,255,255,0.1)" }}>
              {["all", "pending", "completed", "rejected"].map((v) => (
                <SelectItem key={v} value={v} className="text-white capitalize focus:bg-white/10">{v === "all" ? "All Status" : v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-[20px] overflow-hidden" style={{ background: "#150578" }}>
        <Table>
          <TableHeader>
            <TableRow style={{ borderBottomColor: "rgba(255,255,255,0.08)" }}>
              {["Date", "User", "Type", "Amount", "Method", "Status", "Actions"].map((h) => (
                <TableHead key={h} className="text-[#cdcacc] text-sm font-medium py-4">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <TableRow key={i} style={{ borderBottomColor: "rgba(255,255,255,0.04)" }}>
                    {[...Array(7)].map((_, j) => (
                      <TableCell key={j} className="py-4">
                        <Skeleton className="h-4 w-20" style={{ background: "rgba(255,255,255,0.05)" }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : transactions.map((tx) => {
                  const user = typeof tx.user === "object" ? tx.user : { name: "—", email: "" };
                  return (
                    <TableRow key={tx._id} style={{ borderBottomColor: "rgba(255,255,255,0.04)" }}>
                      <TableCell className="text-[#cdcacc] text-sm py-4">
                        {format(new Date(tx.createdAt), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell className="text-white text-sm py-4 font-medium">{user.name}</TableCell>
                      <TableCell className="py-4">
                        <span className="text-sm capitalize text-white">{tx.type}</span>
                      </TableCell>
                      <TableCell className="text-white text-sm py-4 font-medium" style={{ fontFamily: "Space Grotesk" }}>
                        ${tx.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-[#cdcacc] text-sm py-4">{tx.method}</TableCell>
                      <TableCell className="py-4">
                        <span
                          className="text-xs font-medium px-2.5 py-1 rounded-full capitalize"
                          style={{ background: statusColor[tx.status]?.bg, color: statusColor[tx.status]?.text }}
                        >
                          {tx.status}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        {tx.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateMutation.mutate({ id: tx._id, status: "completed" })}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-[#10b981] transition-colors"
                              title="Approve"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => updateMutation.mutate({ id: tx._id, status: "rejected" })}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-[#ef4444] transition-colors"
                              title="Reject"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
        {!isLoading && transactions.length === 0 && (
          <p className="text-sm text-[#cdcacc] text-center py-10">No transactions found</p>
        )}
      </div>
    </div>
  );
}
