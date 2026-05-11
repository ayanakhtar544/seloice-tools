// File: src/app/tools/hashtag-generator/page.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ArrowLeft, Hash, Copy, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// Simple offline hashtag logic (Zero Cost API!)
const generateTags = (keyword: string) => {
  const base = keyword.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!base) return [];
  
  return [
    `#${base}`, `#${base}life`, `#${base}tips`, `#viral${base}`, 
    `#${base}hacks`, `#explore${base}`, `#${base}community`, 
    `#${base}goals`, `#trending${base}`, `#${base}oftheday`,
    `#${base}lover`, `#${base}world`, `#instadaily`, `#fyp`
  ];
};

export default function HashtagGenerator() {
  const [keyword, setKeyword] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerate = () => {
    if (!keyword.trim()) return;
    
    setIsGenerating(true);
    setHashtags([]);
    setCopiedAll(false);

    // Fake delay to give that "AI processing" premium feel
    setTimeout(() => {
      setHashtags(generateTags(keyword));
      setIsGenerating(false);
    }, 1200);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(hashtags.join(' '));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Framer Motion Variants for Staggered Animation
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 200 } }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-fuchsia-500/30 relative overflow-hidden flex flex-col items-center p-6">
      
      {/* Background Glowing Orbs (Modern UI Touch) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-3xl pt-10 z-10">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-fuchsia-400 transition-colors mb-10 group w-fit">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Tools</span>
        </Link>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-fuchsia-500/10 to-blue-500/10 border border-white/5 rounded-2xl mb-6 shadow-[0_0_30px_rgba(217,70,239,0.15)]">
            <Hash size={36} className="text-fuchsia-400" />
          </div>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            Smart <span className="bg-gradient-to-r from-fuchsia-400 to-blue-400 bg-clip-text text-transparent">Hashtag AI</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Type your niche and instantly get a curated list of viral hashtags optimized for Instagram & TikTok algorithms.
          </p>
        </motion.div>

        {/* Glassmorphic Input Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="relative group mb-10"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center px-4 py-3">
              <Sparkles size={20} className="text-fuchsia-400 mr-3" />
              <input 
                type="text" 
                placeholder="E.g., Fitness, Coding, Travel..." 
                className="bg-transparent border-none outline-none w-full text-white text-lg placeholder:text-gray-600"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !keyword}
              className="bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isGenerating ? <Loader2 size={20} className="animate-spin" /> : 'Generate Tags'}
            </button>
          </div>
        </motion.div>

        {/* Results Area */}
        <AnimatePresence>
          {hashtags.length > 0 && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#111]/50 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold text-gray-200">Your Custom Tags</h3>
                <button 
                  onClick={copyAll}
                  className="flex items-center gap-2 text-sm font-medium bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors border border-white/5"
                >
                  {copiedAll ? <CheckCircle2 size={16} className="text-green-400" /> : <Copy size={16} />}
                  {copiedAll ? 'Copied All!' : 'Copy All'}
                </button>
              </div>

              {/* Staggered Chips */}
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="flex flex-wrap gap-3"
              >
                {hashtags.map((tag, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(217, 70, 239, 0.15)', borderColor: 'rgba(217, 70, 239, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 cursor-pointer transition-colors shadow-sm select-all"
                  >
                    {tag}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}