// File: src/app/tools/reel-fitter/page.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Maximize, Upload, Download, Sliders, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function ReelFitterClient() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [blurAmount, setBlurAmount] = useState(20);
  const [darkenAmount, setDarkenAmount] = useState(30);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Jab bhi image ya sliders change hon, Canvas ko update karo
  useEffect(() => {
    if (imageSrc) {
      drawCanvas();
    }
  }, [imageSrc, blurAmount, darkenAmount]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Standard Instagram Reel / YT Shorts Resolution (1080 x 1920)
    const CANVAS_WIDTH = 1080;
    const CANVAS_HEIGHT = 1920;
    
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const img = new Image();
    img.onload = () => {
      // 1. Draw Blurred Background
      // Cover the entire canvas
      const scaleToCover = Math.max(CANVAS_WIDTH / img.width, CANVAS_HEIGHT / img.height);
      const bgWidth = img.width * scaleToCover;
      const bgHeight = img.height * scaleToCover;
      const bgX = (CANVAS_WIDTH - bgWidth) / 2;
      const bgY = (CANVAS_HEIGHT - bgHeight) / 2;

      ctx.filter = `blur(${blurAmount}px)`;
      ctx.drawImage(img, bgX, bgY, bgWidth, bgHeight);
      ctx.filter = 'none'; // Reset filter

      // 2. Add Dark Overlay for Better Contrast
      ctx.fillStyle = `rgba(0, 0, 0, ${darkenAmount / 100})`;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 3. Draw Original Image in Center (Contain)
      const scaleToContain = Math.min(CANVAS_WIDTH / img.width, CANVAS_HEIGHT / img.height);
      const fgWidth = img.width * scaleToContain;
      const fgHeight = img.height * scaleToContain;
      const fgX = (CANVAS_WIDTH - fgWidth) / 2;
      const fgY = (CANVAS_HEIGHT - fgHeight) / 2;

      // Draw shadow for the main image to make it pop
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 10;
      
      ctx.drawImage(img, fgX, fgY, fgWidth, fgHeight);
      
      // Reset shadow so it doesn't affect future drawings
      ctx.shadowColor = 'transparent';
    };
    img.src = imageSrc;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDownloading(true);
    
    // Convert high-res canvas to image URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    const link = document.createElement('a');
    link.download = `reel_fitted_${Date.now()}.jpg`;
    link.href = dataUrl;
    link.click();
    
    setIsDownloading(false);
  };

  return (
    <div className="w-full  bg-[#050505] text-white selection:bg-indigo-500/30 p-6 flex flex-col items-center relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-5%] right-[-5%] w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[40rem] h-[40rem] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-6xl pt-4 z-10">
        
        {/* Back Button */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel (Left) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 bg-[#111]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex flex-col gap-6"
          >
            {/* Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-indigo-500/50 bg-black/50 p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <Upload size={20} />
              </div>
              <span className="font-bold text-gray-200">{imageSrc ? 'Change Image' : 'Upload Image'}</span>
              <span className="text-xs text-gray-500 mt-2">Any ratio (Landscape, Square)</span>
            </div>

            {/* Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <label className="flex items-center gap-2"><Sliders size={16} /> Background Blur</label>
                  <span>{blurAmount}px</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={blurAmount} 
                  onChange={(e) => setBlurAmount(Number(e.target.value))} 
                  className="w-full accent-indigo-500" 
                  disabled={!imageSrc}
                />
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <label className="flex items-center gap-2"><Sliders size={16} /> Background Darken</label>
                  <span>{darkenAmount}%</span>
                </div>
                <input 
                  type="range" min="0" max="80" 
                  value={darkenAmount} 
                  onChange={(e) => setDarkenAmount(Number(e.target.value))} 
                  className="w-full accent-indigo-500" 
                  disabled={!imageSrc}
                />
              </div>
            </div>

            {/* Download Button */}
            <button 
              onClick={handleDownload}
              disabled={!imageSrc || isDownloading}
              className="mt-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white disabled:opacity-50 disabled:cursor-not-allowed w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              {isDownloading ? 'Generating HD Image...' : <><Download size={20} /> Download 9:16 HD</>}
            </button>
            <p className="text-xs text-center text-gray-500">Output: 1080 x 1920 (High Quality JPEG)</p>

          </motion.div>

          {/* Canvas Preview Panel (Right) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 bg-[#111]/50 backdrop-blur-md border border-white/5 p-4 rounded-3xl shadow-2xl flex flex-col items-center justify-center min-h-[500px]"
          >
            {!imageSrc ? (
              <div className="text-gray-600 flex flex-col items-center text-center">
                <ImageIcon size={64} className="mb-4 opacity-50" />
                <p className="text-lg font-medium text-gray-400">Live Render Preview</p>
                <p className="text-sm">Your cinematic 9:16 post will appear here</p>
              </div>
            ) : (
              <div className="relative rounded-[2rem] overflow-hidden border-8 border-gray-900 shadow-2xl bg-black max-w-[300px] sm:max-w-[340px] w-full">
                {/* 
                  Humne yahan actual canvas ko render kiya hai. 
                  Lekin isko CSS se scale down karke dikha rahe hain taaki screen pe fit aaye. 
                  Asli me iski size 1080x1920 hi hai.
                */}
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-auto aspect-[9/16]"
                />
              </div>
            )}
          </motion.div>

        </div>

</div>
    </div>
  );
}