import Link from "next/link";

export default function CopyExpertsSection() {
  return (
    <section className="py-24 px-6" style={{ background: "#0e0e52" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <h2
              className="mb-6"
              style={{
                fontFamily: "Satoshi, sans-serif",
                fontSize: "clamp(36px, 3.33vw, 48px)",
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#fff",
              }}
            >
              Copy Trades Instantly
              <br />
              From <span style={{ color: "#e9d758" }}>Experts</span>
            </h2>
            <p
              className="mb-10 leading-relaxed"
              style={{
                fontFamily: "Satoshi",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "25.6px",
                color: "#cdcacc",
              }}
            >
              Take advantage of the profitable trades that top experts have placed to make faster,
              smarter trading decisions. Our engine analyzes traders and list most profitable trades
              at top of the copy trading section. By combining machine learning models and experts
              with advanced risk management systems, you can optimize entry and exit points while
              maintaining disciplined portfolio control.
            </p>

            <div className="flex flex-col gap-4 mb-10">
              {[
                {
                  title: "Top trading accounts",
                  desc: "Copy other traders easily, or trade automatically with our unique trading A.I.",
                },
                {
                  title: "Pro Tools",
                  desc: "Use tools like DCA, Market-Making, Arbitrage or our own free of charge charting software.",
                },
              ].map((f) => (
                <div key={f.title} className="rounded-[20px] p-6" style={{ background: "#150578" }}>
                  <h4
                    className="mb-1"
                    style={{ fontFamily: "Satoshi", fontSize: "16px", fontWeight: 600, color: "#fff" }}
                  >
                    {f.title}
                  </h4>
                  <p style={{ fontFamily: "Satoshi", fontSize: "14px", fontWeight: 400, color: "#cdcacc" }}>{f.desc}</p>
                </div>
              ))}
            </div>

            <Link
              href="/auth/signup"
              className="inline-flex items-center rounded-full text-white font-medium transition-all hover:opacity-90"
              style={{
                background: "#f5a623",
                padding: "16px 48px",
                fontSize: "20px",
                fontFamily: "Satoshi",
                fontWeight: 500,
              }}
            >
              Start Copying
            </Link>
          </div>

          {/* Right — photo */}
          <div className="relative h-[440px] rounded-[20px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=700&q=80"
              alt="Expert trader at work"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, rgba(14,14,82,0.3) 0%, transparent 60%)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
