// File: src/components/photo-editor/CropOverlay.tsx
"use client";

import React, { useState, useEffect } from 'react';

interface CropBox {
  x: number; y: number; width: number; height: number;
}

interface CropOverlayProps {
  cropBox: CropBox;
  setCropBox: (box: CropBox) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function CropOverlay({ cropBox, setCropBox, containerRef }: CropOverlayProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ clientX: 0, clientY: 0, box: cropBox });

  // 📏 THE RESIZE & MOVE ENGINE
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragType || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      const dx = ((e.clientX - dragStart.clientX) / rect.width) * 100;
      const dy = ((e.clientY - dragStart.clientY) / rect.height) * 100;

      let newBox = { ...dragStart.box };

      // Free Move Math
      if (dragType === 'move') {
        newBox.x = Math.min(Math.max(dragStart.box.x + dx, 0), 100 - newBox.width);
        newBox.y = Math.min(Math.max(dragStart.box.y + dy, 0), 100 - newBox.height);
      } 
      // Resizing Math (The Hard Part!)
      else {
        if (dragType.includes('w')) {
          const change = Math.min(dx, dragStart.box.width - 5); // Minimum width 5%
          newBox.x = Math.max(dragStart.box.x + change, 0);
          newBox.width = dragStart.box.width - (newBox.x - dragStart.box.x);
        }
        if (dragType.includes('e')) {
          newBox.width = Math.min(Math.max(dragStart.box.width + dx, 5), 100 - newBox.x);
        }
        if (dragType.includes('n')) {
          const change = Math.min(dy, dragStart.box.height - 5);
          newBox.y = Math.max(dragStart.box.y + change, 0);
          newBox.height = dragStart.box.height - (newBox.y - dragStart.box.y);
        }
        if (dragType.includes('s')) {
          newBox.height = Math.min(Math.max(dragStart.box.height + dy, 5), 100 - newBox.y);
        }
      }

      setCropBox(newBox);
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragType, dragStart, containerRef, setCropBox]);

  const handleMouseDown = (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragType(type);
    setDragStart({ clientX: e.clientX, clientY: e.clientY, box: cropBox });
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      
      {/* 🌑 DARKENED OUTSIDE AREA */}
      <div className="absolute inset-0 bg-black/60" style={{ clipPath: `polygon(0% 0%, 0% 100%, ${cropBox.x}% 100%, ${cropBox.x}% ${cropBox.y}%, ${cropBox.x + cropBox.width}% ${cropBox.y}%, ${cropBox.x + cropBox.width}% ${cropBox.y + cropBox.height}%, ${cropBox.x}% ${cropBox.y + cropBox.height}%, ${cropBox.x}% 100%, 100% 100%, 100% 0%)` }} />

      {/* ✂️ THE ACTIVE CROP BOX */}
      <div 
        className="absolute border border-white/50 shadow-[0_0_20px_rgba(0,0,0,0.5)] pointer-events-auto cursor-move flex flex-col"
        style={{ left: `${cropBox.x}%`, top: `${cropBox.y}%`, width: `${cropBox.width}%`, height: `${cropBox.height}%` }}
        onMouseDown={(e) => handleMouseDown(e, 'move')}
      >
        {/* 📐 RULE OF THIRDS GRID (Instagram Style) */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border-2 border-white/80">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="border border-white/20" />
          ))}
        </div>

        {/* 🎛️ RESIZE HANDLES (The White Thick Corners & Edges) */}
        <div onMouseDown={(e) => handleMouseDown(e, 'nw')} className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white -translate-x-1 -translate-y-1 cursor-nwse-resize" />
        <div onMouseDown={(e) => handleMouseDown(e, 'ne')} className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white translate-x-1 -translate-y-1 cursor-nesw-resize" />
        <div onMouseDown={(e) => handleMouseDown(e, 'sw')} className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white -translate-x-1 translate-y-1 cursor-nesw-resize" />
        <div onMouseDown={(e) => handleMouseDown(e, 'se')} className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white translate-x-1 translate-y-1 cursor-nwse-resize" />
        
        {/* Middle Edge Handles */}
        <div onMouseDown={(e) => handleMouseDown(e, 'n')} className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-white/0 hover:bg-white/50 -translate-y-1 cursor-ns-resize" />
        <div onMouseDown={(e) => handleMouseDown(e, 's')} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-white/0 hover:bg-white/50 translate-y-1 cursor-ns-resize" />
        <div onMouseDown={(e) => handleMouseDown(e, 'w')} className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-8 bg-white/0 hover:bg-white/50 -translate-x-1 cursor-ew-resize" />
        <div onMouseDown={(e) => handleMouseDown(e, 'e')} className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-8 bg-white/0 hover:bg-white/50 translate-x-1 cursor-ew-resize" />
      </div>

    </div>
  );
}