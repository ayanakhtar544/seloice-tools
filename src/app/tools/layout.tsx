import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 overflow-x-hidden flex flex-col">
      {/* FLOATING BACKGROUND EFFECTS (consistent with main page) */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute top-[-20%] left-[-10%] w-[60rem] h-[60rem] bg-indigo-600/10 rounded-full blur-[150px] opacity-70 mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-pink-600/10 rounded-full blur-[150px] opacity-70 mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <Navbar />

      <main className="flex-grow pt-32 pb-20 relative z-10 px-4 md:px-6 w-full max-w-[1440px] mx-auto">
        {children}
      </main>

      <Footer />
    </div>
  );
}
