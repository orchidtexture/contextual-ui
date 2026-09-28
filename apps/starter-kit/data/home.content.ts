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

export const ssotSection: SectionRecord = {
  id: 'ssot',
  pageId: 'home',
  title: 'Single Source of Truth (SSOT)',
  description: 'Define your site schema once in Zod. Automatically generate TypeScript types, runtime validation, and Schema.org JSON-LD with zero drift.',
  anchor: 'ssot',
  mainEntity: '#itemlist:home:ssot-features',
  type: 'WebPageElement',
  content: [
    {
      type: 'code',
      filename: 'data/site.schema.ts',
      language: 'typescript',
      code: `export const siteSchema = defineSchema({\n  organization: organizationRegistry(),\n  website: websiteRegistry(),\n  faq: faqRegistry(),\n});\n\n// TypeScript type derived automatically\nexport type SiteData = InferData<typeof siteSchema>;`,
    },
  ],
};

export const kgSection: SectionRecord = {
  id: 'knowledge-graph',
  pageId: 'home',
  title: 'Global Knowledge Graph',
  description: 'Entities, route documents, and component metadata compile into a single referentially-linked Schema.org @graph. Exposed sitewide for AI agents, LLM pipelines, and search bots.',
  anchor: 'knowledge-graph',
  mainEntity: '#itemlist:home:knowledge-graph-features',
  type: 'WebPageElement',
  content: [
    {
      type: 'code',
      filename: 'GET /api/graph.json',
      language: 'json',
      code: `{\n  "@context": "https://schema.org",\n  "@graph": [\n    {\n      "@type": "WebSite",\n      "@id": "https://contextual.site/#website",\n      "publisher": { "@id": "https://contextual.site/#org" }\n    },\n    {\n      "@type": "Organization",\n      "@id": "https://contextual.site/#org"\n    }\n  ]\n}`,
    },
  ],
};

export const scopingSection: SectionRecord = {
  id: 'metadata-scoping',
  pageId: 'home',
  title: 'Global vs Route Metadata',
  description: 'Distinguish between domain-level entities (WebSite, Organization), route documents (WebPage), and UI components without prop drilling.',
  anchor: 'metadata-scoping',
  mainEntity: '#itemlist:home:metadata-scoping-features',
  type: 'WebPageElement',
  content: [
    {
      type: 'paragraph',
      role: 'qualifier',
      text: 'Why it matters: Isolating domain, route, and component contexts prevents metadata leakage across pages while maintaining global entity links throughout the Knowledge Graph.',
    },
  ],
};

export const headlessSection: SectionRecord = {
  id: 'headless-radix',
  pageId: 'home',
  title: 'Headless & Radix Powered',
  description: 'Unstyled, accessible UI primitives built with Radix UI and the asChild pattern. Full styling freedom with Tailwind CSS or any design system, with automated Schema.org markup.',
  anchor: 'headless-radix',
  mainEntity: '#itemlist:home:headless-features',
  type: 'WebPageElement',
  content: [
    {
      type: 'paragraph',
      role: 'qualifier',
      text: 'Why it matters: You get top-tier SEO and agentic structured data without compromising your team\'s UI design system, component libraries, or frontend styling architecture.',
    },
  ],
};

export const faqSection: SectionRecord = {
  id: 'faq-section',
  pageId: 'home',
  title: 'Frequently Asked Questions',
  subtitle: 'FAQ',
  description: 'Frequently asked questions powered by Contextual UI and Schema.org semantic structured data.',
  anchor: 'faq',
  mainEntity: '#faq',
  type: 'WebPageElement',
};

export const ssotFeatures: CollectionRecord = {
  id: 'ssot-features',
  pageId: 'home',
  title: 'SSOT Pillars',
  ordered: true,
  type: 'ItemList',
  items: [
    {
      id: 'define-once',
      title: '1. Define Once',
      description: 'Compose Schema.org registries (websiteRegistry, faqRegistry) and custom Zod schemas.',
      order: 1,
      type: 'ListItem',
    },
    {
      id: 'auto-type-inference',
      title: '2. Auto Type Inference',
      description: 'Derive 100% type-safe models via InferData<typeof siteSchema> with zero manual duplication.',
      order: 2,
      type: 'ListItem',
    },
    {
      id: 'zero-drift-sync',
      title: '3. Zero Drift Sync',
      description: 'Connector data automatically keeps headless React UI components and SEO JSON-LD graphs in sync.',
      order: 3,
      type: 'ListItem',
    },
  ],
};

export const kgFeatures: CollectionRecord = {
  id: 'knowledge-graph-features',
  pageId: 'home',
  title: 'Knowledge Graph Capabilities',
  ordered: false,
  type: 'ItemList',
  items: [
    {
      id: 'referential-linking',
      title: 'Referential @id Linking',
      description: 'Entities reference each other with canonical URIs (#website, #organization) forming a true Semantic Web graph.',
      type: 'ListItem',
    },
    {
      id: 'agent-ready-endpoint',
      title: 'Agent-Ready API Endpoint',
      description: 'Exposes /api/graph.json so AI agents (Perplexity, ChatGPT Search, Claude) consume clean structured data without parsing messy DOM.',
      type: 'ListItem',
    },
    {
      id: 'zero-scraping-fragility',
      title: 'Zero Scraping Fragility',
      description: 'Eliminates scraper breaks from markup refactors, client hydration delays, and costly LLM token waste.',
      type: 'ListItem',
    },
  ],
};

export const scopingFeatures: CollectionRecord = {
  id: 'metadata-scoping-features',
  pageId: 'home',
  title: 'Metadata Scoping Levels',
  ordered: true,
  type: 'ItemList',
  items: [
    {
      id: 'domain-scope',
      title: 'Domain Scope',
      description: 'Mounted at root app/layout.tsx. Injects global entities like Organization, WebSite, and sitewide navigations.',
      order: 1,
      type: 'ListItem',
    },
    {
      id: 'route-scope',
      title: 'Route Scope',
      description: 'Wraps individual route pages (<WebPage id="docs">). Scopes canonical URLs, route titles, descriptions, and breadcrumb trails to the active document.',
      order: 2,
      type: 'ListItem',
    },
    {
      id: 'component-scope',
      title: 'Component Scope',
      description: 'Headless primitives that consume typed data directly from context, render accessible UI, and attach microdata fragments to the parent page node.',
      order: 3,
      type: 'ListItem',
    },
  ],
};

export const headlessFeatures: CollectionRecord = {
  id: 'headless-features',
  pageId: 'home',
  title: 'Headless Primitives',
  ordered: false,
  type: 'ItemList',
  items: [
    {
      id: 'radix-aschild',
      title: 'Radix asChild Pattern',
      description: 'Slot into your custom button, link, Next.js <Link>, or motion component without extra wrapper divs.',
      type: 'ListItem',
    },
    {
      id: 'design-system-agnostic',
      title: 'Design System Agnostic',
      description: '100% compatible with Tailwind CSS, Tailwind v4, CSS Modules, Shadcn UI, or custom enterprise design tokens.',
      type: 'ListItem',
    },
    {
      id: 'wai-aria-accessibility',
      title: 'WAI-ARIA Accessibility',
      description: 'Full keyboard navigation (Tab, Enter, Space, Arrows), screen reader announcements, and robust ARIA states out of the box.',
      type: 'ListItem',
    },
    {
      id: 'automated-microdata',
      title: 'Automated Microdata',
      description: 'Components quietly emit valid Schema.org microdata and JSON-LD behind the scenes without polluting your JSX styling.',
      type: 'ListItem',
    },
  ],
};

export const homeSections: SectionRecord[] = [
  heroSection,
  pipelineSection,
  foundationsSection,
  ssotSection,
  kgSection,
  scopingSection,
  headlessSection,
  faqSection,
];

export const homeCollections: CollectionRecord[] = [
  pipelineStagesCollection,
  ssotFeatures,
  kgFeatures,
  scopingFeatures,
  headlessFeatures,
];
