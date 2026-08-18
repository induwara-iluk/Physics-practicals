import type { Metadata } from "next";
import "./globals.css";
import "./components.css";
import "katex/dist/katex.min.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import FeedbackPopup from "@/components/FeedbackPopup";

export const metadata: Metadata = {
  title: "Physics Practicals | GCE(A/L) | Self Practice",
  description: "Learn Practicals , Practise Past paper Questions , Get ready for upcoming Exam using Model papers",
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
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense_id}`}
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {ga_id && <GoogleAnalytics ga_id={ga_id} />}
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FeedbackPopup />
      </body>
    </html>
  );
}

