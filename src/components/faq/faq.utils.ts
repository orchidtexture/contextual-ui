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
 * Creates a fully configured registry item for the SSOT dashboard.
 */
export function createFaqRegistryItem(data: FaqData) {
  return {
    type: 'faq' as const,
    schema: FaqDataSchema,
    data,
    exportAgentData,
    generateJsonLd: generateFaqJsonLd,
  };
}
