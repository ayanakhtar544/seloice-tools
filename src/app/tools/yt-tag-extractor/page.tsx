// File: src/app/tools/yt-tag-extractor/page.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Copy, CheckCircle2, Loader2, AlertCircle, Search, Tags, Hash } from 'lucide-react';
import Link from 'next/link';

interface TagData {
  title: string;
  thumbnail: string;
  keywords: string[];
  hashtags: string[];
}

export default function YtTagExtractor() {
  const [url, setUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<TagData | null>(null);
  
  const [copiedKeywords, setCopiedKeywords] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  const handleFetch = async () => {
    setError(''); setResult(null);
    if (!url) { setError("YouTube link toh daal bhai!"); return; }
    
    setIsFetching(true);
    try {
      const response = await fetch('/api/yt-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setResult(data.data);
      } else {
        setError(data.error || "Video fetch nahi ho payi.");
      }
    } catch (err) {
      setError("Network error! Server se connect nahi ho paya.");
    } finally { 
      setIsFetching(false); 
    }
  };

  const copyTagsForStudio = () => {
    if (!result?.keywords) return;
    // YT Studio requires comma separated tags
    navigator.clipboard.writeText(result.keywords.join(', '));
    setCopiedKeywords(true);
    setTimeout(() => setCopiedKeywords(false), 2000);
  };

  const copyHashtags = () => {
    if (!result?.hashtags) return;
    // Description hashtags require spaces
    navigator.clipboard.writeText(result.hashtags.join(' '));
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  return (
    <div className="w-full  bg-[#050505] text-white p-6 relative overflow-hidden">
      
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto z-10 relative pt-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-red-500 mb-8 transition-colors">
          <ArrowLeft size={20} /> Back to Tools
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-red-600/10 text-red-500 rounded-3xl mb-4 border border-red-500/20 shadow-[0_0_30px_rgba(220,38,38,0.15)]">
            <Tags size={40} />
          </div>
          <h1 className="text-5xl font-black mb-2 tracking-tight">YT <span className="text-red-600">Tag Stealer</span></h1>
          <p className="text-gray-400">Extract hidden tags and description hashtags from any YouTube video.</p>
        </div>

        {/* Input Area */}
        <div className="bg-[#111] border border-white/10 p-3 rounded-3xl flex flex-col md:flex-row gap-3 mb-8 shadow-2xl">
          <input 
            type="text" placeholder="Paste YouTube Video Link here..." 
            className="flex-1 bg-black/60 rounded-2xl px-5 py-4 border border-white/5 outline-none focus:border-red-500 text-lg placeholder:text-gray-600"
            value={url} onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
          />
          <button 
            onClick={handleFetch} disabled={isFetching || !url} 
            className="bg-red-600 px-10 py-4 rounded-2xl font-bold hover:bg-red-700 disabled:opacity-50 transition-all flex justify-center items-center gap-2 whitespace-nowrap"
          >
            {isFetching ? <><Loader2 size={20} className="animate-spin" /> Extracting...</> : <><Search size={20} /> Extract Tags</>}
          </button>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-8">
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3">
                <AlertCircle size={20} /> <p className="font-medium">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* Video Info Card */}
              <div className="bg-[#111] border border-white/10 rounded-3xl p-4 flex items-center gap-4">
                <img src={result.thumbnail} alt="Thumbnail" className="w-32 aspect-video object-cover rounded-xl border border-white/5" />
                <h3 className="font-bold text-lg line-clamp-2">{result.title}</h3>
              </div>

              {/* Box 1: YT Studio Keywords */}
              <div className="bg-[#111] border border-white/10 rounded-3xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2"><Tags className="text-red-500" /> Hidden Keywords (YT Studio)</h3>
                    <p className="text-xs text-gray-500 mt-1">Copy & paste these directly into the YT Studio "Tags" box.</p>
                  </div>
                  <button 
                    onClick={copyTagsForStudio} disabled={result.keywords.length === 0}
                    className="bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm transition-all disabled:opacity-50"
                  >
                    {copiedKeywords ? <><CheckCircle2 size={16} className="text-green-400"/> Copied!</> : <><Copy size={16}/> Copy Comma Separated</>}
                  </button>
                </div>
                
                {result.keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((tag, i) => (
                      <span key={i} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-sm text-gray-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">Is creator ne video me koi hidden tags nahi daale hain.</p>
                )}
              </div>

              {/* Box 2: Description Hashtags */}
              <div className="bg-[#111] border border-white/10 rounded-3xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2"><Hash className="text-blue-500" /> Description Hashtags</h3>
                    <p className="text-xs text-gray-500 mt-1">Copy these to use in your video description.</p>
                  </div>
                  <button 
                    onClick={copyHashtags} disabled={result.hashtags.length === 0}
                    className="bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm transition-all disabled:opacity-50"
                  >
                    {copiedHashtags ? <><CheckCircle2 size={16} className="text-green-400"/> Copied!</> : <><Copy size={16}/> Copy Hashtags</>}
                  </button>
                </div>
                
                {result.hashtags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.hashtags.map((tag, i) => (
                      <span key={i} className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">Video ke description me koi hashtags nahi mile.</p>
                )}
              </div>

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