"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, UserCheck, UserX, Search } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { User } from "@/lib/types";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", balance: 0, isActive: true, isVerified: true });

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await api.get("/admin/users");
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<User> }) => {
      const { data } = await api.put(`/admin/users/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User updated");
      setEditUser(null);
    },
    onError: () => toast.error("Failed to update user"),
  });

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (user: User) => {
    setEditUser(user);
    setEditForm({ name: user.name, balance: user.balance, isActive: user.isActive, isVerified: user.isVerified });
  };

  const inputStyle = "bg-transparent border text-white rounded-[12px] focus-visible:ring-1 focus-visible:ring-[#e9d758]";
  const inputBorderStyle = { borderColor: "rgba(255,255,255,0.15)" };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">User Management</h2>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Search size={14} style={{ color: "rgba(205,202,204,0.6)" }} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-[#cdcacc] placeholder:text-[#cdcacc]/50 w-52"
          />
        </div>
      </div>

      <div className="rounded-[20px] overflow-hidden" style={{ background: "#150578" }}>
        <Table>
          <TableHeader>
            <TableRow style={{ borderBottomColor: "rgba(255,255,255,0.08)" }}>
              {["Name", "Email", "Balance", "Status", "Verified", "Joined", "Actions"].map((h) => (
                <TableHead key={h} className="text-[#cdcacc] text-sm font-medium py-4">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <TableRow key={i} style={{ borderBottomColor: "rgba(255,255,255,0.04)" }}>
                    {[...Array(7)].map((_, j) => (
                      <TableCell key={j} className="py-4">
                        <Skeleton className="h-4 w-24" style={{ background: "rgba(255,255,255,0.05)" }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : filtered.map((user) => (
                  <TableRow key={user._id} style={{ borderBottomColor: "rgba(255,255,255,0.04)" }}>
                    <TableCell className="text-white text-sm font-medium py-4">{user.name}</TableCell>
                    <TableCell className="text-[#cdcacc] text-sm py-4">{user.email}</TableCell>
                    <TableCell className="text-white text-sm py-4 font-medium" style={{ fontFamily: "Space Grotesk" }}>
                      ${user.balance.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-4">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background: user.isActive ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                          color: user.isActive ? "#10b981" : "#ef4444",
                        }}
                      >
                        {user.isActive ? "Active" : "Suspended"}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background: user.isVerified ? "rgba(233,215,88,0.15)" : "rgba(255,255,255,0.05)",
                          color: user.isVerified ? "#e9d758" : "#cdcacc",
                        }}
                      >
                        {user.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </TableCell>
                    <TableCell className="text-[#cdcacc] text-sm py-4">
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(user)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-[#cdcacc] hover:text-white transition-colors"
                          title="Edit user"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() =>
                            updateMutation.mutate({ id: user._id, payload: { isActive: !user.isActive } })
                          }
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                          title={user.isActive ? "Suspend user" : "Activate user"}
                          style={{ color: user.isActive ? "#ef4444" : "#10b981" }}
                        >
                          {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {!isLoading && filtered.length === 0 && (
          <p className="text-sm text-[#cdcacc] text-center py-10">No users found</p>
        )}
      </div>

      {/* Edit user dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent style={{ background: "#150578", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
          <DialogHeader>
            <DialogTitle className="text-white">Edit User – {editUser?.name}</DialogTitle>
            <DialogDescription className="text-[#cdcacc]">
              Update user account details and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <div>
              <Label className="text-[#cdcacc] text-sm mb-2 block">Full Name</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className={inputStyle} style={inputBorderStyle} />
            </div>
            <div>
              <Label className="text-[#cdcacc] text-sm mb-2 block">Balance ($)</Label>
              <Input
                type="number"
                value={editForm.balance}
                onChange={(e) => setEditForm((f) => ({ ...f, balance: parseFloat(e.target.value) }))}
                className={inputStyle}
                style={inputBorderStyle}
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-[#cdcacc] cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="accent-[#e9d758]"
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm text-[#cdcacc] cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.isVerified}
                  onChange={(e) => setEditForm((f) => ({ ...f, isVerified: e.target.checked }))}
                  className="accent-[#e9d758]"
                />
                Verified
              </label>
            </div>
            <Button
              onClick={() => editUser && updateMutation.mutate({ id: editUser._id, payload: editForm })}
              disabled={updateMutation.isPending}
              className="rounded-full h-10 font-semibold mt-1"
              style={{ background: "#f5a623", color: "#fff" }}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
