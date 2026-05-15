// File: src/app/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Type, Music, Video, RefreshCcw, Scissors, Image as ImageIcon, 
  Hash, Sparkles, Zap, Maximize, Mic, QrCode, Shield, Grid, MessageSquare,
  Palette, Layout, ChevronRight, Star, Users, Mail, ArrowUpRight, Globe, Smartphone,
  CheckCircle2, Plus, Minus, MessageCircle, Subtitles, AudioWaveform, Wand2, Search, Crown
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResponsiveAd from '@/components/ResponsiveAd';

// ==========================================
// 1. UPDATED DATA STRUCTURES
// ==========================================

// 🔥 NEW: Highly Highlighted Premium Tools
const featuredTools = [
  { name: 'Photo Editor', icon: <Wand2 />, href: '/tools/photo-editor', color: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-500/20', desc: 'Pro layers, filters & advanced crop.', badge: 'PRO' },
  { name: 'Video Editor', icon: <Scissors />, href: '/tools/video-editor', color: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/20', desc: 'Trim, crop & edit directly in browser.', badge: 'HOT' },
  { name: 'Auto Captions', icon: <Subtitles />, href: '/tools/auto-captions', color: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/20', desc: 'Burn AI captions directly into video.', badge: 'AI' },
  { name: 'Audio Editor', icon: <AudioWaveform />, href: '/tools/audio-editor', color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20', desc: 'Precision trim, EQ & AI voice FX.', badge: 'NEW' },
  { name: 'YT Downloader', icon: <Download />, href: '/tools/yt-downloader', color: 'from-red-500 to-orange-600', shadow: 'shadow-red-500/20', desc: '4K High speed video & audio download.' },
  { name: 'Reel Saver', icon: <Download />, href: '/tools/reel-downloader', color: 'from-pink-500 to-rose-500', shadow: 'shadow-pink-500/20', desc: 'Fast, no-watermark IG reels saver.' },
];

const categories = [
  {
    name: 'Video Powerhouse',
    icon: <Video size={20} />,
    tools: [
      { name: 'YT Download', icon: <Download />, href: '/tools/yt-downloader', color: 'bg-red-500', desc: '4K High speed download.', badge: 'HOT' },
      { name: 'Reel Saver', icon: <Download />, href: '/tools/reel-downloader', color: 'bg-pink-500', desc: 'No watermark IG reels.' },
      { name: 'Video Editor', icon: <Scissors />, href: '/tools/video-editor', color: 'bg-rose-600', desc: 'Trim, crop & edit videos.', badge: 'NEW' },
      { name: 'Compressor', icon: <Video />, href: '/tools/video-compressor', color: 'bg-orange-500', desc: '80% size reduction, 0 loss.', badge: 'NEW' },
      { name: 'Auto Captions', icon: <Subtitles />, href: '/tools/auto-captions', color: 'bg-cyan-600', desc: 'Burn Pro captions into video.', badge: 'PRO' },
      { name: 'MP4 to Text', icon: <Type />, href: '/tools/mp4-to-text', color: 'bg-indigo-500', desc: 'Extract AI transcriptions.' },
      { name: 'Reel Fitter', icon: <Maximize />, href: '/tools/reel-fitter', color: 'bg-sky-500', desc: '9:16 Auto portrait resize.' },
      { name: 'Watermark', icon: <Shield />, href: '/tools/watermark-adder', color: 'bg-teal-500', desc: 'Custom brand protection.' },
    ]
  },
  {
    name: 'Growth & SEO',
    icon: <Sparkles size={20} />,
    tools: [
      { name: 'Hashtag Gen', icon: <Sparkles />, href: '/tools/hashtag-generator', color: 'bg-emerald-400', desc: 'Viral niche-based tags.' },
      { name: 'Viral Hooks', icon: <Zap />, href: '/tools/viral-hooks', color: 'bg-yellow-500', desc: 'AI scroll-stopping intros.', badge: 'AI' },
      { name: 'Title Maker', icon: <Type />, href: '/tools/yt-title-generator', color: 'bg-red-400', desc: 'High CTR YouTube titles.' },
      { name: 'Tag Stealer', icon: <Hash />, href: '/tools/yt-tag-extractor', color: 'bg-orange-500', desc: 'Extract hidden YT tags.' },
      { name: 'Threads Maker', icon: <MessageSquare />, href: '/tools/tweet-generator', color: 'bg-blue-500', desc: 'Convert videos to threads.' },
      { name: 'QR Builder', icon: <QrCode />, href: '/tools/qr-generator', color: 'bg-gray-400', desc: 'Custom branded QR codes.' },
    ]
  },
  {
    name: 'Image & Design',
    icon: <ImageIcon size={20} />,
    tools: [
      { name: 'Fake WhatsApp', icon: <MessageCircle />, href: '/tools/whatsapp-mockup', color: 'bg-[#25D366]', desc: 'Hyper-realistic original chats.', badge: 'HOT' },
      { name: 'Photo Editor', icon: <Wand2 />, href: '/tools/photo-editor', color: 'bg-indigo-600', desc: 'Pro layers, filters & crop.', badge: 'NEW' },
      { name: 'BG Remover', icon: <Scissors />, href: '/tools/bg-remover', color: 'bg-purple-500', desc: 'AI background cutout.' },
      { name: 'Image Conv.', icon: <ImageIcon />, href: '/tools/image-converter', color: 'bg-violet-600', desc: 'WebP, PNG, JPG locally.' },
      { name: 'Grid Maker', icon: <Grid />, href: '/tools/grid-maker', color: 'bg-pink-400', desc: 'IG profile grid slicer.' },
      { name: 'Color Grab', icon: <Palette />, href: '/tools/color-extractor', color: 'bg-yellow-400', desc: 'Extract image palettes.' },
      { name: 'Safe Zone', icon: <Layout />, href: '/tools/safe-zone', color: 'bg-teal-400', desc: 'Check UI visibility.' },
    ]
  },
  {
    name: 'Audio & Text',
    icon: <Music size={20} />,
    tools: [
      { name: 'Audio Editor', icon: <AudioWaveform />, href: '/tools/audio-editor', color: 'bg-emerald-600', desc: 'Precision trim, EQ & FX.', badge: 'PRO' },
      { name: 'MP4 to MP3', icon: <Music />, href: '/tools/mp4-to-mp3', color: 'bg-emerald-500', desc: 'Clear audio extraction.' },
      { name: 'Speech 2 Text', icon: <Mic />, href: '/tools/speech-to-text', color: 'bg-green-500', desc: 'Accurate transcriptions.', badge: 'PRO' },
      { name: 'File Conv.', icon: <RefreshCcw />, href: '/tools/file-converter', color: 'bg-blue-500', desc: 'WAV, MP3, OGG conversion.' },
    ]
  }
];

const faqs = [
  { q: "Is Seloice Tools completely free?", a: "Yes! All tools are 100% free to use. No credit cards, no hidden fees, and absolutely no watermarks on your exports." },
  { q: "Do you store my videos or photos?", a: "Never. We use advanced browser-based WASM technology. This means your files are processed locally on your own device and are never uploaded to our servers." },
  { q: "Does it work on mobile phones?", a: "Absolutely. Our platform is mobile-first. You can download reels, compress videos, and generate captions directly from your iPhone or Android browser." },
  { q: "Is there any limit on file size?", a: "Because processing happens locally on your device, the file size limit depends on your device's RAM. Most modern phones and PCs handle up to 1GB effortlessly." }
];

const liveActivities = [
  "🔥 A creator from India just generated a Fake WhatsApp Chat.",
  "✨ Someone generated AI Captions for their Reel.",
  "📥 A 1080p YouTube video was just downloaded.",
  "✂️ A vlog was just trimmed using our Video Editor.",
  "🎵 Extracted MP3 from a 10-minute podcast.",
];

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

export default function HomePageClient() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activityIndex, setActivityIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % liveActivities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      
      {/* FLOATING BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute top-[-20%] left-[-10%] w-[60rem] h-[60rem] bg-indigo-600/10 rounded-full blur-[150px] opacity-70 mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-pink-600/10 rounded-full blur-[150px] opacity-70 mix-blend-screen" />
      </div>

      <Navbar />

      {/* LIVE ACTIVITY TICKER */}
      <div className="w-full bg-indigo-600/10 border-b border-indigo-500/20 overflow-hidden relative z-50 pt-[80px] md:pt-[90px] pb-2 px-4 flex justify-center">
        <AnimatePresence mode="wait">
          <motion.p 
            key={activityIndex}
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.5 }}
            className="text-[10px] md:text-xs font-bold text-indigo-300 uppercase tracking-widest text-center"
          >
            {liveActivities[activityIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-16 md:pt-36 pb-16 px-4 md:px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] md:text-xs font-black uppercase tracking-widest mb-6 md:mb-8 backdrop-blur-md">
           <Zap size={14} className="fill-indigo-400" /> The Modern Creator OS
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, type: 'spring' }} 
          className="text-[2.5rem] leading-[1] sm:text-5xl md:text-[8rem] font-black tracking-tighter md:leading-[0.85] mb-6 md:mb-8"
        >
          THE FUTURE OF <br className="hidden md:block" /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-indigo-500 drop-shadow-2xl">CREATION.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} 
          className="text-zinc-400 text-sm md:text-2xl max-w-2xl mb-8 md:mb-12 font-medium px-4 leading-relaxed tracking-tight"
        >
          An elite suite of 26+ browser-based tools. <br className="hidden md:block"/>
          <span className="text-white/80">No limits. No watermarks. Pure speed.</span>
        </motion.p>
        
        {/* FAST TOOL SEARCH */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="w-full max-w-2xl mx-auto mb-8 relative group">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative bg-[#111] border border-white/10 group-focus-within:border-indigo-500/50 rounded-full flex items-center p-2 pr-4 shadow-2xl transition-all">
            <div className="pl-4 text-gray-500"><Search size={18} className="md:w-5 md:h-5" /></div>
            <input 
              type="search"
              aria-label="Search creator tools"
              placeholder="What do you want to build today?" 
              onClick={() => window.dispatchEvent(new Event('open_search'))}
              onKeyDown={(e) => e.key === 'Enter' && window.dispatchEvent(new Event('open_search'))}
              readOnly
              className="w-full bg-transparent border-none outline-none text-white px-3 py-2 md:py-3 cursor-pointer placeholder:text-gray-600 text-sm md:text-base font-medium min-h-[44px]"
            />
          </div>
        </motion.div>
      </section>

      {/* AD UNIT */}
      <div className="max-w-4xl mx-auto px-4 py-4 z-10 relative">
        <ResponsiveAd variant="leaderboard" />
      </div>

      {/* 🔥 THE HIGHLIGHTED PREMIUM TOOLS SECTION */}
      <section className="relative py-12 px-3 sm:px-4 md:px-8 max-w-[1440px] mx-auto z-10">
        <div className="flex items-center gap-3 mb-8 md:mb-10 justify-center md:justify-start">
          <div className="bg-yellow-500/20 p-2 md:p-3 rounded-xl border border-yellow-500/30">
            <Crown size={24} className="text-yellow-500" />
          </div>
          <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600 drop-shadow-lg">Featured Pro Tools</h2>
        </div>

        {/* 2 Cards on Mobile, 3 on Tablet/Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {featuredTools.map((tool, i) => (
            <Link href={tool.href} key={i} className="group outline-none">
              <div className={`h-full bg-[#111] border border-white/10 rounded-2xl md:rounded-[2rem] p-4 md:p-8 flex flex-col transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden shadow-lg hover:${tool.shadow} hover:border-white/30`}>
                
                {/* Highlight Gradient Background */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${tool.color} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`} />

                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6 shadow-xl relative overflow-hidden bg-gradient-to-br ${tool.color}`}>
                  <div className="relative z-10">
                    {React.cloneElement(tool.icon as React.ReactElement<{ size?: number }>, { className: "w-5 h-5 md:w-6 md:h-6" })}
                  </div>
                </div>

                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                    <h3 className="text-sm md:text-xl font-black tracking-tight text-white group-hover:text-gray-200 truncate">
                      {tool.name}
                    </h3>
                  </div>
                  <p className="text-[10px] md:text-sm text-zinc-400 font-medium leading-snug line-clamp-2 md:line-clamp-3">
                    {tool.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- MEGA TOOLS GRID (Secondary) --- */}
      <section id="tools" className="relative py-12 px-3 sm:px-4 md:px-8 max-w-[1440px] mx-auto space-y-16 md:space-y-36 z-10" aria-label="Creator tools directory">
        {categories.map((cat, catIdx) => (
          <section key={catIdx} className="scroll-mt-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 md:mb-10 border-b border-white/5 pb-4 md:pb-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="text-indigo-500 bg-indigo-500/10 p-2.5 md:p-3.5 rounded-xl md:rounded-2xl border border-indigo-500/20">{cat.icon}</div>
                <h2 className="text-xl md:text-5xl font-black uppercase italic tracking-tighter">{cat.name}</h2>
              </div>
            </div>
            
            {/* 🚀 Mobile 2-cols Grid for All Regular Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {cat.tools.map((tool, i) => (
                <Link href={tool.href} key={i} className="group">
                  <div className="relative h-full bg-white/[0.02] border border-white/5 backdrop-blur-sm rounded-2xl md:rounded-[2rem] p-4 md:p-8 flex flex-col transition-all duration-300 hover:border-indigo-500/40 hover:bg-white/[0.04] hover:shadow-[0_10px_30px_rgba(79,70,229,0.1)] group-hover:-translate-y-1">
                    
                    <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6 transition-transform group-hover:scale-105 shadow-md relative overflow-hidden`}>
                      <div className={`absolute inset-0 ${tool.color} opacity-20`} />
                      <div className="relative z-10">
                        {React.cloneElement(tool.icon as React.ReactElement<{ size?: number }>, { className: "w-5 h-5 md:w-6 md:h-6" })}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2 flex-wrap">
                        <h3 className="text-sm md:text-lg font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors truncate w-full sm:w-auto">
                          {tool.name}
                        </h3>
                        {tool.badge && (
                          <span className="text-[8px] md:text-[9px] font-black px-1.5 py-0.5 rounded flex-shrink-0 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-tighter">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] md:text-sm text-zinc-500 font-medium leading-snug line-clamp-2">
                        {tool.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </section>

      {/* --- FEATURES & FAQ --- */}
      <section id="features" className="py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-10 relative">
        <div className="text-center mb-12 md:mb-24">
          <h2 className="text-3xl md:text-6xl font-black italic mb-3 md:mb-4 uppercase">BUILT FOR <span className="text-indigo-500">SPEED.</span></h2>
          <p className="text-xs md:text-lg text-gray-400 max-w-2xl mx-auto font-medium">Do everything directly from your browser, faster than ever.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
          <div className="md:col-span-4 bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 rounded-3xl md:rounded-[3rem] p-6 md:p-14 flex flex-col justify-end relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
            <h3 className="text-xl md:text-4xl font-black mb-2 md:mb-3 uppercase italic mt-16 md:mt-32">100% Private & Local</h3>
            <p className="text-xs md:text-lg text-gray-500 leading-relaxed max-w-xl">We use advanced WebAssembly (WASM) technology. Your videos are processed directly on your device.</p>
          </div>
          
          <div className="md:col-span-2 bg-indigo-600 border border-indigo-400 rounded-3xl md:rounded-[3rem] p-6 md:p-10 flex flex-col justify-end text-white relative overflow-hidden group shadow-[0_0_30px_rgba(79,70,229,0.2)]">
            <h3 className="text-xl md:text-3xl font-black mb-2 md:mb-3 uppercase italic mt-12 md:mt-0">Lightning Fast</h3>
            <p className="text-indigo-100 leading-relaxed text-xs md:text-base">Skip the upload progress bars completely.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}