import { TrendingUp, Users, Zap, BarChart3 } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Multi-Market Trading",
    desc: "Trade crypto, stocks, and futures seamlessly",
  },
  {
    icon: Users,
    title: "Copy Trading",
    desc: "Mirror expert traders in real-time and earn with them",
  },
  {
    icon: Zap,
    title: "Instant Funding",
    desc: "Deposit via crypto instantly or connect our wallet",
  },
  {
    icon: BarChart3,
    title: "Real-Time Charts",
    desc: "Advanced market insights at your fingertips",
  },
];

export default function WhyChooseSection() {
  return (
    <section id="about" className="py-24 px-6" style={{ background: "#060614" }}>
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-center text-white mb-16"
          style={{
            fontFamily: "Satoshi, sans-serif",
            fontSize: "clamp(36px, 3.33vw, 48px)",
            fontWeight: 400,
          }}
        >
          Why Choose{" "}
          <span style={{ color: "#e9d758", fontWeight: 500, }}>Primevision Trades?</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-[20px] p-7 flex flex-col gap-6 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: "#150578" }}
            >
              {/* Icon circle */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "#e9d758" }}
              >
                <f.icon size={24} style={{ color: "#0e0e52" }} />
              </div>
              <div>
                <h3
                  className="text-white mb-2"
                  style={{ fontFamily: "Satoshi", fontSize: "18px", fontWeight: 600 }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#cdcacc" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
