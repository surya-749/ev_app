import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GRIDWISE — Intelligent EV Charging Infrastructure",
  description:
    "Predict. Explain. Optimise. Charge Smarter. AI-powered smart EV charging platform that predicts demand, optimises the network, and explains every decision.",
  keywords: "EV charging, smart charging, AI, optimisation, XAI, IoT, SIH 2026",
  openGraph: {
    title: "GRIDWISE — Intelligent EV Charging Infrastructure",
    description: "Predict. Explain. Optimise. Charge Smarter.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
