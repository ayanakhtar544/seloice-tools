// File: src/app/tools/watermark-adder/page.tsx
"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Upload, Download, Type, Sliders, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

type Position = 'tl' | 'tr' | 'bl' | 'br' | 'center';

export default function WatermarkAdder() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState('@ansari_bhaiya');
  const [opacity, setOpacity] = useState(50);
  const [size, setSize] = useState(30);
  const [position, setPosition] = useState<Position>('br');
  const [isDownloading, setIsDownloading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
  };

  // Zero-Cost Canvas Magic for Download
  const handleDownload = () => {
    if (!imageSrc) return;
    setIsDownloading(true);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      if (!ctx) return;
      
      // Set canvas size to original image size
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw base image
      ctx.drawImage(img, 0, 0);
      
      // Watermark settings
      ctx.globalAlpha = opacity / 100;
      // Responsive font size based on image width
      const fontSize = (size / 100) * (img.width / 10); 
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.fillStyle = 'white';
      
      // Text Shadow for visibility on bright images
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Calculate positions
      const padding = fontSize;
      let x = 0, y = 0;

      switch (position) {
        case 'tl':
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          x = padding; y = padding;
          break;
        case 'tr':
          ctx.textAlign = 'right';
          ctx.textBaseline = 'top';
          x = canvas.width - padding; y = padding;
          break;
        case 'bl':
          ctx.textAlign = 'left';
          ctx.textBaseline = 'bottom';
          x = padding; y = canvas.height - padding;
          break;
        case 'br':
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
          x = canvas.width - padding; y = canvas.height - padding;
          break;
        case 'center':
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          x = canvas.width / 2; y = canvas.height / 2;
          break;
      }

      ctx.fillText(watermarkText, x, y);

      // Trigger Download
      const link = document.createElement('a');
      link.download = `watermarked_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      setIsDownloading(false);
    };
    img.src = imageSrc;
  };

  // Helper for live preview positioning
  const getPreviewPositionClass = () => {
    switch (position) {
      case 'tl': return 'top-4 left-4 text-left';
      case 'tr': return 'top-4 right-4 text-right';
      case 'bl': return 'bottom-4 left-4 text-left';
      case 'br': return 'bottom-4 right-4 text-right';
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center';
    }
  };

  return (
    <div className="w-full  bg-[#050505] text-white selection:bg-cyan-500/30 p-6 flex flex-col items-center relative overflow-hidden">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-6xl pt-4 z-10">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-8 group w-fit">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Tools</span>
        </Link>

        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl mb-6 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <Shield size={36} className="text-cyan-400" />
          </div>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            Brand <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Watermark Adder</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Protect your content. Add your custom watermark instantly without losing image quality. 100% private and secure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel (Left) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 bg-[#111]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex flex-col gap-6"
          >
            {/* Upload Button */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-cyan-500/50 bg-black/50 p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              <div className="w-12 h-12 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                <Upload size={20} />
              </div>
              <span className="font-bold text-gray-200">{imageSrc ? 'Change Image' : 'Upload Image'}</span>
            </div>

            {/* Watermark Text Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                <Type size={16} /> Watermark Text
              </label>
              <input 
                type="text" 
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full bg-black/50 border border-white/10 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-white outline-none transition-colors"
                placeholder="e.g. @yourbrand"
              />
            </div>

            {/* Position Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Position</label>
              <div className="grid grid-cols-3 gap-2 bg-black/50 p-2 rounded-xl border border-white/10 h-32 relative">
                <button onClick={() => setPosition('tl')} className={`absolute top-2 left-2 p-2 rounded-lg ${position === 'tl' ? 'bg-cyan-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>↖</button>
                <button onClick={() => setPosition('tr')} className={`absolute top-2 right-2 p-2 rounded-lg ${position === 'tr' ? 'bg-cyan-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>↗</button>
                <button onClick={() => setPosition('center')} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-lg ${position === 'center' ? 'bg-cyan-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>Center</button>
                <button onClick={() => setPosition('bl')} className={`absolute bottom-2 left-2 p-2 rounded-lg ${position === 'bl' ? 'bg-cyan-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>↙</button>
                <button onClick={() => setPosition('br')} className={`absolute bottom-2 right-2 p-2 rounded-lg ${position === 'br' ? 'bg-cyan-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>↘</button>
              </div>
            </div>

            {/* Sliders (Opacity & Size) */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <label className="flex items-center gap-2"><Sliders size={16} /> Opacity</label>
                  <span>{opacity}%</span>
                </div>
                <input type="range" min="10" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-cyan-500" />
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <label className="flex items-center gap-2"><Type size={16} /> Size</label>
                  <span>{size}</span>
                </div>
                <input type="range" min="10" max="100" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-cyan-500" />
              </div>
            </div>

            {/* Download Button */}
            <button 
              onClick={handleDownload}
              disabled={!imageSrc || isDownloading}
              className="mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              {isDownloading ? 'Processing...' : <><Download size={20} /> Download Protected Image</>}
            </button>

          </motion.div>

          {/* Preview Panel (Right) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 bg-[#111]/50 backdrop-blur-md border border-white/5 p-4 rounded-3xl shadow-2xl flex flex-col items-center justify-center min-h-[500px]"
          >
            {!imageSrc ? (
              <div className="text-gray-600 flex flex-col items-center text-center">
                <ImageIcon size={64} className="mb-4 opacity-50" />
                <p className="text-lg font-medium text-gray-400">Live Preview Area</p>
                <p className="text-sm">Upload an image to see your watermark</p>
              </div>
            ) : (
              <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageSrc} alt="Preview" className="max-h-[600px] w-auto object-contain" />
                
                {/* CSS Live Preview of Watermark */}
                <div 
                  className={`absolute font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] pointer-events-none transition-all duration-300 ${getPreviewPositionClass()}`}
                  style={{ 
                    opacity: opacity / 100, 
                    fontSize: `${Math.max(12, size / 1.5)}px` // scaled down for CSS preview
                  }}
                >
                  {watermarkText}
                </div>
              </div>
            )}
          </motion.div>

        </div>
      
        {/* Try Other Tools Section */}
        <div className="border-t border-white/10 pt-12 pb-8 mt-16 w-full">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl md:text-2xl font-black italic uppercase flex items-center gap-2">Try Other Tools</h3>
             <a href="/#tools" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">View All</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/tools/video-compressor">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 group">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">Video Compressor</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Free Tool</p>
                </div>
              </div>
            </a>
            <a href="/tools/auto-captions">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 group">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13h4"/><path d="M15 13h2"/><path d="M7 9h2"/><path d="M13 9h4"/><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">Auto Captions</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Free Tool</p>
                </div>
              </div>
            </a>
            <a href="/tools/bg-remover">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 group">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">BG Remover</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Free Tool</p>
                </div>
              </div>
            </a>
          </div>
        </div>
</div>
    </div>
  );
}