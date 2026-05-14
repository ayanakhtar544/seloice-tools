import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Yt Title Generator | Seloice Tools',
  description: 'Free online Yt Title Generator tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.',
  alternates: {
    canonical: 'https://seloice.com/tools/yt-title-generator',
  },
  openGraph: {
    title: 'YouTube Title Generator | Seloice Tools',
    description: 'Free online YouTube Title Generator tool for creators. Optimize and enhance your social media content instantly with Seloice Tools.',
    url: 'https://seloice.com/tools/yt-title-generator',
    type: 'website',
    images: [{ url: `https://seloice.com/api/og?title=YouTube%20Title%20Generator&badge=Free%20SEO%20Tool`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YouTube Title Generator | Seloice Tools',
    description: 'Free online YouTube Title Generator tool for creators. Optimize and enhance your social media content instantly with Seloice Tools.',
    images: [`https://seloice.com/api/og?title=YouTube%20Title%20Generator&badge=Free%20SEO%20Tool`],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Yt Title Generator",
        "operatingSystem": "All",
        "applicationCategory": "MultimediaApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Free online Yt Title Generator tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "2016"
        },
        "url": "https://seloice.com/tools/yt-title-generator"
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
            "name": "Yt Title Generator",
            "item": "https://seloice.com/tools/yt-title-generator"
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
