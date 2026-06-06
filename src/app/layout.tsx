import type { Metadata } from "next";
import "./globals.css";
import "./components.css";
import "katex/dist/katex.min.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleAdsense from "@/components/GoogleAdsense";

export const metadata: Metadata = {
  title: "Physics Practicals | Explore the Laws of Nature",
  description: "A premium platform for exploring physics experiments and simulations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ga_id = process.env.NEXT_PUBLIC_GA_ID;
  const adsense_id = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-6473028378022905";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <GoogleAdsense clientId={adsense_id} />
        {ga_id && <GoogleAnalytics ga_id={ga_id} />}
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
