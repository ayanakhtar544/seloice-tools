import React from 'react';
import Link from 'next/link';
import SmartLinks from './SmartLinks';
import { ArrowLeft, ChevronRight, Sparkles, Zap, Video, Type, Image as ImageIcon, Twitter, Link as LinkIcon, Share2, ShieldCheck } from 'lucide-react';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  color?: string; // e.g., 'cyan', 'indigo', 'emerald'
  toolSlug?: string; // Passed for SmartLinks
}

const recentTools = [
  { name: 'Video Compressor', icon: <Video size={16}/>, href: '/tools/video-compressor', color: 'orange' },
  { name: 'Auto Captions', icon: <Type size={16}/>, href: '/tools/auto-captions', color: 'cyan' },
  { name: 'BG Remover', icon: <ImageIcon size={16}/>, href: '/tools/bg-remover', color: 'purple' },
];

export default function ToolLayout({ title, description, children, icon, color = 'indigo', toolSlug }: ToolLayoutProps) {
  // Map color names to Tailwind classes dynamically or use pre-defined mapping
  const colorMap: Record<string, { bg: string, text: string, border: string, from: string, to: string, shadow: string }> = {
    cyan: { bg: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500', from: 'from-cyan-400', to: 'to-blue-600', shadow: 'shadow-cyan-500/20' },
    indigo: { bg: 'bg-indigo-500', text: 'text-indigo-400', border: 'border-indigo-500', from: 'from-indigo-400', to: 'to-purple-600', shadow: 'shadow-indigo-500/20' },
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500', from: 'from-emerald-400', to: 'to-teal-600', shadow: 'shadow-emerald-500/20' },
    fuchsia: { bg: 'bg-fuchsia-500', text: 'text-fuchsia-400', border: 'border-fuchsia-500', from: 'from-fuchsia-400', to: 'to-pink-600', shadow: 'shadow-fuchsia-500/20' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500', from: 'from-orange-400', to: 'to-red-600', shadow: 'shadow-orange-500/20' },
    teal: { bg: 'bg-teal-500', text: 'text-teal-400', border: 'border-teal-500', from: 'from-teal-400', to: 'to-cyan-600', shadow: 'shadow-teal-500/20' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500', from: 'from-purple-400', to: 'to-pink-600', shadow: 'shadow-purple-500/20' },
    red: { bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-500', from: 'from-red-400', to: 'to-orange-600', shadow: 'shadow-red-500/20' }
  };

  const theme = colorMap[color] || colorMap['indigo'];

  return (
    <div className="w-full flex flex-col pt-6 md:pt-10">
      
      {/* Background glow specific to the tool */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className={`absolute top-[-10%] w-[40rem] h-[40rem] ${theme.bg}/10 rounded-full blur-[120px] opacity-40`} />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
        
        {/* Breadcrumb Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1"><ArrowLeft size={14}/> Home</Link>
            <ChevronRight size={14} className="opacity-50" />
            <Link href="/#tools" className="hover:text-white transition-colors">Tools</Link>
            <ChevronRight size={14} className="opacity-50" />
            <span className={theme.text}>{title}</span>
          </nav>
          
          {/* EEAT Trust Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={14} /> 100% Secure & Private
          </div>
        </div>

        {/* Tool Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className={`w-16 h-16 bg-gradient-to-br ${theme.from} ${theme.to} p-[2px] rounded-2xl mx-auto mb-6 shadow-xl ${theme.shadow} rotate-3`}>
            <div className="w-full h-full bg-[#111] rounded-[14px] flex items-center justify-center">
              <div className="text-white">
                {icon || <Sparkles size={28} />}
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 uppercase">
            {title.split(' ').map((word, i) => i === title.split(' ').length - 1 ? <span key={i} className={theme.text}>{word}</span> : <span key={i}>{word} </span>)}
          </h1>
          <p className="text-gray-400 font-medium max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            {description}
          </p>
        </div>

        {/* The Tool Interface */}
        <div className="bg-[#111] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden mb-16">
          {/* Subtle top loading line effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
            <div className={`w-1/2 h-full ${theme.bg} animate-[translateX_1.5s_linear_infinite]`} style={{ animationName: 'slide' }} />
          </div>
          <style>{`@keyframes slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
          
          {children}
        </div>

        {/* Social Share / Viral Loops */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-indigo-900/20 border border-indigo-500/20 rounded-2xl p-5 mb-16 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Share2 size={18} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-200">Love this tool?</h4>
              <p className="text-[11px] text-gray-500 font-medium">Share it with other creators and help us keep it free.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] rounded-xl text-xs font-bold transition-colors">
              <Twitter size={14} /> Tweet
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-colors">
              <LinkIcon size={14} /> Copy Link
            </button>
          </div>
        </div>

        {/* Smart Internal Linking Engine */}
        <SmartLinks currentTool={toolSlug} />

        {/* Try Other Tools Section */}
        <div className="border-t border-white/10 pt-12 pb-8">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl md:text-2xl font-black italic uppercase flex items-center gap-2"><Zap className="text-indigo-500" /> Try Other Tools</h3>
             <Link href="/#tools" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">View All</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentTools.map((t, i) => (
              <Link href={t.href} key={i}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 group">
                  <div className={`w-10 h-10 bg-${t.color}-500/20 rounded-xl flex items-center justify-center text-${t.color}-400 group-hover:scale-110 transition-transform`}>
                    {t.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">{t.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Free Tool</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
