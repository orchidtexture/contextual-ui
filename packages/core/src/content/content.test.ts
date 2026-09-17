import { describe, it, expect } from 'vitest';
import {
  normalizeContentBlocks,
  extractPlainText,
  generateSectionJsonLd,
  serializeJsonLd,
  sectionRegistry,
} from './content.utils';
import { SectionRecord } from './content.schema';
import { defineSchema } from '../registry/defineSchema';
import { websiteRegistry } from '../components/website/website.utils';
import { webpageRegistry } from '../components/webpage/webpage.utils';
import { navbarRegistry } from '../components/navbar/navbar.utils';
import { footerRegistry } from '../components/footer/footer.utils';
import { faqRegistry } from '../components/faq/faq.utils';
import { createContextualApp } from '../server/createContextualApp';

describe('Content Foundation (Phase 1)', () => {
  describe('Content blocks normalization and text extraction', () => {
    it('normalizes string input into a paragraph block with normal role', () => {
      const blocks = normalizeContentBlocks('Hello world');
      expect(blocks).toEqual([
        { type: 'paragraph', text: 'Hello world', role: 'normal' },
      ]);
      expect(extractPlainText(blocks)).toBe('Hello world');
    });

    it('normalizes mixed blocks including headings, lists, links, and callouts', () => {
      const blocks = normalizeContentBlocks([
        'Lead paragraph',
        { type: 'heading', text: 'Section Heading', level: 2 },
        {
          type: 'list',
          style: 'unordered',
          items: ['Item 1', { title: 'T2', text: 'Item 2' }],
        },
        {
          type: 'callout',
          title: 'Notice',
          text: 'This is a disclaimer caveat',
          variant: 'caveat',
        },
        {
          type: 'paragraph',
          role: 'qualifier',
          text: 'Human verification required',
        },
      ]);

      expect(blocks).toHaveLength(5);
      expect(blocks[4]).toEqual({
        type: 'paragraph',
        role: 'qualifier',
        text: 'Human verification required',
      });

      const plainText = extractPlainText(blocks);
      expect(plainText).toContain('Lead paragraph');
      expect(plainText).toContain('Section Heading');
      expect(plainText).toContain('Item 1');
      expect(plainText).toContain('T2: Item 2');
      expect(plainText).toContain('Notice: This is a disclaimer caveat');
      expect(plainText).toContain('Human verification required');
    });
  });

  describe('Section JSON-LD generation', () => {
    it('generates canonical Schema.org WebPageElement with deterministic @id', () => {
      const section: SectionRecord = {
        id: 'use-cases',
        pageId: 'home',
        title: '日々の仕事でこんなお困りごとは？',
        description: '活用の一例です。',
        anchor: 'use-cases',
        content: [
          {
            type: 'paragraph',
            role: 'qualifier',
            text: 'AIにすべてを任せるのではなく、担当者が確認・修正する前提で設計します。',
          },
        ],
      };

      const result = generateSectionJsonLd(section);
      expect(result).toHaveLength(1);
      const node = result[0];

      expect(node['@type']).toBe('WebPageElement');
      expect(node['@id']).toBe('#section:home:use-cases');
      expect(node.name).toBe('日々の仕事でこんなお困りごとは？');
      expect(node.description).toBe('活用の一例です。');
      expect(node.text).toContain('担当者が確認・修正する前提で設計します');
      expect(node.url).toBe('#use-cases');
      expect(node.isPartOf).toEqual({ '@id': '#webpage:home' });
    });

    it('preserves absolute or custom @id if provided', () => {
      const section: SectionRecord = {
        id: 'https://example.com/#custom-section',
        title: 'Custom Section',
      };

      const result = generateSectionJsonLd(section);
      expect(result[0]['@id']).toBe('https://example.com/#custom-section');
    });
  });

  describe('Safe JSON-LD script serialization', () => {
    it('escapes < characters to prevent HTML script breakout', () => {
      const dangerous = {
        text: '</script><script>alert("XSS")</script>',
        tag: '<b>bold</b>',
      };

      const serialized = serializeJsonLd(dangerous);
      expect(serialized).not.toContain('</script>');
      expect(serialized).toContain('\\u003c/script>');
      expect(serialized).toContain('\\u003cb>bold\\u003c/b>');
    });
  });

  describe('createContextualApp integration with page isolation', () => {
    const multiPageAppSchema = defineSchema({
      website: websiteRegistry(),
      webpage: webpageRegistry(),
      navbar: navbarRegistry(),
      footer: footerRegistry(),
      faq: faqRegistry(),
      sections: sectionRegistry(),
    });

    const multiPageConnector = {
      async fetchData() {
        return {
          website: {
            name: 'Tasuku Studio',
            url: 'https://tasuku-studio.co.jp',
          },
          webpage: [
            {
              id: 'home',
              name: 'Home - Tasuku Studio',
              url: '/',
            },
            {
              id: 'privacy',
              name: 'Privacy Policy - Tasuku Studio',
              url: '/privacy',
            },
          ],
          navbar: {
            brand: { name: 'Tasuku Studio', href: '/' },
            links: [{ id: '1', label: 'Home', href: '/' }],
          },
          footer: {
            brand: { name: 'Tasuku Studio', href: '/' },
            copyright: { holder: 'Tasuku Studio', year: 2026 },
          },
          faq: [
            { id: '1', question: 'Can AI help?', answer: 'Yes.' },
          ],
          sections: [
            {
              id: 'hero',
              pageId: 'home',
              title: 'Hero Section',
              description: 'Positioning copy',
            },
            {
              id: 'services',
              pageId: 'home',
              title: 'Services Section',
              description: 'Our core services',
            },
            {
              id: 'policy-text',
              pageId: 'privacy',
              title: 'Privacy Policy Content',
              description: 'Handling of personal data',
            },
          ],
        };
      },
    };

    const app = createContextualApp({
      schema: multiPageAppSchema,
      connector: multiPageConnector,
      baseUrl: 'https://tasuku-studio.co.jp',
    });

    it('isolates home page graph: includes home sections & faq, excludes privacy sections', async () => {
      const homeGraph = await app.getGraph({ pageId: 'home' });
      const nodes = homeGraph['@graph'] || [];

      // WebPage node
      const webpageNode = nodes.find((n: any) => n['@type'] === 'WebPage');
      expect(webpageNode).toBeDefined();
      expect(webpageNode?.['@id']).toBe('https://tasuku-studio.co.jp/#webpage:home');

      // Sections on home
      const sectionNodes = nodes.filter((n: any) => n['@type'] === 'WebPageElement');
      const sectionIds = sectionNodes.map((n: any) => n['@id']);
      expect(sectionIds).toContain('https://tasuku-studio.co.jp/#section:home:hero');
      expect(sectionIds).toContain('https://tasuku-studio.co.jp/#section:home:services');
      expect(sectionIds).not.toContain('https://tasuku-studio.co.jp/#section:privacy:policy-text');

      // FAQ included on home
      const faqNode = nodes.find((n: any) => n['@type'] === 'FAQPage');
      expect(faqNode).toBeDefined();

      // WebPage hasPart includes home sections and faq
      const hasPartIds = webpageNode?.hasPart?.map((p: any) => p['@id']) || [];
      expect(hasPartIds).toContain('https://tasuku-studio.co.jp/#section:home:hero');
      expect(hasPartIds).toContain('https://tasuku-studio.co.jp/#section:home:services');
      expect(hasPartIds).toContain('https://tasuku-studio.co.jp/#faq');
      expect(hasPartIds).not.toContain('https://tasuku-studio.co.jp/#section:privacy:policy-text');
    });

    it('isolates privacy page graph: includes privacy section, excludes home sections & faq', async () => {
      const privacyGraph = await app.getGraph({ pageId: 'privacy' });
      const nodes = privacyGraph['@graph'] || [];

      // WebPage node
      const webpageNode = nodes.find((n: any) => n['@type'] === 'WebPage');
      expect(webpageNode).toBeDefined();
      expect(webpageNode?.['@id']).toBe('https://tasuku-studio.co.jp/#webpage:privacy');

      // Sections on privacy
      const sectionNodes = nodes.filter((n: any) => n['@type'] === 'WebPageElement');
      const sectionIds = sectionNodes.map((n: any) => n['@id']);
      expect(sectionIds).toContain('https://tasuku-studio.co.jp/#section:privacy:policy-text');
      expect(sectionIds).not.toContain('https://tasuku-studio.co.jp/#section:home:hero');
      expect(sectionIds).not.toContain('https://tasuku-studio.co.jp/#section:home:services');

      // NO FAQ on privacy!
      const faqNode = nodes.find((n: any) => n['@type'] === 'FAQPage');
      expect(faqNode).toBeUndefined();

      // hasPart on privacy does NOT link to FAQ or home sections
      const hasPartIds = webpageNode?.hasPart?.map((p: any) => p['@id']) || [];
      expect(hasPartIds).toContain('https://tasuku-studio.co.jp/#section:privacy:policy-text');
      expect(hasPartIds).not.toContain('https://tasuku-studio.co.jp/#faq');
      expect(hasPartIds).not.toContain('https://tasuku-studio.co.jp/#section:home:hero');
    });

    it('exports all pages and all sections on global graph (includeAll: true)', async () => {
      const globalGraph = await app.getGraph({ includeAll: true });
      const nodes = globalGraph['@graph'] || [];

      // Both WebPage nodes present
      const webpageNodes = nodes.filter((n: any) => n['@type'] === 'WebPage');
      expect(webpageNodes).toHaveLength(2);

      // All 3 sections present
      const sectionNodes = nodes.filter((n: any) => n['@type'] === 'WebPageElement');
      expect(sectionNodes).toHaveLength(3);

      // FAQ present
      const faqNode = nodes.find((n: any) => n['@type'] === 'FAQPage');
      expect(faqNode).toBeDefined();

      // Shared Organization and WebSite are singletons (deduplicated)
      const websiteNodes = nodes.filter((n: any) => n['@type'] === 'WebSite');
      expect(websiteNodes).toHaveLength(1);
    });

    it('createGraphHandler GET returns the identical graph structure with ld+json header', async () => {
      const handler = app.createGraphHandler({ includeAll: true });
      const res = await handler.GET(new Request('https://tasuku-studio.co.jp/graph.json'));

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/ld+json');

      const data = await res.json();
      expect(data['@graph']).toBeDefined();

      const sectionNodes = data['@graph'].filter((n: any) => n['@type'] === 'WebPageElement');
      expect(sectionNodes).toHaveLength(3);
    });
  });
});
