"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import { CopyTrade, CopyTrader, User } from "@/lib/types";
import { format } from "date-fns";
import { toast } from "sonner";

const statusColor: Record<string, { bg: string; text: string }> = {
  open: { bg: "rgba(233,215,88,0.15)", text: "#e9d758" },
  filled: { bg: "rgba(16,185,129,0.15)", text: "#10b981" },
  cancelled: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
};

const MARKETS = ["crypto", "stocks", "futures"] as const;
const SIDES = ["long", "short"] as const;
const STATUSES = ["open", "filled", "cancelled"] as const;

const EMPTY_CREATE = {
  userId: "",
  traderId: "",
  symbol: "BTC/USD",
  side: "long" as "long" | "short",
  market: "crypto" as "crypto" | "stocks" | "futures",
  amount: "",
  entryPrice: "",
  pnl: "",
  status: "open" as "open" | "filled" | "cancelled",
};

type AdminCopyTrade = CopyTrade & {
  user?: { _id: string; name: string; email: string };
  trader?: { _id: string; name: string };
};

export default function AdminCopyTradesPage() {
  const qc = useQueryClient();

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE);

  // Edit state (inline row editing)
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    amount: string;
    pnl: string;
    status: "open" | "filled" | "cancelled";
    symbol: string;
    side: "long" | "short";
    market: "crypto" | "stocks" | "futures";
    currentPrice: string;
    entryPrice: string;
  } | null>(null);

  // Fetch copy trades
  const { data: copyTrades = [], isLoading } = useQuery<AdminCopyTrade[]>({
    queryKey: ["admin-copy-trades"],
    queryFn: async () => {
      const { data } = await api.get("/admin/copy-trades");
      return data;
    },
  });

  // Fetch users & traders for create form dropdowns
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["admin-users-list"],
    queryFn: async () => {
      const { data } = await api.get("/admin/users");
      return data;
    },
  });

  const { data: traders = [] } = useQuery<CopyTrader[]>({
    queryKey: ["admin-traders"],
    queryFn: async () => {
      const { data } = await api.get("/copy-trading");
      return data;
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (payload: typeof EMPTY_CREATE) => {
      const { data } = await api.post("/admin/copy-trades", {
        ...payload,
        amount: parseFloat(payload.amount) || 0,
        entryPrice: parseFloat(payload.entryPrice) || 0,
        pnl: parseFloat(payload.pnl) || 0,
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-copy-trades"] });
      toast.success("Copy trade added!");
      setCreateOpen(false);
      setCreateForm(EMPTY_CREATE);
    },
    onError: () => toast.error("Failed to add copy trade"),
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Record<string, unknown> }) => {
      const { data } = await api.put(`/admin/copy-trades/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-copy-trades"] });
      toast.success("Copy trade updated!");
      setEditId(null);
      setEditForm(null);
    },
    onError: () => toast.error("Failed to update"),
  });

  const openEdit = (ct: AdminCopyTrade) => {
    setEditId(ct._id);
    setEditForm({
      amount: String(ct.amount),
      pnl: String(ct.pnl ?? 0),
      status: ct.status,
      symbol: ct.symbol,
      side: ct.side,
      market: ct.market,
      currentPrice: String(ct.currentPrice ?? ""),
      entryPrice: String(ct.entryPrice ?? 0),
    });
  };

  const saveEdit = (id: string) => {
    if (!editForm) return;
    updateMutation.mutate({
      id,
      payload: {
        amount: parseFloat(editForm.amount) || 0,
        pnl: parseFloat(editForm.pnl) || 0,
        status: editForm.status,
        symbol: editForm.symbol,
        side: editForm.side,
        market: editForm.market,
        currentPrice: editForm.currentPrice ? parseFloat(editForm.currentPrice) : undefined,
        entryPrice: parseFloat(editForm.entryPrice) || 0,
      },
    });
  };

  const inputStyle =
    "bg-transparent border text-white rounded-[10px] h-8 text-xs focus-visible:ring-1 focus-visible:ring-[#e9d758] px-2";
  const borderStyle = { borderColor: "rgba(255,255,255,0.15)" };
  const modalInputStyle =
    "bg-transparent border text-white rounded-[12px] focus-visible:ring-1 focus-visible:ring-[#e9d758]";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Copied Trades</h2>
        <Button
          onClick={() => setCreateOpen(true)}
          className="rounded-full h-9 px-5 gap-2 text-sm font-medium"
          style={{ background: "#f5a623", color: "#fff" }}
        >
          <Plus size={16} /> Add Copy Trade
        </Button>
      </div>

      <div className="rounded-[20px] overflow-x-auto" style={{ background: "#150578" }}>
        <Table>
          <TableHeader>
            <TableRow style={{ borderBottomColor: "rgba(255,255,255,0.08)" }}>
              {["Date", "User", "Trader", "Symbol", "Side", "Market", "Amount", "Entry", "PnL", "Status", "Actions"].map((h) => (
                <TableHead key={h} className="text-[#cdcacc] text-xs font-medium py-4 whitespace-nowrap">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? [...Array(4)].map((_, i) => (
                  <TableRow key={i} style={{ borderBottomColor: "rgba(255,255,255,0.04)" }}>
                    {[...Array(11)].map((_, j) => (
                      <TableCell key={j} className="py-4">
                        <Skeleton className="h-4 w-16" style={{ background: "rgba(255,255,255,0.05)" }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : copyTrades.map((ct) => {
                  const isEditing = editId === ct._id;
                  const pnl = ct.pnl ?? 0;
                  const userName =
                    ct.user && typeof ct.user === "object" ? ct.user.name : "—";
                  const traderName = ct.traderName || (ct.trader && typeof ct.trader === "object" ? ct.trader.name : "—");

                  return (
                    <TableRow key={ct._id} style={{ borderBottomColor: "rgba(255,255,255,0.04)" }}>
                      <TableCell className="text-[#cdcacc] text-xs py-3 whitespace-nowrap">
                        {format(new Date(ct.createdAt), "MMM d, yy")}
                      </TableCell>
                      <TableCell className="text-white text-xs py-3 whitespace-nowrap">{userName}</TableCell>
                      <TableCell className="text-white text-xs py-3 whitespace-nowrap">{traderName}</TableCell>

                      {/* Symbol */}
                      <TableCell className="py-3">
                        {isEditing ? (
                          <Input
                            value={editForm!.symbol}
                            onChange={(e) => setEditForm((p) => p && ({ ...p, symbol: e.target.value }))}
                            className={inputStyle}
                            style={{ ...borderStyle, width: 90 }}
                          />
                        ) : (
                          <span className="text-white text-xs font-medium" style={{ fontFamily: "Space Grotesk" }}>
                            {ct.symbol}
                          </span>
                        )}
                      </TableCell>

                      {/* Side */}
                      <TableCell className="py-3">
                        {isEditing ? (
                          <select
                            value={editForm!.side}
                            onChange={(e) => setEditForm((p) => p && ({ ...p, side: e.target.value as "long" | "short" }))}
                            className="bg-transparent border text-white rounded-[10px] h-8 text-xs px-2"
                            style={{ borderColor: "rgba(255,255,255,0.15)", width: 72 }}
                          >
                            {SIDES.map((s) => <option key={s} value={s} style={{ background: "#150578" }}>{s}</option>)}
                          </select>
                        ) : (
                          <span
                            className="text-xs font-semibold capitalize"
                            style={{ color: ct.side === "long" ? "#10b981" : "#ef4444" }}
                          >
                            {ct.side}
                          </span>
                        )}
                      </TableCell>

                      {/* Market */}
                      <TableCell className="py-3">
                        {isEditing ? (
                          <select
                            value={editForm!.market}
                            onChange={(e) => setEditForm((p) => p && ({ ...p, market: e.target.value as "crypto" | "stocks" | "futures" }))}
                            className="bg-transparent border text-white rounded-[10px] h-8 text-xs px-2"
                            style={{ borderColor: "rgba(255,255,255,0.15)", width: 80 }}
                          >
                            {MARKETS.map((m) => <option key={m} value={m} style={{ background: "#150578" }}>{m}</option>)}
                          </select>
                        ) : (
                          <span className="text-[#cdcacc] text-xs capitalize">{ct.market}</span>
                        )}
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="py-3">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editForm!.amount}
                            onChange={(e) => setEditForm((p) => p && ({ ...p, amount: e.target.value }))}
                            className={inputStyle}
                            style={{ ...borderStyle, width: 90 }}
                          />
                        ) : (
                          <span className="text-white text-xs" style={{ fontFamily: "Space Grotesk" }}>
                            ${ct.amount.toLocaleString()}
                          </span>
                        )}
                      </TableCell>

                      {/* Entry Price */}
                      <TableCell className="py-3">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editForm!.entryPrice}
                            onChange={(e) => setEditForm((p) => p && ({ ...p, entryPrice: e.target.value }))}
                            className={inputStyle}
                            style={{ ...borderStyle, width: 90 }}
                          />
                        ) : (
                          <span className="text-[#cdcacc] text-xs" style={{ fontFamily: "Space Grotesk" }}>
                            {ct.entryPrice ? `$${ct.entryPrice.toLocaleString()}` : "—"}
                          </span>
                        )}
                      </TableCell>

                      {/* PnL */}
                      <TableCell className="py-3">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editForm!.pnl}
                            onChange={(e) => setEditForm((p) => p && ({ ...p, pnl: e.target.value }))}
                            className={inputStyle}
                            style={{ ...borderStyle, width: 90 }}
                          />
                        ) : (
                          <span
                            className="text-xs font-semibold"
                            style={{ color: pnl >= 0 ? "#10b981" : "#ef4444", fontFamily: "Space Grotesk" }}
                          >
                            {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                          </span>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-3">
                        {isEditing ? (
                          <select
                            value={editForm!.status}
                            onChange={(e) => setEditForm((p) => p && ({ ...p, status: e.target.value as "open" | "filled" | "cancelled" }))}
                            className="bg-transparent border text-white rounded-[10px] h-8 text-xs px-2"
                            style={{ borderColor: "rgba(255,255,255,0.15)", width: 90 }}
                          >
                            {STATUSES.map((s) => <option key={s} value={s} style={{ background: "#150578" }}>{s}</option>)}
                          </select>
                        ) : (
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
                            style={{ background: statusColor[ct.status]?.bg, color: statusColor[ct.status]?.text }}
                          >
                            {ct.status}
                          </span>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-3">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => saveEdit(ct._id)}
                              disabled={updateMutation.isPending}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-[#10b981] transition-colors"
                              title="Save"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => { setEditId(null); setEditForm(null); }}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-red-400 transition-colors"
                              title="Cancel"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => openEdit(ct)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-[#cdcacc] hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
        {!isLoading && copyTrades.length === 0 && (
          <p className="text-sm text-[#cdcacc] text-center py-12">
            No copied trades yet. Click &ldquo;Add Copy Trade&rdquo; to create one for a user.
          </p>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={(o) => { setCreateOpen(o); if (!o) setCreateForm(EMPTY_CREATE); }}>
        <DialogContent style={{ background: "#150578", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", maxWidth: 540 }}>
          <DialogHeader>
            <DialogTitle className="text-white">Add Copy Trade for User</DialogTitle>
            <DialogDescription className="text-[#cdcacc]">
              Create a copied trade position and assign it to a user.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => { e.preventDefault(); createMutation.mutate(createForm); }}
            className="flex flex-col gap-4 mt-2"
          >
            {/* User */}
            <div>
              <Label className="text-[#cdcacc] text-sm mb-1.5 block">User</Label>
              <select
                required
                value={createForm.userId}
                onChange={(e) => setCreateForm((p) => ({ ...p, userId: e.target.value }))}
                className="w-full bg-transparent border text-white rounded-[12px] h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#e9d758]"
                style={{ borderColor: "rgba(255,255,255,0.15)" }}
              >
                <option value="" style={{ background: "#150578" }}>Select user…</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id} style={{ background: "#150578" }}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Trader */}
            <div>
              <Label className="text-[#cdcacc] text-sm mb-1.5 block">Expert Trader</Label>
              <select
                required
                value={createForm.traderId}
                onChange={(e) => setCreateForm((p) => ({ ...p, traderId: e.target.value }))}
                className="w-full bg-transparent border text-white rounded-[12px] h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#e9d758]"
                style={{ borderColor: "rgba(255,255,255,0.15)" }}
              >
                <option value="" style={{ background: "#150578" }}>Select trader…</option>
                {traders.map((t) => (
                  <option key={t._id} value={t._id} style={{ background: "#150578" }}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[#cdcacc] text-sm mb-1.5 block">Symbol</Label>
                <Input
                  value={createForm.symbol}
                  onChange={(e) => setCreateForm((p) => ({ ...p, symbol: e.target.value }))}
                  placeholder="BTC/USD"
                  required
                  className={modalInputStyle}
                  style={borderStyle}
                />
              </div>
              <div>
                <Label className="text-[#cdcacc] text-sm mb-1.5 block">Amount ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={createForm.amount}
                  onChange={(e) => setCreateForm((p) => ({ ...p, amount: e.target.value }))}
                  placeholder="e.g. 500"
                  required
                  className={modalInputStyle}
                  style={borderStyle}
                />
              </div>
              <div>
                <Label className="text-[#cdcacc] text-sm mb-1.5 block">Entry Price</Label>
                <Input
                  type="number"
                  step="any"
                  value={createForm.entryPrice}
                  onChange={(e) => setCreateForm((p) => ({ ...p, entryPrice: e.target.value }))}
                  placeholder="e.g. 43200"
                  className={modalInputStyle}
                  style={borderStyle}
                />
              </div>
              <div>
                <Label className="text-[#cdcacc] text-sm mb-1.5 block">PnL ($)</Label>
                <Input
                  type="number"
                  step="any"
                  value={createForm.pnl}
                  onChange={(e) => setCreateForm((p) => ({ ...p, pnl: e.target.value }))}
                  placeholder="e.g. 120"
                  className={modalInputStyle}
                  style={borderStyle}
                />
              </div>
            </div>

            {/* Side */}
            <div>
              <Label className="text-[#cdcacc] text-sm mb-1.5 block">Side</Label>
              <div className="flex gap-2">
                {SIDES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCreateForm((p) => ({ ...p, side: s }))}
                    className="flex-1 py-2 rounded-[10px] text-sm font-medium capitalize transition-all"
                    style={{
                      background: createForm.side === s
                        ? s === "long" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"
                        : "rgba(14,14,82,0.6)",
                      color: createForm.side === s ? s === "long" ? "#10b981" : "#ef4444" : "#cdcacc",
                      border: `1px solid ${createForm.side === s ? s === "long" ? "#10b981" : "#ef4444" : "rgba(255,255,255,0.15)"}`,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Market */}
            <div>
              <Label className="text-[#cdcacc] text-sm mb-1.5 block">Market</Label>
              <div className="flex gap-2">
                {MARKETS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setCreateForm((p) => ({ ...p, market: m }))}
                    className="flex-1 py-2 rounded-[10px] text-sm capitalize transition-all"
                    style={{
                      background: createForm.market === m ? "#f5a623" : "rgba(14,14,82,0.6)",
                      color: createForm.market === m ? "#fff" : "#cdcacc",
                      border: `1px solid ${createForm.market === m ? "#f5a623" : "rgba(255,255,255,0.15)"}`,
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <Label className="text-[#cdcacc] text-sm mb-1.5 block">Status</Label>
              <div className="flex gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCreateForm((p) => ({ ...p, status: s }))}
                    className="flex-1 py-2 rounded-[10px] text-sm capitalize transition-all"
                    style={{
                      background: createForm.status === s ? statusColor[s]?.bg : "rgba(14,14,82,0.6)",
                      color: createForm.status === s ? statusColor[s]?.text : "#cdcacc",
                      border: `1px solid ${createForm.status === s ? statusColor[s]?.text : "rgba(255,255,255,0.15)"}`,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-full h-10 font-medium mt-1"
              style={{ background: "#f5a623", color: "#fff" }}
            >
              {createMutation.isPending ? "Adding..." : "Add Copy Trade"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
