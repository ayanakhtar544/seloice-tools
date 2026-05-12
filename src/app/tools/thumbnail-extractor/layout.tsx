import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Thumbnail Extractor | Seloice Tools',
  description: 'Free online Thumbnail Extractor tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.',
  alternates: {
    canonical: 'https://seloicetools.com/tools/thumbnail-extractor',
  },
  openGraph: {
    title: 'Thumbnail Extractor | Seloice Tools',
    description: 'Free online Thumbnail Extractor tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.',
    url: 'https://seloicetools.com/tools/thumbnail-extractor',
    type: 'website',
      images: [{ url: `https://seloicetools.com/api/og?title=Thumbnail%20Extractor%20%7C%20Seloice%20Tools`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thumbnail Extractor | Seloice Tools',
    description: 'Free online Thumbnail Extractor tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.',
      images: [`https://seloicetools.com/api/og?title=Thumbnail%20Extractor%20%7C%20Seloice%20Tools`],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Thumbnail Extractor",
        "operatingSystem": "All",
        "applicationCategory": "MultimediaApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Free online Thumbnail Extractor tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "4011"
        },
        "url": "https://seloicetools.com/tools/thumbnail-extractor"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://seloicetools.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Tools",
            "item": "https://seloicetools.com/#tools"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Thumbnail Extractor",
            "item": "https://seloicetools.com/tools/thumbnail-extractor"
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
