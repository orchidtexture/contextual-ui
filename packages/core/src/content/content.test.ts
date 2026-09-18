import { describe, it, expect, vi } from 'vitest';
import {
  normalizeContentBlocks,
  extractPlainText,
  generateSectionJsonLd,
  serializeJsonLd,
  sectionRegistry,
} from './content.utils';
import { SectionRecord, isSafeHref, LinkBlockSchema } from './content.schema';
import { validateGraphReferences } from './content.validator';
import { defineSchema } from '../registry/defineSchema';
import { websiteRegistry } from '../components/website/website.utils';
import { webpageRegistry } from '../components/webpage/webpage.utils';
import { navbarRegistry } from '../components/navbar/navbar.utils';
import { footerRegistry } from '../components/footer/footer.utils';
import { faqRegistry } from '../components/faq/faq.utils';
import { formRegistry } from '../components/form/form.utils';
import { organizationRegistry } from '../components/organization/organization.utils';
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

  describe('Safe Link Protocol Validation', () => {
    it('isSafeHref correctly allows safe protocols and relative paths', () => {
      expect(isSafeHref('https://contextual.site')).toBe(true);
      expect(isSafeHref('http://localhost:3000')).toBe(true);
      expect(isSafeHref('mailto:team@tasuku.io')).toBe(true);
      expect(isSafeHref('tel:+1234567890')).toBe(true);
      expect(isSafeHref('/docs')).toBe(true);
      expect(isSafeHref('#auto-form')).toBe(true);
      expect(isSafeHref('./guides/intro')).toBe(true);
      expect(isSafeHref('../terms')).toBe(true);
      expect(isSafeHref('//cdn.example.com/asset.js')).toBe(true);
    });

    it('isSafeHref strictly rejects dangerous and unsupported protocols', () => {
      expect(isSafeHref('javascript:alert(1)')).toBe(false);
      expect(isSafeHref('JAVASCRIPT:void(0)')).toBe(false);
      expect(isSafeHref('data:text/html,<script>alert(1)</script>')).toBe(false);
      expect(isSafeHref('vbscript:msgbox(1)')).toBe(false);
      expect(isSafeHref('file:///etc/passwd')).toBe(false);
      expect(isSafeHref('')).toBe(false);
      expect(isSafeHref(null as any)).toBe(false);
      expect(isSafeHref(undefined as any)).toBe(false);
    });

    it('LinkBlockSchema validates safe URLs and throws on unsafe schemes', () => {
      const valid = LinkBlockSchema.safeParse({
        type: 'link',
        label: 'Documentation',
        href: '/docs',
      });
      expect(valid.success).toBe(true);

      const invalid = LinkBlockSchema.safeParse({
        type: 'link',
        label: 'Malicious',
        href: 'javascript:alert("XSS")',
      });
      expect(invalid.success).toBe(false);
    });

    it('normalizeContentBlocks filters out link blocks with unsafe protocols', () => {
      const blocks = normalizeContentBlocks([
        'Safe intro text',
        {
          type: 'link',
          label: 'Safe Link',
          href: 'https://tasuku.io',
        },
        {
          type: 'link',
          label: 'Exploit Link',
          href: 'javascript:stealCookies()',
        },
      ]);

      expect(blocks).toHaveLength(2);
      expect(blocks.find((b: any) => b.type === 'link' && b.label === 'Exploit Link')).toBeUndefined();
      expect(blocks.find((b: any) => b.type === 'link' && b.label === 'Safe Link')).toBeDefined();
    });
  });

  describe('Graph Reference Validation & Integrity', () => {
    it('reports valid with 0 missingLocalIds on a fully sound graph', () => {
      const graph = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': 'https://contextual.site/#website',
            name: 'Contextual UI',
          },
          {
            '@type': 'WebPage',
            '@id': 'https://contextual.site/#webpage:docs',
            isPartOf: { '@id': 'https://contextual.site/#website' },
            hasPart: [{ '@id': 'https://contextual.site/#action:form-contact-sales' }],
          },
          {
            '@type': 'ContactAction',
            '@id': 'https://contextual.site/#action:form-contact-sales',
            isPartOf: { '@id': 'https://contextual.site/#webpage:docs' },
          },
        ],
      };

      const result = validateGraphReferences(graph, { baseUrl: 'https://contextual.site' });
      expect(result.valid).toBe(true);
      expect(result.missingLocalIds).toHaveLength(0);
      expect(result.internalReferences).toContain('https://contextual.site/#website');
      expect(result.internalReferences).toContain('https://contextual.site/#action:form-contact-sales');
    });

    it('distinguishes intentionally external references from missing local records', () => {
      const graph = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            '@id': 'https://contextual.site/#webpage:home',
            about: [
              { '@id': 'https://tasuku.io' }, // Intentionally external reference
              { '@id': 'https://github.com/orchidtexture/contextual-ui' }, // External reference
              { '@id': 'https://contextual.site/#dangling-element' }, // Missing local reference!
            ],
          },
        ],
      };

      const result = validateGraphReferences(graph, { baseUrl: 'https://contextual.site' });
      expect(result.valid).toBe(false);
      expect(result.externalReferences).toContain('https://tasuku.io');
      expect(result.externalReferences).toContain('https://github.com/orchidtexture/contextual-ui');
      expect(result.missingLocalIds).toEqual(['https://contextual.site/#dangling-element']);
    });
  });

  describe('Starter-kit Fixture: Home / Docs / Privacy / Terms with Generic Membership', () => {
    const starterKitSchema = defineSchema({
      organization: organizationRegistry(),
      website: websiteRegistry(),
      webpage: webpageRegistry(),
      navbar: navbarRegistry(),
      footer: footerRegistry(),
      faq: faqRegistry(),
      forms: formRegistry(),
      sections: sectionRegistry(),
    });

    const starterKitConnector = {
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
            description: 'Semantic Knowledge Graph UI library.',
          },
          webpage: [
            {
              id: 'home',
              name: 'Contextual UI - Home',
              url: '/',
            },
            {
              id: 'docs',
              name: 'Documentation - Contextual UI',
              url: '/docs',
            },
            {
              id: 'privacy',
              name: 'Privacy Policy - Contextual UI',
              url: '/privacy',
            },
            {
              id: 'terms',
              name: 'Terms of Service - Contextual UI',
              url: '/terms',
            },
          ],
          navbar: {
            brand: { name: 'Contextual', href: '/' },
            links: [
              { id: '1', label: 'Home', href: '/' },
              { id: '2', label: 'Docs', href: '/docs' },
            ],
          },
          footer: {
            brand: { name: 'Contextual', href: '/' },
            copyright: { holder: 'Tasuku Studio', year: 2026 },
          },
          faq: [
            { id: '1', pageId: 'home', question: 'What is Contextual UI?', answer: 'A headless library.' },
            { id: '2', pageId: 'home', question: 'How does semantic SEO work?', answer: 'Via JSON-LD graph builder.' },
          ],
          forms: [
            {
              id: 'contact-sales',
              pageId: 'docs',
              name: 'Contact Sales & Support',
              endpoint: '/api/contact',
              method: 'POST' as const,
              fields: [
                { name: 'email', type: 'email' as const, required: true },
                { name: 'message', type: 'textarea' as const, required: true },
              ],
            },
          ],
          sections: [
            {
              id: 'hero',
              pageId: 'home',
              title: 'Hero Title',
              content: 'Hero description text',
            },
            {
              id: 'features',
              pageId: 'home',
              title: 'Feature Cards',
              content: 'Features description text',
            },
            {
              id: 'quickstart',
              pageId: 'docs',
              title: 'Docs Quickstart',
              content: 'Getting started steps',
            },
            {
              id: 'privacy-policy',
              pageId: 'privacy',
              title: 'Privacy Policy Section',
              content: 'Privacy text and disclosures',
            },
            {
              id: 'terms-of-service',
              pageId: 'terms',
              title: 'Terms of Service Section',
              content: 'Terms terms terms',
            },
          ],
        };
      },
    };

    const siteApp = createContextualApp({
      schema: starterKitSchema,
      connector: starterKitConnector,
      baseUrl: 'https://contextual.site',
    });

    it('isolates /docs graph: includes contact-sales form and quickstart section; excludes FAQ and home/privacy/terms sections', async () => {
      const docsGraph = await siteApp.getGraph({ pageId: 'docs' });
      const nodes = docsGraph['@graph'] || [];

      // Docs WebPage present
      const webpageNode = nodes.find((n: any) => n['@type'] === 'WebPage');
      expect(webpageNode).toBeDefined();
      expect(webpageNode?.['@id']).toBe('https://contextual.site/#webpage:docs');

      // Form on Docs is present with correct PotentialAction mapping and isPartOf
      const formNode = nodes.find((n: any) => n['@type'] === 'ContactAction');
      expect(formNode).toBeDefined();
      expect(formNode?.['@id']).toBe('https://contextual.site/#action:form-contact-sales');
      expect(formNode?.isPartOf).toEqual({ '@id': 'https://contextual.site/#webpage:docs' });

      // Docs quickstart section is present
      const sectionNodes = nodes.filter((n: any) => n['@type'] === 'WebPageElement');
      const sectionIds = sectionNodes.map((n: any) => n['@id']);
      expect(sectionIds).toContain('https://contextual.site/#section:docs:quickstart');
      expect(sectionIds).not.toContain('https://contextual.site/#section:home:hero');
      expect(sectionIds).not.toContain('https://contextual.site/#section:privacy:privacy-policy');

      // FAQ is strictly excluded on Docs
      const faqNode = nodes.find((n: any) => n['@type'] === 'FAQPage');
      expect(faqNode).toBeUndefined();

      // WebPage hasPart includes docs elements and layout
      const hasPartIds = webpageNode?.hasPart?.map((p: any) => p['@id']) || [];
      expect(hasPartIds).toContain('https://contextual.site/#section:docs:quickstart');
      expect(hasPartIds).toContain('https://contextual.site/#action:form-contact-sales');
      expect(hasPartIds).not.toContain('https://contextual.site/#faq');

      // Reference integrity: zero missing local IDs!
      const refCheck = validateGraphReferences(docsGraph, { baseUrl: 'https://contextual.site' });
      expect(refCheck.valid).toBe(true);
      expect(refCheck.missingLocalIds).toHaveLength(0);
    });

    it('isolates / (home) graph: includes FAQ and home sections; excludes contact-sales form and docs/privacy/terms sections', async () => {
      const homeGraph = await siteApp.getGraph({ pageId: 'home' });
      const nodes = homeGraph['@graph'] || [];

      // Home WebPage present
      const webpageNode = nodes.find((n: any) => n['@type'] === 'WebPage');
      expect(webpageNode).toBeDefined();
      expect(webpageNode?.['@id']).toBe('https://contextual.site/#webpage:home');

      // FAQ is present on Home with correct isPartOf
      const faqNode = nodes.find((n: any) => n['@type'] === 'FAQPage');
      expect(faqNode).toBeDefined();
      expect(faqNode?.['@id']).toBe('https://contextual.site/#faq');
      expect(faqNode?.isPartOf).toEqual({ '@id': 'https://contextual.site/#webpage:home' });

      // Home sections are present
      const sectionNodes = nodes.filter((n: any) => n['@type'] === 'WebPageElement');
      const sectionIds = sectionNodes.map((n: any) => n['@id']);
      expect(sectionIds).toContain('https://contextual.site/#section:home:hero');
      expect(sectionIds).toContain('https://contextual.site/#section:home:features');
      expect(sectionIds).not.toContain('https://contextual.site/#section:docs:quickstart');

      // Docs form is strictly excluded on Home
      const formNode = nodes.find((n: any) => n['@type'] === 'ContactAction');
      expect(formNode).toBeUndefined();

      // WebPage hasPart includes home sections and faq
      const hasPartIds = webpageNode?.hasPart?.map((p: any) => p['@id']) || [];
      expect(hasPartIds).toContain('https://contextual.site/#section:home:hero');
      expect(hasPartIds).toContain('https://contextual.site/#faq');
      expect(hasPartIds).not.toContain('https://contextual.site/#action:form-contact-sales');

      // Reference integrity: zero missing local IDs!
      const refCheck = validateGraphReferences(homeGraph, { baseUrl: 'https://contextual.site' });
      expect(refCheck.valid).toBe(true);
      expect(refCheck.missingLocalIds).toHaveLength(0);
    });

    it('isolates /privacy graph: includes privacy-policy section; excludes FAQ and forms', async () => {
      const privacyGraph = await siteApp.getGraph({ pageId: 'privacy' });
      const nodes = privacyGraph['@graph'] || [];

      const webpageNode = nodes.find((n: any) => n['@type'] === 'WebPage');
      expect(webpageNode?.['@id']).toBe('https://contextual.site/#webpage:privacy');

      const sectionNodes = nodes.filter((n: any) => n['@type'] === 'WebPageElement');
      expect(sectionNodes).toHaveLength(1);
      expect(sectionNodes[0]?.['@id']).toBe('https://contextual.site/#section:privacy:privacy-policy');

      expect(nodes.find((n: any) => n['@type'] === 'FAQPage')).toBeUndefined();
      expect(nodes.find((n: any) => n['@type'] === 'ContactAction')).toBeUndefined();

      const refCheck = validateGraphReferences(privacyGraph, { baseUrl: 'https://contextual.site' });
      expect(refCheck.valid).toBe(true);
      expect(refCheck.missingLocalIds).toHaveLength(0);
    });

    it('isolates /terms graph: includes terms-of-service section; excludes FAQ and forms', async () => {
      const termsGraph = await siteApp.getGraph({ pageId: 'terms' });
      const nodes = termsGraph['@graph'] || [];

      const webpageNode = nodes.find((n: any) => n['@type'] === 'WebPage');
      expect(webpageNode?.['@id']).toBe('https://contextual.site/#webpage:terms');

      const sectionNodes = nodes.filter((n: any) => n['@type'] === 'WebPageElement');
      expect(sectionNodes).toHaveLength(1);
      expect(sectionNodes[0]?.['@id']).toBe('https://contextual.site/#section:terms:terms-of-service');

      expect(nodes.find((n: any) => n['@type'] === 'FAQPage')).toBeUndefined();
      expect(nodes.find((n: any) => n['@type'] === 'ContactAction')).toBeUndefined();

      const refCheck = validateGraphReferences(termsGraph, { baseUrl: 'https://contextual.site' });
      expect(refCheck.valid).toBe(true);
      expect(refCheck.missingLocalIds).toHaveLength(0);
    });

    it('exports all 4 WebPages, all sections, forms, and FAQ on global graph (includeAll: true)', async () => {
      const globalGraph = await siteApp.getGraph({ includeAll: true });
      const nodes = globalGraph['@graph'] || [];

      const webpageNodes = nodes.filter((n: any) => n['@type'] === 'WebPage');
      expect(webpageNodes).toHaveLength(4);

      const sectionNodes = nodes.filter((n: any) => n['@type'] === 'WebPageElement');
      expect(sectionNodes).toHaveLength(5);

      const formNode = nodes.find((n: any) => n['@type'] === 'ContactAction');
      expect(formNode).toBeDefined();

      const faqNode = nodes.find((n: any) => n['@type'] === 'FAQPage');
      expect(faqNode).toBeDefined();

      const refCheck = validateGraphReferences(globalGraph, { baseUrl: 'https://contextual.site' });
      expect(refCheck.valid).toBe(true);
      expect(refCheck.missingLocalIds).toHaveLength(0);
    });

    it('asserts programmatic getGraph and createGraphHandler GET produce identical responses', async () => {
      const programmaticGraph = await siteApp.getGraph({ pageId: 'docs' });
      const handler = siteApp.createGraphHandler({ pageId: 'docs' });
      const res = await handler.GET(new Request('https://contextual.site/api/graph.json'));

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/ld+json');

      const routeGraph = await res.json();
      expect(routeGraph).toEqual(programmaticGraph);
    });
  });

  describe('Precedence: Authoritative Page Manifest vs Entity Ownership', () => {
    it('authoritative WebPage.hasPart overrides default pageId membership', async () => {
      const precedenceSchema = defineSchema({
        webpage: webpageRegistry(),
        sections: sectionRegistry(),
      });

      const precedenceConnector = {
        async fetchData() {
          return {
            webpage: [
              {
                id: 'home',
                url: '/',
                // WebPage authoritatively declares that only 'hero' is part of home
                hasPart: ['#section:home:hero'],
              },
            ],
            sections: [
              {
                id: 'hero',
                pageId: 'home',
                title: 'Hero Section',
              },
              {
                id: 'services',
                pageId: 'home', // Has pageId='home', but omitted from WebPage.hasPart!
                title: 'Services Section',
              },
            ],
          };
        },
      };

      const app = createContextualApp({
        schema: precedenceSchema,
        connector: precedenceConnector,
        baseUrl: 'https://example.com',
      });

      const graph = await app.getGraph({ pageId: 'home' });
      const nodes = graph['@graph'] || [];

      const sectionNodes = nodes.filter((n: any) => n['@type'] === 'WebPageElement');
      expect(sectionNodes).toHaveLength(1);
      expect(sectionNodes[0]?.['@id']).toBe('https://example.com/#section:home:hero');
    });
  });

  describe('Legacy Compatibility Fallback', () => {
    it('unassigned FAQ and forms without pageId fall back to home WebPage in multi-page app', async () => {
      const legacySchema = defineSchema({
        webpage: webpageRegistry(),
        faq: faqRegistry(),
        forms: formRegistry(),
      });

      const legacyConnector = {
        async fetchData() {
          return {
            webpage: [
              { id: 'home', url: '/' },
              { id: 'about', url: '/about' },
            ],
            faq: [
              { id: '1', question: 'Q1?', answer: 'A1' }, // No pageId provided
            ],
            forms: [
              {
                id: 'legacy-contact',
                endpoint: '/api/contact', // No pageId provided
              },
            ],
          };
        },
      };

      const app = createContextualApp({
        schema: legacySchema,
        connector: legacyConnector,
        baseUrl: 'https://example.com',
      });

      // On home, unassigned entities fall back to home
      const homeGraph = await app.getGraph({ pageId: 'home' });
      expect(homeGraph['@graph'].find((n: any) => n['@type'] === 'FAQPage')).toBeDefined();
      expect(homeGraph['@graph'].find((n: any) => n['@type'] === 'ContactAction')).toBeDefined();

      // On about, unassigned entities are excluded
      const aboutGraph = await app.getGraph({ pageId: 'about' });
      expect(aboutGraph['@graph'].find((n: any) => n['@type'] === 'FAQPage')).toBeUndefined();
      expect(aboutGraph['@graph'].find((n: any) => n['@type'] === 'ContactAction')).toBeUndefined();
    });
  });

  describe('Documentation / Playground Sample State Isolation', () => {
    it('dataOverrides and temporary client parameters do not mutate canonical app data', async () => {
      const isolationSchema = defineSchema({
        webpage: webpageRegistry(),
        sections: sectionRegistry(),
      });

      let rawSectionTitle = 'Canonical Title';
      const connector = {
        async fetchData() {
          return {
            webpage: { id: 'docs', url: '/docs' },
            sections: [{ id: 'playground', pageId: 'docs', title: rawSectionTitle }],
          };
        },
      };

      const app = createContextualApp({
        schema: isolationSchema,
        connector,
        baseUrl: 'https://example.com',
      });

      // 1. Temporary call with dataOverrides (e.g. playground simulation)
      const overriddenGraph = await app.getGraph({
        pageId: 'docs',
        dataOverrides: {
          sections: [{ id: 'playground', pageId: 'docs', title: 'Mutated In Playground' }],
        },
      });
      const overriddenNode = overriddenGraph['@graph'].find((n: any) => n['@type'] === 'WebPageElement');
      expect(overriddenNode?.name).toBe('Mutated In Playground');

      // 2. Next call without overrides must retain canonical state without mutation
      const canonicalGraph = await app.getGraph({ pageId: 'docs' });
      const canonicalNode = canonicalGraph['@graph'].find((n: any) => n['@type'] === 'WebPageElement');
      expect(canonicalNode?.name).toBe('Canonical Title');
    });
  });
});
