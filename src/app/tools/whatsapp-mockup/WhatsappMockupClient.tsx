// File: src/app/tools/whatsapp-mockup/page.tsx
"use client";

import React, { useState } from 'react';
import { Camera, Phone, Video, MoreVertical, ArrowLeft, Paperclip, Smile, Mic, Check, CheckCheck, Battery, Signal, Wifi, Plus, Trash2, IndianRupee, Lock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Message {
  id: string;
  text: string;
  time: string;
  isSentByMe: boolean;
  status: 'sent' | 'delivered' | 'read' | 'none' | 'failed';
}

export default function WhatsappMockupClient() {
  // 🚀 SYSTEM & HEADER STATES
  const [systemTime, setSystemTime] = useState("8:56");
  const [batteryPercent, setBatteryPercent] = useState("87%");
  const [headerColor, setHeaderColor] = useState("#075E54"); // Classic WhatsApp Green
  
  // 🚀 PROFILE STATES
  const [contactName, setContactName] = useState("Gulafsha");
  const [contactStatus, setContactStatus] = useState("last seen today at 5:52 PM");
  const [avatarPreview, setAvatarPreview] = useState("https://i.pravatar.cc/150?img=9");
  
  // 🚀 CHAT AREA STATES
  const [dateText, setDateText] = useState("August 15, 2025");
  const [encryptionText, setEncryptionText] = useState("Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them. Tap to learn more.");
  const [inputText, setInputText] = useState("Message");
  
  // 🚀 MESSAGES STATE
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Video send karna', time: '2:34 PM', isSentByMe: true, status: 'read' },
    { id: '2', text: 'Whatshap se nahi jayega 9-10 gb ka hai', time: '2:35 PM', isSentByMe: false, status: 'none' },
  ]);

  // ADD NEW MESSAGE STATES
  const [newMessageText, setNewMessageText] = useState("");
  const [newMessageTime, setNewMessageTime] = useState("2:36 PM");
  const [isSentByMe, setIsSentByMe] = useState(true);
  const [messageStatus, setMessageStatus] = useState<'sent' | 'delivered' | 'read' | 'failed'>('read');

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

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow pt-32 pb-24 px-4 max-w-[1400px] mx-auto w-full">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-emerald-500">Ultimate Fake Chat Maker</h2>
          <p className="text-gray-400">Everything is 100% editable. Customize down to the battery percentage.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 🛠️ CONTROLS PANEL (LEFT SIDE - 7 COLUMNS) */}
          <div className="lg:col-span-7 bg-[#111] border border-white/10 p-6 rounded-[2rem] space-y-8 h-[800px] overflow-y-auto no-scrollbar">
            
            {/* System & Header Editor */}
            <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/10">
              <h3 className="text-emerald-400 font-bold uppercase text-xs tracking-widest border-b border-white/10 pb-2">1. System & Header</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Time</label>
                  <input type="text" value={systemTime} onChange={(e) => setSystemTime(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Battery %</label>
                  <input type="text" value={batteryPercent} onChange={(e) => setBatteryPercent(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Header Color</label>
                  <input type="color" value={headerColor} onChange={(e) => setHeaderColor(e.target.value)} className="w-full h-9 rounded-lg cursor-pointer bg-transparent border-none" />
                </div>
              </div>
            </div>

            {/* Profile Editor */}
            <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/10">
              <h3 className="text-emerald-400 font-bold uppercase text-xs tracking-widest border-b border-white/10 pb-2">2. Profile Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Contact Name" value={contactName} onChange={(e) => setContactName(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                <input type="text" placeholder="Status (online, typing...)" value={contactStatus} onChange={(e) => setContactStatus(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                <div className="col-span-full">
                  <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Upload Profile Pic</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-black rounded-lg text-sm" />
                </div>
              </div>
            </div>

            {/* Chat Context Editor */}
            <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/10">
              <h3 className="text-emerald-400 font-bold uppercase text-xs tracking-widest border-b border-white/10 pb-2">3. Chat Elements</h3>
              <input type="text" placeholder="Date (e.g. Today)" value={dateText} onChange={(e) => setDateText(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm mb-2 outline-none focus:border-emerald-500" />
              <textarea placeholder="Encryption Text" value={encryptionText} onChange={(e) => setEncryptionText(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-emerald-500" rows={2} />
              <input type="text" placeholder="Input Box Placeholder" value={inputText} onChange={(e) => setInputText(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500" />
            </div>

            {/* Add Message Form */}
            <div className="space-y-4 bg-emerald-900/20 p-4 rounded-2xl border border-emerald-500/20">
              <h3 className="text-emerald-400 font-bold uppercase text-xs tracking-widest border-b border-emerald-500/20 pb-2">4. Add New Message</h3>
              <div className="flex gap-2">
                <button onClick={() => setIsSentByMe(true)} className={`flex-1 py-2 rounded-lg font-bold uppercase text-xs ${isSentByMe ? 'bg-emerald-600' : 'bg-black border border-white/10'}`}>Me (Green)</button>
                <button onClick={() => setIsSentByMe(false)} className={`flex-1 py-2 rounded-lg font-bold uppercase text-xs ${!isSentByMe ? 'bg-gray-700' : 'bg-black border border-white/10'}`}>Them (White)</button>
              </div>
              <textarea placeholder="Type message..." value={newMessageText} onChange={(e) => setNewMessageText(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 resize-none" rows={3} />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Time" value={newMessageTime} onChange={(e) => setNewMessageTime(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
                {isSentByMe && (
                  <select value={messageStatus} onChange={(e) => setMessageStatus(e.target.value as any)} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm outline-none appearance-none">
                    <option value="read">Blue Ticks (Read)</option>
                    <option value="delivered">Grey Ticks (Delivered)</option>
                    <option value="sent">Single Tick (Sent)</option>
                    <option value="failed">Failed ⏱️</option>
                  </select>
                )}
              </div>
              <button onClick={addMessage} className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-3 rounded-lg flex items-center justify-center gap-2 uppercase text-xs tracking-widest transition-colors"><Plus size={16}/> Add to Chat</button>
            </div>

          </div>

          {/* 📱 100% DITTO PREVIEW (RIGHT SIDE - 5 COLUMNS) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center pt-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Screenshot Output 👇</p>

            {/* THE PHONE FRAME */}
            <div className="w-[380px] h-[820px] rounded-[3rem] border-[14px] border-[#111] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative flex flex-col font-[-apple-system,Helvetica_Neue,Helvetica,Roboto,Arial,sans-serif] bg-[#E5DDD5]">
              
              {/* 🚀 CUSTOM UPLOADED BACKGROUND IMAGE */}
              <div 
                className="absolute inset-0 z-0 opacity-100" 
                style={{ 
                  backgroundImage: 'url("https://i.ibb.co/spBdC8x0/IMG-20260515-094316.jpg")', 
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} 
              />

              {/* Status Bar */}
              <div className="w-full px-6 py-1.5 flex justify-between items-center text-[12px] font-medium z-10 transition-colors" style={{ backgroundColor: headerColor, color: '#ffffff' }}>
                <span>{systemTime}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold mr-1">VoWiFi</span>
                  <Signal size={12} className="fill-white" />
                  <Wifi size={12} />
                  <span className="text-[10px] ml-0.5">{batteryPercent}</span>
                  <Battery size={16} className="fill-white rotate-90" />
                </div>
              </div>

              {/* WhatsApp Header */}
              <div className="px-2 py-2 flex items-center justify-between z-10 shadow-md transition-colors" style={{ backgroundColor: headerColor }}>
                <div className="flex items-center gap-1">
                  <ArrowLeft size={24} color="#fff" strokeWidth={2.5} className="cursor-pointer" />
                  <img src={avatarPreview} alt="dp" className="w-[38px] h-[38px] rounded-full object-cover shadow-sm ml-0.5" />
                  <div className="flex flex-col ml-2">
                    <span className="text-white font-semibold text-[16.5px] leading-tight truncate max-w-[140px]">{contactName}</span>
                    <span className="text-white/80 text-[12px] leading-tight mt-0.5 truncate max-w-[150px]">{contactStatus}</span>
                  </div>
                </div>
                <div className="flex items-center gap-[22px] mr-2 text-white">
                  <Video size={22} className="fill-current" />
                  <Phone size={20} className="fill-current" />
                  <MoreVertical size={22} />
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto px-3.5 py-4 flex flex-col gap-1.5 z-10 no-scrollbar">
                
                {/* Date Badge */}
                {dateText && (
                  <div className="flex justify-center mb-2">
                    <span className="text-[#54656F] text-[12px] uppercase font-medium px-3 py-1.5 rounded-lg shadow-sm bg-[#E1F3FB]">{dateText}</span>
                  </div>
                )}

                {/* Encryption Message */}
                {encryptionText && (
                  <div className="flex justify-center mb-4 px-4">
                    <div className="bg-[#FFEECD] text-[#54656F] text-[12.5px] leading-snug px-3 py-2 rounded-xl shadow-sm text-center font-medium flex items-start gap-1">
                      <Lock size={12} className="mt-0.5 flex-shrink-0" />
                      <span>{encryptionText}</span>
                    </div>
                  </div>
                )}

                {/* Messages Loop */}
                {messages.map((msg, index) => {
                  const isFirst = index === 0 || messages[index - 1].isSentByMe !== msg.isSentByMe;
                  return (
                    <div key={msg.id} className={`flex ${msg.isSentByMe ? 'justify-end' : 'justify-start'} group relative`}>
                      <button onClick={() => deleteMessage(msg.id)} className="absolute top-2 opacity-0 group-hover:opacity-100 p-1.5 bg-red-500 text-white rounded-full transition-opacity z-20 shadow-lg" style={{ [msg.isSentByMe ? 'left' : 'right']: '-40px' }}>
                        <Trash2 size={14} />
                      </button>

                      <div 
                        className={`max-w-[85%] px-2.5 py-1.5 flex flex-col relative shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]`}
                        style={{ 
                          backgroundColor: msg.isSentByMe ? '#DCF8C6' : '#FFFFFF',
                          borderRadius: '7.5px',
                          borderTopRightRadius: msg.isSentByMe && isFirst ? '0px' : '7.5px',
                          borderTopLeftRadius: !msg.isSentByMe && isFirst ? '0px' : '7.5px'
                        }}
                      >
                        {/* SVG TAILS */}
                        {isFirst && msg.isSentByMe && (
                          <div className="absolute top-0 -right-[8px] w-[8px] h-[13px]" style={{ backgroundColor: '#DCF8C6', clipPath: 'polygon(0 0, 0% 100%, 100% 0)' }} />
                        )}
                        {isFirst && !msg.isSentByMe && (
                          <div className="absolute top-0 -left-[8px] w-[8px] h-[13px]" style={{ backgroundColor: '#FFFFFF', clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
                        )}

                        <span className="text-[#111b21] text-[15px] leading-[20px] whitespace-pre-wrap break-words pb-3.5 relative">
                          {msg.text}
                          {/* Time & Ticks container inside message bubble */}
                          <div className="absolute bottom-[-2px] right-0 flex items-center justify-end gap-1 bg-transparent">
                            <span className="text-[#667781] text-[10.5px] uppercase">{msg.time}</span>
                            {msg.isSentByMe && (
                              <span className="ml-[1px]">
                                {msg.status === 'sent' && <Check size={15} className="text-[#8696A0]" />}
                                {msg.status === 'delivered' && <CheckCheck size={15} className="text-[#8696A0]" />}
                                {msg.status === 'read' && <CheckCheck size={15} className="text-[#34B7F1]" />}
                                {msg.status === 'failed' && <span className="text-[#8696A0] text-[10px]">⏱️</span>}
                              </span>
                            )}
                          </div>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Input Field */}
              <div className="p-2 flex items-end gap-1.5 z-10 mb-1">
                <div className="flex-1 bg-white rounded-[24px] flex items-end px-3 py-2.5 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] gap-3 min-h-[44px]">
                  <Smile size={24} className="text-[#8696a0] mb-[2px] flex-shrink-0" />
                  <span className="text-[#8696a0] text-[16px] flex-1 pb-[2px] truncate">{inputText}</span>
                  <div className="flex gap-3 mb-[2px] flex-shrink-0">
                    <Paperclip size={22} className="text-[#8696a0] -rotate-45" />
                    <IndianRupee size={20} className="text-[#8696a0]" />
                    <Camera size={22} className="text-[#8696a0]" />
                  </div>
                </div>
                <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center shadow-md flex-shrink-0" style={{ backgroundColor: headerColor }}>
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