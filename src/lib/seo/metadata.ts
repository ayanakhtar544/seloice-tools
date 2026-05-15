import type { Metadata } from 'next';
import { getToolBySlug, type ToolRecord } from './tools-registry';

const SITE = 'https://seloice.com';
const BRAND = 'Seloice';

export function buildToolMetadata(tool: ToolRecord): Metadata {
  const url = `${SITE}/tools/${tool.slug}`;
  const title = tool.seoTitle;
  const description = tool.metaDescription;
  const ogTitle = tool.discoverTitle || tool.seoTitle;

  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description,
      url,
      type: 'website',
      siteName: `${BRAND} Tools`,
      locale: 'en_US',
      images: [
        {
          url: `${SITE}/api/og?title=${encodeURIComponent(tool.shortTitle)}&badge=100%25%20Free`,
          width: 1200,
          height: 630,
          alt: `${tool.name} — Free online tool by ${BRAND}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [`${SITE}/api/og?title=${encodeURIComponent(tool.shortTitle)}&badge=100%25%20Free`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    category: 'technology',
  };
}

export function buildToolMetadataBySlug(slug: string): Metadata {
  const tool = getToolBySlug(slug);
  if (!tool) {
    return { title: `Tool | ${BRAND}`, robots: { index: false, follow: false } };
  }
  return buildToolMetadata(tool);
}
