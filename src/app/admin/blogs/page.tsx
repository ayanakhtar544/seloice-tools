// File: src/app/admin/blogs/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { Plus, Search, Edit3, Trash2, Eye, Heart, FileText, Loader2, Sparkles } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

// 🛠️ TypeScript Interface
interface Blog {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: string;
  views?: number;
  likes?: number;
  createdAt?: any;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // 🚀 SENIOR DEV FETCH LOGIC: Get all blogs safely
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const blogsRef = collection(db, 'blogs');
      const q = query(blogsRef, orderBy('createdAt', 'desc')); 
      const snapshot = await getDocs(q);
      
      const fetchedBlogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Blog[];
      
      setBlogs(fetchedBlogs);
    } catch (error) {
      console.error("[ERROR] Blogs fetch fail ho gaye:", error);
      try {
        const fallbackSnapshot = await getDocs(collection(db, 'blogs'));
        setBlogs(fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Blog[]);
      } catch (fallbackError) {
        alert("Blogs load nahi ho paaye. Check your connection!");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Kya tum sach mein "${title}" ko delete karna chahte ho? Ye wapas nahi aayega!`)) return;
    
    setIsDeleting(id);
    try {
      await deleteDoc(doc(db, 'blogs', id));
      setBlogs(blogs.filter(blog => blog.id !== id));
      alert("Blog successfully delete ho gaya! 🗑️");
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Delete karne mein problem aayi.");
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-shell min-h-dvh bg-[#030305] text-white flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-12 md:h-screen overflow-y-auto no-scrollbar">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
              Manage <span className="text-emerald-500 italic">Blogs</span>
              <Sparkles className="text-emerald-500 w-8 h-8" />
            </h1>
            <p className="text-gray-500 font-medium">Control your entire content ecosystem from here.</p>
          </div>
          
          <Link href="/admin/blogs/new">
            <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-1">
              <Plus size={18} /> Create New Post
            </button>
          </Link>
        </div>

        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-3xl mb-8 flex items-center gap-4 focus-within:border-emerald-500/50 transition-colors">
          <Search className="text-gray-500 ml-2" size={20} />
          <input 
            type="text" 
            placeholder="Search by title or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-600 font-medium text-sm"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="animate-spin text-emerald-500 w-12 h-12" />
            <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Fetching your awesome content...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-16 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <FileText className="text-gray-600 w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No blogs found</h3>
            <p className="text-gray-500 max-w-sm mb-8">You haven't written any posts that match your search yet. Start typing!</p>
            <Link href="/admin/blogs/new">
              <button className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors underline underline-offset-4">
                Write your first blog
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div key={blog.id} className="group bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] p-6 rounded-3xl transition-all duration-300 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                    blog.status?.toLowerCase() === 'published' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  }`}>
                    {blog.status || 'Draft'}
                  </span>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                    {blog.category || 'Tech'}
                  </span>
                </div>

                <h3 className="text-lg font-bold leading-tight mb-6 line-clamp-2 text-gray-100 group-hover:text-emerald-400 transition-colors">
                  {blog.title}
                </h3>

                <div className="mt-auto">
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-6 font-medium">
                    <div className="flex items-center gap-2">
                      <Eye size={16} /> {blog.views || 0}
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart size={16} className="text-rose-500/50" /> {blog.likes || 0}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <Link href={`/admin/blogs/edit/${blog.id}`} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase">
                      <Edit3 size={14} /> Edit
                    </Link>
                    
                    <button 
                      onClick={() => handleDelete(blog.id, blog.title)}
                      disabled={isDeleting === blog.id}
                      className="text-gray-500 hover:text-rose-500 transition-colors flex items-center gap-2 text-xs font-bold uppercase disabled:opacity-50"
                    >
                      {isDeleting === blog.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} 
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
