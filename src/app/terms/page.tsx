import type { Metadata } from "next";
import TermsPageClient from "./TermsPageClient";

export const metadata: Metadata = {
  title: "Terms of Service | ilukpracticals.online",
  description: "Read the Terms of Service for ilukpracticals.online to understand the rules, guidelines, and terms governing your use of our platform.",
};

export default function TermsOfServicePage() {
  return <TermsPageClient />;
}
