import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://seloicetools.com';

  const sitemapData: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Dynamically add all programmatic SEO pages
  const seoPagesPath = path.join(process.cwd(), 'src', 'data', 'seo-pages.json');
  if (fs.existsSync(seoPagesPath)) {
    const seoPages = JSON.parse(fs.readFileSync(seoPagesPath, 'utf-8'));
    for (const page of seoPages) {
      sitemapData.push({
        url: `${baseUrl}/p/${page.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // Dynamically add all tool pages
  const toolsDir = path.join(process.cwd(), 'src', 'app', 'tools');
  if (fs.existsSync(toolsDir)) {
    const toolDirs = fs.readdirSync(toolsDir).filter(f => {
      return fs.statSync(path.join(toolsDir, f)).isDirectory();
    });

    for (const tool of toolDirs) {
      sitemapData.push({
        url: `${baseUrl}/tools/${tool}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9, // High priority for tool pages
      });
    }
  }

  // Dynamically add all blog posts
  const blogPostsPath = path.join(process.cwd(), 'src', 'data', 'blog-posts.json');
  if (fs.existsSync(blogPostsPath)) {
    const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf-8'));
    for (const post of blogPosts) {
      sitemapData.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
    // Add the blog index
    sitemapData.push({
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    });
  }

  return sitemapData;
}
