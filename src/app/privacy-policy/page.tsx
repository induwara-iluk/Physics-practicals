import type { Metadata } from "next";
import PrivacyPageClient from "./PrivacyPageClient";

export const metadata: Metadata = {
  title: "Privacy Policy | ilukpracticals.online",
  description: "Read the Privacy Policy for ilukpracticals.online to understand how we collect, use, and safeguard your information.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPageClient />;
}
