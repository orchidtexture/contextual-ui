import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { buildGraph } from 'jsonld-graph-builder';
import { Collection } from './Collection';
import {
  generateCollectionJsonLd,
  exportCollectionAgentData,
  collectionRegistry,
} from '../../content/content.utils';
import { defineSchema } from '../../registry/defineSchema';
import type { CollectionRecord } from '../../content/content.schema';

describe('Collection Primitive & JSON-LD', () => {
  const sampleFeatures: CollectionRecord = {
    id: 'features',
    pageId: 'home',
    title: 'Core Features',
    ordered: false,
    items: [
      {
        id: 'headless-radix',
        title: 'Radix asChild Pattern',
        description: 'Slot into custom buttons, links, or motion components.',
      },
      {
        id: 'agnostic',
        title: 'Design System Agnostic',
        description: 'Compatible with Tailwind CSS, Shadcn UI, or custom tokens.',
      },
      {
        id: 'accessibility',
        title: 'WAI-ARIA Accessibility',
        description: 'Keyboard navigation and robust screenreader announcements.',
      },
      {
        id: 'microdata',
        title: 'Automated Microdata',
        description: 'Emits valid Schema.org JSON-LD behind the scenes.',
      },
    ],
  };

  const sampleSteps: CollectionRecord = {
    id: 'quickstart-steps',
    pageId: 'docs',
    title: 'Quickstart Steps',
    ordered: true,
    items: [
      {
        id: 'step-1',
        title: 'Install Dependencies',
        description: 'Run pnpm add contextual-ui zod',
        order: 1,
      },
      {
        id: 'step-2',
        title: 'Define Site Schema',
        description: 'Configure defineSchema with built-in registries',
        order: 2,
      },
      {
        id: 'step-3',
        title: 'Mount ContextualSite & WebPage',
        description: 'Wrap root layout and route pages',
        order: 3,
      },
    ],
  };

  describe('DOM Rendering', () => {
    it('renders unordered Collection with items, titles, and descriptions', () => {
      const html = renderToString(
        <Collection.Root data={sampleFeatures} className="grid grid-cols-2 gap-4">
          {sampleFeatures.items.map((item) => (
            <Collection.Item key={item.id} id={item.id} className="feature-card">
              <Collection.Title as="h4" className="font-bold text-lg" />
              <Collection.Description className="text-zinc-400 text-sm" />
            </Collection.Item>
          ))}
        </Collection.Root>
      );

      expect(html).toContain('data-contextual="collection-root"');
      expect(html).toContain('class="grid grid-cols-2 gap-4"');
      expect(html).toContain('data-contextual="collection-item" data-id="headless-radix"');
      expect(html).toContain('<h4 data-contextual="collection-title" class="font-bold text-lg">Radix asChild Pattern</h4>');
      expect(html).toContain('<p data-contextual="collection-description" class="text-zinc-400 text-sm">Slot into custom buttons, links, or motion components.</p>');
      expect(html).toContain('Automated Microdata');
    });

    it('renders ordered Collection with ol and li semantic elements', () => {
      const html = renderToString(
        <Collection.Root data={sampleSteps} className="steps-flow">
          {sampleSteps.items.map((item, idx) => (
            <Collection.Item key={item.id} id={item.id} index={idx} className="step-row">
              <Collection.Title as="h3" />
              <Collection.Description />
            </Collection.Item>
          ))}
        </Collection.Root>
      );

      expect(html).toContain('<ol data-contextual="collection-root" data-ordered="true" class="steps-flow">');
      expect(html).toContain('<li data-contextual="collection-item" data-id="step-1" class="step-row">');
      expect(html).toContain('Install Dependencies');
      expect(html).toContain('Mount ContextualSite &amp; WebPage');
    });

    it('supports render callback function on Collection.Root and Collection.Item', () => {
      const html = renderToString(
        <Collection.Root data={sampleFeatures}>
          {(items) => (
            <div className="custom-items-container">
              {items.map((item, index) => (
                <Collection.Item key={item.id} item={item} index={index}>
                  {(it) => (
                    <span className="badge">
                      {it.title} ({it.description})
                    </span>
                  )}
                </Collection.Item>
              ))}
            </div>
          )}
        </Collection.Root>
      );

      expect(html).toContain('class="custom-items-container"');
      expect(html).toContain('Radix asChild Pattern');
      expect(html).toContain('Slot into custom buttons');
    });
  });

  describe('Schema.org ItemList JSON-LD Generation', () => {
    it('generates standard Schema.org ItemList with ListItem entries and positions', () => {
      const result = generateCollectionJsonLd(sampleFeatures);
      expect(result).toHaveLength(1);

      const listNode = result[0];
      expect(listNode['@type']).toBe('ItemList');
      expect(listNode['@id']).toBe('#itemlist:home:features');
      expect(listNode.name).toBe('Core Features');
      expect(listNode.numberOfItems).toBe(4);
      expect(listNode.isPartOf).toEqual({ '@id': '#webpage:home' });

      expect(listNode.itemListElement).toHaveLength(4);
      expect(listNode.itemListElement[0]).toEqual({
        '@type': 'ListItem',
        '@id': '#listitem:home:features:headless-radix',
        position: 1,
        name: 'Radix asChild Pattern',
        description: 'Slot into custom buttons, links, or motion components.',
      });
      expect(listNode.itemListElement[3].name).toBe('Automated Microdata');
      expect(listNode.itemListOrder).toBeUndefined(); // Unordered
    });

    it('generates ordered ItemList with itemListOrder and explicit step positions', () => {
      const result = generateCollectionJsonLd(sampleSteps);
      const listNode = result[0];

      expect(listNode['@type']).toBe('ItemList');
      expect(listNode['@id']).toBe('#itemlist:docs:quickstart-steps');
      expect(listNode.itemListOrder).toBe('https://schema.org/ItemListOrderAscending');
      expect(listNode.numberOfItems).toBe(3);

      expect(listNode.itemListElement[0].position).toBe(1);
      expect(listNode.itemListElement[0].name).toBe('Install Dependencies');
      expect(listNode.itemListElement[1].position).toBe(2);
      expect(listNode.itemListElement[2].position).toBe(3);
    });

    it('exports clean serializable agent data', () => {
      const agentData = exportCollectionAgentData(sampleFeatures);
      expect(agentData).toHaveLength(1);
      expect(agentData[0].id).toBe('features');
      expect(agentData[0].items).toHaveLength(4);
      expect(agentData[0].items[0].title).toBe('Radix asChild Pattern');
    });

    it('integrates into defineSchema via collectionRegistry()', () => {
      const schema = defineSchema({
        collections: collectionRegistry(),
      });

      const hydrated = schema.hydrate({
        collections: [sampleFeatures],
      });

      const jsonLd = hydrated.generateJsonLd();
      expect(jsonLd.collections).toBeDefined();
      expect(jsonLd.collections[0]['@type']).toBe('ItemList');
      expect(jsonLd.collections[0].itemListElement).toHaveLength(4);
    });
  });

  describe('Cross-Page Collection Item Identity (R4)', () => {
    it('prevents cross-page collisions when two collections on different pages share collection and item IDs', () => {
      const homeCol: CollectionRecord = {
        id: 'features',
        pageId: 'home',
        title: 'Home Features',
        items: [{ id: 'first', title: 'Home-only feature' }],
      };

      const docsCol: CollectionRecord = {
        id: 'features',
        pageId: 'docs',
        title: 'Docs Features',
        items: [{ id: 'first', title: 'Docs-only feature' }],
      };

      const jsonLdNodes = generateCollectionJsonLd([homeCol, docsCol]);
      const homeList = jsonLdNodes[0];
      const docsList = jsonLdNodes[1];

      // Parent IDs have page namespaces
      expect(homeList['@id']).toBe('#itemlist:home:features');
      expect(docsList['@id']).toBe('#itemlist:docs:features');

      // Child item IDs must incorporate collection scope
      expect(homeList.itemListElement[0]['@id']).toBe('#listitem:home:features:first');
      expect(docsList.itemListElement[0]['@id']).toBe('#listitem:docs:features:first');

      // Unscoped collection parent & item IDs
      const unscopedCol: CollectionRecord = {
        id: 'features',
        title: 'Global Features',
        items: [{ id: 'first', title: 'Global feature' }],
      };
      const unscopedJsonLd = generateCollectionJsonLd(unscopedCol)[0];
      expect(unscopedJsonLd['@id']).toBe('#itemlist:features');
      expect(unscopedJsonLd.itemListElement[0]['@id']).toBe('#listitem:features:first');

      // When building a unified graph, the two items must NOT merge into a single node with array names
      const graph = buildGraph(jsonLdNodes);
      const graphNodes = graph['@graph'] as Record<string, any>[];
      const listItems = graphNodes.filter((n) => n['@type'] === 'ListItem');
      expect(listItems).toHaveLength(2);

      const homeItemNode = listItems.find((n) => n['@id'] === '#listitem:home:features:first');
      const docsItemNode = listItems.find((n) => n['@id'] === '#listitem:docs:features:first');
      expect(homeItemNode).toBeDefined();
      expect(docsItemNode).toBeDefined();
      expect(homeItemNode?.name).toBe('Home-only feature');
      expect(docsItemNode?.name).toBe('Docs-only feature');
    });

    it('rejects duplicate item identifiers within a single collection', () => {
      const colWithDuplicate: CollectionRecord = {
        id: 'features',
        pageId: 'home',
        title: 'Features',
        items: [
          { id: 'dup', title: 'First Dup' },
          { id: 'dup', title: 'Second Dup' },
        ],
      };

      expect(() => generateCollectionJsonLd(colWithDuplicate)).toThrow(
        /Duplicate collection item id "dup"/
      );
    });

    it('leaves item IDs unchanged upon copy edits or position reordering', () => {
      const colA: CollectionRecord = {
        id: 'features',
        pageId: 'home',
        title: 'Original Title',
        items: [
          { id: 'item-1', title: 'Original Item 1', order: 1 },
          { id: 'item-2', title: 'Original Item 2', order: 2 },
        ],
      };

      const colReorderedAndEdited: CollectionRecord = {
        id: 'features',
        pageId: 'home',
        title: 'Updated Title',
        items: [
          // Swap order and edit title/description
          { id: 'item-2', title: 'Edited Item 2', description: 'Updated text', order: 1 },
          { id: 'item-1', title: 'Edited Item 1', description: 'Updated text 1', order: 2 },
        ],
      };

      const resA = generateCollectionJsonLd(colA)[0];
      const resB = generateCollectionJsonLd(colReorderedAndEdited)[0];

      // Item IDs are identical despite title/description edit or position reorder
      const item2Before = resA.itemListElement.find((i: any) => i['@id'] === '#listitem:home:features:item-2');
      const item2After = resB.itemListElement.find((i: any) => i['@id'] === '#listitem:home:features:item-2');

      expect(item2Before).toBeDefined();
      expect(item2After).toBeDefined();
      expect(item2Before['@id']).toBe(item2After['@id']);
      expect(item2After.name).toBe('Edited Item 2');
    });

    it('preserves distinct list items while referencing a shared Service entity', () => {
      const colHome: CollectionRecord = {
        id: 'featured-services',
        pageId: 'home',
        items: [
          { id: 'card-1', title: 'Auditing Service', item: '#service:auditing' },
        ],
      };
      const colDocs: CollectionRecord = {
        id: 'featured-services',
        pageId: 'docs',
        items: [
          { id: 'card-1', title: 'Auditing Service In Docs', item: '#service:auditing' },
        ],
      };

      const jsonLd = generateCollectionJsonLd([colHome, colDocs]);
      const graph = buildGraph(jsonLd);
      const graphNodes = graph['@graph'] as Record<string, any>[];

      const listItems = graphNodes.filter((n) => n['@type'] === 'ListItem');
      expect(listItems).toHaveLength(2);

      // Distinct list items
      expect(listItems[0]['@id']).toBe('#listitem:home:featured-services:card-1');
      expect(listItems[1]['@id']).toBe('#listitem:docs:featured-services:card-1');

      // Both point to the exact same shared service #service:auditing
      expect(listItems[0].item).toEqual({ '@id': '#service:auditing' });
      expect(listItems[1].item).toEqual({ '@id': '#service:auditing' });
    });

    it('canonicalizes list items with baseUrl deterministically', () => {
      const col: CollectionRecord = {
        id: 'steps',
        pageId: 'guide',
        items: [{ id: 'init', title: 'Initialize' }],
      };

      const jsonLd = generateCollectionJsonLd(col);
      const graph = buildGraph(jsonLd, { baseUrl: 'https://example.com' });
      const graphNodes = graph['@graph'] as Record<string, any>[];

      const itemNode = graphNodes.find((n) => n['@type'] === 'ListItem');
      expect(itemNode).toBeDefined();
      expect(itemNode?.['@id']).toBe('https://example.com/#listitem:guide:steps:init');
    });
  });
});
