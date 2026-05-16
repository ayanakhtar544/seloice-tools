// File: src/app/tools/yt-downloader/page.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaySquare, ArrowLeft, Download, Loader2, Link as LinkIcon, AlertCircle, Music, Video, Eye, ThumbsUp, Clock, Share2, Layers, Scissors, Lock } from 'lucide-react';
import Link from 'next/link';
import ToolInterfaceShell from '@/components/seo/ToolInterfaceShell';

// ... (Baaki upar ka interface aur state same rahega) ...
interface VideoData {
  meta: { title: string; thumbnail: string; views: string; likes: string; duration: string; shares: string; };
  formats: { quality: string; type: string; url: string; size: string; ext?: string; }[];
}

const fetchJsonWithRetry = async (
  input: RequestInfo | URL,
  init: RequestInit,
  retries = 1
) => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 30_000);

    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal,
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = data?.error || 'Failed to fetch video.';
        if (attempt === retries) {
          throw new Error(message);
        }
        lastError = new Error(message);
      } else {
        return data as VideoData;
      }
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        throw error;
      }
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Request failed.');
};

export default function YtDownloaderClient() {
  const [url, setUrl] = useState('');
  
  // ✂️ TRIMMER STATES (Ab hum isko PRO feature ki tarah treat karenge)
  const [isTrimming, setIsTrimming] = useState(false);
  const [showProAlert, setShowProAlert] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'MP4' | 'MP3'>('ALL');
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    const normalizedUrl = url.trim();
    if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(normalizedUrl)) {
      setErrorMsg('Please paste a valid YouTube or youtu.be link.');
      return;
    }

    setIsLoading(true);
    setVideoData(null);
    setErrorMsg(null);
    setActiveFilter('ALL');

    try {
      const data = await fetchJsonWithRetry('/api/yt-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalizedUrl }),
      }, 1);
      setVideoData(data);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to fetch video.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceDownload = (
    e: React.MouseEvent<HTMLAnchorElement>,
    downloadUrl: string,
    title: string,
    type: string,
    formatExt: string | undefined,
    index: number
  ) => {
    e.preventDefault();
    setDownloadingIndex(index);
    const ext = formatExt || (type.includes('Audio') ? 'mp3' : 'mp4');
    const proxyUrl = `/api/force-download?url=${encodeURIComponent(downloadUrl)}&title=${encodeURIComponent(title)}&ext=${ext}`;
    window.location.href = proxyUrl;
    window.setTimeout(() => setDownloadingIndex(null), 1500);
  };

  const filteredFormats = videoData?.formats.filter(format => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'MP4') return format.type.includes('Video');
    if (activeFilter === 'MP3') return format.type.includes('Audio');
    return true;
  }) || [];

  return (
    <ToolInterfaceShell className="w-full max-w-5xl">
    <div className="w-full bg-[#050505] text-white font-sans">
      <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
        <div className="background-orb absolute top-[-10%] w-[40rem] h-[40rem] bg-red-600/10 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="relative z-10 mx-auto px-1 pt-4 md:pt-8">
        
        <Link href="/" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-bold text-xs uppercase tracking-widest mb-10 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
          <ArrowLeft size={16} /> Back to Toolkit
        </Link>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 p-[2px] rounded-2xl mx-auto mb-6 shadow-xl shadow-red-500/20 rotate-3">
            <div className="w-full h-full bg-[#111] rounded-[14px] flex items-center justify-center">
              <PlaySquare size={28} className="text-white" />
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 uppercase">YT <span className="text-red-500">DOWNLOADER</span></h2>
        </div>

        {/* 🚀 MAIN INPUT FORM */}
        <div className="bg-[#111] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl mb-10 max-w-3xl mx-auto">
          <form onSubmit={handleFetch} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-red-500 uppercase tracking-widest mb-4">
                <LinkIcon size={16} /> Paste Video Link
              </label>
              <input 
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-red-500 outline-none"
              />
            </div>
            
            {/* ✂️ TRIMMER UI MODULE (NOW LOCKED AS PRO) */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
              <div 
                 className="flex items-center justify-between cursor-pointer" 
                 onClick={() => {
                    setIsTrimming(!isTrimming);
                    setShowProAlert(true);
                    setTimeout(() => setShowProAlert(false), 3000); // 3 sec me alert gayab
                 }}
              >
                 <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${isTrimming ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-gray-500'}`}>
                       <Scissors size={20} />
                    </div>
                    <div>
                       <div className="flex items-center gap-2">
                           <p className="font-bold text-sm md:text-base text-white">Advanced Video Trim</p>
                           <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[10px] font-black px-2 py-0.5 rounded-sm tracking-wider uppercase flex items-center gap-1">
                              <Lock size={10} /> PRO
                           </span>
                       </div>
                       <p className="text-xs text-gray-500">Download specific part of the video.</p>
                    </div>
                 </div>
                 
                 {/* Custom Toggle Switch */}
                 <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 bg-white/10 opacity-50`}>
                    <motion.div layout className="w-4 h-4 bg-gray-400 rounded-full shadow-md" style={{ marginLeft: '0px' }} />
                 </div>
              </div>

              {/* PRO ALERT MESSAGE */}
              <AnimatePresence>
                 {showProAlert && (
                    <motion.div 
                       initial={{ opacity: 0, y: -10 }} 
                       animate={{ opacity: 1, y: 0 }} 
                       exit={{ opacity: 0, y: -10 }} 
                       className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center border border-orange-500/30 rounded-2xl z-10"
                    >
                       <p className="text-orange-400 font-bold text-sm flex items-center gap-2">
                          <Lock size={16} /> Coming Soon
                       </p>
                    </motion.div>
                 )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {errorMsg && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 text-sm font-medium">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button disabled={isLoading || !url.trim()} className="w-full py-4 rounded-xl bg-red-600 text-white font-black uppercase tracking-widest text-sm shadow-[0_6px_0_0_#991b1b] active:translate-y-1 active:shadow-none transition-all hover:bg-red-500 flex items-center justify-center gap-2 disabled:opacity-50">
              {isLoading ? <><Loader2 size={18} className="animate-spin" /> FETCHING VIDEO...</> : <><Download size={18} /> DOWNLOAD </>}
            </button>
          </form>
        </div>

        {/* ... (NEACHE KA RESULTS SECTION SAME RAHEGA JO PICHLE CODE ME THA) ... */}
        
        {/* 🎬 RESULTS SECTION */}
        <AnimatePresence>
          {videoData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl">
              
              <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start border-b border-white/10 pb-8">
                <div className="relative group w-full md:w-72 shrink-0">
                   <img src={videoData.meta.thumbnail} alt="Thumbnail" className="w-full rounded-xl border border-white/10 aspect-video object-cover shadow-lg" />
                   <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 border border-white/10">
                     <Clock size={12} className="text-red-500"/> {videoData.meta.duration}
                   </div>
                </div>

                <div className="w-full">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-snug">{videoData.meta.title}</h3>
                  <div className="flex flex-wrap gap-4 md:gap-6 bg-black/30 p-4 rounded-xl border border-white/5 mb-4">
                     <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Views</span><div className="flex items-center gap-2 text-sm font-bold"><Eye size={16} className="text-blue-400" /> {videoData.meta.views}</div></div>
                     <div className="w-px bg-white/10 hidden md:block"></div>
                     <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Likes</span><div className="flex items-center gap-2 text-sm font-bold"><ThumbsUp size={16} className="text-green-400" /> {videoData.meta.likes}</div></div>
                     <div className="w-px bg-white/10 hidden md:block"></div>
                     <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Shares</span><div className="flex items-center gap-2 text-sm font-bold"><Share2 size={16} className="text-purple-400" /> {videoData.meta.shares}</div></div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6">
                    <button onClick={() => setActiveFilter('ALL')} className={`px-5 py-2.5 rounded-full font-bold text-xs md:text-sm flex items-center gap-2 transition-all border ${activeFilter === 'ALL' ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}><Layers size={16} /> All Formats</button>
                    <button onClick={() => setActiveFilter('MP4')} className={`px-5 py-2.5 rounded-full font-bold text-xs md:text-sm flex items-center gap-2 transition-all border ${activeFilter === 'MP4' ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}><Video size={16} /> Video (MP4)</button>
                    <button onClick={() => setActiveFilter('MP3')} className={`px-5 py-2.5 rounded-full font-bold text-xs md:text-sm flex items-center gap-2 transition-all border ${activeFilter === 'MP3' ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}><Music size={16} /> Audio (MP3)</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredFormats.map((format, i) => {
                  const isAudio = format.type.includes("Audio");
                  return (
                    <motion.a layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} key={`${activeFilter}-${i}`} href={format.url} onClick={(e) => handleForceDownload(e, format.url, videoData.meta.title, format.type, format.ext, i)} className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-red-600/20 hover:border-red-500 transition-all flex items-center justify-between gap-4 group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${isAudio ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-500'} group-hover:bg-red-500 group-hover:text-white transition-colors`}>{isAudio ? <Music size={20} /> : <Video size={20} />}</div>
                        <div>
                          <p className="font-bold text-sm md:text-base group-hover:text-white">{format.quality}</p>
                          <p className="text-xs text-gray-400 font-medium tracking-wide">{format.size} • {format.type}</p>
                        </div>
                      </div>
                      <div className="bg-white/10 p-3 rounded-lg group-hover:bg-red-500 transition-colors shrink-0">
                        {downloadingIndex === i ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                      </div>
                    </motion.a>
                  )
                })}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
    </ToolInterfaceShell>
  );
}
