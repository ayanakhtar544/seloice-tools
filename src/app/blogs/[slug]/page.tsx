// File: src/app/blogs/[slug]/page.tsx
import React from 'react';
import { getBlogBySlug } from '@/lib/blogService';
import { Metadata } from 'next';
import BlogPostClient from './BlogPostClient';
import { notFound } from 'next/navigation';

// 🛠️ Step 1: Define Blog Interface for Strict Typing
interface FAQ {
  question: string;
  answer: string;
}

interface Blog {
  id: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: string;
  tags?: string[];
  faqs?: FAQ[];
  relatedTools?: string[];
  ogDescription?: string;
  author?: string;
  coverImage?: string;
  // 🔥 THE FIX 1: Ab createdAt function nahi, normal string hai
  createdAt?: string; 
}

// ==========================================
// 🚀 ADVANCED SEO ENGINE (Server-Side)
// ==========================================
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const blog = (await getBlogBySlug(slug)) as Blog | null;
  
  if (!blog) return { title: 'Blog Not Found | Seloice' };

  const title = blog.metaTitle || blog.title || 'Seloice Insights';
  const description = blog.metaDescription || blog.excerpt || blog.content?.substring(0, 150).replace(/<[^>]*>?/gm, '') + '...';
  const coreKeywords = title.split(' ').map((word) => word.toLowerCase()).filter((w) => w.length > 4).join(', ');
  const tagsList = blog.tags?.join(', ') || '';

  return {
    title: `${title} | Seloice Insights`,
    description,
    keywords: `seloice, ${blog.category?.toLowerCase() || 'tech'}, ${tagsList}, ${coreKeywords}, software development, saas, tech blog`,
    authors: [{ name: blog.author || 'Abushahma' }],
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    openGraph: {
      title,
      description: blog.ogDescription || description,
      url: `https://seloice.com/blogs/${blog.slug}`,
      siteName: 'Seloice Ecosystem',
      images: [{ url: blog.coverImage || 'https://seloice.com/default-og.jpg', width: 1200, height: 630, alt: title }],
      type: 'article',
      // 🔥 THE FIX 2: toDate() hata diya, direct string use ki hai
      publishedTime: blog.createdAt || new Date().toISOString(),
      authors: [blog.author || 'Abushahma'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: blog.ogDescription || description,
      images: [blog.coverImage || 'https://seloice.com/default-og.jpg'],
    },
    alternates: {
      canonical: `https://seloice.com/blogs/${blog.slug}`,
    },
  };
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const blog = (await getBlogBySlug(slug)) as Blog | null;

  if (!blog) return notFound();

  // 🔥 THE FIX 3: toDate() hata diya yahan se bhi
  const publishDate = blog.createdAt || new Date().toISOString();

  // 🧠 1. ARTICLE SCHEMA
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://seloice.com/blogs/${blog.slug}` },
    "headline": blog.title,
    "description": blog.metaDescription || blog.excerpt || "",
    "image": blog.coverImage || "",  
    "author": { "@type": "Person", "name": blog.author || "Abushahma", "url": "https://seloice.com" },  
    "publisher": { "@type": "Organization", "name": "Seloice", "logo": { "@type": "ImageObject", "url": "https://seloice.com/favicon.png" } },
    "datePublished": publishDate,
    "dateModified": publishDate
  };

  // 🧠 2. BREADCRUMB SCHEMA
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://seloice.com" },
      { "@type": "ListItem", "position": 2, "name": "Blogs", "item": "https://seloice.com/blogs" },
      { "@type": "ListItem", "position": 3, "name": blog.title, "item": `https://seloice.com/blogs/${blog.slug}` }
    ]
  };

  // 🧠 3. FAQ SCHEMA (Dynamic)
  let faqSchema = null;
  if (blog.faqs && blog.faqs.length > 0) {
    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": blog.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <BlogPostClient blog={blog} />
    </>
  );
}