// File: src/app/tools/tweet-generator/page.tsx
"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Heart, Repeat, Share, MessageCircle, BadgeCheck, Settings, Camera } from 'lucide-react';
import Link from 'next/link';
import { toPng } from 'html-to-image';

export default function TweetGenerator() {
  const [name, setName] = useState('Abushahma Akhtar');
  const [username, setUsername] = useState('ansari_bhaiya');
  const [tweetText, setTweetText] = useState('Just built my first SaaS toolkit for creators! Zero server cost, crazy fast, and fully offline AI. 🚀🔥');
  const [time, setTime] = useState('10:30 AM · May 10, 2026');
  const [likes, setLikes] = useState('12.4K');
  const [retweets, setRetweets] = useState('3,205');
  const [isVerified, setIsVerified] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light' | 'dim'>('dim');
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const tweetRef = useRef<HTMLDivElement>(null);

  // SENIOR DEV FIX: Image ko Base64 format me convert karna taaki download fail na ho
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      // Base64 string directly html-to-image ke sath perfectly kaam karti hai
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = async () => {
    if (!tweetRef.current) return;
    setIsDownloading(true);
    
    try {
      // cacheBust aur pixelRatio add kiya hai better quality ke liye
      const dataUrl = await toPng(tweetRef.current, { 
        cacheBust: true, 
        pixelRatio: 3,
        backgroundColor: 'transparent'
      });
      
      const link = document.createElement('a');
      link.download = `viral_tweet_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      setError("Failed to generate image. Please refresh and try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const getThemeClasses = () => {
    switch(theme) {
      case 'light': return 'bg-white text-black border-gray-200';
      case 'dim': return 'bg-[#15202b] text-white border-gray-800';
      case 'dark': return 'bg-black text-white border-gray-800';
    }
  };

  return (
    <div className="w-full  bg-[#050505] text-white selection:bg-blue-500/30 p-6 flex flex-col items-center relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-sky-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-6xl pt-4 z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors mb-8 group w-fit">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Tools</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500/10 to-sky-500/10 border border-blue-500/20 rounded-2xl mb-6 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
          </div>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Viral <span className="bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">Tweet Generator</span></h1>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5 bg-[#111]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex flex-col gap-5">
            <div className="flex items-center gap-2 mb-2 text-gray-300 font-bold"><Settings size={20} /> Settings</div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm text-gray-400 mb-1">Display Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-blue-500" /></div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Username</label>
                <div className="flex items-center bg-black/50 border border-white/10 rounded-xl px-3 focus-within:border-blue-500"><span className="text-gray-500">@</span><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-transparent py-2 px-1 outline-none" /></div>
              </div>
            </div>
            <div><label className="block text-sm text-gray-400 mb-1">Tweet Content</label><textarea value={tweetText} onChange={(e) => setTweetText(e.target.value)} rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 resize-none" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm text-gray-400 mb-1">Likes</label><input type="text" value={likes} onChange={(e) => setLikes(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-blue-500" /></div>
              <div><label className="block text-sm text-gray-400 mb-1">Retweets</label><input type="text" value={retweets} onChange={(e) => setRetweets(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-blue-500" /></div>
            </div>
            <div className="mt-2">
              <label className="block text-sm text-gray-400 mb-2">Theme Style</label>
              <div className="flex gap-2">
                <button onClick={() => setTheme('light')} className={`flex-1 py-2 rounded-lg font-bold ${theme === 'light' ? 'bg-white text-black' : 'bg-white/10'}`}>Light</button>
                <button onClick={() => setTheme('dim')} className={`flex-1 py-2 rounded-lg font-bold ${theme === 'dim' ? 'bg-[#15202b] border border-blue-500 text-white' : 'bg-white/10'}`}>Dim</button>
                <button onClick={() => setTheme('dark')} className={`flex-1 py-2 rounded-lg font-bold ${theme === 'dark' ? 'bg-black border border-blue-500 text-white' : 'bg-white/10'}`}>Dark</button>
              </div>
            </div>
          </motion.div>

          {/* Preview Panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full overflow-hidden rounded-3xl p-6 md:p-12 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-white/5 flex justify-center items-center mb-8">
              <div ref={tweetRef} className={`w-full max-w-[500px] border rounded-2xl p-6 shadow-2xl transition-all ${getThemeClasses()}`} style={{ fontFamily: '-apple-system, sans-serif' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    
                    <div 
                      onClick={() => avatarInputRef.current?.click()}
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-white text-xl shadow-inner cursor-pointer overflow-hidden relative group border border-white/10"
                      title="Click to change profile picture"
                    >
                      <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                      {avatarUrl ? (
                         // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarUrl} alt="DP" crossOrigin="anonymous" className="w-full h-full object-cover" />
                      ) : (
                        name.charAt(0).toUpperCase()
                      )}
                      <div className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center transition-all">
                        <Camera size={18} className="text-white" />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-1 font-bold text-lg leading-tight">{name} {isVerified && <BadgeCheck size={18} className="text-[#1d9bf0] fill-[#1d9bf0]" strokeWidth={1} color="white" />}</div>
                      <div className={`text-[15px] ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>@{username}</div>
                    </div>
                  </div>
                </div>
                <p className="text-[22px] leading-[1.3] mb-4 whitespace-pre-wrap break-words">{tweetText}</p>
                <div className={`text-[15px] pb-4 border-b ${theme === 'light' ? 'text-gray-500 border-gray-100' : 'text-gray-400 border-gray-800'}`}>{time}</div>
                <div className={`flex items-center gap-6 py-4 border-b ${theme === 'light' ? 'border-gray-100' : 'border-gray-800'}`}>
                  <div className="flex gap-1 text-[15px]"><span className="font-bold">{retweets}</span> <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Retweets</span></div>
                  <div className="flex gap-1 text-[15px]"><span className="font-bold">{likes}</span> <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Likes</span></div>
                </div>
              </div>
            </div>
            <button onClick={handleDownload} disabled={isDownloading} className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 w-full max-w-[500px] py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              {isDownloading ? 'Generating HD Image...' : <><Download size={22} /> Download HD Image</>}
            </button>
          </motion.div>
        </div>
      
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