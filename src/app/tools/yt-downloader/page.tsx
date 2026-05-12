// File: src/app/tools/yt-downloader/page.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Link as LinkIcon, Loader2, AlertCircle, Video, Music, Eye, User, Clock, CheckCircle2, Scissors, HardDrive, ThumbsUp, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';

interface YtMeta {
  title: string;
  author: string;
  views: number;
  duration: string;
  thumbnail: string;
  likes: number;         // NAYA: Likes count
  commentsCount: number; // NAYA: Comments count
  shares: number;        // NAYA: Shares count
}

interface YtFormat {
  quality: string;
  type: string; 
  url: string;
  size: string; 
}

export default function YtDownloader() {
  const [url, setUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const [metaData, setMetaData] = useState<YtMeta | null>(null);
  const [formats, setFormats] = useState<YtFormat[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<YtFormat | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Numbers ko (1.5M, 10K) format me dikhane ka function
  const formatNumber = (num: any) => {
    if (!num) return '0';
    const n = Number(num);
    if (isNaN(n)) return num;
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  const handleFetch = async () => {
    setError(''); setMetaData(null); setFormats([]); setSelectedFormat(null);
    if (!url) { setError("Link daal bhai!"); return; }
    setIsFetching(true);
    try {
      const response = await fetch('/api/yt-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMetaData(data.meta);
        setFormats(data.formats);
        if (data.formats?.length > 0) setSelectedFormat(data.formats[0]); 
      } else {
        setError(data.error || "Fetch fail ho gaya.");
      }
    } catch (err) {
      setError("Network error!");
    } finally { setIsFetching(false); }
  };

  // 🔥 SENIOR DEV PRO DOWNLOADER (Force Download on Same Page)
  const handleDownload = async () => {
    if (!selectedFormat || !metaData) return;
    setIsDownloading(true);
    setDownloadProgress(10); // Start progress

    try {
      const response = await fetch(selectedFormat.url);
      if (!response.ok) throw new Error("CORS or Network Error");

      const reader = response.body?.getReader();
      const contentLength = +(response.headers.get('Content-Length') ?? 0);
      let receivedLength = 0;
      let chunks = [];

      while(true) {
        const {done, value} = await reader!.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
        if (contentLength) {
          setDownloadProgress(Math.round((receivedLength / contentLength) * 100));
        }
      }

      const blob = new Blob(chunks);
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      const ext = selectedFormat.type.includes('audio') ? 'mp3' : 'mp4';
      a.download = `${metaData.title.replace(/[^a-z0-9]/gi, '_')}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      
      setDownloadProgress(0);
    } catch (err) {
      // Fallback: Agar upar wala fail ho jaye (CORS ki wajah se), toh ye jaroor chalega
      window.open(selectedFormat.url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full  bg-[#050505] text-white p-6 flex flex-col items-center relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-red-600/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-5xl pt-4 z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-red-400 mb-8 group"><ArrowLeft size={20} /> Back</Link>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-red-600 rounded-3xl mb-4 shadow-lg"><Download size={40} /></div>
          <h1 className="text-5xl font-extrabold mb-2 italic">YT <span className="text-red-600">PRO</span> DOWNLOADER</h1>
          <p className="text-gray-400">Download high-quality videos and audio with full stats.</p>
        </div>

        {/* Input */}
        <div className="bg-[#111] border border-white/10 p-3 rounded-3xl flex flex-col md:flex-row gap-3 mb-8">
          <input 
            type="text" placeholder="Paste YouTube link..." 
            className="flex-1 bg-black/60 rounded-2xl px-5 py-4 border border-white/5 outline-none focus:border-red-500"
            value={url} onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={handleFetch} disabled={isFetching} className="bg-red-600 px-10 py-4 rounded-2xl font-bold hover:bg-red-700 disabled:opacity-50">
            {isFetching ? 'Fetching...' : 'Get Media'}
          </button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {metaData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111] border border-white/10 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: Thumbnail & Stats */}
              <div className="md:col-span-5 flex flex-col gap-4">
                <img src={metaData.thumbnail} alt="thumb" className="w-full rounded-2xl border border-white/5 shadow-md" />
                
                <div>
                  <h3 className="font-bold text-xl line-clamp-2">{metaData.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-400 flex items-center gap-2"><User size={14} className="text-red-500"/> {metaData.author}</p>
                    <p className="text-sm text-gray-400 flex items-center gap-1"><Clock size={14} className="text-red-500"/> {metaData.duration}</p>
                  </div>
                </div>

                {/* NAYA: 4-Grid Stats Box */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                    <Eye className="text-blue-400" size={18} />
                    <div>
                      <p className="font-bold text-sm">{formatNumber(metaData.views)}</p>
                      <p className="text-[10px] text-gray-500 font-bold tracking-wider">VIEWS</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                    <ThumbsUp className="text-red-400" size={18} />
                    <div>
                      <p className="font-bold text-sm">{formatNumber(metaData.likes)}</p>
                      <p className="text-[10px] text-gray-500 font-bold tracking-wider">LIKES</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                    <MessageSquare className="text-emerald-400" size={18} />
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold tracking-wider">COMMENTS</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                    <Send className="text-purple-400" size={18} />
                    <div>
                      <p className="font-bold text-sm">{formatNumber(metaData.shares)}</p>
                      <p className="text-[10px] text-gray-500 font-bold tracking-wider">SHARES</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Download Selector */}
              <div className="md:col-span-7 flex flex-col gap-4">
                <h4 className="font-bold flex items-center gap-2 border-b border-white/10 pb-2"><Settings2 size={18} className="text-red-500" /> Choose Format</h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {formats.map((f, i) => (
                    <div 
                      key={i} onClick={() => setSelectedFormat(f)}
                      className={`flex items-center justify-between p-4 rounded-xl cursor-pointer border transition-all ${selectedFormat === f ? 'bg-red-600/10 border-red-600 shadow-lg' : 'bg-white/5 border-transparent hover:border-white/10'}`}
                    >
                      <div className="flex items-center gap-3">
                        {f.type.includes('audio') ? <Music className="text-purple-400" /> : <Video className="text-blue-400" />}
                        <div>
                          <p className="font-bold">{f.quality}</p>
                          <p className="text-[10px] text-gray-500 uppercase">{f.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-mono bg-black/40 px-3 py-1 rounded-lg text-red-400 border border-white/5">
                        <HardDrive size={14} /> {f.size}
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleDownload} disabled={isDownloading}
                  className="w-full bg-white text-black py-4 rounded-2xl font-black text-xl hover:bg-gray-200 transition-all shadow-xl shadow-white/5 flex flex-col items-center mt-auto"
                >
                  {isDownloading ? (
                    <div className="w-full px-10">
                      <div className="flex justify-between text-xs mb-1 font-bold"><span>Downloading...</span><span>{downloadProgress}%</span></div>
                      <div className="w-full bg-gray-300 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-red-600 h-full transition-all duration-300" style={{width: `${downloadProgress}%`}}></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2"><Download /> DOWNLOAD NOW</div>
                  )}
                </button>
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

// In global.css (If needed) or Tailwind
const Settings2 = ({size, className}: any) => <Video size={size} className={className} />;