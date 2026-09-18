import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { validateGraphReferences } from 'contextual-ui';
import { siteApp } from '@/data/site.server';
import { GET } from '@/app/api/graph.json/route';

const APP_DIR = path.resolve(import.meta.dirname, '../../');
const NEXT_SERVER_APP = path.join(APP_DIR, '.next/server/app');

function loadProductionHtml(pagePath: string): string {
  const filePath = path.join(NEXT_SERVER_APP, pagePath);
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Production build artifact not found at ${filePath}. Run "pnpm build" before executing production tests.`
    );
  }
  return fs.readFileSync(filePath, 'utf-8');
}

function extractPageJsonLd(html: string): Array<any> {
  const $ = cheerio.load(html);
  const scripts: any[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).text().trim();
    if (raw) {
      scripts.push(JSON.parse(raw));
    }
  });
  return scripts;
}

function extractVisibleText(html: string): string {
  const $ = cheerio.load(html);
  $('script, style, noscript').remove();
  return $('body').text().replace(/\s+/g, ' ').trim();
}

describe('V2-0 Production Output & Graph Verification', () => {
  describe('Production HTML Script Ownership & Isolation', () => {
    it('verifies home page has exactly 1 WebPage JSON-LD script with FAQ and no docs actions', () => {
      const html = loadProductionHtml('index.html');
      const scripts = extractPageJsonLd(html);

      expect(scripts.length).toBe(1);
      const graph = scripts[0];
      const nodes = (graph['@graph'] || []) as Record<string, any>[];

      const webpage = nodes.find((n) => n['@type'] === 'WebPage');
      expect(webpage).toBeDefined();

      // FAQ belongs to home
      const faq = nodes.find((n) => n['@type'] === 'FAQPage');
      expect(faq).toBeDefined();

      // ContactAction must NOT be on home
      const action = nodes.find((n) => n['@type'] === 'ContactAction');
      expect(action).toBeUndefined();

      // Reference integrity
      const validation = validateGraphReferences(graph, { baseUrl: 'https://contextual.site' });
      expect(validation.missingLocalIds).toEqual([]);
    });

    it('verifies docs page has exactly 1 WebPage JSON-LD script with ContactAction and no FAQ', () => {
      const html = loadProductionHtml('docs.html');
      const scripts = extractPageJsonLd(html);

      expect(scripts.length).toBe(1);
      const graph = scripts[0];
      const nodes = (graph['@graph'] || []) as Record<string, any>[];

      const webpage = nodes.find((n) => n['@type'] === 'WebPage');
      expect(webpage).toBeDefined();

      // ContactAction belongs to docs
      const action = nodes.find((n) => n['@type'] === 'ContactAction');
      expect(action).toBeDefined();

      // FAQ must NOT be on docs
      const faq = nodes.find((n) => n['@type'] === 'FAQPage');
      expect(faq).toBeUndefined();

      // No uncanonical standalone demo navigation elements
      const standaloneNav = nodes.find(
        (n) => n['@type'] === 'SiteNavigationElement' && n['@id'] === '#navbar' && !n.isPartOf
      );
      expect(standaloneNav).toBeUndefined();

      // Reference integrity
      const validation = validateGraphReferences(graph, { baseUrl: 'https://contextual.site' });
      expect(validation.missingLocalIds).toEqual([]);
    });

    it('verifies privacy page has exactly 1 WebPage JSON-LD script with policy element', () => {
      const html = loadProductionHtml('privacy.html');
      const scripts = extractPageJsonLd(html);

      expect(scripts.length).toBe(1);
      const graph = scripts[0];
      const nodes = (graph['@graph'] || []) as Record<string, any>[];

      const policySec = nodes.find(
        (n) => n['@type'] === 'WebPageElement' && n['@id']?.includes('privacy')
      );
      expect(policySec).toBeDefined();
      expect(nodes.find((n) => n['@type'] === 'FAQPage')).toBeUndefined();
      expect(nodes.find((n) => n['@type'] === 'ContactAction')).toBeUndefined();

      const validation = validateGraphReferences(graph, { baseUrl: 'https://contextual.site' });
      expect(validation.missingLocalIds).toEqual([]);
    });

    it('verifies terms page has exactly 1 WebPage JSON-LD script with policy element', () => {
      const html = loadProductionHtml('terms.html');
      const scripts = extractPageJsonLd(html);

      expect(scripts.length).toBe(1);
      const graph = scripts[0];
      const nodes = (graph['@graph'] || []) as Record<string, any>[];

      const termsSec = nodes.find(
        (n) => n['@type'] === 'WebPageElement' && n['@id']?.includes('terms')
      );
      expect(termsSec).toBeDefined();
      expect(nodes.find((n) => n['@type'] === 'FAQPage')).toBeUndefined();
      expect(nodes.find((n) => n['@type'] === 'ContactAction')).toBeUndefined();

      const validation = validateGraphReferences(graph, { baseUrl: 'https://contextual.site' });
      expect(validation.missingLocalIds).toEqual([]);
    });
  });

  describe('API Handler & Programmatic Graph Equivalence', () => {
    it('produces identical graph output between GET handler and programmatic siteApp.getGraph', async () => {
      const req = new Request('https://contextual.site/api/graph.json');
      const res = await GET(req as any);
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/ld+json');

      const handlerJson = await res.json();
      const progGraph = await siteApp.getGraph({ includeAll: true });

      expect(handlerJson).toEqual(progGraph);
    });
  });

  describe('F3: Docs Meaningful Content Coverage in Production Graph', () => {
    it('Probe F3 (Failing): meaningful docs field contracts and component descriptions are in docs graph', () => {
      const html = loadProductionHtml('docs.html');
      const scripts = extractPageJsonLd(html);
      expect(scripts.length).toBe(1);

      const graph = scripts[0];
      const nodes = (graph['@graph'] || []) as Record<string, any>[];

      // Concatenate all text, names, and descriptions across the docs graph
      const allGraphText = nodes
        .map((n) => `${n.name || ''} ${n.description || ''} ${n.text || ''}`)
        .join(' ');

      // These strings exist in visible HTML outside scripts/styles
      const visibleText = extractVisibleText(html);
      expect(visibleText).toContain('Primary display name of the website');
      expect(visibleText).toContain('Declares domain-level website metadata, site display title, description, canonical URL, and search action.');
      expect(visibleText).toContain('The Navbar component renders accessible navigation structures with full semantic support.');
      expect(visibleText).toContain('The route-level React Server Component that coordinates page-level Schema.org metadata and automatically injects the canonical @graph script tag for that specific URL.');

      // Assertion: they must also be represented in the docs graph!
      // (F3: High - currently fails because DocsClient has hardcoded tables/prose not registered in data)
      expect(allGraphText).toContain('Primary display name of the website');
      expect(allGraphText).toContain('Declares domain-level website metadata, site display title, description, canonical URL, and search action.');
      expect(allGraphText).toContain('The Navbar component renders accessible navigation structures with full semantic support.');
      expect(allGraphText).toContain('The route-level React Server Component that coordinates page-level Schema.org metadata and automatically injects the canonical @graph script tag for that specific URL.');
    });
  });
});
