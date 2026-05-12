// File: src/app/tools/hashtag-generator/page.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, ArrowLeft, Sparkles, Loader2, Copy, CheckCircle2, TrendingUp, Target, Gem } from 'lucide-react';
import Link from 'next/link';

interface HashtagData {
  viral: string[];
  niche: string[];
  lowComp: string[];
}

export default function HashtagGenerator() {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hashtags, setHashtags] = useState<HashtagData | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setHashtags(null);

    try {
      const response = await fetch('/api/generate-hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setHashtags(data);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyTags = (tags: string[], id: string) => {
    navigator.clipboard.writeText(tags.join(' '));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20">
      <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
        <div className="absolute top-[-10%] w-[40rem] h-[40rem] bg-emerald-600/10 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-8 md:pt-16">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-400 font-bold text-xs uppercase tracking-widest mb-10 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
          <ArrowLeft size={16} /> Back to Toolkit
        </Link>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 p-[2px] rounded-2xl mx-auto mb-6 shadow-xl shadow-emerald-500/20 rotate-3">
            <div className="w-full h-full bg-[#111] rounded-[14px] flex items-center justify-center">
              <Hash size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 uppercase">HASHTAG <span className="text-emerald-400">GENERATOR</span></h1>
          <p className="text-gray-400 font-medium max-w-lg mx-auto text-sm md:text-base">Generate 30+ viral, niche, and low-competition hashtags tailored for your content.</p>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl max-w-2xl mx-auto mb-12">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-emerald-500 uppercase tracking-widest mb-4">
                <Sparkles size={16} /> Topic or Keywords
              </label>
              <input 
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., street food photography, tech reviews..."
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
              />
            </div>
            <button 
              disabled={isGenerating || !topic.trim()}
              className="w-full py-4 rounded-xl bg-emerald-500 text-black font-black uppercase tracking-widest text-sm shadow-[0_6px_0_0_#059669] active:translate-y-1 active:shadow-none transition-all hover:bg-emerald-400 flex items-center justify-center gap-2"
            >
              {isGenerating ? <><Loader2 size={18} className="animate-spin" /> ANALYZING...</> : <><Hash size={18} /> GENERATE HASHTAGS</>}
            </button>
          </form>
        </div>

        <AnimatePresence>
          {hashtags && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'viral', name: 'Viral Reach', icon: <TrendingUp />, tags: hashtags.viral, color: 'text-blue-400' },
                { id: 'niche', name: 'Niche Specific', icon: <Target />, tags: hashtags.niche, color: 'text-emerald-400' },
                { id: 'lowComp', name: 'Hidden Gems', icon: <Gem />, tags: hashtags.lowComp, color: 'text-purple-400' }
              ].map((cat) => (
                <div key={cat.id} className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${cat.color}`}>{cat.icon}</div>
                      <h3 className="font-black italic text-sm text-white uppercase">{cat.name}</h3>
                    </div>
                    <button onClick={() => copyTags(cat.tags, cat.id)} className="text-gray-500 hover:text-white transition-colors">
                      {copiedId === cat.id ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {cat.tags.map((tag, i) => (
                      <span key={i} className="text-[11px] font-bold text-gray-400 bg-white/5 px-2 py-1 rounded-md border border-white/5">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}