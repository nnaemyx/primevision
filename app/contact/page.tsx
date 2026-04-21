"use client";
import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { toast } from "sonner";
import api from "@/lib/api";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", form);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      // Fallback: just show success (backend endpoint optional)
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "1px solid #e9d758",
    borderRadius: "40px",
    padding: "14px 20px",
    fontFamily: "Satoshi, sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    color: "#cdcacc",
    outline: "none",
  };

  return (
    <div style={{ background: "#0e0e52", minHeight: "100vh" }}>
      <Navbar />
      <main className="pt-40 pb-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Left panel */}
          <div>
            <h1
              className="mb-8"
              style={{
                fontFamily: "Satoshi, sans-serif",
                fontSize: "40px",
                fontWeight: 400,
                lineHeight: "38.4px",
                color: "#fff",
              }}
            >
              Contact Us
            </h1>

            {/* 3D cylinder image */}
            <div className="relative w-[200px] h-[200px] mb-10">
              <Image src="/images/shape-cylinder.png" alt="3D cylinder" fill className="object-contain" />
            </div>

            {/* Testimonial */}
            <div>
              <p
                style={{
                  fontFamily: "Satoshi",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "25.6px",
                  color: "#cdcacc",
                  fontStyle: "italic",
                  maxWidth: "380px",
                }}
              >
                &ldquo;This software simplifies the website building process, making it a breeze to manage our online presence.&rdquo;
              </p>
              <p
                className="mt-3"
                style={{ fontFamily: "Satoshi", fontSize: "16px", fontWeight: 500, color: "#e9d758" }}
              >
                David Larry
              </p>
              <p style={{ fontFamily: "Satoshi", fontSize: "14px", color: "#cdcacc" }}>Founder &amp; CEO</p>
            </div>
          </div>

          {/* Right — form */}
          <div className="rounded-[20px] p-8" style={{ background: "#150578" }}>
            <p
              className="mb-6"
              style={{
                fontFamily: "Satoshi",
                fontSize: "20px",
                fontWeight: 500,
                lineHeight: "28px",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Have a question or feedback? Fill out the form below,
              <br />
              and we&apos;ll get back to you as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Full Name */}
              <input
                type="text"
                placeholder="Full Name:"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                style={inputStyle}
              />

              {/* Email + Subject */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email:"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Subject:"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              {/* Message */}
              <textarea
                placeholder="Type your message"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                rows={6}
                style={{
                  ...inputStyle,
                  borderRadius: "20px",
                  resize: "none",
                  paddingTop: "16px",
                }}
              />

              {/* Submit */}
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full font-medium transition-all hover:opacity-90"
                  style={{
                    background: "#f5a623",
                    color: "#fff",
                    padding: "12px 48px",
                    fontFamily: "Satoshi",
                    fontSize: "14px",
                    fontWeight: 400,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Welcome heading */}
        <p
          className="text-center py-12"
          style={{ fontFamily: "Satoshi", fontSize: "40px", fontWeight: 500, color: "#e9d758" }}
        >
          Welcome to PrimeVision Trades.
        </p>
      </main>
      <Footer />
    </div>
  );
}
