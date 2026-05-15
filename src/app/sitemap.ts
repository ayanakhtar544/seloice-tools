import { MetadataRoute } from 'next';
import {
  BASE,
  STATIC_ROUTES,
  getUseCaseSlugsForSitemap,
  getBlogSlugs,
  getProgrammaticSlugs,
  getToolSlugsFromFilesystem,
} from '@/lib/seo/sitemap-data';

export async function generateSitemaps() {
  const allProgrammatic = getProgrammaticSlugs();
  const chunkSize = 40000;
  const chunks = Math.ceil(allProgrammatic.length / chunkSize);
  const sitemaps = [{ id: 0 }]; // For static routes + tools + blogs
  
  for (let i = 0; i < chunks; i++) {
    sitemaps.push({ id: i + 1 });
  }
  
  return sitemaps;
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  if (id === 0) {
    for (const route of STATIC_ROUTES) {
      entries.push({
        url: `${BASE}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }

    for (const slug of getToolSlugsFromFilesystem()) {
      entries.push({
        url: `${BASE}/tools/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }

    for (const slug of getUseCaseSlugsForSitemap()) {
      entries.push({
        url: `${BASE}/use-cases/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.75,
      });
    }

    for (const post of getBlogSlugs()) {
      entries.push({
        url: `${BASE}/blogs/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
    return entries;
  }

  // Handle programmatic chunk
  const allProgrammatic = getProgrammaticSlugs();
  const chunkSize = 40000;
  const startIndex = (id - 1) * chunkSize;
  const chunk = allProgrammatic.slice(startIndex, startIndex + chunkSize);

  for (const slug of chunk) {
    entries.push({
      url: `${BASE}/use-cases/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  return entries;
}
