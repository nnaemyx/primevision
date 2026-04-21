"use client";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "/icons/icon-dashboard.svg" },
  { label: "Copy Trading", href: "/dashboard/copy-trading", icon: "/icons/icon-copy-trading.svg" },
  { label: "Futures", href: "/dashboard/futures", icon: "/icons/icon-futures.svg" },
  { label: "Stock & Options", href: "/dashboard/stocks", icon: "/icons/icon-stocks.svg" },
  { label: "Crypto", href: "/dashboard/crypto", icon: "/icons/icon-crypto.svg" },
  { label: "Connect Wallet", href: "/dashboard/wallet", icon: "/icons/icon-wallet.svg" },
  { label: "Deposit", href: "/dashboard/deposit", icon: "/icons/icon-crypto-dist.svg" },
  { label: "Settings", href: "/dashboard/settings", icon: "/icons/icon-settings.svg" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className="flex flex-col h-full"
      style={{
        width: "230px",
        background: "#150578",
        borderRadius: "20px",
        padding: "24px 12px",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <Link
        href="/dashboard"
        className="block px-3 mb-6 shrink-0"
        style={{ fontFamily: "Satoshi, sans-serif", fontSize: "20px", fontWeight: 700, color: "#fff" }}
      >
        PrimeVision{" "}
        <span style={{ color: "#e9d758" }}>Trades</span>
      </Link>

      {/* Nav items — scrollable */}
      <nav
        className="flex flex-col gap-1 flex-1 overflow-y-auto scrollbar-hidden"
        style={{ minHeight: 0 }}
      >
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "flex items-center gap-2.5 w-full text-left transition-all duration-200 cursor-pointer shrink-0",
                isActive ? "font-semibold" : "hover:text-white"
              )}
              style={{
                borderRadius: "40px",
                padding: "14px 16px",
                fontFamily: "Satoshi, sans-serif",
                fontSize: "15px",
                fontWeight: isActive ? 500 : 400,
                lineHeight: "19px",
                background: isActive ? "#e9d758" : "transparent",
                color: isActive ? "#0e0e52" : "#cdcacc",
                border: "none",
              }}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={18}
                height={18}
                style={{
                  filter: isActive
                    ? "brightness(0)"
                    : "brightness(0) invert(1) opacity(0.7)",
                  flexShrink: 0,
                }}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <p
        className="px-3 mt-3 shrink-0"
        style={{ fontFamily: "Satoshi", fontSize: "10px", color: "rgba(205,202,204,0.4)" }}
      >
        PrimeVision Trades &copy; 2026
      </p>
    </aside>
  );
}
