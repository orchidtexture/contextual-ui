import type { MetadataRoute } from 'next';
import { siteApp } from '@/data/site.server';

const baseUrl = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://contextual.site'
).replace(/\/+$/, '');

export default async function robots(): Promise<MetadataRoute.Robots> {
  return siteApp.getRobots({
    baseUrl,
    disallow: ['/cms', '/cms/'],
  });
}

