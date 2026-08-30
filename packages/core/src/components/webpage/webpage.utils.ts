import { createId, refersTo } from 'jsonld-graph-builder';
import type { JsonLdContext } from '../../registry/defineSchema';
import { WebpageDataSchema, WebpageData, WebpageItem } from './webpage.schema';

function generateSingleWebpageJsonLd(item: WebpageItem, ctx?: Partial<JsonLdContext>, isSolo: boolean = false) {
  const create = ctx?.createId ?? createId;
  const refer = ctx?.refersTo ?? refersTo;

  const pageId = item.id
    ? create('webpage', item.id)
    : (isSolo || !item.url || item.url === '/'
        ? create('webpage')
        : create('webpage', item.url.replace(/^\//, '')));

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': pageId,
    ...(item.name ? { name: item.name } : {}),
    ...(item.url ? { url: item.url } : {}),
    ...(item.description ? { description: item.description } : {}),
    ...(item.inLanguage ? { inLanguage: item.inLanguage } : {}),
    isPartOf: item.isPartOf ? refer(item.isPartOf) : refer('website'),
    hasPart:
      item.hasPart && item.hasPart.length > 0
        ? item.hasPart.map((part) => refer(part))
        : [refer('navbar'), refer('faq'), refer('footer')],
  };
}

/**
 * Generates Schema.org WebPage JSON-LD object(s) connecting sub-components.
 */
export function generateWebpageJsonLd(data: WebpageData, ctx?: Partial<JsonLdContext>) {
  if (Array.isArray(data)) {
    return data.map((item) => generateSingleWebpageJsonLd(item, ctx, false));
  }
  return generateSingleWebpageJsonLd(data || {}, ctx, true);
}

/**
 * Exports plain data for AI agents.
 */
export function exportAgentData(data: WebpageData) {
  if (Array.isArray(data)) {
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      url: item.url,
      description: item.description,
      inLanguage: item.inLanguage,
    }));
  }
  return {
    id: data?.id,
    name: data?.name,
    url: data?.url,
    description: data?.description,
    inLanguage: data?.inLanguage,
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

export const webpagesRegistry = webpageRegistry;

