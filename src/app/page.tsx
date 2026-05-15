import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { buildStaticMetadata, STATIC_PAGES } from '@/lib/seo/pages-registry';
import HomePageSEO from '@/components/home/HomePageSEO';
const homeMeta = STATIC_PAGES.find((p) => p.path === '/')!;
export const metadata: Metadata = buildStaticMetadata(homeMeta);

const HomePageClient = dynamic(() => import('@/components/home/HomePageClient'), {
  loading: () => (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center" aria-busy="true" aria-label="Loading">
      <p className="text-gray-500 text-sm font-medium">Loading Seloice Tools…</p>
    </div>
  ),
});

export default function HomePage() {
  return (
    <>
      <HomePageClient />
      <HomePageSEO />
    </>
  );
}
