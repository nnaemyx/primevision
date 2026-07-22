"use client";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import TraderCard from "@/components/copy-trading/TraderCard";
import { CopyTrader, CopyTrade } from "@/lib/types";
import api from "@/lib/api";
import { format } from "date-fns";

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
  open: { bg: "rgba(233,215,88,0.15)", text: "#e9d758" },
  filled: { bg: "rgba(16,185,129,0.15)", text: "#10b981" },
  cancelled: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
};

export default function CopyTradingPage() {
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

  const list = traders?.length ? traders : MOCK_TRADERS;

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

      {/* Tabs */}
      <Tabs defaultValue="top">
        <TabsList className="bg-transparent border-b w-full justify-start rounded-none gap-8 px-0 mb-6" style={{ borderBottomColor: "rgba(255,255,255,0.08)" }}>
          {[
            { value: "top", label: "Top Portfolios" },
            { value: "my-copies", label: `My Copied Trades${myCopies.length ? ` (${myCopies.length})` : ""}` },
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
              {list.map((trader) => (
                <TraderCard key={trader._id} trader={trader} />
              ))}
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
              <p className="text-base">No copied trades yet.</p>
              <p className="text-sm mt-1 opacity-60">Go to a trader&apos;s profile and click &ldquo;Copy Trader&rdquo; to get started.</p>
            </div>
          ) : (
            <div className="rounded-[20px] overflow-hidden" style={{ background: "#150578" }}>
              {/* Table header */}
              <div
                className="grid gap-3 px-5 py-3 text-xs font-medium text-[#cdcacc]"
                style={{ gridTemplateColumns: "1fr 1fr 80px 80px 100px 90px 80px 80px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span>Trader</span>
                <span>Symbol</span>
                <span>Side</span>
                <span>Market</span>
                <span>Amount</span>
                <span>PnL</span>
                <span>Status</span>
                <span>Date</span>
              </div>
              {myCopies.map((ct) => {
                const pnl = ct.pnl ?? 0;
                return (
                  <div
                    key={ct._id}
                    className="grid gap-3 px-5 py-4 items-center text-sm transition-colors hover:bg-white/5"
                    style={{ gridTemplateColumns: "1fr 1fr 80px 80px 100px 90px 80px 80px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <span className="text-white font-medium truncate">{ct.traderName}</span>
                    <span className="text-white font-medium" style={{ fontFamily: "Space Grotesk" }}>{ct.symbol}</span>
                    <span
                      className="text-xs font-semibold capitalize"
                      style={{ color: ct.side === "long" ? "#10b981" : "#ef4444" }}
                    >
                      {ct.side}
                    </span>
                    <span className="text-[#cdcacc] capitalize">{ct.market}</span>
                    <span className="text-white" style={{ fontFamily: "Space Grotesk" }}>${ct.amount.toLocaleString()}</span>
                    <span
                      className="font-semibold"
                      style={{ color: pnl >= 0 ? "#10b981" : "#ef4444", fontFamily: "Space Grotesk" }}
                    >
                      {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                    </span>
                    <span>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
                        style={{ background: statusColor[ct.status]?.bg, color: statusColor[ct.status]?.text }}
                      >
                        {ct.status}
                      </span>
                    </span>
                    <span className="text-[#cdcacc] text-xs">{format(new Date(ct.createdAt), "MMM d")}</span>
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
    </div>
  );
}
