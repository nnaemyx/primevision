"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyTrade } from "@/lib/types";
import api from "@/lib/api";
import { toast } from "sonner";
import { Play, Clock, CheckCircle2, TrendingUp, TrendingDown, ShieldAlert } from "lucide-react";

interface CopiedTradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trade: CopyTrade | null;
  traderName?: string;
  onGoAheadSuccess?: (updatedTrade: CopyTrade) => void;
}

export default function CopiedTradeModal({
  open,
  onOpenChange,
  trade,
  traderName,
  onGoAheadSuccess,
}: CopiedTradeModalProps) {
  const [loading, setLoading] = useState(false);

  if (!trade) return null;

  const handleGoAhead = async () => {
    setLoading(true);
    try {
      const { data } = await api.post(`/copy-trading/go-ahead/${trade._id}`);
      toast.success(data?.message || "Trade activated! Live market trading has begun.");
      onGoAheadSuccess?.(data.copyTrade || { ...trade, status: "open" });
      onOpenChange(false);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to activate trade";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const isAlreadyOpen = trade.status === "open";
  const isFilled = trade.status === "filled";
  const displayTrader = traderName || trade.traderName || "Expert Trader";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          background: "#150578",
          border: "1px solid rgba(233,215,88,0.3)",
          color: "#fff",
          maxWidth: 480,
          borderRadius: 20,
        }}
        className="p-6"
      >
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
              style={{ background: "#e9d758", color: "#060614" }}
            >
              C
            </span>
            <DialogTitle className="text-lg font-bold text-white">
              {isAlreadyOpen ? "Active Copied Trade" : "Trade Copied — Ready for Execution"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-[#cdcacc] leading-relaxed">
            {isAlreadyOpen
              ? `This trade copied from ${displayTrader} is currently running in the live market.`
              : `You have successfully copied ${displayTrader}'s position. It will not start trading until you click Go Ahead.`}
          </DialogDescription>
        </DialogHeader>

        {/* Trade Information Breakdown */}
        <div className="flex flex-col gap-3 my-4">
          <div
            className="p-4 rounded-[16px] flex flex-col gap-2.5"
            style={{ background: "rgba(6,6,20,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Asset & Side */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#cdcacc]">Asset / Trader</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-base font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>
                    {trade.symbol}
                  </span>
                  <span className="text-[10px] text-[#cdcacc]/70 uppercase px-1.5 py-0.5 rounded bg-white/5">
                    {trade.market}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#cdcacc]">Position Side</p>
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase px-2 py-0.5 rounded-full mt-0.5"
                  style={{
                    background: trade.side === "long" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                    color: trade.side === "long" ? "#10b981" : "#ef4444",
                  }}
                >
                  {trade.side === "long" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {trade.side}
                </span>
              </div>
            </div>

            <div className="border-t border-white/5 my-0.5" />

            {/* Entry Price & Amount */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#cdcacc] text-[11px]">Entry Price:</span>
                <p className="text-sm font-semibold text-white mt-0.5" style={{ fontFamily: "Space Grotesk" }}>
                  ${Number(trade.entryPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <span className="text-[#cdcacc] text-[11px]">Allocated Capital:</span>
                <p className="text-sm font-semibold text-[#e9d758] mt-0.5" style={{ fontFamily: "Space Grotesk" }}>
                  ${Number(trade.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="border-t border-white/5 my-0.5" />

            {/* Execution Status */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#cdcacc]">Execution Status:</span>
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                style={{
                  background:
                    trade.status === "open"
                      ? "rgba(16,185,129,0.15)"
                      : trade.status === "filled"
                      ? "rgba(16,185,129,0.15)"
                      : "rgba(233,215,88,0.15)",
                  color:
                    trade.status === "open"
                      ? "#10b981"
                      : trade.status === "filled"
                      ? "#10b981"
                      : "#e9d758",
                }}
              >
                {trade.status === "open" ? (
                  <>
                    <CheckCircle2 size={12} /> In Position (Live)
                  </>
                ) : trade.status === "filled" ? (
                  <>
                    <CheckCircle2 size={12} /> Realized Profit
                  </>
                ) : (
                  <>
                    <Clock size={12} /> Awaiting Go Ahead
                  </>
                )}
              </span>
            </div>
          </div>

          {!isAlreadyOpen && !isFilled && (
            <div
              className="p-3 rounded-[12px] flex items-start gap-2 text-xs"
              style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.2)" }}
            >
              <ShieldAlert size={16} className="text-[#f5a623] shrink-0 mt-0.5" />
              <p className="text-[#cdcacc]">
                This trade will not read or execute market orders automatically. Click <strong className="text-white">Go Ahead</strong> below when you are ready to start live trading.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-full text-xs text-[#cdcacc] hover:text-white hover:bg-white/5"
          >
            {isAlreadyOpen || isFilled ? "Close" : "Decide Later"}
          </Button>

          {!isAlreadyOpen && !isFilled && (
            <Button
              type="button"
              disabled={loading}
              onClick={handleGoAhead}
              className="rounded-full px-6 h-10 font-bold text-xs gap-1.5 transition-transform hover:scale-105"
              style={{ background: "#f5a623", color: "#fff" }}
            >
              {loading ? (
                "Activating..."
              ) : (
                <>
                  <Play size={14} fill="#fff" /> Go Ahead
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
