// File: src/app/tools/video-editor/VideoEditorClient.tsx
"use client";

import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const Editor = dynamic(
  () => import('./components/Editor'),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
);

function EditorSkeleton() {
  return (
    <div className="h-[100dvh] w-screen bg-[#060609] flex flex-col items-center justify-center fixed inset-0 z-[999]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-violet-500/30">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <div className="absolute -inset-2 rounded-3xl border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
        </div>
        <div className="text-center mt-2">
          <h2 className="text-sm font-bold text-zinc-300">Loading Seloice Editor</h2>
          <p className="text-[11px] text-zinc-600 mt-1">Initializing editing engine...</p>
        </div>
      </div>
    </div>
  );
}

export default function VideoEditorClient() {
  // 🚀 THE FIX: Lock body scroll AND hide Global Navbar/Footer
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';

    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.style.overflow = '';
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#060609]">
      <Editor />
    </div>
  );
}