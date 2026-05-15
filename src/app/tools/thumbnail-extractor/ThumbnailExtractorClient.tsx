// File: src/app/tools/thumbnail-extractor/page.tsx
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function ThumbnailExtractorClient() {
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
{/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
              <ImageIcon size={32} />
            </div>
            <h2 className="text-4xl font-bold">Thumbnail Extractor</h2>
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

</div>
    </div>
  );
}