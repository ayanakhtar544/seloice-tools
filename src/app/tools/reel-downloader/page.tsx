// File: src/app/tools/reel-downloader/page.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Link as LinkIcon, Loader2, AlertCircle, Video, Heart, Eye, User, AlignLeft, Settings2 } from 'lucide-react';
import Link from 'next/link';

interface IgMeta {
  author: string;
  caption: string;
  likes: number;
  views: number;
  thumbnail: string;
}

interface IgVideo {
  url: string;
  quality: string;
  extension: string;
}

export default function ReelDownloader() {
  const [url, setUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  
  // Naye Data States
  const [metaData, setMetaData] = useState<IgMeta | null>(null);
  const [availableVideos, setAvailableVideos] = useState<IgVideo[]>([]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFetch = async () => {
    setError('');
    setMetaData(null);
    setAvailableVideos([]);
    setSelectedVideoUrl(null);

    if (!url) {
      setError("Bhai, pehle Instagram Reel ki link toh paste kar!");
      return;
    }

    setIsFetching(true);

    try {
      const response = await fetch('/api/ig-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMetaData(data.meta);
        setAvailableVideos(data.availableVideos);
        setSelectedVideoUrl(data.videoUrl); // Default to first/highest quality
      } else {
        setError(data.error || "Video nahi mili. Shayad account private hai.");
      }
    } catch (err) {
      setError("Network issue! Server se connect nahi ho paya.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedVideoUrl) return;
    setIsDownloading(true);
    
    try {
      const response = await fetch(selectedVideoUrl);
      if (!response.ok) throw new Error("CORS Blocked");
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `IG_Reel_${metaData?.author || 'Download'}_${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.log("Direct download blocked, opening in new tab...");
      window.open(selectedVideoUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  // Numbers ko 10k, 1M format me dikhane ka function
  const formatNumber = (num: number) => {
    if (!num) return 'N/A';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-pink-500/30 p-6 flex flex-col items-center relative overflow-hidden">
      
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-5xl pt-4 z-10">
        
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors mb-10 group w-fit">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Tools</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 rounded-3xl mb-6 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
          </div>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            Advanced IG <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">Downloader</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Get full details of any public Instagram Reel. Download in your preferred quality.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#111]/80 backdrop-blur-xl border border-white/10 p-3 rounded-3xl flex flex-col md:flex-row gap-3 mb-8 shadow-2xl relative"
        >
          <div className="absolute -inset-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-[25px] opacity-20 blur-sm pointer-events-none"></div>

          <div className="flex-1 flex items-center px-5 py-4 bg-black/60 rounded-2xl border border-white/5 focus-within:border-pink-500/50 transition-colors relative z-10">
            <LinkIcon size={22} className="text-pink-400 mr-3" />
            <input 
              type="text" 
              placeholder="Paste reel link (e.g. https://www.instagram.com/reel/...)" 
              className="bg-transparent border-none outline-none w-full text-white text-lg placeholder:text-gray-600"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
            />
          </div>
          <button 
            onClick={handleFetch}
            disabled={isFetching || !url}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:opacity-90 text-white disabled:opacity-50 disabled:cursor-not-allowed px-10 py-4 rounded-2xl font-extrabold text-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg relative z-10"
          >
            {isFetching ? <><Loader2 size={24} className="animate-spin" /> Fetching Details...</> : 'Analyze Reel'}
          </button>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3">
                <AlertCircle size={20} /> <p className="font-medium">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {metaData && selectedVideoUrl && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Video Player Section */}
              <div className="md:col-span-5 w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-white/5 relative group">
                <video 
                  src={selectedVideoUrl} 
                  poster={metaData.thumbnail || undefined}
                  autoPlay loop muted controls 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Meta Details & Controls Section */}
              <div className="md:col-span-7 flex flex-col justify-center h-full gap-6">
                
                {/* Author Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-tr from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                    <User size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Reel By</p>
                    <p className="text-lg font-bold">@{metaData.author}</p>
                  </div>
                </div>

                {/* Caption */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-sm text-gray-400 mb-2 flex items-center gap-2"><AlignLeft size={16} /> Caption</p>
                  <p className="text-gray-200 line-clamp-3">{metaData.caption || 'No caption available.'}</p>
                </div>

                {/* Stats (Likes & Views) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                    <div className="p-3 bg-pink-500/20 text-pink-500 rounded-xl"><Heart size={20} className="fill-pink-500/30" /></div>
                    <div>
                      <p className="text-2xl font-bold">{formatNumber(metaData.likes)}</p>
                      <p className="text-xs text-gray-400 font-medium">LIKES</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                    <div className="p-3 bg-blue-500/20 text-blue-500 rounded-xl"><Eye size={20} /></div>
                    <div>
                      <p className="text-2xl font-bold">{formatNumber(metaData.views)}</p>
                      <p className="text-xs text-gray-400 font-medium">VIEWS</p>
                    </div>
                  </div>
                </div>

                {/* Quality Selector & Download */}
                <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-5 mt-auto">
                  
                  {availableVideos.length > 0 && (
                    <div className="mb-4">
                      <label className="text-sm text-gray-400 mb-2 flex items-center gap-2 font-medium">
                        <Settings2 size={16} /> Select Quality
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableVideos.map((vid, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedVideoUrl(vid.url)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${selectedVideoUrl === vid.url ? 'bg-pink-500 text-white border-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.3)]' : 'bg-black/50 text-gray-400 border-white/10 hover:border-white/30'}`}
                          >
                            {vid.quality || `Option ${idx + 1}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full bg-white hover:bg-gray-200 text-black disabled:opacity-50 py-4 rounded-xl font-extrabold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    {isDownloading ? 'Downloading...' : <><Download size={22} /> Download Selected MP4</>}
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}