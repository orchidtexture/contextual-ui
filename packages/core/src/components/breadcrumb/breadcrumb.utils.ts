import { createId, refersTo } from 'jsonld-graph-builder';
import type { JsonLdContext } from '../../registry/defineSchema';
import { BreadcrumbDataSchema, BreadcrumbData } from './breadcrumb.schema';

/**
 * Generates a Schema.org BreadcrumbList JSON-LD object with full @id references.
 */
export function generateBreadcrumbJsonLd(
  items: BreadcrumbData,
  baseUrl: string = '',
  ctx?: Partial<JsonLdContext>
) {
  const create = ctx?.createId ?? createId;
  const refer = ctx?.refersTo ?? refersTo;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': create('breadcrumb'),
    isPartOf: refer('website'),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      '@id': create('breadcrumb-item', item.id || String(index + 1)),
      position: index + 1,
      name: item.label,
      ...(item.url
        ? {
            item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
          }
        : {}),
    })),
  };
}

/**
 * Exports plain data for internal AI agents or other integrations.
 */
export function exportAgentData(items: BreadcrumbData) {
  return items.map(({ id, label, url }) => ({
    id,
    label,
    url,
  }));
}

/**
 * Creates a structural registry item for the schema definition.
 */
export function breadcrumbRegistry() {
  return {
    type: 'breadcrumb' as const,
    schema: BreadcrumbDataSchema,
    exportAgentData,
    generateJsonLd: (data: BreadcrumbData, ctx?: Partial<JsonLdContext>) =>
      generateBreadcrumbJsonLd(data, '', ctx),
    isGlobal: false,
  };
}
