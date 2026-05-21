import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import fs from 'fs';
import path from 'path';

const SITE = 'https://seloice.com';

export const dynamicParams = true;
export const revalidate = 604800; // Cache for 7 days (ISR)

interface SeoPage {
  slug: string;
  baseTool: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  features: string[];
  howTo: { step: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

function getSeoPages(): SeoPage[] {
  const seoPath = path.join(process.cwd(), 'src', 'data', 'seo-pages.json');
  if (!fs.existsSync(seoPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(seoPath, 'utf8')) as SeoPage[];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const pages = getSeoPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPages().find(p => p.slug === slug);
  if (!page) return { title: 'Not Found', robots: { index: false } };

  const url = `${SITE}/p/${slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      type: 'website',
      images: [{ url: `${SITE}/api/og?title=${encodeURIComponent(page.h1)}`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description },
    robots: { index: true, follow: true },
  };
}

export default async function ProgrammaticSeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getSeoPages().find(p => p.slug === slug);
  if (!page) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: page.title,
        description: page.description,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Any',
        url: `${SITE}/p/${slug}`,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'HowTo',
        name: `How to use ${page.h1}`,
        step: page.howTo.map(step => ({
          '@type': 'HowToStep',
          name: step.title,
          text: step.desc
        }))
      }
    ],
  };

  return (
    <div className="min-h-screen bg-[#030305] pt-24 pb-20 text-white">
      <JsonLd data={jsonLd} />

      <article className="max-w-4xl mx-auto px-4">
        <nav aria-label="Breadcrumb" className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">
          <Link href="/" className="hover:text-white">Home</Link>
          {' / '}
          <Link href="/tools" className="hover:text-white">Tools</Link>
          {' / '}
          <span className="text-emerald-400">{page.h1}</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{page.h1}</h1>
        <p className="text-lg text-zinc-400 mb-8 max-w-2xl leading-relaxed">{page.intro}</p>

        <Link
          href={`/tools/${page.baseTool}`}
          className="inline-flex items-center justify-center min-h-[48px] px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-full text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Open Free Tool
        </Link>

        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {page.features.map((feature, idx) => (
             <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 className="font-bold text-lg">{feature}</h3>
             </div>
          ))}
        </section>

        <section className="mt-16 prose prose-invert max-w-none">
          <h2>How it works</h2>
          <div className="space-y-6 mt-6">
            {page.howTo.map((step) => (
              <div key={step.step} className="flex gap-4 items-start">
                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    {step.step}
                 </div>
                 <div>
                    <h3 className="text-lg font-bold m-0">{step.title}</h3>
                    <p className="text-zinc-400 mt-1 mb-0">{step.desc}</p>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {page.faqs.length > 0 && (
          <section className="mt-16 pt-12 border-t border-white/10">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {page.faqs.map((faq) => (
                <details key={faq.q} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <summary className="font-semibold cursor-pointer min-h-[44px] flex items-center">{faq.q}</summary>
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
