import Link from 'next/link';
import { ALL_TOOLS } from '@/lib/seo/tools-registry';

const HOME_FAQS = [
  {
    question: 'Is Seloice Tools completely free?',
    answer:
      'Yes. All core tools are free with no credit card, no export watermarks, and no hidden paywalls on standard features.',
  },
  {
    question: 'Do you upload my videos to your servers?',
    answer:
      'Most editing tools run locally in your browser with WebAssembly. Your files stay on your device for maximum privacy.',
  },
  {
    question: 'Does Seloice work on iPhone and Android?',
    answer:
      'Yes. The platform is mobile-first — download reels, compress video, and generate captions from any modern mobile browser.',
  },
  {
    question: 'What creator tools are included?',
    answer:
      '26+ tools including YouTube downloader, Instagram reel downloader, video editor, auto captions, background remover, hashtag generator, and more.',
  },
];

export default function HomePageSEO() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQS.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Seloice Creator Tools',
    itemListElement: ALL_TOOLS.slice(0, 26).map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      url: `https://seloice.com/tools/${t.slug}`,
    })),
  };

  return (
    <section
      className="max-w-4xl mx-auto px-4 py-12 text-gray-400 border-t border-white/5"
      aria-label="About Seloice Tools"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <h2 className="text-2xl font-bold text-white mb-4">Free AI creator tools for YouTube, Instagram & TikTok</h2>
      <p className="mb-6 leading-relaxed text-sm md:text-base">
        Seloice is an all-in-one creator operating system with 26+ browser-based utilities: video editing,
        reel downloading, auto captions, viral hooks, compressors, and SEO growth tools. Built for speed,
        privacy, and zero watermarks.
      </p>

      <h3 className="text-lg font-bold text-white mb-3">Popular free tools</h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8 text-sm">
        {ALL_TOOLS.slice(0, 12).map((t) => (
          <li key={t.slug}>
            <Link href={`/tools/${t.slug}`} className="text-emerald-400 hover:underline">
              {t.name}
            </Link>
            <span className="text-gray-600"> — {t.tagline}</span>
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-bold text-white mb-3">Frequently asked questions</h3>
      <dl className="space-y-4 text-sm">
        {HOME_FAQS.map((f) => (
          <div key={f.question}>
            <dt className="font-semibold text-gray-200">{f.question}</dt>
            <dd className="mt-1">{f.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
