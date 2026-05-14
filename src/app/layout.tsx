import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AnalyticsWrapper from "@/components/AnalyticsWrapper";
import CookieBanner from "@/components/CookieBanner";
import ErrorBoundary from "@/components/ErrorBoundary";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://seloice.com"), 
  title: "Seloice Tools | All-in-One AI Toolkit for Creators",
  description: "The ultimate free toolkit for YouTube and Instagram creators. Download reels, compress videos, extract tags, and convert files instantly with Seloice Tools.",
  keywords: ["Seloice Tools", "YouTube Downloader", "Reel Downloader", "Video Compressor", "AI Captions", "Creator Toolkit"],
  alternates: {
    canonical: "https://seloice.com",
  },
  openGraph: {
    title: "Seloice Tools | Creator Operating System",
    description: "26+ Professional tools to grow your social media instantly. Edit faster, rank higher, and build your audience.",
    url: "https://seloice.com",
    siteName: "Seloice Tools",
    images: [
      {
        url: "/api/og?title=Seloice%20Tools%20%7C%20Creator%20OS&badge=100%25%20Free%20Toolkit",
        width: 1200,
        height: 630,
        alt: "Seloice Tools Platform Preview",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seloice Tools | The Ultimate Creator Toolkit",
    description: "26+ Professional tools to grow your social media instantly.",
    images: ["/api/og?title=Seloice%20Tools%20%7C%20Creator%20OS&badge=100%25%20Free%20Toolkit"],
    creator: "@seloice",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  authors: [{ name: 'Seloice', url: 'https://seloice.com' }],
  category: 'technology',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        {/* Google AdSense Verification */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7632798085856544"
          crossOrigin="anonymous"
        />
        {/* Global SEO Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://seloice.com/#website",
                  "url": "https://seloice.com/",
                  "name": "Seloice Tools",
                  "description": "24+ Media tools for creators.",
                  "potentialAction": [
                    {
                      "@type": "SearchAction",
                      "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://seloice.com/search?q={search_term_string}"
                      },
                      "query-input": "required name=search_term_string"
                    }
                  ]
                },
                {
                  "@type": "Organization",
                  "@id": "https://seloice.com/#organization",
                  "name": "Seloice Tools",
                  "url": "https://seloice.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://seloice.com/logo.png"
                  }
                }
              ]
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans bg-[#050505] text-white antialiased overflow-x-hidden`}>
        {/* Analytics & AdSense load ONLY after cookie consent via AnalyticsWrapper */}
        <AnalyticsWrapper />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <CookieBanner />
      </body>
    </html>
  );
}