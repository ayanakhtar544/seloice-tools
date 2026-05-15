// File: src/app/tools/hashtag-extractor/page.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Hash, Copy, CheckCircle2, Loader2, AlertCircle, FileText, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function HashtagExtractorClient() {
  const [inputText, setInputText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{hashtags: string[], totalFound: number, uniqueCount: number} | null>(null);
  
  // Copy state handle karne ke liye
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleExtract = async () => {
    setError('');
    setResult(null);
    
    if (!inputText.trim()) {
      setError("Pehle koi caption ya text paste kar bhai!");
      return;
    }

    setIsExtracting(true);

    try {
      const response = await fetch('/api/hashtag-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data.data);
      } else {
        setError(data.error || "Kuch gadbad ho gayi.");
      }
    } catch (err) {
      setError("Network error! Server se connect nahi ho paya.");
    } finally {
      setIsExtracting(false);
    }
  };

  const copyAll = () => {
    if (!result?.hashtags) return;
    navigator.clipboard.writeText(result.hashtags.join(' '));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const copySingle = (tag: string, index: number) => {
    navigator.clipboard.writeText(tag);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearText = () => {
    setInputText('');
    setResult(null);
    setError('');
  };

  return (
    <div className="w-full  bg-[#050505] text-white p-6 flex flex-col items-center relative overflow-hidden selection:bg-blue-500/30">
      
      {/* Background Glow (Twitter/Blue Vibe) */}
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-4xl pt-4 z-10">
{/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-3xl mb-4 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <Hash size={40} className="text-white" />
          </div>
          <h2 className="text-5xl font-black mb-2 tracking-tight">Hashtag <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Extractor</span></h2>
          <p className="text-gray-400">Paste any caption, comment, or text and extract all hashtags instantly.</p>
        </div>

        {/* Input Area */}
        <div className="bg-[#111] border border-white/10 rounded-3xl p-4 shadow-2xl mb-8">
          <div className="relative">
            <textarea
              rows={6}
              placeholder="Paste your text here (e.g. This is a viral video #trending #viral #fyp)..."
              className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 resize-none custom-scrollbar"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            {inputText && (
              <button onClick={clearText} className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-all">
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <button 
            onClick={handleExtract}
            disabled={isExtracting || !inputText}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white disabled:opacity-50 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {isExtracting ? <><Loader2 size={22} className="animate-spin" /> Extracting...</> : <><FileText size={22} /> Extract Hashtags</>}
          </button>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8">
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3">
                <AlertCircle size={20} /> <p className="font-medium">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111] border border-white/10 rounded-3xl p-6 shadow-2xl">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 mb-6 gap-4">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Hash className="text-blue-500" /> Extracted Tags
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Found {result.uniqueCount} unique hashtags (Total: {result.totalFound})
                  </p>
                </div>

                {result.hashtags.length > 0 && (
                  <button 
                    onClick={copyAll}
                    className="bg-white/10 hover:bg-white/20 border border-white/5 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm"
                  >
                    {copiedAll ? <><CheckCircle2 size={18} className="text-green-400"/> Copied All!</> : <><Copy size={18}/> Copy All Tags</>}
                  </button>
                )}
              </div>

              {result.hashtags.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {result.hashtags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => copySingle(tag, idx)}
                      className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${copiedIndex === idx ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-black/50 border-white/10 hover:border-blue-500 hover:bg-blue-500/10'}`}
                    >
                      <span className="font-medium">{tag}</span>
                      {copiedIndex === idx ? <CheckCircle2 size={14} /> : <Copy size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 font-medium">
                  Is text mein koi hashtag nahi mila bhai. 😅
                </div>
              )}
              
            </motion.div>
          )}
        </AnimatePresence>

</div>
    </div>
  );
}