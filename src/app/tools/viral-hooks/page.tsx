// File: src/app/tools/viral-hooks/page.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Copy, CheckCircle2, Zap } from 'lucide-react';
import Link from 'next/link';

// Hamara khud ka offline database (Zero Cost!)
const hooksDatabase = {
  "Tech & Coding": [
    "Stop using [Tool Name]! Use this hidden website instead...",
    "3 secret VS Code shortcuts that will save you 100 hours.",
    "I built a SaaS in 24 hours. Here is the exact blueprint.",
    "This new AI tool is going to replace junior developers.",
    "Why 99% of programmers fail their first coding interview."
  ],
  "Finance & Hustle": [
    "How to make your first ₹10,000 online (Zero skills needed).",
    "Stop saving your money in the bank. Do this instead in 2026.",
    "The biggest lie you've been told about making money online.",
    "3 side hustles that actually work right now.",
    "I tried dropshipping for 30 days. Here is the harsh truth."
  ],
  "Vlogs & Lifestyle": [
    "I made a huge mistake...",
    "A day in the life of a 17-year-old entrepreneur.",
    "Why I stopped doing [Habit] (And you should too).",
    "The harsh reality of living in [City Name].",
    "I completely changed my morning routine. Here's what happened."
  ],
  "Education & Study": [
    "How I cracked [Exam Name] with just 3 months of prep.",
    "Stop studying like this. The 80/20 rule explained.",
    "3 websites every student MUST know about.",
    "How to remember 10x more of what you read.",
    "The secret study technique Harvard students use."
  ]
};

// Object.keys se hum saari categories nikal rahe hain (Tech, Finance, etc.)
const categories = Object.keys(hooksDatabase);

export default function ViralHooksGenerator() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Copy karne ka function
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    // 2 second baad 'Copied!' ka tick wapas normal icon ban jayega
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-orange-500/30 p-6">
      <div className="max-w-4xl mx-auto pt-10">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Tools</span>
        </Link>

        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
              <Zap size={32} />
            </div>
            <h1 className="text-4xl font-bold">Viral Hooks Generator</h1>
          </div>
          <p className="text-gray-400 text-lg mb-10">
            Pehle 3 seconds sabse zaroori hote hain. Apne niche ke hisaab se proven viral hooks copy karo aur views badhao.
          </p>
        </motion.div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeCategory === category 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-[#111] text-gray-400 border border-white/10 hover:border-orange-500/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Hooks List (Dynamic based on Category) */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {hooksDatabase[activeCategory as keyof typeof hooksDatabase].map((hook, index) => (
              <motion.div
                key={`${activeCategory}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#111] border border-white/10 p-5 rounded-2xl flex items-center justify-between gap-4 group hover:border-orange-500/30 transition-colors"
              >
                <p className="text-lg text-gray-200">{hook}</p>
                
                <button
                  onClick={() => copyToClipboard(hook, index)}
                  className="p-3 bg-[#1a1a1a] rounded-xl text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 transition-all flex-shrink-0"
                  title="Copy to clipboard"
                >
                  {copiedIndex === index ? (
                    <CheckCircle2 size={20} className="text-green-500" />
                  ) : (
                    <Copy size={20} />
                  )}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}