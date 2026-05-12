const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'src', 'app', 'tools');
const toolDirs = fs.readdirSync(toolsDir).filter(f => fs.statSync(path.join(toolsDir, f)).isDirectory());

const generateLayout = (toolSlug) => {
  // Convert slug (e.g. video-compressor) to Title (e.g. Video Compressor)
  const title = toolSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const description = `Free online ${title} tool for creators. Optimize and enhance your social media content instantly with Seloice Tools without watermarks.`;
  const url = `https://seloicetools.com/tools/${toolSlug}`;

  return `import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '${title} | Seloice Tools',
  description: '${description}',
  alternates: {
    canonical: '${url}',
  },
  openGraph: {
    title: '${title} | Seloice Tools',
    description: '${description}',
    url: '${url}',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '${title} | Seloice Tools',
    description: '${description}',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "${title}",
        "operatingSystem": "All",
        "applicationCategory": "MultimediaApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "${description}",
        "url": "${url}"
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
            "name": "${title}",
            "item": "${url}"
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
`;
};

for (const dir of toolDirs) {
  const layoutPath = path.join(toolsDir, dir, 'layout.tsx');
  fs.writeFileSync(layoutPath, generateLayout(dir));
  console.log(`Generated layout for ${dir}`);
}
