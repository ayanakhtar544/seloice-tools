// File: src/app/admin/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Eye, FileText, PlusCircle, ArrowUpRight, Activity } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { getAllBlogsAdmin } from '@/lib/blogService';

// 🛠️ Strict TypeScript Interface
interface Blog {
  id: string;
  title: string;
  slug: string;
  category: string;
  views?: number;
  likes?: number;
  status: string;
  createdAt?: any;
}

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalBlogs: 0, totalViews: 0, totalLikes: 0 });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const data = await getAllBlogsAdmin() as Blog[];
        setBlogs(data);
        
        let views = 0; 
        let likes = 0;

        data.forEach(blog => {
          views += (blog.views || 0);
          likes += (blog.likes || 0);
        });
        
        setStats({ totalBlogs: data.length, totalViews: views, totalLikes: likes });
      } catch (error) {
        console.error("Error loading admin data", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-[#030305] text-white flex overflow-hidden font-sans">
      <AdminSidebar />
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen no-scrollbar relative">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* 1. Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
              Welcome, <span className="text-emerald-500 italic">Abushahma!</span> 👑
            </h1>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Live Firebase Dashboard</p>
          </div>
          <Link href="/admin/blogs/new" className="flex items-center justify-center gap-2 bg-emerald-600 text-white hover:bg-emerald-500 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_4px_0_0_#047857] active:translate-y-1 active:shadow-none">
            <PlusCircle size={16} /> Write New Post
          </Link>
        </div>

        {/* 2. LIVE STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Blogs" value={loading ? "..." : stats.totalBlogs} icon={<FileText size={20}/>} color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20" />
          <StatCard title="Total Views" value={loading ? "..." : stats.totalViews} icon={<Eye size={20}/>} color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
          <StatCard title="Total Likes" value={loading ? "..." : stats.totalLikes} icon={<Activity size={20}/>} color="text-pink-400" bg="bg-pink-500/10" border="border-pink-500/20" />
        </div>

        {/* 3. LIVE RECENT BLOGS TABLE */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black uppercase tracking-widest text-gray-300">Live Published Content</h2>
          </div>
          
          <div className="overflow-x-auto no-scrollbar">
            {/* PROPER HTML TABLE STRUCTURE ADDED HERE */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-gray-500">
                  <th className="pb-4 font-black">Title</th>
                  <th className="pb-4 font-black">Category</th>
                  <th className="pb-4 font-black text-center">Views</th>
                  <th className="pb-4 font-black text-center">Likes</th>
                  <th className="pb-4 font-black text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {blogs.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">No blogs found. Start writing!</td>
                  </tr>
                )}
                {blogs.map((blog) => (
                  <tr key={blog.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 text-white font-bold truncate pr-4 max-w-[200px]">
                        <Link href={`/blogs/${blog.slug}`} target="_blank" className="hover:text-emerald-400">{blog.title}</Link>
                    </td>
                    <td className="py-4 text-gray-400 text-xs">{blog.category}</td>
                    <td className="py-4 text-emerald-400 text-center font-mono text-xs">{blog.views || 0}</td>
                    <td className="py-4 text-pink-400 text-center font-mono text-xs">{blog.likes || 0}</td>
                    <td className="py-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${blog.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/10 text-gray-400'}`}>
                        {blog.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// 🛠️ Helper Component for Stats Cards
function StatCard({title, value, icon, color, bg, border}: any) {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem]">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${bg} ${border} border ${color}`}>{icon}</div>
      <h3 className="text-3xl font-black mb-1">{value}</h3>
      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{title}</p>
    </div>
  );
}