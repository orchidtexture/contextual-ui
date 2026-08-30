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
});
