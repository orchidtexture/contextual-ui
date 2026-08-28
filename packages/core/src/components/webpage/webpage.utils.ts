import { createId, refersTo } from 'jsonld-graph-builder';
import type { JsonLdContext } from '../../registry/defineSchema';
import { WebpageDataSchema, WebpageData } from './webpage.schema';

/**
 * Generates a Schema.org WebPage JSON-LD object connecting sub-components.
 */
export function generateWebpageJsonLd(data: WebpageData, ctx?: Partial<JsonLdContext>) {
  const create = ctx?.createId ?? createId;
  const refer = ctx?.refersTo ?? refersTo;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': create('webpage'),
    ...(data.name ? { name: data.name } : {}),
    ...(data.url ? { url: data.url } : {}),
    ...(data.description ? { description: data.description } : {}),
    isPartOf: data.isPartOf ? refer(data.isPartOf) : refer('website'),
    hasPart:
      data.hasPart && data.hasPart.length > 0
        ? data.hasPart.map((part) => refer(part))
        : [refer('navbar'), refer('faq'), refer('footer')],
  };
}

/**
 * Exports plain data for AI agents.
 */
export function exportAgentData(data: WebpageData) {
  return {
    name: data.name,
    url: data.url,
    description: data.description,
  };
}

/**
 * Creates a structural registry item for the WebPage schema definition.
 */
export function webpageRegistry() {
  return {
    type: 'webpage' as const,
    schema: WebpageDataSchema,
    exportAgentData,
    generateJsonLd: generateWebpageJsonLd,
  };
}
