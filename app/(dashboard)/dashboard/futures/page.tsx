"use client";
import { useState } from "react";
import TradingViewWidget from "@/components/trading/TradingViewWidget";

const FUTURES = [
  { symbol: "NQ", label: "NQ", name: "E-mini Nasdaq-100 Futures", tvSymbol: "CME_MINI:NQ1!", price: 26756 },
  { symbol: "ES", label: "ES", name: "E-mini S&P 500 Futures", tvSymbol: "CME_MINI:ES1!", price: 5248 },
  { symbol: "MES", label: "MES", name: "Micro E-mini S&P 500 Index", tvSymbol: "CME_MINI:MES1!", price: 5245 },
  { symbol: "GC", label: "GC", name: "Gold Futures.", tvSymbol: "COMEX:GC1!", price: 2342 },
  { symbol: "MGC", label: "MGC", name: "Micro gold futures", tvSymbol: "COMEX:MGC1!", price: 2340 },
  { symbol: "CL", label: "CL", name: "Crude oil futures", tvSymbol: "NYMEX:CL1!", price: 78.4 },
  { symbol: "NIFTY", label: "NIFTY", name: "GIFT NIFTY 50 INDEX", tvSymbol: "NSE:NIFTY", price: 22150 },
];

const TIME_PERIODS = ["1M", "3M", "1Y", "5Y", "All"];
const ss: React.CSSProperties = { fontFamily: "Satoshi, sans-serif" };
const CARD = { background: "#150578", borderRadius: "20px" };

export default function FuturesPage() {
  const [selected, setSelected] = useState(FUTURES[0]);
  const [period, setPeriod] = useState("1M");
  const [search, setSearch] = useState("");
  const [amount, setAmount] = useState("");

  const filtered = FUTURES.filter(
    (f) =>
      f.label.toLowerCase().includes(search.toLowerCase()) ||
      f.name.toLowerCase().includes(search.toLowerCase())
  );

  const estimated = amount ? (parseFloat(amount) / selected.price).toFixed(4) : "0.00";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "8px" }}>

      {/* ── ROW 1: Chart + Explore ─────────────────────────────────── */}
      <div style={{ display: "flex", gap: "16px", alignItems: "stretch" }}>

        {/* Chart panel — grows to fill */}
        <div style={{ ...CARD, flex: "1 1 0", minWidth: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px 8px" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#0e0e52", flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <p style={{ ...ss, fontSize: 14, fontWeight: 500, color: "#fff", margin: 0 }}>{selected.name}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ ...ss, fontFamily: "Space Grotesk, sans-serif", fontSize: 24, fontWeight: 500, color: "#fff" }}>
                  {selected.price.toLocaleString()}
                </span>
                <span style={{ ...ss, fontSize: 10, color: "#cdcacc" }}>USD</span>
                <span style={{ ...ss, fontSize: 12, fontWeight: 700, color: "#e9d758" }}>+5.81 &nbsp;+2.30 &nbsp;Past month</span>
              </div>
            </div>
          </div>

          {/* Time period pills */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 20px 12px" }}>
            {TIME_PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  ...ss, fontSize: 12, fontWeight: 500, background: "none", cursor: "pointer",
                  color: period === p ? "#e9d758" : "#cdcacc",
                  border: period === p ? "1px solid #e9d758" : "none",
                  borderRadius: "100px",
                  padding: period === p ? "2px 8px" : "2px 0",
                }}
              >{p}</button>
            ))}
          </div>

          {/* Chart */}
          <div style={{ flex: 1, minHeight: 220 }}>
            <TradingViewWidget symbol={selected.tvSymbol} height={380} />
          </div>
        </div>

        {/* Explore Futures panel — fixed width on desktop, hidden on mobile */}
        <div
          className="hidden lg:flex"
          style={{ ...CARD, width: 220, flexShrink: 0, flexDirection: "column", overflow: "hidden" }}
        >
          <div style={{ padding: "16px 16px 8px" }}>
            <p style={{ ...ss, fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 8 }}>Explore</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 100, border: "1px solid #e9d758" }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <circle cx="5" cy="5" r="4" stroke="rgba(205,202,204,0.8)" strokeWidth="1.5" />
                <path d="M9 9l2 2" stroke="rgba(205,202,204,0.8)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                placeholder="Type to search Futures"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ ...ss, fontSize: 10, color: "rgba(205,202,204,0.8)", background: "transparent", border: "none", outline: "none", flex: 1 }}
              />
            </div>
          </div>
          <div className="scrollbar-hidden" style={{ flex: 1, overflowY: "auto", padding: "0 12px 12px" }}>
            {filtered.map((f) => (
              <div
                key={f.symbol}
                onClick={() => setSelected(f)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 4px", cursor: "pointer", borderRadius: 8 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#0e0e52", flexShrink: 0 }} />
                  <div>
                    <p style={{ ...ss, fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: "12px", margin: 0 }}>{f.label}</p>
                    <p style={{ ...ss, fontSize: 9, color: "#cdcacc", lineHeight: "11px", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>{f.name}</p>
                  </div>
                </div>
                <button style={{ ...ss, fontSize: 9, color: "#fff", background: "#f5a623", border: "none", borderRadius: 6, padding: "3px 7px", cursor: "pointer", flexShrink: 0 }}>Trade</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile-only Explore Futures — horizontal scrolling chip row */}
      <div className="lg:hidden" style={{ ...CARD, padding: "12px 16px" }}>
        <p style={{ ...ss, fontSize: 13, fontWeight: 500, color: "#fff", marginBottom: 8 }}>Explore Futures</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 100, border: "1px solid #e9d758", marginBottom: 10 }}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <circle cx="5" cy="5" r="4" stroke="rgba(205,202,204,0.8)" strokeWidth="1.5" />
            <path d="M9 9l2 2" stroke="rgba(205,202,204,0.8)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Type to search Futures"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...ss, fontSize: 10, color: "rgba(205,202,204,0.8)", background: "transparent", border: "none", outline: "none", flex: 1 }}
          />
        </div>
        <div className="scrollbar-hidden" style={{ display: "flex", gap: 8, overflowX: "auto" }}>
          {filtered.map((f) => (
            <button
              key={f.symbol}
              onClick={() => setSelected(f)}
              style={{
                ...ss, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-start",
                gap: 2, padding: "8px 10px", borderRadius: 10, cursor: "pointer",
                background: selected.symbol === f.symbol ? "#e9d758" : "rgba(255,255,255,0.06)",
                border: "none",
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: selected.symbol === f.symbol ? "#0e0e52" : "#fff" }}>{f.label}</span>
              <span style={{ fontSize: 9, color: selected.symbol === f.symbol ? "#0e0e52" : "#cdcacc", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── ROW 2: Holdings + Buy ───────────────────────────────────── */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {/* Futures Holdings */}
        <div style={{ ...CARD, flex: "1 1 280px", padding: "20px" }}>
          <p style={{ ...ss, fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 16 }}>Futures Holdings</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 0" }}>
            {[
              { label: "Shares", value: `0.00 ${selected.label}` },
              { label: "Total Profit", value: "$0.00" },
              { label: "Average Cost", value: "$0.00" },
              { label: "Today's Profit", value: "$0.00" },
            ].map((item) => (
              <div key={item.label}>
                <p style={{ ...ss, fontSize: 10, color: "#cdcacc", margin: "0 0 3px" }}>{item.label}</p>
                <p style={{ ...ss, fontSize: 13, fontWeight: 500, color: "#fff", margin: 0 }}>{item.value}</p>
              </div>
            ))}
          </div>
          {/* Profits row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <p style={{ ...ss, fontSize: 11, color: "#cdcacc", margin: 0 }}>Profits</p>
            <p style={{ ...ss, fontSize: 11, color: "#cdcacc", margin: 0 }}>Nothing to see here</p>
            <p style={{ ...ss, fontSize: 11, color: "#cdcacc", margin: 0 }}>Date Received</p>
          </div>
        </div>

        {/* Buy panel */}
        <div style={{ ...CARD, flex: "1 1 200px", padding: "20px", minWidth: 0 }}>
          <p style={{ ...ss, fontSize: 14, fontWeight: 500, color: "#fff", textAlign: "center", marginBottom: 12 }}>Buy {selected.label}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ ...ss, fontSize: 11, color: "#cdcacc" }}>Order Type</span>
              <span style={{ ...ss, fontSize: 11, fontWeight: 700, color: "#fff" }}>Amount</span>
            </div>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: "100%", height: 32, borderRadius: 20, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff", padding: "0 10px", ...ss, fontSize: 11, outline: "none", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ ...ss, fontSize: 11, color: "#cdcacc" }}>Market Price</span>
              <span style={{ ...ss, fontSize: 11, fontWeight: 700, color: "#fff" }}>${selected.price.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ ...ss, fontSize: 11, color: "#cdcacc" }}>Estimated shares</span>
              <span style={{ ...ss, fontSize: 11, fontWeight: 700, color: "#fff" }}>{estimated} {selected.label}</span>
            </div>
            <button style={{ width: "100%", height: 36, borderRadius: 100, background: "#f5a623", color: "#fff", ...ss, fontSize: 12, border: "none", cursor: "pointer", marginTop: 4 }}>
              Execute Order
            </button>
          </div>
        </div>
      </div>

      {/* ── ROW 3: Trade History ──────────────────────────────────────── */}
      <div style={{ ...CARD, padding: "20px" }}>
        <p style={{ ...ss, fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 12 }}>Futures Trade History</p>
        <div className="scrollbar-hidden" style={{ overflowX: "auto" }}>
          <div style={{ display: "flex", gap: 32, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.08)", minWidth: "max-content" }}>
            {["Reference", "Execution Time", "Symbol", "Side", "Price", "Volume"].map((h) => (
              <span key={h} style={{ ...ss, fontSize: 12, fontWeight: 500, color: "#cdcacc" }}>{h}</span>
            ))}
          </div>
        </div>
        <p style={{ ...ss, fontSize: 11, color: "#cdcacc", textAlign: "center", padding: "24px 0 0", margin: 0 }}>
          You have no active Futures positions
        </p>
      </div>
    </div>
  );
}
