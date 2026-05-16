import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us | ilukpracticals.online",
  description: "Learn about ilukpracticals.online, the platform dedicated to helping Sri Lankan students master G.C.E. A/L Physics Practicals.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
