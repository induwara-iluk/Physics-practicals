import type { Metadata } from "next";
import "./globals.css";
import "./components.css";
import "katex/dist/katex.min.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Physics Practicals | Explore the Laws of Nature",
  description: "A premium platform for exploring physics experiments and simulations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
