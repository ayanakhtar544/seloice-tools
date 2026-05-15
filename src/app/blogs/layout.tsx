import type { Metadata } from 'next';
import { buildStaticMetadata, STATIC_PAGES } from '@/lib/seo/pages-registry';

const blogsMeta = STATIC_PAGES.find((p) => p.path === '/blogs')!;

export const metadata: Metadata = buildStaticMetadata(blogsMeta);

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
