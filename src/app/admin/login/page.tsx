'use client';

import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication failed.');
        return;
      }
      router.push('/admin');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-10 relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Admin Terminal</h1>
          <p className="text-zinc-500 text-sm font-medium">Set ADMIN_SECRET in your environment</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Access Key</label>
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-zinc-700 outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs font-bold"
            >
              <AlertTriangle size={16} />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full bg-white text-black font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAuthenticating ? 'Authenticating...' : 'Authenticate'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-600">
            <Lock size={12} /> HttpOnly session cookie
          </div>
        </div>
      </motion.div>
    </div>
  );
}
