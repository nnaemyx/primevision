import type { Metadata } from "next";
import TermsPageContent from "@/components/terms/TermsPageContent";

export const metadata: Metadata = {
  title: "Terms of Use | PrimeVision Trades",
  description: "Read the Terms and Conditions of using PrimeVision Trades. Understand our trading rules, account eligibility, risk disclosure, and fees.",
};

export default function TermsPage() {
  return <TermsPageContent />;
}
