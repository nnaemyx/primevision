import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Props {
  distribution: { stocks: number; futures: number; crypto: number };
}

const sections = [
  { key: "stocks" as const, label: "Stocks & Options", icon: "/icons/icon-stocks-dist.svg" },
  { key: "futures" as const, label: "Futures", icon: "/icons/icon-futures-dist.svg" },
  { key: "crypto" as const, label: "Crypto", icon: "/icons/icon-crypto-dist.svg" },
];

export default function PortfolioDistribution({ distribution }: Props) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Portfolio Distribution</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sections.map((s) => (
          <div
            key={s.key}
            className="rounded-[20px] p-5 flex items-center gap-4 group transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            style={{ background: "#150578" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "#0e0e52" }}
            >
              <Image src={s.icon} alt={s.label} width={20} height={20} style={{ filter: "brightness(0) invert(1) opacity(0.8)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{s.label}</p>
              <p className="text-base font-bold text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                ${distribution[s.key].toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <ArrowRight size={16} className="text-[#cdcacc] shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
