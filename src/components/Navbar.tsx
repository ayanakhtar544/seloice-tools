/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Download, Video, Type, Scissors, 
  Hash, Zap, Search, ChevronDown, Music, Image as ImageIcon,
  Layout, Mic, Maximize, MessageSquare
} from 'lucide-react';

const megaMenuCategories = [
  {
    title: 'Download Tools',
    icon: <Download size={18} className="text-red-400" />,
    items: [
      { name: 'Instagram Reel Downloader', icon: <Download />, href: '/tools/reel-downloader', desc: 'No watermark IG reels' },
      { name: 'YouTube Downloader', icon: <Download />, href: '/tools/yt-downloader', desc: '4K/8K High speed' },
      { name: 'Shorts Downloader', icon: <Download />, href: '/tools/yt-downloader', desc: 'YT Shorts without watermark' },
      { name: 'Thumbnail Downloader', icon: <ImageIcon />, href: '/tools/thumbnail-extractor', desc: 'Get HD YouTube covers' },
    ]
  },
  {
    title: 'Editing Tools',
    icon: <Video size={18} className="text-orange-400" />,
    items: [
      { name: 'MP4 to MP3', icon: <Music />, href: '/tools/mp4-to-mp3', desc: 'Extract clean audio' },
      { name: 'Video Compressor', icon: <Video />, href: '/tools/video-compressor', desc: 'Reduce size, keep quality' },
      { name: 'Video Splitter', icon: <Scissors />, href: '/tools/video-compressor', desc: 'Cut and trim videos' },
      { name: 'Merge Videos', icon: <Layout />, href: '/tools/video-compressor', desc: 'Combine multiple clips' },
      { name: 'Reel Resizer', icon: <Maximize />, href: '/tools/reel-fitter', desc: 'Auto fit to 9:16' },
      { name: 'Video to GIF', icon: <ImageIcon />, href: '/tools/file-converter', desc: 'Create memes instantly' },
    ]
  },
  {
    title: 'AI Tools',
    icon: <Zap size={18} className="text-indigo-400" />,
    items: [
      { name: 'Subtitle Generator', icon: <Type />, href: '/tools/auto-captions', desc: 'Burn subtitles into video' },
      { name: 'Speech to Text', icon: <Mic />, href: '/tools/speech-to-text', desc: 'Accurate transcription' },
      { name: 'Caption Generator', icon: <MessageSquare />, href: '/tools/tweet-generator', desc: 'Viral social media copy' },
      { name: 'Viral Hooks', icon: <Zap />, href: '/tools/viral-hooks', desc: 'Stop the scroll' },
      { name: 'Hashtag Generator', icon: <Hash />, href: '/tools/hashtag-generator', desc: 'Get trending tags' },
      { name: 'Title Generator', icon: <Type />, href: '/tools/yt-title-generator', desc: 'High CTR titles' },
    ]
  },
  {
    title: 'Utility Tools',
    icon: <Scissors size={18} className="text-purple-400" />,
    items: [
      { name: 'Background Remover', icon: <Scissors />, href: '/tools/bg-remover', desc: 'AI background cutout' },
      { name: 'Auto Crop', icon: <Maximize />, href: '/tools/safe-zone', desc: 'Crop for social media' },
      { name: 'Audio Extractor', icon: <Music />, href: '/tools/mp4-to-mp3', desc: 'Rip audio from video' },
      { name: 'SEO Tags Extractor', icon: <Hash />, href: '/tools/yt-tag-extractor', desc: 'Steal competitor tags' },
    ]
  }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center items-center pt-4 md:pt-6 font-sans">
      <nav 
        aria-label="Main Navigation"
        onMouseLeave={() => setIsToolsOpen(false)}
        className={`flex items-center justify-between px-6 transition-all duration-500 ease-out border border-white/10 shadow-2xl backdrop-blur-2xl
          ${isScrolled 
            ? 'w-full max-w-full h-20 mt-[-16px] md:mt-[-24px] rounded-none bg-black/90' 
            : 'w-[92%] max-w-6xl h-16 rounded-full bg-[#0a0a0a]/80'}`}
      >
       <Link href="/" className="flex items-center gap-3 font-black text-xl md:text-2xl tracking-tighter italic text-white hover:opacity-80 transition-opacity">
          <img 
            src="/favicon.ico" 
            alt="Seloice Logo" 
            className="w-8 h-8 md:w-10 md:h-10 object-contain" 
          />
          <span className="hidden sm:block">SELOICE</span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
          
          <div 
            className="relative h-16 flex items-center cursor-pointer group"
            onMouseEnter={() => setIsToolsOpen(true)}
          >
            <span className={`flex items-center gap-1 transition-colors ${isToolsOpen ? 'text-white' : 'hover:text-white'}`}>
              Tools <ChevronDown size={14} className={`transition-transform duration-300 ${isToolsOpen ? 'rotate-180' : ''}`} />
            </span>
            
            {/* Mega Menu Dropdown */}
            <AnimatePresence>
              {isToolsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-[4.5rem] left-1/2 -translate-x-1/2 w-[800px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-default"
                >
                  <div className="mb-6 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input 
                      type="text" 
                      aria-label="Search tools"
                      placeholder="Search for a tool..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#111] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 gap-6">
                    {megaMenuCategories.map((cat, idx) => (
                      <div key={idx} className="flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          {cat.icon}
                          <h4 className="text-white font-black italic tracking-tight">{cat.title}</h4>
                        </div>
                        <ul className="space-y-3">
                          {cat.items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item, i) => (
                            <li key={i}>
                              <Link href={item.href} className="group/item flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="mt-0.5 text-gray-500 group-hover/item:text-indigo-400 transition-colors">
                                  {React.cloneElement(item.icon as React.ReactElement<{ className?: string, size?: number }>, { size: 14 })}
                                </div>
                                <div>
                                  <div className="text-gray-300 group-hover/item:text-white text-xs font-bold capitalize tracking-normal transition-colors">{item.name}</div>
                                  <div className="text-[10px] text-gray-600 font-medium normal-case tracking-normal mt-0.5 line-clamp-1">{item.desc}</div>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/#tools" className="px-6 py-2.5 rounded-full bg-white text-black font-black text-xs md:text-sm shadow-[0_4px_0_0_#d1d5db] active:translate-y-1 active:shadow-none hover:bg-gray-100 transition-all">
            GET STARTED
          </Link>
        </div>
      </nav>
    </header>
  );
}
