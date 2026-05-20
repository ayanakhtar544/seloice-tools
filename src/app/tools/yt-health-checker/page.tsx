// File: src/app/tools/yt-health-checker/page.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolInterfaceShell from '@/components/seo/ToolInterfaceShell';

// 🛡️ BULLETPROOF ICONS (Ye crash nahi karenge)
const YoutubeIcon = ({ className, size }: { className?: string, size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>;
const AlertIcon = ({ className, size }: { className?: string, size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const SearchIcon = ({ className, size }: { className?: string, size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const LoaderIcon = ({ className, size }: { className?: string, size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>;
const FlameIcon = ({ className, size }: { className?: string, size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
const TargetIcon = ({ className, size }: { className?: string, size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const CalendarIcon = ({ className, size }: { className?: string, size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const CheckIcon = ({ className, size }: { className?: string, size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;

interface AuditData {
  meta: { channelName: string; channelAvatar: string; username: string; subscriberCount: number };
  stats: {
    score: number; status: 'HEALTHY' | 'MODERATE' | 'FROZEN'; message: string; dropPercentage: number; avgRecent: number; avgOlder: number;
    audit: { engagementRate: number; seoHealth: number; avgUploadGapDays: number; }
  };
}

export default function YTDeepAudit() {
  const [handle, setHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<AuditData | null>(null);

  const checkHealth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setIsLoading(true); setError(''); setData(null);

    try {
      const res = await fetch('/api/yt-health', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ handle }),
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
  if (data?.stats.status === 'FROZEN') ringColor = 'from-red-500 to-rose-600';
  else if (data?.stats.status === 'MODERATE') ringColor = 'from-yellow-400 to-orange-500';

  return (
    <ToolInterfaceShell className="max-w-5xl">
      <div className="w-full text-white font-sans py-10">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-800 p-[2px] rounded-2xl mx-auto mb-6 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            <div className="w-full h-full bg-[#0a0a0f] rounded-[14px] flex items-center justify-center">
              <YoutubeIcon size={28} className="text-red-400" />
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Channel <span className="text-red-500">Freeze</span> Checker</h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">AI-powered post-mortem of your YouTube channel. We analyze your algorithm health, engagement rate, and SEO to tell you exactly why your views are stuck.</p>
        </div>

        {/* INPUT */}
        <div className="bg-[#111] border border-white/10 rounded-3xl p-6 shadow-2xl max-w-2xl mx-auto mb-10">
          <form onSubmit={checkHealth} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus-within:border-red-500 transition-colors">
              <span className="text-zinc-500 font-bold mr-2">@</span>
              <input
                type="text" placeholder="YouTube Handle (e.g. MrBeast)" value={handle} onChange={(e) => setHandle(e.target.value)}
                className="w-full bg-transparent outline-none text-white placeholder:text-zinc-600 font-medium"
              />
            </div>
            <button disabled={isLoading || !handle} className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading ? <LoaderIcon className="animate-spin" size={18} /> : <SearchIcon size={18} />} Analyze
            </button>
          </form>
          {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm font-medium"><AlertIcon size={16} /> {error}</div>}
        </div>

        {/* PRO AUDIT DASHBOARD */}
        <AnimatePresence>
          {data && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* TOP PROFILE BAR */}
              <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl">
                 {/* 🔥 LOGO FIX: Added referrerPolicy="no-referrer" */}
                 <img src={data.meta.channelAvatar} referrerPolicy="no-referrer" className="w-20 h-20 object-cover rounded-full border-4 border-white/5 bg-zinc-900" alt="Channel Avatar" />
                 <div className="text-center md:text-left flex-1">
                   <h3 className="text-2xl font-black">{data.meta.channelName}</h3>
                   <p className="text-zinc-400 font-medium">{data.meta.username} • {formatNum(data.meta.subscriberCount)} Subscribers</p>
                 </div>
                 <div className="flex items-center justify-center gap-4 bg-black/50 px-6 py-4 rounded-2xl border border-white/5 w-full md:w-auto">
                   <div className="text-center">
                     <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Past Avg</p>
                     <p className="text-xl font-mono font-bold text-zinc-300">{formatNum(data.stats.avgOlder)}</p>
                   </div>
                   <div className="w-px h-10 bg-white/10" />
                   <div className="text-center">
                     <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Recent Avg</p>
                     <p className="text-xl font-mono font-bold text-white">{formatNum(data.stats.avgRecent)}</p>
                   </div>
                 </div>
              </div>

              {/* METRICS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. SPEEDOMETER (Algorithm Health) */}
                <div className="md:col-span-1 bg-[#111]/80 border border-white/10 rounded-[2rem] p-8 flex flex-col items-center justify-center relative shadow-xl overflow-hidden">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6 w-full text-center">Algorithm Health</h4>
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
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-opacity-10 ${data.stats.status === 'FROZEN' ? 'bg-red-500 border-red-500/30 text-red-400' : data.stats.status === 'MODERATE' ? 'bg-yellow-500 border-yellow-500/30 text-yellow-400' : 'bg-green-500 border-green-500/30 text-green-400'}`}>
                      {data.stats.status}
                    </span>
                  </div>
                </div>

                {/* 2. DEEP AUDIT CARDS */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Engagement Card */}
                  <div className="bg-[#111]/80 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
                     <FlameIcon size={80} className="absolute -right-6 -bottom-6 text-orange-500/10 group-hover:text-orange-500/20 transition-colors" />
                     <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">True Engagement Rate</h4>
                     <div className="text-3xl font-black mb-1">{data.stats.audit.engagementRate}%</div>
                     <p className="text-xs text-zinc-400 font-medium">
                       {data.stats.audit.engagementRate < 2 ? <span className="text-red-400">Poor (Dead Audience)</span> : data.stats.audit.engagementRate < 5 ? <span className="text-yellow-400">Average</span> : <span className="text-green-400">Excellent! High interaction.</span>}
                     </p>
                  </div>

                  {/* Upload Consistency */}
                  <div className="bg-[#111]/80 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
                     <CalendarIcon size={80} className="absolute -right-6 -bottom-6 text-blue-500/10 group-hover:text-blue-500/20 transition-colors" />
                     <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Upload Consistency</h4>
                     <div className="text-3xl font-black mb-1">{data.stats.audit.avgUploadGapDays} <span className="text-lg text-zinc-500 font-bold">days</span></div>
                     <p className="text-xs text-zinc-400 font-medium">
                       {data.stats.audit.avgUploadGapDays > 14 ? <span className="text-red-400">Too slow. Algorithm is forgetting you.</span> : <span className="text-green-400">Good consistency. Keep it up!</span>}
                     </p>
                  </div>

                  {/* SEO Health */}
                  <div className="bg-[#111]/80 border border-white/10 rounded-3xl p-6 sm:col-span-2 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                     <div>
                       <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2"><TargetIcon size={14}/> Metadata & SEO Health</h4>
                       <p className="text-sm text-zinc-300 font-medium max-w-sm">
                         {data.stats.audit.seoHealth < 50 ? "You are not using tags or long descriptions. Search engines can't find your videos." : "Your video descriptions and tags are well optimized for search."}
                       </p>
                     </div>
                     <div className="text-4xl font-black text-white">{data.stats.audit.seoHealth}%</div>
                  </div>

                </div>
              </div>

              {/* ACTION PLAN */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                 <h4 className="text-sm font-black uppercase tracking-widest text-white mb-3">Diagnostic Report</h4>
                 <p className="text-zinc-400 text-sm leading-relaxed mb-4">{data.stats.message}</p>
                 <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <span className="text-xs font-black uppercase tracking-widest text-red-400 block mb-1">Seloice Master Tip</span>
                    <p className="text-sm text-white font-medium">
                      {data.stats.status === 'FROZEN' 
                        ? `Your views dropped by ${data.stats.dropPercentage}%. Stop uploading long videos immediately. Post exactly 1 high-retention Short per day for a week to revive your impression graph.`
                        : data.stats.audit.engagementRate < 3 
                        ? `Your engagement (${data.stats.audit.engagementRate}%) is too low. Ask questions in your videos and reply to every single comment in the first 2 hours.` 
                        : "Everything looks solid. Double down on the thumbnail style of your most viewed recent video!"}
                    </p>
                 </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </ToolInterfaceShell>
  );
}