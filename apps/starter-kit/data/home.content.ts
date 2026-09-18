import type { SectionRecord, CollectionRecord } from 'contextual-ui';

export const heroSection: SectionRecord = {
  id: 'hero',
  pageId: 'home',
  title: 'Build Websites Optimized for Search & AI Agents.',
  description: 'Stop writing boilerplate schema markup. Use our open-source headless components to build accessible UIs that automatically compile into an unified JSON-LD Knowledge Graph for Next-Gen SEO and LLM ingestion.',
  type: 'WebPageElement',
  content: [
    {
      type: 'paragraph',
      role: 'normal',
      text: 'Stop writing boilerplate schema markup. Use our open-source headless components to build accessible UIs that automatically compile into an unified JSON-LD Knowledge Graph for Next-Gen SEO and LLM ingestion.',
    },
    {
      type: 'link',
      label: 'Explore Pipeline Diagram',
      href: '#data-pipeline',
    },
    {
      type: 'link',
      label: 'Browse Docs',
      href: '/docs',
    },
    {
      type: 'link',
      label: '/api/graph.json ↗',
      href: '/api/graph.json',
      external: true,
    },
  ],
};

export const pipelineStagesCollection: CollectionRecord = {
  id: 'pipeline-stages',
  pageId: 'home',
  title: 'Contextual Data Pipeline Stages',
  ordered: true,
  type: 'ItemList',
  items: [
    {
      id: 'source-node',
      order: 1,
      title: 'Data Connector',
      name: 'Data Connector (Headless CMS & Static Data)',
      description: 'Ingests raw data from any source—static files, headless CMS, Postgres, or GraphQL endpoints.',
      type: 'ListItem',
    },
    {
      id: 'schema-node',
      order: 2,
      title: 'Single Source of Truth',
      name: 'Single Source of Truth (Zod + Schema Registries)',
      description: 'Defines runtime validation, TypeScript types, and Schema.org semantic mappings in one single place.',
      type: 'ListItem',
    },
    {
      id: 'engine-node',
      order: 3,
      title: 'Contextual Engine',
      name: 'Contextual Engine (contextual-ui)',
      description: 'Validates connector payloads, binds metadata, and synthesizes data into UI contexts and connected JSON-LD graphs.',
      type: 'ListItem',
    },
    {
      id: 'output-ui',
      order: 4,
      title: 'Headless React UI',
      name: 'Headless React UI (For Human Users)',
      description: 'Accessible, unstyled React components consuming validated SSOT data with zero design lock-in.',
      type: 'ListItem',
    },
    {
      id: 'output-graph',
      order: 5,
      title: 'Schema.org @graph',
      name: 'Schema.org @graph (For Search Crawlers)',
      description: 'Referentially-linked entity graph with @id URI references, enabling rich snippets and entity rank.',
      type: 'ListItem',
    },
    {
      id: 'output-ai',
      order: 6,
      title: 'AI Agent Context',
      name: 'AI Agent Context (For LLMs & Autonomous Agents)',
      description: 'Direct, deterministic semantic graph feeds without noisy DOM parsing, hallucinations, or bot scraping.',
      type: 'ListItem',
    },
  ],
};

export const pipelineSection: SectionRecord = {
  id: 'data-pipeline',
  pageId: 'home',
  title: 'Source to Graph & UI',
  subtitle: 'Architecture Flow',
  description: 'Explore how Contextual UI unifies data ingestion, SSOT schema validation, and multi-channel delivery across React components, Schema.org @graph JSON-LD, and structured AI agent feeds.',
  anchor: 'data-pipeline',
  mainEntity: '#itemlist:home:pipeline-stages',
  type: 'WebPageElement',
};

export const foundationsSection: SectionRecord = {
  id: 'foundations',
  pageId: 'home',
  title: 'Architecture & Core Concepts',
  subtitle: 'Core Foundations',
  description: 'Explore how Contextual UI combines unified schema definitions, sitewide Knowledge Graphs, hierarchical scoping, and headless Radix primitives.',
  anchor: 'foundations',
  type: 'WebPageElement',
};
