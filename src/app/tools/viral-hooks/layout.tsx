import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Viral Hooks | Seloice Tools',
  description: 'Free online Viral Hooks tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.',
  alternates: {
    canonical: 'https://seloicetools.com/tools/viral-hooks',
  },
  openGraph: {
    title: 'Viral Hooks | Seloice Tools',
    description: 'Free online Viral Hooks tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.',
    url: 'https://seloicetools.com/tools/viral-hooks',
    type: 'website',
      images: [{ url: `https://seloicetools.com/api/og?title=Viral%20Hooks%20%7C%20Seloice%20Tools`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Viral Hooks | Seloice Tools',
    description: 'Free online Viral Hooks tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.',
      images: [`https://seloicetools.com/api/og?title=Viral%20Hooks%20%7C%20Seloice%20Tools`],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Viral Hooks",
        "operatingSystem": "All",
        "applicationCategory": "MultimediaApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Free online Viral Hooks tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "4351"
        },
        "url": "https://seloicetools.com/tools/viral-hooks"
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
            "name": "Viral Hooks",
            "item": "https://seloicetools.com/tools/viral-hooks"
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
