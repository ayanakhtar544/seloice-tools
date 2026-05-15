"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight, CheckCircle2, Minus, Plus, Search, Shield, Smartphone, Sparkles, Zap,
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResponsiveAd from '@/components/ResponsiveAd';
import { getToolBySlug } from '@/lib/seo/tools-registry';
import {
  getToolBadge,
  getToolColor,
  getToolIcon,
  getToolsForHomeSection,
  HOME_SECTIONS,
  TOOL_COUNT,
} from '@/lib/tools-catalog';

const TRENDING_SLUGS = ['yt-title-generator', 'auto-captions', 'reel-downloader', 'bg-remover', 'video-editor'] as const;

const faqs = [
  { q: "Is Seloice Tools completely free?", a: "Yes! All tools are 100% free to use. No credit cards, no hidden fees, and absolutely no watermarks on your exports." },
  { q: "Do you store my videos or photos?", a: "Never. We use advanced browser-based WASM technology. Your files are processed locally on your device and are never uploaded to our servers." },
  { q: "Does it work on mobile phones?", a: "Absolutely. Our platform is mobile-first. You can download reels, compress videos, and generate captions directly from your iPhone or Android browser." },
  { q: "Is there any limit on file size?", a: "Because processing happens locally on your device, the file size limit depends on your device's RAM. Most modern phones and PCs handle up to 1GB effortlessly." },
];

const liveActivities = [
  "A creator just compressed a 4K video.",
  "Someone generated AI captions for their Reel.",
  "A 1080p YouTube video was just downloaded.",
  "Background removed from a product image in 1.2s.",
  "Extracted MP3 from a 10-minute podcast.",
];

const stats = [
  { label: 'Free Tools', value: `${TOOL_COUNT}+` },
  { label: 'No Watermarks', value: '100%' },
  { label: 'Private Processing', value: 'Local' },
];

export default function HomePageClient() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activityIndex, setActivityIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % liveActivities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#030308] text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-5%] w-[55rem] h-[55rem] rounded-full bg-indigo-600/20 blur-[140px]" />
        <div className="absolute top-[30%] right-[-15%] w-[45rem] h-[45rem] rounded-full bg-violet-600/15 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40rem] h-[40rem] rounded-full bg-emerald-600/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 20%, transparent 70%)',
          }}
        />
      </div>

      <Navbar />

      <div className="relative z-50 pt-[80px] md:pt-[90px] pb-2 px-4 flex justify-center border-b border-white/[0.06] bg-black/20 backdrop-blur-md">
        <AnimatePresence mode="wait">
          <motion.p
            key={activityIndex}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-[10px] md:text-xs font-semibold text-indigo-300/90 tracking-wide text-center"
          >
            {liveActivities[activityIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <section className="relative pt-16 md:pt-24 pb-16 px-4 md:px-6 max-w-7xl mx-auto z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-indigo-300 mb-8"
          >
            <Sparkles size={14} className="text-indigo-400" />
            Creator OS · {TOOL_COUNT} tools
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[0.95] mb-6 max-w-5xl"
          >
            Build faster.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-violet-400">
              Create without limits.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-zinc-400 text-base md:text-xl max-w-2xl mb-10 font-medium leading-relaxed"
          >
            {TOOL_COUNT} browser-based tools for video, audio, design, and growth — free, private, and built for creators who ship daily.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="w-full max-w-2xl mb-8 relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 via-violet-500/20 to-emerald-500/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-2 pl-4 shadow-2xl group-focus-within:border-indigo-500/40 transition-colors">
              <Search size={20} className="text-zinc-500 shrink-0" />
              <input
                type="search"
                aria-label="Search creator tools"
                placeholder={`Search all ${TOOL_COUNT} tools…`}
                onClick={() => window.dispatchEvent(new Event('open_search'))}
                onKeyDown={(e) => e.key === 'Enter' && window.dispatchEvent(new Event('open_search'))}
                readOnly
                className="w-full bg-transparent border-none outline-none text-white py-3 cursor-pointer placeholder:text-zinc-600 font-medium min-h-[44px] text-sm md:text-base"
              />
              <kbd className="hidden sm:inline-flex px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-500 uppercase tracking-wider mr-1">
                ⌘K
              </kbd>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-lg mb-10"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm px-3 py-4 sm:px-5 sm:py-5"
              >
                <p className="text-xl sm:text-2xl font-black text-white">{stat.value}</p>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2"
          >
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest mr-1 flex items-center gap-1">
              <Zap size={14} className="text-amber-400" /> Trending
            </span>
            {TRENDING_SLUGS.map((slug) => {
              const tool = getToolBySlug(slug);
              if (!tool) return null;
              return (
                <Link
                  key={slug}
                  href={`/tools/${slug}`}
                  className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/[0.08] hover:border-white/15 transition-all"
                >
                  {tool.shortTitle}
                </Link>
              );
            })}
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-4 relative z-10">
        <ResponsiveAd variant="leaderboard" />
      </div>

      <section id="tools" className="relative py-12 px-4 md:px-8 max-w-[1440px] mx-auto space-y-20 md:space-y-28 z-10" aria-label="Creator tools directory">
        {HOME_SECTIONS.map((section, catIdx) => {
          const tools = getToolsForHomeSection(section);
          if (tools.length === 0) return null;

          return (
            <section key={section.id} className="scroll-mt-32">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-10">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-400/80 mb-2">
                    0{catIdx + 1} — Suite
                  </p>
                  <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white">{section.name}</h2>
                </div>
                <p className="text-xs font-semibold text-zinc-600">{tools.length} tools</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {tools.map((tool, i) => {
                  const Icon = getToolIcon(tool.slug, tool.category);
                  const color = getToolColor(tool.slug, tool.category);
                  const badge = getToolBadge(tool.slug);

                  return (
                    <Link href={`/tools/${tool.slug}`} key={tool.slug} className="group">
                      <motion.article
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ delay: i * 0.03 }}
                        className="relative h-full rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 flex flex-col transition-all duration-300 hover:border-indigo-500/35 hover:shadow-[0_24px_48px_-12px_rgba(99,102,241,0.2)] hover:-translate-y-1 overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-white mb-5 ${color} shadow-lg`}>
                          <Icon size={22} strokeWidth={2} />
                        </div>
                        <div className="relative flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                              {tool.shortTitle}
                            </h3>
                            {badge && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                                {badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">{tool.tagline}</p>
                        </div>
                        <div className="relative mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-indigo-400 transition-colors">
                          <span>Open tool</span>
                          <ArrowUpRight size={14} />
                        </div>
                      </motion.article>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </section>

      <section id="features" className="py-20 md:py-28 px-4 md:px-6 max-w-7xl mx-auto z-10 relative">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Built for <span className="text-indigo-400">speed</span>
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto">No installs. No paywalls. Everything runs in your browser.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-4 rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-12 relative overflow-hidden group hover:border-indigo-500/25 transition-colors">
            <Shield className="text-indigo-400 mb-6" size={32} />
            <h3 className="text-2xl font-black mb-3">100% private & local</h3>
            <p className="text-zinc-500 leading-relaxed max-w-lg text-sm md:text-base">
              WASM-powered tools process on your device. Your files stay yours — zero server uploads for editing workflows.
            </p>
          </div>
          <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-8 flex flex-col justify-end">
            <h3 className="text-xl font-black mb-2">Lightning fast</h3>
            <p className="text-indigo-100/90 text-sm">Skip upload bars. Compress, convert, and export instantly.</p>
          </div>
          <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <Smartphone className="mx-auto mb-4 text-pink-400" size={32} />
            <h4 className="font-black mb-1">Mobile first</h4>
            <p className="text-xs text-zinc-500">Optimized for iOS & Android</p>
          </div>
          <div className="md:col-span-4 rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10 flex items-center justify-between gap-6">
            <div>
              <h4 className="text-xl md:text-2xl font-black mb-2">Always free</h4>
              <p className="text-sm text-zinc-500">No premium exports. No watermarks on your work.</p>
            </div>
            <CheckCircle2 className="text-emerald-500 w-16 h-16 shrink-0 opacity-40 md:opacity-100" />
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-4 md:px-6 max-w-3xl mx-auto z-10 relative border-t border-white/[0.06]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-3">Questions</h2>
          <p className="text-zinc-500 text-sm">Everything about Seloice Tools.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={faq.q} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                aria-expanded={activeFaq === i}
                className="w-full px-5 py-5 text-left flex justify-between items-center gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
              >
                <span className="font-semibold text-zinc-200 text-sm md:text-base">{faq.q}</span>
                {activeFaq === i ? <Minus className="text-indigo-400 shrink-0" size={18} /> : <Plus className="text-zinc-600 shrink-0" size={18} />}
              </button>
              <AnimatePresence>
                {activeFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-zinc-500 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
