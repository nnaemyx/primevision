"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";

interface Props {
  balance: number;
  pnlValue: number;
  pnlPercent: number;
}

type ModalType = "deposit" | "withdraw" | null;

export default function PortfolioBalanceCard({ balance, pnlValue, pnlPercent }: Props) {
  const [modal, setModal] = useState<ModalType>(null);
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Crypto");
  const [loading, setLoading] = useState(false);

  const isPositive = pnlValue >= 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = modal === "deposit" ? "/wallet/deposit" : "/wallet/withdraw";
      await api.post(endpoint, { amount: parseFloat(amount), method });
      toast.success(`${modal === "deposit" ? "Deposit" : "Withdrawal"} request submitted!`);
      setModal(null);
      setAmount("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Request failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-[20px] p-7 flex flex-col gap-4" style={{ background: "#150578" }}>
        <p style={{ fontFamily: "Satoshi", fontSize: "20px", fontWeight: 400, color: "#cdcacc", lineHeight: "24px" }}>
          Portfolio Balance
        </p>
        <h2
          className="text-white"
          style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "48px", fontWeight: 700, lineHeight: 1 }}
        >
          ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </h2>

        <div className="flex items-center gap-3">
          <span
            className="px-3 py-1 rounded-full text-sm font-semibold"
            style={{
              fontFamily: "Space Grotesk",
              fontSize: "16px",
              fontWeight: 500,
              background: isPositive ? "rgba(247,127,0,0.2)" : "rgba(239,68,68,0.2)",
              color: isPositive ? "#f77f00" : "#ef4444",
            }}
          >
            {isPositive ? "+" : ""}{pnlPercent.toFixed(1)}%
          </span>
          <span
            style={{ fontFamily: "Space Grotesk", fontSize: "14px", fontWeight: 500, color: "#cdcacc" }}
          >
            Total PnL ${pnlValue.toLocaleString()}/{pnlPercent.toFixed(2)}%
          </span>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            onClick={() => router.push("/dashboard/deposit")}
            className="flex-1 rounded-full h-11 font-semibold text-sm text-white transition-all hover:opacity-90"
            style={{ background: "#f5a623", fontFamily: "Satoshi", fontWeight: 500 }}
          >
            Deposit
          </button>
          <button
            onClick={() => setModal("withdraw")}
            className="flex-1 rounded-full h-11 font-semibold text-sm transition-all hover:opacity-90"
            style={{ border: "1px solid #e9d758", color: "#e9d758", background: "transparent", fontFamily: "Satoshi", fontWeight: 500 }}
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Deposit / Withdraw modal */}
      <Dialog open={!!modal} onOpenChange={() => setModal(null)}>
        <DialogContent style={{ background: "#150578", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
          <DialogHeader>
            <DialogTitle className="text-white capitalize">{modal}</DialogTitle>
            <DialogDescription className="text-[#cdcacc]">
              {modal === "deposit" ? "Add funds to your account" : "Withdraw funds from your account"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div>
              <Label className="text-[#cdcacc] text-sm mb-2 block">Amount (USD)</Label>
              <Input
                type="number"
                min="1"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-[12px]"
              />
            </div>
            <div>
              <Label className="text-[#cdcacc] text-sm mb-2 block">Method</Label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full p-3 rounded-[12px] text-white text-sm"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <option value="Crypto">Crypto</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Trust Wallet">Trust Wallet</option>
              </select>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full h-11 font-semibold mt-1"
              style={{ background: "#f5a623", color: "#fff" }}
            >
              {loading ? "Processing..." : `Submit ${modal}`}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
