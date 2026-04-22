"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    name: "Sarah Edrissi",
    title: "Lead Marketing",
    quote:
      "We are based in Europe and the latest Data Protection Regulation forces us to look for service suppliers than comply with this regulation and as we look to create our website and this builder just outstanding!",
    rating: 5,
  },
  {
    name: "Mark Zellers",
    title: "Delposh Trainer",
    quote:
      "You guys are fantastic. Nothing but home run picks from you guys. So glad I signed up for Primevision Trades. The stock alerts have helped me stay ahead of market moves consistently.",
    rating: 5,
  },
  {
    name: "Natasha Williams",
    title: "Director",
    quote:
      "This platform makes everything so simple. I've tried other trading apps but Primevision Trades is on another level — the interface is clean, fast and I never miss a trade.",
    rating: 5,
  },
  {
    name: "James Okoro",
    title: "Retail Investor",
    quote:
      "The copy trading feature is a game changer. I just follow the top traders and my portfolio keeps growing. Absolutely love the real-time alerts and the support team is super responsive.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    title: "Fintech Analyst",
    quote:
      "Primevision Trades gives you access to futures, stocks and crypto all in one place. The charts are detailed, the interface is beautiful, and I feel confident with every decision I make.",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#e9d758">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  return (
    <section className="py-24 px-6 overflow-hidden" style={{ background: "#060614" }}>
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontSize: "clamp(36px, 4vw, 56px)",
              fontWeight: 400,
              color: "#ffffff",
              lineHeight: 1.1,
            }}
          >
            Read Reviews,
          </h2>
          <h2
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontSize: "clamp(36px, 4vw, 56px)",
              fontWeight: 700,
              color: "#e9d758",
              lineHeight: 1.1,
              marginTop: "4px",
            }}
          >
            Trade with Confidence.
          </h2>
        </div>

        {/* Scroll controls */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110"
            style={{ background: "#150578", color: "#fff" }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Cards */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 scrollbar-hidden"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {reviews.map((r) => (
              <div
                key={r.name}
                className="shrink-0 flex flex-col justify-between gap-5 rounded-[20px] p-7"
                style={{
                  background: "#150578",
                  width: "clamp(280px, 30vw, 360px)",
                  scrollSnapAlign: "start",
                  minHeight: "260px",
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      style={{
                        fontFamily: "Satoshi, sans-serif",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#fff",
                      }}
                    >
                      {r.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "Satoshi, sans-serif",
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#cdcacc",
                        marginTop: "2px",
                      }}
                    >
                      {r.title}
                    </p>
                  </div>
                  {/* Quote icon */}
                  <svg
                    width="28"
                    height="22"
                    viewBox="0 0 28 22"
                    fill="none"
                    style={{ opacity: 0.3, flexShrink: 0 }}
                  >
                    <path
                      d="M0 22V13.2C0 9.6 0.933 6.533 2.8 4C4.733 1.4 7.4 0 10.8 0v3.6C9.067 3.6 7.667 4.4 6.6 6c-1 1.6-1.4 3.4-1.2 5.4H8V22H0Zm14 0V13.2C14 9.6 14.933 6.533 16.8 4c1.933-2.6 4.6-4 8-4v3.6c-1.733 0-3.133.8-4.2 2.4-1 1.6-1.4 3.4-1.2 5.4H22V22H14Z"
                      fill="#e9d758"
                    />
                  </svg>
                </div>

                {/* Quote text */}
                <p
                  style={{
                    fontFamily: "Satoshi, sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#cdcacc",
                    lineHeight: "22px",
                    flex: 1,
                  }}
                >
                  &ldquo;{r.quote}&rdquo;
                </p>

                {/* Stars */}
                <Stars count={r.rating} />
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110"
            style={{ background: "#150578", color: "#fff" }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Write your own review CTA */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <p
            style={{
              fontFamily: "Satoshi, sans-serif",
              fontSize: "clamp(16px, 1.5vw, 20px)",
              fontWeight: 400,
              color: "#cdcacc",
            }}
          >
            Write your own review
          </p>
          <a
            href="/contact"
            className="flex items-center justify-center rounded-full transition-all hover:scale-110"
            style={{
              width: "48px",
              height: "48px",
              background: "#e9d758",
              color: "#0e0e52",
              textDecoration: "none",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0e0e52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
