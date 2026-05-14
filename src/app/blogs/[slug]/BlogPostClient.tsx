// File: src/app/blogs/[slug]/BlogPostClient.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Eye, Heart, Calendar, ArrowLeft, Share2, Clock, List, Link2, MessageCircleQuestion, Wrench } from 'lucide-react';
import Link from 'next/link';
import InArticleAd from '@/components/InArticleAd';

const TwitterIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const LinkedinIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
);

// 🚀 REAL FIREBASE LOGIC FOR VIEWS
const incrementBlogView = async (id: string) => {
  if (!id) return;
  const sessionKey = `viewed_blog_${id}`;
  if (sessionStorage.getItem(sessionKey)) return; 

  try {
    const blogRef = doc(db, 'blogs', id);
    await updateDoc(blogRef, { views: increment(1) });
    sessionStorage.setItem(sessionKey, 'true');
  } catch (error) {
    console.error("View count error:", error);
  }
};

// 🚀 REAL FIREBASE LOGIC FOR LIKES
const likeBlog = async (id: string) => {
  if (!id) return;
  const likeKey = `liked_blog_${id}`;
  if (localStorage.getItem(likeKey)) return; 

  try {
    const blogRef = doc(db, 'blogs', id);
    await updateDoc(blogRef, { likes: increment(1) });
    localStorage.setItem(likeKey, 'true');
  } catch (error) {
    console.error("Like count error:", error);
  }
};

export default function BlogPostClient({ blog: initialBlog }: { blog: any }) {
  const [blog, setBlog] = useState(initialBlog);
  const [liked, setLiked] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(`viewed_${blog.id}`)) incrementBlogView(blog.id);
    if (localStorage.getItem(`liked_blog_${blog.id}`)) setLiked(true);

    const textLength = blog.content?.replace(/<[^>]*>?/gm, '').split(/\s+/).length || 0;
    setReadingTime(Math.ceil(textLength / 200));

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}`;
      setScrollProgress(Number(scroll));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [blog.id, blog.content]);

  // 🚀 HANDLE LIKE CLICK (With Animation State)
  const handleLike = async () => {
    if (!liked && !isLiking) {
      setIsLiking(true);
      setLiked(true);
      setBlog({ ...blog, likes: (blog.likes || 0) + 1 }); 
      await likeBlog(blog.id); 
      setIsLiking(false);
    }
  };

  const shareUrl = `https://seloice.com/blogs/${blog.slug}`;
  const shareText = `Check out this amazing article on Seloice: ${blog.title}`;
  const copyLink = () => { navigator.clipboard.writeText(shareUrl); alert('Link copied to clipboard! 📋'); };

  return (
    <>
      <div className="fixed top-0 left-0 h-1 bg-emerald-500 z-[100] transition-all duration-150" style={{ width: `${scrollProgress}%` }} />

      {/* 🚀 FLOATING PRIMARY FOCUS LIKE BUTTON */}
      <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-50">
        <button 
          onClick={handleLike} 
          disabled={liked || isLiking}
          className={`flex items-center justify-center p-4 md:p-5 rounded-full shadow-2xl transition-all duration-500 ease-out transform ${
            liked 
            ? 'bg-rose-500 text-white scale-110 shadow-[0_0_40px_rgba(244,63,94,0.6)] rotate-12' 
            : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:scale-110 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] animate-pulse'
          }`}
        >
          <Heart size={28} className={`${liked ? 'fill-white' : ''} transition-all duration-300`} />
          <span className="absolute -top-3 -right-3 bg-black border border-white/20 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg">
            {blog.likes || 0}
          </span>
        </button>
      </div>

      <div className="min-h-screen bg-[#030305] text-white pt-24 pb-32">
        <article className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/blogs" className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest mb-10 transition-colors">
            <ArrowLeft size={14} /> Back to Insights
          </Link>

          <header className="mb-10 text-center max-w-3xl mx-auto">
            <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 mb-6 inline-block">
              {blog.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">{blog.title}</h1>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6">
              <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(blog.createdAt || Date.now()).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              <span className="flex items-center gap-1 text-emerald-400"><Clock size={14}/> {readingTime} Min Read</span>
              <span className="flex items-center gap-1"><Eye size={14}/> {blog.views || 0} Views</span>
            </div>
          </header>

          {blog.coverImage && (
            <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl relative group">
              <img src={blog.coverImage} alt={`${blog.title} - Seloice Blog`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative">
             <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-32 space-y-6">
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

             <div className="lg:col-span-3">
                <div 
                  className="prose prose-invert prose-emerald max-w-none text-gray-300 leading-relaxed font-medium md:text-lg article-content"
                  dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }} 
                />

                <InArticleAd />

                {/* 🚀 MASSIVE IN-PAGE LIKE SECTION */}
                <div className="mt-20 p-8 md:p-12 bg-gradient-to-br from-rose-500/10 to-indigo-500/10 border border-rose-500/20 rounded-[2rem] flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 blur-[100px] rounded-full pointer-events-none" />
                  
                  <h2 className="text-3xl font-black mb-4">Did you find this helpful?</h2>
                  <p className="text-gray-400 mb-8 max-w-md">Your support means the world to us. Drop a like to help us create more high-quality content for you!</p>
                  
                  <button 
                    onClick={handleLike} 
                    disabled={liked || isLiking} 
                    className={`relative z-10 flex items-center gap-3 px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm transition-all duration-300 ${
                      liked 
                      ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-[0_0_40px_rgba(244,63,94,0.5)] scale-105' 
                      : 'bg-white text-black hover:bg-gray-200 hover:scale-105 shadow-xl'
                    }`}
                  >
                    <Heart size={20} className={`${liked ? "fill-white text-white animate-pulse" : "text-rose-500 fill-rose-500"}`} /> 
                    {liked ? "You Loved This!" : `Smash the Like Button (${blog.likes || 0})`}
                  </button>
                </div>
             </div>
          </div>
        </article>
      </div>
    </>
  );
}