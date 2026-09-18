import { describe, it, expect } from 'vitest';
import {
  generateServiceJsonLd,
  exportAgentData as exportServiceAgentData,
  serviceRegistry,
} from './service.utils';
import {
  generateOrganizationJsonLd,
  exportAgentData as exportOrgAgentData,
  organizationRegistry,
} from '../organization/organization.utils';
import { generateCollectionJsonLd, collectionRegistry } from '../../content/content.utils';
import { validateGraphReferences } from '../../content/content.validator';
import { defineSchema } from '../../registry/defineSchema';
import { buildGraph } from 'jsonld-graph-builder';
import type { ServiceItem } from './service.schema';

describe('Phase 3: Semantic Entity Adapters (Service & Organization Enrichment)', () => {
  const sampleServices: ServiceItem[] = [
    {
      id: 'business-process-review',
      name: 'Business Process Review & Automation',
      description: 'Review existing operational burden and propose realistic AI-assisted workflows.',
      serviceType: 'Consulting & Process Automation',
      areaServed: 'Japan',
      audience: 'Enterprise Operations Teams',
      url: 'https://example.com/services/process-review',
    },
    {
      id: 'ai-system-development',
      name: 'AI Tool Adoption & System Development',
      description: 'Design and develop semantic search and Agentic AI integrations.',
      serviceType: 'Software Development',
      areaServed: 'Japan',
    },
    {
      id: 'post-launch-support',
      name: 'Tool Integration & Continuous Improvement',
      description: 'Ongoing maintenance, monitoring, and workflow refinement after launch.',
      serviceType: 'Support & Maintenance',
    },
  ];

  const enrichedOrgData = {
    id: 'tasuku-studio',
    name: 'Tasuku Studio',
    legalName: 'Tasuku Studio Co., Ltd.',
    url: 'https://tasuku.io',
    logo: 'https://tasuku.io/logo.svg',
    description: 'Creator and maintainer of Contextual UI.',
    foundingDate: '2024-01-15',
    address: {
      streetAddress: '1-2-3 Shibuya',
      addressLocality: 'Shibuya-ku',
      addressRegion: 'Tokyo',
      postalCode: '150-0002',
      addressCountry: 'JP',
    },
    email: 'contact@tasuku.io',
    telephone: '+81-3-1234-5678',
  };

  describe('Service Entity Adapter', () => {
    it('generates standard Schema.org Service with canonical provider reference', () => {
      const result = generateServiceJsonLd(sampleServices[0]);
      expect(result).toHaveLength(1);

      const serviceNode = result[0];
      expect(serviceNode['@type']).toBe('Service');
      expect(serviceNode['@id']).toBe('#service:business-process-review');
      expect(serviceNode.name).toBe('Business Process Review & Automation');
      expect(serviceNode.description).toContain('Review existing operational burden');
      expect(serviceNode.serviceType).toBe('Consulting & Process Automation');
      expect(serviceNode.areaServed).toBe('Japan');
      expect(serviceNode.audience).toEqual({
        '@type': 'Audience',
        audienceType: 'Enterprise Operations Teams',
      });
      expect(serviceNode.provider).toEqual({ '@id': '#organization' });

      // Guardrail: Commercial terms, pricing, and offers are absent unless supplied
      expect(serviceNode.offers).toBeUndefined();
      expect(serviceNode.price).toBeUndefined();
    });

    it('multiple Service entities share one canonical Organization provider without duplication', () => {
      const serviceNodes = generateServiceJsonLd(sampleServices);
      const orgNode = generateOrganizationJsonLd(enrichedOrgData);

      // Explicitly point services to the specific organization id
      const servicesWithOrg = serviceNodes.map((s) => ({
        ...s,
        provider: { '@id': orgNode['@id'] },
      }));

      const graph = buildGraph([...servicesWithOrg, orgNode], {
        baseUrl: 'https://example.com',
      });

      const nodes = graph['@graph'];
      const orgNodesInGraph = nodes.filter((n: any) => n['@type'] === 'Organization');
      expect(orgNodesInGraph).toHaveLength(1);
      expect(orgNodesInGraph[0]['@id']).toBe('https://example.com/#organization:tasuku-studio');

      const serviceNodesInGraph = nodes.filter((n: any) => n['@type'] === 'Service');
      expect(serviceNodesInGraph).toHaveLength(3);
      for (const s of serviceNodesInGraph) {
        expect(s.provider).toEqual({ '@id': 'https://example.com/#organization:tasuku-studio' });
      }

      // References resolve with zero missing IDs!
      const refCheck = validateGraphReferences(graph, { baseUrl: 'https://example.com' });
      expect(refCheck.valid).toBe(true);
      expect(refCheck.missingLocalIds).toHaveLength(0);
    });

    it('ItemList references canonical Service nodes via item pointers', () => {
      const services = generateServiceJsonLd(
        sampleServices.map((s) => ({ ...s, provider: '#organization:tasuku-studio' }))
      );

      const collectionData = {
        id: 'our-services',
        title: 'Our Consulting Services',
        items: sampleServices.map((s, idx) => ({
          id: s.id,
          title: s.name,
          description: s.description,
          order: idx + 1,
          item: `#service:${s.id}`, // Reference to canonical Service node!
        })),
      };

      const collectionNodes = generateCollectionJsonLd(collectionData);
      const orgNode = generateOrganizationJsonLd(enrichedOrgData);

      const graph = buildGraph([...services, ...collectionNodes, orgNode], {
        baseUrl: 'https://example.com',
      });

      const listNode = graph['@graph'].find((n: any) => n['@type'] === 'ItemList');
      expect(listNode).toBeDefined();
      expect(listNode.itemListElement).toHaveLength(3);

      // In flattened graph, ListItem entities are top-level nodes in @graph pointing to Service
      const firstListItem = graph['@graph'].find(
        (n: any) => n['@type'] === 'ListItem' && n.position === 1
      );
      expect(firstListItem).toBeDefined();
      expect(firstListItem.item).toEqual({
        '@id': 'https://example.com/#service:business-process-review',
      });

      const refCheck = validateGraphReferences(graph, { baseUrl: 'https://example.com' });
      expect(refCheck.valid).toBe(true);
      expect(refCheck.missingLocalIds).toHaveLength(0);
    });

    it('exports clean serializable agent data for services', () => {
      const agentData = exportServiceAgentData(sampleServices);
      expect(agentData).toHaveLength(3);
      expect(agentData[0]).toEqual({
        id: 'business-process-review',
        name: 'Business Process Review & Automation',
        description: 'Review existing operational burden and propose realistic AI-assisted workflows.',
        serviceType: 'Consulting & Process Automation',
        areaServed: 'Japan',
        audience: 'Enterprise Operations Teams',
        url: 'https://example.com/services/process-review',
        image: undefined,
        provider: undefined,
        pageId: undefined,
      });
    });
  });

  describe('Organization Enrichment', () => {
    it('exports structured PostalAddress and foundingDate faithfully', () => {
      const orgNode = generateOrganizationJsonLd(enrichedOrgData);

      expect(orgNode['@type']).toBe('Organization');
      expect(orgNode['@id']).toBe('#organization:tasuku-studio');
      expect(orgNode.legalName).toBe('Tasuku Studio Co., Ltd.');
      expect(orgNode.foundingDate).toBe('2024-01-15');
      expect(orgNode.address).toEqual({
        '@type': 'PostalAddress',
        streetAddress: '1-2-3 Shibuya',
        addressLocality: 'Shibuya-ku',
        addressRegion: 'Tokyo',
        postalCode: '150-0002',
        addressCountry: 'JP',
      });

      // Guardrails: no person/founder role is inferred from representative
      expect(orgNode.founder).toBeUndefined();
      expect(orgNode.employee).toBeUndefined();
    });

    it('supports plain string address fallback', () => {
      const simpleOrg = {
        name: 'Simple Co',
        address: 'Tokyo, Japan',
      };
      const orgNode = generateOrganizationJsonLd(simpleOrg);
      expect(orgNode.address).toBe('Tokyo, Japan');
    });

    it('exports enriched organization data for AI agents', () => {
      const agentData = exportOrgAgentData(enrichedOrgData);
      expect(agentData.foundingDate).toBe('2024-01-15');
      expect(agentData.address).toEqual(enrichedOrgData.address);
    });
  });

  describe('Registry Integration in defineSchema', () => {
    it('hydrates and exports Service and enriched Organization via defineSchema', () => {
      const schema = defineSchema({
        organization: organizationRegistry(),
        services: serviceRegistry(),
        collections: collectionRegistry(),
      });

      const hydrated = schema.hydrate({
        organization: enrichedOrgData,
        services: sampleServices,
      });

      const jsonLd = hydrated.generateJsonLd();
      expect(jsonLd.organization['@type']).toBe('Organization');
      expect(jsonLd.services).toHaveLength(3);
      expect(jsonLd.services[0]['@type']).toBe('Service');

      const graphResult = hydrated.generateGraph({ baseUrl: 'https://example.com' });
      expect(graphResult['@graph'].filter((n: any) => n['@type'] === 'Service')).toHaveLength(3);
      expect(graphResult['@graph'].filter((n: any) => n['@type'] === 'Organization')).toHaveLength(1);
    });
  });
});
