/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { Sparkles, Zap, MessageCircle, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-24 pb-12 mt-12 relative z-10 font-sans text-white">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[30px] bg-indigo-500/20 blur-[30px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
        
        <div className="md:col-span-5 text-center md:text-left">
          <Link href="/" className="flex items-center gap-3 font-black text-xl md:text-2xl tracking-tighter italic text-white hover:opacity-80 transition-opacity">
          <img 
            src="/favicon.ico" 
            alt="Seloice Logo" 
            className="w-8 h-8 md:w-10 md:h-10 object-contain" 
          />
          <span className="hidden sm:block">SELOICE</span>
        </Link>
          <p className="text-gray-500 max-w-sm mx-auto md:mx-0 mb-8 leading-relaxed font-medium">
            Building the ultimate operating system for modern creators. Faster edits, better growth, zero cost.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all shadow-lg"><MessageCircle size={20}/></a>
            <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all shadow-lg"><Mail size={20}/></a>
          </div>
        </div>
        
        <div className="md:col-span-2 text-center md:text-left">
          <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-white">Quick Links</h4>
          <ul className="space-y-4 text-gray-500 font-bold text-sm">
            <li><Link href="/#tools" className="hover:text-indigo-400 transition-colors">All 22 Tools</Link></li>
            <li><Link href="/#features" className="hover:text-indigo-400 transition-colors">Features</Link></li>
            <li><Link href="/#pricing" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
            <li><Link href="/#faq" className="hover:text-indigo-400 transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2 text-center md:text-left">
          <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-white">Tool Categories</h4>
          <ul className="space-y-4 text-gray-500 font-bold text-sm">
            <li><Link href="/tools/yt-downloader" className="hover:text-indigo-400 transition-colors">Download Tools</Link></li>
            <li><Link href="/tools/video-compressor" className="hover:text-indigo-400 transition-colors">Editing Tools</Link></li>
            <li><Link href="/tools/auto-captions" className="hover:text-indigo-400 transition-colors">AI Tools</Link></li>
            <li><Link href="/tools/bg-remover" className="hover:text-indigo-400 transition-colors">Utility Tools</Link></li>
          </ul>
        </div>
        
        <div className="md:col-span-3 text-center md:text-left">
           <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-white">Legal & Support</h4>
           <ul className="space-y-4 text-gray-500 font-bold text-sm">
            <li><Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
            <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact Us</Link></li>
            <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Report a Bug</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-center">
        <p className="text-gray-600 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">© {new Date().getFullYear()} SELOICE TOOLS. All rights reserved.</p>
        <div className="flex items-center justify-center gap-2 text-gray-600 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-full border border-white/5">
          BUILT WITH <Zap size={14} className="text-indigo-500"/> FOR CREATORS
        </div>
      </div>
    </footer>
  );
}
