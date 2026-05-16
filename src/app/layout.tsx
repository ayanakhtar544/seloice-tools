import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AnalyticsProvider from "@/providers/AnalyticsProvider";
import AnalyticsWrapper from "@/components/AnalyticsWrapper";
import CookieBanner from "@/components/CookieBanner";
import ErrorBoundary from "@/components/ErrorBoundary";
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import SkipLink from '@/components/seo/SkipLink';
import AdHealthChecker from "@/components/ads/AdHealthChecker";
import ConsentModeScript from "@/components/ConsentModeScript";
import { GoogleTagManager } from "@next/third-parties/google";
import JsonLd from "@/components/seo/JsonLd";
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import RouteScrollManager from "@/components/RouteScrollManager";
import { GTM_ID } from "@/lib/analytics";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", preload: false, adjustFontFallback: true });

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
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Seloice Tools | Creator Operating System",
    description: "28+ Professional tools to grow your social media instantly. Edit faster, rank higher, and build your audience.",
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
    description: "28+ Professional tools to grow your social media instantly.",
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
        <ConsentModeScript />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebSite',
                '@id': 'https://seloice.com/#website',
                url: 'https://seloice.com/',
                name: 'Seloice Tools',
                description: '28+ free creator tools — video editor, downloaders, captions & AI utilities.',
                publisher: { '@id': 'https://seloice.com/#organization' },
              },
              {
                '@type': 'Organization',
                '@id': 'https://seloice.com/#organization',
                name: 'Seloice Tools',
                url: 'https://seloice.com',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://seloice.com/favicon.png',
                },
              },
            ],
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#10b981" />
        <meta name="application-name" content="Seloice Tools" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Seloice Tools" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__deferredInstallPrompt = null;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                window.__deferredInstallPrompt = e;
              });
            `,
          }}
        />
      </head>

      <body className={`${inter.variable} font-sans bg-[#050505] text-white antialiased overflow-x-hidden page-shell`}>
        <AnalyticsProvider>
          <RouteScrollManager />
          <SkipLink />
          <AnalyticsWrapper />
          <GoogleTagManager gtmId={GTM_ID} />
          <ErrorBoundary>
            <div id="main-content" tabIndex={-1} className="page-shell mobile-nav-offset">
              {children}
            </div>
          </ErrorBoundary>
          <PWAInstallPrompt />
          <ServiceWorkerRegister />
          <CookieBanner />
          <AdHealthChecker />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
