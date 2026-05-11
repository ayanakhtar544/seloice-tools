import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Seloice Tools | All-in-One AI Toolkit for Creators",
  description: "The ultimate free toolkit for YouTube and Instagram creators. Download reels, compress videos, extract tags, and convert files instantly with Seloice Tools.",
  keywords: ["Seloice Tools", "YouTube Downloader", "Reel Downloader", "Video Compressor", "AI Captions", "Creator Toolkit"],
  openGraph: {
    title: "Seloice Tools | Creator Operating System",
    description: "22+ Professional tools to grow your social media instantly.",
    url: "https://seloicetools.com",
    siteName: "Seloice Tools",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seloice Tools | The Ultimate Creator Toolkit",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* SEO Schema for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Seloice Tools",
              "url": "https://seloicetools.com",
              "description": "22+ Media tools for creators.",
              "applicationCategory": "Multimedia",
              "operatingSystem": "All",
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