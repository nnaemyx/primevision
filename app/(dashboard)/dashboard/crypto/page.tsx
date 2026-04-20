"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import TradingViewWidget from "@/components/trading/TradingViewWidget";
import OrderPanel from "@/components/trading/OrderPanel";
import OrderTabs from "@/components/trading/OrderTabs";
import api from "@/lib/api";
import { Trade } from "@/lib/types";

const CRYPTO_PAIRS = [
  { symbol: "BINANCE:BTCUSDT", label: "BTC/USDT", price: 74214.3 },
  { symbol: "BINANCE:ETHUSDT", label: "ETH/USDT", price: 3820.5 },
  { symbol: "BINANCE:SOLUSDT", label: "SOL/USDT", price: 168.2 },
  { symbol: "BINANCE:BNBUSDT", label: "BNB/USDT", price: 412.8 },
];

export default function CryptoPage() {
  const [selectedPair, setSelectedPair] = useState(CRYPTO_PAIRS[0]);
  const [pairOpen, setPairOpen] = useState(false);

  const { data: openOrders = [] } = useQuery<Trade[]>({
    queryKey: ["trades-open"],
    queryFn: async () => {
      const { data } = await api.get("/trades/open");
      return data;
    },
  });

  const { data: filledOrders = [] } = useQuery<Trade[]>({
    queryKey: ["trades-filled"],
    queryFn: async () => {
      const { data } = await api.get("/trades/filled");
      return data;
    },
  });

  const { data: tradeHistory = [] } = useQuery<Trade[]>({
    queryKey: ["trades-history", "crypto"],
    queryFn: async () => {
      const { data } = await api.get("/trades/history?market=crypto");
      return data;
    },
  });

  return (
    <div className="flex flex-col gap-5 max-w-[1400px]">
      {/* Top row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        {/* Chart panel */}
        <div className="rounded-[20px] overflow-hidden" style={{ background: "#150578" }}>
          {/* Chart header */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "#0e0e52", color: "#e9d758" }}
              >
                {selectedPair.label.split("/")[0].slice(0, 2)}
              </div>
              <div className="relative">
                <button
                  onClick={() => setPairOpen(!pairOpen)}
                  className="flex items-center gap-2 text-base font-semibold text-white"
                >
                  {selectedPair.label}
                  <ChevronDown size={16} className="text-[#cdcacc]" />
                </button>
                {pairOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-48 rounded-[16px] z-10 py-1 overflow-hidden"
                    style={{ background: "#0e0e52", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    {CRYPTO_PAIRS.map((pair) => (
                      <button
                        key={pair.symbol}
                        onClick={() => { setSelectedPair(pair); setPairOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/5 transition-colors"
                      >
                        {pair.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <span
              className="text-xl font-bold"
              style={{ fontFamily: "Space Grotesk, sans-serif", color: "#fff" }}
            >
              {selectedPair.price.toLocaleString()}
            </span>
          </div>
          {/* TradingView chart */}
          <TradingViewWidget symbol={selectedPair.symbol} height={380} />
        </div>

        {/* Order panel */}
        <OrderPanel
          symbol={selectedPair.label}
          currentPrice={selectedPair.price}
          market="crypto"
          currency="USDT"
        />
      </div>

      {/* Order tabs */}
      <OrderTabs
        openOrders={openOrders}
        filledOrders={filledOrders}
        tradeHistory={tradeHistory}
        market="crypto"
      />
    </div>
  );
}
