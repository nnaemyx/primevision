"use client";
import { useParams } from "next/navigation";
import { Star, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { CopyTrader } from "@/lib/types";
import api from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

const MOCK_PERF = [
  { month: "Jan", value: 420 }, { month: "Feb", value: 510 }, { month: "Mar", value: 480 },
  { month: "Apr", value: 600 }, { month: "May", value: 650 }, { month: "Jun", value: 720 },
  { month: "Jul", value: 780 }, { month: "Aug", value: 880 }, { month: "Sep", value: 880 },
  { month: "Oct", value: 920 }, { month: "Nov", value: 960 }, { month: "Dec", value: 1000 },
];

const MOCK_TRADER: CopyTrader = {
  _id: "1",
  name: "Alexander Mahone",
  avatar: "/images/trader-avatar.jpg",
  bio: "",
  copiers: 129,
  roi30d: 89,
  roi2y: 86,
  totalProfit: 773390,
  winRatio: 58,
  avgRiskScore: 5,
  profitableWeeks: 58,
  rating: 5,
  totalGains: 89850,
  totalLoss: 0,
  totalFollowers: 56,
  minAccountThreshold: 5998,
  currentPositions: 8,
  activeSince: "March 14, 25",
  performanceData: MOCK_PERF,
  topTrades: [],
};

const MARKETS = ["crypto", "stocks", "futures"] as const;
const SIDES = ["long", "short"] as const;

const PRESET_TRADES = [
  { symbol: "BTC/USD", side: "long" as const, market: "crypto" as const, entry: 67450, targetRoi: 18.5, label: "BTC/USD Bullish Continuation" },
  { symbol: "ETH/USDT", side: "long" as const, market: "crypto" as const, entry: 3480, targetRoi: 22.0, label: "ETH/USDT Momentum Buy" },
  { symbol: "NVDA", side: "long" as const, market: "stocks" as const, entry: 138, targetRoi: 14.5, label: "NVDA Tech Swing Long" },
  { symbol: "Gold (XAU/USD)", side: "long" as const, market: "futures" as const, entry: 2710, targetRoi: 16.0, label: "Gold Safe Haven Long" },
];

export default function TraderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [copying, setCopying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [form, setForm] = useState({
    symbol: "BTC/USD",
    side: "long" as "long" | "short",
    market: "crypto" as "crypto" | "stocks" | "futures",
    amount: "500",
    entryPrice: "67450",
  });

  const { data: trader } = useQuery<CopyTrader>({
    queryKey: ["copy-trader", id],
    queryFn: async () => {
      const { data } = await api.get(`/copy-trading/${id}`);
      return data;
    },
    placeholderData: MOCK_TRADER,
  });

  const t = trader ?? MOCK_TRADER;
  const perfData = t.performanceData?.length ? t.performanceData : MOCK_PERF;

  const selectPreset = (index: number) => {
    setSelectedPreset(index);
    const p = PRESET_TRADES[index];
    setForm((prev) => ({
      ...prev,
      symbol: p.symbol,
      side: p.side,
      market: p.market,
      entryPrice: p.entry.toString(),
    }));
  };

  const handleCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setCopying(true);
    try {
      await api.post(`/copy-trading/copy/${id}`, {
        symbol: form.symbol,
        side: form.side,
        market: form.market,
        amount: parseFloat(form.amount),
        entryPrice: form.entryPrice ? parseFloat(form.entryPrice) : 0,
      });
      toast.success(`Exact trade copied from ${t.name}! Position is active and tracking profit.`);
      setShowForm(false);
    } catch {
      toast.error("Failed to copy trader");
    } finally {
      setCopying(false);
    }
  };

  const inputStyle = "bg-[rgba(14,14,82,0.6)] border text-white rounded-[12px] focus-visible:ring-1 focus-visible:ring-[#e9d758] placeholder:text-[#cdcacc]";
  const borderStyle = { borderColor: "rgba(255,255,255,0.15)" };

  return (
    <div className="flex flex-col gap-5 max-w-[1400px]">
      {/* Back */}
      <Link href="/dashboard/copy-trading" className="flex items-center gap-2 text-sm text-[#cdcacc] hover:text-white w-fit">
        <ArrowLeft size={16} /> Back to Copy Trading
      </Link>

      {/* Trader header */}
      <div className="rounded-[20px] p-6 flex items-center justify-between" style={{ background: "#150578" }}>
        <div>
          <h1 className="text-xl font-bold text-white">{t.name}</h1>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill={i < t.rating ? "#e9d758" : "transparent"} style={{ color: "#e9d758" }} />
            ))}
          </div>
        </div>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full px-6 h-10 font-semibold"
          style={{ background: "#f5a623", color: "#fff" }}
        >
          {showForm ? "Cancel" : "Copy Trader"}
        </Button>
      </div>

      {/* Copy form */}
      {showForm && (
        <div className="rounded-[20px] p-6 flex flex-col gap-5" style={{ background: "#150578", border: "1px solid rgba(233,215,88,0.3)" }}>
          <div>
            <h3 className="text-base font-semibold text-white">Copy Trade Execution</h3>
            <p className="text-xs text-[#cdcacc] mt-1">
              Select one of {t.name}&apos;s live market positions to mirror into your portfolio. Your trade will execute at the exact entry price and generate transparent profit.
            </p>
          </div>

          <form onSubmit={handleCopy} className="flex flex-col gap-5">
            {/* Strategy Preset Selector */}
            <div>
              <Label className="text-[#cdcacc] text-xs font-semibold uppercase mb-2 block">
                Choose Strategy / Active Trade to Copy
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESET_TRADES.map((preset, idx) => {
                  const isSelected = selectedPreset === idx;
                  return (
                    <button
                      key={preset.symbol}
                      type="button"
                      onClick={() => selectPreset(idx)}
                      className="p-3.5 rounded-[14px] text-left transition-all border flex flex-col justify-between"
                      style={{
                        background: isSelected ? "rgba(233,215,88,0.12)" : "rgba(14,14,82,0.6)",
                        borderColor: isSelected ? "#e9d758" : "rgba(255,255,255,0.1)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>
                          {preset.symbol}
                        </span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                          style={{
                            background: preset.side === "long" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                            color: preset.side === "long" ? "#10b981" : "#ef4444",
                          }}
                        >
                          {preset.side}
                        </span>
                      </div>
                      <p className="text-xs text-[#cdcacc] mt-1">{preset.label}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px]">
                        <span className="text-[#cdcacc]">Entry: ${preset.entry.toLocaleString()}</span>
                        <span className="text-[#10b981] font-semibold">Target: +{preset.targetRoi}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Capital Allocation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-[#cdcacc] text-xs font-semibold uppercase">
                  Amount to Allocate ($)
                </Label>
                <div className="flex gap-1.5">
                  {[250, 500, 1000, 2500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, amount: amt.toString() }))}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[#cdcacc] transition-colors"
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                type="number"
                min="1"
                step="any"
                value={form.amount}
                onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                placeholder="Enter allocation amount (e.g. 500)"
                required
                className={inputStyle}
                style={borderStyle}
              />
            </div>

            {/* Exact Trade Breakdown Summary Box */}
            <div className="p-4 rounded-[16px] bg-[#060614]/40 border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#cdcacc]">Exact Trade Copied:</span>
                <span className="text-white font-bold">{form.symbol} ({form.side.toUpperCase()})</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#cdcacc]">Entry Price:</span>
                <span className="text-white font-medium" style={{ fontFamily: "Space Grotesk" }}>
                  ${parseFloat(form.entryPrice || "0").toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#cdcacc]">Allocated Investment:</span>
                <span className="text-[#e9d758] font-bold" style={{ fontFamily: "Space Grotesk" }}>
                  ${parseFloat(form.amount || "0").toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                <span className="text-[#cdcacc]">Projected Profit:</span>
                <span className="text-[#10b981] font-bold" style={{ fontFamily: "Space Grotesk" }}>
                  +${((parseFloat(form.amount || "0") * (PRESET_TRADES[selectedPreset]?.targetRoi || 18)) / 100).toFixed(2)} (+{PRESET_TRADES[selectedPreset]?.targetRoi || 18}%)
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={copying || !form.amount}
              className="rounded-full h-11 font-semibold text-sm transition-transform hover:scale-[1.01]"
              style={{ background: "#f5a623", color: "#fff" }}
            >
              {copying ? "Copying Exact Trade..." : "Confirm & Execute Exact Trade"}
            </Button>
          </form>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-transparent border-b w-full justify-start rounded-none gap-8 px-0 mb-5" style={{ borderBottomColor: "rgba(255,255,255,0.08)" }}>
          {["overview", "portfolio"].map((v) => (
            <TabsTrigger
              key={v}
              value={v}
              className="pb-3 px-0 rounded-none capitalize text-[#cdcacc] font-medium data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#f5a623] bg-transparent"
            >
              {v}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
            {/* Left */}
            <div className="flex flex-col gap-5">
              {/* Stats */}
              <div className="rounded-[20px] p-5" style={{ background: "#150578" }}>
                <div className="grid grid-cols-2 gap-5">
                  {[
                    { label: "Return YTD", sub: "PnL for the calender year", value: `${t.roi30d}%` },
                    { label: "Avg. Risk Score", sub: "Measure of risk", value: `${t.avgRiskScore}` },
                    { label: "Return 2Y", sub: "PnL since January 2026", value: `${t.roi2y}%` },
                    { label: "Profitable weeks", sub: "Recorded in Percentage", value: `${t.profitableWeeks}%` },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between p-3 rounded-[12px]" style={{ background: "rgba(14,14,82,0.5)" }}>
                      <div>
                        <p className="text-sm font-medium text-white">{s.label}</p>
                        <p className="text-xs text-[#cdcacc]">{s.sub}</p>
                      </div>
                      <span className="text-xl font-bold" style={{ color: "#e9d758", fontFamily: "Space Grotesk" }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance chart */}
              <div className="rounded-[20px] p-6" style={{ background: "#150578" }}>
                <h3 className="text-base font-semibold text-white mb-5">Performance</h3>
                <div style={{ height: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={perfData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: "#cdcacc", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#cdcacc", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#0e0e52", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }} />
                      <Line type="monotone" dataKey="value" stroke="#e9d758" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#e9d758" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right – About */}
            <div className="flex flex-col gap-5">
              <div className="rounded-[20px] p-6" style={{ background: "#150578" }}>
                <h3 className="text-base font-semibold text-white mb-3">About {t.name}</h3>
                <Separator style={{ background: "rgba(255,255,255,0.1)", marginBottom: "16px" }} />
                <div className="grid grid-cols-3 gap-y-5">
                  {[
                    { label: "Total Gains", value: `$${t.totalGains.toLocaleString()}` },
                    { label: "Total Loss", value: `$${t.totalLoss.toLocaleString()}` },
                    { label: "Total Followers", value: `${t.totalFollowers}` },
                    { label: "Min. Account Threshold", value: `$${t.minAccountThreshold.toLocaleString()}` },
                    { label: "Current Positions", value: `${t.currentPositions}` },
                    { label: "Active Since", value: t.activeSince, highlight: true },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-[#cdcacc] leading-snug mb-1">{item.label}</p>
                      <p className="text-sm font-semibold" style={{ color: item.highlight ? "#e9d758" : "#fff" }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[20px] p-6" style={{ background: "#150578" }}>
                <h3 className="text-base font-semibold text-white">Top traded by {t.name}</h3>
                {t.topTrades?.length === 0 && (
                  <p className="text-xs text-[#cdcacc] mt-3">No top trades data yet.</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="portfolio">
          <div className="rounded-[20px] p-10 text-center" style={{ background: "#150578" }}>
            <p className="text-[#cdcacc]">Portfolio details coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
