"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Video, Download, Sparkles } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Editor', icon: Video, href: '/tools/video-editor' },
  { label: 'Download', icon: Download, href: '/tools/yt-downloader' },
  { label: 'AI Tools', icon: Sparkles, href: '/tools' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[120] border-t border-white/10 bg-black/88 backdrop-blur-xl safe-area-bottom">
      <div className="safe-area-x mx-auto flex min-h-[76px] max-w-md items-center justify-between gap-2 px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[52px] min-w-[68px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-center transition-all ${
                isActive
                  ? 'bg-white/8 text-indigo-300'
                  : 'text-zinc-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
              {isActive && <div className="mt-0.5 h-1 w-1 rounded-full bg-indigo-400" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
