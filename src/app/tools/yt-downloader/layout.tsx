import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Yt Downloader | Seloice Tools',
  description: 'Free online Yt Downloader tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.',
  alternates: {
    canonical: 'https://seloice.com/tools/yt-downloader',
  },
  openGraph: {
    title: 'Yt Downloader | Seloice Tools',
    description: 'Free online Yt Downloader tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.',
    url: 'https://seloice.com/tools/yt-downloader',
    type: 'website',
      images: [{ url: `https://seloice.com/api/og?title=Yt%20Downloader%20%7C%20Seloice%20Tools`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yt Downloader | Seloice Tools',
    description: 'Free online Yt Downloader tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.',
      images: [`https://seloice.com/api/og?title=Yt%20Downloader%20%7C%20Seloice%20Tools`],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Yt Downloader",
        "operatingSystem": "All",
        "applicationCategory": "MultimediaApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Free online Yt Downloader tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "5732"
        },
        "url": "https://seloice.com/tools/yt-downloader"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://seloice.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Tools",
            "item": "https://seloice.com/#tools"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Yt Downloader",
            "item": "https://seloice.com/tools/yt-downloader"
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
