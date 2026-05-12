"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Image as ImageIcon, CheckCircle2, Globe, EyeOff, LayoutTemplate } from 'lucide-react';

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetch('/api/admin/posts')
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: any) => p.id === id);
        if (found) setPost(found);
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
    } catch (e) {
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setPost({ ...post, image: data.url });
      }
    } catch (error) {
      alert('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) return <div className="p-12 text-gray-500">Loading editor...</div>;
  if (!post) return <div className="p-12 text-red-500">Post not found</div>;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      
      {/* Editor Main Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="font-bold text-sm text-gray-400">Editing: {post.title}</div>
              <div className="text-xs text-gray-600 font-mono">ID: {post.id}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setPost({ ...post, status: post.status === 'published' ? 'draft' : 'published' })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${post.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}
            >
              {post.status === 'published' ? <><Globe size={16} /> Published</> : <><EyeOff size={16} /> Draft</>}
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-bold transition-all"
            >
              {saving ? <span className="animate-pulse">Saving...</span> : <><Save size={16} /> Save Post</>}
            </button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto w-full p-8 flex flex-col gap-6">
          <input 
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            placeholder="Article Title..."
            className="w-full bg-transparent text-5xl font-black italic tracking-tighter placeholder:text-white/20 focus:outline-none focus:ring-0 border-none px-0"
          />
          
          <div className="flex items-center gap-2 text-gray-500 font-mono text-sm border-b border-white/10 pb-6">
            <span>seloicetools.com/blog/</span>
            <input 
              type="text"
              value={post.slug}
              onChange={(e) => setPost({ ...post, slug: e.target.value.toLowerCase().replace(/\\s+/g, '-') })}
              className="bg-transparent focus:outline-none focus:text-white transition-colors"
            />
          </div>

          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            placeholder="Write your amazing content in Markdown here..."
            className="w-full min-h-[500px] bg-transparent text-lg text-gray-300 leading-relaxed placeholder:text-white/10 focus:outline-none resize-y font-sans"
          />
        </div>
      </div>

      {/* SEO Settings Sidebar */}
      <aside className="w-80 bg-[#0a0a0a] border-l border-white/10 overflow-y-auto p-6 space-y-8 hidden lg:block">
        <div>
          <h3 className="font-bold flex items-center gap-2 mb-4 text-sm uppercase tracking-widest text-gray-400"><LayoutTemplate size={16}/> SEO Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Meta Description</label>
              <textarea 
                value={post.description}
                onChange={e => setPost({...post, description: e.target.value})}
                className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-sm text-gray-300 focus:border-indigo-500 focus:outline-none min-h-[100px]"
                placeholder="Highly optimized 160 char description..."
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
              <input 
                type="text"
                value={post.category}
                onChange={e => setPost({...post, category: e.target.value})}
                className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-sm text-gray-300 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Author</label>
              <input 
                type="text"
                value={post.author}
                onChange={e => setPost({...post, author: e.target.value})}
                className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-sm text-gray-300 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Read Time</label>
              <input 
                type="text"
                value={post.readTime}
                onChange={e => setPost({...post, readTime: e.target.value})}
                className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-sm text-gray-300 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold flex items-center gap-2 mb-4 text-sm uppercase tracking-widest text-gray-400"><ImageIcon size={16}/> Featured Image</h3>
          {post.image ? (
            <div className="relative group rounded-xl overflow-hidden border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt="Featured" className="w-full h-auto" />
              <button onClick={() => setPost({...post, image: null})} className="absolute top-2 right-2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <CheckCircle2 className="text-white" size={16}/>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="text-gray-500 mb-2" size={24} />
                <p className="text-xs text-gray-500 font-bold">{uploadingImage ? 'Uploading...' : 'Click to upload image'}</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
            </label>
          )}
        </div>
      </aside>
    </div>
  );
}
