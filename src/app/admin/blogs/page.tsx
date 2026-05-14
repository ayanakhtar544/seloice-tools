// File: src/app/blogs/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, Heart, Calendar } from 'lucide-react';


export default function PublicBlogFeed() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      const data = await getPublishedBlogs();
      setBlogs(data);
      setLoading(false);
    }
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-[#030305] text-white pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">Seloice <span className="text-emerald-500">Insights</span></h1>
          <p className="text-gray-400 mt-4 text-sm uppercase tracking-widest font-bold">Thoughts, Updates, and Engineering Secrets</p>
        </div>

        {loading ? (
           <div className="text-center text-emerald-500 font-black animate-pulse">Loading Blogs...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, i) => (
              <motion.div 
                key={blog.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all group flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                   <img src={blog.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-400 rounded-full border border-emerald-500/30">{blog.category}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                   <h2 className="text-xl font-black tracking-tight mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">{blog.title}</h2>
                   <p className="text-sm text-gray-400 mb-6 line-clamp-3 leading-relaxed">{blog.excerpt}</p>
                   
                   <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(blog.createdAt?.toDate()).toLocaleDateString()}</span>
                      <div className="flex items-center gap-4">
                         <span className="flex items-center gap-1 text-emerald-400/80"><Eye size={14}/> {blog.views || 0}</span>
                         <span className="flex items-center gap-1 text-pink-400/80"><Heart size={14}/> {blog.likes || 0}</span>
                      </div>
                   </div>
                </div>
                <Link href={`/blogs/${blog.slug}`} className="absolute inset-0 z-10" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getPublishedBlogs() {
  throw new Error('Function not implemented.');
}
