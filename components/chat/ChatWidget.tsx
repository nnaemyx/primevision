"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, MessageSquare, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";

interface Message {
  id: string;
  text: string;
  from: "user" | "support";
  time: string;
}

const now = (d?: Date | string) => {
  const date = d ? new Date(d) : new Date();
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

export default function ChatWidget() {
  const { user, isAuthenticated } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-default",
      text: "Welcome to ApexPrime support! How can we assist you today?",
      from: "support",
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch messages from backend for logged in user
  const fetchMyMessages = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await api.get("/chat/my-messages");
      if (Array.isArray(data) && data.length > 0) {
        const formatted: Message[] = [];
        let hasNewAdminMsg = false;
        let latestAdmin = "";

        data.forEach((item: {
          _id: string;
          message: string;
          reply?: string;
          sender?: string;
          isRead?: boolean;
          createdAt: string;
          repliedAt?: string;
        }) => {
          if (item.sender === "admin") {
            formatted.push({
              id: item._id,
              text: item.message,
              from: "support",
              time: now(item.createdAt),
            });
            if (!item.isRead) {
              hasNewAdminMsg = true;
              latestAdmin = item.message;
            }
          } else {
            // User message
            formatted.push({
              id: item._id,
              text: item.message,
              from: "user",
              time: now(item.createdAt),
            });
            // If replied via reply field
            if (item.reply) {
              formatted.push({
                id: item._id + "_reply",
                text: item.reply,
                from: "support",
                time: now(item.repliedAt || item.createdAt),
              });
            }
          }
        });

        if (formatted.length > 0) {
          setMessages(formatted);
        }

        if (hasNewAdminMsg && latestAdmin) {
          setPopupMessage(latestAdmin);
          setUnreadCount((c) => Math.max(c, 1));
          setShowPopup(true);
        }
      }
    } catch {
      // Best effort
    }
  }, [isAuthenticated]);

  // Initial load & check if user just registered
  useEffect(() => {
    fetchMyMessages();

    // Check if the user just registered
    if (typeof window !== "undefined") {
      const justRegistered = sessionStorage.getItem("apex_just_registered");
      if (justRegistered) {
        sessionStorage.removeItem("apex_just_registered");
        // Pop up greeting message after 1.2s delay
        const timer = setTimeout(() => {
          setPopupMessage(`Welcome to ApexPrime, ${user?.name?.split(" ")[0] || "Trader"}! 👋 Our team is live and ready to help you fund your account or select an expert copy trader.`);
          setShowPopup(true);
          setUnreadCount(1);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [fetchMyMessages, user?.name]);

  // Periodic polling for new messages if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    pollTimerRef.current = setInterval(() => {
      fetchMyMessages();
    }, 12000);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [isAuthenticated, fetchMyMessages]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setUnreadCount(0);
      setShowPopup(false);
    }
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: Date.now().toString(), text, from: "user", time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      await api.post("/chat/message", {
        name: user?.name ?? "Guest",
        email: user?.email ?? "guest@unknown.com",
        message: text,
        userId: user?._id,
      });
      // Refresh thread
      fetchMyMessages();
    } catch {
      // Best effort
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Pop up message balloon when registered / new support message ── */}
      {showPopup && !open && (
        <div
          className="fixed bottom-[146px] md:bottom-[78px] right-5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-[20px] p-4 shadow-2xl flex flex-col gap-2.5"
          style={{
            position: "fixed",
            zIndex: 9999,
            width: "310px",
            background: "#150578",
            border: "1px solid rgba(233,215,88,0.4)",
            boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "#e9d758", color: "#060614" }}
              >
                <Sparkles size={14} />
              </div>
              <div>
                <p style={{ fontFamily: "Satoshi", fontSize: "12px", fontWeight: 700, color: "#fff" }}>
                  ApexPrime Support
                </p>
                <p style={{ fontFamily: "Satoshi", fontSize: "10px", color: "#10b981" }}>
                  ● Available Now
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="text-[#cdcacc] hover:text-white p-1 rounded-full transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <p
            style={{
              fontFamily: "Satoshi",
              fontSize: "12px",
              color: "#cdcacc",
              lineHeight: "18px",
            }}
          >
            {popupMessage || `Hi ${user?.name?.split(" ")[0] || "there"}! 👋 Have questions about copying traders or making your first trade? Chat with us live!`}
          </p>

          <button
            onClick={() => {
              setOpen(true);
              setShowPopup(false);
            }}
            className="w-full py-2 rounded-full font-semibold transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            style={{
              background: "#e9d758",
              color: "#060614",
              fontFamily: "Satoshi",
              fontSize: "12px",
            }}
          >
            <MessageSquare size={13} />
            Open Chat
          </button>
        </div>
      )}

      {/* ── Main Chat Panel ── */}
      {open && (
        <div
          className="fixed bottom-[156px] md:bottom-[88px] right-5 z-50 flex flex-col rounded-[20px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          style={{
            position: "fixed",
            zIndex: 9999,
            width: "330px",
            height: "440px",
            background: "#150578",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ background: "#060614", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "#e9d758" }}
              >
                <MessageSquare size={14} style={{ color: "#060614" }} />
              </div>
              <div>
                <p style={{ fontFamily: "Satoshi", fontSize: "13px", fontWeight: 700, color: "#fff" }}>
                  ApexPrime Live Support
                </p>
                <p style={{ fontFamily: "Satoshi", fontSize: "10px", color: "#10b981" }}>
                  ● Instant Response
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-[#cdcacc] hover:text-white p-1 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3.5 py-3.5 flex flex-col gap-2.5 scrollbar-hidden">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.from === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className="max-w-[84%] px-3.5 py-2.5"
                  style={{
                    background: msg.from === "user" ? "#f5a623" : "rgba(255,255,255,0.08)",
                    borderRadius: msg.from === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                    border: msg.from === "support" ? "1px solid rgba(255,255,255,0.08)" : "none",
                  }}
                >
                  <p style={{ fontFamily: "Satoshi", fontSize: "12px", color: "#fff", lineHeight: "18px" }}>
                    {msg.text}
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: "Satoshi",
                    fontSize: "9px",
                    color: "rgba(205,202,204,0.5)",
                    marginTop: "2px",
                    paddingInline: "4px",
                  }}
                >
                  {msg.time}
                </span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-2 px-3 py-2.5 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "#060614" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your message..."
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "20px",
                padding: "8px 14px",
                fontFamily: "Satoshi",
                fontSize: "12px",
                color: "#fff",
                outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              className="flex items-center justify-center rounded-full shrink-0 transition-all hover:scale-105 disabled:opacity-50"
              style={{ width: "34px", height: "34px", background: "#e9d758" }}
            >
              <Send size={14} style={{ color: "#060614" }} />
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Launcher Button ── */}
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setShowPopup(false);
        }}
        className="fixed bottom-[84px] md:bottom-5 right-5 z-50 flex items-center gap-3 rounded-full transition-all hover:scale-105 shrink-0"
        style={{
          position: "fixed",
          zIndex: 9999,
          background: "#150578",
          padding: "10px 18px",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          cursor: "pointer",
        }}
      >
        <span style={{ fontFamily: "Satoshi", fontSize: "14px", fontWeight: 500, color: "#cdcacc" }}>
          Chat with Us
        </span>
        <div
          className="relative w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "#e9d758" }}
        >
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-[#060614] animate-bounce"
              style={{ background: "#f5a623" }}
            >
              {unreadCount}
            </span>
          )}
          <MessageSquare size={17} style={{ color: "#0e0e52" }} />
        </div>
      </button>
    </>
  );
}
