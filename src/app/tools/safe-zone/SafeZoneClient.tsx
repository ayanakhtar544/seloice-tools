// File: src/app/tools/safe-zone/page.tsx
"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Smartphone, Upload, Heart, MessageCircle, Send, MoreVertical, Music, Camera, Share2, ThumbsUp, ThumbsDown } from 'lucide-react';
import Link from 'next/link';

type Platform = 'instagram' | 'youtube' | 'tiktok';

export default function SafeZoneClient() {
  const [mediaSrc, setMediaSrc] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [activePlatform, setActivePlatform] = useState<Platform>('instagram');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setMediaSrc(url);
    setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
  };

  // Instagram Overlay UI Component
  const InstagramOverlay = () => (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 text-white drop-shadow-md">
      {/* Top Header */}
      <div className="flex justify-between items-center mt-8">
        <span className="font-bold text-lg">Reels</span>
        <Camera size={24} />
      </div>
      
      {/* Bottom & Right Area */}
      <div className="flex justify-between items-end mb-4">
        {/* User Info & Caption (Bottom Left) */}
        <div className="flex-1 pr-12">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 border border-white"></div>
            <span className="font-bold text-sm">ansari_bhaiya</span>
            <button className="border border-white px-2 py-0.5 rounded-md text-xs font-semibold">Follow</button>
          </div>
          <p className="text-sm line-clamp-2">This is where your long caption goes. Make sure your important text in the video is above this area!</p>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <Music size={12} />
            <span>Original Audio - Trending</span>
          </div>
        </div>

        {/* Action Buttons (Bottom Right) */}
        <div className="flex flex-col items-center gap-5 pb-2">
          <div className="flex flex-col items-center gap-1"><Heart size={28} /> <span className="text-xs">1.2M</span></div>
          <div className="flex flex-col items-center gap-1"><MessageCircle size={28} /> <span className="text-xs">4K</span></div>
          <div className="flex flex-col items-center gap-1"><Send size={28} /> <span className="text-xs">Share</span></div>
          <MoreVertical size={24} />
          <div className="w-8 h-8 rounded-md bg-gray-800 border-2 border-white mt-2 flex items-center justify-center overflow-hidden">
            <Music size={16} />
          </div>
        </div>
      </div>
    </div>
  );

  // YouTube Shorts Overlay UI Component
  const YouTubeOverlay = () => (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 text-white drop-shadow-md">
      {/* Top Header */}
      <div className="flex justify-between items-center mt-8">
        <span className="font-bold text-lg">Shorts</span>
        <Camera size={24} />
      </div>
      
      {/* Bottom & Right Area */}
      <div className="flex justify-between items-end mb-4">
        {/* User Info & Caption (Bottom Left) */}
        <div className="flex-1 pr-12">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-red-600 border border-white"></div>
            <span className="font-bold text-sm">@CreatorToolkit</span>
            <button className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold">Subscribe</button>
          </div>
          <p className="text-sm font-medium">How to check safe zones for YouTube Shorts! 🔥 #shorts #tips</p>
        </div>

        {/* Action Buttons (Bottom Right) */}
        <div className="flex flex-col items-center gap-6 pb-2">
          <div className="flex flex-col items-center gap-1"><ThumbsUp size={28} className="fill-white" /> <span className="text-xs">Like</span></div>
          <div className="flex flex-col items-center gap-1"><ThumbsDown size={28} /> <span className="text-xs">Dislike</span></div>
          <div className="flex flex-col items-center gap-1"><MessageCircle size={28} /> <span className="text-xs">12K</span></div>
          <div className="flex flex-col items-center gap-1"><Share2 size={28} /> <span className="text-xs">Share</span></div>
          <div className="w-8 h-8 rounded-md bg-gray-800 mt-2"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full  bg-[#050505] text-white selection:bg-rose-500/30 p-6 flex flex-col items-center relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-rose-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[40rem] h-[40rem] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-6xl pt-4 z-10">
        
        {/* Header & Back Button */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
<div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md">
            <Smartphone className="text-rose-400" />
            <h2 className="text-xl font-bold">Safe Zone Previewer</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Controls Area (Upload & Settings) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 bg-[#111]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-2">Test Your Content</h2>
            <p className="text-gray-400 mb-8">Upload your video or image to see how it looks under native app UI. Don't let your text get hidden!</p>

            {/* Platform Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-400 mb-3">Select Platform View</label>
              <div className="flex gap-3">
                <button 
                  onClick={() => setActivePlatform('instagram')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${activePlatform === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.3)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'}`}
                >
                  IG Reels
                </button>
                <button 
                  onClick={() => setActivePlatform('youtube')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${activePlatform === 'youtube' ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'}`}
                >
                  YT Shorts
                </button>
              </div>
            </div>

            {/* Upload Box */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="h-48 border-2 border-dashed border-white/20 hover:border-rose-500/50 bg-black/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,video/*" className="hidden" />
              <div className="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all">
                <Upload size={24} />
              </div>
              <span className="font-bold text-gray-200">Click to Upload Media</span>
              <span className="text-sm text-gray-500 mt-1">Supports Video & Images (9:16)</span>
            </div>
            
            {mediaSrc && (
               <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl flex items-center gap-2 text-sm">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 Media loaded successfully! Previewing on right.
               </div>
            )}
          </motion.div>

          {/* Right Area (Phone Simulator) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 flex justify-center"
          >
            {/* Phone Frame wrapper */}
            <div className="relative w-[320px] sm:w-[360px] aspect-[9/16] bg-black rounded-[3rem] border-[8px] border-gray-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
              
              {/* iPhone Dynamic Island / Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20"></div>

              {/* Uploaded Media */}
              <div className="w-full h-full bg-[#111] flex items-center justify-center relative">
                {!mediaSrc ? (
                  <div className="text-gray-600 flex flex-col items-center text-center px-6">
                    <Smartphone size={48} className="mb-4 opacity-50" />
                    <p>Upload a media file to see the safe zone preview</p>
                  </div>
                ) : (
                  <>
                    {mediaType === 'video' ? (
                      <video src={mediaSrc} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={mediaSrc} alt="Preview" className="w-full h-full object-cover" />
                    )}
                    
                    {/* Safe Zone Dark Overlay Overlay (Highlights danger areas) */}
                    <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                  </>
                )}
              </div>

              {/* The Platform UI Overlays */}
              <AnimatePresence mode="wait">
                {activePlatform === 'instagram' && (
                  <motion.div key="ig" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <InstagramOverlay />
                  </motion.div>
                )}
                {activePlatform === 'youtube' && (
                  <motion.div key="yt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <YouTubeOverlay />
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>

        </div>

</div>
    </div>
  );
}