// File: src/app/tools/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, Mic2, Video, FileText, ArrowRight, 
  Sparkles, Layers, Scissors, Wand2, CheckCircle2,
  Eraser, Layout, Code, Link as LinkIcon, Search, 
 Hash, Download, Type, Palette, QrCode, ShieldAlert,
  MessageSquare, TrendingUp, Music, Stamp, Maximize, FileArchive,
  Settings
} from 'lucide-react';

// ==========================================
// 🛠️ SELOICE MASTER TOOLS DATABASE (26 Tools)
// ==========================================
const TOOLS = [
  // --- 🎨 STUDIO EDITORS ---
  {
    id: "photo-editor", name: "Photo Studio Pro", category: "Studio",
    tagline: "Ultimate Image Editing", status: "Live", gradient: "from-emerald-500 to-teal-400",
    icon: <ImageIcon size={24} className="text-white" />, link: "/tools/photo-editor",
    description: "Hardware-accelerated browser editor. Edit RAW colors, add layers, and apply cinematic grades.",
    features: ["Advanced Tone Curves", "Picture-in-Picture (PiP)", "25+ Cinematic FX"]
  },
  {
    id: "audio-editor", name: "Audio Studio Pro", category: "Studio",
    tagline: "Podcast & Music Workstation", status: "Live", gradient: "from-purple-500 to-indigo-400",
    icon: <Mic2 size={24} className="text-white" />, link: "/tools/audio-editor",
    description: "Full-fledged WebAudio DAW. Cut, trim, enhance, and mix your audio files directly in the browser.",
    features: ["Interactive Waveform", "Studio EQ & Reverb", "Auto-Normalize Export"]
  },

  // --- 🎬 VIDEO & AUDIO UTILS ---
  {
    id: "video-compressor", name: "Video Compressor", category: "Video",
    tagline: "Reduce Size Without Quality Loss", status: "Live", gradient: "from-blue-500 to-cyan-400",
    icon: <Video size={24} className="text-white" />, link: "/tools/video-compressor",
    description: "Compress heavy MP4 files for WhatsApp, Discord, or Web without losing HD quality.",
    features: ["Smart Compression Math", "Format Selection", "Batch Processing"]
  },
  {
    id: "mp4-to-mp3", name: "MP4 to MP3", category: "Audio",
    tagline: "Extract Audio from Video", status: "Live", gradient: "from-rose-500 to-pink-400",
    icon: <Music size={24} className="text-white" />, link: "/tools/mp4-to-mp3",
    description: "Instantly strip high-quality audio tracks from your video files in one click.",
    features: ["Blazing Fast Engine", "320kbps Quality", "No Upload Limits"]
  },
  {
    id: "watermark-adder", name: "Watermark Adder", category: "Video",
    tagline: "Protect Your Content", status: "Live", gradient: "from-sky-500 to-indigo-400",
    icon: <Stamp size={24} className="text-white" />, link: "/tools/watermark-adder",
    description: "Batch apply your logo or text watermark to images and videos effortlessly.",
    features: ["Custom Opacity", "Position Grid", "Auto-Scaling"]
  },

  // --- 🔴 YOUTUBE SUITE ---
  {
    id: "yt-downloader", name: "YT Downloader", category: "YouTube",
    tagline: "Download HD Videos", status: "Live", gradient: "from-red-500 to-orange-400",
    icon: <Download size={24} className="text-white" />, link: "/tools/yt-downloader",
    description: "Download YouTube videos directly in 1080p, 4K, or extract as audio.",
    features: ["4K Support", "MP3 Extraction", "No Ads/Popups"]
  },
  {
    id: "thumbnail-extractor", name: "Thumbnail Extractor", category: "YouTube",
    tagline: "Grab HD Thumbnails", status: "Live", gradient: "from-orange-500 to-amber-400",
    icon: <ImageIcon size={24} className="text-white" />, link: "/tools/thumbnail-extractor",
    description: "Extract the highest quality thumbnail image from any YouTube video URL.",
    features: ["Max Res Detection", "1-Click Download", "Bulk Extraction"]
  },
  {
    id: "yt-tag-extractor", name: "YT Tag Extractor", category: "YouTube",
    tagline: "Steal Competitor Tags", status: "Live", gradient: "from-amber-500 to-yellow-400",
    icon: <Hash size={24} className="text-white" />, link: "/tools/yt-tag-extractor",
    description: "Analyze any viral YouTube video and extract the exact tags they used to rank.",
    features: ["Competitor Analysis", "Copy All to Clipboard", "SEO Insights"]
  },
  {
    id: "yt-title-generator", name: "YT Title Generator", category: "YouTube",
    tagline: "Clickbait Title AI", status: "Live", gradient: "from-yellow-500 to-lime-400",
    icon: <Type size={24} className="text-white" />, link: "/tools/yt-title-generator",
    description: "Generate high-CTR, algorithm-friendly titles for your next viral video.",
    features: ["AI Powered", "CTR Optimization", "Niche Specific"]
  },

  // --- 📱 SOCIAL MEDIA (REELS/INSTA) ---
  {
    id: "reel-downloader", name: "Reel Downloader", category: "Social",
    tagline: "Save Insta Reels", status: "Live", gradient: "from-pink-500 to-purple-400",
    icon: <Download size={24} className="text-white" />, link: "/tools/reel-downloader",
    description: "Download Instagram Reels without watermarks in pristine HD quality.",
    features: ["No Login Required", "HD Export", "Fast API"]
  },
  {
    id: "reel-fitter", name: "Reel Fitter", category: "Social",
    tagline: "Perfect 9:16 Crop", status: "Live", gradient: "from-fuchsia-500 to-pink-400",
    icon: <Maximize size={24} className="text-white" />, link: "/tools/reel-fitter",
    description: "Fit landscape videos perfectly into Instagram Reel / TikTok 9:16 format with blur background.",
    features: ["Auto Background Blur", "Content Centering", "Zero Cropping"]
  },
  {
    id: "safe-zone", name: "Safe Zone Preview", category: "Social",
    tagline: "Check UI Overlaps", status: "Live", gradient: "from-indigo-500 to-blue-400",
    icon: <ShieldAlert size={24} className="text-white" />, link: "/tools/safe-zone",
    description: "Preview your video to ensure important text isn't covered by TikTok or IG UI elements.",
    features: ["TikTok UI Overlay", "Reels UI Overlay", "Shorts Overlay"]
  },
  {
    id: "grid-maker", name: "Grid Maker", category: "Social",
    tagline: "Instagram Grid Splitter", status: "Live", gradient: "from-cyan-500 to-teal-400",
    icon: <Layout size={24} className="text-white" />, link: "/tools/grid-maker",
    description: "Split your beautiful panoramas into a 3x1 or 3x3 grid for your Instagram profile.",
    features: ["Perfect Square Math", "Zip Download", "HD Quality"]
  },
  {
    id: "hashtag-extractor", name: "Hashtag Extractor", category: "Social",
    tagline: "Find Viral Tags", status: "Live", gradient: "from-emerald-500 to-green-400",
    icon: <Hash size={24} className="text-white" />, link: "/tools/hashtag-extractor",
    description: "Extract hidden hashtags from any viral post or reel to boost your reach.",
    features: ["Link Analysis", "Trending Score", "1-Click Copy"]
  },
  {
    id: "hashtag-generator", name: "Hashtag Generator", category: "Social",
    tagline: "AI Tag Suggestions", status: "Live", gradient: "from-teal-500 to-emerald-400",
    icon: <Sparkles size={24} className="text-white" />, link: "/tools/hashtag-generator",
    description: "Upload an image or type a keyword to generate a set of highly targeted hashtags.",
    features: ["Image Recognition", "Niche Targeting", "Banned Tag Filter"]
  },

  // --- 🤖 AI & CAPTIONS ---
  {
    id: "auto-captions", name: "Auto Captions", category: "AI",
    tagline: "Hormozi Style Text", status: "Live", gradient: "from-purple-500 to-fuchsia-400",
    icon: <Type size={24} className="text-white" />, link: "/tools/auto-captions",
    description: "Generate dynamic, animated captions for your shorts just like Alex Hormozi.",
    features: ["Auto-Sync Timing", "Custom Fonts", "Color Highlights"]
  },
  {
    id: "smart-captions", name: "Smart Captions", category: "AI",
    tagline: "Contextual AI Text", status: "Live", gradient: "from-fuchsia-500 to-pink-400",
    icon: <MessageSquare size={24} className="text-white" />, link: "/tools/smart-captions",
    description: "AI-generated text that explains your video scene by scene automatically.",
    features: ["Scene Detection", "B-Roll Matching", "SRT Export"]
  },
  {
    id: "speech-to-text", name: "Speech to Text", category: "AI",
    tagline: "Transcribe Audio", status: "Live", gradient: "from-pink-500 to-rose-400",
    icon: <Mic2 size={24} className="text-white" />, link: "/tools/speech-to-text",
    description: "Upload an audio file and let AI accurately transcribe every single word.",
    features: ["Multi-Language", "Punctuation Engine", "Export as Doc"]
  },
  {
    id: "mp4-to-text", name: "MP4 to Text", category: "AI",
    tagline: "Extract Video Scripts", status: "Live", gradient: "from-rose-500 to-orange-400",
    icon: <FileText size={24} className="text-white" />, link: "/tools/mp4-to-text",
    description: "Get the exact transcript from any MP4 video file instantly using Whisper AI.",
    features: ["Fast Transcription", "Timestamped Output", "Speaker Diarization"]
  },
  {
    id: "tweet-generator", name: "Tweet Generator", category: "AI",
    tagline: "Viral Twitter Threads", status: "Live", gradient: "from-sky-500 to-blue-400",
    icon: <MessageSquare size={24} className="text-white" />, link: "/tools/tweet-generator",
    description: "Paste a link or idea and let AI generate a highly engaging Twitter thread.",
    features: ["Hook Optimization", "Thread Formatting", "Tone Selection"]
  },
  {
    id: "viral-hooks", name: "Viral Hooks", category: "AI",
    tagline: "Stop the Scroll", status: "Live", gradient: "from-blue-500 to-indigo-400",
    icon: <TrendingUp size={24} className="text-white" />, link: "/tools/viral-hooks",
    description: "Generate proven, psychology-backed 3-second hooks for your short form content.",
    features: ["A/B Testing Ideas", "Psychology Triggers", "Niche Customization"]
  },
  {
    id: "bg-remover", name: "BG Remover", category: "AI",
    tagline: "1-Click Background Eraser", status: "Live", gradient: "from-indigo-500 to-purple-400",
    icon: <Eraser size={24} className="text-white" />, link: "/tools/bg-remover",
    description: "Instantly cut out subjects from their background with perfect hair edge detection.",
    features: ["Subject Isolation", "Transparent PNG", "Solid Color BG"]
  },

  // --- 🧰 UTILITIES & IMAGES ---
  {
    id: "image-converter", name: "Image Converter", category: "Utility",
    tagline: "WebP, PNG, JPG Maker", status: "Live", gradient: "from-slate-600 to-gray-400",
    icon: <ImageIcon size={24} className="text-white" />, link: "/tools/image-converter",
    description: "Convert heavy image formats into ultra-light WebP or standard JPGs in bulk.",
    features: ["Batch Processing", "Quality Slider", "Zero Server Upload"]
  },
  {
    id: "file-converter", name: "File Converter", category: "Utility",
    tagline: "Universal Format Changer", status: "Live", gradient: "from-gray-600 to-zinc-400",
    icon: <FileArchive size={24} className="text-white" />, link: "/tools/file-converter",
    description: "Convert documents, audio, video, and archives into any format you need.",
    features: ["100+ Formats", "Lightning Fast", "Local Processing"]
  },
  {
    id: "color-extractor", name: "Color Extractor", category: "Utility",
    tagline: "Steal Aesthetic Palettes", status: "Live", gradient: "from-yellow-500 to-orange-400",
    icon: <Palette size={24} className="text-white" />, link: "/tools/color-extractor",
    description: "Upload an image and instantly extract its dominant color palette and HEX codes.",
    features: ["HEX & RGB Codes", "Dominant Color AI", "Copy to Clipboard"]
  },
  {
    id: "qr-generator", name: "QR Generator", category: "Utility",
    tagline: "Custom QR Codes", status: "Live", gradient: "from-cyan-500 to-blue-400",
    icon: <QrCode size={24} className="text-white" />, link: "/tools/qr-generator",
    description: "Create branded QR codes for your links, Wi-Fi, or payments with logo embedding.",
    features: ["Color Customization", "Logo Insertion", "High-Res SVG Export"]
  }
];

// Categories Array
const CATEGORIES = ["All", "Studio", "Video", "YouTube", "Social", "AI", "Audio", "Utility"];

export default function MasterToolsHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Smart Filtering Engine
  const filteredTools = TOOLS.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#030305] text-white selection:bg-emerald-500/30 overflow-x-hidden relative font-sans pb-24">
      
      {/* 🌌 Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-[0.15] -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-600 rounded-full blur-[200px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-600 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        
        {/* 🚀 Header & Search Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 shadow-xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-100">Seloice Mega Suite • 26 Tools</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
            CREATOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">ECOSYSTEM</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            From heavy audio-video editing to AI captioning and format conversions. Everything you need to scale your content, right here in the browser.
          </p>

          {/* 🔍 Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
               <Search size={20} className="text-gray-500" />
            </div>
            <input 
              type="text" 
              placeholder="Search for 'Background Remover', 'Audio Editor', 'QR'..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-sm md:text-base font-medium text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner"
            />
          </div>

          {/* 🏷️ Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
             {CATEGORIES.map(category => (
                <button 
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeCategory === category ? 'bg-white text-black shadow-lg scale-105' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'}`}
                >
                  {category}
                </button>
             ))}
          </div>
        </motion.div>

        {/* 🛠️ Dynamic Tools Grid (Auto Layout) */}
        <AnimatePresence mode="popLayout">
          {filteredTools.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {filteredTools.map((tool, index) => (
                <motion.div 
                  layout
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="group relative bg-black/40 border border-white/10 backdrop-blur-md rounded-[1.5rem] p-5 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300 hover:shadow-2xl flex flex-col"
                >
                  {/* Top Bar: Icon & Category */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                      {tool.icon}
                    </div>
                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-400 text-[8px] font-black uppercase tracking-widest rounded-full">
                      {tool.category}
                    </span>
                  </div>

                  {/* Text Content */}
                  <div className="mb-5 flex-1">
                     <h2 className="text-lg font-black tracking-tight mb-1">{tool.name}</h2>
                     <p className={`text-[9px] font-bold uppercase tracking-widest mb-3 bg-clip-text text-transparent bg-gradient-to-r ${tool.gradient}`}>
                        {tool.tagline}
                     </p>
                     <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                        {tool.description}
                     </p>
                  </div>

                  {/* Micro Features */}
                  <div className="space-y-1.5 mb-6">
                     {tool.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                           <CheckCircle2 size={10} className="text-emerald-500" />
                           <span className="text-[10px] font-medium text-gray-300">{feature}</span>
                        </div>
                     ))}
                  </div>

                  {/* 🔥 THE BUG FIX: SAFE LINK RENDERING */}
                  {tool.link && tool.link !== "#" ? (
                    <Link href={tool.link} className={`mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-lg font-black uppercase tracking-widest text-[10px] transition-all bg-white/5 hover:bg-gradient-to-r ${tool.gradient} text-gray-300 hover:text-white border border-white/10 hover:border-transparent group-hover:shadow-lg`}>
                       Open Tool <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <button disabled className="mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-lg font-black uppercase tracking-widest text-[10px] bg-white/5 text-gray-600 cursor-not-allowed border border-white/10">
                       Coming Soon
                    </button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl"
            >
               <Search size={48} className="text-gray-600 mx-auto mb-4" />
               <h3 className="text-xl font-black uppercase text-gray-400 mb-2">No tools found</h3>
               <p className="text-sm text-gray-500">We couldn't find any tool matching "{searchQuery}". Try a different category.</p>
               <button onClick={() => {setSearchQuery(""); setActiveCategory("All");}} className="mt-6 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-full text-xs font-bold uppercase tracking-widest text-white transition-colors">
                  Reset Filters
               </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}