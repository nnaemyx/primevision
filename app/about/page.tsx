import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const cards = [
  {
    title: "Our Mission",
    body: "To empower traders worldwide with a seamless, secure, and high-performance platform that simplifies access to global financial markets.",
  },
  {
    title: "What We Offer",
    body: null,
    list: [
      { label: "Multi-Asset Trading", desc: "Trade Futures, U.S. Stocks, and Crypto from a single dashboard." },
      { label: "Smart Copy Trading", desc: "Follow and replicate strategies from experienced traders in real time." },
      { label: "Real-Time Market Insights", desc: "Access live charts and data to make informed decisions instantly." },
      { label: "Flexible Funding Options", desc: "Deposit and withdraw using crypto, card, and other supported methods." },
      { label: "User-Centric Experience", desc: "Designed for speed, clarity, and ease of use across all devices." },
    ],
  },
  {
    title: "Security & Trust",
    body: "Your security is at the core of everything we build.\nWe implement industry-standard security protocols and continuously improve our systems to ensure your data and funds are protected at all times.",
  },
  {
    title: "Our Vision",
    body: "To become a globally trusted trading ecosystem where anyone, anywhere, can participate in financial markets without complexity or limitation.",
  },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#060614", minHeight: "100vh" }}>
      <Navbar />
      <main className="pt-40 pb-20 px-6 max-w-6xl mx-auto">
        {/* Who we are */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left */}
          <div>
            <h1
              className="mb-6"
              style={{
                fontFamily: "Satoshi, sans-serif",
                fontSize: "64px",
                fontWeight: 500,
                lineHeight: "61.44px",
                color: "#e9d758",
              }}
            >
              Who we are
            </h1>
            <p
              className="mb-8"
              style={{
                fontFamily: "Satoshi",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "25.6px",
                color: "#cdcacc",
              }}
            >
              PrimeVision Trades was created with a simple mission, to make trading smarter, faster, and more accessible.
              <br /><br />
              In a world where markets move in seconds, we believe traders deserve tools that move just as fast. Our platform combines real-time data, intuitive design, and powerful execution systems to help users stay ahead of the curve.
              <br /><br />
              Whether you&apos;re just getting started or actively managing trades, PrimeVision Trades gives you the edge to act with confidence.
            </p>

            {/* Our Mission card */}
            <div className="rounded-[20px] p-8 mb-4" style={{ background: "#150578" }}>
              <h2 style={{ fontFamily: "Satoshi", fontSize: "40px", fontWeight: 400, color: "#fff", marginBottom: "12px" }}>
                Our Mission
              </h2>
              <p style={{ fontFamily: "Satoshi", fontSize: "16px", fontWeight: 400, lineHeight: "25.6px", color: "#cdcacc" }}>
                To empower traders worldwide with a seamless, secure, and high-performance platform that simplifies access to global financial markets.
              </p>
            </div>

            {/* Security & Trust card */}
            <div className="rounded-[20px] p-8" style={{ background: "#150578" }}>
              <h2 style={{ fontFamily: "Satoshi", fontSize: "40px", fontWeight: 400, color: "#fff", marginBottom: "12px" }}>
                Security &amp; Trust
              </h2>
              <p style={{ fontFamily: "Satoshi", fontSize: "16px", fontWeight: 400, lineHeight: "25.6px", color: "#cdcacc" }}>
                Your security is at the core of everything we build.{"\n"}
                We implement industry-standard security protocols and continuously improve our systems to ensure your data and funds are protected at all times.
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-4">
            {/* What We Offer */}
            <div className="rounded-[20px] p-8" style={{ background: "#150578" }}>
              <h2 style={{ fontFamily: "Satoshi", fontSize: "40px", fontWeight: 400, color: "#fff", marginBottom: "16px" }}>
                What We Offer
              </h2>
              <ol className="flex flex-col gap-3 list-decimal list-inside">
                {[
                  { label: "Multi-Asset Trading", desc: "Trade Futures, U.S. Stocks, and Crypto from a single dashboard." },
                  { label: "Smart Copy Trading", desc: "Follow and replicate strategies from experienced traders in real time." },
                  { label: "Real-Time Market Insights", desc: "Access live charts and data to make informed decisions instantly." },
                  { label: "Flexible Funding Options", desc: "Deposit and withdraw using crypto, card, and other supported methods." },
                  { label: "User-Centric Experience", desc: "Designed for speed, clarity, and ease of use across all devices." },
                ].map((item, i) => (
                  <li key={i} style={{ fontFamily: "Satoshi", fontSize: "16px", color: "#cdcacc" }}>
                    <span style={{ color: "#cdcacc", fontWeight: 500 }}>{item.label}</span>
                    <br />
                    <span style={{ paddingLeft: "20px", display: "block", color: "#cdcacc" }}>{item.desc}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Our Vision */}
            <div className="rounded-[20px] p-8" style={{ background: "#150578" }}>
              <h2 style={{ fontFamily: "Satoshi", fontSize: "40px", fontWeight: 400, color: "#fff", marginBottom: "12px" }}>
                Our Vision
              </h2>
              <p style={{ fontFamily: "Satoshi", fontSize: "16px", fontWeight: 400, lineHeight: "25.6px", color: "#cdcacc" }}>
                To become a globally trusted trading ecosystem where anyone, anywhere, can participate in financial markets without complexity or limitation.
              </p>
            </div>
          </div>
        </div>

        {/* Welcome heading */}
        <p
          className="text-center py-16"
          style={{ fontFamily: "Satoshi", fontSize: "40px", fontWeight: 500, color: "#e9d758" }}
        >
          Welcome to PrimeVision Trades.
        </p>
      </main>
      <Footer />
    </div>
  );
}
