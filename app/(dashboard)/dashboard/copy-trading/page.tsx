"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import TraderCard from "@/components/copy-trading/TraderCard";
import { CopyTrader, CopyTrade } from "@/lib/types";
import api from "@/lib/api";
import { format } from "date-fns";
import { toast } from "sonner";
import { Play, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import CopiedTradeModal from "@/components/copy-trading/CopiedTradeModal";

const MOCK_TRADERS: CopyTrader[] = Array.from({ length: 6 }, (_, i) => ({
  _id: `mock-${i}`,
  name: "Alexander Mahone",
  avatar: "/images/trader-avatar.jpg",
  bio: "",
  copiers: 129,
  roi30d: 73,
  roi2y: 86,
  totalProfit: 773390,
  winRatio: 92,
  avgRiskScore: 5,
  profitableWeeks: 58,
  rating: 5,
  totalGains: 89850,
  totalLoss: 0,
  totalFollowers: 56,
  minAccountThreshold: 5998,
  currentPositions: 8,
  activeSince: "March 14, 25",
  performanceData: [],
  topTrades: [],
}));

const statusColor: Record<string, { bg: string; text: string }> = {
  pending: { bg: "rgba(233,215,88,0.15)", text: "#e9d758" },
  open: { bg: "rgba(16,185,129,0.15)", text: "#10b981" },
  filled: { bg: "rgba(16,185,129,0.15)", text: "#10b981" },
  cancelled: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
};

export default function CopyTradingPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("top");
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<CopyTrade | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: traders, isLoading } = useQuery<CopyTrader[]>({
    queryKey: ["copy-traders"],
    queryFn: async () => {
      const { data } = await api.get("/copy-trading");
      return data;
    },
  });

  const { data: myCopies = [], isLoading: copiesLoading } = useQuery<CopyTrade[]>({
    queryKey: ["my-copied-trades"],
    queryFn: async () => {
      const { data } = await api.get("/copy-trading/my-copies");
      return data;
    },
  });

  const handleGoAhead = async (tradeId: string) => {
    setActivatingId(tradeId);
    try {
      const { data } = await api.post(`/copy-trading/go-ahead/${tradeId}`);
      toast.success(data?.message || "Trade activated! Live trading has begun.");
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

  const list = traders?.length ? traders : MOCK_TRADERS;
  const pendingCopies = myCopies.filter((c) => c.status === "pending");

  // Place pending trades at the top
  const sortedCopies = [...myCopies].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      {/* Banner */}
      <div
        className="relative rounded-[20px] overflow-hidden p-10 min-h-[180px] flex flex-col justify-center"
        style={{
          backgroundImage: "url(/images/bg-copy-trading.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(14,14,82,0.6)" }} />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-2">
            Copy Expert Strategies{" "}
            <br />
            and{" "}
            <span className="gradient-text-gold">Earn like a pro</span>
          </h1>
          <p className="text-sm text-[#cdcacc] max-w-lg">
            Follow the world&apos;s top Expert Traders and copy their trades in one click.
          </p>
        </div>
      </div>

      {/* Pending Decided-Later Banner */}
      {pendingCopies.length > 0 && (
        <div
          className="p-4 rounded-[16px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg"
          style={{
            background: "linear-gradient(135deg, rgba(245,166,35,0.18) 0%, rgba(233,215,88,0.1) 100%)",
            border: "1px solid rgba(233,215,88,0.35)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f5a623]/25 flex items-center justify-center shrink-0">
              <Clock size={20} className="text-[#e9d758]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {pendingCopies.length === 1
                  ? "You have 1 copied trade awaiting your Go Ahead"
                  : `You have ${pendingCopies.length} copied trades awaiting your Go Ahead`}
              </p>
              <p className="text-xs text-[#cdcacc] mt-0.5">
                These trades were copied and saved to your portfolio. They are on hold and will start live trading when you click &ldquo;Go Ahead&rdquo;.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setActiveTab("my-copies")}
            className="rounded-full px-5 h-9 text-xs font-bold gap-1 shrink-0 transition-transform hover:scale-105"
            style={{ background: "#f5a623", color: "#fff" }}
          >
            Review Copied Trades ({pendingCopies.length}) →
          </Button>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-transparent border-b w-full justify-start rounded-none gap-8 px-0 mb-6" style={{ borderBottomColor: "rgba(255,255,255,0.08)" }}>
          {[
            { value: "top", label: "Top Portfolios" },
            {
              value: "my-copies",
              label:
                pendingCopies.length > 0
                  ? `My Copied Trades (${myCopies.length}) • ${pendingCopies.length} Awaiting Go Ahead`
                  : `My Copied Trades${myCopies.length ? ` (${myCopies.length})` : ""}`,
            },
            { value: "favorites", label: "My Favorites" },
          ].map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="pb-3 px-0 rounded-none text-[#cdcacc] text-base font-medium data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#f5a623] bg-transparent"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Top Portfolios */}
        <TabsContent value="top">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-[20px]" style={{ background: "#150578" }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {list.map((trader) => {
                const existingTrade = myCopies.find((c) => {
                  const traderId = typeof c.trader === "string" ? c.trader : c.trader?._id;
                  return traderId === trader._id && (c.status === "pending" || c.status === "open");
                });
                return (
                  <TraderCard
                    key={trader._id}
                    trader={trader}
                    existingTrade={existingTrade}
                    onDecideLater={() => setActiveTab("my-copies")}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* My Copied Trades */}
        <TabsContent value="my-copies">
          {copiesLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-[16px]" style={{ background: "#150578" }} />
              ))}
            </div>
          ) : myCopies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#cdcacc]">
              <p className="text-base font-semibold text-white">No copied trades yet.</p>
              <p className="text-sm mt-1 text-[#cdcacc]/80">
                Go to &ldquo;Top Portfolios&rdquo;, choose an Expert Trader, and click &ldquo;Copy&rdquo; to start.
              </p>
              <Button
                onClick={() => setActiveTab("top")}
                className="mt-4 rounded-full px-5 h-9 text-xs font-semibold"
                style={{ background: "#f5a623", color: "#fff" }}
              >
                Browse Top Traders
              </Button>
            </div>
          ) : (
            <div className="rounded-[20px] overflow-hidden" style={{ background: "#150578" }}>
              {/* Table header */}
              <div
                className="grid gap-3 px-5 py-3.5 text-xs font-semibold text-[#cdcacc] uppercase"
                style={{ gridTemplateColumns: "1.2fr 1fr 80px 100px 100px 100px 110px 130px 110px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(6,6,20,0.5)" }}
              >
                <span>Trader Copied</span>
                <span>Exact Trade</span>
                <span>Side</span>
                <span>Allocated</span>
                <span>Entry Price</span>
                <span>Current Price</span>
                <span>Exact Profit</span>
                <span>Status</span>
                <span>Action</span>
              </div>
              {sortedCopies.map((ct) => {
                const isPending = ct.status === "pending";
                const pnl = ct.pnl ?? 0;
                const entry = ct.entryPrice || 0;
                const current = ct.closePrice || ct.currentPrice || entry;
                const roi = ct.amount > 0 ? (pnl / ct.amount) * 100 : 0;
                return (
                  <div
                    key={ct._id}
                    className="grid gap-3 px-5 py-4 items-center text-sm transition-colors hover:bg-white/5 cursor-pointer"
                    style={{
                      gridTemplateColumns: "1.2fr 1fr 80px 100px 100px 100px 110px 130px 110px",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      background: isPending ? "rgba(245,166,35,0.04)" : "transparent",
                    }}
                    onClick={() => {
                      setSelectedTrade(ct);
                      setModalOpen(true);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#e9d758] text-[#060614] flex items-center justify-center text-[10px] font-bold">C</span>
                      <span className="text-white font-medium truncate">{ct.traderName}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold" style={{ fontFamily: "Space Grotesk" }}>{ct.symbol}</p>
                      <p className="text-[10px] text-[#cdcacc]/60 uppercase">{ct.market}</p>
                    </div>
                    <span
                      className="text-xs font-bold capitalize px-2 py-0.5 rounded-full w-fit"
                      style={{
                        background: ct.side === "long" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                        color: ct.side === "long" ? "#10b981" : "#ef4444",
                      }}
                    >
                      {ct.side}
                    </span>
                    <span className="text-white font-medium" style={{ fontFamily: "Space Grotesk" }}>
                      ${ct.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[#cdcacc]" style={{ fontFamily: "Space Grotesk" }}>
                      ${entry.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-white font-medium" style={{ fontFamily: "Space Grotesk" }}>
                      ${current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <div>
                      {isPending ? (
                        <div>
                          <p className="font-semibold text-xs text-[#cdcacc]">Pending Start</p>
                          <p className="text-[10px] text-[#cdcacc]/60">Awaiting Go Ahead</p>
                        </div>
                      ) : (
                        <>
                          <p
                            className="font-bold text-sm"
                            style={{ color: pnl >= 0 ? "#10b981" : "#ef4444", fontFamily: "Space Grotesk" }}
                          >
                            {pnl >= 0 ? "+" : ""}${pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-[10px]" style={{ color: pnl >= 0 ? "#10b981" : "#ef4444" }}>
                            {pnl >= 0 ? "+" : ""}{roi.toFixed(2)}%
                          </p>
                        </>
                      )}
                    </div>
                    <span>
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize inline-flex items-center gap-1"
                        style={{
                          background:
                            ct.status === "filled"
                              ? "rgba(16,185,129,0.15)"
                              : ct.status === "open"
                              ? "rgba(16,185,129,0.15)"
                              : statusColor[ct.status]?.bg,
                          color:
                            ct.status === "filled"
                              ? "#10b981"
                              : ct.status === "open"
                              ? "#10b981"
                              : statusColor[ct.status]?.text,
                        }}
                      >
                        {ct.status === "filled" ? (
                          <>
                            <CheckCircle2 size={11} /> Profit Realized
                          </>
                        ) : ct.status === "open" ? (
                          <>
                            <CheckCircle2 size={11} /> In Position
                          </>
                        ) : (
                          <>
                            <Clock size={11} /> Awaiting Go Ahead
                          </>
                        )}
                      </span>
                    </span>
                    <div onClick={(e) => e.stopPropagation()}>
                      {isPending ? (
                        <Button
                          size="sm"
                          disabled={activatingId === ct._id}
                          onClick={() => handleGoAhead(ct._id)}
                          className="rounded-full h-7 px-3 text-xs font-bold gap-1 shadow-sm transition-transform hover:scale-105"
                          style={{ background: "#f5a623", color: "#fff" }}
                        >
                          <Play size={10} fill="#fff" />
                          {activatingId === ct._id ? "..." : "Go Ahead"}
                        </Button>
                      ) : (
                        <span className="text-[#cdcacc] text-xs">{format(new Date(ct.createdAt), "MMM d")}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Favorites */}
        <TabsContent value="favorites">
          <div className="flex flex-col items-center justify-center py-16 text-[#cdcacc]">
            <p className="text-base">No favorites yet. Copy a trader to see them here.</p>
          </div>
        </TabsContent>
      </Tabs>

      <CopiedTradeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        trade={selectedTrade}
        traderName={selectedTrade?.traderName}
        onGoAheadSuccess={() => {
          qc.invalidateQueries({ queryKey: ["my-copied-trades"] });
        }}
      />
    </div>
  );
}
