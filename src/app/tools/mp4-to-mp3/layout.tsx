import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Mp4 To Mp3 | Seloice Tools',
  description: 'Free online Mp4 To Mp3 tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.',
  alternates: {
    canonical: 'https://seloice.com/tools/mp4-to-mp3',
  },
  openGraph: {
    title: 'Mp4 To Mp3 | Seloice Tools',
    description: 'Free online Mp4 To Mp3 tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.',
    url: 'https://seloice.com/tools/mp4-to-mp3',
    type: 'website',
      images: [{ url: `https://seloice.com/api/og?title=Mp4%20To%20Mp3%20%7C%20Seloice%20Tools`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mp4 To Mp3 | Seloice Tools',
    description: 'Free online Mp4 To Mp3 tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.',
      images: [`https://seloice.com/api/og?title=Mp4%20To%20Mp3%20%7C%20Seloice%20Tools`],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Mp4 To Mp3",
        "operatingSystem": "All",
        "applicationCategory": "MultimediaApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Free online Mp4 To Mp3 tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "3840"
        },
        "url": "https://seloice.com/tools/mp4-to-mp3"
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
            "name": "Mp4 To Mp3",
            "item": "https://seloice.com/tools/mp4-to-mp3"
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
