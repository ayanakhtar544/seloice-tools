// File: src/app/admin/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Eye, FileText, PlusCircle, ArrowUpRight, Activity } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { getAllBlogsAdmin } from '@/lib/blogService';

// 🛠️ Step 1: Define Blog Interface (Strict Typing)
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
  // 🛠️ Step 2: Set the type for state
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
          // 🛠️ Step 3: Use safe access with Fallbacks
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
         {/* ... rest of your code ... */}
         {/* Table row logic remains same but now it's type-safe */}
         {blogs.map((blog) => (
            <tr key={blog.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-4 font-bold">{blog.title}</td>
                <td className="py-4 text-emerald-400 text-center">{blog.views || 0}</td>
                {/* ... rest of the table ... */}
            </tr>
         ))}
      </main>
    </div>
  );
}