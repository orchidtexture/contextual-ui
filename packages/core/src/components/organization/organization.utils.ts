import { createId } from 'jsonld-graph-builder';
import type { JsonLdContext } from '../../registry/defineSchema';
import { OrganizationDataSchema, OrganizationData } from './organization.schema';

/**
 * Generates a Schema.org Organization JSON-LD object with canonical @id references.
 */
export function generateOrganizationJsonLd(data: OrganizationData, ctx?: Partial<JsonLdContext>) {
  const create = ctx?.createId ?? createId;

  let addressObj: any;
  if (data.address) {
    if (typeof data.address === 'object') {
      addressObj = {
        '@type': 'PostalAddress',
        ...(data.address.streetAddress ? { streetAddress: data.address.streetAddress } : {}),
        ...(data.address.addressLocality ? { addressLocality: data.address.addressLocality } : {}),
        ...(data.address.addressRegion ? { addressRegion: data.address.addressRegion } : {}),
        ...(data.address.postalCode ? { postalCode: data.address.postalCode } : {}),
        ...(data.address.addressCountry ? { addressCountry: data.address.addressCountry } : {}),
      };
    } else {
      addressObj = data.address;
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': data.id ? create('organization', data.id) : create('organization'),
    name: data.name,
    ...(data.legalName ? { legalName: data.legalName } : {}),
    ...(data.url ? { url: data.url } : {}),
    ...(data.logo ? { logo: data.logo } : {}),
    ...(data.description ? { description: data.description } : {}),
    ...(data.sameAs && data.sameAs.length > 0 ? { sameAs: data.sameAs } : {}),
    ...(data.email ? { email: data.email } : {}),
    ...(data.telephone ? { telephone: data.telephone } : {}),
    ...(addressObj ? { address: addressObj } : {}),
    ...(data.foundingDate ? { foundingDate: data.foundingDate } : {}),
  };
}

/**
 * Exports plain data for AI agents.
 */
export function exportAgentData(data: OrganizationData) {
  return {
    id: data.id,
    name: data.name,
    legalName: data.legalName,
    url: data.url,
    logo: data.logo,
    description: data.description,
    sameAs: data.sameAs,
    email: data.email,
    telephone: data.telephone,
    address: data.address,
    foundingDate: data.foundingDate,
  };
}

/**
 * Creates a structural registry item for the Organization schema definition.
 */
export function organizationRegistry() {
  return {
    type: 'organization' as const,
    schema: OrganizationDataSchema,
    exportAgentData,
    generateJsonLd: generateOrganizationJsonLd,
  };
}
