"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2, Scissors, Zap, Maximize, Play, CheckCircle2, ChevronRight,
  TrendingUp, Download, Plus, Minus, ArrowRight, Share2, Sparkles, Mic2, Tv, Video
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ViralReferralModal from '@/components/ViralReferralModal';

const faqs = [
  { q: "What is an AI short maker?", a: "An AI short maker is a software tool that uses artificial intelligence to automatically edit long-form videos into short, viral clips (under 60 seconds) suitable for platforms like TikTok, Instagram Reels, and YouTube Shorts." },
  { q: "How does an AI clip generator find the best moments?", a: "Seloice uses advanced machine learning to analyze audio peaks, keyword density, and visual activity. It looks for 'hooks,' emotional reactions, and high-engagement topics to automatically select the most viral parts of your video." },
  { q: "Is there a free AI shorts generator?", a: "Yes, Seloice offers a generous free tier allowing creators to test the AI viral clip finder, generate clips, and export them with captions without requiring a credit card upfront." },
  { q: "Can I use AI to turn my podcast into shorts?", a: "Absolutely. Seloice is optimized as a podcast to shorts AI. It can take a 2-hour audio/video podcast, identify the best conversational exchanges, and create split-screen vertical videos with dynamic subtitles." },
  { q: "How accurate are the automatic captions?", a: "Seloice boasts a 99% accuracy rate for automatic captions, using top-tier speech-to-text models. You can also easily edit any text in the dashboard before exporting." },
  { q: "Does it work for non-English videos?", a: "Yes, our AI content repurposing tool supports over 30 languages, automatically translating and generating captions in your target audience's language." },
  { q: "How long does it take to process a 1-hour video?", a: "Typically, our long video to short clips engine processes a 1-hour video in just a few minutes, delivering dozens of ready-to-post clips almost instantly." },
  { q: "Will AI shorts hurt my YouTube channel?", a: "No, creating high-quality, engaging shorts actually boosts your channel's visibility. YouTube's algorithm rewards consistent uploading, and Seloice ensures the clips are highly engaging." }
];

const competitors = [
  { feature: "AI Viral Clip Detection", seloice: "Highly Accurate", opus: "Good", klap: "Basic", veed: "Manual", kapwing: "Manual" },
  { feature: "Multi-Speaker Tracking", seloice: "Advanced Split-Screen AI", opus: "Yes", klap: "Yes", veed: "Limited", kapwing: "No" },
  { feature: "Dynamic Animated Captions", seloice: "50+ Trending Templates", opus: "Limited", klap: "Limited", veed: "Good", kapwing: "Basic" },
  { feature: "Processing Speed", seloice: "Extremely Fast (< 2 mins)", opus: "Average", klap: "Average", veed: "Slow", kapwing: "Average" },
];

export default function AIShortMakerClient() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

  return (
    <div className="page-shell min-h-dvh bg-[#050505] text-white selection:bg-fuchsia-500/30 overflow-x-hidden font-sans relative">
      <div className="fixed inset-0 z-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #ffffff1a 1px, transparent 1px), linear-gradient(to bottom, #ffffff1a 1px, transparent 1px)', backgroundSize: '30px 30px', maskImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, #000 70%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, #000 70%, transparent 100%)' }} />
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center hidden md:flex">
        <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-fuchsia-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-24 md:pt-40 pb-20">
        {/* HERO SECTION */}
        <section className="px-4 md:px-6 max-w-7xl mx-auto flex flex-col items-center text-center mb-20 md:mb-32">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-xs font-black uppercase tracking-widest mb-8 backdrop-blur-md">
            <Sparkles size={14} className="fill-fuchsia-400" /> The Ultimate Video to Shorts AI
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, type: 'spring' }} 
            className="text-[2.5rem] leading-[1.1] sm:text-5xl md:text-[6rem] font-black tracking-tighter md:leading-[0.9] mb-8 text-white drop-shadow-2xl max-w-5xl"
          >
            TURN LONG VIDEOS INTO <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-violet-500 to-indigo-500">VIRAL CLIPS INSTANTLY.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} 
            className="text-gray-300 md:text-zinc-400 text-base md:text-2xl max-w-3xl mb-12 font-medium px-4 leading-relaxed tracking-tight"
          >
            Seloice analyzes your videos, finds the most viral and engaging moments automatically, and generates multi-platform short clips with dynamic captions in seconds.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4">
            <Link href="/tools/shorts-maker" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(162,28,175,0.4)] flex items-center justify-center gap-2">
              Start Creating for Free <ArrowRight size={18} />
            </Link>
            <Link href="#demo" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 backdrop-blur-md">
              <Play size={18} /> Watch Demo
            </Link>
          </motion.div>
          <p className="mt-6 text-xs text-gray-500 font-medium tracking-wide">No Credit Card Required • Keep 100% of your revenue</p>
        </section>

        {/* AI OVERVIEW ZERO CLICK */}
        <section className="px-4 max-w-4xl mx-auto mb-20 md:mb-32">
          <div className="bg-gradient-to-br from-indigo-900/40 to-fuchsia-900/40 border border-white/10 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/20 blur-[50px] rounded-full" />
            <h2 className="text-xl md:text-2xl font-black mb-4 text-fuchsia-300">What is the best AI short maker?</h2>
            <p className="text-gray-300 text-sm md:text-lg leading-relaxed font-medium">
              The best AI short maker is a tool that automatically repurposes long-form videos into short, viral clips for social media. Seloice leads this category by using advanced AI to analyze video retention metrics, identify the most engaging highlights, and automatically apply dynamic captions, timestamps, and auto-reframing for TikTok, YouTube Shorts, and Instagram Reels—saving creators up to 90% of editing time.
            </p>
          </div>
        </section>

        {/* PAIN POINTS TO SOLUTIONS */}
        <section className="px-4 md:px-6 max-w-7xl mx-auto mb-20 md:mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 uppercase">The Content Creator&apos;s Nightmare</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">You spent hours recording. Now you have to search through a 2-hour podcast to find a 30-second golden nugget. Manually keyframing. Typing out captions. Burning out.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-6">
              {[
                { title: "AI Viral Clip Finder", desc: "Our highlight maker scans your entire video, analyzing audio spikes and emotional moments to extract the most engaging 15-60 second clips with a Virality Score.", icon: <TrendingUp /> },
                { title: "Auto-Framing & Speaker Tracking", desc: "Our AI tracks the active speaker and automatically reframes landscape (16:9) video into perfect vertical (9:16) format. No more awkward half-cut faces.", icon: <Maximize /> },
                { title: "Dynamic, High-Retention Captions", desc: "Over 75% of social media users watch on mute. Generate perfectly timed, highly accurate AI captions with emojis and bold keywords.", icon: <Scissors /> },
                { title: "1-Click Export to Every Platform", desc: "Generate your YouTube shorts, TikTok clips, and Instagram Reels all from one dashboard. Optimized bitrate, resolution, and format.", icon: <Share2 /> }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 shrink-0 border border-fuchsia-500/30">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl flex items-center justify-center min-h-[400px]">
              {/* Mockup UI representation */}
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-violet-500/10" />
              <div className="relative z-10 w-full max-w-sm mx-auto p-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="aspect-[9/16] bg-gray-900 rounded-xl relative overflow-hidden border border-white/5 flex items-center justify-center flex-col gap-4">
                  <div className="text-center absolute bottom-20 w-full px-4">
                     <span className="bg-yellow-400 text-black font-black px-2 py-1 text-2xl uppercase italic inline-block mb-1 transform -rotate-2">Viral</span><br/>
                     <span className="bg-white text-black font-black px-2 py-1 text-2xl uppercase italic inline-block transform rotate-1">Captions</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-fuchsia-500 text-white text-[10px] font-black px-2 py-1 rounded">Score: 98/100</div>
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Play className="text-white fill-white ml-1" />
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsReferralModalOpen(true)}
                  className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={16} /> Export Video
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="px-4 md:px-6 max-w-7xl mx-auto mb-20 md:mb-32">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-16 uppercase tracking-tighter">Built For Every Creator</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <Mic2 />, title: "Podcast to Shorts AI", desc: "Find the best conversational hooks and automatically frame split-screen interviews." },
              { icon: <Tv />, title: "YouTube Shorts Gen", desc: "Turn long VODs into a 30-day content calendar of YouTube Shorts in minutes." },
              { icon: <TrendingUp />, title: "AI Reel Maker", desc: "Upload long webinars and generate hundreds of branded AI reels to schedule for clients." },
              { icon: <Video />, title: "Faceless Creators", desc: "Pull highlights from creative commons documentaries, synced perfectly." }
            ].map((useCase, i) => (
              <div key={i} className="bg-gradient-to-b from-white/[0.05] to-transparent p-8 rounded-3xl border border-white/5 hover:border-fuchsia-500/30 transition-all">
                <div className="text-fuchsia-400 mb-6">{React.cloneElement(useCase.icon as React.ReactElement<any>, { size: 32 })}</div>
                <h3 className="text-xl font-black mb-3">{useCase.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* COMPETITOR TABLE */}
        <section className="px-4 max-w-5xl mx-auto mb-20 md:mb-32">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Seloice vs. The Rest</h2>
            <p className="text-gray-400">Why thousands of creators are switching.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-5 font-bold text-gray-300">Feature</th>
                  <th className="p-5 font-black text-fuchsia-400 bg-fuchsia-500/10">Seloice (Top Choice)</th>
                  <th className="p-5 font-medium text-gray-500">Opus Clip</th>
                  <th className="p-5 font-medium text-gray-500">Klap</th>
                  <th className="p-5 font-medium text-gray-500">Veed.io</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {competitors.map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="p-5 font-bold">{row.feature}</td>
                    <td className="p-5 font-black text-white bg-fuchsia-500/5">{row.seloice}</td>
                    <td className="p-5 text-gray-400">{row.opus}</td>
                    <td className="p-5 text-gray-400">{row.klap}</td>
                    <td className="p-5 text-gray-400">{row.veed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQs */}
        <section className="px-4 max-w-4xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">People Also Ask</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-6 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-bold text-white text-lg pr-4">{faq.q}</span>
                  {activeFaq === i ? <Minus className="text-fuchsia-400 shrink-0" /> : <Plus className="text-gray-500 shrink-0" />}
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }} 
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-gray-400 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-fuchsia-600/20 to-violet-600/20 border border-fuchsia-500/30 p-12 rounded-[3rem] backdrop-blur-xl relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
             <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 relative z-10">Stop Editing. Start Growing.</h2>
             <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto relative z-10">Join thousands of creators saving 20+ hours a week and 10x'ing their content output.</p>
             <Link href="/tools/shorts-maker" className="relative z-10 inline-flex px-10 py-5 rounded-full bg-white text-black hover:bg-gray-100 font-black text-sm uppercase tracking-widest transition-transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                Launch AI Short Maker
             </Link>
          </div>
        </section>

        {/* PROGRAMMATIC SEO FOOTER LINKS (Subtle) */}
        <section className="px-4 max-w-7xl mx-auto mt-32 border-t border-white/5 pt-12">
           <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Related AI Tools</h3>
           <div className="flex flex-wrap gap-3">
              {['AI short maker for gaming', 'Podcast to shorts AI free', 'YouTube video to shorts', 'AI highlight maker', 'Automatic shorts creator', 'Auto caption generator', 'Split screen podcast video maker'].map((kw, i) => (
                 <Link href={`/use-cases/${kw.toLowerCase().replace(/ /g, '-')}`} key={i} className="text-xs text-gray-600 hover:text-fuchsia-400 transition-colors bg-white/[0.02] px-3 py-1.5 rounded-full border border-white/5">
                    {kw}
                 </Link>
              ))}
           </div>
        </section>

      </main>

      <Footer />
      
      <ViralReferralModal 
        isOpen={isReferralModalOpen} 
        onClose={() => setIsReferralModalOpen(false)} 
        onExportWithWatermark={() => {
          alert('Downloading with watermark...');
          setIsReferralModalOpen(false);
        }}
      />
    </div>
  );
}
