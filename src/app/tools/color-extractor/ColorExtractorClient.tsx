// File: src/app/tools/color-extractor/page.tsx
"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, Palette, Copy, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ColorExtractorClient() {
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

</div>
    </div>
  );
}