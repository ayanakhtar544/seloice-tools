// File: src/app/tools/smart-captions/page.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageSquareText, Copy, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Zero-Cost Template Engine
const captionTemplates = {
  Educational: [
    "Stop scrolling if you want to master [TOPIC]! 🛑\n\nMost people get this completely wrong. Here is the exact framework I use:\n\n1️⃣ [Point 1]\n2️⃣ [Point 2]\n3️⃣ [Point 3]\n\nSave this post for later so you don't lose it! 📌\n\n#[TOPIC] #learn[TOPIC] #tipsandtricks #growth",
    "3 Secrets about [TOPIC] nobody is telling you 🤫👇\n\nI spent months figuring this out the hard way so you don't have to. The biggest game-changer for me was focusing on the basics.\n\nWhich one surprised you the most? Let me know in the comments! 💬👇\n\n#[TOPIC]tips #expertadvice #value",
  ],
  Motivational: [
    "Your journey with [TOPIC] starts TODAY. 🚀\n\nStop waiting for the 'perfect moment'. It doesn't exist. The only thing standing between you and your goals is the work you haven't done yet.\n\nDouble tap if you're ready to put in the work! ❤️🔥\n\n#motivation #[TOPIC] #grind #successmindset",
    "They said I couldn't do it. So I did it anyway. 💯\n\nMastering [TOPIC] wasn't easy, but it was worth every single sleepless night. Keep pushing, keep grinding, and never let them doubt you.\n\nTag someone who needs to hear this today! 👇👤\n\n#inspiration #nevergiveup #[TOPIC]goals",
  ],
  Controversial: [
    "Unpopular Opinion: What you know about [TOPIC] is WRONG. 🤯\n\nEveryone is teaching the old methods, but the algorithm has changed. If you are still doing it the traditional way, you are leaving so much on the table.\n\nDo you agree or disagree? Let's debate in the comments! 🗣️🔥\n\n#hotake #[TOPIC] #truthbomb #newway",
    "Why 99% of people FAIL at [TOPIC] 📉\n\nIt’s not because of lack of talent. It’s because they focus on the wrong metrics. Stop obsessing over the small things and look at the bigger picture.\n\nRead that again. 🧠 Drop a 💯 if this makes sense.\n\n#realitycheck #[TOPIC] #mindsetshift",
  ]
};

type ToneType = keyof typeof captionTemplates;
const tones: ToneType[] = ["Educational", "Motivational", "Controversial"];

export default function SmartCaptions() {
  const [topic, setTopic] = useState('');
  const [activeTone, setActiveTone] = useState<ToneType>('Educational');
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setGeneratedCaptions([]);

    // AI thinking effect
    setTimeout(() => {
      // Topic ke spaces hata kar tag friendly banana (e.g., "weight loss" -> "weightloss")
      const safeTopic = topic.trim().replace(/\s+/g, '');
      
      const results = captionTemplates[activeTone].map(template => {
        // [TOPIC] ko replace kar rahe hain hamare keyword se
        return template.replace(/\[TOPIC\]/g, topic).replace(/#\[TOPIC\]/g, `#${safeTopic}`);
      });
      
      setGeneratedCaptions(results);
      setIsGenerating(false);
    }, 1000);
  };

  const copyCaption = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-500/30 relative overflow-hidden p-6 flex flex-col items-center">
      
      {/* Background Orbs */}
      <div className="absolute top-[-5%] right-[10%] w-[30rem] h-[30rem] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl pt-10 z-10">
        
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors mb-10 group w-fit">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Tools</span>
        </Link>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl mb-6 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <MessageSquareText size={36} className="text-amber-400" />
          </div>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            Smart <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Caption Writer</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Stop staring at a blank screen. Generate highly engaging, formatting-ready captions for your Reels and Shorts instantly.
          </p>
        </motion.div>

        {/* Control Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-[#111]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl mb-10 shadow-2xl"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">What is your post about?</label>
            <div className="flex items-center px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus-within:border-amber-500/50 transition-colors">
              <Sparkles size={20} className="text-amber-500 mr-3" />
              <input 
                type="text" 
                placeholder="E.g., 3 Tips to grow on YouTube..." 
                className="bg-transparent border-none outline-none w-full text-white text-lg placeholder:text-gray-600"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-2">Select Tone</label>
              <div className="flex flex-wrap gap-2">
                {tones.map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setActiveTone(tone)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeTone === tone 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' 
                        : 'bg-black/50 text-gray-400 border border-white/5 hover:border-white/20'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-amber-500/20"
            >
              {isGenerating ? <Loader2 size={20} className="animate-spin" /> : 'Write Captions'}
            </button>
          </div>
        </motion.div>

        {/* Results Area */}
        <div className="space-y-6">
          <AnimatePresence>
            {generatedCaptions.map((caption, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#111]/50 backdrop-blur-md border border-white/5 hover:border-amber-500/30 transition-colors rounded-3xl p-6 group relative"
              >
                {/* Floating Copy Button */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => copyCaption(caption, index)}
                    className="p-2.5 bg-black/50 border border-white/10 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all flex items-center gap-2 backdrop-blur-sm"
                  >
                    {copiedIndex === index ? (
                      <><CheckCircle2 size={18} className="text-green-500" /> <span className="text-sm font-medium text-green-500">Copied!</span></>
                    ) : (
                      <><Copy size={18} /> <span className="text-sm font-medium">Copy</span></>
                    )}
                  </button>
                </div>

                <div className="pr-24">
                  <span className="inline-block px-3 py-1 bg-white/5 rounded-full text-xs font-medium text-gray-400 mb-4 border border-white/5">
                    Option {index + 1} • {activeTone}
                  </span>
                  {/* whitespace-pre-wrap is important to render \n as new lines */}
                  <p className="text-gray-200 text-lg whitespace-pre-wrap leading-relaxed">
                    {caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}