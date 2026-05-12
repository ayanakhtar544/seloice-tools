"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit3, Trash2, Globe, EyeOff, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreateNew = async () => {
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Untitled Post',
          slug: `new-post-${Date.now()}`,
          description: '',
          content: 'Start writing your SEO content here...',
          status: 'draft',
          author: 'Seloice Team',
          category: 'Guides',
          readTime: '5 min read',
          relatedTools: [],
        }),
      });
      if (res.ok) {
        const newPost = await res.json();
        router.push(`/admin/editor/${newPost.id}`);
      }
    } catch (e) {
      alert("Failed to create post");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/admin/posts?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPosts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase">Content Engine</h1>
          <p className="text-gray-400">Manage your programmatic SEO pages and blog posts.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-[0_4px_0_0_#3730a3] active:translate-y-1 active:shadow-none"
        >
          <Plus size={18} /> New Article
        </button>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-[#0a0a0a]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="w-full bg-[#111] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading CMS...</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No posts found. Create your first article!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-gray-500 bg-[#0a0a0a]/50">
                  <th className="p-4 font-bold">Title</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold">Last Updated</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-gray-200 group-hover:text-white transition-colors">{post.title}</div>
                      <div className="text-xs text-gray-500 mt-1">/{post.slug}</div>
                    </td>
                    <td className="p-4">
                      {post.status === 'published' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase">
                          <Globe size={12} /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold uppercase">
                          <EyeOff size={12} /> Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-400">{post.category}</td>
                    <td className="p-4 text-sm text-gray-500">{new Date(post.updatedAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/editor/${post.id}`} className="p-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-lg transition-colors">
                          <Edit3 size={16} />
                        </Link>
                        <button onClick={() => handleDelete(post.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
