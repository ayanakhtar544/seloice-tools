// File: src/app/tools/qr-generator/page.tsx
"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Link as LinkIcon, Palette, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QrGeneratorClient() {
  const [url, setUrl] = useState('https://ansaribhaiya.com');
  const [fgColor, setFgColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#000000');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUrl(URL.createObjectURL(file));
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `branded_qr_${Date.now()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2000);
  };

  return (
    <div className="w-full  bg-[#050505] text-white selection:bg-yellow-500/30 p-6 flex flex-col items-center relative overflow-hidden">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-yellow-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-amber-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-6xl pt-4 z-10">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 bg-[#111]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex flex-col gap-6"
          >
            {/* Link Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                <LinkIcon size={16} /> Destination URL
              </label>
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-black/50 border border-white/10 focus:border-yellow-500/50 rounded-xl px-4 py-3 text-white outline-none transition-colors"
                placeholder="https://your-link.com"
              />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <Palette size={16} /> QR Color
                </label>
                <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-xl p-2">
                  <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />
                  <span className="text-sm font-mono uppercase">{fgColor}</span>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <Palette size={16} /> Background
                </label>
                <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-xl p-2">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />
                  <span className="text-sm font-mono uppercase">{bgColor}</span>
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                <ImageIcon size={16} /> Center Logo (Optional)
              </label>
              <div 
                onClick={() => logoInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-yellow-500/50 bg-black/50 p-4 rounded-xl flex items-center justify-center cursor-pointer transition-all group"
              >
                <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                {logoUrl ? (
                  <span className="font-bold text-yellow-400">Logo Selected (Click to change)</span>
                ) : (
                  <span className="text-gray-400 group-hover:text-white transition-colors">Click to upload brand logo</span>
                )}
              </div>
              {logoUrl && (
                <button onClick={() => setLogoUrl(null)} className="text-xs text-red-400 mt-2 hover:underline">Remove Logo</button>
              )}
            </div>

          </motion.div>

          {/* Preview Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 bg-[#111]/50 backdrop-blur-md border border-white/5 p-6 rounded-3xl shadow-2xl flex flex-col items-center justify-center min-h-[400px]"
          >
            <div 
              className="p-4 rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.1)] transition-all duration-300 mb-8"
              style={{ backgroundColor: bgColor }}
            >
              <div ref={qrRef} className="bg-white p-2 rounded-xl flex items-center justify-center">
                <QRCodeCanvas 
                  value={url || 'https://ansaribhaiya.com'} 
                  size={250} 
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level="H" // High error correction level for logo rendering
                  imageSettings={logoUrl ? {
                    src: logoUrl,
                    x: undefined,
                    y: undefined,
                    height: 50,
                    width: 50,
                    excavate: true, // Digs a hole in the QR for the logo
                  } : undefined}
                />
              </div>
            </div>

            <button 
              onClick={handleDownload}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black w-full max-w-[300px] py-4 rounded-xl font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
            >
              {isDownloaded ? <><CheckCircle2 size={20} /> Downloaded!</> : <><Download size={20} /> Download HD QR Code</>}
            </button>

          </motion.div>

        </div>

</div>
    </div>
  );
}