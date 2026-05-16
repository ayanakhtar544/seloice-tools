import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    host: 'https://seloice.com',
    sitemap: 'https://seloice.com/sitemap.xml',
  };
}
