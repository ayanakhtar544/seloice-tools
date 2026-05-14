import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Image Converter | Seloice Tools',
  description: 'Free online Image Converter tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.',
  alternates: {
    canonical: 'https://seloice.com/tools/image-converter',
  },
  openGraph: {
    title: 'Image Converter | Seloice Tools',
    description: 'Free online Image Converter tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.',
    url: 'https://seloice.com/tools/image-converter',
    type: 'website',
      images: [{ url: `https://seloice.com/api/og?title=Image%20Converter%20%7C%20Seloice%20Tools`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Converter | Seloice Tools',
    description: 'Free online Image Converter tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.',
      images: [`https://seloice.com/api/og?title=Image%20Converter%20%7C%20Seloice%20Tools`],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Image Converter",
        "operatingSystem": "All",
        "applicationCategory": "MultimediaApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Free online Image Converter tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "3177"
        },
        "url": "https://seloice.com/tools/image-converter"
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
            "name": "Image Converter",
            "item": "https://seloice.com/tools/image-converter"
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
