"use client";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyTrader } from "@/lib/types";
import api from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

export default function TraderCard({ trader }: { trader: CopyTrader }) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/copy-trading/copy/${trader._id}`);
      setCopied(true);
      toast.success(`Now copying ${trader.name}!`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={`/dashboard/copy-trading/${trader._id}`}>
      <div
        className="rounded-[20px] p-5 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-1 cursor-pointer"
        style={{ background: "#150578" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
            <Image
              src={trader.avatar || "/images/trader-avatar.jpg"}
              alt={trader.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{trader.name}</p>
            <p className="text-xs text-[#cdcacc]">{trader.copiers} Copiers</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "ROI (30D)", value: `${trader.roi30d}%` },
            { label: "Total Profit", value: `+${trader.totalProfit.toLocaleString()}` },
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
            disabled={loading || copied}
            onClick={handleCopy}
            className="rounded-full h-8 px-4 text-xs font-semibold"
            style={{ background: copied ? "#10b981" : "#f5a623", color: "#fff" }}
          >
            {loading ? "..." : copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>
    </Link>
  );
}
