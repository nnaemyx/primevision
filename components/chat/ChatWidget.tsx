"use client";
import { useState, useRef, useEffect } from "react";
import { X, Send, MessageSquare } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  from: "user" | "support";
  time: string;
}

const now = () =>
  new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

export default function ChatWidget() {
  const { user, isAuthenticated } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      text: "Welcome to PrimeVision Trades support! How can we help you today?",
      from: "support",
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    } catch {
      // Best effort — we don't block the UI
    } finally {
      setSending(false);
    }
    // Auto-reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "r",
          text: "Thank you for your message! Our support team will respond to you shortly via email.",
          from: "support",
          time: now(),
        },
      ]);
    }, 1200);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-[88px] right-5 z-50 flex flex-col rounded-[20px] overflow-hidden shadow-2xl"
          style={{
            width: "320px",
            height: "420px",
            background: "#150578",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ background: "#0e0e52", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "#e9d758" }}
              >
                <MessageSquare size={14} style={{ color: "#0e0e52" }} />
              </div>
              <div>
                <p style={{ fontFamily: "Satoshi", fontSize: "13px", fontWeight: 600, color: "#fff" }}>
                  Live Support
                </p>
                <p style={{ fontFamily: "Satoshi", fontSize: "10px", color: "#10b981" }}>
                  ● Online
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-[#cdcacc] hover:text-white">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5 scrollbar-hidden">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.from === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className="max-w-[80%] px-3 py-2 rounded-[12px]"
                  style={{
                    background: msg.from === "user" ? "#f5a623" : "rgba(255,255,255,0.08)",
                    borderRadius: msg.from === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                  }}
                >
                  <p style={{ fontFamily: "Satoshi", fontSize: "12px", color: "#fff", lineHeight: "18px" }}>
                    {msg.text}
                  </p>
                </div>
                <span style={{ fontFamily: "Satoshi", fontSize: "9px", color: "rgba(205,202,204,0.5)", marginTop: "2px" }}>
                  {msg.time}
                </span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-2 px-3 py-2 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your message..."
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                padding: "8px 12px",
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
              style={{ width: "32px", height: "32px", background: "#e9d758" }}
            >
              <Send size={14} style={{ color: "#0e0e52" }} />
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full transition-all hover:scale-105"
        style={{
          background: "#150578",
          padding: "12px 20px 12px 20px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        <span style={{ fontFamily: "Satoshi", fontSize: "15px", fontWeight: 400, color: "#cdcacc" }}>
          Chat
        </span>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "#e9d758" }}
        >
          <MessageSquare size={18} style={{ color: "#0e0e52" }} />
        </div>
      </button>
    </>
  );
}
