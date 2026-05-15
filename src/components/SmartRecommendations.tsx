"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ALL_TOOLS, getRelatedTools, getToolBySlug } from '@/lib/seo/tools-registry';
import { ArrowRight, History } from 'lucide-react';

export default function SmartRecommendations() {
  const [recommendations, setRecommendations] = useState<typeof ALL_TOOLS>([]);

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('seloice_history') || '[]');
      if (Array.isArray(history) && history.length > 0) {
        // Based on the last visited tool, get related tools that are not in history
        const lastVisited = history[0];
        const related = getRelatedTools(lastVisited, 8);
        const filtered = related.filter(t => !history.includes(t.slug));
        
        if (filtered.length > 0) {
          setRecommendations(filtered.slice(0, 4));
        } else {
          // Fallback to trending
          setRecommendations(ALL_TOOLS.slice(0, 4));
        }
      } else {
        // Fallback to trending
        setRecommendations(ALL_TOOLS.slice(0, 4));
      }
    } catch (e) {
      setRecommendations(ALL_TOOLS.slice(0, 4));
    }
  }, []);

  if (recommendations.length === 0) return null;

  return (
    <div className="w-full mt-12 mb-12 max-w-4xl mx-auto px-4">
      <div className="flex items-center gap-2 mb-6">
        <History size={16} className="text-emerald-500" />
        <h2 className="text-sm font-black uppercase tracking-widest text-white">Recommended for you</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((tool) => (
          <Link 
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-emerald-500/30 transition-all duration-300 flex flex-col"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 px-2 py-0.5 rounded-full bg-emerald-500/10">
                {tool.category}
              </span>
            </div>
            
            <h3 className="text-base font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
              {tool.shortTitle}
            </h3>
            
            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-4 flex-1">
              {tool.tagline}
            </p>
            
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
              Open Tool <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
