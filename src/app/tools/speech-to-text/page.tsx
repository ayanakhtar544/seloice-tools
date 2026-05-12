// File: src/app/tools/speech-to-text/page.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, UploadCloud, FileAudio, Play, Pause, Copy, CheckCircle2, Waves, StopCircle } from 'lucide-react';
import Link from 'next/link';

export default function SpeechToText() {
  const [activeTab, setActiveTab] = useState<'upload' | 'live'>('upload');
  
  // MP3 Upload State
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live Mic State
  const [isListening, setIsListening] = useState(false);
  const [liveText, setLiveText] = useState('');
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition for Live Mic
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setLiveText(prev => prev + " " + currentTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };
      }
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setAudioFile(file);
    setAudioUrl(URL.createObjectURL(file));
    setTranscribedText('');
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Naya handleTranscribe function
  const handleTranscribe = async () => {
    if (!audioFile) return;
    setIsTranscribing(true);
    setTranscribedText('Processing... Ek second ruko bhai, Groq AI magic kar raha hai 🚀');

    try {
      // File ko API tak bhejne ke liye prepare kar rahe hain
      const formData = new FormData();
      formData.append('file', audioFile);

      // Hamare khud ke backend (/api/transcribe) ko call kar rahe hain
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setTranscribedText(data.text);
      } else {
        setTranscribedText("Error aagaya: " + data.error);
      }
    } catch (error) {
      setTranscribedText("Network error bhai, file transcribe nahi ho payi.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const toggleLiveMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setLiveText('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full  bg-[#050505] text-white selection:bg-purple-500/30 p-6 flex flex-col items-center relative overflow-hidden">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-5%] left-[-5%] w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-5xl pt-4 z-10">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors mb-8 group w-fit">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Tools</span>
        </Link>

        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl mb-6 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
            <Waves size={36} className="text-purple-400" />
          </div>
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            AI <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">Transcriber</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Convert your MP3 audio files or live speech into text instantly. Perfect for generating captions, subtitles, or meeting notes.
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#111] border border-white/10 p-1 rounded-2xl flex gap-1">
            <button 
              onClick={() => setActiveTab('upload')}
              className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'upload' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:text-white'}`}
            >
              <UploadCloud size={20} /> Upload MP3
            </button>
            <button 
              onClick={() => setActiveTab('live')}
              className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'live' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:text-white'}`}
            >
              <Mic size={20} /> Live Dictation
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Panel - Input Controls */}
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#111]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex flex-col h-full"
          >
            {activeTab === 'upload' ? (
              <div className="flex flex-col h-full justify-center">
                {!audioFile ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 hover:border-purple-500/50 bg-black/50 p-10 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group h-full min-h-[300px]"
                  >
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*" className="hidden" />
                    <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all">
                      <FileAudio size={32} />
                    </div>
                    <span className="font-bold text-xl text-gray-200 mb-2">Upload Audio File</span>
                    <span className="text-sm text-gray-500">Supports MP3, WAV, M4A</span>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="bg-black/50 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center mb-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent"></div>
                      <FileAudio size={48} className="text-purple-400 mb-4 relative z-10" />
                      <h3 className="font-bold text-lg mb-1 relative z-10 truncate w-full px-4">{audioFile.name}</h3>
                      <p className="text-gray-500 text-sm relative z-10 mb-6">Ready to transcribe</p>
                      
                      {/* Audio Player Controls */}
                      <audio ref={audioRef} src={audioUrl!} onEnded={() => setIsPlaying(false)} className="hidden" />
                      <button 
                        onClick={togglePlay}
                        className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform relative z-10"
                      >
                        {isPlaying ? <Pause size={24} className="fill-black" /> : <Play size={24} className="fill-black ml-1" />}
                      </button>
                    </div>

                    <button 
                      onClick={handleTranscribe}
                      disabled={isTranscribing}
                      className="mt-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                    >
                      {isTranscribing ? <><Waves className="animate-pulse" size={20} /> Extracting Text...</> : 'Transcribe Audio'}
                    </button>
                    <button 
                      onClick={() => setAudioFile(null)}
                      className="mt-3 w-full py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      Choose Different File
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${isListening ? 'bg-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.5)]' : 'bg-white/5'}`}>
                  <button 
                    onClick={toggleLiveMic}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-indigo-500 text-white animate-pulse' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                  >
                    {isListening ? <StopCircle size={40} /> : <Mic size={40} />}
                  </button>
                </div>
                <h3 className="font-bold text-2xl text-white mb-2">{isListening ? 'Listening...' : 'Click to Speak'}</h3>
                <p className="text-gray-500 text-center px-4">Ensure your microphone is connected and permissions are granted.</p>
              </div>
            )}
          </motion.div>

          {/* Right Panel - Text Output */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#111]/80 backdrop-blur-xl border border-purple-500/20 p-6 rounded-3xl shadow-[0_0_30px_rgba(168,85,247,0.05)] flex flex-col h-full min-h-[400px]"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-purple-400">
                Transcribed Text
              </h2>
              <button 
                onClick={() => handleCopy(activeTab === 'upload' ? transcribedText : liveText)}
                className="flex items-center gap-2 text-sm font-medium bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors border border-white/5"
              >
                {copied ? <CheckCircle2 size={16} className="text-green-400" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
            
            <div className="flex-1 bg-black/50 border border-white/5 rounded-2xl p-6 overflow-y-auto text-lg leading-relaxed relative">
              {activeTab === 'upload' ? (
                transcribedText ? (
                  <span className="text-gray-200">{transcribedText}</span>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-600">
                    Upload an MP3 and click transcribe to see results...
                  </div>
                )
              ) : (
                liveText ? (
                  <span className="text-gray-200">{liveText}</span>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-600">
                    Start speaking to see your text appear here live...
                  </div>
                )
              )}
            </div>
          </motion.div>

        </div>
      
        {/* Try Other Tools Section */}
        <div className="border-t border-white/10 pt-12 pb-8 mt-16 w-full">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl md:text-2xl font-black italic uppercase flex items-center gap-2">Try Other Tools</h3>
             <a href="/#tools" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">View All</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/tools/video-compressor">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 group">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">Video Compressor</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Free Tool</p>
                </div>
              </div>
            </a>
            <a href="/tools/auto-captions">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 group">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13h4"/><path d="M15 13h2"/><path d="M7 9h2"/><path d="M13 9h4"/><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">Auto Captions</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Free Tool</p>
                </div>
              </div>
            </a>
            <a href="/tools/bg-remover">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 group">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">BG Remover</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Free Tool</p>
                </div>
              </div>
            </a>
          </div>
        </div>
</div>
    </div>
  );
}