"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { Trade } from "@/lib/types";
import { format } from "date-fns";
import { toast } from "sonner";

const statusColor: Record<string, { bg: string; text: string }> = {
  open: { bg: "rgba(233,215,88,0.15)", text: "#e9d758" },
  filled: { bg: "rgba(16,185,129,0.15)", text: "#10b981" },
  cancelled: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
};

export default function AdminTradesPage() {
  const qc = useQueryClient();

  const { data: trades = [], isLoading } = useQuery<(Trade & { user?: { name: string; email: string } })[]>({
    queryKey: ["admin-trades"],
    queryFn: async () => {
      const { data } = await api.get("/admin/trades");
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, pnl }: { id: string; status: string; pnl?: number }) => {
      const { data } = await api.put(`/admin/trades/${id}`, { status, pnl });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-trades"] });
      toast.success("Trade updated");
    },
    onError: () => toast.error("Failed to update trade"),
  });

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-white">Trade Management</h2>

      <div className="rounded-[20px] overflow-hidden" style={{ background: "#150578" }}>
        <Table>
          <TableHeader>
            <TableRow style={{ borderBottomColor: "rgba(255,255,255,0.08)" }}>
              {["Date", "User", "Symbol", "Market", "Side", "Amount", "Status", "PnL", "Actions"].map((h) => (
                <TableHead key={h} className="text-[#cdcacc] text-sm font-medium py-4">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <TableRow key={i} style={{ borderBottomColor: "rgba(255,255,255,0.04)" }}>
                    {[...Array(9)].map((_, j) => (
                      <TableCell key={j} className="py-4">
                        <Skeleton className="h-4 w-16" style={{ background: "rgba(255,255,255,0.05)" }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : trades.map((trade) => (
                  <TableRow key={trade._id} style={{ borderBottomColor: "rgba(255,255,255,0.04)" }}>
                    <TableCell className="text-[#cdcacc] text-xs py-4">
                      {format(new Date(trade.createdAt), "MMM d")}
                    </TableCell>
                    <TableCell className="text-white text-sm py-4">{trade.user?.name ?? "—"}</TableCell>
                    <TableCell className="text-white text-sm py-4 font-medium">{trade.symbol}</TableCell>
                    <TableCell className="text-[#cdcacc] text-sm py-4 capitalize">{trade.market}</TableCell>
                    <TableCell className="py-4">
                      <span className="text-xs font-medium capitalize" style={{ color: trade.side === "long" ? "#10b981" : "#ef4444" }}>
                        {trade.side}
                      </span>
                    </TableCell>
                    <TableCell className="text-white text-sm py-4" style={{ fontFamily: "Space Grotesk" }}>
                      ${trade.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize" style={{ background: statusColor[trade.status]?.bg, color: statusColor[trade.status]?.text }}>
                        {trade.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-sm" style={{ color: (trade.pnl ?? 0) >= 0 ? "#10b981" : "#ef4444", fontFamily: "Space Grotesk" }}>
                      {(trade.pnl ?? 0) >= 0 ? "+" : ""}${(trade.pnl ?? 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="py-4">
                      {trade.status === "open" && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateMutation.mutate({ id: trade._id, status: "filled", pnl: trade.amount * 0.05 })}
                            className="text-xs px-2 py-1 rounded-full text-white"
                            style={{ background: "#10b981" }}
                          >
                            Fill
                          </button>
                          <button
                            onClick={() => updateMutation.mutate({ id: trade._id, status: "cancelled" })}
                            className="text-xs px-2 py-1 rounded-full text-white"
                            style={{ background: "#ef4444" }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {!isLoading && trades.length === 0 && (
          <p className="text-sm text-[#cdcacc] text-center py-10">No trades found</p>
        )}
      </div>
    </div>
  );
}
