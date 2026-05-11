// File: src/app/tools/yt-title-generator/page.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Copy, CheckCircle2, TrendingUp, Target, Zap } from 'lucide-react';
import Link from 'next/link';

// Templates for different types of viral titles
const titleTemplates = [
  { type: "Curiosity", templates: ["The Secret Truth About [TOPIC]", "Why Everyone is WRONG About [TOPIC]", "What They Don't Tell You About [TOPIC]"] },
  { type: "Listicle", templates: ["5 Insane Ways to Master [TOPIC]", "Top 3 [TOPIC] Mistakes You MUST Avoid", "7 Steps to Perfect [TOPIC] in 2026"] },
  { type: "Urgency", templates: ["Stop Doing [TOPIC] Like This!", "Watch This BEFORE You Try [TOPIC]", "The End of [TOPIC] As We Know It?"] },
  { type: "How-To", templates: ["How I Conquered [TOPIC] Fast", "The Ultimate Guide to [TOPIC] for Beginners", "How to Hack [TOPIC] (Legally)"] }
];

const powerWords = ["secret", "truth", "insane", "must", "stop", "end", "ultimate", "hack", "fast", "wrong", "perfect", "avoid"];

// Interface for Title Object
interface TitleIdea {
  text: string;
  type: string;
  score: number;
}

export default function YTTitleGenerator() {
  const [topic, setTopic] = useState('');
  const [generatedTitles, setGeneratedTitles] = useState<TitleIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Fake CTR Score Calculator Logic
  const calculateScore = (title: string) => {
    let score = 50; // Base score
    const lowerTitle = title.toLowerCase();

    // 1. Length check (YouTube sweet spot is 40-60 chars)
    if (title.length >= 40 && title.length <= 60) score += 20;
    else if (title.length > 60 && title.length <= 70) score += 10;

    // 2. Contains numbers
    if (/\d/.test(title)) score += 15;

    // 3. Contains Power Words
    const hasPowerWord = powerWords.some(pw => lowerTitle.includes(pw));
    if (hasPowerWord) score += 14;

    return Math.min(score, 99); // Max score 99
  };

  const handleGenerate = () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setGeneratedTitles([]);

    setTimeout(() => {
      let results: TitleIdea[] = [];
      const cleanTopic = topic.trim();

      titleTemplates.forEach(category => {
        // Pick 2 random templates from each category
        const shuffled = [...category.templates].sort(() => 0.5 - Math.random()).slice(0, 2);
        shuffled.forEach(template => {
          const rawTitle = template.replace(/\[TOPIC\]/g, cleanTopic);
          results.push({
            text: rawTitle,
            type: category.type,
            score: calculateScore(rawTitle)
          });
        });
      });

      // Sort by highest score
      results.sort((a, b) => b.score - a.score);
      setGeneratedTitles(results);
      setIsGenerating(false);
    }, 800);
  };

  const copyTitle = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper for Score Color
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400 border-green-400 bg-green-400/10";
    if (score >= 75) return "text-yellow-400 border-yellow-400 bg-yellow-400/10";
    return "text-orange-400 border-orange-400 bg-orange-400/10";
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-red-500/30 p-6 relative overflow-hidden flex flex-col items-center">
      
      {/* YouTube Red Glowing Orbs */}
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-red-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-rose-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-4xl pt-10 z-10">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors mb-10 group w-fit">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Tools</span>
        </Link>

        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-2xl mb-6 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
          </div>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            Viral <span className="bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">Title Generator</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Stop guessing. Generate highly clickable YouTube titles scientifically designed to boost your CTR and views.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-[#111]/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex flex-col md:flex-row gap-3 mb-10 shadow-2xl"
        >
          <div className="flex-1 flex items-center px-4 py-3 bg-black/50 rounded-xl border border-white/5 focus-within:border-red-500/50 transition-colors">
            <Target size={20} className="text-red-400 mr-3" />
            <input 
              type="text" 
              placeholder="Enter your video topic (e.g., Coding, Fitness, Finance)..." 
              className="bg-transparent border-none outline-none w-full text-white text-lg placeholder:text-gray-600"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !topic}
            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-red-500/20"
          >
            {isGenerating ? 'Analyzing Algorithm...' : 'Generate Viral Titles'}
          </button>
        </motion.div>

        {/* Results List */}
        <div className="space-y-4">
          <AnimatePresence>
            {generatedTitles.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#111]/60 backdrop-blur-md border border-white/5 hover:border-red-500/30 transition-colors rounded-2xl p-5 group flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                      <Zap size={12} /> {item.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-100">{item.text}</h3>
                </div>

                <div className="flex items-center gap-4">
                  {/* CTR Score Meter */}
                  <div className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl border ${getScoreColor(item.score)}`}>
                    <span className="text-xs font-bold uppercase mb-0.5">CTR Score</span>
                    <span className="text-xl font-extrabold flex items-center gap-1">
                      {item.score} <TrendingUp size={16} />
                    </span>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => copyTitle(item.text, index)}
                    className="h-[60px] w-[60px] flex items-center justify-center bg-black/50 border border-white/10 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Copy Title"
                  >
                    {copiedIndex === index ? (
                      <CheckCircle2 size={24} className="text-green-500" />
                    ) : (
                      <Copy size={24} />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}