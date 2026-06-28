// src/app/layout.tsx

import type { Metadata } from "next";
import { Space_Grotesk, Chakra_Petch, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import MainNav from "@/components/navigation/MainNav";
import PageTransition from "@/components/PageTransition";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: '--font-sans',
});

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: "700",
  variable: '--font-header',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: "Atulya Mohan — Mechanical Engineer & ETIM MS Candidate",
    template: "%s | Atulya Mohan",
  },
  description:
    "Portfolio of Atulya Mohan — mechanical engineer, product developer, and Carnegie Mellon ETIM graduate. Projects spanning hardware design, engineering management, and software.",
  metadataBase: new URL("https://atulya-portfolio.vercel.app"),
  openGraph: {
    title: "Atulya Mohan — Mechanical Engineer & ETIM MS Candidate",
    description:
      "Portfolio showcasing mechanical engineering, engineering management, and software design projects.",
    url: "https://atulya-portfolio.vercel.app",
    siteName: "Atulya Mohan",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atulya Mohan — Portfolio",
    description:
      "Mechanical engineer & Carnegie Mellon ETIM graduate. Hardware design, product development, and software projects.",
  },
  icons: {
    icon: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${chakraPetch.variable} ${ibmPlexMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Atulya Mohan',
              url: 'https://atulya-portfolio.vercel.app',
              jobTitle: 'Mechanical Engineer & ETIM MS Candidate',
              alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'Carnegie Mellon University',
              },
              sameAs: [
                'https://www.linkedin.com/in/atulya-mohan',
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] m-0 p-0 font-sans">
        <MainNav />
        <main id="main-content">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </body>
    </html>
  );
}
