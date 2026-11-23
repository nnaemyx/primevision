"use client";
import Link from "next/link";
import { Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyTrader, CopyTrade } from "@/lib/types";
import api from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import CopiedTradeModal from "@/components/copy-trading/CopiedTradeModal";

export default function TraderCard({ trader }: { trader: CopyTrader }) {
  const [loading, setLoading] = useState(false);
  const [copiedTrade, setCopiedTrade] = useState<CopyTrade | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCopyClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (copiedTrade) {
      setModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post(`/copy-trading/copy/${trader._id}`);
      const trade: CopyTrade = data.copyTrade;
      setCopiedTrade(trade);
      setModalOpen(true);
      toast.info(`Trade copied from ${trader.name}! Review and click Go Ahead to start.`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const isPending = copiedTrade && copiedTrade.status === "pending";
  const isOpen = copiedTrade && copiedTrade.status === "open";

  return (
    <>
      <Link href={`/dashboard/copy-trading/${trader._id}`}>
        <div
          className="rounded-[20px] p-5 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-1 cursor-pointer"
          style={{ background: "#150578" }}
        >
          {/* Header */}
          <div>
            <p className="text-sm font-semibold text-white">{trader.name}</p>
            <p className="text-xs text-[#cdcacc]">{trader.copiers} Copiers</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "ROI (30D)", value: `${trader.roi30d}%` },
              { label: "Win Ratio", value: `${trader.winRatio}%` },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xs text-[#cdcacc] mb-0.5">{s.label}</p>
                <p className="text-sm font-semibold" style={{ color: "#e9d758" }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.round(trader.rating) ? "#e9d758" : "transparent"}
                  style={{ color: "#e9d758" }}
                />
              ))}
            </div>
            <Button
              size="sm"
              disabled={loading}
              onClick={handleCopyClick}
              className="rounded-full h-8 px-4 text-xs font-semibold gap-1"
              style={{
                background: isOpen ? "#10b981" : isPending ? "#e9d758" : "#f5a623",
                color: isPending ? "#060614" : "#fff",
              }}
            >
              {loading ? (
                "..."
              ) : isOpen ? (
                "Trading Live"
              ) : isPending ? (
                <>
                  <Play size={12} fill="#060614" /> Go Ahead
                </>
              ) : (
                "Copy"
              )}
            </Button>
          </div>
        </div>
      </Link>

      <CopiedTradeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        trade={copiedTrade}
        traderName={trader.name}
        onGoAheadSuccess={(updated) => {
          setCopiedTrade(updated);
        }}
      />
    </>
  );
}
