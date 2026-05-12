import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://seloicetools.com"), // Ye add kar de
  title: "Seloice Tools | All-in-One AI Toolkit for Creators",
  description: "The ultimate free toolkit for YouTube and Instagram creators. Download reels, compress videos, extract tags, and convert files instantly with Seloice Tools.",
  keywords: ["Seloice Tools", "YouTube Downloader", "Reel Downloader", "Video Compressor", "AI Captions", "Creator Toolkit"],
  alternates: {
    canonical: "https://seloicetools.com",
  },
  openGraph: {
    title: "Seloice Tools | Creator Operating System",
    description: "22+ Professional tools to grow your social media instantly. Edit faster, rank higher, and build your audience.",
    url: "https://seloicetools.com",
    siteName: "Seloice Tools",
    images: [
      {
        url: "/og-image.jpg",
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
    description: "22+ Professional tools to grow your social media instantly.",
    images: ["/og-image.jpg"],
    creator: "@seloicetools",
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
  authors: [{ name: 'Seloice', url: 'https://seloicetools.com' }],
  category: 'technology',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        {/* Global SEO Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://seloicetools.com/#website",
                  "url": "https://seloicetools.com/",
                  "name": "Seloice Tools",
                  "description": "22+ Media tools for creators.",
                  "potentialAction": [
                    {
                      "@type": "SearchAction",
                      "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://seloicetools.com/search?q={search_term_string}"
                      },
                      "query-input": "required name=search_term_string"
                    }
                  ]
                },
                {
                  "@type": "Organization",
                  "@id": "https://seloicetools.com/#organization",
                  "name": "Seloice Tools",
                  "url": "https://seloicetools.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://seloicetools.com/logo.png"
                  }
                }
              ]
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans bg-[#050505] text-white antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}