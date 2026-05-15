import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/private/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      {
        userAgent: 'Googlebot-News',
        allow: '/',
      },
    ],
    sitemap: 'https://seloice.com/sitemap.xml',
    host: 'https://seloice.com',
  };
}
