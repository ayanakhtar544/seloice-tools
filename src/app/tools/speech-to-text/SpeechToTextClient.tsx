// File: src/app/tools/speech-to-text/page.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, UploadCloud, FileAudio, Play, Pause, Copy, CheckCircle2, Waves, StopCircle } from 'lucide-react';
import Link from 'next/link';

export default function SpeechToTextClient() {
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

</div>
    </div>
  );
}