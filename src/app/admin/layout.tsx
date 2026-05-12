import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, FileText, Settings, LogOut, ShieldAlert } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col hidden md:flex h-screen sticky top-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-black italic text-xl flex items-center gap-2">
            <ShieldAlert className="text-indigo-500" />
            SELOICE<span className="text-indigo-500">ADMIN</span>
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold text-sm">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white font-medium text-sm transition-colors">
            <FileText size={18} /> All Posts
          </Link>
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white font-medium text-sm transition-colors opacity-50 cursor-not-allowed">
            <Settings size={18} /> SEO Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 font-medium text-sm transition-colors">
            <LogOut size={18} /> Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
