import { describe, it, expect } from 'vitest';
import { createContextualApp } from './createContextualApp';
import { defineSchema } from '../registry/defineSchema';
import { websiteRegistry } from '../components/website/website.utils';
import { webpageRegistry } from '../components/webpage/webpage.utils';
import { faqRegistry } from '../components/faq/faq.utils';

describe('createContextualApp with baseUrl', () => {
  const schema = defineSchema({
    website: websiteRegistry(),
    webpage: webpageRegistry(),
    faq: faqRegistry(),
  });

  const connector = {
    async fetchData() {
      return {
        website: {
          name: 'Contextual UI',
          url: 'https://contextual.site',
        },
        webpage: {
          name: 'Contextual UI - Home',
          url: 'https://contextual.site',
        },
        faq: [
          { id: '1', question: 'What is this?', answer: 'A test.' },
        ],
      };
    },
  };

  it('uses baseUrl provided to createContextualApp for canonical graph building', async () => {
    const app = createContextualApp({
      schema,
      connector,
      baseUrl: 'https://contextual.site',
    });

    const graph = await app.getGraph({ includeAll: true });

    const websiteNode = graph['@graph'].find((node: any) => node['@type'] === 'WebSite');
    expect(websiteNode).toBeDefined();
    expect(websiteNode?.['@id']).toBe('https://contextual.site/#website');
    expect(websiteNode?.url).toBe('https://contextual.site');

    const webpageNode = graph['@graph'].find((node: any) => node['@type'] === 'WebPage');
    expect(webpageNode).toBeDefined();
    expect(webpageNode?.['@id']).toBe('https://contextual.site/#webpage');
    expect(webpageNode?.isPartOf).toEqual({ '@id': 'https://contextual.site/#website' });

    const faqNode = graph['@graph'].find((node: any) => node['@type'] === 'FAQPage');
    expect(faqNode).toBeDefined();
    expect(faqNode?.['@id']).toBe('https://contextual.site/#faq');
    expect(faqNode?.isPartOf).toEqual({ '@id': 'https://contextual.site/#webpage' });
  });

  it('allows overriding baseUrl in graphOptions when calling getGraph', async () => {
    const app = createContextualApp({
      schema,
      connector,
      baseUrl: 'https://contextual.site',
    });

    const graph = await app.getGraph({
      graphOptions: { baseUrl: 'https://custom-override.site' },
    });

    const websiteNode = graph['@graph'].find((node: any) => node['@type'] === 'WebSite');
    expect(websiteNode?.['@id']).toBe('https://custom-override.site/#website');
  });

  it('allows overriding data with dataOverrides in getGraph', async () => {
    const app = createContextualApp({
      schema,
      connector,
      baseUrl: 'https://contextual.site',
    });

    const graph = await app.getGraph({
      includeAll: true,
      dataOverrides: {
        webpage: {
          name: 'Custom Page - Overridden',
          url: 'https://contextual.site/custom',
        }
      }
    });

    const webpageNode = graph['@graph'].find((node: any) => node['@type'] === 'WebPage');
    expect(webpageNode).toBeDefined();
    expect(webpageNode?.name).toBe('Custom Page - Overridden');
    expect(webpageNode?.url).toBe('https://contextual.site/custom');
  });

  it('allows overriding data with dataOverrides in fetchData', async () => {
    const app = createContextualApp({
      schema,
      connector,
    });

    const data = await app.fetchData({
      webpage: {
        name: 'Custom Page Data',
        url: 'https://contextual.site/data',
      }
    });

    expect(data.webpage?.name).toBe('Custom Page Data');
    expect(data.webpage?.url).toBe('https://contextual.site/data');
    expect(data.website?.name).toBe('Contextual UI');
  });

  describe('multi-page / array webpage schema', () => {
    const multiPageConnector = {
      async fetchData() {
        return {
          website: {
            name: 'Contextual UI',
            url: 'https://contextual.site',
          },
          webpage: [
            {
              id: 'home',
              name: 'Contextual UI - Home',
              url: 'https://contextual.site',
              description: 'Home page description',
            },
            {
              id: 'docs',
              name: 'Contextual UI - Docs',
              url: 'https://contextual.site/docs',
              description: 'Docs page description',
            },
            {
              id: 'schema',
              name: 'Contextual UI - Schema',
              url: 'https://contextual.site/schema',
              description: 'Schema inspector description',
            },
          ],
          faq: [
            { id: '1', question: 'What is this?', answer: 'A test.' },
          ],
        };
      },
    };

    it('generates full multi-page knowledge graph when includeAll is true', async () => {
      const app = createContextualApp({
        schema,
        connector: multiPageConnector,
        baseUrl: 'https://contextual.site',
      });

      const graph = await app.getGraph({ includeAll: true });
      const webpageNodes = graph['@graph'].filter((node: any) => node['@type'] === 'WebPage');

      expect(webpageNodes).toHaveLength(3);
      expect(webpageNodes.map((n: any) => n['@id'])).toEqual([
        'https://contextual.site/#webpage:home',
        'https://contextual.site/#webpage:docs',
        'https://contextual.site/#webpage:schema',
      ]);
      expect(webpageNodes.every((n: any) => n.isPartOf['@id'] === 'https://contextual.site/#website')).toBe(true);
    });

    it('filters to a single page node when pageId is provided', async () => {
      const app = createContextualApp({
        schema,
        connector: multiPageConnector,
        baseUrl: 'https://contextual.site',
      });

      const graph = await app.getGraph({ pageId: 'docs' });
      const webpageNodes = graph['@graph'].filter((node: any) => node['@type'] === 'WebPage');

      expect(webpageNodes).toHaveLength(1);
      expect(webpageNodes[0]?.['@id']).toBe('https://contextual.site/#webpage:docs');
      expect(webpageNodes[0]?.name).toBe('Contextual UI - Docs');
      expect(webpageNodes[0]?.description).toBe('Docs page description');
    });

    it('filters by pageUrl and merges dataOverrides', async () => {
      const app = createContextualApp({
        schema,
        connector: multiPageConnector,
        baseUrl: 'https://contextual.site',
      });

      const graph = await app.getGraph({
        pageUrl: 'https://contextual.site/docs',
        dataOverrides: {
          webpage: {
            name: 'Overridden Docs Title',
          },
        },
      });

      const webpageNodes = graph['@graph'].filter((node: any) => node['@type'] === 'WebPage');
      expect(webpageNodes).toHaveLength(1);
      expect(webpageNodes[0]?.['@id']).toBe('https://contextual.site/#webpage:docs');
      expect(webpageNodes[0]?.name).toBe('Overridden Docs Title');
      expect(webpageNodes[0]?.description).toBe('Docs page description');
    });
  });

  describe('getMetadata helper for Next.js', () => {
    const fullConnector = {
      async fetchData() {
        return {
          organization: {
            name: 'Tasuku Studio',
            url: 'https://tasuku.io',
            logo: '/images/onigiri_logo.svg',
            sameAs: ['https://twitter.com/orchidtexture'],
          },
          website: {
            name: 'Contextual UI',
            url: 'https://contextual.site',
            description: 'A headless UI and semantic SEO Knowledge Graph library.',
          },
          webpage: [
            {
              id: 'home',
              name: 'Contextual UI - Home',
              url: '/',
              description: 'Home page description',
            },
            {
              id: 'privacy',
              name: 'Privacy Policy - Contextual UI',
              url: '/privacy',
              description: 'Privacy policy description',
            },
            {
              id: 'docs',
              name: 'Documentation - Contextual UI',
              url: '/docs',
              description: 'Docs page description',
              inLanguage: 'en-US',
            },
          ],
        };
      },
    };

    it('returns Next.js Metadata with metadataBase, title, description, alternates, openGraph', async () => {
      const app = createContextualApp({
        schema,
        connector: fullConnector,
        baseUrl: 'https://contextual.site',
      });

      const meta = await app.getMetadata('privacy');

      expect(meta.metadataBase).toEqual(new URL('https://contextual.site'));
      expect(meta.title).toBe('Privacy Policy - Contextual UI');
      expect(meta.description).toBe('Privacy policy description');
      expect(meta.alternates).toEqual({
        canonical: '/privacy',
      });
      expect(meta.openGraph).toMatchObject({
        title: 'Privacy Policy - Contextual UI',
        description: 'Privacy policy description',
        url: '/privacy',
        siteName: 'Contextual UI',
        type: 'website',
        images: ['/images/onigiri_logo.svg'],
      });
      expect(meta.twitter).toMatchObject({
        card: 'summary_large_image',
        title: 'Privacy Policy - Contextual UI',
        description: 'Privacy policy description',
        site: '@orchidtexture',
        images: ['/images/onigiri_logo.svg'],
      });
    });

    it('defaults to home page or website metadata when pageId is omitted', async () => {
      const app = createContextualApp({
        schema,
        connector: fullConnector,
        baseUrl: 'https://contextual.site',
      });

      const meta = await app.getMetadata();

      expect(meta.metadataBase).toEqual(new URL('https://contextual.site'));
      expect(meta.title).toBe('Contextual UI - Home');
      expect(meta.description).toBe('Home page description');
      expect(meta.alternates).toEqual({ canonical: '/' });
      expect(meta.openGraph?.url).toBe('/');
    });

    it('supports overrides passed as second argument', async () => {
      const app = createContextualApp({
        schema,
        connector: fullConnector,
        baseUrl: 'https://contextual.site',
      });

      const meta = await app.getMetadata('privacy', {
        title: 'Custom Overridden Privacy Title',
        openGraph: {
          images: ['/custom-og-privacy.png'],
        },
      });

      expect(meta.title).toBe('Custom Overridden Privacy Title');
      expect(meta.openGraph?.images).toEqual(['/custom-og-privacy.png']);
      expect(meta.openGraph?.title).toBe('Custom Overridden Privacy Title');
      expect(meta.description).toBe('Privacy policy description');
      expect(meta.alternates?.canonical).toBe('/privacy');
    });

    it('supports options object as first argument', async () => {
      const app = createContextualApp({
        schema,
        connector: fullConnector,
        baseUrl: 'https://contextual.site',
      });

      const meta = await app.getMetadata({
        pageId: 'docs',
        baseUrl: 'https://custom-domain.com',
        metadataOverrides: {
          keywords: ['documentation', 'nextjs'],
        },
      });

      expect(meta.metadataBase).toEqual(new URL('https://custom-domain.com'));
      expect(meta.title).toBe('Documentation - Contextual UI');
      expect(meta.alternates?.canonical).toBe('/docs');
      expect(meta.openGraph?.locale).toBe('en-US');
      expect(meta.keywords).toEqual(['documentation', 'nextjs']);
    });

    it('gracefully handles missing pageId by providing fallback url and website title', async () => {
      const app = createContextualApp({
        schema,
        connector: fullConnector,
        baseUrl: 'https://contextual.site',
      });

      const meta = await app.getMetadata('terms');

      expect(meta.metadataBase).toEqual(new URL('https://contextual.site'));
      expect(meta.title).toBe('Contextual UI');
      expect(meta.description).toBe('A headless UI and semantic SEO Knowledge Graph library.');
      expect(meta.alternates?.canonical).toBe('/terms');
      expect(meta.openGraph?.url).toBe('/terms');
    });

    it('handles single page (non-array) webpage connector', async () => {
      const singlePageConnector = {
        async fetchData() {
          return {
            website: {
              name: 'Single Site',
              url: 'https://singlesite.com',
            },
            webpage: {
              name: 'Single Page Title',
              url: '/single',
              description: 'Single page description',
            },
          };
        },
      };

      const app = createContextualApp({
        schema,
        connector: singlePageConnector,
        baseUrl: 'https://singlesite.com',
      });

      const meta = await app.getMetadata();

      expect(meta.metadataBase).toEqual(new URL('https://singlesite.com'));
      expect(meta.title).toBe('Single Page Title');
      expect(meta.description).toBe('Single page description');
      expect(meta.alternates?.canonical).toBe('/single');
    });
  });

  describe('sitemap and robots integration', () => {
    const multiPageConnector = {
      async fetchData() {
        return {
          website: {
            name: 'Contextual UI',
            url: 'https://contextual.site',
          },
          webpage: [
            { id: 'home', url: '/' },
            { id: 'docs', url: '/docs' },
            { id: 'cms', url: '/cms' },
            { id: 'studio', url: '/studio/forms' },
          ],
        };
      },
    };

    const app = createContextualApp({
      schema,
      connector: multiPageConnector,
      baseUrl: 'https://contextual.site',
    });

    it('generates sitemap items with exclusions', async () => {
      const sitemap = await app.getSitemap({
        exclude: ['/cms', '/studio*'],
      });

      expect(sitemap).toHaveLength(2);
      expect(sitemap.map((s) => s.url)).toEqual([
        'https://contextual.site',
        'https://contextual.site/docs',
      ]);
    });

    it('generates compliant sitemap XML', async () => {
      const xml = await app.generateSitemapXml({
        exclude: ['/cms', '/studio*'],
      });

      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<loc>https://contextual.site</loc>');
      expect(xml).toContain('<loc>https://contextual.site/docs</loc>');
      expect(xml).not.toContain('/cms');
    });

    it('handles sitemap route handler requests', async () => {
      const handler = app.createSitemapHandler({
        exclude: ['/cms', '/studio*'],
      });
      const res = await handler.GET(new Request('http://localhost/sitemap.xml'));

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toBe('application/xml; charset=utf-8');
      const text = await res.text();
      expect(text).toContain('<loc>https://contextual.site</loc>');
    });

    it('generates robots data and plain text', async () => {
      const robots = await app.getRobots({
        disallow: ['/cms', '/studio'],
        ai: {
          defaultAiPolicy: 'disallow',
          bots: { PerplexityBot: 'allow' },
        },
      });

      expect(robots.sitemap).toBe('https://contextual.site/sitemap.xml');
      expect(robots.host).toBe('contextual.site');

      const txt = await app.generateRobotsTxt({
        disallow: ['/cms', '/studio'],
        ai: {
          defaultAiPolicy: 'disallow',
          bots: { PerplexityBot: 'allow' },
        },
      });

      expect(txt).toContain('User-agent: *');
      expect(txt).toContain('Disallow: /cms');
      expect(txt).toContain('Disallow: /studio');
      expect(txt).toContain('User-agent: GPTBot\nDisallow: /');
      expect(txt).toContain('User-agent: PerplexityBot\nAllow: /');
      expect(txt).toContain('Sitemap: https://contextual.site/sitemap.xml');
    });

    it('handles robots route handler requests', async () => {
      const handler = app.createRobotsHandler({
        disallow: ['/cms'],
      });
      const res = await handler.GET(new Request('http://localhost/robots.txt'));

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toBe('text/plain; charset=utf-8');
      const text = await res.text();
      expect(text).toContain('User-agent: *');
      expect(text).toContain('Disallow: /cms');
    });
  });
});
