import type { Metadata } from "next";
import "./globals.css";
import CosmicBackground from "@/components/CosmicBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollObserver from "@/components/ScrollObserver";
import SciFiCursorVFX from "@/components/SciFiCursorVFX";

export const metadata: Metadata = {
  title: "GSCSC – Govt. Science College Science Club",
  description:
    "Official website of Govt. Science College Science Club (GSCSC). Where curiosity meets innovation since 1991.",
  icons: {
    icon: "/favicon-32x32.png",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" type="image/png" />
      </head>
      <body className="bg-[#030712] text-white min-h-screen relative antialiased selection:bg-sky-500 selection:text-black overflow-x-hidden">
        {/* Fixed 3D & Cosmic Canvas Background System */}
        <CosmicBackground />
        <SciFiCursorVFX />
        <ScrollObserver />

        {/* Dynamic Navigation Bar */}
        <Navbar />

        {/* Page Content */}
        <div className="relative z-10">{children}</div>

        {/* Global Glass Footer */}
        <Footer />
      </body>
    </html>
  );
}
