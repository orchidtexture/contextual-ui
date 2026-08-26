import { createId, refersTo } from '@contextual-ui/jsonld-graph-builder';
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

  const columnLinks = data.columns?.flatMap((col) => col.links) ?? [];
  const flatLinks = data.links ?? [];
  const legalLinks = data.legalLinks ?? [];
  const allLinks = [...columnLinks, ...flatLinks, ...legalLinks];

  const copyrightHolderName = data.copyright?.holder || data.brand?.name;

  return {
    '@context': 'https://schema.org',
    '@type': 'WPFooter',
    '@id': create('footer'),
    isPartOf: refer('website'),
    ...(data.brand?.name ? { name: data.brand.name } : {}),
    ...(data.brand?.description ? { description: data.brand.description } : {}),
    ...(data.brand?.href ? { url: data.brand.href } : {}),
    ...(copyrightHolderName
      ? {
          copyrightHolder: {
            '@type': 'Organization',
            name: copyrightHolderName,
          },
        }
      : {}),
    copyrightYear: typeof year === 'string' ? parseInt(year, 10) || year : year,
    ...(data.socials && data.socials.length > 0
      ? { sameAs: data.socials.map((s) => s.href) }
      : {}),
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
