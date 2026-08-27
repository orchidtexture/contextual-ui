import { createId, refersTo } from 'jsonld-graph-builder';
import type { JsonLdContext } from '../../registry/defineSchema';
import { FooterDataSchema, FooterData } from './footer.schema';

/**
 * Generates a Schema.org WPFooter JSON-LD object with full @id references.
 */
export function generateFooterJsonLd(data: FooterData, ctx?: Partial<JsonLdContext>) {
  const create = ctx?.createId ?? createId;
  const refer = ctx?.refersTo ?? refersTo;

  const currentYear = new Date().getFullYear();
  const year = data.copyright?.year ?? currentYear;

  const linksMap = new Map<string, { id: string; label: string; href: string }>();

  if (data.columns) {
    for (const col of data.columns) {
      for (const link of col.links) {
        const scopedId = `${col.id}-${link.id}`;
        linksMap.set(scopedId, { id: scopedId, label: link.label, href: link.href });
      }
    }
  }

  if (data.links) {
    for (const link of data.links) {
      if (!linksMap.has(link.id)) {
        linksMap.set(link.id, { id: link.id, label: link.label, href: link.href });
      }
    }
  }

  if (data.legalLinks) {
    for (const link of data.legalLinks) {
      const scopedId = link.id.startsWith('legal-') ? link.id : `legal-${link.id}`;
      if (!linksMap.has(scopedId)) {
        linksMap.set(scopedId, { id: scopedId, label: link.label, href: link.href });
      }
    }
  }

  const allLinks = Array.from(linksMap.values());
  const copyrightHolderName = data.copyright?.holder || data.brand?.name;

  return {
    '@context': 'https://schema.org',
    '@type': 'WPFooter',
    '@id': create('footer'),
    isPartOf: refer('website'),
    ...(data.brand?.name ? { name: data.brand.name } : {}),
    ...(data.brand?.description ? { description: data.brand.description } : {}),
    url: data.brand?.href || '/',
    ...(copyrightHolderName
      ? {
          copyrightHolder: refer('organization'),
        }
      : {}),
    copyrightYear: typeof year === 'string' ? parseInt(year, 10) || year : year,
    ...(allLinks.length > 0
      ? {
          hasPart: allLinks.map((link) => ({
            '@type': 'SiteNavigationElement',
            '@id': create('footer-nav', link.id),
            name: link.label,
            url: link.href,
          })),
        }
      : {}),
  };
}

/**
 * Exports plain data for internal AI agents or other integrations.
 */
export function exportAgentData(data: FooterData) {
  return {
    brand: data.brand,
    columns: data.columns,
    links: data.links,
    legalLinks: data.legalLinks,
    socials: data.socials,
    copyright: {
      ...data.copyright,
      year: data.copyright?.year ?? new Date().getFullYear(),
    },
  };
}

/**
 * Creates a structural registry item for the schema definition (decoupled from data).
 */
export function footerRegistry() {
  return {
    type: 'footer' as const,
    schema: FooterDataSchema,
    exportAgentData,
    generateJsonLd: generateFooterJsonLd,
  };
}

