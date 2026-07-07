"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { AlertTriangle, Mail, ArrowRight } from "lucide-react";

interface Section {
  id: string;
  title: string;
  isWarning?: boolean;
  items?: string[];
  content?: string;
  email?: string;
}

const sections: Section[] = [
  {
    id: "account-eligibility",
    title: "1. Account Eligibility & Registration",
    items: [
      "1.1 You must provide accurate, complete, and current information during registration.",
      "1.2 Accounts may be verified via Know Your Customer (KYC) and Anti-Money Laundering (AML) procedures."
    ]
  },
  {
    id: "trading-execution",
    title: "2. Trading & Execution",
    items: [
      "2.1 The Platform provides access to trade Stocks, ETFs, Cryptocurrencies, and other assets (“Assets”).",
      "2.2 Trades are executed based on market conditions; we do not guarantee execution at a specific price.",
      "2.3 All trading is subject to market hours, liquidity, and regulatory requirements.",
      "2.4 We may suspend or limit trading in extraordinary circumstances, including market disruptions or compliance requirements."
    ]
  },
  {
    id: "fees-payments",
    title: "3. Fees & Payments",
    items: [
      "3.1 Fees, commissions, or spreads will be displayed before execution.",
      "3.2 All payments and withdrawals are subject to verification and applicable regulations.",
      "3.3 You are responsible for taxes arising from trades or earnings."
    ]
  },
  {
    id: "risk-disclosure",
    title: "4. Risk Disclosure",
    isWarning: true,
    items: [
      "4.1 Trading carries a high risk of loss. Past performance is not indicative of future results.",
      "4.2 Cryptocurrencies and tokenized assets may be highly volatile and illiquid.",
      "4.3 You should not trade with funds you cannot afford to lose.",
      "4.4 We are not responsible for losses incurred due to market conditions, technical issues, or third-party failures."
    ]
  },
  {
    id: "copy-trading",
    title: "5. Copy-Trading",
    items: [
      "5.1 By using Copy-Trading, you authorize the Platform to replicate trades of selected strategy providers.",
      "5.2 Copy-Trading performance is historical and not guaranteed.",
      "5.3 You remain responsible for your account and risk exposure.",
      "5.4 We may limit or suspend Copy-Trading functionality at our discretion."
    ]
  },
  {
    id: "tokenized-ira",
    title: "6. Tokenized IRA Terms",
    items: [
      "6.1 Tokenized IRA assets represent ownership via digital tokens; underlying assets are held in accordance with applicable regulations.",
      "6.2 Contributions, withdrawals, and allocations are subject to IRS rules (or local retirement laws).",
      "6.3 Tokenized IRAs are subject to valuation fluctuations; you bear all investment risk."
    ]
  },
  {
    id: "security-privacy",
    title: "7. Security & Privacy",
    items: [
      "7.1 We implement reasonable security measures, including encryption and multi-factor authentication.",
      "7.2 You agree to notify us immediately of any unauthorized account activity.",
      "7.3 Privacy policies govern collection, use, and sharing of personal data."
    ]
  },
  {
    id: "disclaimers-liability",
    title: "8. Disclaimers & Limitation of Liability",
    items: [
      "8.1 The Platform is provided “as is” and without warranties of any kind.",
      "8.2 We are not liable for indirect, incidental, or consequential losses.",
      "8.3 We do not guarantee uninterrupted service or error-free execution."
    ]
  },
  {
    id: "governing-law",
    title: "9. Governing Law & Dispute Resolution",
    items: [
      "9.1 These Terms are governed by the laws of your country.",
      "9.2 Any disputes will be resolved via arbitration or in the competent courts of your country, unless otherwise agreed.",
      "9.3 Users waive the right to class-action claims unless required by law."
    ]
  },
  {
    id: "amendments",
    title: "10. Amendments",
    items: [
      "10.1 We may modify these Terms at any time.",
      "10.2 Changes take effect upon posting on the Platform. Continued use constitutes acceptance."
    ]
  },
  {
    id: "contact-information",
    title: "11. Contact Information",
    content: "For inquiries regarding these Terms:",
    email: "support@primevision.com"
  }
];

export default function TermsPageContent() {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180; // offset for sticky layout header/navbar
      
      // Determine which section is currently active
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const el = document.getElementById(section.id);
        if (el) {
          if (scrollPosition >= el.offsetTop) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 140;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 140;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div style={{ background: "#060614", minHeight: "100vh" }}>
      <Navbar />
      <main className="pt-40 pb-20 px-6 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <h1
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontSize: "48px",
              fontWeight: 500,
              color: "#fff",
              lineHeight: "1.2",
              marginBottom: "16px"
            }}
          >
            Terms of Use
          </h1>
          <p
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "26px",
              color: "#cdcacc",
              maxWidth: "800px"
            }}
          >
            By accessing or using PrimeVision Trades (“we,” “us,” or “the Platform”), you agree to these Terms and Conditions (“Terms”). If you do not agree, you may not use the Platform.
          </p>
        </div>

        {/* Dual-column content layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          {/* Left Column: Table of Contents */}
          <div className="hidden lg:block lg:col-span-1" style={{ position: "sticky", top: "120px" }}>
            <p
              style={{
                fontFamily: "Satoshi, sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                color: "#e9d758",
                marginBottom: "16px"
              }}
            >
              Table of Contents
            </p>
            <ul className="flex flex-col gap-1 list-none p-0 m-0">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        fontFamily: "Satoshi, sans-serif",
                        fontSize: "14px",
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#e9d758" : "#cdcacc",
                        background: isActive ? "rgba(233, 215, 88, 0.06)" : "transparent",
                        border: "none",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        borderLeft: isActive ? "3px solid #e9d758" : "3px solid transparent",
                      }}
                      className="hover:text-white"
                    >
                      {section.title.substring(section.title.indexOf(" ") + 1)}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right Column: Scrollable Content */}
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
            {/* Mobile Dropdown Menu */}
            <div
              className="block lg:hidden rounded-2xl p-5 mb-4"
              style={{
                background: "#150578",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              <label
                htmlFor="mobile-toc"
                style={{
                  fontFamily: "Satoshi, sans-serif",
                  fontSize: "14px",
                  color: "#e9d758",
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500
                }}
              >
                Jump to Section
              </label>
              <select
                id="mobile-toc"
                value={activeSection}
                onChange={handleSelectChange}
                style={{
                  width: "100%",
                  background: "#060614",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  fontFamily: "Satoshi, sans-serif",
                  fontSize: "14px",
                  outline: "none"
                }}
              >
                {sections.map((section) => (
                  <option key={section.id} value={section.id} style={{ background: "#150578" }}>
                    {section.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Document Content Sections */}
            {sections.map((section) => {
              const isWarning = section.isWarning;
              return (
                <section
                  key={section.id}
                  id={section.id}
                  style={{
                    background: isWarning
                      ? "linear-gradient(135deg, #150578 0%, #200458 100%)"
                      : "#150578",
                    borderRadius: "20px",
                    padding: "32px",
                    border: isWarning
                      ? "1px solid rgba(233, 215, 88, 0.3)"
                      : "1px solid rgba(255, 255, 255, 0.05)",
                    transition: "transform 0.2s ease, border-color 0.2s ease"
                  }}
                  className="hover:border-white/10"
                >
                  <h2
                    style={{
                      fontFamily: "Satoshi, sans-serif",
                      fontSize: "22px",
                      fontWeight: 500,
                      color: isWarning ? "#e9d758" : "#fff",
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >
                    {isWarning && <AlertTriangle size={22} className="text-[#e9d758]" />}
                    {section.title}
                  </h2>

                  {section.items && (
                    <ul className="flex flex-col gap-4 list-none p-0 m-0">
                      {section.items.map((item, index) => {
                        // Extract number prefix (e.g. "1.1 ")
                        const parts = item.split(/^(\d+\.\d+)\s+/);
                        const prefix = parts[1];
                        const contentText = parts[2] || item;

                        return (
                          <li
                            key={index}
                            style={{
                              fontFamily: "Satoshi, sans-serif",
                              fontSize: "15px",
                              lineHeight: "24px",
                              color: "#cdcacc",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "12px"
                            }}
                          >
                            {prefix && (
                              <span
                                style={{
                                  color: "#e9d758",
                                  fontWeight: 600,
                                  fontFamily: "Satoshi, sans-serif",
                                  flexShrink: 0
                                }}
                              >
                                {prefix}
                              </span>
                            )}
                            <span style={{ flex: 1 }}>{prefix ? contentText : item}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {section.id === "contact-information" && (
                    <div style={{ marginTop: "10px" }}>
                      <p
                        style={{
                          fontFamily: "Satoshi, sans-serif",
                          fontSize: "15px",
                          lineHeight: "24px",
                          color: "#cdcacc",
                          marginBottom: "20px"
                        }}
                      >
                        {section.content}
                      </p>
                      <a
                        href={`mailto:${section.email}`}
                        className="inline-flex items-center gap-2 rounded-full font-medium transition-all hover:opacity-90"
                        style={{
                          background: "#F77F00",
                          color: "#fff",
                          padding: "12px 32px",
                          fontSize: "15px",
                          fontFamily: "Satoshi, sans-serif",
                          textDecoration: "none"
                        }}
                      >
                        <Mail size={16} />
                        {section.email}
                      </a>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>

        {/* Bottom Heading */}
        <p
          className="text-center py-12"
          style={{ fontFamily: "Satoshi, sans-serif", fontSize: "40px", fontWeight: 500, color: "#e9d758" }}
        >
          Welcome to PrimeVision Trades.
        </p>
      </main>
      <Footer />
    </div>
  );
}
