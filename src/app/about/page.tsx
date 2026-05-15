// File: src/app/about/page.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Zap, Shield, Globe, Users, Code2, Target } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Seloice | Free AI Tools for Creators',
  description: 'Seloice is a free AI-powered creator toolkit built for YouTubers, Instagram creators, and digital marketers. Learn about our mission to make professional tools accessible to everyone.',
  alternates: {
    canonical: 'https://seloice.com/about',
  },
};

const stats = [
  { label: 'Free Tools', value: '26+' },
  { label: 'Monthly Users', value: '50K+' },
  { label: 'Countries', value: '80+' },
  { label: 'Uptime', value: '99.9%' },
];

const values = [
  {
    icon: <Zap size={20} />,
    title: 'Always Free',
    desc: 'Every core tool on Seloice is free to use. No hidden fees, no credit cards, no limits on basic usage.',
    color: 'yellow',
  },
  {
    icon: <Shield size={20} />,
    title: 'Privacy First',
    desc: 'Most tools run entirely in your browser. Your files never touch our servers. Your data stays yours.',
    color: 'emerald',
  },
  {
    icon: <Sparkles size={20} />,
    title: 'AI-Powered',
    desc: 'We use Google Gemini and other cutting-edge AI to deliver professional-grade outputs in seconds.',
    color: 'indigo',
  },
  {
    icon: <Globe size={20} />,
    title: 'Built for Global Creators',
    desc: 'From YouTube to Instagram, from Bihar to Berlin — Seloice is built for every creator, everywhere.',
    color: 'cyan',
  },
];

const tools = [
  'Viral Hook Generator', 'Smart Captions', 'YouTube Title Generator',
  'Background Remover', 'Hashtag Generator', 'Video Compressor',
  'Reel Downloader', 'Audio Editor', 'Photo Studio', 'QR Generator',
  'Tweet Generator', 'Watermark Adder', 'MP4 to MP3', 'Speech to Text',
  'Auto Captions (SRT)', 'Thumbnail Extractor', 'File Converter', 'Grid Maker',
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-5xl mx-auto px-5 py-16 md:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-xs uppercase tracking-widest mb-12 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>

        {/* Hero */}
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6">
            <Sparkles size={12} /> Our Story
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-6 leading-none">
            Built by Creators,<br />
            <span className="text-indigo-400">for Creators.</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
            Seloice started as a simple idea: professional media tools should be free and accessible to every creator — not locked behind expensive subscriptions.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-3xl md:text-4xl font-black text-white mb-1">{s.value}</p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border border-indigo-500/20 rounded-3xl p-8 md:p-12 mb-20">
          <Target size={32} className="text-indigo-400 mb-4" />
          <h2 className="text-3xl md:text-4xl font-black italic mb-4">Our Mission</h2>
          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
            The creator economy is booming, but the best tools are still hidden behind paywalls. Seloice breaks that barrier by providing 26+ professional-grade tools — completely free. We believe that every creator, regardless of budget, deserves access to tools that help them grow faster, create better, and build a sustainable career online.
          </p>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-black italic uppercase mb-8">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((v) => (
              <div key={v.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                <div className={`w-10 h-10 bg-${v.color}-500/10 text-${v.color}-400 rounded-xl flex items-center justify-center mb-4`}>
                  {v.icon}
                </div>
                <h3 className="font-black text-white mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Code2 size={24} className="text-indigo-400" />
            <h2 className="text-3xl font-black italic uppercase">What We Built</h2>
          </div>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Seloice currently offers <strong className="text-white">{tools.length}+ tools</strong> spanning video, audio, image editing, AI content generation, and social media utilities:
          </p>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <span key={tool} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-300">
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Users size={24} className="text-indigo-400" />
            <h2 className="text-3xl font-black italic uppercase">The Team</h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <p className="text-gray-300 text-base leading-relaxed">
              Seloice is an independent, bootstrapped project built by a small team of developers and designers passionate about the creator economy. We are based in <strong className="text-white">Bihar, India</strong> and building for the global creator community.
            </p>
            <p className="text-gray-400 text-sm mt-4">
              Have feedback, found a bug, or want to collaborate?{' '}
              <Link href="/contact" className="text-indigo-400 hover:text-indigo-300 font-bold underline underline-offset-2">
                Get in touch →
              </Link>
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-indigo-500/30 rounded-3xl p-12">
          <Sparkles size={40} className="text-indigo-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-black italic mb-3">Ready to Create?</h2>
          <p className="text-gray-400 mb-8">26+ free tools. No signup required. Start creating today.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest px-8 py-4 rounded-2xl transition-colors text-sm shadow-[0_0_30px_rgba(79,70,229,0.3)]"
          >
            <Zap size={16} /> Explore All Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
