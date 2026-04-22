"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useHydrated } from "@/hooks/useHydrated";
import Link from "next/link";
import { LayoutDashboard, Users, ArrowLeftRight, TrendingUp, LogOut, Settings, Star, Wallet, Activity, MessageSquare } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const adminNavItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Transactions", href: "/admin/transactions", icon: ArrowLeftRight },
  { label: "Trades", href: "/admin/trades", icon: TrendingUp },
  { label: "Expert Traders", href: "/admin/traders", icon: Star },
  { label: "Wallets", href: "/admin/wallets", icon: Wallet },
  { label: "Login Activity", href: "/admin/activity", icon: Activity },
  { label: "Chat Inbox", href: "/admin/chat", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else if (user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [hydrated, isAuthenticated, user, router]);

  if (!hydrated) return null;
  if (!isAuthenticated || user?.role !== "admin") return null;

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
    toast.success("Logged out");
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#060614" }}>
      {/* Admin sidebar */}
      <aside
        className="w-[220px] shrink-0 flex flex-col justify-between m-3 rounded-[20px] p-5"
        style={{ background: "#150578" }}
      >
        <div>
          <Link href="/admin" className="block mb-8">
            <p className="text-xl font-bold text-white">
              PrimeVision <span style={{ color: "#e9d758" }}>Admin</span>
            </p>
          </Link>
          <nav className="flex flex-col gap-1">
            {adminNavItems.map((item) => {
              const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-medium transition-all",
                    isActive ? "bg-[#e9d758] text-[#0e0e52]" : "text-[#cdcacc] hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 px-3 py-2"
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h1 className="text-lg font-bold text-white">Admin Panel</h1>
          <div className="flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "#e9d758", color: "#0e0e52" }}
            >
              {user?.name?.charAt(0) ?? "A"}
            </span>
            <span className="text-sm text-[#cdcacc]">{user?.name}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hidden">{children}</main>
      </div>
    </div>
  );
}
