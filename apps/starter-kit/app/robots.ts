import type { MetadataRoute } from 'next';

const baseUrl = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://contextual.site'
).replace(/\/+$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cms', '/cms/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
