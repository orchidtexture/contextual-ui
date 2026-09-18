import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { ContextualSite } from 'contextual-ui';
import { WebPage } from 'contextual-ui/server';
import { siteApp } from '@/data/site.server';
import { DocsClient } from '@/app/docs/DocsClient';
import { HomeClient } from '@/app/HomeClient';
import {
  extractVisibleText,
  extractJsonLdScripts,
  extractAllJsonLdEntities,
  cloneSiteData,
  parseHtml,
} from './helpers';
import PrivacyPage from '@/app/privacy/page';
import TermsPage from '@/app/terms/page';
import { createContextualApp } from 'contextual-ui/server';
import { siteSchema } from '@/data/site.schema';

describe('Content Parity & Structured Data Isolation', () => {
  it('R1: isolates example JSON-LD on docs page - only WebPage owns structured data script', async () => {
    const data = await siteApp.fetchData();

    // WebPage is an async Server Component; resolve it before synchronous renderToString
    const webPageJsx = await WebPage({
      app: siteApp,
      id: 'docs',
      children: <DocsClient data={data} />,
    });

    const html = renderToString(
      <ContextualSite data={data} options={{ disableJsonLdScript: true }}>
        {webPageJsx}
      </ContextualSite>
    );

    // Parse every application/ld+json script tag in the rendered output
    const scripts = extractJsonLdScripts(html);

    // Exactly one script tag: the page graph owned by WebPage
    expect(scripts.length).toBe(1);

    const pageGraph = scripts[0];
    expect(pageGraph['@context']).toBe('https://schema.org');
    expect(Array.isArray(pageGraph['@graph'])).toBe(true);

    const entities = pageGraph['@graph'] as Record<string, any>[];

    // Canonical docs entities are present
    const docsPage = entities.find((e) => e['@type'] === 'WebPage');
    expect(docsPage).toBeDefined();
    expect(docsPage?.url).toContain('/docs');

    // ContactAction form remains present and owned by docs
    const contactAction = entities.find((e) => e['@type'] === 'ContactAction');
    expect(contactAction).toBeDefined();

    // No standalone demo entities with uncanonical ids
    // The canonical navbar & footer in the graph have full URLs or canonical ids
    const standaloneNavbarDemo = entities.find(
      (e) => e['@type'] === 'SiteNavigationElement' && e['@id'] === '#navbar' && !e.isPartOf
    );
    expect(standaloneNavbarDemo).toBeUndefined();

    // Visible previews, controls, and syntax examples remain rendered
    const visibleText = extractVisibleText(html);
    expect(visibleText).toContain('Schema Reference & Contract');
    expect(visibleText).toContain('Documentation');
  });

  it('R1: DocsClient rendered alone emits no application/ld+json scripts', async () => {
    const data = await siteApp.fetchData();

    const html = renderToString(
      <ContextualSite data={data} options={{ disableJsonLdScript: true }}>
        <DocsClient data={data} />
      </ContextualSite>
    );

    const scripts = extractJsonLdScripts(html);
    expect(scripts.length).toBe(0);
  });

  describe('R2: Data-driven Quickstart Guide', () => {
    it('renders 8 steps with semantic ol > li structure and matching graph output', async () => {
      const data = await siteApp.fetchData();
      const html = renderToString(
        <ContextualSite data={data} options={{ disableJsonLdScript: true }}>
          <DocsClient data={data} />
        </ContextualSite>
      );

      // Verify semantic ol > li structure
      expect(html).toContain('<ol data-contextual="collection-root" data-ordered="true"');
      const liMatches = html.match(/<li\b[^>]*data-contextual="collection-item"[^>]*>/g);
      expect(liMatches).toHaveLength(8);

      // Verify each of the 8 steps appears in the rendered visible text
      const visibleText = extractVisibleText(html);
      expect(visibleText).toContain('Create Next.js App & Install Dependencies');
      expect(visibleText).toContain('Define your Site Schema (SSOT)');
      expect(visibleText).toContain('Configure Server Connector & App Instance');
      expect(visibleText).toContain('Wrap Root Layout with ContextualSite');
      expect(visibleText).toContain('Implement Headless Navbar & Footer Client Components');
      expect(visibleText).toContain('Render WebPage & Route-Specific Content');
      expect(visibleText).toContain('Add Automated Sitemap & Robots.txt');
      expect(visibleText).toContain('Expose AI Knowledge Graph API');
      expect(visibleText).toContain('Optional');

      // Verify graph representation
      const docsGraph = await siteApp.getGraph({ pageId: 'docs' });
      const nodes = docsGraph['@graph'] as Record<string, any>[];
      const quickstartList = nodes.find(
        (n) => n['@type'] === 'ItemList' && n['@id']?.includes('quickstart-steps')
      );
      expect(quickstartList).toBeDefined();
      expect(quickstartList?.numberOfItems).toBe(8);

      const items = nodes.filter(
        (n) => n['@type'] === 'ListItem' && n['@id']?.includes('quickstart-steps')
      );
      expect(items).toHaveLength(8);

      // Verify stable step IDs are present
      expect(items.some((it) => it['@id']?.endsWith(':create-and-install'))).toBe(true);
      expect(items.some((it) => it['@id']?.endsWith(':define-schema'))).toBe(true);
      expect(items.some((it) => it['@id']?.endsWith(':configure-connector'))).toBe(true);
      expect(items.some((it) => it['@id']?.endsWith(':wrap-layout'))).toBe(true);
      expect(items.some((it) => it['@id']?.endsWith(':headless-components'))).toBe(true);
      expect(items.some((it) => it['@id']?.endsWith(':render-webpage'))).toBe(true);
      expect(items.some((it) => it['@id']?.endsWith(':sitemap-robots'))).toBe(true);
      expect(items.some((it) => it['@id']?.endsWith(':ai-knowledge-graph'))).toBe(true);

      // Verify qualifier text was preserved in the graph (Step 3 has qualifier)
      const step3Node = items.find((it) => it['@id']?.endsWith(':configure-connector'));
      expect(step3Node?.text).toContain('Schema Accuracy Guardrails');
    });

    it('mutating quickstart step title, description, and code updates UI and graph together', async () => {
      const dataBefore = await siteApp.fetchData();
      const cloned = cloneSiteData(dataBefore);

      const collections = (cloned as any).collections;
      const qs = collections.find((c: any) => c.id === 'quickstart-steps');
      expect(qs).toBeDefined();

      // Mutate step 2 title, description, and code string
      const step2 = qs.items.find((it: any) => it.id === 'define-schema');
      step2.title = 'Custom Mutated Schema Step Title';
      step2.description = 'Custom mutated description text for verification';
      const codeBlock = step2.content?.find((b: any) => b.type === 'code');
      if (codeBlock) {
        codeBlock.code = '// MUTATED CODE STRING FOR PARITY TEST\nexport const customSchema = 42;';
      }

      // Render UI with mutated data
      const html = renderToString(
        <ContextualSite data={cloned} options={{ disableJsonLdScript: true }}>
          <DocsClient data={cloned} />
        </ContextualSite>
      );
      const visibleText = extractVisibleText(html);

      expect(visibleText).toContain('Custom Mutated Schema Step Title');
      expect(visibleText).toContain('Custom mutated description text for verification');
      expect(visibleText).toContain('// MUTATED CODE STRING FOR PARITY TEST');

      // Generate graph with dataOverrides
      const graph = await siteApp.getGraph({
        pageId: 'docs',
        dataOverrides: { collections: qs },
      });
      const nodes = graph['@graph'] as Record<string, any>[];
      const step2Node = nodes.find((n) => n['@id']?.endsWith(':define-schema'));

      expect(step2Node).toBeDefined();
      expect(step2Node?.name).toBe('Custom Mutated Schema Step Title');
      expect(step2Node?.description).toBe('Custom mutated description text for verification');
      expect(step2Node?.text).toContain('// MUTATED CODE STRING FOR PARITY TEST');
      expect(step2Node?.text).toContain('export const customSchema = 42;');

      // Verify original connector data remained completely unchanged
      const freshData = await siteApp.fetchData();
      const freshQs = (freshData as any).collections.find((c: any) => c.id === 'quickstart-steps');
      const freshStep2 = freshQs.items.find((it: any) => it.id === 'define-schema');
      expect(freshStep2.title).toBe('Define your Site Schema (SSOT)');
    });

    it('reordering quickstart steps preserves stable item IDs across UI and graph', async () => {
      const data = await siteApp.fetchData();
      const cloned = cloneSiteData(data);
      const collections = (cloned as any).collections;
      const qs = collections.find((c: any) => c.id === 'quickstart-steps');

      // Reverse steps order
      qs.items.reverse();
      qs.items.forEach((it: any, idx: number) => {
        it.order = idx + 1;
      });

      const firstReorderedId = qs.items[0].id;
      expect(firstReorderedId).toBe('ai-knowledge-graph');

      // Render UI
      const html = renderToString(
        <ContextualSite data={cloned} options={{ disableJsonLdScript: true }}>
          <DocsClient data={cloned} />
        </ContextualSite>
      );

      // Verify exact parsed item-ID sequence, counts, and numbering using HTML parser
      const $ = parseHtml(html);
      const items = $('ol[data-contextual="collection-root"] > li[data-contextual="collection-item"]');
      expect(items.length).toBe(8);

      const parsedIds = items.map((_, el) => $(el).attr('data-id')).get();
      expect(parsedIds).toEqual(qs.items.map((it: any) => it.id));
      expect(parsedIds[0]).toBe('ai-knowledge-graph');

      const parsedNumbers = items.map((_, el) => $(el).find('span').first().text().trim()).get();
      expect(parsedNumbers).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);

      // Graph reflects the new order
      const graph = await siteApp.getGraph({
        pageId: 'docs',
        dataOverrides: { collections: qs },
      });
      const nodes = graph['@graph'] as Record<string, any>[];
      const qsNode = nodes.find((n) => n['@type'] === 'ItemList' && n['@id']?.includes('quickstart-steps'));
      expect(qsNode?.itemListElement[0]['@id']).toContain(':ai-knowledge-graph');
    });
  });

  describe('R3: Complete Meaningful Content Coverage & Edit Parity', () => {
    it('mutating homepage hero and pipeline narrative updates visible UI and graph together', async () => {
      const dataBefore = await siteApp.fetchData();
      const cloned = cloneSiteData(dataBefore);

      const sections = (cloned as any).sections;
      const hero = sections.find((s: any) => s.id === 'hero');
      expect(hero).toBeDefined();
      hero.title = 'Mutated Hero Heading for Next-Gen Apps';
      hero.description = 'Mutated hero body copy proving real-time edit parity across layers.';

      const pipeline = sections.find((s: any) => s.id === 'data-pipeline');
      expect(pipeline).toBeDefined();
      pipeline.title = 'Mutated Pipeline Architecture Flow';
      pipeline.description = 'Mutated pipeline explanation text visible in both UI and graph.';

      // Render HomeClient
      const html = renderToString(
        <ContextualSite data={cloned} options={{ disableJsonLdScript: true }}>
          <HomeClient data={cloned} />
        </ContextualSite>
      );
      const visibleText = extractVisibleText(html);

      // Verify UI visible text changed
      expect(visibleText).toContain('Mutated Hero Heading for Next-Gen Apps');
      expect(visibleText).toContain('Mutated hero body copy proving real-time edit parity across layers.');
      expect(visibleText).toContain('Mutated Pipeline Architecture Flow');
      expect(visibleText).toContain('Mutated pipeline explanation text visible in both UI and graph.');

      // Verify Graph changed
      const graph = await siteApp.getGraph({
        pageId: 'home',
        dataOverrides: { sections },
      });
      const nodes = graph['@graph'] as Record<string, any>[];

      const heroNode = nodes.find((n) => n['@id']?.includes(':hero'));
      expect(heroNode?.name).toBe('Mutated Hero Heading for Next-Gen Apps');
      expect(heroNode?.description).toBe('Mutated hero body copy proving real-time edit parity across layers.');

      const pipelineNode = nodes.find((n) => n['@id']?.includes(':data-pipeline'));
      expect(pipelineNode?.name).toBe('Mutated Pipeline Architecture Flow');
      expect(pipelineNode?.description).toBe('Mutated pipeline explanation text visible in both UI and graph.');
    });

    it('mutating docs documentation sections updates visible UI and graph together', async () => {
      const dataBefore = await siteApp.fetchData();
      const cloned = cloneSiteData(dataBefore);

      const sections = (cloned as any).sections;
      const schemaReg = sections.find((s: any) => s.id === 'schema-registries');
      expect(schemaReg).toBeDefined();
      schemaReg.title = 'Custom Registries Specification';
      schemaReg.description = 'Custom mutated registries description for parity verification.';

      const connectorsSec = sections.find((s: any) => s.id === 'connectors');
      expect(connectorsSec).toBeDefined();
      connectorsSec.title = 'Universal Data Ingestion Connectors';
      connectorsSec.description = 'Custom connectors description text for verification.';

      // Render DocsClient
      const html = renderToString(
        <ContextualSite data={cloned} options={{ disableJsonLdScript: true }}>
          <DocsClient data={cloned} />
        </ContextualSite>
      );
      const visibleText = extractVisibleText(html);

      expect(visibleText).toContain('Custom Registries Specification');
      expect(visibleText).toContain('Custom mutated registries description for parity verification.');
      expect(visibleText).toContain('Universal Data Ingestion Connectors');
      expect(visibleText).toContain('Custom connectors description text for verification.');

      // Verify Graph changed
      const graph = await siteApp.getGraph({
        pageId: 'docs',
        dataOverrides: { sections },
      });
      const nodes = graph['@graph'] as Record<string, any>[];

      const regNode = nodes.find((n) => n['@id']?.includes(':schema-registries'));
      expect(regNode?.name).toBe('Custom Registries Specification');
      expect(regNode?.description).toBe('Custom mutated registries description for parity verification.');

      const connNode = nodes.find((n) => n['@id']?.includes(':connectors'));
      expect(connNode?.name).toBe('Universal Data Ingestion Connectors');
      expect(connNode?.description).toBe('Custom connectors description text for verification.');
    });

    it('verifies privacy and terms policy actual composition rendering and in-memory mutation parity', async () => {
      const canonicalData = await siteApp.fetchData();

      // 1. Verify canonical PrivacyPage composition renders matching UI and JSON-LD
      const privacyJsx = await PrivacyPage();
      const privacyHtml = renderToString(
        <ContextualSite data={canonicalData} options={{ disableJsonLdScript: true }}>
          {privacyJsx}
        </ContextualSite>
      );
      const privacyText = extractVisibleText(privacyHtml);
      expect(privacyText).toContain('Privacy Policy');
      expect(privacyText).toContain('Contextual UI is an open-source framework');
      expect(privacyText).toContain('Data Storage');

      const privacyScripts = extractJsonLdScripts(privacyHtml);
      expect(privacyScripts.length).toBe(1);
      const privacyEntities = privacyScripts[0]['@graph'] as Record<string, any>[];
      const privacySectionNode = privacyEntities.find((n) => n['@type'] === 'WebPageElement');
      expect(privacySectionNode).toBeDefined();
      expect(privacySectionNode?.text).toContain('Contextual UI is an open-source framework');
      expect(privacySectionNode?.text).toContain('Data Storage');

      // 2. Verify canonical TermsPage composition renders matching UI and JSON-LD
      const termsJsx = await TermsPage();
      const termsHtml = renderToString(
        <ContextualSite data={canonicalData} options={{ disableJsonLdScript: true }}>
          {termsJsx}
        </ContextualSite>
      );
      const termsText = extractVisibleText(termsHtml);
      expect(termsText).toContain('Terms of Service');
      expect(termsText).toContain('Contextual UI is open-source software distributed under the MIT license.');

      const termsScripts = extractJsonLdScripts(termsHtml);
      expect(termsScripts.length).toBe(1);
      const termsEntities = termsScripts[0]['@graph'] as Record<string, any>[];
      const termsSectionNode = termsEntities.find((n) => n['@type'] === 'WebPageElement');
      expect(termsSectionNode).toBeDefined();
      expect(termsSectionNode?.text).toContain('Contextual UI is open-source software distributed under the MIT license.');

      // 3. In-memory paragraph, qualifier, and link mutation on PrivacyPage
      const cloned = cloneSiteData(canonicalData);
      const privacySec = (cloned as any).sections.find((s: any) => s.id === 'privacy-policy');
      expect(privacySec).toBeDefined();

      privacySec.content = [
        {
          type: 'paragraph',
          role: 'normal',
          text: 'Mutated in-memory paragraph for privacy disclosures verification.',
        },
        {
          type: 'paragraph',
          role: 'qualifier',
          text: 'Mutated in-memory qualifier: All processing is local without tracking.',
        },
        {
          type: 'link',
          label: 'Contact Security Team',
          href: 'mailto:security@contextual.site',
        },
      ];

      // Mutated app supplying the same effective data to both WebPage and graph
      const mutatedApp = createContextualApp({
        schema: siteSchema,
        connector: {
          async fetchData() {
            return cloned;
          },
        },
        baseUrl: 'https://contextual.site',
      });

      const mutatedPrivacyJsx = await PrivacyPage({
        data: cloned,
        app: mutatedApp,
      });

      const mutatedHtml = renderToString(
        <ContextualSite data={cloned} options={{ disableJsonLdScript: true }}>
          {mutatedPrivacyJsx}
        </ContextualSite>
      );

      // Verify UI text contains mutated paragraph and qualifier
      const mutatedText = extractVisibleText(mutatedHtml);
      expect(mutatedText).toContain('Mutated in-memory paragraph for privacy disclosures verification.');
      expect(mutatedText).toContain('Mutated in-memory qualifier: All processing is local without tracking.');
      expect(mutatedText).toContain('Contact Security Team');

      // Verify UI contains rendered link with destination
      const $ = parseHtml(mutatedHtml);
      const linkEl = $('a[href="mailto:security@contextual.site"]');
      expect(linkEl.length).toBe(1);
      expect(linkEl.text()).toContain('Contact Security Team');

      // Verify graph generated from the same effective supplied data matches
      const mutatedScripts = extractJsonLdScripts(mutatedHtml);
      expect(mutatedScripts.length).toBe(1);
      const mutatedEntities = mutatedScripts[0]['@graph'] as Record<string, any>[];
      const mutatedSectionNode = mutatedEntities.find((n) => n['@type'] === 'WebPageElement');
      expect(mutatedSectionNode?.text).toContain('Mutated in-memory paragraph for privacy disclosures verification.');
      expect(mutatedSectionNode?.text).toContain('Mutated in-memory qualifier: All processing is local without tracking.');

      // Verify original connector data remained completely unchanged
      const freshData = await siteApp.fetchData();
      const freshPrivacySec = (freshData as any).sections.find((s: any) => s.id === 'privacy-policy');
      expect(freshPrivacySec.content[0].text).toContain('Contextual UI is an open-source framework');
    });
  });
});
