import { BreadcrumbDataSchema, BreadcrumbData } from './breadcrumb.schema';

/**
 * Generates a Schema.org BreadcrumbList JSON-LD object.
 */
export function generateBreadcrumbJsonLd(items: BreadcrumbData, baseUrl: string = '') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
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
    generateJsonLd: generateBreadcrumbJsonLd,
  };
}
