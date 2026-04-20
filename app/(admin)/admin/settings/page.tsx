"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [adminEmail, setAdminEmail] = useState(process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@crestlinetrades.com");
  const [saving, setSaving] = useState(false);

  const inputStyle = "bg-transparent border text-white rounded-[12px] focus-visible:ring-1 focus-visible:ring-[#e9d758]";
  const inputBorderStyle = { borderColor: "rgba(255,255,255,0.15)" };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Settings saved");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[700px]">
      <h2 className="text-xl font-bold text-white">Admin Settings</h2>

      {/* Platform configuration */}
      <div className="rounded-[20px] p-6" style={{ background: "#150578" }}>
        <h3 className="text-base font-semibold text-white mb-5">Platform Configuration</h3>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <Label className="text-[#cdcacc] text-sm mb-2 block">Admin Notification Email</Label>
            <Input
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className={inputStyle}
              style={inputBorderStyle}
              placeholder="admin@crestlinetrades.com"
            />
            <p className="text-xs text-[#cdcacc]/60 mt-1">
              Email where chat messages, seed phrases and withdrawal notifications are sent.
            </p>
          </div>
          <div>
            <Label className="text-[#cdcacc] text-sm mb-2 block">Platform Name</Label>
            <Input defaultValue="CrestlineTrades" className={inputStyle} style={inputBorderStyle} />
          </div>
          <div>
            <Label className="text-[#cdcacc] text-sm mb-2 block">Support Email</Label>
            <Input defaultValue="support@crestlinetrades.com" className={inputStyle} style={inputBorderStyle} />
          </div>
          <Button
            type="submit"
            disabled={saving}
            className="w-fit rounded-full px-8 h-10 font-semibold"
            style={{ background: "#f5a623", color: "#fff" }}
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </div>

      {/* Security */}
      <div className="rounded-[20px] p-6" style={{ background: "#150578" }}>
        <h3 className="text-base font-semibold text-white mb-5">Admin Password</h3>
        <div className="flex flex-col gap-4">
          <div>
            <Label className="text-[#cdcacc] text-sm mb-2 block">New Password</Label>
            <Input type="password" placeholder="Enter new password" className={inputStyle} style={inputBorderStyle} />
          </div>
          <div>
            <Label className="text-[#cdcacc] text-sm mb-2 block">Confirm Password</Label>
            <Input type="password" placeholder="Confirm new password" className={inputStyle} style={inputBorderStyle} />
          </div>
          <Button className="w-fit rounded-full px-8 h-10 font-semibold" style={{ background: "#f5a623", color: "#fff" }}>
            Update Password
          </Button>
        </div>
      </div>

      {/* Quick links */}
      <div className="rounded-[20px] p-6" style={{ background: "#150578" }}>
        <h3 className="text-base font-semibold text-white mb-4">Quick Navigation</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "View All Users", href: "/admin/users" },
            { label: "Pending Transactions", href: "/admin/transactions?status=pending" },
            { label: "Expert Traders", href: "/admin/traders" },
            { label: "Login Activity", href: "/admin/activity" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-[12px] p-3 text-sm text-white hover:bg-white/10 transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {l.label} →
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
