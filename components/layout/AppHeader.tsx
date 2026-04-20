"use client";
import { useState } from "react";
import { Search, LogOut, User, Settings, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppSidebar from "@/components/layout/AppSidebar";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AppHeader() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "GF";

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
    toast.success("Logged out successfully");
  };

  return (
    <>
      <header className="flex items-center justify-between px-2 py-4 gap-4 shrink-0">
        {/* Mobile menu button */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* User greeting */}
        <div className="flex items-center gap-3 shrink-0">
          <span
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
            style={{ background: "#e9d758", color: "#0e0e52", fontFamily: "Satoshi" }}
          >
            {initials}
          </span>
          <p
            className="hidden sm:block"
            style={{ fontFamily: "Satoshi, sans-serif", fontSize: "18px", fontWeight: 500, color: "#fff" }}
          >
            Hello{" "}
            <strong style={{ fontWeight: 700 }}>{user?.name?.split(" ")[0] ?? "Trader"},</strong>
          </p>
        </div>

        {/* Search bar */}
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

        {/* User avatar / menu */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 cursor-pointer"
              style={{ background: "#e9d758", color: "#0e0e52", fontFamily: "Satoshi" }}
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

      {/* Mobile sidebar overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setMobileNavOpen(false)}
          />
          {/* Drawer */}
          <div
            className="absolute left-0 top-0 h-full p-3"
            style={{ width: "280px", zIndex: 51 }}
          >
            <div className="relative h-full">
              <button
                className="absolute top-4 right-4 z-10 text-white"
                onClick={() => setMobileNavOpen(false)}
              >
                <X size={20} />
              </button>
              <AppSidebar />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
