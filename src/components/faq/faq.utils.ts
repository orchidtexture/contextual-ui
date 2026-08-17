import { FaqDataSchema, FaqData } from './faq.schema';

/**
 * Generates a Schema.org FAQPage JSON-LD object.
 */
export function generateFaqJsonLd(items: FaqData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
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
