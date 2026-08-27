import { createId, refersTo } from 'jsonld-graph-builder';
import type { JsonLdContext } from '../../registry/defineSchema';
import { WebsiteDataSchema, WebsiteData } from './website.schema';

/**
 * Generates a Schema.org WebSite JSON-LD object connecting sub-components.
 */
export function generateWebsiteJsonLd(data: WebsiteData, ctx?: Partial<JsonLdContext>) {
  const create = ctx?.createId ?? createId;
  const refer = ctx?.refersTo ?? refersTo;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': create('website'),
    name: data.name,
    ...(data.url ? { url: data.url } : {}),
    ...(data.description ? { description: data.description } : {}),
    hasPart:
      data.hasPart && data.hasPart.length > 0
        ? data.hasPart.map((part) => refer(part))
        : [refer('navbar'), refer('faq')],
  };
}

/**
 * Exports plain data for AI agents.
 */
export function exportAgentData(data: WebsiteData) {
  return {
    name: data.name,
    url: data.url,
    description: data.description,
  };
}

/**
 * Creates a structural registry item for the WebSite schema definition.
 */
export function websiteRegistry() {
  return {
    type: 'website' as const,
    schema: WebsiteDataSchema,
    exportAgentData,
    generateJsonLd: generateWebsiteJsonLd,
  };
}
