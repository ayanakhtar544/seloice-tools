// File: src/app/tools/thumbnail-extractor/page.tsx
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function ThumbnailExtractor() {
  const [url, setUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  // YouTube URL se Video ID nikalne ka logic
  const extractVideoId = (link: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = link.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleExtract = () => {
    setError('');
    setThumbnailUrl(null);

    if (!url) {
      setError("Bhai, pehle YouTube URL toh daal!");
      return;
    }

    const videoId = extractVideoId(url);
    
    if (videoId) {
      // YouTube apne thumbnails is format me save karta hai (maxresdefault is highest quality)
      const hdThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      setThumbnailUrl(hdThumbnail);
    } else {
      setError("Invalid YouTube URL. Sahi link daal yaar.");
    }
  };

  return (
    <div className="w-full  bg-[#0a0a0a] text-white selection:bg-blue-500/30 p-6">
      <div className="max-w-4xl mx-auto pt-10">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Tools</span>
        </Link>

        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
              <ImageIcon size={32} />
            </div>
            <h1 className="text-4xl font-bold">Thumbnail Extractor</h1>
          </div>
          <p className="text-gray-400 text-lg mb-10">
            Kisi bhi YouTube video ka High-Quality (HD) thumbnail extract aur download karo, bilkul free.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-[#111] border border-white/10 p-2 rounded-2xl flex flex-col md:flex-row gap-2 mb-10"
        >
          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] rounded-xl border border-white/5">
            <LinkIcon size={20} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Paste YouTube Video URL here..." 
              className="bg-transparent border-none outline-none w-full text-white placeholder:text-gray-600"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
            />
          </div>
          <button 
            onClick={handleExtract}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-colors whitespace-nowrap"
          >
            Extract Image
          </button>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-center mb-8">
            {error}
          </motion.p>
        )}

        {/* Result Section */}
        {thumbnailUrl && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col items-center"
          >
            <h3 className="text-xl font-bold mb-6 w-full text-left">Your HD Thumbnail</h3>
            <div className="relative w-full max-w-2xl rounded-xl overflow-hidden border border-white/10 mb-6 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbnailUrl} alt="YouTube Thumbnail" className="w-full h-auto object-cover" />
            </div>
            
            <a 
              href={thumbnailUrl} 
              target="_blank" 
              rel="noreferrer"
              // Download attribute directly kaam nahi karega cross-origin ki wajah se, isliye naye tab me open karwa rahe hain
              download="thumbnail.jpg"
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              <Download size={20} />
              <span>Download Image (Right Click & Save)</span>
            </a>
          </motion.div>
        )}

      
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