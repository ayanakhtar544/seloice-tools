import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmartLinks from '@/components/SmartLinks';
import blogPosts from '@/data/blog-db.json';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Clock, User } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export async function generateStaticParams() {
  const publishedPosts = blogPosts.filter((p: any) => p.status === 'published');
  return publishedPosts.map((post: any) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post: any = blogPosts.find((p: any) => p.slug === resolvedParams.slug && p.status === 'published');

  if (!post) {
    return { title: 'Post Not Found' };
  }

  const url = `https://seloicetools.com/blog/${post.slug}`;
  const ogImageUrl = post.image || `https://seloicetools.com/api/og?title=${encodeURIComponent(post.title)}&badge=Creator%20Guide`;

  return {
    title: `${post.title} | Seloice Tools`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url: url,
      type: 'article',
      publishedTime: post.createdAt,
      authors: [post.author],
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post: any = blogPosts.find((p: any) => p.slug === resolvedParams.slug && p.status === 'published');

  if (!post) {
    notFound();
  }

  const url = `https://seloicetools.com/blog/${post.slug}`;
  const ogImageUrl = post.image || `https://seloicetools.com/api/og?title=${encodeURIComponent(post.title)}&badge=Creator%20Guide`;

  // Article JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "image": ogImageUrl,
    "datePublished": post.createdAt,
    "author": [{
        "@type": "Person",
        "name": post.author,
        "url": "https://seloicetools.com"
      }],
    "publisher": {
      "@type": "Organization",
      "name": "Seloice Tools",
      "logo": {
        "@type": "ImageObject",
        "url": "https://seloicetools.com/logo.png"
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 font-sans flex flex-col">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="flex-grow pt-32 pb-24 px-4 w-full max-w-3xl mx-auto">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="opacity-50">/</span>
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <span className="opacity-50">/</span>
          <span className="text-gray-300 line-clamp-1">{post.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6">
            {post.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-gray-400 font-medium mb-8 leading-relaxed">
            {post.description}
          </p>

          {/* Author & Meta (EEAT Signals) */}
          <div className="flex flex-wrap items-center gap-6 py-6 border-y border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-black">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1">
                  {post.author} <User size={12} className="text-indigo-400" />
                </div>
                <div className="text-xs text-gray-500">Verified Expert</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock size={16} className="text-gray-500" />
              {post.readTime}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="w-full mb-12 rounded-2xl overflow-hidden border border-white/10 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt={post.title} className="w-full h-auto" />
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-invert prose-indigo max-w-none prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-h2:text-3xl prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-lg mb-16">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>

        {/* Smart Internal Linking */}
        <SmartLinks currentBlog={post.slug} />
        
      </main>

      <Footer />
    </div>
  );
}
