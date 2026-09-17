import { createId, refersTo } from 'jsonld-graph-builder';
import type { JsonLdContext } from '../registry/defineSchema';
import {
  SectionData,
  SectionRecord,
  ContentInput,
  ContentBlock,
  SectionDataSchema,
  isSafeHref,
  CollectionItem,
  CollectionRecord,
  CollectionData,
  CollectionDataSchema,
} from './content.schema';
import type {
  NormalizedSection,
  NormalizedCollection,
  NormalizedCollectionItem,
} from './content.types';

function isProd() {
  try {
    return typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.NODE_ENV === 'production';
  } catch {
    return false;
  }
}

/**
 * Normalizes user input (string, block, or array of strings/blocks)
 * into a typed array of ContentBlock objects.
 */
export function normalizeContentBlocks(input?: ContentInput): ContentBlock[] {
  if (!input) return [];

  const rawItems = Array.isArray(input) ? input : [input];
  const blocks: ContentBlock[] = [];

  for (const item of rawItems) {
    if (typeof item === 'string') {
      const trimmed = item.trim();
      if (trimmed.length > 0) {
        blocks.push({
          type: 'paragraph',
          text: trimmed,
          role: 'normal',
        });
      }
    } else if (item && typeof item === 'object' && 'type' in item) {
      if ((item as any).type === 'link') {
        const linkHref = (item as any).href;
        if (typeof linkHref !== 'string' || !isSafeHref(linkHref)) {
          if (!isProd()) {
            console.warn(`[Contextual UI] Filtered out link block with unsafe protocol: "${linkHref}"`);
          }
          continue;
        }
      }
      blocks.push(item as ContentBlock);
    }
  }

  return blocks;
}

/**
 * Extracts clean plain text from an array of content blocks
 * for Schema.org descriptions and AI context ingestion.
 */
export function extractPlainText(blocks: ContentBlock[]): string {
  if (!blocks || blocks.length === 0) return '';

  const chunks: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
      case 'heading':
        if (block.text) chunks.push(block.text);
        break;
      case 'callout':
        if (block.text) {
          chunks.push(block.title ? `${block.title}: ${block.text}` : block.text);
        }
        break;
      case 'link':
        if (block.label) chunks.push(block.label);
        break;
      case 'code':
        if (block.code) chunks.push(block.code);
        break;
      case 'list':
        if (block.items && block.items.length > 0) {
          const listText = block.items
            .map((it) => (typeof it === 'string' ? it : (it.title ? `${it.title}: ${it.text}` : it.text)))
            .join(' \n');
          chunks.push(listText);
        }
        break;
    }
  }

  return chunks.join('\n\n');
}

/**
 * Normalizes single or array section data into SectionRecord[].
 */
export function normalizeSections(data: SectionData): SectionRecord[] {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

/**
 * Normalizes a single section record with its content blocks and extracted plain text.
 */
export function normalizeSection(section: SectionRecord): NormalizedSection {
  const blocks = normalizeContentBlocks(section.content);
  const plainText = extractPlainText(blocks);
  const about = section.about ? (Array.isArray(section.about) ? section.about : [section.about]) : undefined;
  const mainEntity = section.mainEntity ? (Array.isArray(section.mainEntity) ? section.mainEntity : [section.mainEntity]) : undefined;

  return {
    id: section.id,
    pageId: section.pageId,
    title: section.title,
    subtitle: section.subtitle,
    description: section.description,
    anchor: section.anchor,
    blocks,
    plainText,
    order: section.order,
    about,
    mainEntity,
    inLanguage: section.inLanguage,
    type: section.type || 'WebPageElement',
  };
}

/**
 * Generates Schema.org WebPageElement JSON-LD objects for registered sections.
 */
export function generateSectionJsonLd(data: SectionData, ctx?: Partial<JsonLdContext>) {
  const create = ctx?.createId ?? createId;
  const refer = ctx?.refersTo ?? refersTo;
  const sections = normalizeSections(data);

  return sections.map((sec) => {
    const norm = normalizeSection(sec);

    // Canonical @id: section:pageId:sectionId if pageId present, or section:sectionId
    let sectionId: string;
    if (norm.id.startsWith('#') || norm.id.startsWith('http://') || norm.id.startsWith('https://')) {
      sectionId = norm.id;
    } else if (norm.pageId) {
      sectionId = create('section', `${norm.pageId}:${norm.id}`);
    } else {
      sectionId = create('section', norm.id);
    }

    const jsonLd: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': norm.type,
      '@id': sectionId,
    };

    if (norm.title) jsonLd.name = norm.title;
    if (norm.description) jsonLd.description = norm.description;
    if (norm.plainText) jsonLd.text = norm.plainText;
    if (norm.inLanguage) jsonLd.inLanguage = norm.inLanguage;

    if (norm.anchor) {
      jsonLd.url = norm.anchor.startsWith('#') || norm.anchor.startsWith('/') || norm.anchor.startsWith('http')
        ? norm.anchor
        : `#${norm.anchor}`;
    }

    if (norm.pageId) {
      jsonLd.isPartOf = norm.pageId === 'home' && ctx?.isSinglePage
        ? refer('webpage')
        : refer('webpage', norm.pageId);
    }

    if (norm.about && norm.about.length > 0) {
      jsonLd.about = norm.about.map((ref) => (ref.startsWith('#') || ref.startsWith('http') ? { '@id': ref } : refer(ref)));
    }

    if (norm.mainEntity && norm.mainEntity.length > 0) {
      jsonLd.mainEntity = norm.mainEntity.map((ref) => (ref.startsWith('#') || ref.startsWith('http') ? { '@id': ref } : refer(ref)));
    }

    return jsonLd;
  });
}

/**
 * Serializes sections for AI agents and LLM ingestion.
 */
export function exportAgentData(data: SectionData) {
  const sections = normalizeSections(data);
  return sections.map((sec) => {
    const norm = normalizeSection(sec);
    return {
      id: norm.id,
      pageId: norm.pageId,
      title: norm.title,
      subtitle: norm.subtitle,
      description: norm.description,
      anchor: norm.anchor,
      blocks: norm.blocks,
      plainText: norm.plainText,
      order: norm.order,
      about: norm.about,
      mainEntity: norm.mainEntity,
      inLanguage: norm.inLanguage,
      type: norm.type,
    };
  });
}

/**
 * Safely serializes a JSON-LD object for inclusion in an HTML <script> tag,
 * neutralizing any "</script>" injection or HTML breakout.
 */
export function serializeJsonLd(data: any): string {
  return JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
}

/**
 * Registry factory for sections in defineSchema.
 */
export function sectionRegistry() {
  return {
    type: 'sections' as const,
    schema: SectionDataSchema,
    exportAgentData,
    generateJsonLd: generateSectionJsonLd,
    isGlobal: true,
  };
}

export const sectionsRegistry = sectionRegistry;

/**
 * Normalizes a collection item with its content blocks and extracted plain text.
 */
export function normalizeCollectionItem(item: CollectionItem): NormalizedCollectionItem {
  const blocks = normalizeContentBlocks(item.content);
  const plainText = extractPlainText(blocks);
  return {
    id: item.id,
    title: item.title,
    name: item.name || item.title,
    description: item.description,
    blocks,
    plainText,
    url: item.url,
    order: item.order,
    item: item.item,
    type: item.type || 'ListItem',
  };
}

/**
 * Normalizes single or array collection data into CollectionRecord[].
 */
export function normalizeCollections(data: CollectionData): CollectionRecord[] {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

/**
 * Normalizes a collection record with its items.
 */
export function normalizeCollection(col: CollectionRecord): NormalizedCollection {
  const items = (col.items || []).map((it) => normalizeCollectionItem(it));
  return {
    id: col.id,
    pageId: col.pageId,
    title: col.title,
    name: col.name || col.title,
    description: col.description,
    ordered: Boolean(col.ordered),
    items,
    type: col.type || 'ItemList',
  };
}

/**
 * Generates Schema.org ItemList JSON-LD objects for registered collections.
 */
export function generateCollectionJsonLd(data: CollectionData, ctx?: Partial<JsonLdContext>) {
  const create = ctx?.createId ?? createId;
  const refer = ctx?.refersTo ?? refersTo;
  const collections = normalizeCollections(data);

  return collections.map((col) => {
    const norm = normalizeCollection(col);
    const colId = create('itemlist', norm.pageId ? `${norm.pageId}:${norm.id}` : norm.id);

    const listItems = norm.items.map((it, idx) => {
      const position = it.order !== undefined ? it.order : idx + 1;
      const itemId = create('listitem', `${norm.id}:${it.id || position}`);

      const listItemNode: Record<string, any> = {
        '@type': 'ListItem',
        '@id': itemId,
        position,
      };

      if (it.name || it.title) listItemNode.name = it.name || it.title;
      if (it.description) listItemNode.description = it.description;
      if (it.plainText && !listItemNode.description) listItemNode.description = it.plainText;
      if (it.url) listItemNode.url = it.url;

      if (it.item) {
        if (typeof it.item === 'string') {
          listItemNode.item = it.item.startsWith('#') || it.item.startsWith('http')
            ? { '@id': it.item }
            : refer(it.item);
        } else if (typeof it.item === 'object' && it.item['@id']) {
          listItemNode.item = { '@id': it.item['@id'] };
        }
      }

      return listItemNode;
    });

    const jsonLd: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': norm.type,
      '@id': colId,
      numberOfItems: norm.items.length,
      itemListElement: listItems,
    };

    if (norm.name || norm.title) jsonLd.name = norm.name || norm.title;
    if (norm.description) jsonLd.description = norm.description;
    if (norm.ordered) {
      jsonLd.itemListOrder = 'https://schema.org/ItemListOrderAscending';
    }

    if (norm.pageId) {
      jsonLd.isPartOf = (norm.pageId === 'home' && ctx?.isSinglePage)
        ? refer('webpage')
        : refer('webpage', norm.pageId);
    }

    return jsonLd;
  });
}

/**
 * Serializes collections for AI agents and LLM ingestion.
 */
export function exportCollectionAgentData(data: CollectionData) {
  const collections = normalizeCollections(data);
  return collections.map((col) => {
    const norm = normalizeCollection(col);
    return {
      id: norm.id,
      pageId: norm.pageId,
      title: norm.title,
      name: norm.name,
      description: norm.description,
      ordered: norm.ordered,
      items: norm.items.map((it) => ({
        id: it.id,
        title: it.title,
        name: it.name,
        description: it.description,
        blocks: it.blocks,
        plainText: it.plainText,
        url: it.url,
        order: it.order,
        item: it.item,
        type: it.type,
      })),
      type: norm.type,
    };
  });
}

/**
 * Registry factory for collections in defineSchema.
 */
export function collectionRegistry() {
  return {
    type: 'collections' as const,
    schema: CollectionDataSchema,
    exportAgentData: exportCollectionAgentData,
    generateJsonLd: generateCollectionJsonLd,
    isGlobal: true,
  };
}

export const collectionsRegistry = collectionRegistry;
