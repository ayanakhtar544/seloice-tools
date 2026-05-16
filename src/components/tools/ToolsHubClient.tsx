"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Search } from 'lucide-react';
import {
  CATEGORY_GRADIENT,
  filterHubTools,
  getToolIcon,
  HUB_CATEGORIES,
  TOOL_COUNT,
  type HubCategory,
} from '@/lib/tools-catalog';

export default function ToolsHubClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<HubCategory>("All");

  const filteredTools = filterHubTools(searchQuery, activeCategory);

  return (
    <div className="page-shell min-h-dvh bg-[#030305] text-white selection:bg-emerald-500/30 overflow-x-hidden relative font-sans pb-24">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-[0.15] -z-10">
        <div className="background-orb absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-600 rounded-full blur-[200px]" />
        <div className="background-orb absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-600 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 shadow-xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-100">
              Seloice Mega Suite • {TOOL_COUNT} Tools
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
            CREATOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">ECOSYSTEM</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            From heavy audio-video editing to AI captioning and format conversions. Everything you need to scale your content, right here in the browser.
          </p>

          <div className="relative max-w-2xl mx-auto mb-8">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-500" />
            </div>
            <input
              type="search"
              aria-label="Search all creator tools"
              placeholder="Search all tools — e.g. Background Remover, Video Editor, QR…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-sm md:text-base font-medium text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-inner min-h-[48px]"
            />
          </div>
          {!searchQuery && (
            <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-6">
              Browse all {TOOL_COUNT} tools below
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {HUB_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-white text-black shadow-lg scale-105'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {filteredTools.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {filteredTools.map((tool) => {
                const Icon = getToolIcon(tool.slug, tool.category);
                const gradient = CATEGORY_GRADIENT[tool.category];

                return (
                  <motion.div
                    layout
                    key={tool.slug}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="group relative bg-black/40 border border-white/10 backdrop-blur-md rounded-[1.5rem] p-5 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300 hover:shadow-2xl flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 shrink-0`}
                      >
                        <Icon size={24} className="text-white" />
                      </div>
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-400 text-[8px] font-black uppercase tracking-widest rounded-full">
                        {tool.category}
                      </span>
                    </div>

                    <div className="mb-5 flex-1">
                      <h2 className="text-lg font-black tracking-tight mb-1">{tool.name}</h2>
                      <p className={`text-[9px] font-bold uppercase tracking-widest mb-3 bg-clip-text text-transparent bg-gradient-to-r ${gradient}`}>
                        {tool.tagline}
                      </p>
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{tool.description}</p>
                    </div>

                    <div className="space-y-1.5 mb-6">
                      {tool.features.slice(0, 3).map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <CheckCircle2 size={10} className="text-emerald-500 shrink-0" />
                          <span className="text-[10px] font-medium text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={`/tools/${tool.slug}`}
                      scroll={true}
                      className={`mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-lg font-black uppercase tracking-widest text-[10px] transition-all bg-white/5 hover:bg-gradient-to-r ${gradient} text-gray-300 hover:text-white border border-white/10 hover:border-transparent group-hover:shadow-lg`}
                    >
                      Open Tool <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl"
            >
              <Search size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-black uppercase text-gray-400 mb-2">No tools found</h3>
              <p className="text-sm text-gray-500">
                We couldn&apos;t find any tool matching &quot;{searchQuery}&quot;. Try a different category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="mt-6 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-full text-xs font-bold uppercase tracking-widest text-white transition-colors"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
