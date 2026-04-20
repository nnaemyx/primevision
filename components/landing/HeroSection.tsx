import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center pt-24 mt-[80px] pb-28 px-6"
      style={{ background: "transparent" }}
    >
      {/* Badge pill */}
      <div
        className="inline-flex items-center gap-3 px-5 py-3 rounded-full mb-12"
        style={{
          background: "#0e0e52",
          border: "1px solid #150578",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: "#150578" }} />
        <span
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontSize: "16px",
            fontWeight: 400,
            color: "#cdcacc",
            lineHeight: "19.2px",
          }}
        >
          Copy top traders, track live markets, and manage your portfolio with precision.
        </span>
      </div>

      {/* Hero headline */}
      <h1
        className="text-center"
        style={{
          position: "relative",
          zIndex: 1,
          fontFamily: "Satoshi, sans-serif",
          fontSize: "clamp(52px, 6.67vw, 96px)",
          fontWeight: 400,
          lineHeight: 1.1,
          color: "#ffffff",
          marginBottom: "40px",
          maxWidth: "747px",
        }}
      >
        Trade Smarter.
        <br />
        <span
          style={{
            color: "#e9d758",
            background: "#150578",
            fontWeight: 500,
          }}
        >
          Grow Faster.
        </span>
      </h1>

      {/* Subtitle */}
      <p
        className="text-center mb-12"
        style={{
          position: "relative",
          zIndex: 1,
          fontFamily: "Satoshi, sans-serif",
          fontSize: "clamp(18px, 1.67vw, 24px)",
          fontWeight: 400,
          lineHeight: "26.88px",
          color: "#cdcacc",
          maxWidth: "480px",
        }}
      >
        Access Futures, Stocks, and Crypto,
        <br />
        all in one powerful platform.
      </p>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-5 mb-16" style={{ position: "relative", zIndex: 1 }}>
        <Link
          href="/auth/signup"
          className="rounded-full text-white transition-all hover:opacity-90"
          style={{
            background: "#F77F00",
            padding: "16px 48px",
            fontFamily: "Satoshi, sans-serif",
            fontSize: "20px",
            fontWeight: 500,
            lineHeight: "19.2px",
            display: "inline-flex",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
        >
          Get Started
        </Link>

        <Link
          href="/#markets"
          className="flex items-center gap-3 text-white group"
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontSize: "20px",
            fontWeight: 500,
            lineHeight: "19.2px",
          }}
        >
          View Markets
          <span
            className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
            style={{ background: "#e9d758", color: "#F77F00", flexShrink: 0 }}
          >
            <ArrowUpRight size={20} />
          </span>
        </Link>
      </div>

      {/* ── Dashboard preview image ────────────────────────────────────
          Mobile and desktop images are in SEPARATE relative containers
          so only the correct one renders — no stacking or overlap.
      ── */}
      <div className="relative w-full" style={{ maxWidth: "900px", position: "relative", zIndex: 1 }}>
        {/* Shared glow BEHIND both images */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-60px -80px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(80, 20, 255, 0.7) 0%, rgba(50, 10, 200, 0.4) 35%, transparent 70%)",
            filter: "blur(60px)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Mobile image — only visible below md */}
        <div
          className="md:hidden"
          style={{
            position: "relative",
            zIndex: 1,
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 0 60px rgba(80, 20, 255, 0.4), 0 8px 60px rgba(0,0,0,0.6)",
          }}
        >
          <Image
            width={430}
            height={932}
            src="/images/Dashboard mobile.png"
            alt="Dashboard preview on mobile"
            style={{ width: "100%", height: "auto", display: "block" }}
            priority
          />
        </div>

        {/* Desktop image — only visible at md and above */}
        <div
          className="hidden md:block"
          style={{
            position: "relative",
            zIndex: 1,
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 0 60px rgba(80, 20, 255, 0.4), 0 8px 60px rgba(0,0,0,0.6)",
          }}
        >
          <Image
            width={1080}
            height={719}
            src="/images/image 8.png"
            alt="Dashboard preview on desktop"
            style={{ width: "100%", height: "auto", display: "block" }}
            priority
          />
        </div>
      </div>
    </section>
  );
}
