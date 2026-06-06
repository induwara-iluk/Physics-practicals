import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us | ilukpracticals.online",
  description: "Get in touch with Induwara Ilukkumbura, founder of ilukpracticals.online. Find contact info and send messages directly.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
