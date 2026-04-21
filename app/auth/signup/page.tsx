"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
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

const COUNTRIES = ["United States","United Kingdom","Canada","Australia","Germany","France","Nigeria","South Africa","India","Singapore","UAE","Other"];

type Step = "form" | "otp";

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [step, setStep] = useState<Step>("form");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", country: "" });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { toast.error("Please agree to Terms and Conditions"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      setUserId(data.userId);
      setStep("otp");
      toast.success("OTP sent to your email!");
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", { userId, otp });
      setAuth(data.user, data.token);
      toast.success("Welcome to PrimeVision Trades!");
      router.push("/dashboard");
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0e0e52" }}>
        <div className="w-full max-w-[480px] rounded-[20px] p-12" style={{ background: "#150578" }}>
          <h1 style={{ fontFamily: "Satoshi", fontSize: "40px", fontWeight: 400, color: "#fff", marginBottom: "12px" }}>Verify Email</h1>
          <p style={{ fontFamily: "Satoshi", fontSize: "16px", color: "#cdcacc", marginBottom: "32px" }}>
            Enter the 6-digit code sent to <strong>{form.email}</strong>
          </p>
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-5">
            <div style={pillWrap}>
              <input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/, "").slice(0, 6))}
                maxLength={6}
                style={{ ...pillInput, textAlign: "center", fontSize: "28px", letterSpacing: "16px", flex: 1 }}
                required
              />
            </div>
            <Button type="submit" disabled={loading || otp.length < 6} className="rounded-full h-14 font-medium" style={{ background: "#f5a623", color: "#fff", fontSize: "18px", fontFamily: "Satoshi" }}>
              {loading ? "Verifying..." : "Verify & Continue"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex overflow-hidden relative" style={{ background: "#0e0e52" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col px-12 py-14 relative" style={{ width: "42%", flexShrink: 0 }}>
        <Link href="/" className="block mb-6" style={{ fontFamily: "Satoshi", fontSize: "26px", fontWeight: 700, color: "#fff" }}>
          PrimeVision <span style={{ color: "#e9d758" }}>Trades</span>
        </Link>
        <p style={{ fontFamily: "Satoshi", fontSize: "18px", color: "#cdcacc" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "#e9d758" }}>Sign in</Link>
        </p>

        {/* Cone image centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-[260px] h-[260px]">
            <Image src="/images/shape-cone.png" alt="3D cone" fill className="object-contain" />
          </div>
        </div>

        <div>
          <h2 style={{ fontFamily: "Satoshi", fontSize: "32px", fontWeight: 400, color: "#cdcacc", lineHeight: "1.2", marginBottom: "16px" }}>
            Trade <span style={{ color: "#e9d758" }}>Stocks, Futures,</span>
            <br />
            or <span style={{ color: "#e9d758" }}>Crypto</span> seamlessly
          </h2>
          <p style={{ fontFamily: "Satoshi", fontSize: "14px", lineHeight: "22px", color: "#cdcacc", maxWidth: "340px" }}>
            Easily Trade BTC, TSLA stocks, SPY 500 ETF Funds or other digital assets using wide range of trading options and discover exclusive digital collections with Shoreline Trades.
          </p>
        </div>
      </div>

      {/* Right = card */}
      <div
        className="flex-1 flex flex-col justify-center py-10 px-10 lg:px-16 overflow-y-auto"
        style={{ background: "#150578", borderRadius: "20px", margin: "24px 24px 24px 0" }}
      >
        <Link href="/" className="lg:hidden block mb-8" style={{ fontFamily: "Satoshi", fontSize: "22px", fontWeight: 700, color: "#fff" }}>
          PrimeVision <span style={{ color: "#e9d758" }}>Trades</span>
        </Link>

        <h1 style={{ fontFamily: "Satoshi", fontSize: "clamp(36px,4vw,48px)", fontWeight: 400, color: "#fff", lineHeight: 1, marginBottom: "8px" }}>
          Get <strong style={{ fontWeight: 700 }}>Started</strong>
        </h1>
        <p style={{ fontFamily: "Satoshi", fontSize: "18px", color: "#cdcacc", marginBottom: "32px" }}>
          Start trading different assets with <span style={{ color: "#e9d758" }}>PrimeVision</span>
        </p>

        <form onSubmit={handleRegister} className="flex flex-col gap-4 max-w-[520px]">
          {/* Full name */}
          <div style={pillWrap}>
            <input type="text" placeholder="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required style={pillInput} />
          </div>

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
              minLength={6}
              style={{ ...pillInput, flex: 1 }}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{ color: "rgba(205,202,204,0.7)", flexShrink: 0 }}>
              {showPass ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          {/* Country */}
          <div style={{ ...pillWrap, position: "relative" }}>
            <select
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              style={{ ...pillInput, appearance: "none", WebkitAppearance: "none", cursor: "pointer" }}
            >
              <option value="" style={{ background: "#150578" }}>Country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c} style={{ background: "#150578" }}>{c}</option>
              ))}
            </select>
            <ChevronDown size={18} style={{ color: "rgba(205,202,204,0.7)", flexShrink: 0, pointerEvents: "none" }} />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 py-1">
            <input
              id="terms"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 cursor-pointer accent-[#e9d758]"
            />
            <label htmlFor="terms" style={{ fontFamily: "Satoshi", fontSize: "15px", color: "#cdcacc", cursor: "pointer" }}>
              By Proceeding, you agree to the{" "}
              <Link href="/terms" style={{ color: "#e9d758", textDecoration: "underline" }}>Terms and Conditions</Link>
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="rounded-full w-full font-medium"
            style={{ background: "#f5a623", color: "#fff", height: "52px", fontSize: "18px", fontFamily: "Satoshi" }}
          >
            {loading ? "Creating account..." : "Sign up"}
          </Button>

          <p style={{ fontFamily: "Satoshi", fontSize: "15px", color: "#cdcacc", textAlign: "center" }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: "#e9d758" }}>Sign in</Link>
          </p>
        </form>
      </div>

      {/* Swirl — bottom right outside card */}
      <div
        className="absolute pointer-events-none select-none hidden lg:block"
        style={{ bottom: "-40px", right: "20px", width: "220px", height: "380px", opacity: 0.85, zIndex: 10 }}
      >
        <Image src="/images/shape-swirl.png" alt="" fill className="object-contain" />
      </div>
    </div>
  );
}
