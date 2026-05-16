import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import { getRelatedTools, getToolBySlug } from '@/lib/seo/tools-registry';
import { buildToolJsonLd } from '@/lib/seo/schema';
import { ChevronRight, Sparkles, Lightbulb, Wrench, Target } from 'lucide-react';

interface ToolPageContentProps {
  slug: string;
}

export default function ToolPageContent({ slug }: ToolPageContentProps) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;

  const related = getRelatedTools(slug, 6);
  const jsonLd = buildToolJsonLd(tool);

  return (
    <section
      className="w-full max-w-4xl mx-auto mt-8 mb-4 border-t border-white/10 pt-12"
      aria-label={`Guide: ${tool.name}`}
    >
      <JsonLd data={jsonLd} />

      <article>
        <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-4">
          What is {tool.name}?
        </h2>
        <p className="text-gray-400 leading-relaxed text-sm md:text-base mb-6">{tool.description}</p>

        <aside className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-5 mb-10">
          <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-2">Quick answer</p>
          <p className="text-sm text-gray-300 leading-relaxed">{tool.featuredSnippet}</p>
        </aside>

        <h3 className="text-lg font-bold text-white mb-3">Why creators use {tool.shortTitle}</h3>
        <p className="text-gray-400 leading-relaxed mb-6">
          {tool.shortTitle} is designed to help creators move faster with every stage of the content pipeline. Whether you are polishing a short-form video, extracting captions, generating hashtags, or converting media formats, this tool keeps your workflow inside the browser and avoids extra apps.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-10 list-none p-0">
          {tool.benefits.map((b) => (
            <li key={b} className="text-sm text-gray-300 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-3">
              {b}
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Target size={18} className="text-emerald-400" aria-hidden /> Best use cases
        </h3>
        <p className="text-gray-400 leading-relaxed mb-6">
          Popular use cases include creator workflow optimization, rapid social video publishing, and preparing content for YouTube, Instagram, TikTok, and other channels.
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10 list-none p-0">
          {tool.useCases.map((uc) => (
            <li key={uc.title} className="bg-[#111] border border-white/5 rounded-2xl p-4">
              <h4 className="font-bold text-white text-sm mb-1">{uc.title}</h4>
              <p className="text-gray-400 text-xs leading-relaxed">{uc.desc}</p>
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-bold text-white mb-3">Key features</h3>
        <p className="text-gray-400 leading-relaxed mb-6">
          This tool is built for speed, clarity, and precision. The work you create here is meant to be publish-ready, with direct export options and smart presets for the most common creator workflows.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-10 list-none p-0">
          {tool.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
              <Sparkles size={14} className="text-emerald-400 shrink-0" aria-hidden />
              {f}
            </li>
          ))}
        </ul>

        <section className="mb-10">
          <h3 className="text-lg font-bold text-white mb-3">How {tool.shortTitle} helps creators publish faster</h3>
          <p className="text-gray-400 leading-relaxed mb-4">
            Many creators need a simple way to finish tasks without losing momentum. {tool.shortTitle} removes complexity by combining the most common editing, exporting, and optimization steps into one interface. This means less switching between apps and more time spent publishing.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            The tool is built with fast load times in mind. It keeps assets on your device when possible, so you can work privately and avoid unnecessary uploads. That helps creators stay productive on mobile, desktop, and low-bandwidth connections.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Whether you are a beginner or a professional, this tool gives you actionable controls with simple defaults. Use the included presets for the fastest result, then fine tune the output as needed for brand-safe, platform-ready content.
          </p>
        </section>

        <h3 className="text-lg font-bold text-white mb-4">How to use {tool.shortTitle}</h3>
        <ol className="space-y-4 list-none p-0 mb-10">
          {tool.howToSteps.map((step, i) => (
            <li key={step.title} className="flex gap-4 bg-[#111] border border-white/5 rounded-2xl p-4">
              <span
                className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm shrink-0"
                aria-hidden
              >
                {i + 1}
              </span>
              <div>
                <h4 className="font-bold text-white text-sm">{step.title}</h4>
                <p className="text-gray-400 text-sm mt-1">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Lightbulb size={18} className="text-yellow-400" aria-hidden /> Creator tips
        </h3>
        <ul className="space-y-2 mb-10 text-sm text-gray-400 list-disc pl-5">
          {tool.creatorTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>

        <p className="text-sm text-gray-500 mb-10 border-l-2 border-gray-700 pl-4 italic">{tool.comparisonNote}</p>

        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Wrench size={18} className="text-gray-400" aria-hidden /> Troubleshooting
        </h3>
        <div className="space-y-3 mb-10">
          {tool.troubleshooting.map((t) => (
            <div key={t.issue} className="bg-[#111] border border-white/5 rounded-xl p-4 text-sm">
              <p className="font-bold text-gray-200">{t.issue}</p>
              <p className="text-gray-400 mt-1">{t.fix}</p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold text-white mb-4">Frequently asked questions</h3>
        <div className="space-y-3">
          {tool.faqs.map((faq) => (
            <details key={faq.question} className="bg-[#111] border border-white/5 rounded-2xl p-4 group">
              <summary className="font-bold text-gray-200 cursor-pointer list-none flex justify-between items-center text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg min-h-[44px]">
                {faq.question}
                <ChevronRight size={16} className="text-gray-500 group-open:rotate-90 transition-transform shrink-0 ml-2" aria-hidden />
              </summary>
              <p className="text-gray-400 text-sm mt-3 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>

        <section className="mt-12 mb-10 rounded-3xl border border-white/10 bg-[#040406] p-6">
          <h3 className="text-xl font-bold text-white mb-4">More creator resources</h3>
          <p className="text-gray-400 leading-relaxed mb-4">
            Need more tips for creating viral content? Our blog shares creator workflows, caption formulas, hashtag strategies, and editing shortcuts that pair perfectly with this tool.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/blogs"
              className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 px-5 py-4 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/10 transition"
            >
              Read the creator blog &rarr;
            </Link>
            <Link
              href="/"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Browse all tools &rarr;
            </Link>
          </div>
        </section>

        <p className="text-[10px] text-gray-600 mt-8 uppercase tracking-widest">
          Keywords: {tool.semanticKeywords.slice(0, 5).join(' · ')}
        </p>
      </article>

      <nav className="mt-12" aria-label="Related creator tools">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">Related tools</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {related.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/tools/${r.slug}`}
                className="flex items-center justify-between px-4 py-3 min-h-[44px] rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-white/[0.07] transition-colors text-sm text-gray-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <span>{r.shortTitle}</span>
                <ChevronRight size={14} className="text-gray-600" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
