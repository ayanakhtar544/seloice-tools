// File: src/app/tools/viral-hooks/page.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowLeft, Sparkles, Loader2, Copy, CheckCircle2, AlertCircle, Eye, Flame, BookOpen } from 'lucide-react';
import Link from 'next/link';

// TypeScript interfaces
interface HooksData {
  curiosity: string[];
  fomo: string[];
  story: string[];
}

export default function ViralHooksClient() {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hooks, setHooks] = useState<HooksData | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setError(null);
    setHooks(null);

    try {
      const response = await fetch('/api/generate-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || "Failed to generate hooks");
      }

      const data = await response.json();
      setHooks(data);
      
      // Auto-scroll to results
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);

    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-500/30 pb-20">
      
      {/* Background Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute top-[-10%] w-[40rem] h-[40rem] bg-yellow-600/10 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-8 md:pt-16">
        
        <Link href="/" className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-bold text-xs uppercase tracking-widest mb-10 transition-colors bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20 w-fit">
          <ArrowLeft size={16} /> Back to Toolkit
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-600 p-[2px] rounded-2xl mx-auto mb-6 shadow-xl shadow-yellow-500/20 rotate-3">
            <div className="w-full h-full bg-[#111] rounded-[14px] flex items-center justify-center">
              <Zap size={28} className="text-white fill-yellow-500" />
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4">VIRAL <span className="text-yellow-500">HOOKS</span></h2>
          <p className="text-gray-400 font-medium max-w-lg mx-auto text-sm md:text-base">
            Stop the scroll. Generate highly engaging, psychology-backed video intros in seconds using AI.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-[#111] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden mb-12 max-w-2xl mx-auto">
          <form onSubmit={handleGenerate} className="flex flex-col gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-yellow-500 uppercase tracking-widest mb-4">
                <Sparkles size={16} /> What is your video about?
              </label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., 3 tips to lose belly fat without giving up pizza..."
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all resize-none min-h-[120px]"
                maxLength={200}
              />
              <div className="text-right mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {topic.length}/200
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className="w-full py-4 rounded-xl bg-yellow-500 text-black font-black uppercase tracking-widest text-sm shadow-[0_6px_0_0_#ca8a04] active:translate-y-1 active:shadow-none transition-all hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <><Loader2 size={18} className="animate-spin" /> WRITING HOOKS...</>
              ) : (
                <><Zap size={18} className="fill-black" /> GENERATE 9 HOOKS</>
              )}
            </button>
          </form>
        </div>

        {/* Results Area */}
        <AnimatePresence>
          {hooks && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              
              {/* Category 1: Curiosity */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Eye size={20} />
                  </div>
                  <div>
                    <h3 className="font-black italic text-lg text-white">CURIOSITY</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Makes them wonder</p>
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  {hooks.curiosity.map((hook, i) => (
                    <div key={`curiosity-${i}`} className="bg-[#111] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors group relative">
                      <p className="text-gray-300 text-sm font-medium pr-8">{hook}</p>
                      <button onClick={() => copyToClipboard(hook, `curiosity-${i}`)} className="absolute top-4 right-4 text-gray-500 hover:text-blue-400 transition-colors">
                        {copiedIndex === `curiosity-${i}` ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 2: FOMO */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
                    <Flame size={20} />
                  </div>
                  <div>
                    <h3 className="font-black italic text-lg text-white">FOMO / FEAR</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Urgency to watch</p>
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  {hooks.fomo.map((hook, i) => (
                    <div key={`fomo-${i}`} className="bg-[#111] p-4 rounded-xl border border-white/5 hover:border-red-500/30 transition-colors group relative">
                      <p className="text-gray-300 text-sm font-medium pr-8">{hook}</p>
                      <button onClick={() => copyToClipboard(hook, `fomo-${i}`)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors">
                        {copiedIndex === `fomo-${i}` ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 3: Story */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="font-black italic text-lg text-white">STORY / RELATABLE</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Builds connection</p>
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  {hooks.story.map((hook, i) => (
                    <div key={`story-${i}`} className="bg-[#111] p-4 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-colors group relative">
                      <p className="text-gray-300 text-sm font-medium pr-8">{hook}</p>
                      <button onClick={() => copyToClipboard(hook, `story-${i}`)} className="absolute top-4 right-4 text-gray-500 hover:text-emerald-400 transition-colors">
                        {copiedIndex === `story-${i}` ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}