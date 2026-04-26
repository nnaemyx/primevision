"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Copy, Check, Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

// Fallback addresses if backend is not seeded yet
const FALLBACK_CRYPTO = [
  { symbol: "BTC", name: "Bitcoin",    address: "bc1qqxcqdxlqdnxxhkjryzzg6t929fdfsk335g085g", color: "#f7931a" },
  { symbol: "ETH", name: "Ethereum",   address: "0xF13A8A59C278ADff9a96E892F68DBdf85E0723bF",  color: "#627eea" },
  { symbol: "USDT", name: "USD Tether",address: "0xF13A8A59C278ADff9a96E892F68DBdf85E0723bF",  color: "#26a17b" },
  { symbol: "SOL", name: "Solana",     address: "7vcj48VjPwY2N86j4Px3tpPUzaC42nDecFuURr6spPme", color: "#9945ff" },
];

interface CryptoOption { symbol: string; name: string; address: string; color: string; }

function CoinIcon({ symbol, color }: { symbol: string; color: string }) {
  const icons: Record<string, string> = { BTC: "₿", ETH: "Ξ", USDT: "₮", SOL: "◎" };
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
      style={{ background: "#0e0e52", color }}
    >
      {icons[symbol] ?? symbol.slice(0, 1)}
    </div>
  );
}

const PRESET_AMOUNTS = [100, 500, 1000, 5000, 10000];

export default function DepositPage() {
  const [selected, setSelected]     = useState<CryptoOption | null>(null);
  const [amount, setAmount]         = useState("");
  const [copied, setCopied]         = useState(false);
  const [sending, setSending]       = useState(false);
  const [notified, setNotified]     = useState(false);

  // Fetch admin-managed addresses; fall back to static list if unavailable
  const { data: cryptoOptions = FALLBACK_CRYPTO } = useQuery<CryptoOption[]>({
    queryKey: ["deposit-addresses"],
    queryFn: async () => {
      const { data } = await api.get("/portfolio/deposit-addresses");
      return data.length ? data : FALLBACK_CRYPTO;
    },
    retry: false,
    staleTime: 60_000,
  });

  const amountNum = parseFloat(amount);
  const amountValid = amountNum > 0;

  const handleCopy = () => {
    if (!selected) return;
    navigator.clipboard.writeText(selected.address);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSent = async () => {
    if (!selected || !amountValid) return;
    setSending(true);
    try {
      await api.post("/portfolio/deposit-notify", {
        amount: amountNum,
        symbol: selected.symbol,
      });
      setNotified(true);
      toast.success("Payment confirmed! Admin has been notified and will verify shortly.");
    } catch {
      toast.error("Failed to notify. Please contact support.");
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setSelected(null);
    setAmount("");
    setCopied(false);
    setNotified(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[860px]">
      {/* Page header */}
      <div>
        <h1
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontSize: "clamp(24px, 5vw, 32px)",
            fontWeight: 400,
            color: "#fff",
            lineHeight: "40px",
            marginBottom: "8px",
          }}
        >
          Deposit
        </h1>
        <p style={{ fontFamily: "Satoshi", fontSize: "15px", color: "#cdcacc", lineHeight: "28px" }}>
          Follow the steps below to fund your account.{" "}
          <span style={{ color: "#e9d758" }}>
            Select an amount, copy the address, then click &quot;Sent&quot;.
          </span>
        </p>
      </div>

      {/* ── STEP 1 — Choose coin ── */}
      <div>
        <p style={{ fontFamily: "Satoshi", fontSize: "13px", fontWeight: 600, color: "#e9d758", letterSpacing: "0.06em", marginBottom: 12, textTransform: "uppercase" }}>
          Step 1 — Choose cryptocurrency
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cryptoOptions.map((crypto) => (
            <button
              key={crypto.symbol}
              onClick={() => { setSelected(crypto); setCopied(false); setNotified(false); }}
              className="rounded-[20px] p-5 flex items-center gap-4 text-left transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "#150578",
                border: selected?.symbol === crypto.symbol
                  ? `2px solid ${crypto.color}`
                  : "2px solid transparent",
              }}
            >
              <CoinIcon symbol={crypto.symbol} color={crypto.color} />
              <div>
                <p style={{ fontFamily: "Satoshi", fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.9)", lineHeight: "20px" }}>
                  {crypto.name}
                </p>
                <p style={{ fontFamily: "Satoshi", fontSize: "13px", color: "#cdcacc", lineHeight: "18px" }}>
                  {crypto.symbol}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── STEP 2 — Enter Amount (gated on coin selected) ── */}
      {selected && !notified && (
        <div className="rounded-[20px] p-6 flex flex-col gap-5 animate-in fade-in duration-300" style={{ background: "#150578" }}>
          <p style={{ fontFamily: "Satoshi", fontSize: "13px", fontWeight: 600, color: "#e9d758", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Step 2 — Enter deposit amount (USD)
          </p>

          {/* Preset amounts */}
          <div className="flex flex-wrap gap-2">
            {PRESET_AMOUNTS.map((p) => (
              <button
                key={p}
                onClick={() => setAmount(String(p))}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  background: amount === String(p) ? "#e9d758" : "rgba(255,255,255,0.07)",
                  color: amount === String(p) ? "#0e0e52" : "#cdcacc",
                  border: "1px solid transparent",
                }}
              >
                ${p.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Custom amount input */}
          <div className="flex items-center gap-3 rounded-[12px] px-4 py-3" style={{ background: "rgba(14,14,82,0.7)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <span style={{ fontFamily: "Satoshi", fontSize: "20px", color: "#e9d758", fontWeight: 600 }}>$</span>
            <input
              type="number"
              min="0"
              placeholder="Enter custom amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: "Space Grotesk, monospace",
                fontSize: "20px",
                color: "#fff",
                fontWeight: 600,
              }}
            />
          </div>

          {/* ── STEP 3 — Copy address (gated on valid amount) ── */}
          {amountValid && (
            <div className="flex flex-col gap-3 animate-in fade-in duration-200">
              <p style={{ fontFamily: "Satoshi", fontSize: "13px", fontWeight: 600, color: "#e9d758", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Step 3 — Copy wallet address
              </p>

              {/* Coin header */}
              <div className="flex items-center gap-3">
                <CoinIcon symbol={selected.symbol} color={selected.color} />
                <div>
                  <p style={{ fontFamily: "Satoshi", fontSize: "16px", fontWeight: 600, color: "#fff" }}>
                    {selected.name} ({selected.symbol})
                  </p>
                  <p style={{ fontFamily: "Satoshi", fontSize: "12px", color: "#cdcacc" }}>
                    Send exactly <strong style={{ color: "#e9d758" }}>${amountNum.toLocaleString()}</strong> worth of {selected.symbol} to this address
                  </p>
                </div>
              </div>

              {/* Address box */}
              <div
                className="flex items-center justify-between gap-3 p-4 rounded-[12px] cursor-pointer hover:bg-white/5 transition-colors"
                style={{ background: "rgba(14,14,82,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}
                onClick={handleCopy}
              >
                <span
                  className="text-sm break-all"
                  style={{ fontFamily: "Space Grotesk, monospace", color: "#cdcacc", fontSize: "13px" }}
                >
                  {selected.address}
                </span>
                <button
                  className="shrink-0 transition-all"
                  style={{ color: copied ? "#10b981" : "#e9d758" }}
                  aria-label="Copy address"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>

              {/* Warning */}
              <div className="rounded-[12px] p-4" style={{ background: "rgba(247,127,0,0.1)", border: "1px solid rgba(247,127,0,0.2)" }}>
                <p style={{ fontFamily: "Satoshi", fontSize: "13px", color: "#f77f00" }}>
                  ⚠️ Only send {selected.symbol} to this address. Sending any other asset may result in permanent loss.
                </p>
              </div>

              {/* ── STEP 4 — Confirm Sent (gated on copied) ── */}
              {copied && (
                <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                  <p style={{ fontFamily: "Satoshi", fontSize: "13px", fontWeight: 600, color: "#e9d758", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Step 4 — Confirm payment
                  </p>
                  <p style={{ fontFamily: "Satoshi", fontSize: "13px", color: "#cdcacc" }}>
                    After sending the crypto, click the button below. The admin will verify and credit your account.
                  </p>
                  <button
                    onClick={handleSent}
                    disabled={sending}
                    className="flex items-center justify-center gap-3 rounded-full h-12 font-semibold transition-all hover:scale-[1.02] disabled:opacity-60"
                    style={{ background: "#10b981", color: "#fff", fontFamily: "Satoshi", fontSize: "15px" }}
                  >
                    <Send size={16} />
                    {sending ? "Notifying admin..." : "I have sent the payment"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Success state ── */}
      {notified && (
        <div
          className="rounded-[20px] p-8 flex flex-col items-center gap-4 text-center animate-in fade-in duration-300"
          style={{ background: "rgba(16,185,129,0.08)", border: "2px solid rgba(16,185,129,0.3)" }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.2)" }}>
            <Check size={32} style={{ color: "#10b981" }} />
          </div>
          <p style={{ fontFamily: "Satoshi", fontSize: "20px", fontWeight: 700, color: "#10b981" }}>
            Payment Confirmed!
          </p>
          <p style={{ fontFamily: "Satoshi", fontSize: "14px", color: "#cdcacc", maxWidth: 380 }}>
            Your deposit of <strong style={{ color: "#fff" }}>${amountNum.toLocaleString()}</strong> in{" "}
            <strong style={{ color: "#fff" }}>{selected?.symbol}</strong> has been submitted. The admin will verify
            and credit your account shortly.
          </p>
          <div className="flex items-center gap-2 rounded-[12px] px-4 py-2" style={{ background: "rgba(233,215,88,0.1)", border: "1px solid rgba(233,215,88,0.25)" }}>
            <AlertCircle size={14} style={{ color: "#e9d758" }} />
            <p style={{ fontFamily: "Satoshi", fontSize: "12px", color: "#e9d758" }}>
              Your balance will be updated once the transaction is confirmed.
            </p>
          </div>
          <button
            onClick={reset}
            className="mt-2 rounded-full px-8 h-10 font-semibold text-sm transition-all hover:scale-105"
            style={{ background: "#150578", color: "#cdcacc", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Make another deposit
          </button>
        </div>
      )}
    </div>
  );
}
