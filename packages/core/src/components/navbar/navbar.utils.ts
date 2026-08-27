import { createId, refersTo } from 'jsonld-graph-builder';
import type { JsonLdContext } from '../../registry/defineSchema';
import { NavbarDataSchema, NavbarData, NavItem } from './navbar.schema';

function mapNavLink(link: NavItem, create: typeof createId): any {
  return {
    '@type': 'SiteNavigationElement',
    '@id': create('nav', link.id),
    name: link.label,
    ...(link.href ? { url: link.href } : {}),
    ...(link.children && link.children.length > 0
      ? {
          hasPart: link.children.map((child) => mapNavLink(child, create)),
        }
      : {}),
  };
}

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
    hasPart: data.links.map((link) => mapNavLink(link, create)),
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

