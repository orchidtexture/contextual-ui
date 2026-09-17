import { createId, refersTo } from 'jsonld-graph-builder';
import type { JsonLdContext } from '../../registry/defineSchema';
import { FaqDataSchema, FaqData } from './faq.schema';

/**
 * Generates a Schema.org FAQPage JSON-LD object with full @id references.
 */
export function generateFaqJsonLd(items: FaqData, ctx?: Partial<JsonLdContext>) {
  if (!items || !Array.isArray(items) || items.length === 0) return null;

  const create = ctx?.createId ?? createId;
  const refer = ctx?.refersTo ?? refersTo;

  const pageId = (items as any).pageId || items[0]?.pageId || ctx?.targetPageId;
  const isPartOf = pageId && (pageId !== 'home' || !ctx?.isSinglePage)
    ? refer('webpage', pageId)
    : refer('webpage');

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': create('faq'),
    isPartOf,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * Exports plain data for internal AI agents or other integrations.
 */
export function exportAgentData(items: FaqData) {
  if (!items || !Array.isArray(items)) return [];
  return items.map(({ id, pageId, question, answer }) => ({
    id,
    pageId,
    question,
    answer,
  }));
}

/**
 * Creates a structural registry item for the schema definition (decoupled from data).
 */
export function faqRegistry() {
  return {
    type: 'faq' as const,
    schema: FaqDataSchema,
    exportAgentData,
    generateJsonLd: generateFaqJsonLd,
    isGlobal: false,
  };
}
