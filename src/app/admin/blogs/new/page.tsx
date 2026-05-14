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

  // 🪄 AI GENERATION LOGIC
  const generateWithAi = async () => {
    if (!aiTopic) return alert("Please enter a topic for the AI to generate!");
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/generate-blog', {
        method: 'POST',
        body: JSON.stringify({ topic: aiTopic }),
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.details || data.error);

      setFormData({
        ...formData,
        title: data.title || '',
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        slug: data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        excerpt: data.excerpt || '',
        content: data.content || '',
        category: data.category || 'Tutorial',
        tags: data.tags || [],
        faqs: data.faqs || [],
        relatedTools: data.relatedTools || [],
        ogDescription: data.ogDescription || ''
      });
    } catch (err: any) {
      console.error(err);
      alert("AI Generation failed! " + err.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "blogs"), { ...formData, views: 0, likes: 0, createdAt: serverTimestamp() });
      router.push('/admin/page');
    } catch (err) { alert("Error publishing!"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white flex">
      <AdminSidebar />
      <main className="flex-1 p-8 h-screen overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tighter">NEW <span className="text-emerald-500 italic">POST</span></h1>
          <div className="flex gap-3">
             <button onClick={() => setFormData({...formData, status: 'Draft'})} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">
                <Save size={16} /> Save Draft
             </button>
             <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                {loading ? "Publishing..." : <><Send size={16} /> Go Live</>}
             </button>
          </div>
        </div>

        <div className="max-w-4xl space-y-6">
           
           {/* AI Magic Box */}
           <div className="bg-purple-900/20 border border-purple-500/30 p-8 rounded-[2rem] space-y-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full" />
             <h3 className="text-purple-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><Sparkles size={16}/> AI Auto-Generator</h3>
             <div className="flex gap-4">
                <input 
                  type="text" placeholder="Enter topic (e.g., Best YouTube Titles 2026)..." 
                  value={aiTopic} onChange={(e) => setAiTopic(e.target.value)}
                  className="flex-1 bg-black border border-purple-500/20 p-5 rounded-2xl text-lg font-bold outline-none focus:border-purple-500 transition-all placeholder:text-gray-600"
                />
                <button 
                  onClick={generateWithAi} 
                  disabled={isAiLoading}
                  className="bg-purple-600 hover:bg-purple-500 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] flex items-center gap-2 whitespace-nowrap"
                >
                  {isAiLoading ? <Loader2 className="animate-spin" size={16}/> : 'Generate Magic'}
                </button>
             </div>
           </div>

           {/* Manual / Auto-filled form */}
           <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] space-y-6">
              
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">H1 Title</label>
                    <input type="text" placeholder="Post Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm font-bold outline-none focus:border-emerald-500" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">URL Slug</label>
                    <input type="text" placeholder="url-slug" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-emerald-500" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Meta Title (SEO)</label>
                    <input type="text" value={formData.metaTitle} onChange={(e) => setFormData({...formData, metaTitle: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-emerald-500" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
                    <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-emerald-500" />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Meta Description (SEO)</label>
                 <textarea rows={2} value={formData.metaDescription} onChange={(e) => setFormData({...formData, metaDescription: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-emerald-500" />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tags (Comma separated)</label>
                 <input type="text" value={formData.tags.join(', ')} onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t=>t.trim())})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-emerald-500" />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center justify-between">
                    <span>Main Content (HTML)</span>
                    <span className="text-[10px] text-gray-500">{formData.content.length} chars</span>
                 </label>
                 <textarea 
                   rows={15} placeholder="HTML Content..." 
                   value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})}
                   className="w-full bg-black border border-white/10 p-6 rounded-3xl text-sm font-mono leading-relaxed outline-none focus:border-emerald-500 text-gray-400"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cover Image URL</label>
                 <input type="text" placeholder="https://..." value={formData.coverImage} onChange={(e) => setFormData({...formData, coverImage: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm outline-none" />
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}