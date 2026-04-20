"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";
import { toast } from "sonner";

const pillWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  height: "80px",
  borderRadius: "40px",
  border: "1px solid #e9d758",
  padding: "0 28px",
  gap: "12px",
};
const pillInput: React.CSSProperties = {
  flex: 1,
  background: "transparent",
  border: "none",
  outline: "none",
  color: "#cdcacc",
  fontSize: "16px",
  fontFamily: "Satoshi, sans-serif",
  fontWeight: 400,
};

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      setAuth(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}!`);
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative" style={{ background: "#0e0e52" }}>
      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex flex-col px-12 py-14 relative"
        style={{ width: "42%", flexShrink: 0 }}
      >
        {/* Logo */}
        <Link href="/" className="block mb-6" style={{ fontFamily: "Satoshi", fontSize: "26px", fontWeight: 700, color: "#fff" }}>
          Crestline <span style={{ color: "#e9d758" }}>Trades</span>
        </Link>
        <p style={{ fontFamily: "Satoshi", fontSize: "18px", fontWeight: 400, color: "#cdcacc" }}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" style={{ color: "#e9d758" }}>Sign up</Link>
        </p>

        {/* 3D cube — centered in left panel */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-[260px] h-[260px]">
            <Image src="/images/shape-cube.png" alt="3D cube" fill className="object-contain" />
          </div>
        </div>

        {/* Marketing text at bottom */}
        <div>
          <h2 style={{ fontFamily: "Satoshi", fontSize: "32px", fontWeight: 400, color: "#cdcacc", lineHeight: "1.2", marginBottom: "16px" }}>
            Trade <span style={{ color: "#e9d758" }}>Stocks, Futures,</span>
            <br />
            or <span style={{ color: "#e9d758" }}>Crypto</span> seamlessly
          </h2>
          <p style={{ fontFamily: "Satoshi", fontSize: "14px", fontWeight: 400, lineHeight: "22px", color: "#cdcacc", maxWidth: "340px" }}>
            Easily Trade BTC, TSLA stocks, SPY 500 ETF Funds or other digital assets using wide range of trading options and discover exclusive digital collections and offers with Shoreline Trades.
          </p>
        </div>
      </div>

      {/* ── Right panel = card, fills right side ── */}
      <div
        className="flex-1 relative flex flex-col justify-center py-12 px-10 lg:px-16"
        style={{ background: "#150578", borderRadius: "20px", margin: "24px 24px 24px 0" }}
      >
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden block mb-8" style={{ fontFamily: "Satoshi", fontSize: "22px", fontWeight: 700, color: "#fff" }}>
          Crestline <span style={{ color: "#e9d758" }}>Trades</span>
        </Link>

        <h1 style={{ fontFamily: "Satoshi", fontSize: "clamp(36px,4vw,48px)", fontWeight: 400, color: "#fff", lineHeight: 1, marginBottom: "8px" }}>
          Welcome Back
        </h1>
        <p style={{ fontFamily: "Satoshi", fontSize: "18px", fontWeight: 400, color: "#cdcacc", marginBottom: "40px" }}>
          Trade and manage your portfolio
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-[520px]">
          {/* Email */}
          <div style={pillWrap}>
            <input type="email" placeholder="E-mail" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required style={pillInput} />
          </div>

          {/* Password */}
          <div style={pillWrap}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
              style={{ ...pillInput, flex: 1 }}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{ color: "rgba(205,202,204,0.7)", flexShrink: 0 }}>
              {showPass ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <Button
              type="submit"
              disabled={loading}
              className="rounded-full font-medium"
              style={{ background: "#f5a623", color: "#fff", height: "52px", padding: "0 48px", fontSize: "18px", fontFamily: "Satoshi", fontWeight: 500 }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            <Link href="/auth/forgot-password" style={{ fontFamily: "Satoshi", fontSize: "18px", fontWeight: 400, color: "#e9d758" }}>
              Forgot Password
            </Link>
          </div>

          <p className="mt-2" style={{ fontFamily: "Satoshi", fontSize: "16px", color: "#cdcacc" }}>
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" style={{ color: "#e9d758" }}>Sign up</Link>
          </p>
        </form>
      </div>

      {/* Swirl decorative — bottom RIGHT of whole page, outside card */}
      <div
        className="absolute pointer-events-none select-none hidden lg:block"
        style={{ bottom: "-40px", right: "20px", width: "220px", height: "380px", opacity: 0.85, zIndex: 10 }}
      >
        <Image src="/images/shape-swirl.png" alt="" fill className="object-contain" />
      </div>
    </div>
  );
}
