"use client";
import { useQuery } from "@tanstack/react-query";
import PortfolioBalanceCard from "@/components/dashboard/PortfolioBalanceCard";
import TradeHistoryDonut from "@/components/dashboard/TradeHistoryDonut";
import PortfolioDistribution from "@/components/dashboard/PortfolioDistribution";
import GrowthChart from "@/components/dashboard/GrowthChart";
import TransactionHistoryTable from "@/components/dashboard/TransactionHistoryTable";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { PortfolioBalance, Transaction } from "@/lib/types";

const mockDistribution = { stocks: 0, futures: 0, crypto: 0 };
const mockGrowthData = [
  { month: "Jan", value: 0 }, { month: "Feb", value: 0 },
  { month: "Mar", value: 0 }, { month: "Apr", value: 0 },
  { month: "May", value: 0 }, { month: "Jun", value: 0 },
  { month: "Jul", value: 0 }, { month: "Aug", value: 0 },
  { month: "Sep", value: 0 }, { month: "Oct", value: 0 },
  { month: "Nov", value: 0 }, { month: "Dec", value: 0 },
];

export default function DashboardPage() {
  const { data: balance, isLoading: balanceLoading } = useQuery<PortfolioBalance>({
    queryKey: ["portfolio-balance"],
    queryFn: async () => {
      const { data } = await api.get("/portfolio/balance");
      return data;
    },
  });

  const { data: growth, isLoading: growthLoading } = useQuery<{ data: { month: string; value: number }[] }>({
    queryKey: ["portfolio-history"],
    queryFn: async () => {
      const { data } = await api.get("/portfolio/history");
      return data;
    },
  });

  const { data: transactions, isLoading: txLoading } = useQuery<Transaction[]>({
    queryKey: ["portfolio-transactions"],
    queryFn: async () => {
      const { data } = await api.get("/portfolio/transactions");
      return data;
    },
  });

  const portfolioBalance: PortfolioBalance = balance ?? {
    balance: 0,
    pnlValue: 0,
    pnlPercent: 0,
    distribution: mockDistribution,
  };

  const growthData = growth?.data ?? mockGrowthData;
  const txData: Transaction[] = transactions ?? [];

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      {/* Top row — Portfolio Balance (wider) + Trade History donut */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] xl:grid-cols-[1fr_380px] gap-5">
        <div>
          {balanceLoading ? (
            <Skeleton className="h-44 rounded-[20px]" style={{ background: "#150578" }} />
          ) : (
            <PortfolioBalanceCard
              balance={portfolioBalance.balance}
              pnlValue={portfolioBalance.pnlValue}
              pnlPercent={portfolioBalance.pnlPercent}
            />
          )}
        </div>
        {balanceLoading ? (
          <Skeleton className="h-44 rounded-[20px]" style={{ background: "#e9d758" }} />
        ) : (
          <TradeHistoryDonut distribution={portfolioBalance.distribution} />
        )}
      </div>

      {/* Portfolio Distribution */}
      <PortfolioDistribution distribution={portfolioBalance.distribution} />

      {/* Growth Chart */}
      {growthLoading ? (
        <Skeleton className="h-80 rounded-[20px]" style={{ background: "#150578" }} />
      ) : (
        <GrowthChart data={growthData} />
      )}

      {/* Transaction History */}
      <div className="rounded-[20px] p-6" style={{ background: "#150578" }}>
        {txLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-48" style={{ background: "rgba(255,255,255,0.1)" }} />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" style={{ background: "rgba(255,255,255,0.05)" }} />
            ))}
          </div>
        ) : (
          <TransactionHistoryTable transactions={txData} />
        )}
      </div>
    </div>
  );
}
