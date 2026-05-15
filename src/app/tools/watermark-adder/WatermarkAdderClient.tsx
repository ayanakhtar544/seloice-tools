// File: src/app/tools/watermark-adder/page.tsx
"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Upload, Download, Type, Sliders, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

type Position = 'tl' | 'tr' | 'bl' | 'br' | 'center';

export default function WatermarkAdderClient() {
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

</div>
    </div>
  );
}