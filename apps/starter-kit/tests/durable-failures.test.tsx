import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { ContextualSite } from 'contextual-ui';
import { siteApp } from '@/data/site.server';
import { HomeClient } from '@/app/HomeClient';
import { DocsClient } from '@/app/docs/DocsClient';
import {
  quickstartStepDefinitions,
  buildQuickstartCollection,
} from '@/data/quickstart';
import {
  extractVisibleText,
  parseHtml,
  cloneSiteData,
} from './helpers';

describe('V2-0 Durable App Failure Probes (REVERIFICATION F4, F5)', () => {
  describe('F4: Homepage CTA and Diagram Edit Parity Probes', () => {
    it('Probe 1 (Failing): mutating hero CTA label and href updates visible UI and graph together', async () => {
      const dataBefore = await siteApp.fetchData();
      const cloned = cloneSiteData(dataBefore);

      const hero = (cloned as any).sections.find((s: any) => s.id === 'hero');
      expect(hero).toBeDefined();

      // Find first link in hero content and mutate label and href
      const ctaLink = hero.content?.find((b: any) => b.type === 'link');
      expect(ctaLink).toBeDefined();
      ctaLink.label = 'REVERIFY_CTA_SENTINEL';
      ctaLink.href = '/docs#helpers';

      // Render HomeClient with mutated data
      const html = renderToString(
        <ContextualSite data={cloned} options={{ disableJsonLdScript: true }}>
          <HomeClient data={cloned} />
        </ContextualSite>
      );

      // UI assertion: visible text must contain mutated CTA label and anchor must have mutated href
      const visibleText = extractVisibleText(html);
      const $ = parseHtml(html);
      const mutatedAnchor = $('a[href="/docs#helpers"]');

      expect(visibleText).toContain('REVERIFY_CTA_SENTINEL');
      expect(mutatedAnchor.length).toBe(1);
      expect(mutatedAnchor.text()).toContain('REVERIFY_CTA_SENTINEL');

      // Graph assertion: page graph reflects the mutated link
      const graph = await siteApp.getGraph({
        pageId: 'home',
        dataOverrides: { sections: (cloned as any).sections },
      });
      const nodes = graph['@graph'] as Record<string, any>[];
      const heroNode = nodes.find((n) => n['@id']?.includes(':hero'));
      expect(heroNode?.text).toContain('REVERIFY_CTA_SENTINEL');
    });

    it('Probe 2 (Failing): mutating supplied pipeline-stage description updates diagram UI and graph together', async () => {
      const dataBefore = await siteApp.fetchData();
      const cloned = cloneSiteData(dataBefore);

      const pipelineStages = (cloned as any).collections.find((c: any) => c.id === 'pipeline-stages');
      expect(pipelineStages).toBeDefined();

      const engineNode = pipelineStages.items.find((it: any) => it.id === 'engine-node');
      expect(engineNode).toBeDefined();
      engineNode.description = 'REVERIFY_PIPELINE_BODY: Mutated pipeline engine explanation text.';

      // Render HomeClient with mutated data
      const html = renderToString(
        <ContextualSite data={cloned} options={{ disableJsonLdScript: true }}>
          <HomeClient data={cloned} />
        </ContextualSite>
      );

      // UI assertion: visible text of the diagram explanation must contain mutated text
      const visibleText = extractVisibleText(html);
      expect(visibleText).toContain('REVERIFY_PIPELINE_BODY');

      // Graph assertion: graph ListItem reflects the mutated description
      const graph = await siteApp.getGraph({
        pageId: 'home',
        dataOverrides: { collections: (cloned as any).collections },
      });
      const nodes = graph['@graph'] as Record<string, any>[];
      const engineGraphNode = nodes.find((n) => n['@id']?.includes(':engine-node'));
      expect(engineGraphNode?.description).toContain('REVERIFY_PIPELINE_BODY');
    });
  });

  describe('F5: Quickstart Semantics and Completeness Probes', () => {
    it('Probe 3 (Failing): adding a paragraph body to a quickstart step renders in UI and graph', async () => {
      const dataBefore = await siteApp.fetchData();
      const cloned = cloneSiteData(dataBefore);

      const qs = (cloned as any).collections.find((c: any) => c.id === 'quickstart-steps');
      expect(qs).toBeDefined();

      const step2 = qs.items.find((it: any) => it.id === 'define-schema');
      expect(step2).toBeDefined();

      if (!Array.isArray(step2.content)) {
        step2.content = [];
      }
      step2.content.unshift({
        type: 'paragraph',
        role: 'normal',
        text: 'REVERIFY_PARAGRAPH_BODY: Detailed schema validation instructions.',
      });

      // Render DocsClient
      const html = renderToString(
        <ContextualSite data={cloned} options={{ disableJsonLdScript: true }}>
          <DocsClient data={cloned} />
        </ContextualSite>
      );

      const visibleText = extractVisibleText(html);
      expect(visibleText).toContain('REVERIFY_PARAGRAPH_BODY: Detailed schema validation instructions.');

      // Graph reflects the paragraph in step text
      const graph = await siteApp.getGraph({
        pageId: 'docs',
        dataOverrides: { collections: qs },
      });
      const nodes = graph['@graph'] as Record<string, any>[];
      const step2Node = nodes.find((n) => n['@id']?.includes(':define-schema'));
      expect(step2Node?.text).toContain('REVERIFY_PARAGRAPH_BODY');
    });

    it('Probe 4 (Failing): quickstart API step preserves optional qualification in its own graph node', async () => {
      const docsGraph = await siteApp.getGraph({ pageId: 'docs' });
      const nodes = docsGraph['@graph'] as Record<string, any>[];

      const apiStep = nodes.find((n) => n['@id']?.includes(':ai-knowledge-graph'));
      expect(apiStep).toBeDefined();

      // The step's own graph node must preserve its qualification
      const stepContentText = `${apiStep?.name || ''} ${apiStep?.description || ''} ${apiStep?.text || ''}`;
      expect(stepContentText.toLowerCase()).toContain('optional');
    });

    it('Probe 5 (Failing): reversing step definitions without repairing order derives sequential positions', async () => {
      const dataBefore = await siteApp.fetchData();
      const cloned = cloneSiteData(dataBefore);

      // Reverse definition order without manual s.order renumbering
      const reversedDefs = [...quickstartStepDefinitions].reverse();
      const reversedCol = buildQuickstartCollection(reversedDefs);

      // The first item in the reversed collection is now ai-knowledge-graph
      expect(reversedCol.items[0].id).toBe('ai-knowledge-graph');

      // Graph positions must derive from the new array sequence (1..8), not old hardcoded s.order (8..1)
      const graph = await siteApp.getGraph({
        pageId: 'docs',
        dataOverrides: { collections: [reversedCol] },
      });
      const nodes = graph['@graph'] as Record<string, any>[];
      const items = nodes.filter((n) => n['@type'] === 'ListItem' && n['@id']?.includes('quickstart-steps'));

      const firstItem = items.find((n) => n['@id']?.includes(':ai-knowledge-graph'));
      expect(firstItem?.position).toBe(1);

      // Render UI with reversed collection
      (cloned as any).collections = [reversedCol];
      const html = renderToString(
        <ContextualSite data={cloned} options={{ disableJsonLdScript: true }}>
          <DocsClient data={cloned} />
        </ContextualSite>
      );

      const $ = parseHtml(html);
      const firstLi = $('ol[data-contextual="collection-root"] > li').first();
      expect(firstLi.attr('data-id')).toBe('ai-knowledge-graph');
      // Number badge should display 1, not 8
      expect(firstLi.find('span').first().text().trim()).toBe('1');
    });
  });

  describe('Retained Positive Probes (Behavior must not regress)', () => {
    it('Positive Probe 1: mutating existing quickstart code updates visible UI and graph text together', async () => {
      const dataBefore = await siteApp.fetchData();
      const cloned = cloneSiteData(dataBefore);

      const qs = (cloned as any).collections.find((c: any) => c.id === 'quickstart-steps');
      const stepWithCode = qs.items.find((it: any) => it.id === 'define-schema');
      expect(stepWithCode).toBeDefined();

      const codeBlock = stepWithCode.content?.find((b: any) => b.type === 'code');
      expect(codeBlock).toBeDefined();
      codeBlock.code = '// POSITIVE_PROBE_CODE_SENTINEL\nexport const customSchema = 42;';

      const html = renderToString(
        <ContextualSite data={cloned} options={{ disableJsonLdScript: true }}>
          <DocsClient data={cloned} />
        </ContextualSite>
      );

      const visibleText = extractVisibleText(html);
      expect(visibleText).toContain('POSITIVE_PROBE_CODE_SENTINEL');

      const graph = await siteApp.getGraph({
        pageId: 'docs',
        dataOverrides: { collections: qs },
      });
      const nodes = graph['@graph'] as Record<string, any>[];
      const stepNode = nodes.find((n) => n['@id']?.includes(':define-schema'));
      expect(stepNode?.text).toContain('POSITIVE_PROBE_CODE_SENTINEL');
    });

    it('Positive Probe 2: removing two steps and adding one updates UI list and graph count', async () => {
      const dataBefore = await siteApp.fetchData();
      const cloned = cloneSiteData(dataBefore);

      const qs = (cloned as any).collections.find((c: any) => c.id === 'quickstart-steps');

      // Remove 2 steps (last two)
      qs.items = qs.items.slice(0, 6);

      // Add 1 custom step
      qs.items.push({
        id: 'verify-production',
        title: 'Verify Production Readiness',
        description: 'Run automated checks against the live built output.',
        type: 'ListItem',
        order: 7,
      });

      expect(qs.items).toHaveLength(7);

      // Render UI
      const html = renderToString(
        <ContextualSite data={cloned} options={{ disableJsonLdScript: true }}>
          <DocsClient data={cloned} />
        </ContextualSite>
      );

      const visibleText = extractVisibleText(html);
      expect(visibleText).toContain('Verify Production Readiness');
      expect(visibleText).not.toContain('Add Automated Sitemap & Robots.txt');

      const $ = parseHtml(html);
      const liElements = $('ol[data-contextual="collection-root"] > li');
      expect(liElements.length).toBe(7);

      // Verify Graph count
      const graph = await siteApp.getGraph({
        pageId: 'docs',
        dataOverrides: { collections: qs },
      });
      const nodes = graph['@graph'] as Record<string, any>[];
      const listNode = nodes.find((n) => n['@type'] === 'ItemList' && n['@id']?.includes('quickstart-steps'));
      expect(listNode?.numberOfItems).toBe(7);

      const itemNodes = nodes.filter((n) => n['@type'] === 'ListItem' && n['@id']?.includes('quickstart-steps'));
      expect(itemNodes).toHaveLength(7);
      expect(itemNodes.some((n) => n['@id']?.includes(':verify-production'))).toBe(true);
    });
  });
});
