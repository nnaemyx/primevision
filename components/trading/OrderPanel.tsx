"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";
import { Market } from "@/lib/types";

interface Props {
  symbol: string;
  currentPrice: number;
  market: Market;
  title?: string;
  currency?: string;
}

export default function OrderPanel({ symbol, currentPrice, market, title, currency = "USDT" }: Props) {
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState("10");
  const [stopLoss, setStopLoss] = useState("0.0");
  const [takeProfit, setTakeProfit] = useState("0.0");
  const [lockingPeriod, setLockingPeriod] = useState("2 hours");
  const [loading, setLoading] = useState<"long" | "short" | null>(null);

  const triggerFee = parseFloat(amount || "0") * 0.001;
  const orderValue = parseFloat(amount || "0") / currentPrice;

  const executeTrade = async (side: "long" | "short") => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setLoading(side);
    try {
      await api.post("/trades/execute", {
        symbol,
        market,
        type: orderType,
        side,
        price: currentPrice,
        amount: parseFloat(amount),
        quantity: orderValue,
        stopLoss: parseFloat(stopLoss),
        takeProfit: parseFloat(takeProfit),
        leverage: parseInt(leverage),
        lockingPeriod,
      });
      toast.success(`${side === "long" ? "Long" : "Short"} order placed!`);
      setAmount("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Order failed";
      toast.error(msg);
    } finally {
      setLoading(null);
    }
  };

  const inputStyle = "bg-transparent border text-white text-sm rounded-[20px] h-9 px-3 focus-visible:ring-1 focus-visible:ring-[#e9d758]";
  const inputWrapStyle = { borderColor: "rgba(255,255,255,0.15)" };
  const labelStyle = "text-xs text-[#cdcacc]/80 mb-1 block";

  return (
    <div className="rounded-[20px] p-5 flex flex-col gap-4" style={{ background: "#150578" }}>
      {title && (
        <h3 className="text-center font-bold text-lg text-white">{title}</h3>
      )}

      <Tabs value={orderType} onValueChange={(v) => setOrderType(v as "market" | "limit")}>
        <TabsList
          className="w-full bg-transparent border-b rounded-none gap-0 justify-start"
          style={{ borderBottomColor: "rgba(255,255,255,0.08)" }}
        >
          {["market", "limit"].map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              className="flex-1 pb-2 rounded-none text-sm text-[#cdcacc] capitalize data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#f5a623] bg-transparent"
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="market" className="mt-4 flex flex-col gap-3">
          {/* Order By / Leverage */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={labelStyle}>Order By</span>
              <Input value="Cost" readOnly className={inputStyle} style={inputWrapStyle} />
            </div>
            <div>
              <span className={labelStyle}>Leverage</span>
              <Input
                value={leverage + "X"}
                onChange={(e) => setLeverage(e.target.value.replace("X", ""))}
                className={inputStyle}
                style={inputWrapStyle}
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <span className={labelStyle}>Amount</span>
            <div
              className="flex items-center rounded-[20px] px-3 h-9 border gap-2"
              style={inputWrapStyle}
            >
              <input
                type="number"
                placeholder="Cost"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent outline-none text-sm text-[#cdcacc] flex-1 min-w-0"
              />
              <span className="text-xs text-[#cdcacc]/60 shrink-0">{currency}</span>
            </div>
            <p className={labelStyle + " mt-1"}>Acc Bal: $0.00</p>
          </div>

          {/* TP / SL */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={labelStyle}>Take Profit</span>
              <Input value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} className={inputStyle} style={inputWrapStyle} />
            </div>
            <div>
              <span className={labelStyle}>Stop Loss</span>
              <Input value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} className={inputStyle} style={inputWrapStyle} />
            </div>
          </div>

          {/* Locking Period */}
          <div>
            <span className={labelStyle}>Locking Period</span>
            <select
              value={lockingPeriod}
              onChange={(e) => setLockingPeriod(e.target.value)}
              className="w-full rounded-[20px] px-3 h-9 text-sm text-white border"
              style={{ ...inputWrapStyle, background: "transparent" }}
            >
              {["1 hour", "2 hours", "6 hours", "12 hours", "1 day", "1 week"].map((p) => (
                <option key={p} value={p} style={{ background: "#150578" }}>{p}</option>
              ))}
            </select>
          </div>
        </TabsContent>

        <TabsContent value="limit" className="mt-4 flex flex-col gap-3">
          <div>
            <Label className={labelStyle}>Limit Price</Label>
            <Input placeholder="0.00" className={inputStyle} style={inputWrapStyle} />
          </div>
          <div>
            <Label className={labelStyle}>Amount</Label>
            <div className="flex items-center rounded-[20px] px-3 h-9 border gap-2" style={inputWrapStyle}>
              <input
                type="number"
                placeholder="Cost"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent outline-none text-sm text-[#cdcacc] flex-1"
              />
              <span className="text-xs text-[#cdcacc]/60 shrink-0">{currency}</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between">
          <span className="text-xs text-[#cdcacc]">Order Value</span>
          <span className="text-xs text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            {orderValue.toFixed(4)} {symbol.split("/")[0]}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-[#cdcacc]">Trigger Fee</span>
          <span className="text-xs text-white">${triggerFee.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => executeTrade("long")}
          disabled={!!loading}
          className="rounded-full h-10 text-sm font-semibold"
          style={{ background: "#e9d758", color: "#0e0e52" }}
        >
          {loading === "long" ? "..." : "Open Long"}
        </Button>
        <Button
          onClick={() => executeTrade("short")}
          disabled={!!loading}
          className="rounded-full h-10 text-sm font-semibold"
          style={{ background: "#f5a623", color: "#fff" }}
        >
          {loading === "short" ? "..." : "Open Short"}
        </Button>
      </div>
    </div>
  );
}
