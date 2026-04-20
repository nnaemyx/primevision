"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import { CopyTrader } from "@/lib/types";
import { toast } from "sonner";

const EMPTY_FORM = {
  name: "",
  copiers: 0,
  roi30d: 0,
  totalProfit: 0,
  winRatio: 0,
  avatar: "/images/trader-avatar.jpg",
};

export default function AdminTradersPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTrader, setEditTrader] = useState<Partial<CopyTrader> | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data: traders = [], isLoading } = useQuery<CopyTrader[]>({
    queryKey: ["admin-traders"],
    queryFn: async () => {
      const { data } = await api.get("/copy-trading");
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: typeof EMPTY_FORM) => {
      const { data } = await api.post("/admin/traders", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-traders"] });
      toast.success("Trader added!");
      setModalOpen(false);
      setForm(EMPTY_FORM);
    },
    onError: () => toast.error("Failed to add trader"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<typeof EMPTY_FORM> }) => {
      const { data } = await api.put(`/admin/traders/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-traders"] });
      toast.success("Trader updated!");
      setModalOpen(false);
      setEditTrader(null);
    },
    onError: () => toast.error("Failed to update trader"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/traders/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-traders"] });
      toast.success("Trader removed");
    },
    onError: () => toast.error("Failed to remove trader"),
  });

  const openAdd = () => {
    setEditTrader(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (trader: CopyTrader) => {
    setEditTrader(trader);
    setForm({
      name: trader.name,
      copiers: trader.copiers,
      roi30d: trader.roi30d,
      totalProfit: trader.totalProfit,
      winRatio: trader.winRatio,
      avatar: trader.avatar || "/images/trader-avatar.jpg",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTrader?._id) {
      updateMutation.mutate({ id: editTrader._id, payload: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const f = (key: keyof typeof EMPTY_FORM, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const inputStyle = "bg-transparent border text-white rounded-[12px] focus-visible:ring-1 focus-visible:ring-[#e9d758]";
  const borderStyle = { borderColor: "rgba(255,255,255,0.15)" };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Expert Traders</h2>
        <Button
          onClick={openAdd}
          className="rounded-full h-9 px-5 gap-2 text-sm font-medium"
          style={{ background: "#f5a623", color: "#fff" }}
        >
          <Plus size={16} /> Add Trader
        </Button>
      </div>

      <div className="rounded-[20px] overflow-hidden" style={{ background: "#150578" }}>
        <Table>
          <TableHeader>
            <TableRow style={{ borderBottomColor: "rgba(255,255,255,0.08)" }}>
              {["Name", "Copiers", "ROI (30D)", "Total Profit", "Win Ratio", "Actions"].map((h) => (
                <TableHead key={h} className="text-[#cdcacc] text-sm font-medium py-4">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? [...Array(4)].map((_, i) => (
                  <TableRow key={i} style={{ borderBottomColor: "rgba(255,255,255,0.04)" }}>
                    {[...Array(6)].map((_, j) => (
                      <TableCell key={j} className="py-4">
                        <Skeleton className="h-4 w-24" style={{ background: "rgba(255,255,255,0.05)" }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : traders.map((t) => (
                  <TableRow key={t._id} style={{ borderBottomColor: "rgba(255,255,255,0.04)" }}>
                    <TableCell className="text-white text-sm py-4 font-medium">{t.name}</TableCell>
                    <TableCell className="text-[#cdcacc] text-sm py-4">{t.copiers.toLocaleString()}</TableCell>
                    <TableCell className="py-4">
                      <span style={{ color: "#10b981", fontFamily: "Space Grotesk", fontSize: "14px" }}>
                        {t.roi30d}%
                      </span>
                    </TableCell>
                    <TableCell className="text-white text-sm py-4" style={{ fontFamily: "Space Grotesk" }}>
                      +{t.totalProfit.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-4">
                      <span style={{ color: "#e9d758", fontFamily: "Space Grotesk", fontSize: "14px" }}>
                        {t.winRatio}%
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(t)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-[#cdcacc] hover:text-white transition-colors"
                          title="Edit trader"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(t._id)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-red-400 hover:text-red-300 transition-colors"
                          title="Remove trader"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {!isLoading && traders.length === 0 && (
          <p className="text-sm text-[#cdcacc] text-center py-12">No expert traders yet. Click &ldquo;Add Trader&rdquo; to create one.</p>
        )}
      </div>

      {/* Add / Edit dialog */}
      <Dialog open={modalOpen} onOpenChange={(o) => { setModalOpen(o); if (!o) setEditTrader(null); }}>
        <DialogContent style={{ background: "#150578", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
          <DialogHeader>
            <DialogTitle className="text-white">{editTrader ? "Edit Trader" : "Add Expert Trader"}</DialogTitle>
            <DialogDescription className="text-[#cdcacc]">
              {editTrader ? `Editing ${editTrader.name}` : "Fill in the trader details below."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div>
              <Label className="text-[#cdcacc] text-sm mb-1.5 block">Name</Label>
              <Input
                value={form.name}
                onChange={(e) => f("name", e.target.value)}
                required
                className={inputStyle}
                style={borderStyle}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[#cdcacc] text-sm mb-1.5 block">Copiers</Label>
                <Input
                  type="number"
                  value={form.copiers}
                  onChange={(e) => f("copiers", parseInt(e.target.value) || 0)}
                  className={inputStyle}
                  style={borderStyle}
                />
              </div>
              <div>
                <Label className="text-[#cdcacc] text-sm mb-1.5 block">ROI 30D (%)</Label>
                <Input
                  type="number"
                  value={form.roi30d}
                  onChange={(e) => f("roi30d", parseFloat(e.target.value) || 0)}
                  className={inputStyle}
                  style={borderStyle}
                />
              </div>
              <div>
                <Label className="text-[#cdcacc] text-sm mb-1.5 block">Total Profit</Label>
                <Input
                  type="number"
                  value={form.totalProfit}
                  onChange={(e) => f("totalProfit", parseFloat(e.target.value) || 0)}
                  className={inputStyle}
                  style={borderStyle}
                />
              </div>
              <div>
                <Label className="text-[#cdcacc] text-sm mb-1.5 block">Win Ratio (%)</Label>
                <Input
                  type="number"
                  value={form.winRatio}
                  onChange={(e) => f("winRatio", parseFloat(e.target.value) || 0)}
                  className={inputStyle}
                  style={borderStyle}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="rounded-full h-10 font-medium mt-1"
              style={{ background: "#f5a623", color: "#fff" }}
            >
              {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : (editTrader ? "Update Trader" : "Add Trader")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
