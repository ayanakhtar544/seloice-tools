// File: src/app/admin/blogs/new/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Sparkles, Send, Loader2, Save } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AddNewBlog() {
  const router = useRouter();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  
  const [formData, setFormData] = useState({
    title: '', slug: '', metaTitle: '', metaDescription: '', 
    excerpt: '', content: '', category: 'Tutorial', 
    tags: [] as string[], faqs: [] as any[], relatedTools: [] as string[],
    ogDescription: '', coverImage: '', author: 'Abushahma', status: 'Published'
  });

  // 🪄 AI GENERATION FUNCTION
  const generateWithAi = async () => {
    if (!aiTopic) return alert("Pehle topic likho! (Jaise: Best SEO Tips 2026)");
    
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic }),
      });
      
      const data = await res.json();
      
      // Agar backend se error aya toh throw karo
      if (!res.ok) throw new Error(data.error || "Failed to fetch from Gemini");

      // Form fill karo
      setFormData({
        ...formData,
        title: data.title || '',
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        excerpt: data.excerpt || '',
        content: data.content || '',
        category: data.category || 'Tutorial',
        tags: Array.isArray(data.tags) ? data.tags : [],
        faqs: Array.isArray(data.faqs) ? data.faqs : [],
        relatedTools: Array.isArray(data.relatedTools) ? data.relatedTools : [],
        ogDescription: data.ogDescription || ''
      });

      alert("✨ Magic Complete! Saare fields auto-fill ho gaye.");

    } catch (err: any) {
      console.error("AI Error:", err);
      alert("AI Generation Fail Ho Gaya! Error: " + err.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return alert("Title aur Content zaroori hai!");

    setLoading(true);
    try {
      const finalSlug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      await addDoc(collection(db, "blogs"), { 
        ...formData, 
        slug: finalSlug,
        views: 0, likes: 0, 
        createdAt: serverTimestamp() 
      });
      alert("✅ Blog Successfully Published!");
      router.push('/admin'); 
    } catch (err: any) { 
      alert("Publish Error: " + err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white flex">
      <AdminSidebar/>
      <main className="flex-1 p-8 h-screen overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tighter">NEW <span className="text-emerald-500 italic">POST</span></h1>
          <div className="flex gap-3">
             <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                {loading ? "Publishing..." : <><Send size="{16}"/> Go Live</>}
             </button>
          </div>
        </div>

        <div className="max-w-4xl space-y-6">
           
           
           <div className="bg-purple-900/20 border border-purple-500/30 p-8 rounded-[2rem] space-y-4">
             <h3 className="text-purple-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><Sparkles size="{16}"/> AI Auto-Generator</h3>
             <div className="flex gap-4">
                <input 
                  type="text" placeholder="Enter topic..." 
                  value={aiTopic} onChange={(e) => setAiTopic(e.target.value)}
                  className="flex-1 bg-black border border-purple-500/20 p-5 rounded-2xl text-lg font-bold outline-none focus:border-purple-500"
                />
                
                <button 
                  type="button" 
                  onClick={generateWithAi} 
                  disabled={isAiLoading}
                  className="bg-purple-600 hover:bg-purple-500 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 whitespace-nowrap"
                >
                  {isAiLoading ? <Loader2 className="animate-spin" size="{16}"/> : 'Generate Magic'}
                </button>
             </div>
           </div>

           
           <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">H1 Title</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm font-bold outline-none focus:border-emerald-500" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">URL Slug</label>
                    <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-emerald-500" />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Meta Description (SEO)</label>
                 <textarea rows={2} value={formData.metaDescription} onChange={(e) => setFormData({...formData, metaDescription: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-emerald-500" />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Main Content (HTML)</label>
                 <textarea 
                   rows={15} 
                   value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})}
                   className="w-full bg-black border border-white/10 p-6 rounded-3xl text-sm font-mono leading-relaxed outline-none focus:border-emerald-500 text-gray-400"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cover Image URL</label>
                 <input type="text" value={formData.coverImage} onChange={(e) => setFormData({...formData, coverImage: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm outline-none" />
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}