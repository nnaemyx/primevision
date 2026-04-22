import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import WhyChooseSection from "@/components/landing/WhyChooseSection";
import CopyExpertsSection from "@/components/landing/CopyExpertsSection";
import AssetTickerSection from "@/components/landing/AssetTickerSection";
import ReviewsSection from "@/components/landing/ReviewsSection";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

export default function LandingPage() {
  return (
    <div style={{ background: "#060614", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/*
        ── Full-page decorative background SVG ────────────────────────
        Using background-image with repeat-y so the pin/hook decoration
        tiles vertically and covers ALL sections, including the asset
        ticker (logo slider) at the bottom of the main content area.
        This replaces the single <img> which ran out before reaching
        the lower sections.
      */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "200px",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/images/landing-bg-decoration.svg')",
          backgroundSize: "100% auto",
          backgroundRepeat: "repeat-y",
          backgroundPosition: "top center",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      />

      {/* All page content sits above the decoration */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />
        <HeroSection />
        <WhyChooseSection />
        <CopyExpertsSection />
        <AssetTickerSection />
        <ReviewsSection />
        <Footer />
      </div>
      <ChatWidget />
    </div>
  );
}
