import { createId } from 'jsonld-graph-builder';
import type { JsonLdContext } from '../../registry/defineSchema';
import { OrganizationDataSchema, OrganizationData } from './organization.schema';

/**
 * Generates a Schema.org Organization JSON-LD object with canonical @id references.
 */
export function generateOrganizationJsonLd(data: OrganizationData, ctx?: Partial<JsonLdContext>) {
  const create = ctx?.createId ?? createId;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': create('organization'),
    name: data.name,
    ...(data.legalName ? { legalName: data.legalName } : {}),
    ...(data.url ? { url: data.url } : {}),
    ...(data.logo ? { logo: data.logo } : {}),
    ...(data.description ? { description: data.description } : {}),
    ...(data.sameAs && data.sameAs.length > 0 ? { sameAs: data.sameAs } : {}),
    ...(data.email ? { email: data.email } : {}),
    ...(data.telephone ? { telephone: data.telephone } : {}),
  };
}

/**
 * Exports plain data for AI agents.
 */
export function exportAgentData(data: OrganizationData) {
  return {
    name: data.name,
    legalName: data.legalName,
    url: data.url,
    logo: data.logo,
    description: data.description,
    sameAs: data.sameAs,
    email: data.email,
    telephone: data.telephone,
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
