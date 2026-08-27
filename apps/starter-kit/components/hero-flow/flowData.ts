import { Node, Edge } from 'reactflow';
import { FlowNodeData, FlowEdgeData } from './types';

export const initialNodes: Node<FlowNodeData>[] = [
  {
    id: 'source-node',
    type: 'heroNode',
    position: { x: 20, y: 155 },
    data: {
      id: 'source-node',
      stage: 'source',
      title: 'Data Connector',
      subtitle: 'Headless CMS & Static Data',
      badge: '01. SOURCE',
      color: '#10b981', // emerald-500
      accentClass: 'text-emerald-400',
      borderClass: 'border-emerald-500/40 hover:border-emerald-400',
      bgGlowClass: 'from-emerald-500/10 to-transparent',
      description: 'Ingests raw data from any source—static files, headless CMS, Postgres, or GraphQL endpoints.',
      codeSnippet: {
        language: 'typescript',
        filename: 'data/site.server.ts',
        code: `import { staticConnector } from 'contextual-ui-connector-static';

export const connector = staticConnector({
  organization: {
    name: 'Tasuku Studio',
    url: 'https://tasuku.io',
    logo: '/images/onigiri_logo.svg',
    sameAs: ['https://github.com/orchidtexture']
  },
  website: {
    name: 'Contextual UI Starter Kit',
    url: 'https://example.com',
    description: 'A headless UI and semantic SEO Knowledge Graph.'
  },
  faq: [
    { id: '1', question: 'What is Contextual UI?', answer: 'SSOT framework.' },
    { id: '2', question: 'How does SEO work?', answer: 'Injected JSON-LD graph.' }
  ],
  navbar: {
    brand: { name: 'Contextual UI', href: '/' },
    links: [
      { id: '1', label: 'Docs', href: '/docs' },
      { id: '2', label: 'Schema Graph', href: '/schema' }
    ]
  }
});`,
      },
      details: [
        { label: 'Connector', value: 'contextual-ui-connector-static' },
        { label: 'Source Format', value: 'JavaScript Objects / CMS APIs' },
        { label: 'Hydration', value: 'Zero-latency server-side compile' },
      ],
    },
  },
  {
    id: 'schema-node',
    type: 'heroNode',
    position: { x: 290, y: 155 },
    data: {
      id: 'schema-node',
      stage: 'schema',
      title: 'Single Source of Truth',
      subtitle: 'Zod + Schema Registries',
      badge: '02. SSOT SCHEMA',
      color: '#f59e0b', // amber-500
      accentClass: 'text-amber-400',
      borderClass: 'border-amber-500/40 hover:border-amber-400',
      bgGlowClass: 'from-amber-500/10 to-transparent',
      description: 'Defines runtime validation, TypeScript types, and Schema.org semantic mappings in one single place.',
      codeSnippet: {
        language: 'typescript',
        filename: 'data/site.schema.ts',
        code: `import { defineSchema, organizationRegistry, websiteRegistry, navbarRegistry, faqRegistry } from 'contextual-ui/server';
import { z } from 'zod';

export const siteSchema = defineSchema({
  organization: organizationRegistry(),
  website: websiteRegistry(),
  navbar: navbarRegistry(),
  faq: faqRegistry(),
  announcement: {
    schema: z.object({
      enabled: z.boolean(),
      message: z.string().describe('Banner text'),
    }),
  },
});

export type SiteData = InferData<typeof siteSchema>;`,
      },
      details: [
        { label: 'Validation Engine', value: 'Zod v3+ / v4' },
        { label: 'Registries', value: 'Pre-mapped Schema.org types' },
        { label: 'Type Safety', value: '100% Inferred TypeScript types' },
      ],
    },
  },
  {
    id: 'engine-node',
    type: 'heroNode',
    position: { x: 560, y: 155 },
    data: {
      id: 'engine-node',
      stage: 'engine',
      title: 'Contextual Engine',
      subtitle: 'contextual-ui',
      badge: '03. ORCHESTRATOR',
      color: '#4fabf0', // accent
      accentClass: 'text-accent',
      borderClass: 'border-sky-500/50 hover:border-sky-400',
      bgGlowClass: 'from-sky-500/15 to-transparent',
      description: 'Validates connector payloads, binds metadata, and synthesizes data into UI contexts and connected JSON-LD graphs.',
      codeSnippet: {
        language: 'typescript',
        filename: 'server/engine.ts',
        code: `import { createContextualApp } from 'contextual-ui/server';
import { siteSchema } from './site.schema';
import { connector } from './site.server';

export const siteApp = createContextualApp({
  schema: siteSchema,
  connector: connector,
});

// 1. Fetch & Validate Data
const data = await siteApp.fetchData();

// 2. Synthesize Linked Schema.org @graph
const graph = await siteApp.generateGraph();`,
      },
      details: [
        { label: 'Package', value: 'contextual-ui/server' },
        { label: 'Graph Builder', value: 'jsonld-graph-builder' },
        { label: 'Execution', value: 'Build-time SSG & Dynamic SSR' },
      ],
    },
  },
  {
    id: 'output-ui',
    type: 'heroNode',
    position: { x: 840, y: 20 },
    data: {
      id: 'output-ui',
      stage: 'output',
      channel: 'ui',
      title: 'Headless React UI',
      subtitle: 'For Human Users',
      badge: '04A. HUMANS',
      color: '#38bdf8', // sky-400
      accentClass: 'text-sky-400',
      borderClass: 'border-sky-400/40 hover:border-sky-300',
      bgGlowClass: 'from-sky-400/10 to-transparent',
      description: 'Accessible, unstyled React components consuming validated SSOT data with zero design lock-in.',
      codeSnippet: {
        language: 'typescript',
        filename: 'app/HomeClient.tsx',
        code: `<Faq.Root>
  {faqItems.map((item) => (
    <Faq.Item key={item.id} id={item.id} className="border-b border-zinc-800">
      <Faq.Trigger className="font-semibold text-zinc-100 hover:text-accent">
        {item.question}
      </Faq.Trigger>
      <Faq.Content className="text-zinc-400 text-sm">
        {item.answer}
      </Faq.Content>
    </Faq.Item>
  ))}
</Faq.Root>`,
      },
      details: [
        { label: 'Target Audience', value: 'Human Visitors & Browsers' },
        { label: 'Prism / Radix', value: 'Unstyled Headless Primitives' },
        { label: 'Styling', value: '100% Tailwind CSS Compatible' },
      ],
    },
  },
  {
    id: 'output-graph',
    type: 'heroNode',
    position: { x: 840, y: 165 },
    data: {
      id: 'output-graph',
      stage: 'output',
      channel: 'graph',
      title: 'Schema.org @graph',
      subtitle: 'For Search Crawlers',
      badge: '04B. SEARCH ENGINES',
      color: '#a855f7', // purple-500
      accentClass: 'text-purple-400',
      borderClass: 'border-purple-500/40 hover:border-purple-400',
      bgGlowClass: 'from-purple-500/10 to-transparent',
      description: 'Referentially-linked entity graph with @id URI references, enabling rich snippets and entity rank.',
      codeSnippet: {
        language: 'json',
        filename: 'api/graph.json',
        code: `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://example.com/#website",
      "name": "Contextual UI Starter Kit",
      "url": "https://example.com"
    },
    {
      "@type": "FAQPage",
      "@id": "https://example.com/#faq",
      "isPartOf": { "@id": "https://example.com/#website" },
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is Contextual UI Starter Kit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An open-source starter for SSOT apps."
          }
        }
      ]
    }
  ]
}`,
      },
      details: [
        { label: 'Target Indexers', value: 'Google, Bing, Yandex, Perplexity' },
        { label: 'Standard', value: 'W3C JSON-LD / Schema.org' },
        { label: 'Endpoint', value: '/api/graph.json' },
      ],
    },
  },
  {
    id: 'output-ai',
    type: 'heroNode',
    position: { x: 840, y: 310 },
    data: {
      id: 'output-ai',
      stage: 'output',
      channel: 'ai',
      title: 'AI Agent Context',
      subtitle: 'For LLMs & Autonomous Agents',
      badge: '04C. AI AGENTS',
      color: '#f43f5e', // rose-500
      accentClass: 'text-rose-400',
      borderClass: 'border-rose-500/40 hover:border-rose-400',
      bgGlowClass: 'from-rose-500/10 to-transparent',
      description: 'Direct, deterministic semantic graph feeds without noisy DOM parsing, hallucinations, or bot scraping.',
      codeSnippet: {
        language: 'json',
        filename: 'agent/context.json',
        code: `{
  "agent_context": {
    "site": "Contextual UI Starter Kit",
    "entities_discovered": ["WebSite", "FAQPage", "SiteNavigationElement"],
    "direct_graph_url": "/api/graph.json",
    "zero_scraping": true,
    "accuracy_score": 1.0,
    "summary": "SSOT Next.js architecture with instant Schema.org compilation."
  }
}`,
      },
      details: [
        { label: 'Consumers', value: 'ChatGPT, Claude, Agentic RAG Systems' },
        { label: 'Precision', value: '100% Deterministic (Zero Scraping)' },
        { label: 'Latency', value: '< 10ms Structured Response' },
      ],
    },
  },
];

export const initialEdges: Edge<FlowEdgeData>[] = [
  {
    id: 'edge-source-schema',
    source: 'source-node',
    target: 'schema-node',
    type: 'glowingEdge',
    label: 'Zod Validate',
    data: {
      color: '#10b981',
      isActive: true,
      duration: '3.2s',
    },
  },
  {
    id: 'edge-schema-engine',
    source: 'schema-node',
    target: 'engine-node',
    type: 'glowingEdge',
    label: 'Infer & Bind',
    data: {
      color: '#f59e0b',
      isActive: true,
      duration: '2.8s',
    },
  },
  {
    id: 'edge-engine-ui',
    source: 'engine-node',
    target: 'output-ui',
    type: 'glowingEdge',
    label: 'Hydrate UI',
    data: {
      channel: 'ui',
      color: '#38bdf8',
      isActive: true,
      duration: '2.4s',
    },
  },
  {
    id: 'edge-engine-graph',
    source: 'engine-node',
    target: 'output-graph',
    type: 'glowingEdge',
    label: 'Compile @graph',
    data: {
      channel: 'graph',
      color: '#a855f7',
      isActive: true,
      duration: '2.4s',
    },
  },
  {
    id: 'edge-engine-ai',
    source: 'engine-node',
    target: 'output-ai',
    type: 'glowingEdge',
    label: 'Feed LLM',
    data: {
      channel: 'ai',
      color: '#f43f5e',
      isActive: true,
      duration: '2.4s',
    },
  },
];
