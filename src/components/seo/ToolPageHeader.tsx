"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/seo/tools-registry';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import ViralShare from './ViralShare';

interface ToolPageHeaderProps {
  slug: string;
}

export default function ToolPageHeader({ slug }: ToolPageHeaderProps) {
  const tool = getToolBySlug(slug);

  useEffect(() => {
    if (tool) {
      try {
        const historyStr = localStorage.getItem('seloice_history');
        let history = historyStr ? JSON.parse(historyStr) : [];
        history = [slug, ...history.filter((s: string) => s !== slug)].slice(0, 10);
        localStorage.setItem('seloice_history', JSON.stringify(history));
      } catch (e) {
        // ignore
      }
    }
  }, [slug, tool]);

  if (!tool) return null;

  const toolUrl = `https://seloice.com/tools/${slug}`;

  return (
    <header className="w-full max-w-4xl mx-auto mb-8 md:mb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">
            <li>
              <Link href="/" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight size={12} className="opacity-50" />
            </li>
            <li>
              <Link href="/tools" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">
                Tools
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight size={12} className="opacity-50" />
            </li>
            <li>
              <span className="text-emerald-400" aria-current="page">
                {tool.shortTitle}
              </span>
            </li>
          </ol>
        </nav>
        
        <ViralShare url={toolUrl} title={`${tool.h1} - Free Creator Tool`} text={tool.tagline} />
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="text-center md:text-left flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-3">
            {tool.category} · Free Online Tool
          </p>
          <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter text-white mb-3 leading-tight">
            {tool.h1}
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl font-medium leading-relaxed mx-auto md:mx-0">
            {tool.tagline}. {tool.metaDescription.slice(0, 120)}
            {tool.metaDescription.length > 120 ? '…' : ''}
          </p>
        </div>

        <div
          className="flex items-center justify-center md:justify-end gap-2 px-3 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest shrink-0 min-h-[44px]"
          role="status"
        >
          <ShieldCheck size={14} aria-hidden />
          Private &amp; Free
        </div>
      </div>
    </header>
  );
}
