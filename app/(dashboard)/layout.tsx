"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/layout/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";
import ChatWidget from "@/components/chat/ChatWidget";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { useAuthStore } from "@/store/auth.store";
import { useHydrated } from "@/hooks/useHydrated";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const hydrated = useHydrated();

  useEffect(() => {
    // Only redirect AFTER Zustand has rehydrated from localStorage.
    if (hydrated && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return null;
  if (!isAuthenticated) return null;

  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{ background: "#0e0e52", padding: "12px", gap: "12px" }}
    >
      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:block shrink-0">
        <AppSidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AppHeader />
        {/* Main scrollable area — extra bottom padding for mobile bottom nav */}
        <main
          className="flex-1 overflow-y-auto scrollbar-hidden"
          style={{ paddingLeft: 8, paddingRight: 8, paddingBottom: 80 }}
        >
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />

      <ChatWidget />
    </div>
  );
}
