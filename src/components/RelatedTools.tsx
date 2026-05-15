"use client";

import React from 'react';
import Link from 'next/link';
import { ALL_TOOLS, getRelatedTools } from '@/lib/seo/tools-registry';
import { ArrowRight } from 'lucide-react';

interface RelatedToolsProps {
  currentSlug: string;
  limit?: number;
}

export default function RelatedTools({ currentSlug, limit = 4 }: RelatedToolsProps) {
  const related = getRelatedTools(currentSlug, limit);

  return (
    <div className="w-full mt-20 border-t border-white/5 pt-16">
      <h2 className="text-2xl font-black text-white mb-8 text-center uppercase tracking-tighter">
        Related <span className="text-emerald-500">Creator Tools</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((tool) => (
          <Link 
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.05] transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                {tool.category}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              {tool.shortTitle}
            </h3>
            
            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-6">
              {tool.tagline}
            </p>
            
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
              Open Tool <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link 
          href="/tools" 
          className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
        >
          View All 26+ Tools →
        </Link>
      </div>
    </div>
  );
}
