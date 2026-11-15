import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Barlow is the in-game UI font; the condensed cut makes the big display headlines
const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-barlow" });
const condensed = Barlow_Condensed({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-condensed" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono-jb" });

export const metadata: Metadata = {
  title: "Survive in Moon · TAY Team",
  description: "A lunar survival game built on real NASA data - by TAY Team (Tima, Aisha, Yunus).",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${barlow.variable} ${condensed.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
