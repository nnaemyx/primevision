import Image from "next/image";
import Link from "next/link";

const assets = [
  { name: "Ethereum", img: "/images/asset-eth.png" },
  { name: "Tesla", img: "/images/asset-tesla.png" },
  { name: "Google", img: "/images/asset-google.png" },
  { name: "Nvidia", img: "/images/asset-nvidia.png" },
  { name: "Bitcoin", img: "/images/asset-bitcoin.png" },
];

export default function AssetTickerSection() {
  // Duplicate for seamless loop
  const doubled = [...assets, ...assets, ...assets, ...assets];

  return (
    <section className="py-24 px-6 text-center overflow-hidden" style={{ background: "#0e0e52" }}>
      <p
        className="mb-14 mx-auto"
        style={{
          fontFamily: "Satoshi, sans-serif",
          fontSize: "clamp(24px, 2.5vw, 36px)",
          fontWeight: 400,
          lineHeight: "43.2px",
          color: "#cdcacc",
          maxWidth: "700px",
        }}
      >
        Trading thousands of assets including
        <br />
        <span style={{ color: "#e9d758", fontWeight: 400 }}>Stocks, Crypto, and Futures</span>{" "}
        <span style={{ color: "#cdcacc" }}>daily</span>
      </p>

      {/* Scrolling ticker */}
      <div className="relative overflow-hidden mb-16">
        {/* Inline keyframes via a CSS variable trick — use globals */}
        <div
          className="flex gap-6"
          style={{
            width: "max-content",
            animation: "ctTicker 25s linear infinite",
          }}
        >
          {doubled.map((asset, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[140px] h-[72px] rounded-[40px] flex items-center justify-center px-4"
              style={{ border: "1px solid #e9d758" }}
            >
              <div className="relative w-10 h-10">
                <Image src={asset.img} alt={asset.name} fill className="object-contain" />
              </div>
            </div>
          ))}
        </div>

        {/* Fade edges */}
        <div
          className="absolute inset-y-0 left-0 w-24 pointer-events-none"
          style={{ background: "linear-gradient(to right, #0e0e52, transparent)" }}
        />
        <div
          className="absolute inset-y-0 right-0 w-24 pointer-events-none"
          style={{ background: "linear-gradient(to left, #0e0e52, transparent)" }}
        />
      </div>

      <Link
        href="/auth/signup"
        className="inline-flex items-center rounded-full text-white font-medium transition-all hover:opacity-90"
        style={{
          background: "#f5a623",
          padding: "16px 60px",
          fontSize: "20px",
          fontFamily: "Satoshi, sans-serif",
          fontWeight: 500,
        }}
      >
        Start Trading
      </Link>
    </section>
  );
}
