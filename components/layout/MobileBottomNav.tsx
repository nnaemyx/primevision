"use client";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/dashboard", icon: "/icons/icon-dashboard.svg" },
  { label: "Copy", href: "/dashboard/copy-trading", icon: "/icons/icon-copy-trading.svg" },
  { label: "Futures", href: "/dashboard/futures", icon: "/icons/icon-futures.svg" },
  { label: "Stocks", href: "/dashboard/stocks", icon: "/icons/icon-stocks.svg" },
  { label: "Crypto", href: "/dashboard/crypto", icon: "/icons/icon-crypto.svg" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around"
      style={{
        background: "#150578",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        height: "64px",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
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
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full cursor-pointer border-none bg-transparent"
            style={{ outline: "none" }}
            aria-label={item.label}
          >
            {/* Active indicator dot */}
            {isActive && (
              <span
                style={{
                  position: "absolute",
                  top: "0",
                  width: "24px",
                  height: "2px",
                  background: "#e9d758",
                  borderRadius: "0 0 4px 4px",
                }}
              />
            )}
            <Image
              src={item.icon}
              alt={item.label}
              width={20}
              height={20}
              style={{
                filter: isActive
                  ? "brightness(0) saturate(1) invert(88%) sepia(30%) saturate(700%) hue-rotate(10deg)"
                  : "brightness(0) invert(1) opacity(0.5)",
              }}
            />
            <span
              style={{
                fontFamily: "Satoshi, sans-serif",
                fontSize: "10px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#e9d758" : "rgba(205,202,204,0.6)",
                lineHeight: 1,
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
