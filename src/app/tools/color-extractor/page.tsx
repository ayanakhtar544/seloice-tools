// File: src/app/tools/color-extractor/page.tsx
"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, Palette, Copy, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ColorExtractor() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // RGB ko HEX me convert karne ka function
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join('');
  };

  // Canvas API se colors nikalne ka zero-cost logic
  const extractColors = (imageElement: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas size image jitna set karo
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

    // Image ka data lo
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    // Thode pixels skip karke distinct colors dhoondhne ka simple logic
    const colorSet = new Set<string>();
    const step = Math.floor((imageData.length / 4) / 100) * 4; // Check roughly 100 pixels

    for (let i = 0; i < imageData.length; i += step) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      
      // Ignore complete white or complete black to get better aesthetics
      if ((r > 240 && g > 240 && b > 240) || (r < 15 && g < 15 && b < 15)) continue;
      
      const hex = rgbToHex(r, g, b);
      colorSet.add(hex);

      // Humein bas 6 distinct colors chahiye
      if (colorSet.size >= 6) break;
    }

    setColors(Array.from(colorSet));
    setIsProcessing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setColors([]);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);

      // Image load hone par canvas me bhej do
      const img = new Image();
      img.onload = () => extractColors(img);
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="w-full  bg-[#050505] text-white selection:bg-teal-500/30 p-6 relative overflow-hidden flex flex-col items-center">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-0 left-[20%] w-96 h-96 bg-teal-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-[20%] w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-4xl pt-10 z-10">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors mb-10 group w-fit">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Tools</span>
        </Link>

        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border border-white/5 rounded-2xl mb-6 shadow-[0_0_30px_rgba(20,184,166,0.15)]">
            <Palette size={36} className="text-teal-400" />
          </div>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            Aesthetic <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Color Extractor</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Upload any image and instantly extract its viral color palette. Perfect for matching aesthetics and branding.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Upload Area */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.1 }}
            className="h-full"
          >
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="h-80 border-2 border-dashed border-white/10 hover:border-teal-500/50 bg-[#111]/50 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              
              {imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageSrc} alt="Uploaded preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-50"></div>
              )}

              <div className="relative z-10 flex flex-col items-center p-6 text-center">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-teal-500/20 group-hover:text-teal-400">
                  {imageSrc ? <ImageIcon size={28} /> : <Upload size={28} />}
                </div>
                <h3 className="text-xl font-bold text-gray-200 mb-2">
                  {imageSrc ? 'Change Image' : 'Click to Upload Image'}
                </h3>
                <p className="text-sm text-gray-500">Supports JPG, PNG, WEBP</p>
              </div>
            </div>
          </motion.div>

          {/* Results Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }}
            className="bg-[#111]/50 backdrop-blur-md border border-white/5 rounded-3xl p-8 flex flex-col justify-center shadow-2xl"
          >
            <h3 className="text-xl font-semibold text-gray-200 mb-6 flex items-center gap-2">
              <Palette size={20} className="text-teal-400" /> Extracted Palette
            </h3>

            {isProcessing ? (
              <div className="h-32 flex items-center justify-center text-gray-400 animate-pulse">
                Processing pixels...
              </div>
            ) : colors.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <AnimatePresence>
                  {colors.map((color, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, type: 'spring' }}
                      onClick={() => copyColor(color)}
                      className="group cursor-pointer relative"
                    >
                      {/* Color Swatch */}
                      <div 
                        className="w-full h-24 rounded-2xl shadow-lg border border-white/10 transition-transform group-hover:-translate-y-2 group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                        style={{ backgroundColor: color }}
                      />
                      
                      {/* HEX Code & Copy Action */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl backdrop-blur-sm">
                        {copiedColor === color ? (
                          <div className="flex flex-col items-center text-green-400">
                            <CheckCircle2 size={24} className="mb-1" />
                            <span className="text-xs font-bold">COPIED</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-white">
                            <Copy size={24} className="mb-1" />
                            <span className="text-xs font-bold font-mono">{color.toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-gray-600 border border-dashed border-white/5 rounded-2xl">
                Upload an image to see magic
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