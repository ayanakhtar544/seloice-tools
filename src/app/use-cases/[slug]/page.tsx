import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllUseCases, getUseCaseBySlug } from '@/lib/seo/use-cases';
import { getRelatedTools } from '@/lib/seo/tools-registry';

const SITE = 'https://seloice.com';

export const dynamicParams = true;
export const revalidate = 604800; // Cache for 7 days (ISR)

export async function generateStaticParams() {
  // Pre-build top 1000 pages, the rest will be built on-demand
  return getAllUseCases().slice(0, 1000).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getUseCaseBySlug(slug);
  if (!data) return { title: 'Not Found', robots: { index: false } };

  const url = `${SITE}/use-cases/${slug}`;
  return {
    title: data.title,
    description: data.description,
    alternates: { canonical: url },
    openGraph: {
      title: data.title,
      description: data.description,
      url,
      type: 'website',
      images: [{ url: `${SITE}/api/og?title=${encodeURIComponent(data.h1)}`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: data.title, description: data.description },
    robots: { index: true, follow: true },
  };
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getUseCaseBySlug(slug);
  if (!data) notFound();

  const related = getRelatedTools(data.primaryTool, 4);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: data.title,
        description: data.description,
        url: `${SITE}/use-cases/${slug}`,
      },
      {
        '@type': 'FAQPage',
        mainEntity: data.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#030305] pt-24 pb-20 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="max-w-4xl mx-auto px-4">
        <nav aria-label="Breadcrumb" className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">
          <Link href="/" className="hover:text-white">Home</Link>
          {' / '}
          <Link href="/tools" className="hover:text-white">Tools</Link>
          {' / '}
          <span className="text-emerald-400">{data.platform}</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{data.h1}</h1>
        <p className="text-lg text-zinc-400 mb-8 max-w-2xl leading-relaxed">{data.description}</p>

        <Link
          href={`/tools/${data.primaryTool}`}
          className="inline-flex items-center justify-center min-h-[48px] px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-full text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Open free {data.platform} tool
        </Link>

        <section className="mt-16 prose prose-invert max-w-none">
          <h2>Why use Seloice for {data.platform}?</h2>
          <p>
            Seloice gives creators a free, browser-based workflow for {data.platform} — no install, no watermark on
            core exports, and tools that run privately on your device when possible.
          </p>
          <h3>What you can do</h3>
          <ul>
            <li>Edit and export vertical video in 9:16</li>
            <li>Add AI captions and viral hooks</li>
            <li>Compress and resize for every platform</li>
          </ul>
        </section>

        {data.faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">FAQ</h2>
            <div className="space-y-3">
              {data.faqs.map((faq) => (
                <details key={faq.question} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <summary className="font-semibold cursor-pointer min-h-[44px] flex items-center">{faq.question}</summary>
                  <p className="text-gray-400 text-sm mt-2">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <nav className="mt-12" aria-label="Related tools">
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">Related tools</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {related.map((t) => (
              <li key={t.slug}>
                <Link href={`/tools/${t.slug}`} className="text-emerald-400 hover:underline text-sm">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section className="mt-16 pt-12 border-t border-white/10">
          <h2 className="text-2xl font-black italic tracking-tighter mb-6">Trending {data.platform} Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Infinite internal linking loop */}
            {getAllUseCases()
              .filter(p => p.slug !== slug && p.platform === data.platform)
              .slice(0, 8)
              .map(p => (
                <Link key={p.slug} href={`/use-cases/${p.slug}`} className="group p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all">
                  <h3 className="text-sm font-bold group-hover:text-emerald-400 transition-colors">{p.title}</h3>
                  <p className="text-xs text-zinc-500 mt-1 truncate">{p.description}</p>
                </Link>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
