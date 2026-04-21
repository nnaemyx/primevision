"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("Reset link sent to your email!");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#0e0e52" }}>
      <div className="w-full max-w-[480px] rounded-[20px] p-10" style={{ background: "#150578" }}>
        <Link href="/" className="text-xl font-bold text-white block mb-8">
          PrimeVision <span style={{ color: "#e9d758" }}>Trades</span>
        </Link>
        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(233,215,88,0.15)" }}>
              <span className="text-3xl">✓</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
            <p className="text-[#cdcacc] mb-6">We sent a password reset link to {email}</p>
            <Link href="/auth/login" className="text-sm font-medium" style={{ color: "#e9d758" }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-light text-white mb-2">Forgot Password?</h1>
            <p className="text-[#cdcacc] mb-8">Enter your email and we&apos;ll send you a reset link.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div
                className="flex items-center px-5 rounded-[40px]"
                style={{ border: "1px solid #e9d758" }}
              >
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-0 bg-transparent text-[#cdcacc] placeholder:text-[#cdcacc]/60 focus-visible:ring-0 h-[56px] px-0"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-full h-12 font-semibold"
                style={{ background: "#f5a623", color: "#fff" }}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <p className="text-sm text-center text-[#cdcacc]">
                Remember your password?{" "}
                <Link href="/auth/login" className="font-medium" style={{ color: "#e9d758" }}>Sign in</Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
