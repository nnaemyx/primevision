"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useHydrated } from "@/hooks/useHydrated";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Futures", href: "/#futures" },
  { label: "Stock & Options", href: "/#stocks" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const hydrated = useHydrated();
  const pathname = usePathname();

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Top pill navbar ─────────────────────────────────────────────── */}
      <nav
        className="fixed z-50"
        style={{
          top: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 48px)",
          maxWidth: "1200px",
          background: "#150578",
          backdropFilter: "blur(20px)",
          borderRadius: "100px",
          transition: "box-shadow 0.3s ease",
          boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <div className="flex items-center justify-between h-16 px-8">
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            Primevision <span style={{ color: "#CDCACC" }}>Trades</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    fontFamily: "Satoshi, sans-serif",
                    fontSize: "16px",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#e9d758" : "rgba(255,255,255,0.85)",
                    transition: "color 0.2s",
                    position: "relative",
                    paddingBottom: "4px",
                  }}
                  className="hover:text-white"
                >
                  {link.label}
                  {/* Active dot indicator */}
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "-6px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#e9d758",
                        display: "block",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          {hydrated && isAuthenticated ? (
            <Link
              href={user?.role === "admin" ? "/admin" : "/dashboard"}
              className="hidden md:inline-flex items-center rounded-full font-medium transition-all hover:opacity-90"
              style={{ background: "#F77F00", color: "#fff", padding: "8px 28px", fontSize: "16px", fontFamily: "Satoshi, sans-serif", fontWeight: 500, flexShrink: 0 }}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/signup"
              className="hidden md:inline-flex items-center rounded-full font-medium transition-all hover:opacity-90"
              style={{ background: "#F77F00", color: "#fff", padding: "8px 28px", fontSize: "16px", fontFamily: "Satoshi, sans-serif", fontWeight: 500, flexShrink: 0 }}
            >
              Sign up
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* ── Mobile slide-in drawer ───────────────────────────────────────── */}

      {/* Blurred backdrop — click to close */}
      <div
        onClick={() => setMobileOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 998,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          width: "min(320px, 85vw)",
          background: "#150578",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.5)",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          padding: "28px 28px 40px",
          overflowY: "auto",
        }}
      >
        {/* Drawer header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
          <span style={{ fontFamily: "Satoshi, sans-serif", fontSize: "20px", fontWeight: 700, color: "#fff" }}>
            Primevision <span style={{ color: "#CDCACC" }}>Trades</span>
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "none",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer nav links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: "Satoshi, sans-serif",
                  fontSize: "17px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#e9d758" : "rgba(255,255,255,0.8)",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  background: isActive ? "rgba(233,215,88,0.08)" : "transparent",
                  borderLeft: isActive ? "3px solid #e9d758" : "3px solid transparent",
                  transition: "all 0.2s",
                  display: "block",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer CTA buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "32px" }}>
          {hydrated && isAuthenticated ? (
            <Link
              href={user?.role === "admin" ? "/admin" : "/dashboard"}
              onClick={() => setMobileOpen(false)}
              style={{
                textAlign: "center",
                padding: "14px",
                borderRadius: "100px",
                background: "#F77F00",
                color: "#fff",
                fontFamily: "Satoshi, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                style={{
                  textAlign: "center",
                  padding: "14px",
                  borderRadius: "100px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                  fontFamily: "Satoshi, sans-serif",
                  fontSize: "15px",
                  fontWeight: 500,
                }}
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMobileOpen(false)}
                style={{
                  textAlign: "center",
                  padding: "14px",
                  borderRadius: "100px",
                  background: "#F77F00",
                  color: "#fff",
                  fontFamily: "Satoshi, sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                }}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
