import type { CollectionRecord, CollectionItem } from 'contextual-ui';

export interface QuickstartStepDefinition {
  id: string;
  order: number;
  title: string;
  description: string;
  optional?: boolean;
  codeSnippet?: {
    filename: string;
    code: string;
    lang: 'typescript' | 'tsx';
  };
  qualifier?: {
    title: string;
    text: string;
  };
}

export const schemaCode = `import {
  defineSchema,
  organizationRegistry,
  websiteRegistry,
  webpageRegistry,
  navbarRegistry,
  faqRegistry,
  footerRegistry,
} from 'contextual-ui/server';
import { z } from 'zod';

// 1. Define the Single Source of Truth (SSOT) schema
export const siteSchema = defineSchema({
  organization: organizationRegistry(),
  website: websiteRegistry(),
  webpage: webpageRegistry(),
  navbar: navbarRegistry(),
  faq: faqRegistry(),
  footer: footerRegistry(),
  // Extend with custom typed Zod fields anytime:
  announcement: {
    schema: z.object({
      enabled: z.boolean(),
      message: z.string().describe('Announcement Banner Text'),
    }),
  },
});`;

export const serverCode = `import { siteSchema } from './site.schema';
import { staticConnector } from 'contextual-ui-connector-static';
import { createContextualApp, InferData } from 'contextual-ui/server';

const baseUrl = process.env.SITE_URL || 'https://example.com';

// 2. Configure a data connector (Static Config, Headless CMS, or Database)
const connector = staticConnector({
  organization: {
    name: 'Acme Corp',
    url: baseUrl,
    logo: '/images/logo.svg',
    description: 'Creator of modern web tools.',
    sameAs: ['https://github.com/acme', 'https://twitter.com/acme'],
  },
  website: {
    name: 'Acme App',
    url: baseUrl,
    description: 'Headless UI with automated Schema.org SEO and Agentic AI graphs.',
  },
  webpage: [
    {
      id: 'home',
      name: 'Acme App - Home',
      url: '/',
      description: 'Headless UI with automated Schema.org SEO and Agentic AI graphs.',
    },
    {
      id: 'docs',
      name: 'Acme App - Docs',
      url: '/docs',
      description: 'Documentation for Acme App.',
    },
  ],
  navbar: {
    brand: { name: 'Acme', href: '/', logo: '/images/logo.svg' },
    links: [
      { id: '1', label: 'Home', href: '/' },
      { id: '2', label: 'Docs', href: '/docs' },
    ],
  },
  faq: [
    {
      id: '1',
      question: 'How does Contextual UI work?',
      answer: 'It unifies your data layer, headless UI components, and Schema.org JSON-LD SEO graph.',
    },
  ],
  footer: {
    brand: { name: 'Acme', href: '/' },
    copyright: { holder: 'Acme Corp', year: 2026 },
  },
});

// 3. Initialize the compiled Contextual App instance with baseUrl
export const siteApp = createContextualApp({
  schema: siteSchema,
  connector,
  baseUrl,
});

export type SiteData = InferData<typeof siteSchema>;`;

export const layoutCode = `import type { Metadata } from 'next';
import { siteApp } from '@/data/site.server';
import { ContextualSite } from 'contextual-ui';
import { CustomNavbar } from '@/components/Navbar';
import { CustomFooter } from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Next.js Application',
  description: 'Built with Next.js and Contextual UI',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch validated data for global layout elements (Navbar, Footer, etc.)
  const data = await siteApp.fetchData();

  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        {/* ContextualSite distributes site data via React context to all client & server components */}
        <ContextualSite data={data} className="min-h-full flex flex-col flex-1">
          <CustomNavbar />
          <div className="flex-1">{children}</div>
          <CustomFooter />
        </ContextualSite>
      </body>
    </html>
  );
}`;

export const navbarCode = `'use client';

import { Navbar } from 'contextual-ui';
import type { NavbarData } from 'contextual-ui';

interface CustomNavbarProps {
  data?: NavbarData; // Optional! Automatically read from ContextualSite if omitted
}

export function CustomNavbar({ data }: CustomNavbarProps = {}) {
  // Contextual UI components are headless: style with Tailwind, CSS modules, or Radix
  return (
    <Navbar.Root data={data} className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        <Navbar.Brand className="font-bold font-mono text-base flex items-center gap-2.5 text-zinc-900 dark:text-zinc-50" />

        <Navbar.Links
          className="hidden md:flex gap-6 items-center"
          linkClassName="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 no-underline text-sm font-medium transition-colors"
        />

        <Navbar.Toggle className="md:hidden p-2 text-zinc-600 dark:text-zinc-400 focus:outline-none cursor-pointer rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" />
      </div>

      {/* Mobile Menu Dropdown */}
      <Navbar.Menu
        className="md:hidden bg-white/95 dark:bg-black/95 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex flex-col gap-2 shadow-xl"
        linkClassName="text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-50 text-base font-medium py-2 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
      />
    </Navbar.Root>
  );
}`;

export const pageCode = `import { siteApp } from '@/data/site.server';
import { WebPage } from 'contextual-ui/server';
import { Faq } from 'contextual-ui';

// Zero duplication! Automatically pulls title, description, and canonical URL from SSOT
export const generateMetadata = () => siteApp.getMetadata('home');

export default async function HomePage() {
  const data = await siteApp.fetchData();

  return (
    // Scopes the Schema.org JSON-LD graph specifically to this route
    <WebPage app={siteApp} id="home">
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <header className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Acme App</h1>
          <p className="text-lg text-zinc-400">Headless UI with automated Schema.org SEO and Agentic AI graphs.</p>
        </header>

        {/* Headless FAQ Accordion automatically bound to schema data */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
          <Faq.Root className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            {data?.faq?.map((item) => (
              <Faq.Item key={item.id} id={item.id} className="mb-4 last:mb-0 border-b border-zinc-200 dark:border-zinc-800 last:border-b-0 pb-4 last:pb-0">
                <Faq.Trigger className="bg-transparent border-none font-semibold text-base cursor-pointer text-left w-full hover:text-accent transition-colors py-1">
                  {item.question}
                </Faq.Trigger>
                <Faq.Content className="mt-2 text-zinc-400 text-sm leading-relaxed">
                  {item.answer}
                </Faq.Content>
              </Faq.Item>
            ))}
          </Faq.Root>
        </section>
      </main>
    </WebPage>
  );
}`;

export const sitemapRobotsCode = `// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { siteApp } from '@/data/site.server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Automatically derives canonical sitemap from connector routes
  return siteApp.getSitemap({
    exclude: ['/cms', '/cms/*'],
  });
}

// app/robots.ts
import type { MetadataRoute } from 'next';
import { siteApp } from '@/data/site.server';

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Configures search & AI crawler permissions and auto-attaches sitemap & host
  return siteApp.getRobots({
    disallow: ['/cms', '/cms/'],
  });
}`;

export const routeCode = `import { siteApp } from '@/data/site.server';

// Expose machine-readable Knowledge Graph for AI Agents, Perplexity & Claude
export const { GET } = siteApp.createGraphHandler({
  includeAll: true, // Export all schema sections (or use excludeKeys / includeKeys)
  graphOptions: {
    flatten: true,
    dedupeStrategy: 'merge',
  },
});`;

export const quickstartStepDefinitions: QuickstartStepDefinition[] = [
  {
    id: 'create-and-install',
    order: 1,
    title: 'Create Next.js App & Install Dependencies',
    description: 'Initialize a blank Next.js App Router project (or use an existing project) and install contextual-ui, the static connector, and zod.',
  },
  {
    id: 'define-schema',
    order: 2,
    title: 'Define your Site Schema (SSOT)',
    description: 'Create data/site.schema.ts. Using defineSchema, register pre-built Schema.org registries (organization, website, webpage, navbar, footer, faq) or any custom Zod schemas.',
    codeSnippet: {
      filename: 'data/site.schema.ts',
      code: schemaCode,
      lang: 'typescript',
    },
  },
  {
    id: 'configure-connector',
    order: 3,
    title: 'Configure Server Connector & App Instance',
    description: 'Create data/site.server.ts. Bind your schema with createContextualApp and a connector (static configuration, headless CMS, or database ORM).',
    codeSnippet: {
      filename: 'data/site.server.ts',
      code: serverCode,
      lang: 'typescript',
    },
    qualifier: {
      title: 'Schema Accuracy Guardrails',
      text: 'Centralizing site metadata prevents data drift between your visual UI, metadata tags, and search engine graphs. In step 6, <WebPage app={siteApp} id="home"> scopes the Schema.org JSON-LD graph strictly to the current route—ensuring search engines only receive structured data for entities actually rendered on that page.',
    },
  },
  {
    id: 'wrap-layout',
    order: 4,
    title: 'Wrap Root Layout with ContextualSite',
    description: 'In app/layout.tsx (Server Component), fetch shared data and wrap children in <ContextualSite data={data}>. This distributes validated site data (brand, links, copyright) to all layout components via React Context.',
    codeSnippet: {
      filename: 'app/layout.tsx',
      code: layoutCode,
      lang: 'tsx',
    },
  },
  {
    id: 'headless-components',
    order: 5,
    title: 'Implement Headless Navbar & Footer Client Components',
    description: 'Contextual UI components (<Navbar.Root>, <Footer.Root>) are headless client components. Because they sit inside <ContextualSite>, they automatically read brand and navigation data from context without needing explicit props!',
    codeSnippet: {
      filename: 'components/Navbar.tsx',
      code: navbarCode,
      lang: 'tsx',
    },
  },
  {
    id: 'render-webpage',
    order: 6,
    title: 'Render WebPage & Route-Specific Content',
    description: 'In app/page.tsx, export generateMetadata using siteApp.getMetadata(\'home\') (zero duplication), and wrap your page in <WebPage app={siteApp} id="home"> to inject the route-specific Schema.org JSON-LD graph.',
    codeSnippet: {
      filename: 'app/page.tsx',
      code: pageCode,
      lang: 'tsx',
    },
  },
  {
    id: 'sitemap-robots',
    order: 7,
    title: 'Add Automated Sitemap & Robots.txt',
    description: 'Generate sitemap.xml and robots.txt in 3 lines each. Contextual UI automatically indexes all routes defined in your connector and manages AI crawler permissions (GPTBot, ClaudeBot, PerplexityBot).',
    codeSnippet: {
      filename: 'app/sitemap.ts & app/robots.ts',
      code: sitemapRobotsCode,
      lang: 'typescript',
    },
  },
  {
    id: 'ai-knowledge-graph',
    order: 8,
    title: 'Expose AI Knowledge Graph API',
    description: 'Expose a machine-readable JSON-LD Knowledge Graph endpoint at app/api/graph.json/route.ts in 4 lines. AI Agents (Claude, ChatGPT, Perplexity) use this endpoint to understand your entire site hierarchy.',
    optional: true,
    codeSnippet: {
      filename: 'app/api/graph.json/route.ts',
      code: routeCode,
      lang: 'typescript',
    },
  },
];

/**
 * Builds the canonical CollectionRecord for the quickstart guide.
 */
export function buildQuickstartCollection(
  steps: QuickstartStepDefinition[] = quickstartStepDefinitions
): CollectionRecord {
  return {
    id: 'quickstart-steps',
    pageId: 'docs',
    title: 'Quickstart Guide',
    description: 'Learn how to install Contextual UI, define a single-source-of-truth schema, configure a data connector, and render headless SEO-ready components in your Next.js application in under 5 minutes.',
    ordered: true,
    items: steps.map((s, idx) => {
      const contentBlocks: any[] = [];
      if (s.qualifier) {
        contentBlocks.push({
          type: 'callout',
          variant: 'note',
          title: s.qualifier.title,
          text: s.qualifier.text,
        });
      }
      if (s.codeSnippet) {
        contentBlocks.push({
          type: 'code',
          filename: s.codeSnippet.filename,
          code: s.codeSnippet.code,
          language: s.codeSnippet.lang,
        });
      }

      return {
        id: s.id,
        order: s.order ?? idx + 1,
        title: s.title,
        description: s.description,
        content: contentBlocks.length > 0 ? contentBlocks : undefined,
        type: 'ListItem' as const,
      };
    }),
    type: 'ItemList' as const,
  };
}

export const quickstartCollection = buildQuickstartCollection();
