"use client";
import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { TrendingUp, TrendingDown, ArrowUpRight, Copy, CheckCircle2, Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyTrade, Trade } from "@/lib/types";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ExactTradesTableProps {
  copyTrades: CopyTrade[];
  manualTrades?: Trade[];
}

export default function ExactTradesTable({
  copyTrades = [],
  manualTrades = [],
}: ExactTradesTableProps) {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | "copied" | "pending" | "manual">("all");
  const [activatingId, setActivatingId] = useState<string | null>(null);

  const handleGoAhead = async (tradeId: string) => {
    setActivatingId(tradeId);
    try {
      const { data } = await api.post(`/copy-trading/go-ahead/${tradeId}`);
      toast.success(data?.message || "Trade activated! Live market execution has begun.");
      await qc.invalidateQueries({ queryKey: ["my-copied-trades"] });
      await qc.invalidateQueries({ queryKey: ["portfolio-balance"] });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to activate trade";
      toast.error(msg);
    } finally {
      setActivatingId(null);
    }
  };

  // Merge and normalize trades
  type UnifiedTrade = {
    id: string;
    symbol: string;
    trader: string;
    market: string;
    side: "long" | "short";
    amount: number;
    entryPrice: number;
    exitOrCurrentPrice: number;
    profit: number;
    roi: number;
    status: "pending" | "open" | "filled" | "cancelled";
    date: string;
    isCopy: boolean;
  };

  const unified: UnifiedTrade[] = [
    ...copyTrades.map((ct) => {
      const entry = ct.entryPrice || 1;
      const current = ct.closePrice || ct.currentPrice || entry;
      const pnl = ct.pnl ?? 0;
      const roi = ct.amount > 0 ? (pnl / ct.amount) * 100 : 0;
      return {
        id: ct._id,
        symbol: ct.symbol,
        trader: ct.traderName || "Expert Trader",
        market: ct.market,
        side: ct.side,
        amount: ct.amount,
        entryPrice: entry,
        exitOrCurrentPrice: current,
        profit: pnl,
        roi,
        status: ct.status,
        date: ct.createdAt,
        isCopy: true,
      };
    }),
    ...manualTrades.map((t) => {
      const entry = t.price || 1;
      const current = t.executionPrice || entry;
      const pnl = t.pnl ?? 0;
      const roi = t.amount > 0 ? (pnl / t.amount) * 100 : 0;
      return {
        id: t._id,
        symbol: t.symbol,
        trader: "Self Executed",
        market: t.market,
        side: t.side,
        amount: t.amount,
        entryPrice: entry,
        exitOrCurrentPrice: current,
        profit: pnl,
        roi,
        status: t.status,
        date: t.createdAt,
        isCopy: false,
      };
    }),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filtered = unified.filter((t) => {
    if (filter === "copied") return t.isCopy;
    if (filter === "pending") return t.isCopy && t.status === "pending";
    if (filter === "manual") return !t.isCopy;
    return true;
  });

  const pendingCopies = copyTrades.filter((c) => c.status === "pending");
  const pendingCount = pendingCopies.length;

  const totalProfit = unified
    .filter((t) => t.status !== "pending")
    .reduce((acc, t) => acc + t.profit, 0);
  const winningTrades = unified.filter((t) => t.status !== "pending" && t.profit > 0).length;

  return (
    <div className="rounded-[20px] p-6 flex flex-col gap-5" style={{ background: "#150578" }}>
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-bold text-white">Exact Trades & Profit Breakdown</h3>
            <span
              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
              style={{ background: "rgba(233,215,88,0.15)", color: "#e9d758" }}
            >
              Live Positions
            </span>
          </div>
          <p className="text-xs text-[#cdcacc] mt-1">
            Exact market trades taken on your behalf and the precise profit made from each trade.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 bg-[#060614]/40 p-1 rounded-full w-fit flex-wrap">
          {[
            { id: "all", label: `All (${unified.length})` },
            { id: "copied", label: `Copied Trades (${copyTrades.length})` },
            ...(pendingCount > 0
              ? [{ id: "pending" as const, label: `Awaiting Go Ahead (${pendingCount})` }]
              : []),
            { id: "manual", label: `Manual (${manualTrades.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as "all" | "copied" | "pending" | "manual")}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: filter === tab.id ? "#e9d758" : "transparent",
                color: filter === tab.id ? "#060614" : "#cdcacc",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notice Banner for Pending Decided-Later Trades */}
      {pendingCount > 0 && filter !== "pending" && (
        <div
          className="p-3.5 rounded-[14px] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
          style={{ background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.3)" }}
        >
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#f5a623] shrink-0" />
            <span className="text-[#cdcacc]">
              You have <strong className="text-white font-semibold">{pendingCount} copied trade{pendingCount > 1 ? "s" : ""}</strong> awaiting your Go Ahead. They are saved in your copied trades below and will execute once you click Go Ahead.
            </span>
          </div>
          <button
            onClick={() => setFilter("pending")}
            className="text-xs font-bold text-[#e9d758] hover:underline shrink-0 text-left sm:text-right"
          >
            Show Awaiting Trades ({pendingCount}) →
          </button>
        </div>
      )}

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-[14px] bg-[#060614]/30 border border-white/5">
          <p className="text-xs text-[#cdcacc]">Total Profit Made</p>
          <p
            className="text-lg font-bold mt-1"
            style={{
              color: totalProfit >= 0 ? "#10b981" : "#ef4444",
              fontFamily: "Space Grotesk",
            }}
          >
            {totalProfit >= 0 ? "+" : ""}${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="p-3.5 rounded-[14px] bg-[#060614]/30 border border-white/5">
          <p className="text-xs text-[#cdcacc]">Winning Trades</p>
          <p className="text-lg font-bold text-white mt-1" style={{ fontFamily: "Space Grotesk" }}>
            {winningTrades} / {unified.length}
          </p>
        </div>

        <div className="p-3.5 rounded-[14px] bg-[#060614]/30 border border-white/5">
          <p className="text-xs text-[#cdcacc]">Active Copied Trades</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-lg font-bold text-[#e9d758]" style={{ fontFamily: "Space Grotesk" }}>
              {copyTrades.filter((c) => c.status === "open").length}
            </span>
            {pendingCount > 0 && (
              <span className="text-[11px] font-semibold text-[#f5a623]">
                (+{pendingCount} on hold)
              </span>
            )}
          </div>
        </div>

        <div className="p-3.5 rounded-[14px] bg-[#060614]/30 border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#cdcacc]">Copy Top Traders</p>
            <p className="text-xs font-semibold text-white mt-1">Earn automatically</p>
          </div>
          <Link
            href="/dashboard/copy-trading"
            className="w-8 h-8 rounded-full bg-[#e9d758] flex items-center justify-center text-[#060614] hover:scale-105 transition-transform"
          >
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Trades Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-[#cdcacc] bg-white/[0.02] rounded-[16px] border border-white/5">
          <Copy size={36} className="opacity-40 mb-3 text-[#e9d758]" />
          <p className="text-sm font-semibold text-white">No trades taken yet</p>
          <p className="text-xs text-[#cdcacc] max-w-sm mt-1">
            When you copy an expert trader or place an order, your exact trades, entry price, and exact profits made will appear right here.
          </p>
          <Link
            href="/dashboard/copy-trading"
            className="mt-4 px-5 py-2 rounded-full font-semibold text-xs flex items-center gap-1.5 transition-all hover:scale-105"
            style={{ background: "#f5a623", color: "#fff" }}
          >
            Browse Expert Copy Traders
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[16px] border border-white/5">
          <table className="w-full text-left text-xs">
            <thead>
              <tr
                className="text-[#cdcacc] font-medium uppercase tracking-wider"
                style={{ background: "rgba(6,6,20,0.5)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <th className="py-3 px-4">Asset / Symbol</th>
                <th className="py-3 px-4">Trader / Strategy</th>
                <th className="py-3 px-4">Side</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Entry Price</th>
                <th className="py-3 px-4">Current / Close</th>
                <th className="py-3 px-4">Exact Profit Made</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((t) => {
                const isProfitable = t.profit >= 0;
                const isPending = t.status === "pending";
                return (
                  <tr key={t.id} className="hover:bg-white/[0.03] transition-colors">
                    {/* Symbol */}
                    <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                      <span style={{ fontFamily: "Space Grotesk" }}>{t.symbol}</span>
                      <span className="text-[10px] text-[#cdcacc]/60 uppercase">{t.market}</span>
                    </td>

                    {/* Trader */}
                    <td className="py-3.5 px-4 text-[#cdcacc]">
                      <div className="flex items-center gap-1.5">
                        {t.isCopy && (
                          <span
                            className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                            style={{ background: "#e9d758", color: "#060614" }}
                          >
                            C
                          </span>
                        )}
                        <span className="font-medium text-white">{t.trader}</span>
                      </div>
                    </td>

                    {/* Side */}
                    <td className="py-3.5 px-4">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit"
                        style={{
                          background: t.side === "long" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                          color: t.side === "long" ? "#10b981" : "#ef4444",
                        }}
                      >
                        {t.side === "long" ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {t.side}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-white font-medium" style={{ fontFamily: "Space Grotesk" }}>
                      ${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Entry Price */}
                    <td className="py-3.5 px-4 text-[#cdcacc]" style={{ fontFamily: "Space Grotesk" }}>
                      ${t.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Current / Close Price */}
                    <td className="py-3.5 px-4 text-white font-medium" style={{ fontFamily: "Space Grotesk" }}>
                      ${t.exitOrCurrentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Exact Profit Made */}
                    <td className="py-3.5 px-4">
                      {isPending ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-xs text-[#cdcacc]">Pending Start</span>
                          <span className="text-[10px] text-[#cdcacc]/60">Awaiting Go Ahead</span>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span
                            className="font-bold text-sm"
                            style={{
                              color: isProfitable ? "#10b981" : "#ef4444",
                              fontFamily: "Space Grotesk",
                            }}
                          >
                            {isProfitable ? "+" : ""}${t.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span
                            className="text-[10px] font-medium"
                            style={{ color: isProfitable ? "#10b981" : "#ef4444" }}
                          >
                            {isProfitable ? "+" : ""}{t.roi.toFixed(2)}%
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize inline-flex items-center gap-1"
                        style={{
                          background:
                            t.status === "filled"
                              ? "rgba(16,185,129,0.15)"
                              : t.status === "open"
                              ? "rgba(16,185,129,0.15)"
                              : isPending
                              ? "rgba(233,215,88,0.15)"
                              : "rgba(239,68,68,0.15)",
                          color:
                            t.status === "filled"
                              ? "#10b981"
                              : t.status === "open"
                              ? "#10b981"
                              : isPending
                              ? "#e9d758"
                              : "#ef4444",
                        }}
                      >
                        {t.status === "filled" ? (
                          <>
                            <CheckCircle2 size={10} /> Profit Realized
                          </>
                        ) : t.status === "open" ? (
                          <>
                            <CheckCircle2 size={10} /> In Position
                          </>
                        ) : isPending ? (
                          <>
                            <Clock size={10} /> Awaiting Go Ahead
                          </>
                        ) : (
                          "Cancelled"
                        )}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4">
                      {isPending && t.isCopy ? (
                        <Button
                          size="sm"
                          disabled={activatingId === t.id}
                          onClick={() => handleGoAhead(t.id)}
                          className="rounded-full h-7 px-3 text-xs font-bold gap-1 shadow-sm transition-transform hover:scale-105"
                          style={{ background: "#f5a623", color: "#fff" }}
                        >
                          <Play size={10} fill="#fff" />
                          {activatingId === t.id ? "..." : "Go Ahead"}
                        </Button>
                      ) : (
                        <span className="text-[#cdcacc]/40 text-xs">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-[#cdcacc]/80 text-[11px]">
                      {format(new Date(t.date), "MMM d, HH:mm")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
