import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
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
        '@id': '#listitem:features:headless-radix',
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
});
