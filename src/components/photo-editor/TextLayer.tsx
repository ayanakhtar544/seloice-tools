// File: src/components/photo-editor/TextLayer.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Type } from 'lucide-react';

// Type definition hum page.tsx jaisa hi rakhenge taaki sync rahe
export type TextLayerData = {
  id: string; text: string; x: number; y: number; fontSize: number; color: string; 
  fontFamily: string; fontWeight: string; opacity: number; rotation: number; 
  strokeColor: string; strokeWidth: number; backgroundColor: string;
};

interface TextLayerProps {
  layer: TextLayerData;
  containerRef: React.RefObject<HTMLDivElement>;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<TextLayerData>) => void;
}

export default function TextLayer({ layer, containerRef, isSelected, onSelect, onUpdate }: TextLayerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ clientX: 0, clientY: 0, layerX: 0, layerY: 0 });

  // 🖱️ SMART DRAG ENGINE (Runs on Window to prevent lag and frame drops)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate delta movement in percentages relative to the canvas container
      const deltaX = ((e.clientX - dragStart.clientX) / rect.width) * 100;
      const deltaY = ((e.clientY - dragStart.clientY) / rect.height) * 100;

      // Update position (Math.min/max ensures it doesn't fly infinitely out of screen)
      onUpdate({ 
        x: Math.min(Math.max(dragStart.layerX + deltaX, -20), 120), 
        y: Math.min(Math.max(dragStart.layerY + deltaY, -20), 120) 
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    // Cleanup listeners
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, containerRef, onUpdate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Canvas/Background ko click events lene se rokta hai
    onSelect();
    setDragStart({ clientX: e.clientX, clientY: e.clientY, layerX: layer.x, layerY: layer.y });
    setIsDragging(true);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`absolute cursor-move select-none transition-shadow duration-75 ${isSelected ? 'z-50' : 'z-10 hover:ring-1 hover:ring-white/30'}`}
      style={{
        left: `${layer.x}%`,
        top: `${layer.y}%`,
        transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
      }}
    >
      {/* 🎨 ADVANCED TEXT RENDERER */}
      <div 
         className="relative flex items-center justify-center whitespace-nowrap"
         style={{
            color: layer.color,
            fontSize: `${layer.fontSize}px`,
            fontFamily: layer.fontFamily,
            fontWeight: layer.fontWeight,
            opacity: layer.opacity / 100,
            WebkitTextStroke: layer.strokeWidth > 0 ? `${layer.strokeWidth}px ${layer.strokeColor}` : 'none',
            backgroundColor: layer.backgroundColor !== 'transparent' ? layer.backgroundColor : 'transparent',
            padding: layer.backgroundColor !== 'transparent' ? '12px 24px' : '0',
            borderRadius: layer.backgroundColor !== 'transparent' ? '16px' : '0',
         }}
      >
        {layer.text}
      </div>

      {/* 🟢 PHOTOSHOP STYLE SELECTION BOX */}
      {isSelected && (
        <div className="absolute inset-[-12px] border-2 border-emerald-500 pointer-events-none shadow-[0_0_15px_rgba(16,185,129,0.3)]">
           {/* Corner Nodes */}
           <div className="absolute top-[-6px] left-[-6px] w-3 h-3 bg-white border-2 border-emerald-500 rounded-full shadow-md" />
           <div className="absolute top-[-6px] right-[-6px] w-3 h-3 bg-white border-2 border-emerald-500 rounded-full shadow-md" />
           <div className="absolute bottom-[-6px] left-[-6px] w-3 h-3 bg-white border-2 border-emerald-500 rounded-full shadow-md" />
           <div className="absolute bottom-[-6px] right-[-6px] w-3 h-3 bg-white border-2 border-emerald-500 rounded-full shadow-md" />
           
           {/* Top Rotation Indicator Line */}
           <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 w-[2px] h-[30px] bg-emerald-500" />
           <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg pointer-events-auto cursor-pointer hover:scale-110 transition-transform">
              <Type size={12} className="text-white" />
           </div>
        </div>
      )}
    </div>
  );
}