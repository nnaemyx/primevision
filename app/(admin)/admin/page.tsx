"use client";
import { useQuery } from "@tanstack/react-query";
import { Users, DollarSign, TrendingUp, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { AdminStats } from "@/lib/types";

const MOCK_STATS: AdminStats = { totalUsers: 0, pendingWithdrawals: 0, totalVolume: 0, totalTrades: 0 };

const statCards = (stats: AdminStats) => [
  { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "#e9d758" },
  { label: "Total Volume", value: `$${stats.totalVolume.toLocaleString()}`, icon: DollarSign, color: "#f5a623" },
  { label: "Total Trades", value: stats.totalTrades.toLocaleString(), icon: TrendingUp, color: "#10b981" },
  { label: "Pending Withdrawals", value: stats.pendingWithdrawals.toLocaleString(), icon: Clock, color: "#ef4444" },
];

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await api.get("/admin/stats");
      return data;
    },
    placeholderData: MOCK_STATS,
  });

  const s = stats ?? MOCK_STATS;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-white">Platform Overview</h2>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards(s).map((card) => (
          <div key={card.label} className="rounded-[20px] p-5" style={{ background: "#150578" }}>
            {isLoading ? (
              <Skeleton className="h-16" style={{ background: "rgba(255,255,255,0.05)" }} />
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-[#cdcacc]">{card.label}</p>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: card.color + "20" }}
                  >
                    <card.icon size={16} style={{ color: card.color }} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  {card.value}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { title: "Pending Withdrawals", href: "/admin/transactions?status=pending", desc: `${s.pendingWithdrawals} awaiting approval` },
          { title: "User Management", href: "/admin/users", desc: `${s.totalUsers} registered users` },
        ].map((item) => (
          <a key={item.title} href={item.href} className="rounded-[20px] p-5 block transition-all hover:-translate-y-0.5" style={{ background: "#150578" }}>
            <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
            <p className="text-sm text-[#cdcacc]">{item.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
