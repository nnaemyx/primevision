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

export default function TraderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [copying, setCopying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    symbol: "BTC/USD",
    side: "long" as "long" | "short",
    market: "crypto" as "crypto" | "stocks" | "futures",
    amount: "",
    entryPrice: "",
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
      toast.success(`Now copying ${t.name}! Position added to your trades.`);
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
        <div className="rounded-[20px] p-6" style={{ background: "#150578", border: "1px solid rgba(233,215,88,0.25)" }}>
          <h3 className="text-base font-semibold text-white mb-4">Configure Copy Trade</h3>
          <form onSubmit={handleCopy} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#cdcacc] text-sm mb-1.5 block">Symbol (e.g. BTC/USD)</Label>
                <Input
                  value={form.symbol}
                  onChange={(e) => setForm((p) => ({ ...p, symbol: e.target.value }))}
                  placeholder="BTC/USD"
                  required
                  className={inputStyle}
                  style={borderStyle}
                />
              </div>
              <div>
                <Label className="text-[#cdcacc] text-sm mb-1.5 block">Amount ($)</Label>
                <Input
                  type="number"
                  min="1"
                  step="any"
                  value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                  placeholder="e.g. 500"
                  required
                  className={inputStyle}
                  style={borderStyle}
                />
              </div>
              <div>
                <Label className="text-[#cdcacc] text-sm mb-1.5 block">Entry Price (optional)</Label>
                <Input
                  type="number"
                  step="any"
                  value={form.entryPrice}
                  onChange={(e) => setForm((p) => ({ ...p, entryPrice: e.target.value }))}
                  placeholder="e.g. 43200"
                  className={inputStyle}
                  style={borderStyle}
                />
              </div>
              <div>
                <Label className="text-[#cdcacc] text-sm mb-1.5 block">Market</Label>
                <div className="flex gap-2">
                  {MARKETS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, market: m }))}
                      className="flex-1 py-2 rounded-[10px] text-xs font-medium capitalize transition-all"
                      style={{
                        background: form.market === m ? "#f5a623" : "rgba(14,14,82,0.6)",
                        color: form.market === m ? "#fff" : "#cdcacc",
                        border: `1px solid ${form.market === m ? "#f5a623" : "rgba(255,255,255,0.15)"}`,
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Side selector */}
            <div>
              <Label className="text-[#cdcacc] text-sm mb-1.5 block">Side</Label>
              <div className="flex gap-3">
                {SIDES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, side: s }))}
                    className="flex-1 py-2.5 rounded-[12px] text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: form.side === s
                        ? s === "long" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"
                        : "rgba(14,14,82,0.6)",
                      color: form.side === s
                        ? s === "long" ? "#10b981" : "#ef4444"
                        : "#cdcacc",
                      border: `1px solid ${form.side === s
                        ? s === "long" ? "#10b981" : "#ef4444"
                        : "rgba(255,255,255,0.15)"}`,
                    }}
                  >
                    {s === "long" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={copying}
              className="rounded-full h-10 font-semibold mt-1"
              style={{ background: "#f5a623", color: "#fff" }}
            >
              {copying ? "Placing Copy Trade..." : "Confirm Copy Trade"}
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
