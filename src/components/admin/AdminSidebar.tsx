// File: src/components/admin/AdminSidebar.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, PlusCircle, LogOut, Home } from 'lucide-react';

const MENU_ITEMS = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, href: '/admin' },
  { name: 'All Blogs', icon: <FileText size={20}/>, href: '/admin/blogs' },
  { name: 'Add New Blog', icon: <PlusCircle size={20}/>, href: '/admin/blogs/new' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full md:w-64 md:h-screen bg-[#0a0a0f] border-b md:border-b-0 md:border-r border-white/5 flex flex-col p-4 md:p-6 md:sticky md:top-0 shrink-0">
      <div className="mb-4 md:mb-10 flex items-center gap-3">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <span className="text-black font-black italic">S</span>
        </div>
        <h2 className="text-xl font-black italic tracking-tighter uppercase">ADMIN <span className="text-emerald-500">HQ</span></h2>
      </div>

      <nav className="flex-1 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-2">
        {MENU_ITEMS.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${pathname === item.href ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="pt-4 md:pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
        <Link href="/" className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-emerald-400 transition-all font-bold text-sm rounded-xl hover:bg-white/5">
            <Home size={20}/> View Website
        </Link>
        <button className="flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm w-full text-left">
            <LogOut size={20}/> Logout
        </button>
      </div>
    </div>
  );
}
