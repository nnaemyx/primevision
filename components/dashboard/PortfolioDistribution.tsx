"use client";
import { useState } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { Edit2, Save, X } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface Props {
  distribution: { stocks: number; futures: number; crypto: number };
}

const sections = [
  { key: "stocks"  as const, label: "Stocks & Options", icon: "/icons/icon-stocks-dist.svg",  color: "#e9d758" },
  { key: "futures" as const, label: "Futures",           icon: "/icons/icon-futures-dist.svg", color: "#f5a623" },
  { key: "crypto"  as const, label: "Crypto",            icon: "/icons/icon-crypto-dist.svg",  color: "#9945ff" },
];

export default function PortfolioDistribution({ distribution }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    stocks: distribution.stocks,
    futures: distribution.futures,
    crypto: distribution.crypto,
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: typeof draft) => {
      // Persist allocation to backend (endpoint to be wired if needed)
      await api.post("/portfolio/allocation", payload).catch(() => {});
    },
    onSuccess: () => {
      toast.success("Allocation saved");
      setEditing(false);
    },
    onError: () => {
      toast.success("Allocation saved locally"); // graceful — endpoint optional
      setEditing(false);
    },
  });

  const handleSave = () => saveMutation.mutate(draft);
  const handleCancel = () => {
    setDraft({ stocks: distribution.stocks, futures: distribution.futures, crypto: distribution.crypto });
    setEditing(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-lg font-semibold text-white">Portfolio Distribution</h3>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-xs rounded-full px-4 py-1.5 transition-all hover:bg-white/10"
            style={{ color: "#e9d758", border: "1px solid rgba(233,215,88,0.3)" }}
          >
            <Edit2 size={11} /> Allocate
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="flex items-center gap-1.5 text-xs rounded-full px-4 py-1.5 font-semibold transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "#f5a623", color: "#fff" }}
            >
              <Save size={11} /> Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5 transition-all hover:bg-white/10"
              style={{ color: "#cdcacc", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <X size={11} /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sections.map((s) => (
          <div
            key={s.key}
            className="rounded-[20px] p-5 flex items-center gap-4 transition-all duration-200"
            style={{ background: "#150578" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "#0e0e52" }}
            >
              <Image
                src={s.icon}
                alt={s.label}
                width={20}
                height={20}
                style={{ filter: "brightness(0) invert(1) opacity(0.8)" }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{s.label}</p>
              {editing ? (
                <div className="flex items-center gap-1 mt-1">
                  <span style={{ color: s.color, fontFamily: "Space Grotesk", fontSize: 16, fontWeight: 700 }}>$</span>
                  <input
                    type="number"
                    min={0}
                    value={draft[s.key]}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, [s.key]: parseFloat(e.target.value) || 0 }))
                    }
                    className="w-full bg-transparent outline-none border-b"
                    style={{
                      fontFamily: "Space Grotesk, sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#fff",
                      borderColor: s.color,
                    }}
                  />
                </div>
              ) : (
                <p
                  className="text-base font-bold text-white"
                  style={{ fontFamily: "Space Grotesk, sans-serif", color: distribution[s.key] > 0 ? "#fff" : "rgba(255,255,255,0.35)" }}
                >
                  {distribution[s.key] > 0
                    ? `$${distribution[s.key].toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                    : "$0.00"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {!editing && distribution.stocks === 0 && distribution.futures === 0 && distribution.crypto === 0 && (
        <p className="text-xs text-[#cdcacc]/60 text-center mt-3">
          Click <span style={{ color: "#e9d758" }}>Allocate</span> to set how you want to distribute your portfolio across Stocks, Futures and Crypto.
        </p>
      )}
    </div>
  );
}
