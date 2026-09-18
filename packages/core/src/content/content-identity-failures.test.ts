import { describe, it, expect } from 'vitest';
import { buildGraph } from 'jsonld-graph-builder';
import {
  generateCollectionJsonLd,
  collectionRegistry,
} from './content.utils';
import { validateGraphReferences } from './content.validator';
import { defineSchema } from '../registry/defineSchema';
import { webpageRegistry } from '../components/webpage/webpage.utils';
import { websiteRegistry } from '../components/website/website.utils';
import { organizationRegistry } from '../components/organization/organization.utils';
import { createContextualApp } from '../server/createContextualApp';
import type { CollectionRecord } from './content.schema';

describe('V2-0 Core Identity & Validation Failure Fixtures (REVERIFICATION F1, F2)', () => {
  describe('F1: Custom & Absolute Collection Identity and Reference Integrity', () => {
    it('Fixture 1 (Direct & App): distinct absolute parent URIs with different origins do not collide', async () => {
      const colA: CollectionRecord = {
        id: 'https://a.example/features',
        title: 'Features A',
        items: [{ id: 'first', title: 'Feature Alpha' }],
      };
      const colB: CollectionRecord = {
        id: 'https://b.example/features',
        title: 'Features B',
        items: [{ id: 'first', title: 'Feature Beta' }],
      };

      // 1. Direct generator test
      const jsonLd = generateCollectionJsonLd([colA, colB]);
      const listA = jsonLd.find((l: any) => l.name === 'Features A');
      const listB = jsonLd.find((l: any) => l.name === 'Features B');

      expect(listA).toBeDefined();
      expect(listB).toBeDefined();
      // Parent IDs must not collide
      expect(listA['@id']).not.toBe(listB['@id']);

      // Child item IDs must not collide
      const itemA = listA.itemListElement[0];
      const itemB = listB.itemListElement[0];
      expect(itemA['@id']).not.toBe(itemB['@id']);

      // Unified graph must not collapse them into one node with array names
      const graph = buildGraph(jsonLd);
      const nodes = graph['@graph'] as Record<string, any>[];
      const items = nodes.filter((n) => n['@type'] === 'ListItem');
      expect(items).toHaveLength(2);
      expect(Array.isArray(items[0].name)).toBe(false);

      // 2. Executed through createContextualApp
      const appSchema = defineSchema({
        website: websiteRegistry(),
        collections: collectionRegistry(),
      });
      const app = createContextualApp({
        schema: appSchema,
        connector: {
          async fetchData() {
            return {
              website: { name: 'Origin Test', url: 'https://example.com' },
              collections: [colA, colB],
            };
          },
        },
        baseUrl: 'https://example.com',
      });

      const appGraph = await app.getGraph({ includeAll: true });
      const appNodes = appGraph['@graph'] as Record<string, any>[];
      const appItems = appNodes.filter((n) => n['@type'] === 'ListItem');
      expect(appItems).toHaveLength(2);
      expect(Array.isArray(appItems[0].name)).toBe(false);
    });

    it('Fixture 2 (Direct & App): custom fragment collection ID resolves without missing local references', async () => {
      const customCol: CollectionRecord = {
        id: '#custom-list',
        pageId: 'docs',
        title: 'Custom List',
        items: [{ id: 'item-1', title: 'Item One' }],
      };

      // 1. Direct generator: collection ID must agree with explicit identity
      const jsonLd = generateCollectionJsonLd(customCol);
      expect(jsonLd[0]['@id']).toBe('#custom-list');

      // 2. Executed through createContextualApp with WebPage ownership
      const appSchema = defineSchema({
        organization: organizationRegistry(),
        website: websiteRegistry(),
        webpage: webpageRegistry(),
        collections: collectionRegistry(),
      });

      const app = createContextualApp({
        schema: appSchema,
        connector: {
          async fetchData() {
            return {
              organization: { name: 'Acme', url: 'https://example.com' },
              website: { name: 'Acme Site', url: 'https://example.com' },
              webpage: [
                {
                  id: 'docs',
                  url: '/docs',
                  hasPart: ['#custom-list'],
                },
              ],
              collections: [customCol],
            };
          },
        },
        baseUrl: 'https://example.com',
      });

      // Both flattened and nested graphs must have zero missing local references
      const docsGraph = await app.getGraph({ pageId: 'docs' });
      const validation = validateGraphReferences(docsGraph, { baseUrl: 'https://example.com' });
      expect(validation.missingLocalIds).toEqual([]);

      const allGraph = await app.getGraph({ includeAll: true });
      const allValidation = validateGraphReferences(allGraph, { baseUrl: 'https://example.com' });
      expect(allValidation.missingLocalIds).toEqual([]);
    });

    it('Fixture 3 (Direct & App): delimiter collision at tuple boundary generates distinct IDs', async () => {
      // (pageId=home, collection=features, item=extra:first)
      const col1: CollectionRecord = {
        id: 'features',
        pageId: 'home',
        title: 'Features List',
        items: [{ id: 'extra:first', title: 'Extra Colon First' }],
      };

      // (pageId=home, collection=features:extra, item=first)
      const col2: CollectionRecord = {
        id: 'features:extra',
        pageId: 'home',
        title: 'Features Extra List',
        items: [{ id: 'first', title: 'First In Extra' }],
      };

      // 1. Direct generator test
      const jsonLd = generateCollectionJsonLd([col1, col2]);
      const item1Id = jsonLd[0].itemListElement[0]['@id'];
      const item2Id = jsonLd[1].itemListElement[0]['@id'];

      // Must NOT collide into the same #listitem:home:features:extra:first
      expect(item1Id).not.toBe(item2Id);

      // Graph must contain two distinct ListItems
      const graph = buildGraph(jsonLd);
      const nodes = graph['@graph'] as Record<string, any>[];
      const items = nodes.filter((n) => n['@type'] === 'ListItem');
      expect(items).toHaveLength(2);

      // 2. Executed through createContextualApp
      const appSchema = defineSchema({
        website: websiteRegistry(),
        collections: collectionRegistry(),
      });
      const app = createContextualApp({
        schema: appSchema,
        connector: {
          async fetchData() {
            return {
              website: { name: 'Delimiter Test', url: 'https://example.com' },
              collections: [col1, col2],
            };
          },
        },
        baseUrl: 'https://example.com',
      });

      const appGraph = await app.getGraph({ includeAll: true });
      const appNodes = appGraph['@graph'] as Record<string, any>[];
      const appItems = appNodes.filter((n) => n['@type'] === 'ListItem');
      expect(appItems).toHaveLength(2);
      expect(appItems[0]['@id']).not.toBe(appItems[1]['@id']);
    });
  });

  describe('F2: Stable Item-ID Validation and Duplicate Detection', () => {
    it('Fixture 4 (Direct & App): whitespace-equivalent item IDs are rejected with validation error', async () => {
      const colWithWhitespaceDup: CollectionRecord = {
        id: 'features',
        pageId: 'home',
        title: 'Features',
        items: [
          { id: 'first', title: 'Canonical First' },
          { id: ' first ', title: 'Whitespace First' },
        ],
      };

      // 1. Direct generator must reject with an error instead of silently merging
      expect(() => generateCollectionJsonLd(colWithWhitespaceDup)).toThrow(
        /Duplicate collection item id|whitespace/i
      );

      // 2. Executed through createContextualApp
      const appSchema = defineSchema({
        website: websiteRegistry(),
        collections: collectionRegistry(),
      });
      const app = createContextualApp({
        schema: appSchema,
        connector: {
          async fetchData() {
            return {
              website: { name: 'WS Test', url: 'https://example.com' },
              collections: [colWithWhitespaceDup],
            };
          },
        },
        baseUrl: 'https://example.com',
      });

      // Must reject during graph generation or schema parse
      await expect(app.getGraph({ includeAll: true })).rejects.toThrow();
    });

    it('Fixture 5 (Direct & App): empty string item ID is rejected instead of falling back to position', async () => {
      const colWithEmptyId: CollectionRecord = {
        id: 'features',
        pageId: 'home',
        title: 'Features',
        items: [
          { id: '', title: 'Empty ID Item' },
        ],
      };

      // 1. Direct generator must reject empty string item id
      expect(() => generateCollectionJsonLd(colWithEmptyId)).toThrow(
        /Collection item must have a non-empty stable string id|id.*empty/i
      );

      // 2. Executed through createContextualApp
      const appSchema = defineSchema({
        website: websiteRegistry(),
        collections: collectionRegistry(),
      });
      const app = createContextualApp({
        schema: appSchema,
        connector: {
          async fetchData() {
            return {
              website: { name: 'Empty Test', url: 'https://example.com' },
              collections: [colWithEmptyId],
            };
          },
        },
        baseUrl: 'https://example.com',
      });

      await expect(app.getGraph({ includeAll: true })).rejects.toThrow();
    });
  });
});
