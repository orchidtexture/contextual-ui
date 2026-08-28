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
});
