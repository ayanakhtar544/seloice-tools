import type { MetadataRoute } from 'next';
import {
  BASE,
  STATIC_ROUTES,
  getBlogSlugs,
  getStaticRouteLastModified,
  getToolLastModified,
  getToolSlugsFromFilesystem,
  getUseCaseSlugsForSitemap,
} from '@/lib/seo/sitemap-data';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticLastModified = getStaticRouteLastModified();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE}${route.path}`,
    lastModified: staticLastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const toolEntries: MetadataRoute.Sitemap = getToolSlugsFromFilesystem().map(
    (slug) => ({
      url: `${BASE}/tools/${slug}`,
      lastModified: getToolLastModified(slug),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  );

  const useCaseEntries: MetadataRoute.Sitemap = getUseCaseSlugsForSitemap().map(
    (slug) => ({
      url: `${BASE}/use-cases/${slug}`,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 0.75,
    })
  );

  const blogEntries: MetadataRoute.Sitemap = getBlogSlugs().map((post) => ({
    url: `${BASE}/blogs/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : staticLastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticEntries, ...toolEntries, ...useCaseEntries, ...blogEntries];
}
