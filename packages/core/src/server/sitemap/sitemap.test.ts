import { describe, it, expect } from 'vitest';
import {
  normalizePath,
  isPathExcluded,
  extractWebpages,
  buildSitemapItems,
  generateSitemapXml,
} from './sitemap.utils';

describe('sitemap.utils', () => {
  describe('normalizePath', () => {
    it('ensures leading slash and removes trailing slash', () => {
      expect(normalizePath('docs')).toBe('/docs');
      expect(normalizePath('/docs/')).toBe('/docs');
      expect(normalizePath('/')).toBe('/');
      expect(normalizePath('')).toBe('/');
    });
  });

  describe('isPathExcluded', () => {
    it('matches exact paths and child paths', () => {
      expect(isPathExcluded('/cms', '/cms')).toBe(true);
      expect(isPathExcluded('/cms/', '/cms')).toBe(true);
      expect(isPathExcluded('/cms/settings', '/cms')).toBe(true);
      expect(isPathExcluded('/cm', '/cms')).toBe(false);
      expect(isPathExcluded('/docs', '/cms')).toBe(false);
    });

    it('matches wildcard patterns', () => {
      expect(isPathExcluded('/studio/forms/123', '/studio*')).toBe(true);
      expect(isPathExcluded('/studio', '/studio*')).toBe(true);
      expect(isPathExcluded('/api/v1/users', '/api/*')).toBe(true);
      expect(isPathExcluded('/home', '/api/*')).toBe(false);
    });
  });

  describe('extractWebpages', () => {
    it('extracts from webpage array', () => {
      const data = { webpage: [{ id: '1', url: '/' }, { id: '2', url: '/docs' }] };
      expect(extractWebpages(data)).toHaveLength(2);
    });

    it('extracts from single webpage object', () => {
      const data = { webpage: { id: '1', url: '/' } };
      expect(extractWebpages(data)).toHaveLength(1);
    });

    it('extracts from webpages plural key', () => {
      const data = { webpages: [{ id: '1', url: '/' }] };
      expect(extractWebpages(data)).toHaveLength(1);
    });

    it('returns empty array when no webpage present', () => {
      expect(extractWebpages({})).toEqual([]);
      expect(extractWebpages(null)).toEqual([]);
    });
  });

  describe('buildSitemapItems', () => {
    const samplePages = [
      { id: 'home', url: '/' },
      { id: 'docs', url: '/docs' },
      { id: 'cms', url: '/cms' },
      { id: 'cms-sub', url: '/cms/admin' },
      { id: 'custom-priority', url: '/pricing', priority: 0.9, changeFrequency: 'monthly' },
    ];

    it('builds canonical URLs with defaults', () => {
      const items = buildSitemapItems(samplePages, {
        baseUrl: 'https://example.com',
      });

      expect(items).toHaveLength(5);
      const home = items.find((i) => i.url === 'https://example.com');
      expect(home).toBeDefined();
      expect(home?.priority).toBe(1.0);
      expect(home?.changeFrequency).toBe('daily');

      const docs = items.find((i) => i.url === 'https://example.com/docs');
      expect(docs).toBeDefined();
      expect(docs?.priority).toBe(0.8);
      expect(docs?.changeFrequency).toBe('weekly');

      const pricing = items.find((i) => i.url === 'https://example.com/pricing');
      expect(pricing?.priority).toBe(0.9);
      expect(pricing?.changeFrequency).toBe('monthly');
    });

    it('filters excluded routes', () => {
      const items = buildSitemapItems(samplePages, {
        baseUrl: 'https://example.com',
        exclude: ['/cms', '/cms/*'],
      });

      expect(items.some((i) => i.url.includes('/cms'))).toBe(false);
      expect(items).toHaveLength(3);
    });

    it('appends additionalRoutes without duplicates', () => {
      const items = buildSitemapItems(samplePages, {
        baseUrl: 'https://example.com',
        exclude: ['/cms*'],
        additionalRoutes: [
          { url: '/blog/post-1', priority: 0.7 },
          { url: 'https://example.com/docs', priority: 0.5 }, // already exists, should not duplicate
        ],
      });

      expect(items.find((i) => i.url === 'https://example.com/blog/post-1')).toBeDefined();
      expect(items.filter((i) => i.url === 'https://example.com/docs')).toHaveLength(1);
    });

    it('creates fallback home route if list is empty and baseUrl is present', () => {
      const items = buildSitemapItems([], { baseUrl: 'https://example.com' });
      expect(items).toHaveLength(1);
      expect(items[0].url).toBe('https://example.com');
      expect(items[0].priority).toBe(1.0);
    });
  });

  describe('generateSitemapXml', () => {
    it('produces valid XML string with proper escaping', () => {
      const xml = generateSitemapXml([
        {
          url: 'https://example.com/search?q=test&page=1',
          priority: 0.8,
          changeFrequency: 'weekly',
          lastModified: new Date('2025-01-01T00:00:00.000Z'),
        },
      ]);

      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain('<loc>https://example.com/search?q=test&amp;page=1</loc>');
      expect(xml).toContain('<priority>0.8</priority>');
      expect(xml).toContain('<changefreq>weekly</changefreq>');
      expect(xml).toContain('<lastmod>2025-01-01T00:00:00.000Z</lastmod>');
    });

    it('includes alternate refs when present', () => {
      const xml = generateSitemapXml([
        {
          url: 'https://example.com/es',
          alternateRefs: [
            { href: 'https://example.com/en', hreflang: 'en' },
            { href: 'https://example.com/es', hreflang: 'es' },
          ],
        },
      ]);

      expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
      expect(xml).toContain('<xhtml:link rel="alternate" hreflang="en" href="https://example.com/en" />');
    });
  });
});
