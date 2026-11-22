"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, MessageSquare, Mail, Check, Plus, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { format } from "date-fns";
import { toast } from "sonner";
import { User } from "@/lib/types";

interface ChatMsg {
  _id: string;
  name: string;
  email: string;
  message: string;
  reply?: string;
  repliedAt?: string;
  sender?: "user" | "admin";
  user?: { _id: string; name: string; email: string };
  isRead: boolean;
  createdAt: string;
}

export default function AdminChatPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<ChatMsg | null>(null);
  const [replyText, setReplyText] = useState("");

  // New Chat Dialog
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newChatMessage, setNewChatMessage] = useState("");

  const { data: chats = [], isLoading } = useQuery<ChatMsg[]>({
    queryKey: ["admin-chats"],
    queryFn: async () => {
      const { data } = await api.get("/admin/chats");
      return data;
    },
    refetchInterval: 15_000,
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["admin-users-list"],
    queryFn: async () => {
      const { data } = await api.get("/admin/users");
      return data;
    },
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, reply }: { id: string; reply: string }) => {
      const { data } = await api.post(`/admin/chats/${id}/reply`, { reply });
      return data;
    },
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["admin-chats"] });
      setSelected(updated);
      setReplyText("");
      toast.success("Reply sent to user and posted to chat!");
    },
    onError: () => toast.error("Failed to send reply"),
  });

  const sendToUserMutation = useMutation({
    mutationFn: async ({ userId, message }: { userId: string; message: string }) => {
      const { data } = await api.post("/admin/chats/send-to-user", { userId, message });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-chats"] });
      setNewChatOpen(false);
      setSelectedUserId("");
      setNewChatMessage("");
      toast.success("Message sent directly to user's chatbox!");
    },
    onError: () => toast.error("Failed to send message to user"),
  });

  const markRead = async (id: string) => {
    await api.patch(`/admin/chats/${id}/read`);
    qc.invalidateQueries({ queryKey: ["admin-chats"] });
  };

  const unreadCount = chats.filter((c) => !c.isRead && c.sender !== "admin").length;

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">Support Chat Inbox</h2>
          {unreadCount > 0 && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: "#f5a623", color: "#fff" }}
            >
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-[#cdcacc] hidden sm:block">{chats.length} total messages</p>
          <Button
            onClick={() => setNewChatOpen(true)}
            className="rounded-full px-4 h-9 font-semibold flex items-center gap-2"
            style={{ background: "#e9d758", color: "#060614", fontSize: "12px" }}
          >
            <Plus size={14} /> Message User First
          </Button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0" style={{ height: "calc(100vh - 200px)" }}>
        {/* ── Message list ── */}
        <div
          className="flex flex-col overflow-y-auto scrollbar-hidden shrink-0"
          style={{ width: "340px", gap: "8px" }}
        >
          {isLoading
            ? [...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-[16px]" style={{ background: "#150578" }} />
              ))
            : chats.length === 0
            ? (
              <div className="flex flex-col items-center gap-3 py-16 text-[#cdcacc]">
                <MessageSquare size={32} style={{ opacity: 0.3 }} />
                <p className="text-sm">No messages yet</p>
                <Button
                  onClick={() => setNewChatOpen(true)}
                  className="rounded-full text-xs font-medium mt-2"
                  style={{ background: "#f5a623", color: "#fff" }}
                >
                  Start First Chat
                </Button>
              </div>
            )
            : chats.map((chat) => (
                <button
                  key={chat._id}
                  onClick={() => {
                    setSelected(chat);
                    setReplyText("");
                    if (!chat.isRead) markRead(chat._id);
                  }}
                  className="text-left rounded-[16px] p-4 transition-all hover:-translate-y-0.5"
                  style={{
                    background: selected?._id === chat._id ? "rgba(233,215,88,0.12)" : "#150578",
                    border: selected?._id === chat._id
                      ? "1px solid rgba(233,215,88,0.4)"
                      : "1px solid transparent",
                    position: "relative",
                  }}
                >
                  {!chat.isRead && chat.sender !== "admin" && (
                    <span
                      className="absolute top-3 right-3 w-2 h-2 rounded-full"
                      style={{ background: "#f5a623" }}
                    />
                  )}
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <p style={{ fontFamily: "Satoshi", fontSize: "13px", fontWeight: 600, color: "#fff" }}>
                      {chat.name}
                    </p>
                    {chat.sender === "admin" && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: "rgba(233,215,88,0.15)", color: "#e9d758" }}
                      >
                        Outgoing
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: "Satoshi", fontSize: "11px", color: "#cdcacc", marginBottom: "6px" }}>
                    {chat.email}
                  </p>
                  <p
                    style={{
                      fontFamily: "Satoshi",
                      fontSize: "12px",
                      color: "#cdcacc",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "260px",
                    }}
                  >
                    {chat.message}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span style={{ fontFamily: "Satoshi", fontSize: "10px", color: "rgba(205,202,204,0.5)" }}>
                      {format(new Date(chat.createdAt), "dd MMM HH:mm")}
                    </span>
                    {chat.reply && (
                      <span className="flex items-center gap-1" style={{ color: "#10b981", fontSize: "10px" }}>
                        <Check size={10} /> Replied
                      </span>
                    )}
                  </div>
                </button>
              ))}
        </div>

        {/* ── Detail / reply panel ── */}
        {selected ? (
          <div
            className="flex-1 flex flex-col rounded-[20px] overflow-hidden"
            style={{ background: "#150578", minWidth: 0 }}
          >
            {/* Header */}
            <div
              className="px-6 py-4 shrink-0 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div>
                <p style={{ fontFamily: "Satoshi", fontSize: "16px", fontWeight: 600, color: "#fff" }}>
                  {selected.name}
                </p>
                <p style={{ fontFamily: "Satoshi", fontSize: "12px", color: "#cdcacc" }}>
                  {selected.email} · {format(new Date(selected.createdAt), "dd MMM yyyy, HH:mm")}
                </p>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{
                  background: selected.sender === "admin" ? "rgba(233,215,88,0.2)" : "rgba(16,185,129,0.2)",
                  color: selected.sender === "admin" ? "#e9d758" : "#10b981",
                }}
              >
                {selected.sender === "admin" ? "Support Initiated" : "User Inquiry"}
              </span>
            </div>

            {/* Message thread */}
            <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-hidden flex flex-col gap-4">
              <div className="flex flex-col items-start gap-1">
                <span style={{ fontFamily: "Satoshi", fontSize: "11px", color: "#cdcacc" }}>
                  {selected.name} {selected.sender === "admin" ? "(Support message sent to user)" : "wrote:"}
                </span>
                <div
                  className="rounded-[16px] px-5 py-4 max-w-[80%]"
                  style={{
                    background: selected.sender === "admin" ? "rgba(233,215,88,0.15)" : "rgba(255,255,255,0.06)",
                    border: selected.sender === "admin" ? "1px solid rgba(233,215,88,0.25)" : "none",
                  }}
                >
                  <p style={{ fontFamily: "Satoshi", fontSize: "14px", color: "#fff", lineHeight: "22px" }}>
                    {selected.message}
                  </p>
                </div>
              </div>

              {selected.reply && (
                <div className="flex flex-col items-end gap-1">
                  <span style={{ fontFamily: "Satoshi", fontSize: "11px", color: "#cdcacc" }}>
                    You replied · {selected.repliedAt ? format(new Date(selected.repliedAt), "dd MMM, HH:mm") : ""}
                  </span>
                  <div
                    className="rounded-[16px] px-5 py-4 max-w-[80%]"
                    style={{ background: "rgba(245,166,35,0.2)", border: "1px solid rgba(245,166,35,0.3)" }}
                  >
                    <p style={{ fontFamily: "Satoshi", fontSize: "14px", color: "#fff", lineHeight: "22px" }}>
                      {selected.reply}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: "#10b981" }}>
                    <Mail size={11} /> Sent to user chatbox and email {selected.email}
                  </div>
                </div>
              )}
            </div>

            {/* Reply input */}
            <div
              className="px-6 py-4 shrink-0 flex gap-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${selected.name}... (shows instantly in their chatbox & email)`}
                rows={3}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "16px",
                  padding: "12px 16px",
                  fontFamily: "Satoshi",
                  fontSize: "13px",
                  color: "#fff",
                  outline: "none",
                  resize: "none",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    e.preventDefault();
                    if (replyText.trim()) replyMutation.mutate({ id: selected._id, reply: replyText.trim() });
                  }
                }}
              />
              <button
                onClick={() => {
                  if (replyText.trim())
                    replyMutation.mutate({ id: selected._id, reply: replyText.trim() });
                }}
                disabled={!replyText.trim() || replyMutation.isPending}
                className="flex items-center gap-2 rounded-full px-5 font-medium transition-all hover:opacity-90 disabled:opacity-40 self-end h-10"
                style={{
                  background: "#f5a623",
                  color: "#fff",
                  fontFamily: "Satoshi",
                  fontSize: "13px",
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                {replyMutation.isPending ? "Sending..." : (
                  <>
                    <Send size={14} /> Send Reply
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div
            className="flex-1 flex flex-col items-center justify-center rounded-[20px]"
            style={{ background: "#150578" }}
          >
            <MessageSquare size={40} style={{ color: "rgba(205,202,204,0.2)", marginBottom: "12px" }} />
            <p style={{ fontFamily: "Satoshi", fontSize: "14px", color: "#cdcacc" }}>
              Select a message to view and reply, or message a registered user first.
            </p>
          </div>
        )}
      </div>

      {/* ── Dialog: Message User First ── */}
      <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
        <DialogContent
          className="rounded-[20px] max-w-md border-0 text-white"
          style={{ background: "#150578", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "Satoshi", fontSize: "20px", color: "#fff" }}>
              Message User First
            </DialogTitle>
            <DialogDescription style={{ color: "#cdcacc", fontSize: "13px" }}>
              Send a direct chat message to any registered user. It will pop up in their chatbox.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!selectedUserId || !newChatMessage.trim()) {
                toast.error("Please select a user and type a message");
                return;
              }
              sendToUserMutation.mutate({
                userId: selectedUserId,
                message: newChatMessage.trim(),
              });
            }}
            className="flex flex-col gap-4 mt-2"
          >
            <div>
              <label className="text-xs text-[#cdcacc] mb-1.5 block">Select Registered User</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                required
                className="w-full bg-[#0e0e52] border border-white/15 rounded-[12px] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#e9d758]"
              >
                <option value="">-- Choose User --</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-[#cdcacc] mb-1.5 block">Chat Message</label>
              <textarea
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                required
                rows={4}
                placeholder="e.g. Hi there! Welcome to ApexPrime. Let us know if you need assistance setting up your copy trade strategy..."
                className="w-full bg-[#0e0e52] border border-white/15 rounded-[12px] p-3 text-sm text-white outline-none focus:border-[#e9d758] resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={sendToUserMutation.isPending}
              className="rounded-full h-11 font-semibold mt-2"
              style={{ background: "#f5a623", color: "#fff" }}
            >
              {sendToUserMutation.isPending ? "Sending..." : "Send Message to User"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
