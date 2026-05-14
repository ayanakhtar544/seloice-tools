// File: src/app/blogs/[slug]/BlogPostClient.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { incrementBlogView, likeBlog } from '@/lib/blogService';
import { Eye, Heart, Calendar, ArrowLeft, Share2, Clock, List, Link2, MessageCircleQuestion, Wrench } from 'lucide-react';
import Link from 'next/link';

const TwitterIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const LinkedinIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
);

export default function BlogPostClient({ blog: initialBlog }: { blog: any }) {
  const [blog, setBlog] = useState(initialBlog);
  const [liked, setLiked] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // 1. View Tracking
    if (!sessionStorage.getItem(`viewed_${blog.id}`)) {
       incrementBlogView(blog.id);
       sessionStorage.setItem(`viewed_${blog.id}`, 'true');
    }

    // 2. Reading Time Calculation
    const textLength = blog.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
    setReadingTime(Math.ceil(textLength / 200));

    // 3. Scroll Progress Bar
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}`;
      setScrollProgress(Number(scroll));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [blog.id, blog.content]);

  const handleLike = async () => {
    if (!liked) {
      setLiked(true);
      setBlog({ ...blog, likes: (blog.likes || 0) + 1 }); 
      await likeBlog(blog.id); 
    }
  };

  const shareUrl = `https://seloice.com/blogs/${blog.slug}`;
  const shareText = `Check out this amazing article on Seloice: ${blog.title}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <>
      {/* 🚀 SEO Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-emerald-500 z-[100] transition-all duration-150" style={{ width: `${scrollProgress}%` }} />

      <div className="min-h-screen bg-[#030305] text-white pt-24 pb-32">
        <article className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <Link href="/blogs" className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest mb-10 transition-colors">
            <ArrowLeft size={14} /> Back to Insights
          </Link>

          {/* Header */}
          <header className="mb-10 text-center max-w-3xl mx-auto">
            <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 mb-6 inline-block">
              {blog.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">{blog.title}</h1>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6">
              <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(blog.createdAt?.toDate() || Date.now()).toLocaleDateString()}</span>
              <span className="flex items-center gap-1 text-emerald-400"><Clock size={14}/> {readingTime} Min Read</span>
              <span className="flex items-center gap-1"><Eye size={14}/> {blog.views || 0} Views</span>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {blog.tags.map((tag: string, i: number) => (
                  <span key={i} className="text-[9px] uppercase tracking-widest font-black px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-400">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Cover Image */}
          {blog.coverImage && (
            <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl relative group">
              <img src={blog.coverImage} alt={`${blog.title} - Seloice Blog`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative">
             
             {/* 🚀 Sidebar & Sharing */}
             <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-32 space-y-6">
                   <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                      <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2 mb-4"><List size={16}/> Quick Read</h3>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-medium">Scroll down to explore the core concepts, code breakdowns, and deep insights from this article.</p>
                   </div>
                   
                   {/* Share Buttons */}
                   <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col gap-3">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Share Article</h3>
                      <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] rounded-xl text-xs font-bold transition-colors">
                        <TwitterIcon size={14} /> Twitter
                      </a>
                      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 bg-[#0077B5]/10 hover:bg-[#0077B5]/20 text-[#0077B5] rounded-xl text-xs font-bold transition-colors">
                        <LinkedinIcon size={14} /> LinkedIn
                      </a>
                      <button onClick={copyLink} className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-colors">
                        <Link2 size={14} /> Copy Link
                      </button>
                   </div>
                </div>
             </div>

             {/* 🚀 Main Content */}
             <div className="lg:col-span-3">
                <div 
                  className="prose prose-invert prose-emerald max-w-none text-gray-300 leading-relaxed font-medium md:text-lg article-content"
                  dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }} 
                />

                {/* 🚀 AI FAQs Section */}
                {blog.faqs && blog.faqs.length > 0 && (
                  <div className="mt-16 pt-12 border-t border-white/10">
                    <h2 className="text-2xl font-black flex items-center gap-3 mb-8 text-white"><MessageCircleQuestion className="text-emerald-500" /> Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      {blog.faqs.map((faq: any, idx: number) => (
                        <div key={idx} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:border-emerald-500/30 transition-colors">
                          <h3 className="text-lg font-bold text-emerald-400 mb-2">{faq.question}</h3>
                          <p className="text-sm text-gray-400 leading-relaxed">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 🚀 Related Tools */}
                {blog.relatedTools && blog.relatedTools.length > 0 && (
                  <div className="mt-16 bg-emerald-900/10 border border-emerald-500/20 p-8 rounded-[2rem]">
                    <h2 className="text-xl font-black flex items-center gap-3 mb-6 text-white"><Wrench className="text-emerald-500" /> Creator Tools You Might Like</h2>
                    <div className="flex flex-wrap gap-4">
                      {blog.relatedTools.map((tool: string, idx: number) => (
                        <Link href={`/tools/${tool}`} key={idx} className="px-5 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/50 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                          Open {tool.replace(/-/g, ' ')}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Engagement Section */}
                <div className="mt-20 pt-10 border-t border-white/10 flex flex-col items-center justify-center gap-8">
                  <button onClick={handleLike} disabled={liked} className={`flex items-center gap-3 px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all duration-300 ${liked ? 'bg-pink-500 text-white shadow-[0_0_30px_rgba(236,72,153,0.5)] scale-105' : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-pink-400'}`}>
                    <Heart size={16} className={liked ? "fill-white" : ""} /> {liked ? "Loved It!" : `Like Article (${blog.likes || 0})`}
                  </button>
                  
                  {/* Mobile Share Buttons */}
                  <div className="flex lg:hidden items-center gap-4">
                     <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noreferrer" className="p-3 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-xl"><TwitterIcon size={18} /></a>
                     <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noreferrer" className="p-3 bg-[#0077B5]/10 text-[#0077B5] rounded-xl"><LinkedinIcon size={18} /></a>
                     <button onClick={copyLink} className="p-3 bg-white/10 text-white rounded-xl"><Link2 size={18} /></button>
                  </div>
                </div>
             </div>
          </div>

        </article>
      </div>
    </>
  );
}