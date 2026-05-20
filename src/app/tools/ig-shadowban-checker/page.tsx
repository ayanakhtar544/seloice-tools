'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolInterfaceShell from '@/components/seo/ToolInterfaceShell';

// 🛡️ BULLETPROOF PRO ICONS
const InstagramIcon = ({ className, size }: { className?: string, size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const AlertIcon = ({ className, size }: { className?: string, size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const SearchIcon = ({ className, size }: { className?: string, size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const LoaderIcon = ({ className, size }: { className?: string, size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>;
const ShieldAlertIcon = ({ className, size }: { className?: string, size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const BadgeCheckIcon = ({ className, size }: { className?: string, size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>;
const UsersIcon = ({ className, size }: { className?: string, size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ImageIcon = ({ className, size }: { className?: string, size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
const FingerprintIcon = ({ className, size }: { className?: string, size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M8.65 22c.21-.66.45-1.32.57-2"/><path d="M11.5 3a8 8 0 0 0-5 13"/><path d="M15.5 3a8 8 0 0 1 5 13"/><path d="M12 22a8 8 0 0 1-5-13"/><path d="M18.5 22c-.21-.66-.45-1.32-.57-2"/><path d="M14.5 19.5c-.5-1.5-1-4.5-1-7.5a6 6 0 0 0-.34-2"/></svg>;

interface ShadowbanData {
  meta: { 
    username: string; fullName: string; avatar: string; followers: number;
    following: number; mediaCount: number; isVerified: boolean; accountId: string; hasFbLinked: boolean;
  };
  stats: {
    score: number; status: 'HEALTHY' | 'RESTRICTED' | 'SHADOWBANNED'; message: string; 
    engagementRate: number; avgLikes: number; followRatio: number;
  };
}

export default function IGShadowbanChecker() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<ShadowbanData | null>(null);

  const checkStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true); setError(''); setData(null);

    try {
      const res = await fetch('/api/ig-shadowban', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Audit failed');
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNum = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const rotation = data ? (data.stats.score / 100) * 180 - 90 : -90;
  let ringColor = 'from-green-500 to-emerald-600';
  if (data?.stats.status === 'SHADOWBANNED') ringColor = 'from-red-500 to-rose-600';
  else if (data?.stats.status === 'RESTRICTED') ringColor = 'from-yellow-400 to-orange-500';

  return (
    <ToolInterfaceShell className="max-w-5xl">
      <div className="w-full text-white font-sans py-10">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px] rounded-2xl mx-auto mb-6 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
            <div className="w-full h-full bg-[#0a0a0f] rounded-[14px] flex items-center justify-center">
              <InstagramIcon size={28} className="text-pink-500" />
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">IG <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Deep Audit</span></h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">Complete post-mortem of your Instagram profile. We analyze your trust signals, follower ratio, and algorithmic health.</p>
        </div>

        {/* INPUT */}
        <div className="bg-[#111] border border-white/10 rounded-3xl p-6 shadow-2xl max-w-2xl mx-auto mb-10">
          <form onSubmit={checkStatus} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus-within:border-pink-500 transition-colors">
              <span className="text-zinc-500 font-bold mr-2">@</span>
              <input
                type="text" placeholder="Instagram Username (e.g. therock)" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent outline-none text-white placeholder:text-zinc-600 font-medium"
              />
            </div>
            <button disabled={isLoading || !username} className="bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading ? <LoaderIcon className="animate-spin" size={18} /> : <SearchIcon size={18} />} Run Audit
            </button>
          </form>
          {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm font-medium"><AlertIcon size={16} /> {error}</div>}
        </div>

        {/* AUDIT DASHBOARD */}
        <AnimatePresence>
          {data && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* TOP PROFILE BAR */}
              <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl">
                 <img 
                    src={data.meta.avatar} 
                    key={data.meta.avatar} 
                    className="w-20 h-20 object-cover rounded-full border-4 border-white/5 bg-zinc-900 shadow-xl" 
                    alt="Instagram Profile Avatar" 
                 /> 
                 <div className="text-center md:text-left flex-1">
                   <h3 className="text-2xl font-black flex items-center justify-center md:justify-start gap-2">
                     {data.meta.fullName} 
                     {data.meta.isVerified && <BadgeCheckIcon size={22} className="text-blue-500 fill-blue-500/20" />}
                   </h3>
                   <p className="text-zinc-400 font-medium">@{data.meta.username}</p>
                 </div>
                 <div className="flex flex-wrap justify-center gap-3 bg-black/50 px-6 py-4 rounded-2xl border border-white/5 w-full md:w-auto">
                   <div className="text-center px-2">
                     <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Followers</p>
                     <p className="text-lg font-mono font-bold text-white">{formatNum(data.meta.followers)}</p>
                   </div>
                   <div className="w-px h-10 bg-white/10 hidden sm:block" />
                   <div className="text-center px-2">
                     <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Following</p>
                     <p className="text-lg font-mono font-bold text-zinc-300">{formatNum(data.meta.following)}</p>
                   </div>
                   <div className="w-px h-10 bg-white/10 hidden sm:block" />
                   <div className="text-center px-2">
                     <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Est. Likes</p>
                     <p className="text-lg font-mono font-bold text-pink-400">{formatNum(data.stats.avgLikes)}</p>
                   </div>
                 </div>
              </div>

              {/* METRICS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. SPEEDOMETER (Account Trust Score) */}
                <div className="md:col-span-1 bg-[#111]/80 border border-white/10 rounded-[2rem] p-8 flex flex-col items-center justify-center relative shadow-xl overflow-hidden">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6 w-full text-center">Account Trust Score</h4>
                  <div className="relative w-48 h-24 flex justify-center overflow-hidden shrink-0">
                    <div className="absolute top-0 w-48 h-48 rounded-full border-[20px] border-white/5" />
                    <div className="absolute top-0 w-48 h-48 rounded-full border-[20px] border-transparent border-t-white/80 border-l-white/80 opacity-20 -rotate-45" />
                    <motion.div initial={{ rotate: -90 }} animate={{ rotate: rotation }} transition={{ type: "spring", damping: 15 }} className="absolute bottom-0 w-1.5 h-24 origin-bottom z-10">
                      <div className="w-1.5 h-12 bg-white rounded-t-full shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                    </motion.div>
                    <div className={`absolute bottom-[-10px] w-5 h-5 rounded-full bg-gradient-to-br ${ringColor} border-[3px] border-[#111] z-20`} />
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-4xl font-black drop-shadow-md mb-1">{data.stats.score}</div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-opacity-10 ${data.stats.status === 'SHADOWBANNED' ? 'bg-red-500 border-red-500/30 text-red-400' : data.stats.status === 'RESTRICTED' ? 'bg-yellow-500 border-yellow-500/30 text-yellow-400' : 'bg-green-500 border-green-500/30 text-green-400'}`}>
                      {data.stats.status}
                    </span>
                  </div>
                </div>

                {/* 2. DEEP DATA INSIGHTS */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Media & Activity */}
                  <div className="bg-[#111]/80 border border-white/10 rounded-3xl p-5 flex items-center gap-4">
                    <div className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl"><ImageIcon size={24} /></div>
                    <div>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Total Posts (Media)</p>
                      <p className="text-2xl font-black">{data.meta.mediaCount} <span className="text-sm font-medium text-zinc-400">Posts</span></p>
                    </div>
                  </div>

                  {/* Follow Ratio */}
                  <div className={`bg-[#111]/80 border rounded-3xl p-5 flex items-center gap-4 ${data.stats.followRatio < 0.5 && data.meta.following > 1000 ? 'border-red-500/40' : 'border-white/10'}`}>
                    <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl"><UsersIcon size={24} /></div>
                    <div>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Follow Ratio</p>
                      <p className="text-2xl font-black">{data.stats.followRatio}</p>
                    </div>
                  </div>

                  {/* Trust Signals */}
                  <div className="bg-[#111]/80 border border-white/10 rounded-3xl p-5 sm:col-span-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">Backend Trust Signals</h4>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 bg-black/50 border border-white/5 px-3 py-2 rounded-xl text-sm font-medium">
                        <FingerprintIcon size={16} className="text-zinc-500" /> 
                        <span className="text-zinc-400">ID:</span> {data.meta.accountId}
                      </div>
                      <div className={`flex items-center gap-2 border px-3 py-2 rounded-xl text-sm font-medium ${data.meta.isVerified ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-black/50 border-white/5 text-zinc-400'}`}>
                        <BadgeCheckIcon size={16} /> {data.meta.isVerified ? 'Verified Account' : 'Not Verified'}
                      </div>
                      <div className={`flex items-center gap-2 border px-3 py-2 rounded-xl text-sm font-medium ${data.meta.hasFbLinked ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'}`}>
                        {data.meta.hasFbLinked ? 'Linked to Facebook' : 'No Facebook Link'}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* ACTION PLAN */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                 <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-xl p-4 flex items-start gap-3">
                    <ShieldAlertIcon className="text-pink-400 shrink-0 mt-0.5" size={20} />
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-pink-400 block mb-1">Algorithmic Report</span>
                      <p className="text-sm text-white font-medium">{data.stats.message}</p>
                    </div>
                 </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </ToolInterfaceShell>
  );
}