"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name ?? "");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put("/users/me", { name });
      updateUser(data);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "bg-transparent border text-white rounded-[12px] focus-visible:ring-1 focus-visible:ring-[#e9d758]";
  const inputWrapStyle = { borderColor: "rgba(255,255,255,0.15)" };

  return (
    <div className="flex flex-col gap-6 max-w-[700px]">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Profile */}
      <div className="rounded-[20px] p-6" style={{ background: "#150578" }}>
        <h2 className="text-base font-semibold text-white mb-5">Profile Information</h2>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <Label className="text-sm text-[#cdcacc] mb-2 block">Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} style={inputWrapStyle} />
          </div>
          <div>
            <Label className="text-sm text-[#cdcacc] mb-2 block">Email</Label>
            <Input value={user?.email ?? ""} disabled className={inputStyle + " opacity-60 cursor-not-allowed"} style={inputWrapStyle} />
          </div>
          <div>
            <Label className="text-sm text-[#cdcacc] mb-2 block">Account Balance</Label>
            <Input value={`$${(user?.balance ?? 0).toLocaleString()}`} disabled className={inputStyle + " opacity-60 cursor-not-allowed font-bold"} style={inputWrapStyle} />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-fit rounded-full px-8 h-10 font-semibold mt-1"
            style={{ background: "#f5a623", color: "#fff" }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>

      {/* Security */}
      <div className="rounded-[20px] p-6" style={{ background: "#150578" }}>
        <h2 className="text-base font-semibold text-white mb-5">Security</h2>
        <div className="flex flex-col gap-4">
          <div>
            <Label className="text-sm text-[#cdcacc] mb-2 block">New Password</Label>
            <Input type="password" placeholder="Enter new password" className={inputStyle} style={inputWrapStyle} />
          </div>
          <div>
            <Label className="text-sm text-[#cdcacc] mb-2 block">Confirm Password</Label>
            <Input type="password" placeholder="Confirm new password" className={inputStyle} style={inputWrapStyle} />
          </div>
          <Button className="w-fit rounded-full px-8 h-10 font-semibold" style={{ background: "#f5a623", color: "#fff" }}>
            Update Password
          </Button>
        </div>
      </div>
    </div>
  );
}
