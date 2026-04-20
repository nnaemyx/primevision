import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Footer() {
  return (
    <footer className="px-6 pb-6 pt-0" style={{ background: "#0e0e52" }}>
      <div
        className="max-w-6xl mx-auto rounded-[20px] px-10 py-12"
        style={{ background: "#150578" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <p
              className="font-bold text-white mb-4"
              style={{ fontFamily: "Satoshi, sans-serif", fontSize: "28px", lineHeight: "36.4px" }}
            >
              Primevision <span style={{ color: "#e9d758" }}>Trades</span>
            </p>
            <p
              className="leading-relaxed"
              style={{ fontFamily: "Satoshi", fontSize: "16px", fontWeight: 500, color: "#cdcacc", lineHeight: "26px" }}
            >
              Partner with the world&apos;s largest retail broker and trade under exceptional market conditions
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {["Terms and Conditions", "Customer Service", "About Us"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm text-[#cdcacc] hover:text-white transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Services</h4>
            <ul className="flex flex-col gap-3">
              {["Stocks and Options", "Futures", "Crypto Futures", "Copy Trading"].map((s) => (
                <li key={s}>
                  <Link href="#" className="text-sm text-[#cdcacc] hover:text-white transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
            <p className="text-sm text-[#cdcacc]">Support Mail:</p>
            <a href="mailto:support@primevision.com" className="text-sm text-white hover:text-[#e9d758] transition-colors">
              support@primevision.com
            </a>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <button className="flex items-center gap-1 text-sm text-white">
            English <ChevronDown size={14} />
          </button>
          <p className="text-xs text-[#cdcacc]">
            Primevision Trades © 2022 – 2026, All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
