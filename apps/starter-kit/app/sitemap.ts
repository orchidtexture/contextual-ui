import type { MetadataRoute } from 'next';
import { siteApp } from '@/data/site.server';

const baseUrl = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://contextual.site'
).replace(/\/+$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await siteApp.fetchData();
  const rawWebpages = Array.isArray(data?.webpage)
    ? data.webpage
    : data?.webpage
    ? [data.webpage]
    : [];

  const webpages = rawWebpages
    .filter(
      (page): page is typeof page & { url: string } =>
        typeof page?.url === 'string' && page.url.length > 0
    )
    .filter((page) => {
      const normalizedPath = page.url.startsWith('/') ? page.url : `/${page.url}`;
      return normalizedPath !== '/cms' && !normalizedPath.startsWith('/cms/') && page.id !== 'cms';
    });

  if (webpages.length > 0) {
    return webpages.map((page) => {
      const path = page.url.startsWith('/') ? page.url : `/${page.url}`;
      const isHome = path === '/';

      return {
        url: `${baseUrl}${path === '/' ? '' : path}`,
        lastModified: new Date(),
        changeFrequency: isHome ? 'daily' : 'weekly',
        priority: isHome ? 1.0 : 0.8,
      };
    });
  }

  // Default fallback routes (excluding CMS)
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/schema`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}
