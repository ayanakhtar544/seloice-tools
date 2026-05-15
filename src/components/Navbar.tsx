// File: src/components/Navbar.tsx
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ChevronDown, X, ArrowRight, Image as ImageIcon, 
  Mic2, Download, Zap
} from 'lucide-react';
import HistoryDrawer from './HistoryDrawer';
import { filterSearchTools, SEARCH_TOOLS, TOOL_COUNT } from '@/lib/tools-catalog';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 100);
  }, [isSearchOpen]);

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener('open_search', handleOpenSearch);
    return () => window.removeEventListener('open_search', handleOpenSearch);
  }, []);

  const filteredTools = filterSearchTools(searchQuery);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center items-center pt-3 md:pt-6 font-sans">
        <nav 
          onMouseLeave={() => setIsToolsOpen(false)}
          className={`relative flex items-center justify-between px-4 sm:px-6 transition-all duration-500 ease-out border border-white/10 shadow-2xl backdrop-blur-xl
            ${isScrolled 
              ? 'w-full max-w-full h-16 sm:h-20 mt-[-12px] md:mt-[-24px] rounded-none bg-black/90' 
              : 'w-[95%] max-w-6xl h-14 sm:h-16 rounded-full bg-[#0a0a0a]/80'}`}
        >
          <Link href="/" className="flex items-center gap-2 sm:gap-3 font-black text-lg sm:text-2xl tracking-tighter italic text-white hover:opacity-80 transition-opacity">
            <img src="/favicon.png" alt="Seloice Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            <span>SELOICE</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-400 h-full">
            <Link href="/" className="hover:text-white transition-colors h-full flex items-center">Home</Link>
            <Link href="/#features" className="hover:text-white transition-colors h-full flex items-center">Features</Link>
            
            <div 
              className="relative h-full flex items-center cursor-pointer group"
              onMouseEnter={() => setIsToolsOpen(true)}
            >
              <Link href="/tools" className={`flex items-center gap-1 transition-colors h-full ${isToolsOpen ? 'text-white' : 'hover:text-white'}`}>
                Tools <ChevronDown size={14} className={`transition-transform duration-300 ${isToolsOpen ? 'rotate-180' : ''}`} />
              </Link>

              <AnimatePresence>
                {isToolsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-[110%] left-1/2 -translate-x-1/2 w-[700px] bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] cursor-default grid grid-cols-2 gap-8 before:content-[''] before:absolute before:-top-4 before:left-0 before:w-full before:h-4"
                  >
                     <div className="space-y-6">
                        <div>
                           <h4 className="text-[10px] text-gray-500 mb-3 flex items-center gap-2"><ImageIcon size={14}/> Studio Design</h4>
                           <div className="flex flex-col gap-2">
                             <MenuLink href="/tools/photo-editor" name="Photo Studio Pro" />
                             <MenuLink href="/tools/bg-remover" name="AI BG Remover" />
                             <MenuLink href="/tools/image-converter" name="Image Converter" />
                           </div>
                        </div>
                        <div>
                           <h4 className="text-[10px] text-gray-500 mb-3 flex items-center gap-2"><Mic2 size={14}/> Audio & Voice</h4>
                           <div className="flex flex-col gap-2">
                             <MenuLink href="/tools/audio-editor" name="Audio Studio Pro" />
                             <MenuLink href="/tools/mp4-to-mp3" name="MP4 to MP3" />
                             <MenuLink href="/tools/speech-to-text" name="Speech to Text AI" />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div>
                           <h4 className="text-[10px] text-gray-500 mb-3 flex items-center gap-2"><Download size={14}/> Video & Social</h4>
                           <div className="flex flex-col gap-2">
                             <MenuLink href="/tools/yt-downloader" name="YT / Shorts Downloader" />
                             <MenuLink href="/tools/reel-downloader" name="Reel Downloader" />
                             <MenuLink href="/tools/video-compressor" name="Video Compressor" />
                             <MenuLink href="/tools/auto-captions" name="Auto Captions AI" />
                           </div>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                           <Link href="/tools" className="group flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all">
                              <div>
                                 <h4 className="text-emerald-400 text-xs">Explore All {TOOL_COUNT}+ Tools</h4>
                                 <p className="text-[9px] text-emerald-500/70 font-normal normal-case">The complete creator suite.</p>
                              </div>
                              <ArrowRight size={16} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                           </Link>
                        </div>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Search tools"
            >
              <Search size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>

            <HistoryDrawer />

            <Link href="/tools" className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white text-black font-black text-[10px] sm:text-xs shadow-[0_4px_0_0_#d1d5db] active:translate-y-1 active:shadow-none hover:bg-gray-100 transition-all uppercase tracking-widest whitespace-nowrap">
              All Tools
            </Link>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center pt-16 sm:pt-20 px-4 sm:px-6"
          >
            <button 
              onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 sm:p-4 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
              aria-label="Close search"
            >
              <X size={24} className="sm:w-8 sm:h-8" />
            </button>

            <div className="w-full max-w-3xl">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="relative mb-8 sm:mb-12"
              >
                <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-emerald-500" size={24} />
                <input 
                  ref={searchInputRef}
                  type="search" 
                  placeholder={`Search ${TOOL_COUNT} tools…`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border-b-2 border-emerald-500/30 py-6 sm:py-8 pl-14 sm:pl-20 pr-6 sm:pr-8 text-xl sm:text-4xl font-bold text-white placeholder:text-gray-600 outline-none focus:border-emerald-500 transition-all"
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-h-[65vh] overflow-y-auto pr-2 sm:pr-4 no-scrollbar pb-10"
              >
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool) => (
                    <Link 
                      key={tool.slug} 
                      href={tool.href}
                      onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                      className="group flex items-center justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform shrink-0">
                          <Zap size={18} className="sm:w-5 sm:h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-white font-black uppercase italic tracking-tight text-xs sm:text-sm group-hover:text-emerald-400 transition-colors line-clamp-1">{tool.name}</h4>
                          <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium normal-case line-clamp-1">{tool.desc}</p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                    </Link>
                  ))
                ) : (
                  <div className="col-span-1 sm:col-span-2 py-10 sm:py-20 text-center">
                    <p className="text-gray-600 font-black uppercase tracking-widest italic text-xs sm:text-sm">No tools found for &quot;{searchQuery}&quot;</p>
                  </div>
                )}
              </motion.div>
              {!searchQuery && (
                <p className="text-center text-[10px] text-gray-600 uppercase tracking-widest mt-2">
                  Showing all {SEARCH_TOOLS.length} tools
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MenuLink({ href, name }: { href: string, name: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors">
       <span className="text-gray-300 group-hover:text-white font-bold text-xs">{name}</span>
       <ArrowRight size={12} className="text-gray-600 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
    </Link>
  );
}
