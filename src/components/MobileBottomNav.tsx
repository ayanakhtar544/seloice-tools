"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Video, Download, Sparkles, User } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Editor', icon: Video, href: '/tools/video-editor' },
  { label: 'Download', icon: Download, href: '/tools/yt-downloader' },
  { label: 'AI Tools', icon: Sparkles, href: '/tools#ai' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-xl border-t border-white/10 px-6 py-3 safe-area-bottom">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-indigo-400' : 'text-zinc-500'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
