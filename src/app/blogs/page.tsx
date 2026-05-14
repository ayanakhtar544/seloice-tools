import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import blogPosts from '@/data/blog-db.json';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creator Growth Blog | Seloice Tools',
  description: 'Learn how to go viral, monetize your audience, and optimize your videos with our expert creator guides.',
  alternates: { canonical: 'https://seloice.com/blogs' }
};

export default function BlogIndexPage() {
  const publishedPosts = blogPosts.filter((post: any) => post.status === 'published');

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-4 max-w-5xl mx-auto w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-indigo-500/10 border border-pink-500/30 text-pink-400 text-xs font-black uppercase tracking-widest mb-8">
            <BookOpen size={14} className="fill-pink-400/20" /> The Creator Library
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 uppercase">
            Growth <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-500">Guides</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
            Expert tutorials, monetization strategies, and viral growth hacks for modern content creators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publishedPosts.map((post: any) => (
            <Link key={post.slug} href={`/blogs/${post.slug}`}>
              <article className="group bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 h-full flex flex-col hover:bg-[#111] hover:border-indigo-500/30 transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {post.image && (
                  <div className="w-full h-48 mb-6 rounded-xl overflow-hidden border border-white/10 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">
                  <span>{post.category}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-600" />
                  <span className="text-gray-500">{post.readTime}</span>
                </div>
                
                <h2 className="text-2xl font-black text-gray-100 group-hover:text-white mb-3 line-clamp-2 leading-tight">
                  {post.title}
                </h2>
                
                <p className="text-gray-500 text-sm mb-8 line-clamp-3">
                  {post.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="text-xs font-bold text-gray-400">{post.author}</div>
                  <ArrowRight className="text-gray-600 group-hover:text-indigo-400 transition-colors" size={18} />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
