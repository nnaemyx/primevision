"use client";
import { Search, LogOut, User, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";

export default function AppHeader() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "PV";

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
    toast.success("Logged out successfully");
  };

  return (
    <header className="flex items-center justify-between px-2 py-4 gap-4 shrink-0">
      {/* Mobile: brand logo — replaces user initials circle */}
      <Link
        href="/dashboard"
        className="md:hidden shrink-0"
        style={{ fontFamily: "Satoshi, sans-serif", fontSize: "18px", fontWeight: 700, color: "#fff" }}
      >
        PrimeVision <span style={{ color: "#e9d758" }}>Trades</span>
      </Link>

      {/* Desktop: user greeting with initials */}
      <div className="hidden md:flex items-center gap-3 shrink-0">
        <span
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
          style={{ background: "#e9d758", color: "#060614", fontFamily: "Satoshi" }}
        >
          {initials}
        </span>
        <p style={{ fontFamily: "Satoshi, sans-serif", fontSize: "18px", fontWeight: 500, color: "#fff" }}>
          Hello{" "}
          <strong style={{ fontWeight: 700 }}>{user?.name?.split(" ")[0] ?? "Trader"},</strong>
        </p>
      </div>

      {/* Search bar — desktop only */}
      <div
        className="flex-1 max-w-xl hidden md:flex items-center gap-3 px-5"
        style={{ height: "50px", borderRadius: "34px", border: "1px solid #e9d758" }}
      >
        <Search size={16} style={{ color: "rgba(205,202,204,0.8)", flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Type to search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none flex-1"
          style={{ fontFamily: "Satoshi, sans-serif", fontSize: "14px", color: "#cdcacc" }}
        />
      </div>

      {/* Mobile-only: Wallet shortcut pill */}
      <button
        onClick={() => router.push("/dashboard/wallet")}
        className="md:hidden flex items-center gap-2 rounded-full shrink-0 transition-all active:scale-95"
        style={{
          border: "1px solid #e9d758",
          padding: "8px 16px",
          fontFamily: "Satoshi, sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          color: "#e9d758",
          background: "rgba(233,215,88,0.08)",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#e9d758", flexShrink: 0 }} />
        Wallet
      </button>

      {/* User avatar / dropdown menu */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 cursor-pointer"
            style={{ background: "#e9d758", color: "#060614", fontFamily: "Satoshi" }}
          >
            {initials}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48"
          style={{ background: "#150578", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
        >
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/settings")}
            className="cursor-pointer gap-2 text-white hover:bg-white/10 focus:bg-white/10"
          >
            <User size={14} /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/settings")}
            className="cursor-pointer gap-2 text-white hover:bg-white/10 focus:bg-white/10"
          >
            <Settings size={14} /> Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator style={{ background: "rgba(255,255,255,0.1)" }} />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer gap-2 text-red-400 hover:bg-white/10 focus:bg-white/10"
          >
            <LogOut size={14} /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
