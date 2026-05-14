// File: src/app/tools/whatsapp-mockup/page.tsx
"use client";

import React, { useState, useRef } from 'react';
import { Camera, Phone, Video, MoreVertical, ArrowLeft, Paperclip, Smile, Mic, Check, CheckCheck, Battery, Signal, Wifi, Plus, Trash2, Sun, Moon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Message {
  id: string;
  text: string;
  time: string;
  isSentByMe: boolean;
  status: 'sent' | 'delivered' | 'read' | 'none';
}

export default function WhatsAppMockupTool() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [contactName, setContactName] = useState("Priya 💖");
  const [contactStatus, setContactStatus] = useState("online");
  const [avatarPreview, setAvatarPreview] = useState("https://i.pravatar.cc/150?img=5");
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hey! Screenshot check karo, ekdum real lag raha hai na?', time: '10:30 AM', isSentByMe: true, status: 'read' },
    { id: '2', text: 'Haan yaar! Ye toh 100% original WhatsApp lag raha hai 😱', time: '10:32 AM', isSentByMe: false, status: 'none' },
  ]);

  const [newMessageText, setNewMessageText] = useState("");
  const [newMessageTime, setNewMessageTime] = useState("10:35 AM");
  const [isSentByMe, setIsSentByMe] = useState(true);
  const [messageStatus, setMessageStatus] = useState<'sent' | 'delivered' | 'read'>('read');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    setMessages([...messages, {
      id: Date.now().toString(),
      text: newMessageText,
      time: newMessageTime,
      isSentByMe,
      status: isSentByMe ? messageStatus : 'none',
    }]);
    setNewMessageText("");
  };

  const deleteMessage = (id: string) => setMessages(messages.filter(msg => msg.id !== id));

  // 🚀 PIXEL PERFECT COLORS FOR WHATSAPP
  const colors = {
    light: {
      header: '#008069',
      bg: '#EFEAE2',
      myMsg: '#E7FFDB',
      theirMsg: '#FFFFFF',
      text: '#111B21',
      meta: '#667781',
      inputBg: '#F0F2F5',
      inputField: '#FFFFFF',
      icon: '#8696A0'
    },
    dark: {
      header: '#1F2C34',
      bg: '#0B141A',
      myMsg: '#005C4B',
      theirMsg: '#202C33',
      text: '#E9EDEF',
      meta: '#8696A0',
      inputBg: '#1F2C34',
      inputField: '#2A3942',
      icon: '#8696A0'
    }
  };

  const currentColors = colors[theme];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Fake <span className="text-emerald-500">WhatsApp</span> Generator
          </h1>
          <p className="text-gray-400 font-medium">100% Original look. Pixel-perfect light & dark themes.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* 🛠️ CONTROLS */}
          <div className="bg-[#111] border border-white/10 p-6 md:p-8 rounded-[2rem] space-y-8">
            
            <div className="flex justify-between items-center bg-black p-2 rounded-2xl border border-white/10">
              <button onClick={() => setTheme('light')} className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${theme === 'light' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}><Sun size={16}/> Light Theme</button>
              <button onClick={() => setTheme('dark')} className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${theme === 'dark' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-white'}`}><Moon size={16}/> Dark Theme</button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-emerald-400 mb-4 uppercase tracking-widest text-sm">1. Profile Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 font-bold mb-2">Contact Name</label>
                  <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-bold mb-2">Status</label>
                  <input type="text" value={contactStatus} onChange={(e) => setContactStatus(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-bold mb-2">Profile Picture</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-500/10 file:text-emerald-500" />
                </div>
              </div>
            </div>

            <hr className="border-white/5" />

            <form onSubmit={addMessage}>
              <h3 className="text-lg font-bold text-emerald-400 mb-4 uppercase tracking-widest text-sm">2. Add Message</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <button type="button" onClick={() => setIsSentByMe(true)} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all ${isSentByMe ? 'bg-emerald-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>Sent by Me (Right)</button>
                  <button type="button" onClick={() => setIsSentByMe(false)} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all ${!isSentByMe ? 'bg-gray-700 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>Sent by Them (Left)</button>
                </div>
                <textarea value={newMessageText} onChange={(e) => setNewMessageText(e.target.value)} rows={3} placeholder="Type your message here..." className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none" />
                
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={newMessageTime} onChange={(e) => setNewMessageTime(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white" />
                  {isSentByMe && (
                    <select value={messageStatus} onChange={(e) => setMessageStatus(e.target.value as any)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white appearance-none">
                      <option value="read">Blue Ticks (Read)</option>
                      <option value="delivered">Grey Ticks (Delivered)</option>
                      <option value="sent">Single Tick (Sent)</option>
                    </select>
                  )}
                </div>
                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl flex items-center justify-center gap-2 transition-all"><Plus size={16} /> Add Message</button>
              </div>
            </form>
          </div>

          {/* 📱 100% ORIGINAL PREVIEW */}
          <div className="flex flex-col items-center justify-center">
            <p className="text-gray-500 text-sm font-medium mb-6">Take a screenshot of this frame 👇</p>

            <div 
              className="w-[360px] h-[740px] rounded-[3rem] border-[12px] border-[#1f2c34] overflow-hidden shadow-2xl relative flex flex-col font-sans select-none"
              style={{ backgroundColor: currentColors.bg }}
            >
              {/* WhatsApp Chat Wallpaper Pattern */}
              <div className="absolute inset-0 z-0 opacity-[0.4]" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'cover' }} />

              {/* Status Bar */}
              <div className="w-full px-6 py-2 flex justify-between items-center text-[12px] font-semibold z-10" style={{ backgroundColor: currentColors.header, color: theme === 'light' ? '#fff' : '#ffffff80' }}>
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <Signal size={12} className={theme === 'light' ? 'fill-white' : 'fill-[#ffffff80]'} />
                  <Wifi size={12} />
                  <Battery size={14} className={theme === 'light' ? 'fill-white' : 'fill-[#ffffff80]'} />
                </div>
              </div>

              {/* WhatsApp Header */}
              <div className="px-2 py-2 flex items-center justify-between z-10 shadow-sm" style={{ backgroundColor: currentColors.header }}>
                <div className="flex items-center gap-1 cursor-pointer">
                  <ArrowLeft size={24} color="#fff" />
                  <img src={avatarPreview} alt="dp" className="w-10 h-10 rounded-full object-cover ml-1" />
                  <div className="flex flex-col ml-3">
                    <span className="text-white font-semibold text-[17px] leading-tight truncate max-w-[130px]">{contactName}</span>
                    <span className="text-white/80 text-[13px] leading-tight mt-0.5">{contactStatus}</span>
                  </div>
                </div>
                <div className="flex items-center gap-5 mr-3">
                  <Video size={22} color="#fff" className="fill-white" />
                  <Phone size={20} color="#fff" className="fill-white" />
                  <MoreVertical size={22} color="#fff" />
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-[10px] z-10 no-scrollbar">
                {/* Date Badge */}
                <div className="flex justify-center mb-3">
                  <span className="text-[12px] uppercase font-medium px-3 py-1.5 rounded-lg shadow-sm" style={{ backgroundColor: theme === 'light' ? '#E1F3FB' : '#182229', color: theme === 'light' ? '#54656F' : '#8696A0' }}>Today</span>
                </div>

                {messages.map((msg, index) => {
                  // Check if tail is needed (if previous message is from someone else)
                  const showTail = index === 0 || messages[index - 1].isSentByMe !== msg.isSentByMe;

                  return (
                    <div key={msg.id} className={`flex ${msg.isSentByMe ? 'justify-end' : 'justify-start'} group relative mb-0.5`}>
                      <button onClick={() => deleteMessage(msg.id)} className="absolute top-2 opacity-0 group-hover:opacity-100 p-1 bg-red-500/20 text-red-500 rounded-full transition-opacity z-20" style={{ [msg.isSentByMe ? 'left' : 'right']: '-35px' }}>
                        <Trash2 size={14} />
                      </button>

                      <div 
                        className={`max-w-[80%] px-[9px] pt-[6px] pb-[8px] flex flex-col relative`}
                        style={{ 
                          backgroundColor: msg.isSentByMe ? currentColors.myMsg : currentColors.theirMsg,
                          borderRadius: '7.5px',
                          borderTopRightRadius: msg.isSentByMe && showTail ? '0px' : '7.5px',
                          borderTopLeftRadius: !msg.isSentByMe && showTail ? '0px' : '7.5px',
                          boxShadow: '0 1px 0.5px rgba(11,20,26,.13)'
                        }}
                      >
                        {/* 🚀 SVG BUBBLE TAILS (100% Original) */}
                        {showTail && msg.isSentByMe && (
                          <svg viewBox="0 0 8 13" width="8" height="13" className="absolute top-0 -right-[8px]" style={{ color: currentColors.myMsg }}>
                            <path fill="currentColor" d="M5.188 1H0v11.156l4.618-4.596A4.5 4.5 0 0 0 8 4.375V1H5.188z"/>
                          </svg>
                        )}
                        {showTail && !msg.isSentByMe && (
                          <svg viewBox="0 0 8 13" width="8" height="13" className="absolute top-0 -left-[8px] transform -scale-x-100" style={{ color: currentColors.theirMsg }}>
                            <path fill="currentColor" d="M5.188 1H0v11.156l4.618-4.596A4.5 4.5 0 0 0 8 4.375V1H5.188z"/>
                          </svg>
                        )}

                        <span className="text-[14.2px] leading-[19px] whitespace-pre-wrap break-words" style={{ color: currentColors.text }}>
                          {msg.text}
                          {/* Invisible space trick to align time at bottom right properly */}
                          <span className="inline-block w-[60px]" /> 
                        </span>
                        
                        <div className="absolute bottom-[3px] right-[7px] flex items-center gap-[3px]">
                          <span className="text-[11px]" style={{ color: currentColors.meta }}>{msg.time}</span>
                          {msg.isSentByMe && (
                            <span className="ml-[1px]">
                              {msg.status === 'sent' && <Check size={14} color={currentColors.meta} />}
                              {msg.status === 'delivered' && <CheckCheck size={14} color={currentColors.meta} />}
                              {msg.status === 'read' && <CheckCheck size={14} color={theme === 'light' ? '#53BDEB' : '#53BDEB'} />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input Area */}
              <div className="p-[10px] flex items-end gap-2 z-10" style={{ backgroundColor: currentColors.inputBg }}>
                <div className="flex-1 rounded-[24px] flex items-center px-3 py-2.5 gap-3" style={{ backgroundColor: currentColors.inputField }}>
                  <Smile size={24} color={currentColors.icon} />
                  <span className="text-[16px] flex-1 truncate font-normal" style={{ color: currentColors.meta }}>Message</span>
                  <Paperclip size={22} color={currentColors.icon} className="-rotate-45" />
                  <Camera size={22} color={currentColors.icon} />
                </div>
                <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm" style={{ backgroundColor: '#00A884' }}>
                  <Mic size={24} color="#fff" className="fill-white" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}