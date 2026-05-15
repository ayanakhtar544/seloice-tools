// File: src/app/tools/grid-maker/page.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Grid3X3, Upload, Download, Image as ImageIcon, LayoutGrid, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type GridType = '3x1' | '3x2' | '3x3';

export default function GridMakerClient() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [gridType, setGridType] = useState<GridType>('3x3');
  const [gridPieces, setGridPieces] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Jab bhi image ya grid layout change ho, auto-split kardo
  useEffect(() => {
    if (imageSrc) {
      splitImage();
    }
  }, [imageSrc, gridType]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGridPieces([]);
    setImageSrc(URL.createObjectURL(file));
  };

  const splitImage = () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const rows = parseInt(gridType.split('x')[1]);
      const cols = 3; // Instagram hamesha 3 columns ka hota hai
      
      // Perfect square aspect ratio nikalne ke liye width/height adjust karte hain
      // Instagram grids ke liye original image ko crop karna padta hai center se
      const targetRatio = cols / rows;
      const originalRatio = img.width / img.height;
      
      let startX = 0, startY = 0, drawWidth = img.width, drawHeight = img.height;

      // Center Crop Logic
      if (originalRatio > targetRatio) {
        // Image zyada wide hai
        drawWidth = img.height * targetRatio;
        startX = (img.width - drawWidth) / 2;
      } else {
        // Image zyada lambi hai
        drawHeight = img.width / targetRatio;
        startY = (img.height - drawHeight) / 2;
      }

      const pieceWidth = drawWidth / cols;
      const pieceHeight = drawHeight / rows;
      
      const pieces: string[] = [];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      // Canvas ka resolution high rakhne ke liye size badhate hain
      canvas.width = pieceWidth;
      canvas.height = pieceHeight;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Clear previous drawing
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw specific chunk
          ctx.drawImage(
            img,
            startX + (c * pieceWidth), startY + (r * pieceHeight), pieceWidth, pieceHeight, // Source (Image se uthana)
            0, 0, pieceWidth, pieceHeight // Destination (Canvas par kahan aur kitna bada lagana hai)
          );
          
          pieces.push(canvas.toDataURL('image/jpeg', 0.95)); // High quality JPEG
        }
      }

      setGridPieces(pieces);
      setIsProcessing(false);
    };
    img.src = imageSrc;
  };

  // Har piece ko ek saath download karne ka function
  const downloadAll = () => {
    gridPieces.forEach((piece, index) => {
      // Thoda delay de rahe hain taaki browser ek sath multiple downloads ko block na kare
      setTimeout(() => {
        const link = document.createElement('a');
        link.download = `grid_piece_${index + 1}.jpg`;
        link.href = piece;
        link.click();
      }, index * 200); 
    });
  };

  const getGridColsClass = () => 'grid-cols-3'; // Instagram is always 3 columns

  return (
    <div className="w-full  bg-[#050505] text-white selection:bg-orange-500/30 p-6 flex flex-col items-center relative overflow-hidden">
      
      {/* Background Orbs (Instagram Theme) */}
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-6xl pt-4 z-10">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 bg-[#111]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex flex-col gap-6"
          >
            {/* Upload Box */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-orange-500/50 bg-black/50 p-8 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500/20 to-orange-500/20 text-orange-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:text-white transition-all">
                <Upload size={28} />
              </div>
              <span className="font-bold text-lg text-gray-200 mb-1">{imageSrc ? 'Change Image' : 'Upload Image'}</span>
              <span className="text-sm text-gray-500">Supports JPG, PNG</span>
            </div>

            {/* Layout Options */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                <LayoutGrid size={16} /> Select Grid Layout
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['3x1', '3x2', '3x3'] as GridType[]).map((type) => (
                  <button 
                    key={type}
                    onClick={() => setGridType(type)}
                    className={`py-4 rounded-xl font-bold transition-all border ${gridType === type ? 'bg-gradient-to-r from-fuchsia-500 to-orange-500 text-white border-transparent shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Hint Box */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex gap-3 text-sm text-orange-200">
              <AlertCircle size={20} className="text-orange-400 flex-shrink-0" />
              <p>For the best results, upload high-resolution images. The tool will automatically center-crop your image to fit the perfect Instagram aspect ratio.</p>
            </div>

            {/* Download Button */}
            <button 
              onClick={downloadAll}
              disabled={gridPieces.length === 0}
              className="mt-2 bg-white hover:bg-gray-200 text-black disabled:opacity-50 disabled:cursor-not-allowed w-full py-4 rounded-xl font-extrabold text-lg transition-all flex items-center justify-center gap-2"
            >
              <Download size={22} /> Download All Pieces
            </button>

          </motion.div>

          {/* Preview Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 bg-[#111]/50 backdrop-blur-md border border-white/5 p-6 rounded-3xl shadow-2xl flex flex-col items-center justify-center min-h-[500px]"
          >
            {gridPieces.length === 0 ? (
              <div className="text-gray-600 flex flex-col items-center text-center">
                <ImageIcon size={64} className="mb-4 opacity-50" />
                <p className="text-lg font-medium text-gray-400">Grid Preview</p>
                <p className="text-sm">Upload an image to see your sliced grid</p>
              </div>
            ) : (
              <div className="w-full max-w-[400px] flex flex-col items-center">
                <h3 className="text-gray-400 font-bold mb-6 uppercase tracking-widest text-sm flex items-center gap-2">
                  <Grid3X3 size={16} /> Instagram Preview
                </h3>
                
                {/* Visual Grid Container */}
                <div className={`grid ${getGridColsClass()} gap-1 bg-black border-4 border-black w-full rounded-lg overflow-hidden shadow-2xl`}>
                  <AnimatePresence>
                    {gridPieces.map((piece, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="aspect-square relative group overflow-hidden bg-gray-900 cursor-pointer"
                        title="Click to download this specific piece"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.download = `grid_piece_${index + 1}.jpg`;
                          link.href = piece;
                          link.click();
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={piece} alt={`Piece ${index + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        
                        {/* Hover Number Indicator */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white font-extrabold text-2xl">#{index + 1}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                <p className="text-gray-500 mt-6 text-sm text-center">
                  Tip: Upload to Instagram in reverse order (Start with the last piece) so the top-left piece uploads last.
                </p>
              </div>
            )}
          </motion.div>

        </div>

</div>
    </div>
  );
}