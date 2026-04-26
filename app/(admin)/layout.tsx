"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useHydrated } from "@/hooks/useHydrated";
import Link from "next/link";
import { LayoutDashboard, Users, ArrowLeftRight, TrendingUp, LogOut, Settings, Star, Wallet, Wallet2, Activity, MessageSquare, Menu, X } from "lucide-react";
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
  { label: "Deposit Addresses", href: "/admin/deposit-addresses", icon: Wallet2 },
  { label: "Login Activity", href: "/admin/activity", icon: Activity },
  { label: "Chat Inbox", href: "/admin/chat", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

function SidebarContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
    toast.success("Logged out");
    onClose?.();
  };

  return (
    <div className="flex flex-col justify-between h-full p-5">
      <div>
        <Link href="/admin" className="block mb-8" onClick={onClose}>
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
                onClick={onClose}
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
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useHydrated();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else if (user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [hydrated, isAuthenticated, user, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!hydrated) return null;
  if (!isAuthenticated || user?.role !== "admin") return null;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#060614" }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex w-[220px] shrink-0 flex-col justify-between m-3 rounded-[20px]"
        style={{ background: "#150578" }}
      >
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          style={{ background: "rgba(0,0,0,0.6)" }}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-50 w-[260px] lg:hidden transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ background: "#150578" }}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-[#cdcacc] hover:text-white"
        >
          <X size={20} />
        </button>
        <SidebarContent pathname={pathname} onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header
          className="px-4 md:px-6 py-4 flex items-center justify-between shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-[#cdcacc] hover:text-white p-1"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-base md:text-lg font-bold text-white">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "#e9d758", color: "#0e0e52" }}
            >
              {user?.name?.charAt(0) ?? "A"}
            </span>
            <span className="hidden sm:block text-sm text-[#cdcacc]">{user?.name}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hidden">{children}</main>
      </div>
    </div>
  );
}
