// src/app/layout.tsx

import type { Metadata } from "next";
// 1. Import Kosugi_Maru instead of IBM_Plex_Mono
import { Space_Grotesk, Chakra_Petch, Kosugi_Maru } from "next/font/google";
import "./globals.css";
import MainNav from "@/components/navigation/MainNav";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: '--font-sans',
});

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: "700",
  variable: '--font-header',
});

// 2. Set up Kosugi_Maru and assign it to the --font-mono variable
const kosugiMaru = Kosugi_Maru({
  subsets: ["latin"],
  weight: "400",
  variable: '--font-mono', // Re-using the same variable name
});

export const metadata = {
  title: "Atulya Mohan",
  description: "Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 3. Add the new font variable to the <html> tag
    <html lang="en" className={`${spaceGrotesk.variable} ${kosugiMaru.variable} ${chakraPetch.variable}`}>
      <head></head>
      
      <body className="min-h-screen bg-[#F0F2E6] text-slate-100 m-0 p-0 font-sans">
        <MainNav />
        <main className="mx-auto max-w-6xl px-4 pb-24 pt-24">
          {children}
        </main>
      </body>
    </html>
  );
}