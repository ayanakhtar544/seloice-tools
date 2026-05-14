import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Yt Tag Extractor | Seloice Tools',
  description: 'Free online Yt Tag Extractor tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.',
  alternates: {
    canonical: 'https://seloice.com/tools/yt-tag-extractor',
  },
  openGraph: {
    title: 'Yt Tag Extractor | Seloice Tools',
    description: 'Free online Yt Tag Extractor tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.',
    url: 'https://seloice.com/tools/yt-tag-extractor',
    type: 'website',
      images: [{ url: `https://seloice.com/api/og?title=Yt%20Tag%20Extractor%20%7C%20Seloice%20Tools`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yt Tag Extractor | Seloice Tools',
    description: 'Free online Yt Tag Extractor tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.',
      images: [`https://seloice.com/api/og?title=Yt%20Tag%20Extractor%20%7C%20Seloice%20Tools`],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Yt Tag Extractor",
        "operatingSystem": "All",
        "applicationCategory": "MultimediaApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Free online Yt Tag Extractor tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "1366"
        },
        "url": "https://seloice.com/tools/yt-tag-extractor"
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
            "name": "Yt Tag Extractor",
            "item": "https://seloice.com/tools/yt-tag-extractor"
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
