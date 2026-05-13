// File: src/app/tools/bg-remover/page.tsx
"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eraser, Upload, Download, Sparkles, Image as ImageIcon, Loader2, Palette, Check, RotateCcw, Maximize, Plus } from 'lucide-react';
import Link from 'next/link';

const PRESET_COLORS = [
  { name: 'Transparent', value: 'transparent' },
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#000000' },
  { name: 'Studio Blue', value: '#1e40af' },
  { name: 'Lush Green', value: '#15803d' },
  { name: 'Vibrant Red', value: '#b91c1c' },
  { name: 'Premium Gold', value: '#d97706' },
  { name: 'Soft Pink', value: '#db2777' },
  { name: 'Neon Purple', value: '#8b5cf6' },
  { name: 'Cyan', value: '#06b6d4' },
];

export default function BackgroundRemover() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [isImageReady, setIsImageReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const [bgColor, setBgColor] = useState('transparent');
  const [customColor, setCustomColor] = useState('#6366f1');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginalFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setProcessedUrl(null);
    setBgColor('transparent');
    setIsImageReady(false);
    setRetryCount(0);
  };

  const handleRemoveBg = async () => {
    if (!originalFile) return;
    
    setIsProcessing(true);
    setProcessedUrl(null);
    setIsImageReady(false);
    setRetryCount(0);

    try {
      const formData = new FormData();
      formData.append('image', originalFile);

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setProcessedUrl(data.url);
      
    } catch (err: any) {
      alert(err.message || "Something went wrong!");
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedUrl || !isImageReady) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous"; 
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        if (bgColor !== 'transparent') {
          ctx.fillStyle = bgColor === 'custom' ? customColor : bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `seloice_bg_removed_${Date.now()}.png`;
        link.click();
      }
    };
    img.src = processedUrl;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-600 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <Link href="/" className="group flex items-center gap-2 text-emerald-500 font-black uppercase tracking-tighter bg-emerald-500/10 px-6 py-3 rounded-2xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
          </Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
              BG <span className="text-emerald-500">REMOVER</span> <span className="text-white/20 uppercase text-2xl md:text-3xl block md:inline not-italic tracking-widest font-light ml-2">v2.0</span>
            </h1>
          </div>
          <div className="hidden md:block w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-emerald-500 mb-6 flex items-center gap-2">
                <Upload size={14} /> Step 1: Upload
              </label>
              
              <div 
                onClick={() => !isProcessing && fileInputRef.current?.click()}
                className={`group border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer ${originalUrl ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-emerald-500/30'}`}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon className={originalUrl ? 'text-emerald-500' : 'text-white/20'} size={32} />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest text-center">{originalUrl ? 'Change Image' : 'Select Photo'}</p>
              </div>

              <button 
                onClick={handleRemoveBg}
                disabled={!originalUrl || isProcessing || isImageReady}
                className="w-full mt-6 py-5 rounded-2xl bg-emerald-600 text-white font-black uppercase tracking-widest text-sm shadow-[0_8px_0_0_#065f46] active:translate-y-1 active:shadow-none transition-all hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isProcessing ? <><Loader2 className="animate-spin" /> Magic is happening...</> : <><Sparkles size={18} /> Remove Background</>}
              </button>
            </div>

            {/* 🔥 FIXED BACKGROUND CUSTOMIZER */}
            <AnimatePresence>
              {isImageReady && processedUrl && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#111] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-emerald-500 mb-6 flex items-center gap-2">
                    <Palette size={14} /> Step 2: Customize
                  </label>
                  
                  {/* SCROLLABLE COLOR BAR */}
                  <div className="flex overflow-x-auto gap-3 mb-8 pb-3 items-center" style={{ scrollbarWidth: 'none' }}>
                    
                    {/* CUSTOM COLOR PICKER BUTTON */}
                    <div className={`relative shrink-0 w-14 h-14 rounded-2xl border-2 transition-all flex items-center justify-center overflow-hidden cursor-pointer bg-gradient-to-br from-red-500 via-green-500 to-blue-500 ${bgColor === 'custom' ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}>
                       <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                          {bgColor === 'custom' ? <Check size={20} className="text-white drop-shadow-md z-20" /> : <Plus size={20} className="text-white z-20" />}
                       </div>
                       {/* Hiding the ugly input over the beautiful button */}
                       <input 
                         type="color" 
                         value={customColor} 
                         onChange={(e) => {setCustomColor(e.target.value); setBgColor('custom');}} 
                         className="absolute inset-0 w-[200%] h-[200%] top-[-50%] left-[-50%] cursor-pointer opacity-0 z-30"
                       />
                    </div>

                    {/* PRESET COLORS */}
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setBgColor(color.value)}
                        className={`shrink-0 w-14 h-14 rounded-2xl border-2 transition-all flex items-center justify-center ${bgColor === color.value ? 'border-emerald-500 scale-110 shadow-lg' : 'border-white/10 hover:border-white/30 hover:scale-105'}`}
                        style={{ 
                          backgroundColor: color.value,
                          backgroundImage: color.value === 'transparent' ? 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3MvH9AsYwZgxAf8vNDCc8P/88/MWVBBHCHfS0HBDf8D55AAAc9R6D/Vf66EAAAAASUVORK5CYII=")' : 'none'
                        }}
                      >
                        {bgColor === color.value && <Check size={20} className={color.name === 'White' || color.name === 'Transparent' ? 'text-black' : 'text-white'} />}
                      </button>
                    ))}
                  </div>

                  <button onClick={handleDownload} className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm shadow-[0_8px_0_0_#d1d5db] active:translate-y-1 active:shadow-none transition-all hover:bg-gray-100 flex items-center justify-center gap-3">
                    <Download size={18} /> Download HD Image
                  </button>
                  
                  <button onClick={() => {setOriginalUrl(null); setProcessedUrl(null); setIsImageReady(false); setBgColor('transparent');}} className="w-full mt-4 flex items-center justify-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/20 hover:text-red-500 transition-colors">
                    <RotateCcw size={12} /> Start New Project
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-[#111] border border-white/10 rounded-[3rem] p-4 md:p-10 h-full min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden group">
              
              {!originalUrl && (
                <div className="text-center space-y-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-white flex items-center justify-center mx-auto">
                    <Maximize size={40} />
                  </div>
                  <p className="text-sm font-black uppercase tracking-[0.3em]">Live Preview Canvas</p>
                </div>
              )}

              {originalUrl && (
                <div className="w-full h-full flex flex-col items-center gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full">
                    <div className="space-y-4 flex flex-col h-full">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30 text-center">Original</p>
                      <div className="flex-1 rounded-3xl overflow-hidden border border-white/5 bg-black/40 p-4 min-h-[300px]">
                        <img src={originalUrl} className="w-full h-full object-contain" alt="Original" />
                      </div>
                    </div>

                    <div className="space-y-4 flex flex-col h-full">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 text-center">Processed</p>
                      <div 
                        className="relative flex-1 rounded-3xl overflow-hidden border border-emerald-500/20 shadow-2xl shadow-emerald-500/5 transition-all duration-500 flex items-center justify-center min-h-[300px]"
                        style={{ 
                          backgroundColor: bgColor === 'custom' ? customColor : bgColor,
                          backgroundImage: bgColor === 'transparent' ? 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3MvH9AsYwZgxAf8vNDCc8P/88/MWVBBHCHfS0HBDf8D55AAAc9R6D/Vf66EAAAAASUVORK5CYII=")' : 'none'
                        }}
                      >
                        {isProcessing && !isImageReady && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-emerald-500 bg-black/80 z-10">
                            <Sparkles size={48} className="animate-pulse" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
                              {retryCount > 0 ? `Cloudinary Syncing (${retryCount}/6)...` : 'AI is processing...'}
                            </p>
                          </div>
                        )}

                        {processedUrl && (
                          <img 
                            src={processedUrl} 
                            crossOrigin="anonymous"
                            className={`absolute inset-0 w-full h-full object-contain p-4 drop-shadow-2xl transition-opacity duration-700 ${isImageReady ? 'opacity-100' : 'opacity-0'}`} 
                            alt="Removed BG"
                            onLoad={() => { setIsImageReady(true); setIsProcessing(false); }}
                            onError={(e) => {
                               if (retryCount < 6) {
                                 setTimeout(() => {
                                   setRetryCount(prev => prev + 1);
                                   const cleanUrl = processedUrl.split('?')[0]; 
                                   setProcessedUrl(`${cleanUrl}?retry=${retryCount + 1}&t=${Date.now()}`); 
                                 }, 3000); 
                               } else {
                                 setIsProcessing(false);
                                 alert("Bhai, Cloudinary processing nahi kar paa raha! Dashboard me jake 'Cloudinary AI Background Removal' Add-on zaroor enable kar lena.");
                               }
                            }}
                          />
                        )}

                        {!isProcessing && !processedUrl && (
                          <div className="w-full h-full flex items-center justify-center text-white/10 italic text-sm">Waiting to process...</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}