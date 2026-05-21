import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/*?*', // Disallow dynamic query parameters to prevent duplicate content crawling
          '/cgi-bin/',
        ],
      },
      {
        // Explicitly allow helpful AI crawlers to scan for indices while preventing content scraping
        userAgent: ['GPTBot', 'ChatGPT-User', 'PerplexityBot', 'Applebot-Extended'],
        allow: '/',
        disallow: ['/api/', '/admin/'],
      }
    ],
    host: 'https://seloice.com',
    sitemap: 'https://seloice.com/sitemap.xml',
  };
}
