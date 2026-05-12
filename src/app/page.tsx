// File: src/app/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Type, Music, Video, RefreshCcw, Scissors, Image as ImageIcon, 
  Hash, Sparkles, Zap, Maximize, Mic, QrCode, Shield, Grid, MessageSquare,
  Palette, Layout, ChevronRight, Star, Users, Mail, ArrowUpRight, Globe, Smartphone,
  CheckCircle2, Plus, Minus, MessageCircle, Subtitles
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ==========================================
// 1. ADVANCED DATA STRUCTURES
// ==========================================

const categories = [
  {
    name: 'Video Powerhouse',
    icon: <Video size={20} />,
    tools: [
      { name: 'YT Download', icon: <Download />, href: '/tools/yt-downloader', color: 'bg-red-500', desc: '4K/8K High speed download.', badge: 'HOT' },
      { name: 'Reel Saver', icon: <Download />, href: '/tools/reel-downloader', color: 'bg-pink-500', desc: 'No watermark IG reels.' },
      { name: 'Compressor', icon: <Video />, href: '/tools/video-compressor', color: 'bg-orange-500', desc: '80% size reduction, 0 quality loss.', badge: 'NEW' },
      // 🔥 Yahan humne naya AUTO CAPTIONS add kiya hai
      { name: 'Auto Captions', icon: <Subtitles />, href: '/tools/auto-captions', color: 'bg-cyan-600', desc: 'Burn Pro captions directly into video.', badge: 'PRO' },
      // 🔥 Aur purane wale ko MP4 TO TEXT bana diya
      { name: 'MP4 to Text', icon: <Type />, href: '/tools/mp4-to-text', color: 'bg-indigo-500', desc: 'Extract AI transcriptions from video.' },
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
      { name: 'Threads Maker', icon: <MessageSquare />, href: '/tools/thread-generator', color: 'bg-blue-500', desc: 'Convert videos to viral threads.' },
      { name: 'QR Builder', icon: <QrCode />, href: '/tools/qr-generator', color: 'bg-gray-400', desc: 'Custom branded QR codes.' },
    ]
  },
  {
    name: 'Image & Design',
    icon: <ImageIcon size={20} />,
    tools: [
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
  "🔥 A creator from India just compressed a 4K video.",
  "✨ Someone generated AI Captions for their Reel.",
  "📥 A 1080p YouTube video was just downloaded.",
  "✂️ Background removed from a product image in 1.2s.",
  "🎵 Extracted MP3 from a 10-minute podcast.",
];

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activityIndex, setActivityIndex] = useState(0);

  // Scroll Handler for Header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live Activity Ticker Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % liveActivities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      
      {/* --- FLOATING BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute top-[-20%] left-[-10%] w-[60rem] h-[60rem] bg-indigo-600/10 rounded-full blur-[150px] opacity-70 mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-pink-600/10 rounded-full blur-[150px] opacity-70 mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* --- DYNAMIC HEADER --- */}
      <Navbar />

      {/* --- LIVE ACTIVITY TICKER (SaaS Credibility) --- */}
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

      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 md:pt-36 pb-20 px-4 md:px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] md:text-xs font-black uppercase tracking-widest mb-8 backdrop-blur-md shadow-[0_0_30px_rgba(99,102,241,0.15)]">
           <Zap size={14} className="fill-indigo-400" /> The Modern Creator OS
        </motion.div>
        
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-6xl md:text-[7rem] font-black tracking-tighter leading-[0.9] mb-8 italic">
          UNLEASH YOUR <br className="hidden md:block" /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 drop-shadow-2xl">FULL POTENTIAL.</span>
        </motion.h1>
        
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-gray-400 text-base md:text-xl max-w-3xl mb-14 font-medium px-4 leading-relaxed">
          Access 22+ professional-grade media tools directly in your browser. <strong className="text-gray-200">Zero installations. Zero watermarks. 100% Free.</strong> Edit faster than ever before.
        </motion.p>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto px-4">
          <a href="#tools" className="px-12 py-5 rounded-2xl bg-indigo-600 text-white font-black text-lg md:text-xl shadow-[0_8px_0_0_#3730a3] hover:bg-indigo-500 active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3">
             EXPLORE 22 TOOLS <ChevronRight />
          </a>
        </motion.div>
      </section>

      {/* --- MEGA TOOLS GRID --- */}
      <main id="tools" className="relative py-12 px-4 md:px-8 max-w-[1440px] mx-auto space-y-24 md:space-y-36 z-10">
        {categories.map((cat, catIdx) => (
          <section key={catIdx} className="scroll-mt-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 md:mb-14 border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <div className="text-indigo-500 bg-indigo-500/10 p-3.5 rounded-2xl border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]">{cat.icon}</div>
                <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">{cat.name}</h2>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-600 hidden md:block">{cat.tools.length} Tools Available</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {cat.tools.map((tool, i) => (
                <Link href={tool.href} key={i}>
                  <div className="group relative bg-[#0a0a0a] border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 h-full flex flex-col transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-2 hover:bg-[#111] shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 overflow-hidden">
                    
                    {/* Glowing BG effect on hover */}
                    <div className={`absolute -top-16 -right-16 w-40 h-40 md:w-60 md:h-60 ${tool.color} opacity-0 group-hover:opacity-[0.06] blur-[60px] transition-opacity duration-500`} />
                    
                    {/* Badge (If exists) */}
                    {tool.badge && (
                      <div className="absolute top-4 right-4 md:top-6 md:right-6 px-2 py-1 rounded-md bg-white/10 border border-white/20 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                        {tool.badge}
                      </div>
                    )}

                    <div className={`w-12 h-12 md:w-16 md:h-16 ${tool.color} rounded-xl md:rounded-[1.3rem] p-[2px] mb-4 md:mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <div className="w-full h-full bg-[#111] rounded-[10px] md:rounded-[1.1rem] flex items-center justify-center text-white relative overflow-hidden">
                        <div className={`absolute inset-0 ${tool.color} opacity-20`} />
                         {React.cloneElement(tool.icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5 md:w-7 md:h-7 relative z-10" })}
                      </div>
                    </div>

                    <h3 className="text-sm md:text-2xl font-black mb-1 md:mb-3 uppercase italic tracking-tight text-gray-100 group-hover:text-indigo-400 transition-colors truncate md:whitespace-normal">
                      {tool.name}
                    </h3>
                    
                    <p className="text-[10px] md:text-sm text-gray-500 font-medium leading-snug md:leading-relaxed mb-6 md:mb-10 line-clamp-2">
                      {tool.desc}
                    </p>

                    <div className="flex items-center justify-between pt-3 md:pt-5 border-t border-white/5 mt-auto">
                      <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-indigo-500/80 group-hover:text-indigo-400 transition-colors">Launch Tool</span>
                      <ArrowUpRight size={16} className="text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* --- BENTO GRID (FEATURES) --- */}
      <section id="features" className="py-24 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-10 relative">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl font-black italic mb-4 uppercase">BUILT FOR <span className="text-indigo-500">SPEED.</span></h2>
          <p className="text-sm md:text-lg text-gray-400 max-w-2xl mx-auto font-medium">Stop paying for expensive desktop software. Do everything directly from your browser, faster than ever.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
          <div className="md:col-span-4 bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 flex flex-col justify-end relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
            <div className="absolute top-8 left-8 md:top-14 md:left-14 w-16 h-16 md:w-20 md:h-20 bg-indigo-500/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-indigo-500 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
              <Shield size={32}/>
            </div>
            <h3 className="text-2xl md:text-4xl font-black mb-3 uppercase italic mt-24 md:mt-32">100% Private & Local</h3>
            <p className="text-sm md:text-lg text-gray-500 leading-relaxed max-w-xl">We use advanced WebAssembly (WASM) technology. Your videos and images are processed directly on your device. Zero server uploads. Ultimate privacy.</p>
          </div>
          
          <div className="md:col-span-2 bg-indigo-600 border border-indigo-400 rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 flex flex-col justify-end text-white relative overflow-hidden group shadow-[0_0_40px_rgba(79,70,229,0.2)]">
            <h3 className="text-2xl md:text-3xl font-black mb-3 uppercase italic mt-20 md:mt-0">Lightning Fast</h3>
            <p className="text-indigo-100 leading-relaxed text-sm md:text-base">Skip the upload progress bars. Extract audio and compress instantly.</p>
          </div>
          
          <div className="md:col-span-2 bg-[#111] border border-white/10 rounded-[2rem] md:rounded-[3rem] p-8 flex flex-col items-center justify-center text-center hover:bg-[#151515] transition-colors">
             <Smartphone className="mb-4 md:mb-6 text-pink-500" size={36}/>
             <h4 className="text-lg md:text-xl font-black mb-2 uppercase italic">Mobile First</h4>
             <p className="text-xs md:text-sm text-gray-500">Optimized for iOS & Android.</p>
          </div>
          
          <div className="md:col-span-4 bg-[#111] border border-white/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-[#151515] transition-colors">
             <div className="text-center md:text-left">
               <h4 className="text-2xl md:text-3xl font-black mb-3 uppercase italic">Always Free. Forever.</h4>
               <p className="text-sm md:text-base text-gray-500 max-w-md">No hidden paywalls. No premium plans to export. No annoying watermarks on your hard work.</p>
             </div>
             <CheckCircle2 className="text-emerald-500 w-24 h-24 opacity-20 md:opacity-100" />
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-24 px-4 md:px-6 max-w-4xl mx-auto z-10 relative border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black italic mb-4 uppercase">Got Questions?</h2>
          <p className="text-gray-400 font-medium">Everything you need to know about Seloice Tools.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                aria-expanded={activeFaq === i}
                aria-controls={`faq-answer-${i}`}
                className="w-full px-6 py-6 text-left flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
              >
                <span className="font-bold text-base md:text-lg text-gray-200">{faq.q}</span>
                {activeFaq === i ? <Minus className="text-indigo-400 flex-shrink-0" /> : <Plus className="text-gray-500 flex-shrink-0" />}
              </button>
              <AnimatePresence>
                {activeFaq === i && (
                  <motion.div 
                    id={`faq-answer-${i}`}
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }} 
                    className="overflow-hidden"
                    role="region"
                    aria-labelledby={`faq-question-${i}`}
                  >
                    <p className="px-6 pb-6 text-sm md:text-base text-gray-400 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* --- ULTRA FOOTER --- */}
      <Footer />
    </div>
  );
}