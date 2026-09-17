import { describe, it, expect } from 'vitest';
import { validateGraphReferences } from 'contextual-ui';
import { siteApp } from '@/data/site.server';
import { GET } from '@/app/api/graph.json/route';

describe('Graph Output & Route Handler Parity', () => {
  it('serves graph matching siteApp.getGraph({ includeAll: true }) from GET handler', async () => {
    const req = new Request('https://contextual.site/api/graph.json');
    const response = await GET(req as any);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/ld+json');

    const handlerJson = await response.json();
    const programmaticGraph = await siteApp.getGraph({ includeAll: true });

    expect(handlerJson).toEqual(programmaticGraph);
    expect(handlerJson['@context']).toBe('https://schema.org');
    expect(Array.isArray(handlerJson['@graph'])).toBe(true);
  });

  it('contains core semantic entities in global graph', async () => {
    const graph = await siteApp.getGraph({ includeAll: true });
    const nodes = graph['@graph'] as Record<string, any>[];

    const website = nodes.find((n) => n['@type'] === 'WebSite');
    expect(website).toBeDefined();

    const org = nodes.find((n) => n['@type'] === 'Organization');
    expect(org).toBeDefined();

    const webpages = nodes.filter((n) => n['@type'] === 'WebPage');
    expect(webpages.length).toBeGreaterThanOrEqual(4);

    const webpageIds = webpages.map((w) => w['@id']);
    expect(webpageIds.some((id: string) => id.includes('home'))).toBe(true);
    expect(webpageIds.some((id: string) => id.includes('docs'))).toBe(true);
    expect(webpageIds.some((id: string) => id.includes('privacy'))).toBe(true);
    expect(webpageIds.some((id: string) => id.includes('terms'))).toBe(true);

    // Verify all @ids across the graph are unique
    const allIds = nodes.map((n) => n['@id']).filter(Boolean);
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  it('isolates route-specific entities across page graphs', async () => {
    const homeGraph = await siteApp.getGraph({ pageId: 'home' });
    const docsGraph = await siteApp.getGraph({ pageId: 'docs' });
    const privacyGraph = await siteApp.getGraph({ pageId: 'privacy' });
    const termsGraph = await siteApp.getGraph({ pageId: 'terms' });

    const homeNodes = homeGraph['@graph'] as Record<string, any>[];
    const docsNodes = docsGraph['@graph'] as Record<string, any>[];
    const privacyNodes = privacyGraph['@graph'] as Record<string, any>[];
    const termsNodes = termsGraph['@graph'] as Record<string, any>[];

    // FAQ belongs to home, not docs or legal
    const homeFaq = homeNodes.find((n) => n['@type'] === 'FAQPage');
    expect(homeFaq).toBeDefined();
    expect(docsNodes.find((n) => n['@type'] === 'FAQPage')).toBeUndefined();
    expect(privacyNodes.find((n) => n['@type'] === 'FAQPage')).toBeUndefined();

    // ContactAction form belongs to docs, not home
    const docsForm = docsNodes.find((n) => n['@type'] === 'ContactAction');
    expect(docsForm).toBeDefined();
    expect(homeNodes.find((n) => n['@type'] === 'ContactAction')).toBeUndefined();

    // Privacy section belongs to privacy
    const privacySection = privacyNodes.find(
      (n) => n['@type'] === 'WebPageElement' && n['@id']?.includes('privacy')
    );
    expect(privacySection).toBeDefined();
    expect(homeNodes.find((n) => n['@id']?.includes('privacy'))).toBeUndefined();

    // Terms section belongs to terms
    const termsSection = termsNodes.find(
      (n) => n['@type'] === 'WebPageElement' && n['@id']?.includes('terms')
    );
    expect(termsSection).toBeDefined();
    expect(homeNodes.find((n) => n['@id']?.includes('terms'))).toBeUndefined();
  });

  it('R3: includes meaningful content coverage for hero, pipeline, foundations, and docs sections', async () => {
    const homeGraph = await siteApp.getGraph({ pageId: 'home' });
    const docsGraph = await siteApp.getGraph({ pageId: 'docs' });
    const homeNodes = homeGraph['@graph'] as Record<string, any>[];
    const docsNodes = docsGraph['@graph'] as Record<string, any>[];

    // Home: Hero section with meaningful body
    const hero = homeNodes.find((n) => n['@id']?.includes(':hero'));
    expect(hero).toBeDefined();
    expect(hero?.name).toBe('Build Websites Optimized for Search & AI Agents.');
    expect(hero?.description).toContain('Stop writing boilerplate schema markup.');

    // Home: Pipeline section and stages collection
    const pipeline = homeNodes.find((n) => n['@id']?.includes(':data-pipeline'));
    expect(pipeline).toBeDefined();
    expect(pipeline?.name).toBe('Source to Graph & UI');
    const pipelineStages = homeNodes.find(
      (n) => n['@type'] === 'ItemList' && n['@id']?.includes(':pipeline-stages')
    );
    expect(pipelineStages).toBeDefined();
    expect(pipelineStages?.numberOfItems).toBe(6);

    // Home: Foundations section
    const foundations = homeNodes.find((n) => n['@id']?.includes(':foundations'));
    expect(foundations).toBeDefined();
    expect(foundations?.name).toBe('Architecture & Core Concepts');

    // Docs: Registered documentation sections
    const schemaReg = docsNodes.find((n) => n['@id']?.includes(':schema-registries'));
    expect(schemaReg).toBeDefined();
    expect(schemaReg?.name).toBe('Schema Registries & defineSchema');

    const autoForm = docsNodes.find((n) => n['@id']?.includes(':auto-form'));
    expect(autoForm).toBeDefined();
    expect(autoForm?.name).toBe('AutoForm & formRegistry');

    const connectors = docsNodes.find((n) => n['@id']?.includes(':connectors'));
    expect(connectors).toBeDefined();
    expect(connectors?.name).toBe('Connectors & Data Layer');

    const helpers = docsNodes.find((n) => n['@id']?.includes(':helpers'));
    expect(helpers).toBeDefined();
    expect(helpers?.name).toBe('Helpers: siteApp.getMetadata()');
  });

  it('validates graph reference integrity with zero dangling local references', async () => {
    const globalGraph = await siteApp.getGraph({ includeAll: true });
    const homeGraph = await siteApp.getGraph({ pageId: 'home' });
    const docsGraph = await siteApp.getGraph({ pageId: 'docs' });

    const globalValidation = validateGraphReferences(globalGraph, { baseUrl: 'https://contextual.site' });
    expect(globalValidation.missingLocalIds).toEqual([]);

    const homeValidation = validateGraphReferences(homeGraph, { baseUrl: 'https://contextual.site' });
    expect(homeValidation.missingLocalIds).toEqual([]);

    const docsValidation = validateGraphReferences(docsGraph, { baseUrl: 'https://contextual.site' });
    expect(docsValidation.missingLocalIds).toEqual([]);
  });

  it('keeps connector data unchanged across graph and handler invocations', async () => {
    const dataBefore = await siteApp.fetchData();
    const serializedBefore = JSON.stringify(dataBefore);

    const req = new Request('https://contextual.site/api/graph.json');
    await GET(req as any);
    siteApp.getGraph({ includeAll: true });
    siteApp.getGraph({ pageId: 'home' });
    siteApp.getGraph({ pageId: 'docs' });

    const dataAfter = await siteApp.fetchData();
    const serializedAfter = JSON.stringify(dataAfter);

    expect(serializedAfter).toBe(serializedBefore);
  });
});
