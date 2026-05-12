// File: src/app/tools/hashtag-extractor/page.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Hash, Copy, CheckCircle2, Loader2, AlertCircle, FileText, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function HashtagExtractor() {
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
        
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-400 mb-8 group transition-colors">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Tools
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-3xl mb-4 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <Hash size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-black mb-2 tracking-tight">Hashtag <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Extractor</span></h1>
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

      
        {/* Try Other Tools Section */}
        <div className="border-t border-white/10 pt-12 pb-8 mt-16 w-full">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl md:text-2xl font-black italic uppercase flex items-center gap-2">Try Other Tools</h3>
             <a href="/#tools" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">View All</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/tools/video-compressor">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 group">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">Video Compressor</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Free Tool</p>
                </div>
              </div>
            </a>
            <a href="/tools/auto-captions">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 group">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13h4"/><path d="M15 13h2"/><path d="M7 9h2"/><path d="M13 9h4"/><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">Auto Captions</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Free Tool</p>
                </div>
              </div>
            </a>
            <a href="/tools/bg-remover">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 group">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">BG Remover</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Free Tool</p>
                </div>
              </div>
            </a>
          </div>
        </div>
</div>
    </div>
  );
}