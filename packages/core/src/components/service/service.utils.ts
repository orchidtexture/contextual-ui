import { createId, refersTo } from 'jsonld-graph-builder';
import type { JsonLdContext } from '../../registry/defineSchema';
import { ServiceData, ServiceDataSchema, ServiceItem } from './service.schema';

/**
 * Normalizes single or array service data into ServiceItem[].
 */
export function normalizeServices(data: ServiceData): ServiceItem[] {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

/**
 * Generates Schema.org Service JSON-LD objects with canonical @id and provider references.
 */
export function generateServiceJsonLd(data: ServiceData, ctx?: Partial<JsonLdContext>) {
  const create = ctx?.createId ?? createId;
  const refer = ctx?.refersTo ?? refersTo;
  const services = normalizeServices(data);

  return services.map((service) => {
    const serviceId = create('service', service.id);

    let providerRef: any;
    if (service.provider) {
      if (typeof service.provider === 'string') {
        providerRef = service.provider.startsWith('#') || service.provider.startsWith('http')
          ? { '@id': service.provider }
          : refer(service.provider);
      } else if (typeof service.provider === 'object' && service.provider['@id']) {
        providerRef = service.provider;
      }
    } else {
      providerRef = refer('organization');
    }

    const node: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': serviceId,
      name: service.name,
      provider: providerRef,
    };

    if (service.description) node.description = service.description;
    if (service.serviceType) node.serviceType = service.serviceType;
    if (service.areaServed) node.areaServed = service.areaServed;
    if (service.audience) {
      node.audience = {
        '@type': 'Audience',
        audienceType: service.audience,
      };
    }
    if (service.url) node.url = service.url;
    if (service.image) node.image = service.image;

    if (service.pageId) {
      node.isPartOf = (service.pageId === 'home' && ctx?.isSinglePage)
        ? refer('webpage')
        : refer('webpage', service.pageId);
    }

    return node;
  });
}

/**
 * Exports plain data for AI agents.
 */
export function exportAgentData(data: ServiceData) {
  const services = normalizeServices(data);
  return services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    serviceType: service.serviceType,
    areaServed: service.areaServed,
    audience: service.audience,
    url: service.url,
    image: service.image,
    provider: service.provider,
    pageId: service.pageId,
  }));
}

/**
 * Registry factory for services in defineSchema.
 */
export function serviceRegistry() {
  return {
    type: 'services' as const,
    schema: ServiceDataSchema,
    exportAgentData,
    generateJsonLd: generateServiceJsonLd,
    isGlobal: true,
  };
}

export const servicesRegistry = serviceRegistry;
