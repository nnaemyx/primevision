"use client";
import { useState } from "react";
import { Bitcoin, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const CRYPTO_OPTIONS = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    color: "#f7931a",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    address: "0x742d35Cc6634C0532925a3b8D4C9C61B3a1B1B1B",
    color: "#627eea",
  },
  {
    name: "USD Tether",
    symbol: "USDT",
    address: "TRx8JaV6JhJWByD7Nkdm3k4F3VVdK2JhB8",
    color: "#26a17b",
  },
  {
    name: "Solana",
    symbol: "SOL",
    address: "6ZCmhMVcn7KP3mMnz5UJb3C7GiSZdHNrYQ9aKfN5JdX",
    color: "#9945ff",
  },
];

function CoinIcon({ symbol, color }: { symbol: string; color: string }) {
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
      style={{ background: "#0e0e52", color }}
    >
      {symbol === "BTC" ? "₿" : symbol === "ETH" ? "Ξ" : symbol === "USDT" ? "₮" : "◎"}
    </div>
  );
}

export default function DepositPage() {
  const [selected, setSelected] = useState<(typeof CRYPTO_OPTIONS)[0] | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[900px]">
      {/* Page header */}
      <div>
        <h1
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontSize: "32px",
            fontWeight: 400,
            color: "#fff",
            lineHeight: "40px",
            marginBottom: "8px",
          }}
        >
          Deposit
        </h1>
        <p style={{ fontFamily: "Satoshi", fontSize: "16px", fontWeight: 400, color: "#fff", lineHeight: "32px" }}>
          Fund your account and trade to earn more.{" "}
          <span style={{ color: "#e9d758" }}>Choose from any of our different deposit Address</span>
        </p>
      </div>

      {/* Crypto grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CRYPTO_OPTIONS.map((crypto) => (
          <button
            key={crypto.symbol}
            onClick={() => setSelected(crypto)}
            className="rounded-[20px] p-5 flex items-center gap-4 text-left transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "#150578",
              border: selected?.symbol === crypto.symbol ? `1px solid ${crypto.color}` : "1px solid transparent",
            }}
          >
            <CoinIcon symbol={crypto.symbol} color={crypto.color} />
            <div>
              <p
                style={{
                  fontFamily: "Satoshi",
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: "20px",
                }}
              >
                {crypto.name}
              </p>
              <p
                style={{
                  fontFamily: "Satoshi",
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: "20px",
                }}
              >
                {crypto.symbol}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Address display */}
      {selected && (
        <div
          className="rounded-[20px] p-6 flex flex-col gap-4 animate-in fade-in duration-300"
          style={{ background: "#150578" }}
        >
          <div className="flex items-center gap-3">
            <CoinIcon symbol={selected.symbol} color={selected.color} />
            <div>
              <p style={{ fontFamily: "Satoshi", fontSize: "18px", fontWeight: 600, color: "#fff" }}>
                {selected.name} ({selected.symbol})
              </p>
              <p style={{ fontFamily: "Satoshi", fontSize: "13px", color: "#cdcacc" }}>
                Send only {selected.symbol} to this address
              </p>
            </div>
          </div>

          {/* Address box */}
          <div
            className="flex items-center justify-between gap-3 p-4 rounded-[12px] cursor-pointer"
            style={{ background: "rgba(14,14,82,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}
            onClick={() => handleCopy(selected.address)}
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

          <div
            className="rounded-[12px] p-4"
            style={{ background: "rgba(247,127,0,0.1)", border: "1px solid rgba(247,127,0,0.2)" }}
          >
            <p style={{ fontFamily: "Satoshi", fontSize: "13px", color: "#f77f00" }}>
              ⚠️ Only send {selected.symbol} to this address. Sending any other asset may result in permanent loss.
            </p>
          </div>
        </div>
      )}

      {/* Chat widget — bottom right fixed */}
      <div
        className="fixed bottom-6 right-6 flex items-center gap-3 px-5 py-4 rounded-[40px] cursor-pointer hover:scale-105 transition-transform z-40"
        style={{ background: "#150578" }}
      >
        <span style={{ fontFamily: "Satoshi", fontSize: "20px", fontWeight: 400, color: "#cdcacc" }}>
          Chat
        </span>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: "#0e0e52" }}
        >
          <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
            <path
              d="M11 0C4.925 0 0 4.477 0 10c0 2.12.638 4.088 1.734 5.714L.046 19.232A1 1 0 001.18 20.5l4.133-1.4A10.89 10.89 0 0011 20c6.075 0 11-4.477 11-10S17.075 0 11 0Z"
              fill="#e9d758"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
