import { createId, refersTo } from 'jsonld-graph-builder';
import type { JsonLdContext } from '../../registry/defineSchema';
import { FaqDataSchema, FaqData } from './faq.schema';

/**
 * Generates a Schema.org FAQPage JSON-LD object with full @id references.
 */
export function generateFaqJsonLd(items: FaqData, ctx?: Partial<JsonLdContext>) {
  const create = ctx?.createId ?? createId;
  const refer = ctx?.refersTo ?? refersTo;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': create('faq'),
    url: '/',
    isPartOf: refer('website'),
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      '@id': create('faq-q', item.id),
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        '@id': create('faq-a', item.id),
        text: item.answer,
      },
    })),
  };
}

/**
 * Exports plain data for internal AI agents or other integrations.
 */
export function exportAgentData(items: FaqData) {
  return items.map(({ id, question, answer }) => ({
    id,
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
  };
}
