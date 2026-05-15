'use client';

import React, { useState } from 'react';
import { getToolBySlug, WASM_TOOL_SLUGS } from '@/lib/seo/tools-registry';
import { Zap } from 'lucide-react';

interface ToolLazyGateProps {
  slug: string;
  children: React.ReactNode;
}

/** Defers heavy WASM tool UI until user taps — improves LCP & Lighthouse Performance. */
export default function ToolLazyGate({ slug, children }: ToolLazyGateProps) {
  const tool = getToolBySlug(slug);
  const isHeavy = WASM_TOOL_SLUGS.includes(slug);
  const [active, setActive] = useState(!isHeavy);

  if (active) {
    return <div className="tool-interface-root">{children}</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="bg-[#111] border border-white/10 rounded-[2rem] p-8 md:p-12 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <Zap size={28} className="text-emerald-400" aria-hidden />
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white mb-3 italic uppercase tracking-tight">
          Launch {tool?.shortTitle ?? 'Tool'}
        </h2>
        <p className="text-gray-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
          Tap below to load the interactive editor. Keeps the page fast on mobile until you are ready.
        </p>
        <button
          type="button"
          onClick={() => setActive(true)}
          className="inline-flex items-center justify-center gap-2 min-h-[48px] px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-xs rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
          aria-label={`Launch ${tool?.name ?? 'tool'}`}
        >
          Open {tool?.shortTitle ?? 'Tool'} — Free
        </button>
        <p className="text-[10px] text-gray-600 mt-4 uppercase tracking-widest font-bold">
          No signup · Runs in your browser
        </p>
      </div>
    </div>
  );
}
