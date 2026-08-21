// File: src/app/tools/repo-auditor/RepoAuditorClient.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 🔥 Removed 'Github' and 'CheckCircle' from lucide-react to prevent Next.js import errors
import { Loader2, Copy, Check, FileCode2, Lock, Unlock, Key, ExternalLink } from 'lucide-react';
import ToolInterfaceShell from '@/components/seo/ToolInterfaceShell';

export default function RepoAuditorClient() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [userToken, setUserToken] = useState('');
  
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'DONE' | 'ERROR'>('IDLE');
  const [result, setResult] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const githubTokenUrl = "https://github.com/settings/tokens/new?scopes=repo&description=Seloice+Repo+Auditor";

  const startAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;

    setStatus('SCANNING');
    setErrorMsg('');
    setResult('');

    try {
      const res = await fetch('/api/repo-auditor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, userToken: isPrivate ? userToken : undefined })
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      setResult(data.result);
      setStatus('DONE');
    } catch (err: any) {
      setErrorMsg(err.message);
      setStatus('ERROR');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolInterfaceShell className="w-full max-w-5xl">
      <div className="w-full min-h-[85vh] bg-[#030305] text-white font-sans flex flex-col relative pb-10">
        
        <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
          <div className="absolute top-[-10%] w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen opacity-60" />
        </div>

        <div className="relative z-10 mx-auto px-4 pt-10 md:pt-16 w-full max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 uppercase drop-shadow-lg">
              REPO <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AUDITOR</span>
            </h2>
            <p className="text-zinc-400 font-medium text-sm md:text-base max-w-2xl mx-auto">
              Paste a GitHub link. Get a single LLM-optimized context file in seconds.
            </p>
          </div>

          <div className="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative">
            <form onSubmit={startAudit} className="space-y-6">
              
              {/* REPO URL INPUT */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                  {/* 🔥 Native GitHub SVG for Bulletproof Rendering */}
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  disabled={status === 'SCANNING'}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                  required
                />
              </div>

              {/* PRIVATE REPO TOGGLE */}
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setIsPrivate(!isPrivate)}>
                <div className={`p-2 rounded-lg ${isPrivate ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  {isPrivate ? <Lock size={18} /> : <Unlock size={18} />}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">Is this a Private Repository?</h4>
                  <p className="text-xs text-zinc-400">Turn this on if the repo is private or you hit a rate limit.</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isPrivate ? 'bg-indigo-500' : 'bg-zinc-700'}`}>
                  <motion.div 
                    layout 
                    className="w-4 h-4 bg-white rounded-full shadow-md"
                    animate={{ x: isPrivate ? 24 : 0 }}
                  />
                </div>
              </div>

              {/* API KEY FIELD (ANIMATED) */}
              <AnimatePresence>
                {isPrivate && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 pt-2">
                      <label className="flex items-center justify-between text-xs font-bold text-indigo-400 uppercase tracking-widest">
                        <span className="flex items-center gap-2"><Key size={16} /> Personal Access Token</span>
                      </label>
                      <input
                        type="password"
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxx"
                        value={userToken}
                        onChange={(e) => setUserToken(e.target.value)}
                        disabled={status === 'SCANNING'}
                        required={isPrivate}
                        className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                      />
                      
                      <a 
                        href={githubTokenUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 px-4 py-2 rounded-xl transition-colors border border-cyan-400/20"
                      >
                        <ExternalLink size={14} /> Get API Key (1-Click Setup)
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SUBMIT BUTTON */}
              <button 
                type="submit" 
                disabled={status === 'SCANNING' || !repoUrl}
                className="w-full py-5 mt-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-black uppercase tracking-widest text-sm shadow-[0_8px_0_0_#3730a3] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {status === 'SCANNING' ? <><Loader2 className="animate-spin" size={20} /> ANALYZING CODEBASE...</> : <><FileCode2 size={20} /> GENERATE CONTEXT PACK</>}
              </button>
            </form>

            {/* ERROR UI */}
            {status === 'ERROR' && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-mono text-center">
                {errorMsg}
              </div>
            )}

            {/* RESULT UI */}
            {status === 'DONE' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">Audit Complete</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Ready for ChatGPT/Claude</span>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 text-sm font-bold bg-white text-black hover:bg-zinc-200 px-5 py-2.5 rounded-xl transition-transform hover:scale-105 active:scale-95"
                  >
                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    {copied ? 'COPIED TO CLIPBOARD' : 'COPY CONTEXT'}
                  </button>
                </div>
                <textarea 
                  readOnly 
                  value={result}
                  className="w-full h-[450px] bg-[#050505] border border-white/5 rounded-2xl p-5 text-green-400 font-mono text-xs resize-none focus:outline-none custom-scrollbar shadow-inner"
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </ToolInterfaceShell>
  );
}