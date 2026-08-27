import { createId, refersTo } from 'jsonld-graph-builder';
import type { JsonLdContext } from '../../registry/defineSchema';
import { NavbarDataSchema, NavbarData } from './navbar.schema';

/**
 * Generates a Schema.org SiteNavigationElement / WPHeader JSON-LD object with full @id references.
 */
export function generateNavbarJsonLd(data: NavbarData, ctx?: Partial<JsonLdContext>) {
  const create = ctx?.createId ?? createId;
  const refer = ctx?.refersTo ?? refersTo;

  return {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    '@id': create('navbar'),
    isPartOf: refer('website'),
    name: data.brand?.name || 'Navigation',
    url: data.brand?.href || '/',
    hasPart: data.links.map((link) => ({
      '@type': 'WebPage',
      '@id': create('nav', link.id),
      name: link.label,
      url: link.href,
    })),
  };
}

/**
 * Exports plain data for internal AI agents or other integrations.
 */
export function exportAgentData(data: NavbarData) {
  return {
    brand: data.brand,
    links: data.links,
  };
}

/**
 * Creates a structural registry item for the schema definition (decoupled from data).
 */
export function navbarRegistry() {
  return {
    type: 'navbar' as const,
    schema: NavbarDataSchema,
    exportAgentData,
    generateJsonLd: generateNavbarJsonLd,
  };
}
