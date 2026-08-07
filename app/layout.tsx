import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  FloatingWatchLive,
  BackToTop,
  CookieConsent,
} from "@/components/layout/floating-widgets";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://www.tvchannel.comexample";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TV Channel — Live TV, News & Original Shows",
    template: "%s | TV Channel",
  },
  description:
    "TV Channel is the nation's home for live television, breaking news, original drama, music, sport and entertainment. Watch live or on demand, anytime.",
  keywords: [
    "TV Channel",
    "live TV",
    "TV schedule",
    "national broadcaster",
    "watch live",
    "breaking news",
    "TV shows",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "TV Channel",
    title: "TV Channel — Live TV, News & Original Shows",
    description:
      "Watch live television, catch up on the latest episodes, and stay on top of breaking news — all in one premium streaming destination.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "TV Channel" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TV Channel — Live TV, News & Original Shows",
    description:
      "Watch live television, catch up on the latest episodes, and stay on top of breaking news.",
    images: ["/og-image.jpg"],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "TelevisionStation",
    name: "TV Channel",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      "https://facebook.com",
      "https://instagram.com",
      "https://youtube.com",
      "https://x.com",
    ],
  };

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-secondary"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <FloatingWatchLive />
        <BackToTop />
        <CookieConsent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
