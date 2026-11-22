import type { Metadata } from "next";
import TermsPageContent from "@/components/terms/TermsPageContent";

export const metadata: Metadata = {
  title: "Terms of Use | ApexPrime",
  description: "Read the Terms and Conditions of using ApexPrime. Understand our trading rules, account eligibility, risk disclosure, and fees.",
};

export default function TermsPage() {
  return <TermsPageContent />;
}
