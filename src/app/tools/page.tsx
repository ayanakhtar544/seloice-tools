import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { toolsHubMetadata } from './page-metadata';
import { ALL_TOOLS } from '@/lib/seo/tools-registry';
import Link from 'next/link';
import SmartRecommendations from '@/components/SmartRecommendations';

export const metadata: Metadata = toolsHubMetadata;

const ToolsHubClient = dynamic(() => import('@/components/tools/ToolsHubClient'), {
  loading: () => (
    <div className="min-h-[50vh] flex items-center justify-center" aria-busy="true">
      <p className="text-gray-500 text-sm">Loading tools…</p>
    </div>
  ),
});

export default function ToolsHubPage() {
  return (
    <>
      <ToolsHubClient />
      
      <SmartRecommendations />

      <section className="max-w-4xl mx-auto px-4 pb-16 -mt-8 text-gray-400 border-t border-white/5 pt-10" aria-label="All Seloice tools">
        <h2 className="text-xl font-bold text-white mb-4">Complete list of free creator tools</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {ALL_TOOLS.map((t) => (
            <li key={t.slug}>
              <Link href={`/tools/${t.slug}`} className="text-emerald-400 hover:underline">
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
