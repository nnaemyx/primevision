"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Edit2, Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";

interface DepositAddress {
  _id?: string;
  symbol: string;
  name: string;
  address: string;
  color: string;
}

const DEFAULT_COINS: DepositAddress[] = [
  { symbol: "BTC",  name: "Bitcoin",    address: "", color: "#f7931a" },
  { symbol: "ETH",  name: "Ethereum",   address: "", color: "#627eea" },
  { symbol: "USDT", name: "USD Tether", address: "", color: "#26a17b" },
  { symbol: "SOL",  name: "Solana",     address: "", color: "#9945ff" },
];

function CoinBadge({ symbol, color }: { symbol: string; color: string }) {
  const icons: Record<string, string> = { BTC: "₿", ETH: "Ξ", USDT: "₮", SOL: "◎" };
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
      style={{ background: "#0e0e52", color }}
    >
      {icons[symbol] ?? symbol.slice(0, 1)}
    </div>
  );
}

export default function AdminDepositAddressesPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [draftAddress, setDraftAddress] = useState("");

  const { data: savedAddresses = [], isLoading } = useQuery<DepositAddress[]>({
    queryKey: ["admin-deposit-addresses"],
    queryFn: async () => {
      const { data } = await api.get("/admin/deposit-addresses");
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: DepositAddress) => {
      const { data } = await api.put("/admin/deposit-addresses", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-deposit-addresses"] });
      toast.success("Address saved successfully");
      setEditing(null);
      setDraftAddress("");
    },
    onError: () => toast.error("Failed to save address"),
  });

  // Merge saved DB data with default coin list
  const coins: DepositAddress[] = DEFAULT_COINS.map((coin) => {
    const saved = savedAddresses.find((s) => s.symbol === coin.symbol);
    return saved ?? coin;
  });

  const handleEdit = (coin: DepositAddress) => {
    setEditing(coin.symbol);
    setDraftAddress(coin.address);
  };

  const handleSave = (coin: DepositAddress) => {
    if (!draftAddress.trim()) {
      toast.error("Address cannot be empty");
      return;
    }
    saveMutation.mutate({ ...coin, address: draftAddress.trim() });
  };

  return (
    <div className="flex flex-col gap-5 max-w-[800px]">
      <div>
        <h2 className="text-xl font-bold text-white">Deposit Wallet Addresses</h2>
        <p className="text-sm text-[#cdcacc] mt-1">
          Manage the crypto addresses users will see on the deposit page. Changes take effect immediately.
        </p>
      </div>

      {/* Info banner */}
      <div
        className="rounded-[12px] px-4 py-3 text-sm"
        style={{ background: "rgba(233,215,88,0.08)", border: "1px solid rgba(233,215,88,0.25)", color: "#e9d758" }}
      >
        💡 Click the edit icon next to any coin to update its deposit address. Users will see the updated address in real-time.
      </div>

      <div className="flex flex-col gap-3">
        {coins.map((coin) => {
          const isEditing = editing === coin.symbol;
          const isSaving = saveMutation.isPending && editing === coin.symbol;
          return (
            <div
              key={coin.symbol}
              className="rounded-[20px] p-5 flex flex-col gap-4"
              style={{ background: "#150578" }}
            >
              {/* Coin header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CoinBadge symbol={coin.symbol} color={coin.color} />
                  <div>
                    <p style={{ fontFamily: "Satoshi", fontSize: "15px", fontWeight: 600, color: "#fff" }}>
                      {coin.name}
                    </p>
                    <p style={{ fontFamily: "Satoshi", fontSize: "12px", color: "#cdcacc" }}>{coin.symbol}</p>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => handleEdit(coin)}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all hover:bg-white/10"
                    style={{ color: "#e9d758", border: "1px solid rgba(233,215,88,0.3)" }}
                  >
                    <Edit2 size={12} />
                    Edit Address
                  </button>
                )}
              </div>

              {/* Current address (read state) */}
              {!isEditing && (
                <div
                  className="px-4 py-3 rounded-[12px]"
                  style={{ background: "rgba(14,14,82,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {coin.address ? (
                    <p style={{ fontFamily: "Space Grotesk, monospace", fontSize: "13px", color: "#cdcacc", wordBreak: "break-all", lineHeight: "1.6", margin: 0 }}>
                      {coin.address}
                    </p>
                  ) : (
                    <p style={{ fontFamily: "Satoshi", fontSize: "13px", color: "rgba(205,202,204,0.4)", margin: 0 }}>
                      No address set — click Edit to add one
                    </p>
                  )}
                </div>
              )}

              {/* Edit state */}
              {isEditing && (
                <div className="flex flex-col gap-3">
                  <Label className="text-sm text-[#cdcacc]">New Wallet Address</Label>
                  <Input
                    value={draftAddress}
                    onChange={(e) => setDraftAddress(e.target.value)}
                    placeholder={`Enter ${coin.symbol} wallet address`}
                    className="rounded-[12px] bg-transparent text-white focus-visible:ring-1 focus-visible:ring-[#e9d758]"
                    style={{ borderColor: "rgba(255,255,255,0.15)", fontFamily: "Space Grotesk, monospace", fontSize: "13px" }}
                  />
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => handleSave(coin)}
                      disabled={isSaving}
                      className="rounded-full h-9 px-6 font-semibold text-sm flex items-center gap-2"
                      style={{ background: "#f5a623", color: "#fff" }}
                    >
                      <Save size={14} />
                      {isSaving ? "Saving..." : "Save Address"}
                    </Button>
                    <button
                      onClick={() => { setEditing(null); setDraftAddress(""); }}
                      className="text-sm text-[#cdcacc] hover:text-white px-4 py-1.5 rounded-full hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
