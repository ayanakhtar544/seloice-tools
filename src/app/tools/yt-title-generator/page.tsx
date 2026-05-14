// File: src/app/tools/yt-title-generator/page.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, ArrowLeft, Sparkles, Loader2, Zap, Search, Heart, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import ShareOutput from '@/components/ShareOutput';
import { saveHistory } from '@/lib/history';

interface TitleData {
  clickbait: string[];
  seo: string[];
  emotional: string[];
}

export default function YTTitleGenerator() {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [titles, setTitles] = useState<TitleData | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setTitles(null);

    try {
      const response = await fetch('/api/generate-yt-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setTitles(data);
      
      // Save to retention history
      saveHistory({
        toolSlug: 'yt-title-generator',
        toolName: 'YouTube Title Generator',
        actionDesc: `Generated titles for "${topic}"`,
        outputData: data
      });

      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);

    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20">
      
      {/* Background Glow */}
      <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
        <div className="absolute top-[-10%] w-[40rem] h-[40rem] bg-red-600/10 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-8 md:pt-16">
        <Link href="/" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-bold text-xs uppercase tracking-widest mb-10 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20 transition-all hover:bg-red-500/20">
          <ArrowLeft size={16} /> Back to Toolkit
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-700 p-[2px] rounded-2xl mx-auto mb-6 shadow-xl shadow-red-500/20 rotate-3">
            <div className="w-full h-full bg-[#111] rounded-[14px] flex items-center justify-center">
              <Type size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 uppercase">TITLE <span className="text-red-500">GENERATOR</span></h1>
          <p className="text-gray-400 font-medium max-w-lg mx-auto text-sm md:text-base">Generate High-CTR YouTube titles optimized for clicks, search, and emotion.</p>
        </div>

        {/* Input Card */}
        <div className="bg-[#111] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl max-w-2xl mx-auto mb-12 relative overflow-hidden">
          {/* Subtle loading effect if generating */}
          {isGenerating && (
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
              <div className="w-1/2 h-full bg-red-500 animate-[translateX_1.5s_linear_infinite]" style={{ animationName: 'slide' }} />
            </div>
          )}
          <style>{`@keyframes slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
          
          <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-red-500 uppercase tracking-widest mb-4">
                <Sparkles size={16} /> What is the video about?
              </label>
              <input 
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., iPhone 15 review, How to make money online..."
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none text-lg"
              />
            </div>
            <button 
              disabled={isGenerating || !topic.trim()}
              className="w-full py-4 rounded-xl bg-red-600 text-white font-black uppercase tracking-widest text-sm shadow-[0_6px_0_0_#991b1b] active:translate-y-1 active:shadow-none transition-all hover:bg-red-500 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:translate-y-0 disabled:shadow-[0_6px_0_0_#991b1b]"
            >
              {isGenerating ? <><Loader2 size={18} className="animate-spin" /> BRAINSTORMING...</> : <><Type size={18} /> GENERATE TITLES</>}
            </button>
          </form>
        </div>

        {/* Results Area */}
        <AnimatePresence>
          {titles && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              
              {/* Viral Loop / Remix Hook */}
              <div className="bg-gradient-to-r from-red-500/10 to-transparent border-l-4 border-red-500 p-4 rounded-r-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-red-400 font-bold uppercase tracking-widest text-xs mb-1">Titles Generated!</h4>
                  <p className="text-gray-400 text-sm">Need a thumbnail to match? Or viral tags?</p>
                </div>
                <div className="flex gap-2">
                  <Link href="/tools/yt-tag-extractor" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2">
                    <Search size={14} /> Get Tags
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category 1: Clickbait */}
                <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden flex flex-col hover:border-yellow-500/30 transition-colors shadow-xl">
                  <div className="p-6 border-b border-white/5 bg-gradient-to-br from-yellow-500/5 to-transparent">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-400"><Zap size={20} /></div>
                      <div>
                        <h3 className="font-black italic text-lg text-white">HIGH CTR</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Irresistible to click</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    {titles.clickbait.map((t, i) => (
                      <div key={`cb-${i}`} className="space-y-2">
                        <p className="text-gray-200 text-base font-bold leading-snug">{t}</p>
                        <ShareOutput content={t} title="Viral YouTube Title Idea:" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category 2: SEO */}
                <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden flex flex-col hover:border-blue-500/30 transition-colors shadow-xl">
                  <div className="p-6 border-b border-white/5 bg-gradient-to-br from-blue-500/5 to-transparent">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400"><Search size={20} /></div>
                      <div>
                        <h3 className="font-black italic text-lg text-white">SEO RANKING</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">For YouTube Search</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    {titles.seo.map((t, i) => (
                      <div key={`seo-${i}`} className="space-y-2">
                        <p className="text-gray-200 text-base font-bold leading-snug">{t}</p>
                        <ShareOutput content={t} title="SEO YouTube Title Idea:" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category 3: Emotional */}
                <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden flex flex-col hover:border-rose-500/30 transition-colors shadow-xl">
                  <div className="p-6 border-b border-white/5 bg-gradient-to-br from-rose-500/5 to-transparent">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400"><Heart size={20} /></div>
                      <div>
                        <h3 className="font-black italic text-lg text-white">EMOTIONAL</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Connects with viewer</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    {titles.emotional.map((t, i) => (
                      <div key={`em-${i}`} className="space-y-2">
                        <p className="text-gray-200 text-base font-bold leading-snug">{t}</p>
                        <ShareOutput content={t} title="Emotional YouTube Title Idea:" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}