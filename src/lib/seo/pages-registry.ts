import type { Metadata } from 'next';

const SITE = 'https://seloice.com';
const BRAND = 'Seloice Tools';

export interface StaticPageSEO {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  noindex?: boolean;
}

export const STATIC_PAGES: StaticPageSEO[] = [
  {
    path: '/',
    title: 'Seloice Tools — Free AI Creator Toolkit (26+ Tools) | Video, Reels & YouTube',
    description:
      'Free browser tools for YouTube & Instagram creators: video editor, reel downloader, auto captions, compressors & AI hooks. No watermark. Works on mobile.',
    keywords: ['creator tools', 'free video editor online', 'youtube downloader', 'reel downloader'],
  },
  {
    path: '/tools',
    title: 'All Creator Tools — 26+ Free Video, AI & Download Utilities | Seloice',
    description:
      'Browse every Seloice tool: YouTube downloader, Instagram reel saver, video compressor, auto captions, background remover & more. 100% free in-browser.',
    keywords: ['free creator tools', 'online video tools'],
  },
  {
    path: '/blogs',
    title: 'Creator Growth Blog — YouTube, Reels & TikTok Tips | Seloice',
    description: 'Actionable guides for creators: SEO, editing workflows, viral hooks, and free tool tutorials.',
    keywords: ['creator blog', 'youtube growth tips'],
  },
  {
    path: '/about',
    title: 'About Seloice — Free AI Tools for Creators',
    description:
      'Seloice builds free, privacy-first creator tools in the browser. Learn our mission to democratize video, audio, and growth utilities.',
  },
  {
    path: '/contact',
    title: 'Contact Seloice — Support & Partnerships',
    description: 'Contact the Seloice team for support, feedback, bug reports, or partnerships.',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | Seloice Tools',
    description: 'How Seloice handles cookies, analytics, AdSense, and your data when using our free creator tools.',
  },
  {
    path: '/terms',
    title: 'Terms of Service | Seloice Tools',
    description: 'Terms of use for Seloice free creator tools, acceptable use, and disclaimers.',
  },
];

export function buildStaticMetadata(page: StaticPageSEO): Metadata {
  const url = `${SITE}${page.path === '/' ? '' : page.path}`;
  const canonical = page.path === '/' ? SITE : `${SITE}${page.path}`;

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical },
    robots: page.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      siteName: BRAND,
      type: 'website',
      images: [{ url: `${SITE}/api/og?title=${encodeURIComponent(BRAND)}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
    },
  };
}

export function getStaticPageByPath(path: string): StaticPageSEO | undefined {
  const normalized = path === '' ? '/' : path;
  return STATIC_PAGES.find((p) => p.path === normalized);
}
