// File: src/app/tools/yt-downloader/page.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaySquare, ArrowLeft, Loader2, Link as LinkIcon, AlertCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import ToolInterfaceShell from '@/components/seo/ToolInterfaceShell';
import { addHistory } from '@/lib/history';

export default function YtDownloaderClient() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Is handleFetch ko apne page.tsx mein replace kar de
  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    const normalizedUrl = url.trim();
    
    // 1. URL Validate karo
    if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be|youtube\.com\/shorts)\//i.test(normalizedUrl)) {
      setErrorMsg('Bhai, please ek valid YouTube link daal.');
      return;
    }

    setIsLoading(true);
    
    // 2. Redirect Strategy: Hum use direct download portal par bhej rahe hain
    // Y2Mate.is ka interface kaafi clean hai aur direct link accept karta hai
    const redirectUrl = `https://y2mate.is/en-2485573/?url=${encodeURIComponent(normalizedUrl)}`;
    
    setTimeout(() => {
        window.open(redirectUrl, '_blank');
        setIsLoading(false);
        setUrl('');
        addHistory({
          toolSlug: 'yt-downloader',
          toolName: 'YouTube Downloader',
          actionDesc: `Requested download for YouTube video: ${normalizedUrl}`,
        });
    }, 800);
  };


  return (
    <ToolInterfaceShell className="w-full max-w-5xl">
    <div className="w-full min-h-[80vh] bg-[#050505] text-white font-sans flex flex-col relative">
      <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
        <div className="absolute top-[-10%] w-[40rem] h-[40rem] bg-red-600/10 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="relative z-10 mx-auto px-4 pt-10 md:pt-16 w-full max-w-3xl">
        
        <Link href="/" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-bold text-xs uppercase tracking-widest mb-10 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20 w-fit transition-colors">
          <ArrowLeft size={16} /> Back to Toolkit
        </Link>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-800 p-[2px] rounded-2xl mx-auto mb-6 shadow-xl shadow-red-500/20 rotate-3">
            <div className="w-full h-full bg-[#111] rounded-[14px] flex items-center justify-center">
              <PlaySquare size={28} className="text-white" />
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 uppercase">YT <span className="text-red-500">DOWNLOADER</span></h2>
          <p className="text-zinc-400 text-sm font-medium max-w-md mx-auto">Fast, secure downloads. Unblocked and working smoothly everywhere.</p>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />

          <form onSubmit={handleFetch} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-red-500 uppercase tracking-widest mb-4">
                <LinkIcon size={16} /> Paste Video or Shorts Link
              </label>
              <input 
  type="text"
  placeholder="Click to download YouTube video..."
  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-red-500 outline-none cursor-pointer"
  
  // 🔥 Yahan hai asli magic 🔥
  onFocus={(e) => {
    // Ye tab ko naye window mein khol dega
    window.open('https://vidssave.com', '_blank');
    
    // User ko wapas apne site par laane ke liye focus hata do
    e.target.blur();
  }}
/>
            </div>

            <AnimatePresence>
              {errorMsg && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 text-sm font-medium mt-2">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <p>{errorMsg}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              disabled={isLoading || !url.trim()} 
              className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-black uppercase tracking-widest text-sm shadow-[0_6px_0_0_#7f1d1d] active:translate-y-1 active:shadow-none transition-all hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Loader2 size={18} className="animate-spin" /> BYPASSING SECURELY...</>
              ) : (
                <><ExternalLink size={18} /> OPEN DOWNLOADER </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500 font-bold tracking-wider uppercase">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             SELOICE TOOLS
          </div>
        </div>

      </div>
    </div>
    </ToolInterfaceShell>
  );
}