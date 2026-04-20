"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Unlink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";

const WALLETS = [
  "Kraken Wallet", "Metamask", "Crypto Wallet", "Coinbase Wallet",
  "Phantom Wallet", "Uniswap", "Coinbase Wallet", "Trust Wallet",
  "Binance Wallet", "Safepal Wallet", "Bitpay", "Exodus Wallet",
];

interface ConnectedWallet {
  _id: string;
  exchange: string;
  isConnected: boolean;
  createdAt: string;
}

export default function WalletPage() {
  const qc = useQueryClient();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [seedPhrase, setSeedPhrase] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: connectedWallets = [] } = useQuery<ConnectedWallet[]>({
    queryKey: ["my-wallets"],
    queryFn: async () => {
      const { data } = await api.get("/wallet");
      return data;
    },
  });

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet) return;
    setLoading(true);
    try {
      await api.post("/wallet/connect", { exchange: selectedWallet, seedPhrase });
      toast.success(`${selectedWallet} connected successfully!`);
      setSelectedWallet(null);
      setSeedPhrase("");
      qc.invalidateQueries({ queryKey: ["my-wallets"] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Connection failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (id: string, exchange: string) => {
    try {
      await api.delete(`/wallet/${id}`);
      toast.success(`${exchange} disconnected`);
      qc.invalidateQueries({ queryKey: ["my-wallets"] });
    } catch {
      toast.error("Failed to disconnect wallet");
    }
  };

  const isConnected = (name: string) =>
    connectedWallets.some((w) => w.exchange === name && w.isConnected);
  const getWallet = (name: string) =>
    connectedWallets.find((w) => w.exchange === name);

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      {/* Banner */}
      <div
        className="relative rounded-[20px] overflow-hidden p-8 min-h-[160px] flex flex-col justify-center"
        style={{ backgroundImage: "url(/images/bg-wallet.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)" }} />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-1">
            Connect <span style={{ color: "#e9d758" }}>Wallet</span>
          </h1>
          <p className="text-sm text-[#cdcacc] max-w-lg">
            Link your wallet to access premium features. Crestline Trades offers support to over 500 exchanges and more than 10,000 cryptocurrencies.
          </p>
        </div>
      </div>

      {/* Connected wallets section */}
      {connectedWallets.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-white mb-3">Your Connected Wallets</h3>
          <div className="flex flex-wrap gap-3">
            {connectedWallets.map((w) => (
              <div
                key={w._id}
                className="flex items-center gap-3 rounded-[16px] px-4 py-3"
                style={{ background: "#150578", border: "1px solid rgba(16,185,129,0.4)" }}
              >
                <CheckCircle size={16} style={{ color: "#10b981" }} />
                <span style={{ fontFamily: "Satoshi", fontSize: "14px", color: "#fff" }}>{w.exchange}</span>
                <button
                  onClick={() => handleDisconnect(w._id, w.exchange)}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                  title="Disconnect"
                >
                  <Unlink size={12} />
                  Disconnect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wallet provider grid */}
      <div>
        <h3 className="text-base font-semibold text-white mb-3">
          {connectedWallets.length > 0 ? "Connect Another Wallet" : "Choose a Wallet Provider"}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {WALLETS.map((wallet) => {
            const connected = isConnected(wallet);
            return (
              <button
                key={wallet + Math.random()}
                onClick={() => !connected && setSelectedWallet(wallet)}
                className="rounded-[20px] p-5 flex items-center gap-3 text-left transition-all duration-200"
                style={{
                  background: "#150578",
                  border: connected ? "1px solid #10b981" : "1px solid transparent",
                  cursor: connected ? "default" : "pointer",
                  opacity: connected ? 0.7 : 1,
                }}
              >
                <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center" style={{ background: "#0e0e52" }}>
                  {connected && <CheckCircle size={16} style={{ color: "#10b981" }} />}
                </div>
                <div>
                  <span style={{ fontFamily: "Satoshi", fontSize: "13px", fontWeight: 500, color: "#fff" }}>{wallet}</span>
                  {connected && <p style={{ fontFamily: "Satoshi", fontSize: "10px", color: "#10b981" }}>Connected</p>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Connect modal */}
      <Dialog open={!!selectedWallet} onOpenChange={() => { setSelectedWallet(null); setSeedPhrase(""); }}>
        <DialogContent className="max-w-[500px]" style={{ background: "#150578", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Connect Wallet</DialogTitle>
            <DialogDescription className="text-[#cdcacc]">
              Connect your wallet for easy deposit and withdrawal and start enjoying your account&apos;s additional benefits
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleConnect} className="flex flex-col gap-5 mt-2">
            <div>
              <Label className="text-sm text-[#cdcacc] mb-2 block">Exchange</Label>
              <div className="px-4 py-3 rounded-[40px] text-sm text-white" style={{ border: "1px solid #e9d758" }}>
                {selectedWallet}
              </div>
            </div>
            <div>
              <Label className="text-sm text-[#cdcacc] mb-2 block">Seed Phrase</Label>
              <Textarea
                value={seedPhrase}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSeedPhrase(e.target.value)}
                placeholder="Enter your seed phrase..."
                rows={4}
                className="rounded-[20px] bg-transparent border resize-none text-white placeholder:text-[#cdcacc]/40 focus-visible:ring-1 focus-visible:ring-[#e9d758]"
                style={{ borderColor: "#e9d758" }}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full rounded-full h-12 font-semibold" style={{ background: "#f5a623", color: "#fff" }}>
              {loading ? "Connecting..." : "Connect Wallet"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
