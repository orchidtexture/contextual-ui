import { siteSchema } from './site.schema';
import { staticConnector } from 'contextual-ui-connector-static';
import { createContextualApp, InferData } from 'contextual-ui/server';

const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://contextual.site';

const connector = staticConnector({
  organization: {
    name: 'Tasuku Studio',
    url: 'https://tasuku.io',
    logo: '/images/onigiri_logo.svg',
    description: 'Creator and maintainer of Contextual UI.',
    sameAs: [
      'https://github.com/orchidtexture',
      'https://twitter.com/orchidtexture',
    ],
  },
  website: {
    name: 'Contextual UI',
    url: siteUrl,
    description: 'A headless UI and semantic SEO Knowledge Graph library.',
  },
  webpage: [
    {
      id: 'home',
      name: 'Contextual UI - Home',
      url: '/',
      description: 'A headless UI and semantic SEO Knowledge Graph library.',
    },
    {
      id: 'docs',
      name: 'Documentation - Contextual UI',
      url: '/docs',
      description: 'Learn how to use Contextual UI.',
    },
    {
      id: 'schema',
      name: 'Schema Inspector - Contextual UI',
      url: '/schema',
      description: 'Inspect the generated Schema.org JSON-LD graph.',
    },
    {
      id: 'studio',
      name: 'Studio Playground - Contextual UI',
      url: '/studio',
      description: 'Interactive playground and code generator for Contextual UI.',
    },
    {
      id: 'cms',
      name: 'CMS Dashboard - Contextual UI',
      url: '/cms',
      description: 'Manage content and validate schemas.',
    },
    {
      id: 'privacy',
      name: 'Privacy Policy - Contextual UI',
      url: '/privacy',
      description: 'Privacy policy and data protection information for Contextual UI.',
    },
    {
      id: 'terms',
      name: 'Terms of Service - Contextual UI',
      url: '/terms',
      description: 'Terms of service and usage agreements for Contextual UI.',
    },
  ],
  faq: [
    { id: '1', pageId: 'home', question: 'What is Contextual UI?', answer: 'An open-source library that provides the building blocks for next-gen AI-ready websites.' },
    { id: '2', pageId: 'home', question: 'How does semantic SEO work with Contextual UI?', answer: 'Contextual UI automatically injects structured JSON-LD graphs for search engines and AI agents.' },
    { id: '3', pageId: 'home', question: 'Can I use custom Zod schemas for CMS validation?', answer: 'Yes, any Zod schema can be plugged into the CMS dashboard and form generator.' },
    { id: '4', pageId: 'home', question: 'Why use Contextual UI for building websites when AI is getting better and better?', answer: 'Well, libraries like Contextual UI are the kind of thing that make AI better, so lets use it!' },
  ],
  forms: [
    {
      id: 'contact-sales',
      pageId: 'docs',
      name: 'Contact Sales & Support',
      title: 'Get in Touch',
      description: 'Send our team a direct message. Submissions are dynamically validated and Agentic AI ready.',
      actionType: 'ContactAction',
      endpoint: '/api/contact',
      method: 'POST',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Full Name',
          required: true,
          placeholder: 'Jane Doe',
          validation: { minLength: 2 },
        },
        {
          name: 'email',
          type: 'email',
          label: 'Work Email',
          required: true,
          placeholder: 'jane@company.com',
        },
        {
          name: 'topic',
          type: 'select',
          label: 'Topic',
          required: true,
          placeholder: 'Select inquiry topic...',
          options: [
            { label: 'General Inquiry', value: 'general' },
            { label: 'Sales & Enterprise', value: 'sales' },
            { label: 'Technical Support', value: 'support' },
            { label: 'Partnership', value: 'partnership' },
          ],
        },
        {
          name: 'message',
          type: 'textarea',
          label: 'Message',
          required: true,
          placeholder: 'Tell us how we can help your team...',
          validation: { minLength: 10 },
        },
      ],
      submitLabel: 'Send Message',
      successMessage: 'Thank you! Your message has been received by our team.',
    },
  ],
  navbar: {
    brand: { name: 'Contextual', href: '/', logo: '/images/onigiri_logo.svg' },
    links: [
      { id: '1', label: 'Home', href: '/' },
      { id: '2', label: 'Docs', href: '/docs' },
      { id: '3', label: 'Schema Graph', href: '/schema' },
      { id: '4', label: 'Studio', href: '/studio' },
      // { id: '5', label: 'CMS Dashboard', href: '/cms' },
    ]
  },
  footer: {
    brand: {
      name: 'Contextual',
      logo: '/images/onigiri_logo.svg',
      href: '/',
      description: 'Headless UI components with built-in Agentic AI infrastructure and Schema.org SEO.',
    },
    columns: [
      {
        id: 'resources',
        title: 'Resources',
        links: [
          { id: '1', label: 'Docs', href: '/docs' },
          { id: '2', label: 'Schema Graph', href: '/schema' },
          { id: '3', label: '/api/graph.json ↗', href: '/api/graph.json', external: true },
        ],
      },
      {
        id: 'community',
        title: 'Community',
        links: [
          { id: '4', label: 'Tasuku Studio', href: 'https://tasuku.io', external: true },
          { id: '5', label: 'GitHub Repository', href: 'https://github.com/orchidtexture/contextual-ui', external: true },
        ],
      },
    ],
    legalLinks: [
      { id: 'l1', label: 'Privacy Policy', href: '/privacy' },
      { id: 'l2', label: 'Terms of Service', href: '/terms' },
    ],
    socials: [
      { id: 's1', platform: 'GitHub', href: 'https://github.com/orchidtexture/contextual-ui', label: 'GitHub' },
      { id: 's2', platform: 'Twitter', href: 'https://twitter.com/orchidtexture', label: 'Twitter / X' },
    ],
    copyright: {
      holder: 'Tasuku Studio',
      year: 2026,
      text: 'Maintained by Tasuku Studio. Open-source under MIT license.',
    },
  },
  sections: [
    {
      id: 'ssot',
      pageId: 'home',
      title: 'Single Source of Truth (SSOT)',
      description: 'Define your site schema once in Zod. Automatically generate TypeScript types, runtime validation, and Schema.org JSON-LD with zero drift.',
      anchor: 'ssot',
      mainEntity: '#itemlist:home:ssot-features',
    },
    {
      id: 'knowledge-graph',
      pageId: 'home',
      title: 'Global Knowledge Graph',
      description: 'Entities, route documents, and component metadata compile into a single referentially-linked Schema.org @graph. Exposed sitewide for AI agents, LLM pipelines, and search bots.',
      anchor: 'knowledge-graph',
      mainEntity: '#itemlist:home:knowledge-graph-features',
    },
    {
      id: 'metadata-scoping',
      pageId: 'home',
      title: 'Global vs Route Metadata',
      description: 'Distinguish between domain-level entities (WebSite, Organization), route documents (WebPage), and UI components without prop drilling.',
      anchor: 'metadata-scoping',
      mainEntity: '#itemlist:home:metadata-scoping-features',
      content: [
        {
          type: 'paragraph',
          role: 'qualifier',
          text: 'Why it matters: Isolating domain, route, and component contexts prevents metadata leakage across pages while maintaining global entity links throughout the Knowledge Graph.',
        },
      ],
    },
    {
      id: 'headless-radix',
      pageId: 'home',
      title: 'Headless & Radix Powered',
      description: 'Unstyled, accessible UI primitives built with Radix UI and the asChild pattern. Full styling freedom with Tailwind CSS or any design system, with automated Schema.org markup.',
      anchor: 'headless-radix',
      mainEntity: '#itemlist:home:headless-features',
      content: [
        {
          type: 'paragraph',
          role: 'qualifier',
          text: 'Why it matters: You get top-tier SEO and agentic structured data without compromising your team\'s UI design system, component libraries, or frontend styling architecture.',
        },
      ],
    },
    {
      id: 'privacy-policy',
      pageId: 'privacy',
      title: 'Privacy Policy',
      description: 'Contextual UI is an open-source framework and does not track personal browsing activity or collect unsolicited personal data. All schema graphs and user configurations remain strictly under your control.',
      content: [
        {
          type: 'paragraph',
          text: 'Contextual UI is an open-source framework and does not track personal browsing activity or collect unsolicited personal data. All schema graphs and user configurations remain strictly under your control.',
        },
        {
          type: 'heading',
          text: 'Data Storage',
          level: 2,
        },
        {
          type: 'paragraph',
          text: 'Data processed through Contextual UI connectors is executed directly on your own infrastructure or hosting provider.',
        },
      ],
    },
    {
      id: 'terms-of-service',
      pageId: 'terms',
      title: 'Terms of Service',
      description: 'Contextual UI is open-source software distributed under the MIT license.',
      content: [
        {
          type: 'paragraph',
          text: 'Contextual UI is open-source software distributed under the MIT license.',
        },
      ],
    },
  ],
  collections: [
    {
      id: 'ssot-features',
      pageId: 'home',
      title: 'SSOT Pillars',
      ordered: true,
      items: [
        {
          id: 'define-once',
          title: '1. Define Once',
          description: 'Compose Schema.org registries (websiteRegistry, faqRegistry) and custom Zod schemas.',
          order: 1,
        },
        {
          id: 'auto-type-inference',
          title: '2. Auto Type Inference',
          description: 'Derive 100% type-safe models via InferData<typeof siteSchema> with zero manual duplication.',
          order: 2,
        },
        {
          id: 'zero-drift-sync',
          title: '3. Zero Drift Sync',
          description: 'Connector data automatically keeps headless React UI components and SEO JSON-LD graphs in sync.',
          order: 3,
        },
      ],
    },
    {
      id: 'knowledge-graph-features',
      pageId: 'home',
      title: 'Knowledge Graph Capabilities',
      ordered: false,
      items: [
        {
          id: 'referential-linking',
          title: 'Referential @id Linking',
          description: 'Entities reference each other with canonical URIs (#website, #organization) forming a true Semantic Web graph.',
        },
        {
          id: 'agent-ready-endpoint',
          title: 'Agent-Ready API Endpoint',
          description: 'Exposes /api/graph.json so AI agents (Perplexity, ChatGPT Search, Claude) consume clean structured data without parsing messy DOM.',
        },
        {
          id: 'zero-scraping-fragility',
          title: 'Zero Scraping Fragility',
          description: 'Eliminates scraper breaks from markup refactors, client hydration delays, and costly LLM token waste.',
        },
      ],
    },
    {
      id: 'metadata-scoping-features',
      pageId: 'home',
      title: 'Metadata Scoping Levels',
      ordered: true,
      items: [
        {
          id: 'domain-scope',
          title: 'Domain Scope',
          description: 'Mounted at root app/layout.tsx. Injects global entities like Organization, WebSite, and sitewide navigations.',
          order: 1,
        },
        {
          id: 'route-scope',
          title: 'Route Scope',
          description: 'Wraps individual route pages (<WebPage id="docs">). Scopes canonical URLs, route titles, descriptions, and breadcrumb trails to the active document.',
          order: 2,
        },
        {
          id: 'component-scope',
          title: 'Component Scope',
          description: 'Headless primitives that consume typed data directly from context, render accessible UI, and attach microdata fragments to the parent page node.',
          order: 3,
        },
      ],
    },
    {
      id: 'headless-features',
      pageId: 'home',
      title: 'Headless Primitives',
      ordered: false,
      items: [
        {
          id: 'radix-aschild',
          title: 'Radix asChild Pattern',
          description: 'Slot into your custom button, link, Next.js <Link>, or motion component without extra wrapper divs.',
        },
        {
          id: 'design-system-agnostic',
          title: 'Design System Agnostic',
          description: '100% compatible with Tailwind CSS, Tailwind v4, CSS Modules, Shadcn UI, or custom enterprise design tokens.',
        },
        {
          id: 'wai-aria-accessibility',
          title: 'WAI-ARIA Accessibility',
          description: 'Full keyboard navigation (Tab, Enter, Space, Arrows), screen reader announcements, and robust ARIA states out of the box.',
        },
        {
          id: 'automated-microdata',
          title: 'Automated Microdata',
          description: 'Components quietly emit valid Schema.org microdata and JSON-LD behind the scenes without polluting your JSX styling.',
        },
      ],
    },
    {
      id: 'quickstart-steps',
      pageId: 'docs',
      title: 'Quickstart Steps',
      ordered: true,
      items: [
        {
          id: 'step-1',
          title: 'Create Next.js App & Install Dependencies',
          description: 'Initialize a blank Next.js App Router project (or use an existing project) and install contextual-ui, the static connector, and zod.',
          order: 1,
        },
        {
          id: 'step-2',
          title: 'Define Site Schema & Type Contracts',
          description: 'Declare your data architecture in site.schema.ts using defineSchema and modular schema registries.',
          order: 2,
        },
        {
          id: 'step-3',
          title: 'Instantiate Contextual App & Static Connector',
          description: 'Bind your schema to a data source using createContextualApp in site.server.ts to produce type-safe data hydration.',
          order: 3,
        },
        {
          id: 'step-4',
          title: 'Configure SEO Routes (Sitemap & Robots)',
          description: 'Export automated sitemap.xml and robots.txt handlers derived directly from your connector webpage list.',
          order: 4,
        },
        {
          id: 'step-5',
          title: 'Mount ContextualSite in Root Layout',
          description: 'Wrap your app in <ContextualSite> to provide client context, headless layout components, and global JSON-LD knowledge graph injection.',
          order: 5,
        },
      ],
    },
  ],
  announcement: {
    enabled: true,
    message: '🚀 Welcome to the Contextual UI implementation reference website!',
  }
});

export const siteApp = createContextualApp({
  schema: siteSchema,
  connector: connector,
  baseUrl: siteUrl,
});

export type SiteData = InferData<typeof siteSchema>;

