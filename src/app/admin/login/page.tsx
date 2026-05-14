// File: src/app/admin/login/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🔑 Fetching password from Environment Variables
    const securePass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (password === securePass) {
      // Success: Set secure cookie
      document.cookie = "admin_access=true; path=/; max-age=86400; SameSite=Strict"; 
      router.push('/admin');
      router.refresh(); 
    } else {
      setError(true);
      setPassword(''); // Clear input on error
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] flex items-center justify-center p-6 font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/[0.02] border border-white/10 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <Lock size={32} className="text-emerald-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">ADMIN <span className="text-emerald-500">LOCK</span></h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Environment Protected</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input 
              type="password" 
              placeholder="Enter Admin Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-black border ${error ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10'} p-5 rounded-2xl text-center font-bold text-white outline-none focus:border-emerald-500 transition-all placeholder:text-gray-800`}
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-white transition-all shadow-[0_10px_30px_rgba(16,185,129,0.2)] active:scale-95"
          >
            Access Dashboard <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-gray-600">
           <ShieldCheck size={14} />
           <p className="text-[10px] font-black uppercase tracking-widest">Vars loaded via .env.local</p>
        </div>
      </motion.div>
    </div>
  );
}