'use client';

import { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-okaidia.css';
import {
  Plug,
  RotateCcw,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Code2,
  FileJson,
  Sparkles,
  RefreshCw,
  Server,
  Database,
  FileCode,
  Terminal,
  Check,
  Copy,
  Bot,
  Boxes,
  Layers,
  Globe,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Breadcrumb, Navbar, Faq, Footer, createForm, AutoForm } from 'contextual-ui';
import { z } from 'zod';
import type { SiteData } from '@/data/site.server';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const ContactForm = createForm(contactSchema);

function highlightCode(code: string, lang: 'tsx' | 'jsx' | 'typescript' | 'json') {
  const grammar = Prism.languages[lang] || Prism.languages.typescript || Prism.languages.javascript;
  if (!grammar) return code;
  return Prism.highlight(code, grammar, lang);
}

export interface SchemaField {
  name: string;
  type: string;
  required?: boolean;
  schemaOrgMapping?: string;
  description: string;
}

function SchemaFieldsTable({ fields }: { fields: SchemaField[] }) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          Schema Reference & Contract
        </h3>
        <span className="text-[11px] font-mono text-zinc-500">
          {fields.length} {fields.length === 1 ? 'field' : 'fields'}
        </span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-base bg-zinc-950/70 shadow-inner">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-base bg-zinc-900/80 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3.5 font-semibold">Field</th>
              <th className="py-2.5 px-3.5 font-semibold">Type</th>
              <th className="py-2.5 px-3.5 font-semibold">Requirement</th>
              <th className="py-2.5 px-3.5 font-semibold">Schema.org Mapping</th>
              <th className="py-2.5 px-3.5 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 font-mono">
            {fields.map((field) => (
              <tr key={field.name} className="hover:bg-zinc-900/40 transition-colors">
                <td className="py-2.5 px-3.5 font-semibold text-accent whitespace-nowrap text-xs">
                  {field.name}
                </td>
                <td className="py-2.5 px-3.5 whitespace-nowrap">
                  <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                    {field.type}
                  </span>
                </td>
                <td className="py-2.5 px-3.5 whitespace-nowrap">
                  {field.required ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                      Required
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800">
                      Optional
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-3.5 whitespace-nowrap text-[11px]">
                  {field.schemaOrgMapping && field.schemaOrgMapping !== '—' ? (
                    <span className="text-silver">
                      {field.schemaOrgMapping}
                    </span>
                  ) : (
                    <span className="text-zinc-600">—</span>
                  )}
                </td>
                <td className="py-2.5 px-3.5 font-sans text-zinc-300 text-xs min-w-[200px] leading-relaxed">
                  {field.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InspectorCard({
  title = 'Interactive Data Source',
  onReset,
  children,
}: {
  title?: string;
  onReset?: () => void;
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-base bg-zinc-950/70 overflow-hidden mb-6 shadow-sm transition-all">
      {/* Clickable Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-zinc-900/40 transition-colors"
      >
        {/* Left: Title & Sub-badge */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 truncate">
            {title}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            Mock Connector
          </span>
        </div>

        {/* Right: Actions & Far-Right Chevron */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#connectors"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              document.getElementById('connectors')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-accent transition-colors underline underline-offset-2 decoration-zinc-700 hover:decoration-accent"
          >
            <span>How Connectors work</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {onReset && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              type="button"
              className="text-[11px] font-mono text-zinc-400 hover:text-accent transition-colors flex items-center gap-1.5 cursor-pointer bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1 rounded-md border border-base"
              title="Reset values to defaults"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          {/* Far-Right Chevron Toggle Button */}
          <div className="p-1 rounded text-zinc-400 hover:text-zinc-100 transition-colors">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content Area */}
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-base mt-1">
          <p className="text-[11px] text-zinc-400 my-3 leading-relaxed">
            Simulates data ingested through a Contextual UI connector. Modifying these values updates both the live UI component and the generated Schema.org JSON-LD graph.
          </p>
          <div className="space-y-4 pt-1">{children}</div>
        </div>
      )}
    </div>
  );
}

function CodeSnippet({
  filename,
  code,
  lang = 'tsx',
}: {
  filename: string;
  code: string;
  lang?: 'tsx' | 'typescript' | 'json' | 'jsx';
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <FileCode className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-mono text-zinc-300 font-medium">{filename}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-accent transition-colors px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre
        tabIndex={0}
        suppressHydrationWarning
        className="!bg-zinc-900 !text-zinc-100 p-5 text-xs font-mono overflow-x-auto shadow-inner m-0"
      >
        <code
          className={`language-${lang}`}
          dangerouslySetInnerHTML={{
            __html: highlightCode(code, lang),
          }}
        />
      </pre>
    </div>
  );
}

function InstallCommandBox() {
  const [pm, setPm] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('pnpm');
  const [copied, setCopied] = useState(false);

  const commands = {
    pnpm: 'pnpm add contextual-ui contextual-ui-connector-static zod',
    npm: 'npm install contextual-ui contextual-ui-connector-static zod',
    yarn: 'yarn add contextual-ui contextual-ui-connector-static zod',
    bun: 'bun add contextual-ui contextual-ui-connector-static zod',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(commands[pm]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-mono text-zinc-300 font-medium">Terminal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-zinc-800 rounded-md overflow-hidden bg-zinc-900">
            {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((manager) => (
              <button
                key={manager}
                type="button"
                onClick={() => setPm(manager)}
                className={`px-2.5 py-1 text-[11px] font-mono transition-colors cursor-pointer ${
                  pm === manager
                    ? 'bg-zinc-800 text-accent font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                {manager}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-accent transition-colors px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer"
            title="Copy command"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="p-4 bg-zinc-900/90 font-mono text-xs flex items-center justify-between overflow-x-auto text-zinc-200">
        <div className="flex items-center gap-2.5">
          <span className="text-accent select-none font-bold">$</span>
          <span>{commands[pm]}</span>
        </div>
      </div>
    </div>
  );
}

function QuickstartSection() {
  const schemaCode = `import {
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

  const serverCode = `import { siteSchema } from './site.schema';
import { staticConnector } from 'contextual-ui-connector-static';
import { createContextualApp, InferData } from 'contextual-ui/server';

// 2. Configure a data connector (Static Config, Headless CMS, or Database)
const connector = staticConnector({
  organization: {
    name: 'Acme Corp',
    url: 'https://example.com',
    logo: '/images/logo.svg',
    description: 'Creator of modern web tools.',
    sameAs: ['https://github.com/acme', 'https://twitter.com/acme'],
  },
  website: {
    name: 'Acme App',
    url: 'https://example.com',
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
    copyright: { holder: 'Acme Corp', year: 2025 },
  },
  announcement: {
    enabled: true,
    message: 'Welcome to our Next.js application!',
  },
});

// 3. Initialize the compiled Contextual App instance with baseUrl for canonical @graph IDs
export const siteApp = createContextualApp({
  schema: siteSchema,
  connector,
  baseUrl: 'https://example.com',
});

export type SiteData = InferData<typeof siteSchema>;`;

  const layoutCode = `import type { Metadata } from 'next';
import { siteApp } from '@/data/site.server';
import { ContextualSite } from 'contextual-ui';
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
    <html lang="en">
      <body>
        {/* ContextualSite provides React context to all layout components */}
        <ContextualSite data={data}>
          {children}
        </ContextualSite>
      </body>
    </html>
  );
}`;

  const pageCode = `import { siteApp } from '@/data/site.server';
import { WebPage } from 'contextual-ui/server';
import { Navbar, Faq, Breadcrumb, Footer } from 'contextual-ui';

export default async function HomePage() {
  const data = await siteApp.fetchData();

  return (
    <WebPage app={siteApp} id="home">
      <main className="min-h-screen flex flex-col justify-between">
        {/* 1. Navbar: Automatically reads navigation & brand from ContextualSite context */}
        <Navbar.Root className="flex justify-between items-center px-6 py-4 border-b border-zinc-800">
          <Navbar.Brand className="font-bold text-lg flex items-center gap-2">
            Acme App
          </Navbar.Brand>
          <Navbar.Content className="flex gap-6 items-center">
            {/* Menu links are automatically bound or customized */}
          </Navbar.Content>
        </Navbar.Root>

        <div className="max-w-4xl mx-auto px-6 py-12 flex-1 space-y-10 w-full">
          {/* 2. Breadcrumbs: Injects Schema.org BreadcrumbList automatically */}
          <Breadcrumb.Root
            data={[
              { id: '1', label: 'Home', url: '/' },
              { id: '2', label: 'Docs', url: '/docs' },
              { id: '3', label: 'Quickstart' },
            ]}
          >
            <Breadcrumb.List className="flex items-center gap-2 text-sm text-zinc-400">
              {/* Breadcrumb items & separators */}
            </Breadcrumb.List>
          </Breadcrumb.Root>

          {/* 3. FAQ: Injects Schema.org FAQPage automatically */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
            <Faq.Root className="space-y-3">
              {/* Accordion FAQ items automatically bound from schema data */}
            </Faq.Root>
          </section>
        </div>

        {/* 4. Footer: Injects Schema.org WPFooter automatically */}
        <Footer.Root className="border-t border-zinc-800 px-6 py-8">
          {/* Brand, columnar links, socials & copyright */}
        </Footer.Root>
      </main>
    </WebPage>
  );
}`;

  const routeCode = `import { siteApp } from '@/data/site.server';

// Expose machine-readable Knowledge Graph for AI Agents, Perplexity & Claude
export const { GET } = siteApp.createGraphHandler({
  includeAll: true, // Export all schema sections (or use excludeKeys / includeKeys)
  graphOptions: {
    flatten: true,
    dedupeStrategy: 'merge',
  },
});`;

  return (
    <section id="quickstart" className="border-b border-base shadow-sm scroll-mt-28 pb-12">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-accent bg-accent/10 border border-accent/20 font-semibold">
            Next.js App Router · TypeScript · Zod
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Quickstart Guide</h2>
        <p className="text-zinc-400 max-w-3xl text-sm leading-relaxed">
          Learn how to install Contextual UI, define a single-source-of-truth schema, configure a data connector, and render headless SEO-ready components in your Next.js application in under 5 minutes.
        </p>
      </div>

      {/* Step Flow Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="p-3 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[11px] flex items-center justify-center font-bold shrink-0">1</span>
          <span className="text-xs text-zinc-300 font-medium">Install Packages</span>
        </div>
        <div className="p-3 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[11px] flex items-center justify-center font-bold shrink-0">2</span>
          <span className="text-xs text-zinc-300 font-medium">Define Schema</span>
        </div>
        <div className="p-3 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[11px] flex items-center justify-center font-bold shrink-0">3</span>
          <span className="text-xs text-zinc-300 font-medium">App Connector</span>
        </div>
        <div className="p-3 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[11px] flex items-center justify-center font-bold shrink-0">4</span>
          <span className="text-xs text-zinc-300 font-medium">Hydrate Layout</span>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-10">
        {/* Step 1 */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
              1
            </span>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Install Dependencies</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Install <code className="code-short">contextual-ui</code>, the static data connector, and <code className="code-short">zod</code> into your Next.js project.
              </p>
            </div>
          </div>
          <div className="pl-9">
            <InstallCommandBox />
          </div>
        </div>

        {/* Step 2 */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
              2
            </span>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Define your Site Schema</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Create <code className="code-short">data/site.schema.ts</code>. Using <code className="code-short">defineSchema</code>, register pre-built Schema.org registries (<code className="code-short">website</code>, <code className="code-short">navbar</code>, <code className="code-short">footer</code>, <code className="code-short">faq</code>, <code className="code-short">organization</code>) or any custom Zod schemas.
              </p>
            </div>
          </div>
          <div className="pl-9">
            <CodeSnippet filename="data/site.schema.ts" code={schemaCode} lang="typescript" />
          </div>
        </div>

        {/* Step 3 */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
              3
            </span>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Configure Server Connector & App Instance</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Create <code className="code-short">data/site.server.ts</code>. Bind your schema with <code className="code-short">createContextualApp</code> and a connector (static configuration, headless CMS, or database ORM).
              </p>
            </div>
          </div>
          <div className="pl-9">
            <CodeSnippet filename="data/site.server.ts" code={serverCode} lang="typescript" />
          </div>
        </div>

        {/* Step 4 */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
              4
            </span>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Wrap Root Layout with ContextualSite</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                In <code className="code-short">app/layout.tsx</code> (Server Component), fetch shared data and wrap children in <code className="code-short">&lt;ContextualSite&gt;</code> to distribute site context (Navbar, Footer, Brand) to all child components.
              </p>
            </div>
          </div>
          <div className="pl-9">
            <CodeSnippet filename="app/layout.tsx" code={layoutCode} lang="tsx" />
          </div>
        </div>

        {/* Step 5 */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
              5
            </span>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Render WebPage &amp; Headless UI Components</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Wrap your route in <code className="code-short">&lt;WebPage app=&#123;siteApp&#125; ...&gt;</code> (from <code className="code-short">contextual-ui/server</code>) to compile and inject the route-specific Schema.org JSON-LD graph. Render headless components like <code className="code-short">&lt;Navbar.Root&gt;</code>, <code className="code-short">&lt;Faq.Root&gt;</code>, and <code className="code-short">&lt;Footer.Root&gt;</code> without prop-drilling.
              </p>
            </div>
          </div>
          <div className="pl-9">
            <CodeSnippet filename="app/page.tsx" code={pageCode} lang="tsx" />
          </div>
        </div>

        {/* Step 6 */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
              6
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-zinc-100">Expose AI Knowledge Graph API</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-accent bg-accent/10 border border-accent/20">
                  Optional
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Expose a machine-readable JSON-LD endpoint at <code className="code-short">app/api/graph.json/route.ts</code> in 4 lines. Use <code className="code-short">includeAll: true</code> to export all sections (including FAQ), or use <code className="code-short">excludeKeys</code> / <code className="code-short">includeKeys</code> to keep specific parts private.
              </p>
            </div>
          </div>
          <div className="pl-9">
            <CodeSnippet filename="app/api/graph.json/route.ts" code={routeCode} lang="typescript" />
          </div>
        </div>
      </div>

      {/* Feature Pillars Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-10">
        <div className="p-4 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-zinc-200 text-xs font-mono font-semibold block mb-1">Automated Schema.org SEO</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Produces valid Schema.org JSON-LD graphs with @id cross-references for maximum search ranking and AI discoverability.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent shrink-0">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <span className="text-zinc-200 text-xs font-mono font-semibold block mb-1">Zero UI Rewrites</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Switch from hardcoded static data to a headless CMS (Sanity, Strapi) or database without changing UI code.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="text-zinc-200 text-xs font-mono font-semibold block mb-1">AI Agent Ready</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Built-in Route Handler serves clean JSON-LD graphs for agentic workflows, search crawlers, and LLMs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

interface RegistryItem {
  id: string;
  name: string;
  signature: string;
  schemaType: string;
  schemaUrl: string;
  description: string;
  fields: SchemaField[];
  sampleCode: string;
  sampleData: string;
}

const REGISTRIES_DATA: RegistryItem[] = [
  {
    id: 'website',
    name: 'websiteRegistry',
    signature: 'websiteRegistry()',
    schemaType: 'WebSite',
    schemaUrl: 'https://schema.org/WebSite',
    description: 'Declares domain-level website metadata, site display title, description, canonical URL, and search action.',
    fields: [
      { name: 'name', type: 'string', required: true, schemaOrgMapping: 'name', description: 'Primary display name of the website' },
      { name: 'url', type: 'string', required: true, schemaOrgMapping: 'url', description: 'Canonical root domain URL' },
      { name: 'description', type: 'string', required: false, schemaOrgMapping: 'description', description: 'Website meta description for search engines' },
      { name: 'inLanguage', type: 'string', required: false, schemaOrgMapping: 'inLanguage', description: 'Language code (e.g. "en-US")' },
      { name: 'publisher', type: 'Reference', required: false, schemaOrgMapping: 'publisher', description: 'Cross-reference pointing to the Organization entity' },
    ],
    sampleCode: `// data/site.schema.ts
import { defineSchema, websiteRegistry } from 'contextual-ui/server';

export const siteSchema = defineSchema({
  website: websiteRegistry(),
});`,
    sampleData: `// Ingested connector data
website: {
  name: 'Contextual UI Starter Kit',
  url: 'https://contextual.site',
  description: 'Headless UI components with built-in Agentic AI and Schema.org SEO.',
  inLanguage: 'en-US',
},`,
  },
  {
    id: 'organization',
    name: 'organizationRegistry',
    signature: 'organizationRegistry()',
    schemaType: 'Organization',
    schemaUrl: 'https://schema.org/Organization',
    description: 'Declares brand or publisher profile, legal name, social profiles (sameAs), logo, and contact channels.',
    fields: [
      { name: 'name', type: 'string', required: true, schemaOrgMapping: 'name', description: 'Official business or project brand name' },
      { name: 'url', type: 'string', required: false, schemaOrgMapping: 'url', description: 'Official homepage URL' },
      { name: 'logo', type: 'string', required: false, schemaOrgMapping: 'logo', description: 'URL or path to organization logo image' },
      { name: 'legalName', type: 'string', required: false, schemaOrgMapping: 'legalName', description: 'Registered legal business name' },
      { name: 'description', type: 'string', required: false, schemaOrgMapping: 'description', description: 'Brand summary description' },
      { name: 'sameAs', type: 'string[]', required: false, schemaOrgMapping: 'sameAs', description: 'Verified social URLs (GitHub, Twitter, LinkedIn)' },
      { name: 'email', type: 'string', required: false, schemaOrgMapping: 'email', description: 'Customer support / contact email' },
      { name: 'telephone', type: 'string', required: false, schemaOrgMapping: 'telephone', description: 'Customer support phone number' },
    ],
    sampleCode: `// data/site.schema.ts
import { defineSchema, organizationRegistry } from 'contextual-ui/server';

export const siteSchema = defineSchema({
  organization: organizationRegistry(),
});`,
    sampleData: `// Ingested connector data
organization: {
  name: 'Tasuku Studio',
  url: 'https://tasuku.io',
  logo: '/images/onigiri_logo.svg',
  description: 'Creator and maintainer of Contextual UI.',
  sameAs: [
    'https://github.com/orchidtexture',
    'https://twitter.com/orchidtexture',
  ],
},`,
  },
  {
    id: 'webpage',
    name: 'webpageRegistry',
    signature: 'webpageRegistry() / webpagesRegistry()',
    schemaType: 'WebPage',
    schemaUrl: 'https://schema.org/WebPage',
    description: 'Declares route documents, page titles, canonical URLs, meta descriptions, and part connections. Supports single or array of routes.',
    fields: [
      { name: 'id', type: 'string', required: true, schemaOrgMapping: '@id', description: 'Unique page identifier key (e.g. "home", "docs", "pricing")' },
      { name: 'name', type: 'string', required: true, schemaOrgMapping: 'name', description: 'Page document title tag' },
      { name: 'url', type: 'string', required: true, schemaOrgMapping: 'url', description: 'Canonical route URL (e.g. "/docs")' },
      { name: 'description', type: 'string', required: false, schemaOrgMapping: 'description', description: 'Route-specific meta description' },
      { name: 'inLanguage', type: 'string', required: false, schemaOrgMapping: 'inLanguage', description: 'Language code for this route' },
    ],
    sampleCode: `// data/site.schema.ts
import { defineSchema, webpageRegistry } from 'contextual-ui/server';

export const siteSchema = defineSchema({
  webpage: webpageRegistry(),
});`,
    sampleData: `// Ingested connector data
webpage: [
  {
    id: 'home',
    name: 'Home - Contextual UI',
    url: '/',
    description: 'Semantic SEO and Knowledge Graph starter kit.',
  },
  {
    id: 'docs',
    name: 'Documentation - Contextual UI',
    url: '/docs',
    description: 'Learn how to use Contextual UI.',
  },
],`,
  },
  {
    id: 'navbar',
    name: 'navbarRegistry',
    signature: 'navbarRegistry()',
    schemaType: 'SiteNavigationElement',
    schemaUrl: 'https://schema.org/SiteNavigationElement',
    description: 'Declares header navigation, brand logo, home link, and hierarchical menu links with automatic Schema.org microdata.',
    fields: [
      { name: 'brand.name', type: 'string', required: true, schemaOrgMapping: 'name', description: 'Brand or application display title' },
      { name: 'brand.href', type: 'string', required: true, schemaOrgMapping: 'url', description: 'Destination URL for brand link' },
      { name: 'brand.logo', type: 'string', required: false, schemaOrgMapping: 'image', description: 'Brand icon image URL' },
      { name: 'links', type: 'Array<{ id, label, href, children? }>', required: true, schemaOrgMapping: 'SiteNavigationElement', description: 'Menu items array' },
    ],
    sampleCode: `// data/site.schema.ts
import { defineSchema, navbarRegistry } from 'contextual-ui/server';

export const siteSchema = defineSchema({
  navbar: navbarRegistry(),
});`,
    sampleData: `// Ingested connector data
navbar: {
  brand: { name: 'Contextual', href: '/', logo: '/images/onigiri_logo.svg' },
  links: [
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'Docs', href: '/docs' },
    { id: '3', label: 'Schema Graph', href: '/schema' },
  ],
},`,
  },
  {
    id: 'footer',
    name: 'footerRegistry',
    signature: 'footerRegistry()',
    schemaType: 'WPFooter',
    schemaUrl: 'https://schema.org/WPFooter',
    description: 'Declares multi-column navigation links, brand bio, social profiles, legal documents, and copyright attribution.',
    fields: [
      { name: 'brand', type: '{ name, href, logo?, description? }', required: false, schemaOrgMapping: 'brand', description: 'Footer brand details' },
      { name: 'columns', type: 'Array<{ id, title, links }>', required: false, schemaOrgMapping: 'SiteNavigationElement', description: 'Categorized navigation columns' },
      { name: 'links', type: 'Array<{ id, label, href }>', required: false, schemaOrgMapping: 'SiteNavigationElement', description: 'Flat navigation link list' },
      { name: 'legalLinks', type: 'Array<{ id, label, href }>', required: false, schemaOrgMapping: 'significantLink', description: 'Privacy & Terms links' },
      { name: 'socials', type: 'Array<{ id, platform, href, label? }>', required: false, schemaOrgMapping: 'sameAs', description: 'Social platform links' },
      { name: 'copyright', type: '{ holder, year?, text? }', required: false, schemaOrgMapping: 'copyrightHolder', description: 'Copyright ownership statement' },
    ],
    sampleCode: `// data/site.schema.ts
import { defineSchema, footerRegistry } from 'contextual-ui/server';

export const siteSchema = defineSchema({
  footer: footerRegistry(),
});`,
    sampleData: `// Ingested connector data
footer: {
  brand: { name: 'Contextual', href: '/', description: 'Headless UI components.' },
  columns: [
    { id: 'res', title: 'Resources', links: [{ id: '1', label: 'Docs', href: '/docs' }] },
  ],
  copyright: { holder: 'Tasuku Studio', year: 2026 },
},`,
  },
  {
    id: 'breadcrumb',
    name: 'breadcrumbRegistry',
    signature: 'breadcrumbRegistry()',
    schemaType: 'BreadcrumbList',
    schemaUrl: 'https://schema.org/BreadcrumbList',
    description: 'Declares navigational breadcrumb trails with automated position indexing for search engine rich results.',
    fields: [
      { name: 'id', type: 'string', required: true, schemaOrgMapping: '@id', description: 'Unique step identifier' },
      { name: 'label', type: 'string', required: true, schemaOrgMapping: 'name', description: 'Display name of the breadcrumb item' },
      { name: 'url', type: 'string', required: false, schemaOrgMapping: 'item', description: 'Destination route URL' },
    ],
    sampleCode: `// data/site.schema.ts
import { defineSchema, breadcrumbRegistry } from 'contextual-ui/server';

export const siteSchema = defineSchema({
  breadcrumb: breadcrumbRegistry(),
});`,
    sampleData: `// Ingested connector data
breadcrumb: [
  { id: '1', label: 'Home', url: '/' },
  { id: '2', label: 'Docs', url: '/docs' },
  { id: '3', label: 'Schemas' },
],`,
  },
  {
    id: 'faq',
    name: 'faqRegistry',
    signature: 'faqRegistry()',
    schemaType: 'FAQPage',
    schemaUrl: 'https://schema.org/FAQPage',
    description: 'Declares question-and-answer pairs forming Schema.org Question and acceptedAnswer entities.',
    fields: [
      { name: 'id', type: 'string', required: true, schemaOrgMapping: '@id', description: 'Unique question identifier' },
      { name: 'question', type: 'string', required: true, schemaOrgMapping: 'name', description: 'Question title string' },
      { name: 'answer', type: 'string', required: true, schemaOrgMapping: 'acceptedAnswer.text', description: 'Answer text content' },
    ],
    sampleCode: `// data/site.schema.ts
import { defineSchema, faqRegistry } from 'contextual-ui/server';

export const siteSchema = defineSchema({
  faq: faqRegistry(),
});`,
    sampleData: `// Ingested connector data
faq: [
  { id: '1', question: 'What is Contextual UI?', answer: 'An open-source SSOT starter kit.' },
  { id: '2', question: 'How does SEO work?', answer: 'Injects Schema.org JSON-LD graphs.' },
],`,
  },
  {
    id: 'forms',
    name: 'formRegistry',
    signature: 'formRegistry()',
    schemaType: 'ContactAction / Action',
    schemaUrl: 'https://schema.org/PotentialAction',
    description: 'Declares CMS-driven forms with dynamic in-memory Zod validation, headless <AutoForm> rendering, and machine-readable Schema.org PotentialAction graphs for AI agents.',
    fields: [
      { name: 'id', type: 'string', required: true, schemaOrgMapping: '@id', description: 'Unique identifier for the form (e.g. "contact-sales")' },
      { name: 'name / title', type: 'string', required: false, schemaOrgMapping: 'name', description: 'Display title for the form action' },
      { name: 'actionType', type: 'string', required: false, schemaOrgMapping: '@type', description: 'Schema.org Action type (e.g. "ContactAction", "SearchAction", "SubscribeAction")' },
      { name: 'endpoint', type: 'string', required: true, schemaOrgMapping: 'target.urlTemplate', description: 'HTTP API endpoint for form submission' },
      { name: 'method', type: 'POST | GET | PUT', required: false, schemaOrgMapping: 'target.httpMethod', description: 'HTTP method used to submit the payload' },
      { name: 'fields', type: 'FormField[]', required: true, schemaOrgMapping: 'object (PropertyValueSpecification)', description: 'Array of input fields with type, label, required, and validation rules' },
      { name: 'submitLabel', type: 'string', required: false, schemaOrgMapping: '—', description: 'Custom submit button display label' },
      { name: 'successMessage', type: 'string', required: false, schemaOrgMapping: '—', description: 'Success notification text shown upon successful submission' },
    ],
    sampleCode: `// data/site.schema.ts
import { defineSchema, formRegistry } from 'contextual-ui/server';

export const siteSchema = defineSchema({
  forms: formRegistry(),
});`,
    sampleData: `// Ingested connector data
forms: [
  {
    id: 'contact-sales',
    name: 'Contact Sales',
    actionType: 'ContactAction',
    endpoint: '/api/contact',
    method: 'POST',
    fields: [
      { name: 'name', type: 'text', label: 'Full Name', required: true },
      { name: 'email', type: 'email', label: 'Work Email', required: true },
      { name: 'message', type: 'textarea', label: 'Message', required: true },
    ],
    submitLabel: 'Send Inquiry',
  },
],`,
  },
];

function SchemaRegistriesSection() {
  const [selectedRegistryId, setSelectedRegistryId] = useState<string>('website');
  const [codeMode, setCodeMode] = useState<'schema' | 'data'>('schema');

  const selectedRegistry = REGISTRIES_DATA.find((r) => r.id === selectedRegistryId) || REGISTRIES_DATA[0];

  const fullSchemaExample = `import {
  defineSchema,
  organizationRegistry,
  websiteRegistry,
  webpageRegistry,
  navbarRegistry,
  footerRegistry,
  breadcrumbRegistry,
  faqRegistry,
} from 'contextual-ui/server';
import { z } from 'zod';

export const siteSchema = defineSchema({
  // Built-in Schema.org Registries
  organization: organizationRegistry(),
  website: websiteRegistry(),
  webpage: webpageRegistry(),
  navbar: navbarRegistry(),
  footer: footerRegistry(),
  breadcrumb: breadcrumbRegistry(),
  faq: faqRegistry(),
  forms: formRegistry(),

  // Custom Typed Zod Schema Extension
  announcement: {
    schema: z.object({
      enabled: z.boolean(),
      message: z.string().describe('Announcement Banner Text'),
      badge: z.string().optional(),
    }),
  },
});

// Automatically infer full TypeScript types with zero manual duplication:
export type SiteData = InferData<typeof siteSchema>;`;

  return (
    <section id="schemas" className="border-b border-base shadow-sm scroll-mt-28 pb-12 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-accent bg-accent/10 border border-accent/20 font-semibold">
            Single Source of Truth · Schema.org · Zod
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Schema Registries & defineSchema</h2>
        <p className="text-zinc-400 max-w-3xl text-sm leading-relaxed">
          <code className="code-short">defineSchema</code> allows you to compose pre-built, type-validated Schema.org registries and custom Zod schemas into a unified contract. Each registry automatically validates runtime data, generates compile-time TypeScript types, and compiles referentially linked Schema.org <code className="code-short">@graph</code> JSON-LD nodes.
        </p>
      </div>

      {/* Overview Code Snippet */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-2">
            <Boxes className="w-3.5 h-3.5 text-accent" />
            <span>Complete Schema Definition Example</span>
          </h3>
          <span className="text-[11px] font-mono text-zinc-500">data/site.schema.ts</span>
        </div>
        <CodeSnippet filename="data/site.schema.ts" code={fullSchemaExample} lang="typescript" />
      </div>

      {/* Registry Catalog */}
      <div className="space-y-4 pt-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <span>Built-in Registries Reference</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-normal">
              {REGISTRIES_DATA.length} Registries
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Select a registry below to inspect its Schema.org specification, field requirements, and usage examples.
          </p>
        </div>

        {/* Registry Selector Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-zinc-950/80 border border-base">
          {REGISTRIES_DATA.map((registry) => {
            const isSelected = registry.id === selectedRegistryId;
            return (
              <button
                key={registry.id}
                type="button"
                onClick={() => setSelectedRegistryId(registry.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-zinc-800 text-accent font-semibold shadow-sm border border-zinc-700/80'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <span>{registry.name}</span>
                <span className="text-[10px] text-zinc-500 bg-zinc-900 px-1.5 py-0.2 rounded border border-zinc-800">
                  {registry.schemaType}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Registry Detail Panel */}
        <div className="border border-base rounded-2xl p-6 bg-zinc-950/60 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h4 className="text-base font-bold font-mono text-accent">
                  {selectedRegistry.signature}
                </h4>
                <a
                  href={selectedRegistry.schemaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-accent bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 transition-colors"
                >
                  <span>schema.org/{selectedRegistry.schemaType}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
                {selectedRegistry.description}
              </p>
            </div>

            <div className="flex border border-base rounded-lg overflow-hidden shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setCodeMode('schema')}
                className={`px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer ${
                  codeMode === 'schema'
                    ? 'bg-zinc-800 text-accent font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                Schema Def
              </button>
              <button
                type="button"
                onClick={() => setCodeMode('data')}
                className={`px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer border-l border-base ${
                  codeMode === 'data'
                    ? 'bg-zinc-800 text-accent font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                Connector Data
              </button>
            </div>
          </div>

          {/* Code View */}
          <CodeSnippet
            filename={codeMode === 'schema' ? 'site.schema.ts' : 'connector.ts'}
            code={codeMode === 'schema' ? selectedRegistry.sampleCode : selectedRegistry.sampleData}
            lang="typescript"
          />

          {/* Schema Fields Contract */}
          <SchemaFieldsTable fields={selectedRegistry.fields} />
        </div>
      </div>

      {/* Custom Schema Extensibility Card */}
      <div className="border border-base rounded-2xl p-6 bg-zinc-950/60 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <h3 className="text-base font-bold text-zinc-100">Custom Schema Extensibility</h3>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
          You are not limited to built-in registries. Any standard Zod object can be attached under any key inside <code className="code-short">defineSchema</code> via <code className="code-short">{`{ schema: z.object({...}) }`}</code>. This custom data is automatically validated at runtime, typed via <code className="code-short">InferData&lt;typeof siteSchema&gt;</code>, and supported in CMS dashboards and form generators.
        </p>

        <CodeSnippet
          filename="data/site.schema.ts (Custom Schemas)"
          code={`// Extend with custom typed Zod schemas
export const siteSchema = defineSchema({
  website: websiteRegistry(),
  
  // Custom announcement banner
  announcement: {
    schema: z.object({
      enabled: z.boolean(),
      message: z.string().describe('Banner message text'),
      badge: z.string().optional(),
      link: z.string().url().optional(),
    }),
  },

  // Custom blog posts collection
  posts: {
    schema: z.array(
      z.object({
        slug: z.string(),
        title: z.string(),
        publishedAt: z.string(),
        author: z.string(),
      })
    ),
  },
});`}
          lang="typescript"
        />
      </div>
    </section>
  );
}

function AutoFormSection({ formsData }: { formsData?: any }) {
  const [autoFormResponse, setAutoFormResponse] = useState<Record<string, unknown> | null>(null);

  const fallbackForms = [
    {
      id: 'contact-sales',
      name: 'Contact Sales & Support',
      title: 'Get in Touch',
      description: 'Send our team a direct message. Submissions are dynamically validated and Agentic AI ready.',
      actionType: 'ContactAction',
      endpoint: '/api/contact',
      method: 'POST' as const,
      fields: [
        {
          name: 'name',
          type: 'text' as const,
          label: 'Full Name',
          required: true,
          placeholder: 'Jane Doe',
          validation: { minLength: 2 },
        },
        {
          name: 'email',
          type: 'email' as const,
          label: 'Work Email',
          required: true,
          placeholder: 'jane@company.com',
        },
        {
          name: 'topic',
          type: 'select' as const,
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
          type: 'textarea' as const,
          label: 'Message',
          required: true,
          placeholder: 'Tell us how we can help your team...',
          validation: { minLength: 10 },
        },
      ],
      submitLabel: 'Send Message',
      successMessage: 'Thank you! Your message has been received by our team.',
    },
  ];

  const activeFormsData = formsData || fallbackForms;

  const autoFormStep1Code = `// 1. data/site.schema.ts
import { defineSchema, formRegistry } from 'contextual-ui/server';

export const siteSchema = defineSchema({
  forms: formRegistry(), // Single Source of Truth for CMS forms
});`;

  const autoFormStep2Code = `// 2. data/site.server.ts (or ingested from Headless CMS connector)
forms: [
  {
    id: 'contact-sales',
    name: 'Contact Sales',
    title: 'Get in Touch',
    actionType: 'ContactAction',
    endpoint: '/api/contact',
    method: 'POST',
    fields: [
      { name: 'name', type: 'text', label: 'Full Name', required: true, validation: { minLength: 2 } },
      { name: 'email', type: 'email', label: 'Work Email', required: true },
      { 
        name: 'topic', 
        type: 'select', 
        label: 'Topic', 
        options: [
          { label: 'General Inquiry', value: 'general' },
          { label: 'Sales & Enterprise', value: 'sales' },
          { label: 'Technical Support', value: 'support' },
        ] 
      },
      { name: 'message', type: 'textarea', label: 'Message', required: true, validation: { minLength: 10 } },
    ],
    submitLabel: 'Send Message',
    successMessage: 'Thank you! Your message has been received.',
  },
]`;

  const autoFormStep3Code = `// 3. app/contact/page.tsx
import { AutoForm } from 'contextual-ui';
import { siteApp } from '@/data/site.server';

export default async function ContactPage() {
  const data = await siteApp.fetchData();

  return (
    <div className="max-w-md mx-auto py-10">
      {/* AutoForm builds dynamic Zod validation in-memory & renders inputs */}
      <AutoForm 
        data={data.forms} 
        formId="contact-sales"
        // Optional custom Tailwind component slots:
        components={{
          Input: (props) => (
            <input className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs" {...props} />
          ),
          Submit: ({ isSubmitting, children, ...props }) => (
            <button className="w-full py-2.5 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg text-xs" {...props}>
              {isSubmitting ? 'Sending...' : children}
            </button>
          ),
        }}
      />
    </div>
  );
}`;

  const autoFormStep4Code = `// 4. Automated Schema.org PotentialAction Graph for AI Agents
{
  "@context": "https://schema.org",
  "@type": "ContactAction",
  "@id": "https://example.com/#action:form-contact-sales",
  "name": "Contact Sales & Support",
  "isPartOf": { "@id": "https://example.com/#webpage" },
  "target": {
    "@type": "EntryPoint",
    "urlTemplate": "https://example.com/api/contact",
    "httpMethod": "POST",
    "contentType": "application/json"
  },
  "object": [
    {
      "@type": "PropertyValueSpecification",
      "valueName": "name",
      "valueRequired": true,
      "valueMinLength": 2
    },
    {
      "@type": "PropertyValueSpecification",
      "valueName": "email",
      "valueRequired": true,
      "valuePattern": "^.+@.+\\\\..+$"
    },
    {
      "@type": "PropertyValueSpecification",
      "valueName": "topic",
      "valueRequired": true,
      "valueOption": ["general", "sales", "support"]
    },
    {
      "@type": "PropertyValueSpecification",
      "valueName": "message",
      "valueRequired": true,
      "valueMinLength": 10
    }
  ]
}`;

  const autoFormPropsRef = [
    {
      name: 'data',
      type: 'FormData',
      required: 'Yes (or form)',
      description: 'Ingested forms data from connector/registry (single FormEntity or FormEntity[] array).',
    },
    {
      name: 'formId',
      type: 'string',
      required: 'Optional',
      description: 'Matches a specific form by its id when data contains multiple forms.',
    },
    {
      name: 'form',
      type: 'FormEntity',
      required: 'Optional',
      description: 'Explicit form entity object override (bypassing data lookup).',
    },
    {
      name: 'components',
      type: 'AutoFormCustomComponents',
      required: 'Optional',
      description: 'Custom UI slots for Form, Field, Label, Input, TextArea, Select, Checkbox, ErrorMessage, Submit, Section.',
    },
    {
      name: 'action',
      type: 'string',
      required: 'Optional',
      description: 'Overrides the form submit endpoint (defaults to form.endpoint).',
    },
    {
      name: 'method',
      type: "'POST' | 'GET' | 'PUT' | 'PATCH'",
      required: 'Optional',
      description: 'Overrides HTTP method (defaults to form.method or "POST").',
    },
    {
      name: 'onSubmit',
      type: '(values, form) => void | Promise<void>',
      required: 'Optional',
      description: 'Custom submit handler. If omitted, AutoForm performs a JSON POST fetch to the endpoint automatically.',
    },
    {
      name: 'onSuccess',
      type: '(result) => void',
      required: 'Optional',
      description: 'Callback invoked after successful form submission.',
    },
    {
      name: 'onError',
      type: '(error: ZodError) => void',
      required: 'Optional',
      description: 'Callback invoked when client-side validation fails.',
    },
    {
      name: 'submitLabel',
      type: 'string',
      required: 'Optional',
      description: 'Overrides the submit button text (defaults to form.submitLabel or "Submit").',
    },
  ];

  const autoFormCustomSlots = {
    Field: ({ children, className }: any) => (
      <div className={`space-y-1 ${className || ''}`}>{children}</div>
    ),
    Label: ({ htmlFor, children }: any) => (
      <label htmlFor={htmlFor} className="block text-xs font-mono text-zinc-300">
        {children}
      </label>
    ),
    Input: ({ field, dataInvalid, ...props }: any) => (
      <input
        {...props}
        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-xs"
      />
    ),
    TextArea: ({ field, dataInvalid, ...props }: any) => (
      <textarea
        rows={3}
        {...props}
        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-xs"
      />
    ),
    Select: ({ field, options, dataInvalid, children, ...props }: any) => (
      <select
        {...props}
        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-xs cursor-pointer"
      >
        {children}
      </select>
    ),
    ErrorMessage: ({ error }: any) => (
      <span className="text-rose-400 text-[11px] font-mono mt-1 block">{error}</span>
    ),
    Submit: ({ isSubmitting, children, ...props }: any) => (
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium rounded-lg transition-colors text-xs font-mono cursor-pointer flex items-center justify-center gap-2"
        {...props}
      >
        {isSubmitting ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Submitting to /api/contact...</span>
          </>
        ) : (
          <span>{children}</span>
        )}
      </button>
    ),
    Section: ({ title, description, children }: any) => (
      <div className="space-y-4">
        {(title || description) && (
          <div className="space-y-1 mb-2">
            {title && <h4 className="text-sm font-semibold text-zinc-100">{title}</h4>}
            {description && <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>}
          </div>
        )}
        <div className="space-y-3">{children}</div>
      </div>
    ),
  };

  return (
    <section id="auto-form" className="border-b border-base shadow-sm scroll-mt-28 pb-12 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-accent bg-accent/10 border border-accent/20 font-semibold">
            CMS-Driven · In-Memory Zod · Agentic AI PotentialAction
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">AutoForm &amp; formRegistry</h2>
        <p className="text-zinc-400 max-w-3xl text-sm leading-relaxed">
          <code className="code-short">&lt;AutoForm&gt;</code> unifies Headless CMS form definitions, dynamic in-memory Zod validation, and machine-readable Schema.org <code className="code-short">PotentialAction</code> JSON-LD graphs for AI agents. Define your form structure in your CMS or connector, and render dynamic accessible UI without writing repetitive React field boilerplate.
        </p>
      </div>

      {/* Step Flow Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[11px] flex items-center justify-center font-bold shrink-0">1</span>
          <span className="text-xs text-zinc-300 font-medium">formRegistry SSOT</span>
        </div>
        <div className="p-3 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[11px] flex items-center justify-center font-bold shrink-0">2</span>
          <span className="text-xs text-zinc-300 font-medium">CMS Ingestion</span>
        </div>
        <div className="p-3 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[11px] flex items-center justify-center font-bold shrink-0">3</span>
          <span className="text-xs text-zinc-300 font-medium">&lt;AutoForm&gt; Render</span>
        </div>
        <div className="p-3 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[11px] flex items-center justify-center font-bold shrink-0">4</span>
          <span className="text-xs text-zinc-300 font-medium">AI PotentialAction</span>
        </div>
      </div>

      {/* Step-by-Step Walkthrough */}
      <div className="space-y-10">
        {/* Step 1 */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Declare formRegistry in your Site Schema</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Add <code className="code-short">forms: formRegistry()</code> inside <code className="code-short">defineSchema</code>. This sets up the runtime validation contract and links form entities into the single source of truth.
              </p>
            </div>
          </div>
          <div className="pl-9">
            <CodeSnippet filename="data/site.schema.ts" code={autoFormStep1Code} lang="typescript" />
          </div>
        </div>

        {/* Step 2 */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Define Forms in Connector / Headless CMS Data</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Marketing teams or developers can define forms as JSON arrays in Sanity, Strapi, or static configs. Define endpoints, field types, labels, and validation rules without touching React JSX.
              </p>
            </div>
          </div>
          <div className="pl-9">
            <CodeSnippet filename="data/site.server.ts (CMS Connector)" code={autoFormStep2Code} lang="typescript" />
          </div>
        </div>

        {/* Step 3 */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Render Dynamic Headless Forms with &lt;AutoForm&gt;</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Pass the connector forms payload to <code className="code-short">&lt;AutoForm data=&#123;data.forms&#125; formId="contact-sales" /&gt;</code>. AutoForm dynamically compiles an in-memory Zod schema for blur &amp; submit validation and renders the form fields. Custom UI slots can be passed via the <code className="code-short">components</code> prop.
              </p>
            </div>
          </div>
          <div className="pl-9">
            <CodeSnippet filename="app/contact/page.tsx" code={autoFormStep3Code} lang="tsx" />
          </div>
        </div>

        {/* Step 4 */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">4</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-zinc-100">Automated Schema.org PotentialAction Graph for AI Agents</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-accent bg-accent/10 border border-accent/20">
                  Agentic AI Spec
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                The JSON-LD graph builder automatically maps the form entity to a Schema.org <code className="code-short">PotentialAction</code> (e.g. <code className="code-short">ContactAction</code>) with <code className="code-short">EntryPoint</code> and <code className="code-short">PropertyValueSpecification</code> fields. AI agents (Claude, Perplexity, OpenAI agents) can discover the API contract and interact programmatically without DOM clicking.
              </p>
            </div>
          </div>
          <div className="pl-9">
            <CodeSnippet filename="Generated JSON-LD (@graph snippet)" code={autoFormStep4Code} lang="json" />
          </div>
        </div>
      </div>

      {/* Interactive Live AutoForm Playground */}
      <div className="space-y-4 pt-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <span>Interactive Live Demo (&lt;AutoForm&gt;)</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-normal">
              Live Preview · Real Endpoint (/api/contact)
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            The form below is generated directly from the starter kit&apos;s <code className="code-short">data.forms</code> connector registry. Fill it out and submit to test real validation and the API POST handler.
          </p>
        </div>

        <div className="p-6 bg-zinc-950/60 rounded-2xl border border-base backdrop-blur-sm relative overflow-hidden shadow-sm">
          <div className="max-w-md mx-auto">
            <AutoForm
              data={activeFormsData}
              formId="contact-sales"
              components={autoFormCustomSlots}
              onSuccess={(res) => {
                setAutoFormResponse(res);
              }}
            />

            {autoFormResponse && (
              <div className="mt-6 pt-6 border-t border-zinc-800/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono text-emerald-400 font-medium">
                      Response from /api/contact Received!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoFormResponse(null)}
                    className="text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
                <div className="p-3 bg-zinc-900/90 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto">
                  <pre>{JSON.stringify(autoFormResponse, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AutoForm Props Reference Table */}
      <div className="space-y-4 pt-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <span>&lt;AutoForm&gt; Props Reference</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-normal">
              {autoFormPropsRef.length} Props
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Complete props contract for configuring dynamic forms, custom slot overrides, and submission callbacks.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-base bg-zinc-950/70 shadow-inner">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-base bg-zinc-900/80 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3.5 font-semibold">Prop</th>
                <th className="py-2.5 px-3.5 font-semibold">Type</th>
                <th className="py-2.5 px-3.5 font-semibold">Requirement</th>
                <th className="py-2.5 px-3.5 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-mono">
              {autoFormPropsRef.map((prop) => (
                <tr key={prop.name} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-2.5 px-3.5 font-semibold text-accent whitespace-nowrap text-xs">
                    {prop.name}
                  </td>
                  <td className="py-2.5 px-3.5 whitespace-nowrap">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                      {prop.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 whitespace-nowrap text-[11px] text-zinc-400">
                    {prop.required}
                  </td>
                  <td className="py-2.5 px-3.5 font-sans text-zinc-300 text-xs min-w-[260px] leading-relaxed">
                    {prop.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Pillars Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <div className="p-4 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent shrink-0">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <span className="text-zinc-200 text-xs font-mono font-semibold block mb-1">CMS-Driven &amp; Zero Deployments</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Add or modify form fields in your Headless CMS. Forms update dynamically in the UI and server validation without code changes.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="text-zinc-200 text-xs font-mono font-semibold block mb-1">Agentic AI Ready</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Emits Schema.org <code className="code-short">PotentialAction</code> JSON-LD letting AI agents (Claude, Perplexity) interact with forms via API.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-zinc-200 text-xs font-mono font-semibold block mb-1">Dynamic In-Memory Zod</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Compiles strict Zod validators on the fly, providing instant blur feedback and safe schema parsing on submit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CreateFormSection() {
  const [submittedData, setSubmittedData] = useState<Record<string, unknown> | null>(null);
  const [isSubmittingStatic, setIsSubmittingStatic] = useState(false);

  const staticStep1Code = `import { z } from 'zod';

// 1. Define your static Zod validation schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;`;

  const staticStep2Code = `import { createForm } from 'contextual-ui';
import { contactSchema } from '@/schemas/contact';

// 2. Instantiate type-safe compound form components
export const ContactForm = createForm(contactSchema);`;

  const staticStep3Code = `import { ContactForm } from '@/components/ContactForm';

export function ContactFormCard() {
  return (
    <ContactForm.Root
      onSubmit={async (data) => {
        // data is strictly typed: { name: string; email: string; message: string }
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }}
      className="space-y-4 max-w-md mx-auto"
    >
      <ContactForm.Field name="name" className="space-y-1.5">
        <ContactForm.Label className="block text-xs font-mono text-zinc-300">Full Name</ContactForm.Label>
        <ContactForm.Input placeholder="Jane Doe" className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white" />
        <ContactForm.ErrorMessage className="text-rose-400 text-xs font-mono block" />
      </ContactForm.Field>

      <ContactForm.Field name="email" className="space-y-1.5">
        <ContactForm.Label className="block text-xs font-mono text-zinc-300">Email</ContactForm.Label>
        <ContactForm.Input type="email" placeholder="jane@example.com" className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white" />
        <ContactForm.ErrorMessage className="text-rose-400 text-xs font-mono block" />
      </ContactForm.Field>

      <ContactForm.Field name="message" className="space-y-1.5">
        <ContactForm.Label className="block text-xs font-mono text-zinc-300">Message</ContactForm.Label>
        <ContactForm.TextArea rows={3} placeholder="How can we help?" className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white" />
        <ContactForm.ErrorMessage className="text-rose-400 text-xs font-mono block" />
      </ContactForm.Field>

      <ContactForm.Submit className="w-full py-2.5 bg-accent text-white font-medium rounded-lg">
        Send Message
      </ContactForm.Submit>
    </ContactForm.Root>
  );
}`;

  const staticStep4Code = `// Automatic blur & submit validation lifecycle
<ContactForm.Root
  onSubmit={async (data) => {
    // 1. safeParse passes -> data is typed & sanitized
    // 2. isSubmitting state automatically activates
    const res = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Submission failed');
  }}
  onError={(error) => {
    console.warn('Validation errors:', error.flatten().fieldErrors);
  }}
>
  {/* Field components */}
</ContactForm.Root>`;

  const formSubcomponents = [
    {
      name: 'Form.Root',
      props: 'onSubmit, onError?, className?, id?',
      description: 'Top-level context provider for static forms. Manages state, errors, blur validation, and async lifecycle.',
    },
    {
      name: 'Form.Field',
      props: 'name: keyof Schema, className?',
      description: 'Scopes field context by name. Strictly type-checked against schema keys at compile time.',
    },
    {
      name: 'Form.Label',
      props: 'asChild?, className?, style?',
      description: 'Accessible <label> automatically bound to the input through the field htmlFor attribute.',
    },
    {
      name: 'Form.Input',
      props: 'asChild?, ...InputHTMLAttributes',
      description: 'Controlled input element bound to field value, onChange, onBlur validation, and data-invalid attribute.',
    },
    {
      name: 'Form.TextArea',
      props: 'asChild?, ...TextareaHTMLAttributes',
      description: 'Controlled multi-line textarea with automatic onBlur validation and data-invalid attribute binding.',
    },
    {
      name: 'Form.ErrorMessage',
      props: 'asChild?, className?, style?',
      description: 'Conditionally renders active validation error strings for the scoped field.',
    },
    {
      name: 'Form.Submit',
      props: 'asChild?, ...ButtonHTMLAttributes',
      description: 'Submit button automatically disabled while an async onSubmit promise is pending.',
    },
    {
      name: 'Form.Section',
      props: 'title?, description?, asChild?, className?',
      description: 'Semantic container for grouping related fields with an optional title and description header.',
    },
  ];

  return (
    <section id="create-form" className="border-b border-base shadow-sm scroll-mt-28 pb-12 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-accent bg-accent/10 border border-accent/20 font-semibold">
            Compile-Time Type Safety · Headless Compound Components
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">createForm (Static Form Factory)</h2>
        <p className="text-zinc-400 max-w-3xl text-sm leading-relaxed">
          The <code className="code-short">createForm</code> factory generates headless, strictly type-safe React form components directly from a hardcoded Zod schema. Ideal for developer-centric custom forms with fixed field requirements, providing automatic blur validation, field name autocompletion, and zero-state boilerplate.
        </p>
      </div>

      {/* Step Flow Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[11px] flex items-center justify-center font-bold shrink-0">1</span>
          <span className="text-xs text-zinc-300 font-medium">Define Schema</span>
        </div>
        <div className="p-3 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[11px] flex items-center justify-center font-bold shrink-0">2</span>
          <span className="text-xs text-zinc-300 font-medium">Call createForm</span>
        </div>
        <div className="p-3 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[11px] flex items-center justify-center font-bold shrink-0">3</span>
          <span className="text-xs text-zinc-300 font-medium">Compose Fields</span>
        </div>
        <div className="p-3 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[11px] flex items-center justify-center font-bold shrink-0">4</span>
          <span className="text-xs text-zinc-300 font-medium">Handle Submit</span>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-10">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Define your Validation Schema with Zod</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Define the shape and validation constraints using standard Zod types (<code className="code-short">z.string()</code>, <code className="code-short">z.number()</code>, <code className="code-short">z.enum()</code>).
              </p>
            </div>
          </div>
          <div className="pl-9">
            <CodeSnippet filename="schemas/contact.ts" code={staticStep1Code} lang="typescript" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Initialize Form Components with createForm</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Pass your schema into <code className="code-short">createForm(schema)</code> to produce compound components strictly typed to your schema keys.
              </p>
            </div>
          </div>
          <div className="pl-9">
            <CodeSnippet filename="components/ContactForm.tsx (Init)" code={staticStep2Code} lang="typescript" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Compose Headless Form Layout &amp; Field Controls</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Wrap input controls in <code className="code-short">&lt;ContactForm.Field name="..."&gt;</code>. Child components share context and validation automatically.
              </p>
            </div>
          </div>
          <div className="pl-9">
            <CodeSnippet filename="components/ContactForm.tsx (UI)" code={staticStep3Code} lang="tsx" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">4</span>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Automatic Blur Validation &amp; Submit Lifecycle</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Validation runs on field blur and on form submit. Submitting state is automatically managed during async promises.
              </p>
            </div>
          </div>
          <div className="pl-9">
            <CodeSnippet filename="components/ContactForm.tsx (Lifecycle)" code={staticStep4Code} lang="tsx" />
          </div>
        </div>
      </div>

      {/* Static Live Demo */}
      <div className="space-y-4 pt-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <span>Static Form Live Demo</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-normal">
              Live Preview
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Test the static compound form below. Blur fields to test validation feedback.
          </p>
        </div>

        <div className="p-6 bg-zinc-950/60 rounded-2xl border border-base backdrop-blur-sm relative overflow-hidden shadow-sm">
          <ContactForm.Root 
            onSubmit={async (data) => {
              setIsSubmittingStatic(true);
              await new Promise((resolve) => setTimeout(resolve, 400));
              setSubmittedData(data);
              setIsSubmittingStatic(false);
            }}
            className="space-y-4 max-w-md mx-auto relative z-10"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <ContactForm.Field name="name" className="flex-1 space-y-1">
                <ContactForm.Label className="block text-xs font-mono text-zinc-300">Full Name</ContactForm.Label>
                <ContactForm.Input
                  placeholder="Jane Doe"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent text-xs"
                />
                <ContactForm.ErrorMessage className="text-rose-400 text-[11px] font-mono mt-1 block" />
              </ContactForm.Field>

              <ContactForm.Field name="email" className="flex-1 space-y-1">
                <ContactForm.Label className="block text-xs font-mono text-zinc-300">Email Address</ContactForm.Label>
                <ContactForm.Input
                  type="email"
                  placeholder="jane@example.com"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent text-xs"
                />
                <ContactForm.ErrorMessage className="text-rose-400 text-[11px] font-mono mt-1 block" />
              </ContactForm.Field>
            </div>

            <ContactForm.Field name="message" className="space-y-1">
              <ContactForm.Label className="block text-xs font-mono text-zinc-300">Message</ContactForm.Label>
              <ContactForm.TextArea
                rows={3}
                placeholder="Type message here (min 10 chars)..."
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent text-xs"
              />
              <ContactForm.ErrorMessage className="text-rose-400 text-[11px] font-mono mt-1 block" />
            </ContactForm.Field>

            <ContactForm.Submit className="w-full py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium rounded-lg transition-colors text-xs font-mono cursor-pointer flex items-center justify-center gap-2">
              {isSubmittingStatic ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Send Message</span>
              )}
            </ContactForm.Submit>
          </ContactForm.Root>

          {submittedData && (
            <div className="mt-6 pt-6 border-t border-zinc-800/80 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono text-emerald-400 font-medium">Static Form Submitted!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmittedData(null)}
                  className="text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
              <div className="p-3 bg-zinc-900/90 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto">
                <pre>{JSON.stringify(submittedData, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subcomponents Reference */}
      <div className="space-y-4 pt-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <span>createForm Compound Subcomponents Reference</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-normal">
              {formSubcomponents.length} Subcomponents
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Every component produced by <code className="code-short">createForm</code> is completely headless and composable with Radix UI Slot (<code className="code-short">asChild</code>) support.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-base bg-zinc-950/70 shadow-inner">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-base bg-zinc-900/80 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3.5 font-semibold">Subcomponent</th>
                <th className="py-2.5 px-3.5 font-semibold">Props / Context</th>
                <th className="py-2.5 px-3.5 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-mono">
              {formSubcomponents.map((sub) => (
                <tr key={sub.name} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-2.5 px-3.5 font-semibold text-accent whitespace-nowrap text-xs font-mono">
                    {sub.name}
                  </td>
                  <td className="py-2.5 px-3.5 whitespace-nowrap font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                      {sub.props}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 font-sans text-zinc-300 text-xs min-w-[260px] leading-relaxed">
                    {sub.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Pillars Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <div className="p-4 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-zinc-200 text-xs font-mono font-semibold block mb-1">End-to-End Type Safety</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Field names on <code className="code-short">Form.Field</code> and submit payloads are strictly checked against your Zod schema at compile-time.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent shrink-0">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <span className="text-zinc-200 text-xs font-mono font-semibold block mb-1">Blur &amp; Submit Validation</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Provides instant feedback on blur without custom state management, then performs full schema parsing upon form submission.
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-zinc-200 text-xs font-mono font-semibold block mb-1">Headless &amp; Radix Slots</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Bring your own CSS classes or use <code className="code-short">asChild</code> to delegate rendering to Radix UI or Shadcn UI primitives.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ConnectorsSection() {
  const [activeTab, setActiveTab] = useState<'static' | 'cms' | 'database'>('static');

  const staticCode = `import { staticConnector } from 'contextual-ui-connector-static';
import { createContextualApp } from 'contextual-ui/server';
import { siteSchema } from './site.schema';

// 1. Static Configuration Connector (Built-in)
const connector = staticConnector({
  website: {
    name: 'Contextual UI Starter Kit',
    url: 'https://contextual.site',
    description: 'A headless UI and semantic SEO Knowledge Graph starter kit.',
  },
  navbar: {
    brand: { name: 'Contextual UI', href: '/' },
    links: [
      { id: '1', label: 'Home', href: '/' },
      { id: '2', label: 'Docs', href: '/docs' },
    ],
  },
  faq: [
    { id: '1', question: 'What is Contextual UI?', answer: 'A headless UI + SEO Knowledge Graph library.' },
  ],
});

export const siteApp = createContextualApp({
  schema: siteSchema,
  connector,
  baseUrl: 'https://contextual.site',
});`;

  const cmsCode = `import { createContextualApp } from 'contextual-ui/server';
import { siteSchema } from './site.schema';
import { createClient } from 'next-sanity';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: false,
});

// 2. Custom Headless CMS Connector (Sanity, Strapi, Contentful)
export function sanityConnector(client: typeof sanityClient) {
  return {
    async fetchData() {
      // Fetch site settings and navigation from Sanity CMS
      const rawData = await client.fetch(\`*[_type == "siteSettings"][0]{
        website,
        navbar,
        footer,
        faq
      }\`);
      return rawData;
    },
  };
}

// Zero UI rewrites: swap connector in 1 line
export const siteApp = createContextualApp({
  schema: siteSchema,
  connector: sanityConnector(sanityClient),
  baseUrl: 'https://contextual.site',
});`;

  const databaseCode = `import { createContextualApp } from 'contextual-ui/server';
import { siteSchema } from './site.schema';
import { prisma } from '@/lib/prisma';

// 3. Custom Database / ORM Connector (Prisma, Drizzle, Supabase)
export function prismaConnector(db: typeof prisma) {
  return {
    async fetchData() {
      const siteConfig = await db.siteConfig.findFirst({
        include: {
          navLinks: true,
          faqItems: true,
        },
      });

      return {
        website: { name: siteConfig?.name, url: siteConfig?.url },
        navbar: { links: siteConfig?.navLinks },
        faq: siteConfig?.faqItems,
      };
    },
  };
}

export const siteApp = createContextualApp({
  schema: siteSchema,
  connector: prismaConnector(prisma),
  baseUrl: 'https://contextual.site',
});`;

  return (
    <section id="connectors" className="border-b border-base shadow-sm scroll-mt-28 pb-12">
      <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
        <span>Connectors & Data Layer</span>
      </h2>
      <p className="mb-6 text-sm leading-relaxed text-zinc-300">
        Connectors decouple your data sources (Static JSON, Headless CMS, Database ORMs, or REST APIs) from your React UI components and SEO knowledge graphs. Any source that fulfills the simple <code className="code-short">{`{ fetchData: () => Promise<T> }`}</code> contract can be plugged into <code className="code-short">createContextualApp</code>.
      </p>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="p-3.5 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent shrink-0">
            <Plug className="w-4 h-4" />
          </div>
          <div>
            <span className="text-zinc-200 text-xs font-mono font-semibold block mb-0.5">1. Decoupled Ingestion</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Write a 5-line connector function to load data from any headless CMS, database, or API.
            </p>
          </div>
        </div>
        <div className="p-3.5 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-zinc-200 text-xs font-mono font-semibold block mb-0.5">2. Runtime Hydration</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Raw connector payloads are verified and typed through your Zod schema at runtime.
            </p>
          </div>
        </div>
        <div className="p-3.5 rounded-xl border border-base bg-zinc-950/60 shadow-sm flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent shrink-0">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <span className="text-zinc-200 text-xs font-mono font-semibold block mb-0.5">3. Zero UI Rewrites</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Switch from static files to a live CMS without modifying any React components or SEO schemas.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-start items-start pb-2 mb-2 gap-4">
        <div className="flex ml-auto border border-base rounded-md overflow-hidden">
          <button
            onClick={() => setActiveTab('static')}
            className={`py-1.5 px-3 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'static'
                ? 'bg-zinc-800 text-accent'
                : ' hover:bg-zinc-900 text-zinc-400'
            }`}
            type="button"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Static Config</span>
          </button>
          <button
            onClick={() => setActiveTab('cms')}
            className={`py-1.5 px-3 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 border-l border-base ${
              activeTab === 'cms'
                ? 'bg-zinc-800 text-accent'
                : ' hover:bg-zinc-900 text-zinc-400'
            }`}
            type="button"
          >
            <Server className="w-3.5 h-3.5" />
            <span>Headless CMS</span>
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`py-1.5 px-3 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 border-l border-base ${
              activeTab === 'database'
                ? 'bg-zinc-800 text-accent'
                : ' hover:bg-zinc-900 text-zinc-400'
            }`}
            type="button"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database / ORM</span>
          </button>
        </div>
        <span className="text-sm text-zinc-400 font-medium">
          {activeTab === 'static' && 'Built-in static connector for hardcoded configs or JSON files.'}
          {activeTab === 'cms' && 'Custom connector fetching site configuration from a Headless CMS (Sanity / Strapi / Contentful).'}
          {activeTab === 'database' && 'Custom connector loading schema data from PostgreSQL/MySQL via Prisma or Drizzle ORM.'}
        </span>
      </div>

      <pre
        tabIndex={0}
        suppressHydrationWarning
        className="!bg-zinc-900 !text-zinc-100 p-6 !rounded-xl text-xs font-mono overflow-x-auto border border-base shadow-inner"
      >
        <code
          className="language-typescript"
          dangerouslySetInnerHTML={{
            __html: highlightCode(
              activeTab === 'static' ? staticCode : activeTab === 'cms' ? cmsCode : databaseCode,
              'typescript'
            ),
          }}
        />
      </pre>
    </section>
  );
}

function ShowcaseSection({
  id,
  title,
  description,
  children,
  controls,
  fields,
  codeString,
  schemaString,
  exampleDescription,
  schemaDescription,
}: {
  id: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  controls?: React.ReactNode;
  fields?: SchemaField[];
  codeString: string;
  schemaString: string;
  exampleDescription: string;
  schemaDescription: string;
}) {
  const [activeTab, setActiveTab] = useState<'example' | 'schema'>('example');
  const currentCode = activeTab === 'example' ? codeString : schemaString;
  const currentLang = activeTab === 'example' ? 'jsx' : 'json';

  return (
    <section id={id} className="border-b border-base shadow-sm scroll-mt-28 pb-12">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <p className="mb-6 text-sm leading-relaxed text-zinc-300">{description}</p>

      {children && (
        <div className="border border-base rounded-xl p-4 shadow-inner mb-6">
          {children}
        </div>
      )}

      {controls}

      <div className="flex flex-col justify-start items-start pb-2 mb-2 gap-4">
        <div className="flex ml-auto border border-base rounded-md overflow-hidden">
          <button
            onClick={() => setActiveTab('example')}
            className={`py-1.5 px-3 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'example'
                ? 'bg-zinc-800 text-accent'
                : ' hover:bg-zinc-900 text-zinc-400'
            }`}
            type="button"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Example Code</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`py-1.5 px-3 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 border-l border-base ${
              activeTab === 'schema'
                ? 'bg-zinc-800 text-accent'
                : ' hover:bg-zinc-900 text-zinc-400'
            }`}
            type="button"
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>JSONLD</span>
          </button>
        </div>
        <span className="text-sm text-zinc-400 font-medium">
          {activeTab === 'example' ? exampleDescription : schemaDescription}
        </span>
      </div>

      <pre
        tabIndex={0}
        suppressHydrationWarning
        className="!bg-zinc-900 !text-zinc-100 p-6 !rounded-xl text-xs font-mono overflow-x-auto border border-base shadow-inner"
      >
        <code
          className={`language-${currentLang}`}
          dangerouslySetInnerHTML={{
            __html: highlightCode(currentCode, currentLang),
          }}
        />
      </pre>

      {fields && fields.length > 0 && <SchemaFieldsTable fields={fields} />}
    </section>
  );
}

export function DocsClient({ data }: { data: SiteData }) {
  const [activeId, setActiveId] = useState<string>('quickstart');

  // Interactive Dynamic State: Navbar
  const initialNavbar = {
    brand: {
      name: data.navbar?.brand?.name || 'Contextual UI',
      href: data.navbar?.brand?.href || '/',
      logo: data.navbar?.brand?.logo || '/images/onigiri_logo.svg',
    },
    links: data.navbar?.links && data.navbar.links.length > 0
      ? data.navbar.links
      : [
          { id: '1', label: 'Home', href: '/' },
          { id: '2', label: 'Docs', href: '/docs' },
          { id: '3', label: 'Schema Graph', href: '/schema' },
        ],
  };
  const [navbarData, setNavbarData] = useState(initialNavbar);

  // Interactive Dynamic State: Footer
  const initialFooter = {
    brand: {
      name: data.footer?.brand?.name || 'Contextual UI',
      logo: '/images/onigiri_logo.svg',
      href: data.footer?.brand?.href || '/',
      description: data.footer?.brand?.description || 'Headless UI components with built-in Agentic AI infrastructure and Schema.org SEO.',
    },
    columns: [
      {
        id: 'resources',
        title: 'Resources',
        links: [
          { id: 'c1', label: 'Docs', href: '/docs' },
          { id: 'c2', label: 'Schema Graph', href: '/schema' },
          { id: 'c3', label: '/api/graph.json ↗', href: '/api/graph.json', external: true },
        ],
      },
      {
        id: 'ecosystem',
        title: 'Ecosystem',
        links: [
          { id: 'c4', label: 'Core Package', href: 'https://github.com/tasuku-io', external: true },
          { id: 'c5', label: 'Static Connector', href: 'https://github.com/tasuku-io', external: true },
          { id: 'c6', label: 'Dashboard CMS', href: 'https://github.com/tasuku-io', external: true },
        ],
      },
    ],
    links: data.footer?.links || [
      { id: '1', label: 'Docs', href: '/docs' },
      { id: '2', label: 'Schema Graph', href: '/schema' },
      { id: '3', label: '/api/graph.json ↗', href: '/api/graph.json', external: true },
    ],
    legalLinks: [
      { id: 'l1', label: 'Privacy Policy', href: '/privacy' },
      { id: 'l2', label: 'Terms of Service', href: '/terms' },
      { id: 'l3', label: 'MIT License', href: 'https://opensource.org/licenses/MIT', external: true },
    ],
    socials: [
      { id: 's1', platform: 'GitHub', href: 'https://github.com/tasuku-io', label: 'GitHub' },
      { id: 's2', platform: 'Twitter', href: 'https://twitter.com/tasuku_io', label: 'Twitter / X' },
      { id: 's3', platform: 'Discord', href: 'https://discord.gg', label: 'Discord' },
    ],
    copyright: {
      holder: data.footer?.copyright?.holder || 'Tasuku Studio',
      year: data.footer?.copyright?.year || new Date().getFullYear(),
      text: 'Maintained by Tasuku Studio. Open-source under MIT license.',
    },
  };
  const [footerData, setFooterData] = useState(initialFooter);

  // Interactive Dynamic State: Breadcrumb
  const initialBreadcrumb = [
    { id: '1', label: 'Home', url: '/' },
    { id: '2', label: 'Docs', url: '/docs' },
    { id: '3', label: 'Showcase', url: '/docs#showcase' },
  ];
  const [breadcrumbList, setBreadcrumbList] = useState(initialBreadcrumb);
  const [baseUrl, setBaseUrl] = useState('https://contextual.site');

  // Interactive Dynamic State: FAQ
  const initialFaq = [
    { id: '1', question: 'What kind of bear is best?', answer: 'Black bear.' },
    { id: '2', question: 'What do bears eat?', answer: 'Beets.' },
    { id: '3', question: 'Is identity theft a joke?', answer: "It's not. Millions of families suffer every year!" }
  ];
  const [faqList, setFaqList] = useState(initialFaq);

  const quickstartNavItems = [
    { id: 'quickstart', label: 'Quickstart', desc: 'Next.js Integration Guide' },
    { id: 'schemas', label: 'Schema Registries', desc: 'Pre-built Schema.org Registries' },
  ];

  const componentNavItems = [
    { id: 'contextual-site', label: 'ContextualSite', desc: 'Site Provider & SPA Graph' },
    { id: 'webpage', label: 'WebPage', desc: 'Route Metadata & JSON-LD' },
    { id: 'navbar', label: 'Navbar', desc: 'Navigation Bar' },
    { id: 'footer', label: 'Footer', desc: 'Footer & Attribution' },
    { id: 'breadcrumb', label: 'Breadcrumb', desc: 'Breadcrumb Trail' },
    { id: 'faq', label: 'FAQ', desc: 'FAQ & Accordion' },
  ];

  const formNavItems = [
    { id: 'auto-form', label: 'AutoForm', desc: 'CMS & Agentic Forms' },
    { id: 'create-form', label: 'createForm', desc: 'Type-safe Static Forms' },
  ];

  const connectorNavItems = [
    { id: 'connectors', label: 'Connectors', desc: 'Data Ingestion & Adapters' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-120px 0px -50% 0px' }
    );

    const sections = [
      'quickstart',
      'schemas',
      'contextual-site',
      'webpage',
      'navbar',
      'footer',
      'breadcrumb',
      'faq',
      'auto-form',
      'create-form',
      'connectors',
    ];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // ---------------------------------------------------------------------------
  // ContextualSite Code & Schema
  // ---------------------------------------------------------------------------
  const contextualSiteCode = `import { siteApp } from '@/data/site.server';
import { ContextualSite, Navbar, Faq, Footer } from 'contextual-ui';

// 1. Multi-Page Next.js (App Router)
// In layout.tsx: distributes data down to all pages
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const data = await siteApp.fetchData();
  return (
    <html lang="en">
      <body>
        <ContextualSite data={data}>
          {children}
        </ContextualSite>
      </body>
    </html>
  );
}

// 2. Single Page Applications (SPAs / Landing Pages)
// In App.tsx: automatically compiles and injects the unified Schema.org JSON-LD graph
export function SinglePageApp() {
  return (
    <ContextualSite schema={siteSchema} data={siteData}>
      <Navbar.Root />
      <main>
        <Faq.Root />
      </main>
      <Footer.Root />
    </ContextualSite>
  );
}`;

  const contextualSiteSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://contextual.site/#website",
        "name": data.website?.name || "Contextual UI Starter Kit",
        "url": "https://contextual.site",
        "description": data.website?.description || "A headless UI and semantic SEO Knowledge Graph starter kit."
      },
      {
        "@type": "WebPage",
        "@id": "https://contextual.site/#webpage",
        "name": "Home",
        "url": "https://contextual.site/",
        "isPartOf": { "@id": "https://contextual.site/#website" },
        "hasPart": [
          { "@id": "https://contextual.site/#navbar" },
          { "@id": "https://contextual.site/#faq" },
          { "@id": "https://contextual.site/#footer" }
        ]
      },
      {
        "@type": "SiteNavigationElement",
        "@id": "https://contextual.site/#navbar",
        "name": "Navigation Bar",
        "isPartOf": { "@id": "https://contextual.site/#webpage" },
      },
      {
        "@type": "FAQPage",
        "@id": "https://contextual.site/#faq",
        "isPartOf": { "@id": "https://contextual.site/#webpage" },
        "mainEntity": (data.faq || []).map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      }
    ]
  }, null, 2);

  const webpageCode = `import { siteApp } from '@/data/site.server';
import { WebPage } from 'contextual-ui/server';
import { DocsClient } from './DocsClient';

export default async function DocsPage() {
  const data = await siteApp.fetchData();

  return (
    <WebPage app={siteApp} id="docs">
      <DocsClient data={data} />
    </WebPage>
  );
}`;

  const webpageSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://contextual.site/#website",
        "name": "Contextual UI Starter Kit",
        "url": "https://contextual.site"
      },
      {
        "@type": "WebPage",
        "@id": "https://contextual.site/#webpage",
        "name": "Documentation - Contextual UI",
        "url": "https://contextual.site/docs",
        "description": "Learn how to use Contextual UI.",
        "isPartOf": { "@id": "https://contextual.site/#website" },
        "hasPart": [
          { "@id": "https://contextual.site/#navbar" },
          { "@id": "https://contextual.site/#faq" },
          { "@id": "https://contextual.site/#footer" }
        ]
      }
    ]
  }, null, 2);

  const navbarCode = `<Navbar.Root data={data.navbar} className="flex justify-between items-center w-full">
  <Navbar.Brand className="font-bold text-lg no-underline flex items-center gap-2.5">
    <span>気</span> ${navbarData.brand?.name || 'Contextual UI'}
  </Navbar.Brand>
  <Navbar.Content className="flex gap-6 items-center">
    {data.navbar?.links.map((link) => (
      <a key={link.id} href={link.href}>{link.label}</a>
    ))}
  </Navbar.Content>
</Navbar.Root>`;

  const navbarSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "@id": "https://contextual.site/#navbar",
    "isPartOf": { "@id": "https://contextual.site/#webpage" },
    "name": navbarData.brand?.name || "Contextual UI",
    "url": navbarData.brand?.href || "/",
    "hasPart": navbarData.links.map(link => ({
      "@type": "SiteNavigationElement",
      "name": link.label,
      "url": link.href
    }))
  }, null, 2);

  const allFooterLinks = [
    ...(footerData.columns?.flatMap((col) => col.links) || []),
    ...(footerData.links || []),
    ...(footerData.legalLinks || []),
  ];

  const footerCode = `<Footer.Root data={data.footer} className="w-full space-y-8">
  {/* Top Section: Brand & Multi-Column Navigation */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    <div className="md:col-span-2 space-y-3">
      <Footer.Brand className="font-bold text-base no-underline flex items-center gap-2.5 text-zinc-100">
        <img
          src="${footerData.brand?.logo || '/images/onigiri_logo.svg'}"
          alt="${footerData.brand?.name || 'Contextual UI'}"
          className="w-6 h-6 rounded object-contain"
        />
        <span>${footerData.brand?.name || 'Contextual UI'}</span>
      </Footer.Brand>
      <Footer.Description className="text-xs text-zinc-400 max-w-sm leading-relaxed">
        ${footerData.brand?.description || ''}
      </Footer.Description>
      <Footer.Socials className="flex flex-wrap gap-2 pt-2">
        {data.footer?.socials?.map((social) => (
          <Footer.SocialLink
            key={social.id}
            item={social}
            className="text-[11px] font-mono px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-accent transition-colors"
          />
        ))}
      </Footer.Socials>
    </div>

    <Footer.Columns className="md:col-span-2 grid grid-cols-2 gap-6">
      {data.footer?.columns?.map((col) => (
        <Footer.Column key={col.id} column={col} className="space-y-3">
          <Footer.ColumnTitle className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
            {col.title}
          </Footer.ColumnTitle>
          <Footer.Links className="space-y-2 list-none p-0 m-0">
            {col.links.map((link) => (
              <li key={link.id}>
                <Footer.Link
                  item={link}
                  className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                />
              </li>
            ))}
          </Footer.Links>
        </Footer.Column>
      ))}
    </Footer.Columns>
  </div>

  {/* Bottom Bar: Copyright & Legal Policies */}
  <Footer.Bottom className="pt-6 border-t border-base flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
    <Footer.Copyright
      holder="${footerData.copyright?.holder || 'Tasuku Studio'}"
      year={${footerData.copyright?.year || new Date().getFullYear()}}
      className="text-zinc-400 text-xs"
    />
    <div className="flex items-center gap-4 text-xs">
      {data.footer?.legalLinks?.map((link) => (
        <Footer.Link
          key={link.id}
          item={link}
          className="hover:text-zinc-200 transition-colors"
        />
      ))}
    </div>
  </Footer.Bottom>
</Footer.Root>`;

  const footerSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WPFooter",
    "@id": "https://contextual.site/#footer",
    "isPartOf": { "@id": "https://contextual.site/#webpage" },
    ...(footerData.brand?.name ? { "name": footerData.brand.name } : {}),
    ...(footerData.brand?.description ? { "description": footerData.brand.description } : {}),
    ...(footerData.brand?.href ? { "url": footerData.brand.href } : {}),
    ...(footerData.copyright?.holder
      ? {
          "copyrightHolder": {
            "@type": "Organization",
            "name": footerData.copyright.holder,
          },
        }
      : {}),
    "copyrightYear": footerData.copyright?.year || new Date().getFullYear(),
    ...(footerData.socials && footerData.socials.length > 0
      ? { "sameAs": footerData.socials.map((s) => s.href) }
      : {}),
    ...(allFooterLinks.length > 0
      ? {
          "hasPart": allFooterLinks.map((link) => ({
            "@type": "SiteNavigationElement",
            "name": link.label,
            "url": link.href,
          })),
        }
      : {}),
  }, null, 2);

  const breadcrumbCode = `<Breadcrumb.Root data={breadcrumbData} baseUrl="${baseUrl}">
  <Breadcrumb.List className="flex list-none p-0 m-0 gap-2 items-center text-sm">
    {breadcrumbData.map((item, index) => (
      <Breadcrumb.Item key={item.id}>
        <Breadcrumb.Link href={item.url}>{item.label}</Breadcrumb.Link>
      </Breadcrumb.Item>
    ))}
  </Breadcrumb.List>
</Breadcrumb.Root>`;

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbList.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.url ? `${baseUrl}${item.url}` : undefined
    }))
  }, null, 2);

  const faqCode = `<Faq.Root data={faqData}>
  {faqData.map((item) => (
    <Faq.Item key={item.id} id={item.id}>
      <Faq.Trigger>{item.question}</Faq.Trigger>
      <Faq.Content>{item.answer}</Faq.Content>
    </Faq.Item>
  ))}
</Faq.Root>`;

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://contextual.site/#faq",
    "isPartOf": { "@id": "https://contextual.site/#webpage" },
    "mainEntity": faqList.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  }, null, 2);

  // ---------------------------------------------------------------------------
  // Schema Contract Field Definitions (Clean API Reference)
  // ---------------------------------------------------------------------------
  const contextualSiteFields: SchemaField[] = [
    {
      name: 'data',
      type: 'SiteData',
      required: true,
      schemaOrgMapping: '@graph',
      description: 'Domain-level data object providing website, navbar, footer, and FAQ configurations.',
    },
    {
      name: 'data.website',
      type: 'WebsiteData',
      required: false,
      schemaOrgMapping: 'WebSite',
      description: 'Site-level metadata including name, url, and meta description.',
    },
    {
      name: 'data.navbar',
      type: 'NavbarData',
      required: false,
      schemaOrgMapping: 'SiteNavigationElement',
      description: 'Navigation brand and menu links automatically inferred by <Navbar.Root />.',
    },
    {
      name: 'data.footer',
      type: 'FooterData',
      required: false,
      schemaOrgMapping: 'WPFooter',
      description: 'Footer structure, copyright, and social links automatically inferred by <Footer.Root />.',
    },
    {
      name: 'data.faq',
      type: 'FaqItem[]',
      required: false,
      schemaOrgMapping: 'FAQPage',
      description: 'FAQ question-answer pairs automatically inferred by <Faq.Root />.',
    },
    {
      name: 'graph',
      type: 'ContextualGraph',
      required: false,
      schemaOrgMapping: '@graph',
      description: 'Pre-compiled Schema.org JSON-LD graph produced by siteApp.getGraph().',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      schemaOrgMapping: '—',
      description: 'Child components rendered within ContextualSite context.',
    },
  ];

  const webpageFields: SchemaField[] = [
    {
      name: 'app',
      type: 'ContextualApp',
      required: false,
      schemaOrgMapping: '@graph',
      description: 'ContextualApp instance to compile and inject the route-specific Schema.org JSON-LD graph.',
    },
    {
      name: 'name',
      type: 'string',
      required: false,
      schemaOrgMapping: 'WebPage.name',
      description: 'Route-specific page title/name for search engines and AI agents.',
    },
    {
      name: 'url',
      type: 'string',
      required: false,
      schemaOrgMapping: 'WebPage.url',
      description: 'Route-specific canonical pathname (e.g. "/docs").',
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      schemaOrgMapping: 'WebPage.description',
      description: 'Route-specific meta description.',
    },
    {
      name: 'graph',
      type: 'JsonLdGraphResult',
      required: false,
      schemaOrgMapping: '@graph',
      description: 'Pre-computed Schema.org JSON-LD graph (optional explicit override).',
    },
    {
      name: 'disableJsonLdScript',
      type: 'boolean',
      required: false,
      schemaOrgMapping: '—',
      description: 'Disables script tag rendering when set to true.',
    },
  ];

  const navbarFields: SchemaField[] = [
    {
      name: 'brand.name',
      type: 'string',
      required: false,
      schemaOrgMapping: 'Brand.name',
      description: 'Brand or application display title.',
    },
    {
      name: 'brand.logo',
      type: 'string',
      required: false,
      schemaOrgMapping: 'Brand.logo',
      description: 'Brand logo image URL or asset path.',
    },
    {
      name: 'brand.href',
      type: 'string',
      required: false,
      schemaOrgMapping: 'Brand.url',
      description: 'Home link destination (defaults to "/").',
    },
    {
      name: 'links',
      type: 'NavItem[]',
      required: true,
      schemaOrgMapping: 'hasPart: WebPage[]',
      description: 'Array of top-level navigation items.',
    },
    {
      name: 'links[].id',
      type: 'string',
      required: true,
      schemaOrgMapping: '—',
      description: 'Unique identifier for item keying and accessibility.',
    },
    {
      name: 'links[].label',
      type: 'string',
      required: true,
      schemaOrgMapping: 'WebPage.name',
      description: 'Visible link label text.',
    },
    {
      name: 'links[].href',
      type: 'string',
      required: false,
      schemaOrgMapping: 'WebPage.url',
      description: 'Destination target URL.',
    },
    {
      name: 'links[].children',
      type: 'NavItem[]',
      required: false,
      schemaOrgMapping: 'hasPart: WebPage[]',
      description: 'Nested navigation items for dropdown submenus.',
    },
  ];

  const footerFields: SchemaField[] = [
    {
      name: 'brand.name',
      type: 'string',
      required: false,
      schemaOrgMapping: 'WPFooter.name',
      description: 'Brand title displayed in footer.',
    },
    {
      name: 'brand.logo',
      type: 'string',
      required: false,
      schemaOrgMapping: 'WPFooter.logo',
      description: 'Image URL for the brand logo.',
    },
    {
      name: 'brand.href',
      type: 'string',
      required: false,
      schemaOrgMapping: 'WPFooter.url',
      description: 'Brand home URL destination.',
    },
    {
      name: 'brand.description',
      type: 'string',
      required: false,
      schemaOrgMapping: 'WPFooter.description',
      description: 'Short brand mission statement or summary.',
    },
    {
      name: 'columns',
      type: 'FooterColumn[]',
      required: false,
      schemaOrgMapping: 'WPFooter.hasPart',
      description: 'Grouped multi-column link structures for site discovery.',
    },
    {
      name: 'columns[].title',
      type: 'string',
      required: true,
      schemaOrgMapping: '—',
      description: 'Header title for the column group.',
    },
    {
      name: 'columns[].links',
      type: 'FooterLinkItem[]',
      required: true,
      schemaOrgMapping: 'SiteNavigationElement[]',
      description: 'Array of link items belonging to this column.',
    },
    {
      name: 'links',
      type: 'FooterLinkItem[]',
      required: false,
      schemaOrgMapping: 'WPFooter.hasPart',
      description: 'Flat list of primary/secondary footer navigation links.',
    },
    {
      name: 'legalLinks',
      type: 'FooterLinkItem[]',
      required: false,
      schemaOrgMapping: 'WPFooter.hasPart',
      description: 'Utility and legal policy links (Privacy, Terms, Licenses).',
    },
    {
      name: 'socials',
      type: 'FooterSocialLink[]',
      required: false,
      schemaOrgMapping: 'WPFooter.sameAs[]',
      description: 'Verified social media and community profile links.',
    },
    {
      name: 'copyright.holder',
      type: 'string',
      required: false,
      schemaOrgMapping: 'copyrightHolder (Organization)',
      description: 'Legal entity or company holding copyright.',
    },
    {
      name: 'copyright.year',
      type: 'number | string',
      required: false,
      schemaOrgMapping: 'copyrightYear',
      description: 'Copyright year (defaults to current year).',
    },
    {
      name: 'copyright.text',
      type: 'string',
      required: false,
      schemaOrgMapping: '—',
      description: 'Custom copyright disclaimer text.',
    },
  ];

  const breadcrumbFields: SchemaField[] = [
    {
      name: 'data',
      type: 'BreadcrumbItem[]',
      required: true,
      schemaOrgMapping: 'itemListElement: ListItem[]',
      description: 'Hierarchical array of breadcrumb step objects.',
    },
    {
      name: 'data[].id',
      type: 'string',
      required: true,
      schemaOrgMapping: '—',
      description: 'Unique item identifier.',
    },
    {
      name: 'data[].label',
      type: 'string',
      required: true,
      schemaOrgMapping: 'ListItem.name',
      description: 'Display text for the breadcrumb item.',
    },
    {
      name: 'data[].url',
      type: 'string',
      required: false,
      schemaOrgMapping: 'ListItem.item',
      description: 'Destination URL (omitted for the active leaf page).',
    },
    {
      name: 'baseUrl',
      type: 'string',
      required: false,
      schemaOrgMapping: 'ListItem.item (origin prefix)',
      description: 'Origin prefix (e.g. "https://contextual.site") for canonical Schema.org URLs.',
    },
  ];

  const faqFields: SchemaField[] = [
    {
      name: 'data',
      type: 'FaqItem[]',
      required: true,
      schemaOrgMapping: 'mainEntity: Question[]',
      description: 'Array of FAQ question and answer items.',
    },
    {
      name: 'data[].id',
      type: 'string',
      required: true,
      schemaOrgMapping: '—',
      description: 'Unique identifier for the FAQ item.',
    },
    {
      name: 'data[].question',
      type: 'string',
      required: true,
      schemaOrgMapping: 'Question.name',
      description: 'The question string for users and search indexing.',
    },
    {
      name: 'data[].answer',
      type: 'string',
      required: true,
      schemaOrgMapping: 'Question.acceptedAnswer.text',
      description: 'The accepted answer text content.',
    },
  ];

  // ---------------------------------------------------------------------------
  // Interactive Data Source Controls (Dynamic Connector Simulators)
  // ---------------------------------------------------------------------------
  const navbarControls = (
    <InspectorCard
      title="Interactive Data Source · Navbar"
      onReset={() => setNavbarData(initialNavbar)}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-mono text-zinc-400 block mb-1 uppercase tracking-wider">
            Brand Name
          </label>
          <input
            type="text"
            value={navbarData.brand?.name || ''}
            onChange={(e) =>
              setNavbarData((prev) => ({
                ...prev,
                brand: { ...prev.brand, name: e.target.value },
              }))
            }
            className="w-full bg-zinc-900 text-zinc-100 text-xs px-3 py-1.5 rounded-lg border border-zinc-700/80 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none font-sans"
          />
        </div>
        <div>
          <label className="text-[11px] font-mono text-zinc-400 block mb-1 uppercase tracking-wider">
            Brand Target Href
          </label>
          <input
            type="text"
            value={navbarData.brand?.href || ''}
            onChange={(e) =>
              setNavbarData((prev) => ({
                ...prev,
                brand: { ...prev.brand, href: e.target.value },
              }))
            }
            className="w-full bg-zinc-900 text-zinc-100 text-xs px-3 py-1.5 rounded-lg border border-zinc-700/80 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none font-sans"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-mono text-zinc-400 block uppercase tracking-wider">
            Navigation Items ({navbarData.links.length})
          </label>
          <button
            type="button"
            onClick={() =>
              setNavbarData((prev) => ({
                ...prev,
                links: [
                  ...prev.links,
                  {
                    id: String(Date.now()),
                    label: `Link ${prev.links.length + 1}`,
                    href: `/page-${prev.links.length + 1}`,
                  },
                ],
              }))
            }
            className="text-xs font-mono text-accent hover:text-accent/80 flex items-center gap-1 px-2.5 py-1 rounded border border-accent/30 hover:border-accent/60 bg-accent/5 hover:bg-accent/10 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Link</span>
          </button>
        </div>
        <div className="space-y-2">
          {navbarData.links.map((link, idx) => (
            <div
              key={link.id || idx}
              className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 border border-zinc-800"
            >
              <span className="text-[11px] font-mono text-zinc-500 w-5">{idx + 1}.</span>
              <input
                type="text"
                placeholder="Label"
                value={link.label}
                onChange={(e) =>
                  setNavbarData((prev) => {
                    const links = [...prev.links];
                    links[idx] = { ...links[idx], label: e.target.value };
                    return { ...prev, links };
                  })
                }
                className="flex-1 bg-zinc-900 text-zinc-100 text-xs px-2.5 py-1 rounded border border-zinc-700/60 focus:border-accent focus:outline-none"
              />
              <input
                type="text"
                placeholder="Href"
                value={link.href || ''}
                onChange={(e) =>
                  setNavbarData((prev) => {
                    const links = [...prev.links];
                    links[idx] = { ...links[idx], href: e.target.value };
                    return { ...prev, links };
                  })
                }
                className="flex-1 bg-zinc-900 text-zinc-100 text-xs px-2.5 py-1 rounded border border-zinc-700/60 focus:border-accent focus:outline-none"
              />
              <button
                type="button"
                disabled={navbarData.links.length <= 1}
                onClick={() =>
                  setNavbarData((prev) => ({
                    ...prev,
                    links: prev.links.filter((_, i) => i !== idx),
                  }))
                }
                className="text-zinc-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed p-1.5 transition-colors cursor-pointer text-xs"
                title="Delete item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </InspectorCard>
  );

  const footerControls = (
    <InspectorCard
      title="Interactive Data Source · Footer"
      onReset={() => setFooterData(initialFooter)}
    >
      {/* Brand & Copyright Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-mono text-zinc-400 block mb-1 uppercase tracking-wider">
            Brand Name
          </label>
          <input
            type="text"
            value={footerData.brand?.name || ''}
            onChange={(e) =>
              setFooterData((prev) => ({
                ...prev,
                brand: { ...prev.brand, name: e.target.value },
              }))
            }
            className="w-full bg-zinc-900 text-zinc-100 text-xs px-3 py-1.5 rounded-lg border border-zinc-700/80 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none font-sans"
          />
        </div>
        <div>
          <label className="text-[11px] font-mono text-zinc-400 block mb-1 uppercase tracking-wider">
            Copyright Holder
          </label>
          <input
            type="text"
            value={footerData.copyright?.holder || ''}
            onChange={(e) =>
              setFooterData((prev) => ({
                ...prev,
                copyright: { ...prev.copyright, holder: e.target.value },
              }))
            }
            className="w-full bg-zinc-900 text-zinc-100 text-xs px-3 py-1.5 rounded-lg border border-zinc-700/80 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none font-sans"
          />
        </div>
      </div>

      <div>
        <label className="text-[11px] font-mono text-zinc-400 block mb-1 uppercase tracking-wider">
          Brand Description
        </label>
        <input
          type="text"
          value={footerData.brand?.description || ''}
          onChange={(e) =>
            setFooterData((prev) => ({
              ...prev,
              brand: { ...prev.brand, description: e.target.value },
            }))
          }
          className="w-full bg-zinc-900 text-zinc-100 text-xs px-3 py-1.5 rounded-lg border border-zinc-700/80 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none font-sans"
        />
      </div>

      {/* Column Groups */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-mono text-zinc-400 block uppercase tracking-wider">
            Navigation Columns ({footerData.columns?.length || 0})
          </label>
          <button
            type="button"
            onClick={() =>
              setFooterData((prev) => {
                const colNum = (prev.columns?.length || 0) + 1;
                return {
                  ...prev,
                  columns: [
                    ...(prev.columns || []),
                    {
                      id: `col-${Date.now()}`,
                      title: `Column ${colNum}`,
                      links: [
                        { id: `c-${Date.now()}-1`, label: 'Link 1', href: '/link-1' },
                        { id: `c-${Date.now()}-2`, label: 'Link 2', href: '/link-2' },
                      ],
                    },
                  ],
                };
              })
            }
            className="text-xs font-mono text-accent hover:text-accent/80 flex items-center gap-1 px-2.5 py-1 rounded border border-accent/30 hover:border-accent/60 bg-accent/5 hover:bg-accent/10 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Column</span>
          </button>
        </div>
        <div className="space-y-3">
          {(footerData.columns || []).map((col, colIdx) => (
            <div
              key={col.id || colIdx}
              className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-2"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Column Title"
                  value={col.title}
                  onChange={(e) =>
                    setFooterData((prev) => {
                      const columns = [...(prev.columns || [])];
                      columns[colIdx] = { ...columns[colIdx], title: e.target.value };
                      return { ...prev, columns };
                    })
                  }
                  className="flex-1 bg-zinc-900 text-zinc-100 text-xs px-2.5 py-1 rounded border border-zinc-700/60 font-semibold focus:border-accent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFooterData((prev) => {
                      const columns = [...(prev.columns || [])];
                      const newLinkId = `c-${Date.now()}`;
                      columns[colIdx] = {
                        ...columns[colIdx],
                        links: [
                          ...columns[colIdx].links,
                          { id: newLinkId, label: `Link ${columns[colIdx].links.length + 1}`, href: `/new-link` },
                        ],
                      };
                      return { ...prev, columns };
                    })
                  }
                  className="text-xs font-mono text-zinc-400 hover:text-accent flex items-center gap-1 px-2 py-1 rounded border border-zinc-700 hover:border-accent/40 bg-zinc-900 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Link</span>
                </button>
                <button
                  type="button"
                  disabled={(footerData.columns?.length || 0) <= 1}
                  onClick={() =>
                    setFooterData((prev) => ({
                      ...prev,
                      columns: (prev.columns || []).filter((_, i) => i !== colIdx),
                    }))
                  }
                  className="text-zinc-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed p-1 transition-colors cursor-pointer text-xs"
                  title="Delete column"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pl-2 space-y-1.5 border-l border-zinc-800">
                {col.links.map((link, linkIdx) => (
                  <div key={link.id || linkIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Label"
                      value={link.label}
                      onChange={(e) =>
                        setFooterData((prev) => {
                          const columns = [...(prev.columns || [])];
                          const links = [...columns[colIdx].links];
                          links[linkIdx] = { ...links[linkIdx], label: e.target.value };
                          columns[colIdx] = { ...columns[colIdx], links };
                          return { ...prev, columns };
                        })
                      }
                      className="w-36 bg-zinc-900 text-zinc-100 text-xs px-2 py-1 rounded border border-zinc-700/60 focus:border-accent focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Href"
                      value={link.href}
                      onChange={(e) =>
                        setFooterData((prev) => {
                          const columns = [...(prev.columns || [])];
                          const links = [...columns[colIdx].links];
                          links[linkIdx] = { ...links[linkIdx], href: e.target.value };
                          columns[colIdx] = { ...columns[colIdx], links };
                          return { ...prev, columns };
                        })
                      }
                      className="flex-1 bg-zinc-900 text-zinc-100 text-xs px-2 py-1 rounded border border-zinc-700/60 focus:border-accent focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={col.links.length <= 1}
                      onClick={() =>
                        setFooterData((prev) => {
                          const columns = [...(prev.columns || [])];
                          columns[colIdx] = {
                            ...columns[colIdx],
                            links: columns[colIdx].links.filter((_, i) => i !== linkIdx),
                          };
                          return { ...prev, columns };
                        })
                      }
                      className="text-zinc-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed p-1 transition-colors cursor-pointer text-xs"
                      title="Delete link"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Profiles */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-mono text-zinc-400 block uppercase tracking-wider">
            Social Profiles ({footerData.socials?.length || 0})
          </label>
          <button
            type="button"
            onClick={() =>
              setFooterData((prev) => ({
                ...prev,
                socials: [
                  ...(prev.socials || []),
                  {
                    id: `s-${Date.now()}`,
                    platform: 'Social',
                    label: 'Platform',
                    href: 'https://example.com',
                  },
                ],
              }))
            }
            className="text-xs font-mono text-accent hover:text-accent/80 flex items-center gap-1 px-2.5 py-1 rounded border border-accent/30 hover:border-accent/60 bg-accent/5 hover:bg-accent/10 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Social</span>
          </button>
        </div>
        <div className="space-y-2">
          {(footerData.socials || []).map((social, idx) => (
            <div
              key={social.id || idx}
              className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 border border-zinc-800"
            >
              <input
                type="text"
                placeholder="Platform / Label"
                value={social.label || social.platform}
                onChange={(e) =>
                  setFooterData((prev) => {
                    const socials = [...(prev.socials || [])];
                    socials[idx] = { ...socials[idx], label: e.target.value, platform: e.target.value };
                    return { ...prev, socials };
                  })
                }
                className="w-36 bg-zinc-900 text-zinc-100 text-xs px-2.5 py-1 rounded border border-zinc-700/60 focus:border-accent focus:outline-none"
              />
              <input
                type="text"
                placeholder="URL"
                value={social.href}
                onChange={(e) =>
                  setFooterData((prev) => {
                    const socials = [...(prev.socials || [])];
                    socials[idx] = { ...socials[idx], href: e.target.value };
                    return { ...prev, socials };
                  })
                }
                className="flex-1 bg-zinc-900 text-zinc-100 text-xs px-2.5 py-1 rounded border border-zinc-700/60 focus:border-accent focus:outline-none"
              />
              <button
                type="button"
                disabled={(footerData.socials?.length || 0) <= 1}
                onClick={() =>
                  setFooterData((prev) => ({
                    ...prev,
                    socials: (prev.socials || []).filter((_, i) => i !== idx),
                  }))
                }
                className="text-zinc-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed p-1.5 transition-colors cursor-pointer text-xs"
                title="Delete social"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Links */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-mono text-zinc-400 block uppercase tracking-wider">
            Legal & Policy Links ({footerData.legalLinks?.length || 0})
          </label>
          <button
            type="button"
            onClick={() =>
              setFooterData((prev) => ({
                ...prev,
                legalLinks: [
                  ...(prev.legalLinks || []),
                  {
                    id: `l-${Date.now()}`,
                    label: 'Policy',
                    href: '/policy',
                  },
                ],
              }))
            }
            className="text-xs font-mono text-accent hover:text-accent/80 flex items-center gap-1 px-2.5 py-1 rounded border border-accent/30 hover:border-accent/60 bg-accent/5 hover:bg-accent/10 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Legal Link</span>
          </button>
        </div>
        <div className="space-y-2">
          {(footerData.legalLinks || []).map((legal, idx) => (
            <div
              key={legal.id || idx}
              className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 border border-zinc-800"
            >
              <input
                type="text"
                placeholder="Label"
                value={legal.label}
                onChange={(e) =>
                  setFooterData((prev) => {
                    const legalLinks = [...(prev.legalLinks || [])];
                    legalLinks[idx] = { ...legalLinks[idx], label: e.target.value };
                    return { ...prev, legalLinks };
                  })
                }
                className="w-36 bg-zinc-900 text-zinc-100 text-xs px-2.5 py-1 rounded border border-zinc-700/60 focus:border-accent focus:outline-none"
              />
              <input
                type="text"
                placeholder="Href"
                value={legal.href}
                onChange={(e) =>
                  setFooterData((prev) => {
                    const legalLinks = [...(prev.legalLinks || [])];
                    legalLinks[idx] = { ...legalLinks[idx], href: e.target.value };
                    return { ...prev, legalLinks };
                  })
                }
                className="flex-1 bg-zinc-900 text-zinc-100 text-xs px-2.5 py-1 rounded border border-zinc-700/60 focus:border-accent focus:outline-none"
              />
              <button
                type="button"
                disabled={(footerData.legalLinks?.length || 0) <= 1}
                onClick={() =>
                  setFooterData((prev) => ({
                    ...prev,
                    legalLinks: (prev.legalLinks || []).filter((_, i) => i !== idx),
                  }))
                }
                className="text-zinc-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed p-1.5 transition-colors cursor-pointer text-xs"
                title="Delete legal link"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </InspectorCard>
  );

  const breadcrumbControls = (
    <InspectorCard
      title="Interactive Data Source · Breadcrumb"
      onReset={() => {
        setBreadcrumbList(initialBreadcrumb);
        setBaseUrl('https://contextual.site');
      }}
    >
      <div>
        <label className="text-[11px] font-mono text-zinc-400 block mb-1 uppercase tracking-wider">
          Canonical Base URL
        </label>
        <input
          type="text"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          className="w-full bg-zinc-900 text-zinc-100 text-xs px-3 py-1.5 rounded-lg border border-zinc-700/80 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none font-sans"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-mono text-zinc-400 block uppercase tracking-wider">
            Trail Steps ({breadcrumbList.length})
          </label>
          <button
            type="button"
            onClick={() =>
              setBreadcrumbList((prev) => [
                ...prev,
                {
                  id: String(Date.now()),
                  label: `Step ${prev.length + 1}`,
                  url: `/step-${prev.length + 1}`,
                },
              ])
            }
            className="text-xs font-mono text-accent hover:text-accent/80 flex items-center gap-1 px-2.5 py-1 rounded border border-accent/30 hover:border-accent/60 bg-accent/5 hover:bg-accent/10 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Step</span>
          </button>
        </div>
        <div className="space-y-2">
          {breadcrumbList.map((item, idx) => (
            <div
              key={item.id || idx}
              className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 border border-zinc-800"
            >
              <span className="text-[11px] font-mono text-zinc-500 w-5">{idx + 1}.</span>
              <input
                type="text"
                placeholder="Step Label"
                value={item.label}
                onChange={(e) =>
                  setBreadcrumbList((prev) => {
                    const list = [...prev];
                    list[idx] = { ...list[idx], label: e.target.value };
                    return list;
                  })
                }
                className="flex-1 bg-zinc-900 text-zinc-100 text-xs px-2.5 py-1 rounded border border-zinc-700/60 focus:border-accent focus:outline-none"
              />
              <input
                type="text"
                placeholder="URL (optional for leaf)"
                value={item.url || ''}
                onChange={(e) =>
                  setBreadcrumbList((prev) => {
                    const list = [...prev];
                    list[idx] = { ...list[idx], url: e.target.value };
                    return list;
                  })
                }
                className="flex-1 bg-zinc-900 text-zinc-100 text-xs px-2.5 py-1 rounded border border-zinc-700/60 focus:border-accent focus:outline-none"
              />
              <button
                type="button"
                disabled={breadcrumbList.length <= 1}
                onClick={() =>
                  setBreadcrumbList((prev) => prev.filter((_, i) => i !== idx))
                }
                className="text-zinc-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed p-1.5 transition-colors cursor-pointer text-xs"
                title="Delete step"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </InspectorCard>
  );

  const faqControls = (
    <InspectorCard
      title="Interactive Data Source · FAQ"
      onReset={() => setFaqList(initialFaq)}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-mono text-zinc-400 block uppercase tracking-wider">
            Questions & Answers ({faqList.length})
          </label>
          <button
            type="button"
            onClick={() =>
              setFaqList((prev) => [
                ...prev,
                {
                  id: String(Date.now()),
                  question: `Question ${prev.length + 1}?`,
                  answer: `Answer for question ${prev.length + 1}.`,
                },
              ])
            }
            className="text-xs font-mono text-accent hover:text-accent/80 flex items-center gap-1 px-2.5 py-1 rounded border border-accent/30 hover:border-accent/60 bg-accent/5 hover:bg-accent/10 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add FAQ</span>
          </button>
        </div>
        <div className="space-y-3">
          {faqList.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-zinc-500 font-semibold">
                  Q{idx + 1}.
                </span>
                <input
                  type="text"
                  placeholder="Question"
                  value={item.question}
                  onChange={(e) =>
                    setFaqList((prev) => {
                      const list = [...prev];
                      list[idx] = { ...list[idx], question: e.target.value };
                      return list;
                    })
                  }
                  className="flex-1 bg-zinc-900 text-zinc-100 text-xs px-2.5 py-1 rounded border border-zinc-700/60 focus:border-accent focus:outline-none"
                />
                <button
                  type="button"
                  disabled={faqList.length <= 1}
                  onClick={() =>
                    setFaqList((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="text-zinc-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed p-1.5 transition-colors cursor-pointer text-xs"
                  title="Delete question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                placeholder="Answer"
                rows={2}
                value={item.answer}
                onChange={(e) =>
                  setFaqList((prev) => {
                    const list = [...prev];
                    list[idx] = { ...list[idx], answer: e.target.value };
                    return list;
                  })
                }
                className="w-full bg-zinc-900 text-zinc-100 text-xs px-2.5 py-1 rounded border border-zinc-700/60 focus:border-accent focus:outline-none font-sans resize-y"
              />
            </div>
          ))}
        </div>
      </div>
    </InspectorCard>
  );

  return (
    <div className="pt-24 pb-28 max-w-7xl mx-auto px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Docs</h1>
        <p className="text-zinc-400 text-sm">
          Explore Contextual UI site providers and components designed for humans, search engines, and AI agents.
          Use the interactive data source controls to customize component mock data, add or remove items, and see real-time UI rendering and Schema.org JSON-LD graph generation.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start relative">
        {/* Left Side Menu */}
        <aside className="hidden lg:block lg:sticky lg:top-24 w-64 shrink-0 space-y-6">
          <div className="backdrop-blur-sm shadow-sm space-y-6">
            {/* Subsection 1: Getting Started */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-400 px-3 pt-1">
                Getting Started
              </h3>
              <nav className="space-y-1">
                {quickstartNavItems.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                        setActiveId(item.id);
                      }}
                      className={`flex flex-col px-3 py-2 rounded-xl text-sm transition-colors no-underline ${
                        isActive
                          ? 'text-accent border border-base shadow-sm font-medium bg-zinc-900/50'
                          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/30'
                      }`}
                    >
                      <span className="font-semibold text-xs leading-snug">{item.label}</span>
                      <span className="text-[11px] text-zinc-500 truncate">{item.desc}</span>
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Subsection 2: Components */}
            <div className="space-y-2 pt-3 border-t border-base">
              <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-400 px-3 pt-1">
                Components
              </h3>
              <nav className="space-y-1">
                {componentNavItems.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                        setActiveId(item.id);
                      }}
                      className={`flex flex-col px-3 py-2 rounded-xl text-sm transition-colors no-underline ${
                        isActive
                          ? 'text-accent border border-base shadow-sm font-medium bg-zinc-900/50'
                          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/30'
                      }`}
                    >
                      <span className="font-semibold text-xs leading-snug">{item.label}</span>
                      <span className="text-[11px] text-zinc-500 truncate">{item.desc}</span>
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Subsection 3: Forms */}
            <div className="space-y-2 pt-3 border-t border-base">
              <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-400 px-3 pt-1">
                Forms
              </h3>
              <nav className="space-y-1">
                {formNavItems.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                        setActiveId(item.id);
                      }}
                      className={`flex flex-col px-3 py-2 rounded-xl text-sm transition-colors no-underline ${
                        isActive
                          ? 'text-accent border border-base shadow-sm font-medium bg-zinc-900/50'
                          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/30'
                      }`}
                    >
                      <span className="font-semibold text-xs leading-snug">{item.label}</span>
                      <span className="text-[11px] text-zinc-500 truncate">{item.desc}</span>
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Subsection 4: Connectors */}
            <div className="space-y-2 pt-3 border-t border-base">
              <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-400 px-3 pt-1">
                Connectors
              </h3>
              <nav className="space-y-1">
                {connectorNavItems.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                        setActiveId(item.id);
                      }}
                      className={`flex flex-col px-3 py-2 rounded-xl text-sm transition-colors no-underline ${
                        isActive
                          ? 'text-accent border border-base shadow-sm font-medium bg-zinc-900/50'
                          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/30'
                      }`}
                    >
                      <span className="font-semibold text-xs leading-snug">{item.label}</span>
                      <span className="text-[11px] text-zinc-500 truncate">{item.desc}</span>
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 space-y-12 w-full">
          {/* Mobile Navigation Pills */}
          <div className="flex lg:hidden overflow-x-auto gap-2 pb-2 border-b border-base w-full">
            {[...quickstartNavItems, ...componentNavItems, ...formNavItems, ...connectorNavItems].map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                    setActiveId(item.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors no-underline ${
                    isActive
                      ? 'bg-zinc-900 text-accent border border-base'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Quickstart Guide */}
          <QuickstartSection />

          {/* Schema Registries & defineSchema */}
          <SchemaRegistriesSection />

          {/* ContextualSite Showcase */}
          <ShowcaseSection
            id="contextual-site"
            title="<ContextualSite /> Provider"
            description="The root provider that coordinates domain-level data distribution to all contextual UI components. In single-page apps (SPAs), it compiles and injects the unified Schema.org JSON-LD @graph."
            fields={contextualSiteFields}
            codeString={contextualSiteCode}
            schemaString={contextualSiteSchema}
            exampleDescription="Wrap your root layout with ContextualSite to provide data across all components."
            schemaDescription="Unified Schema.org @graph automatically injected in a single script tag for SPAs."
          />

          {/* WebPage Showcase */}
          <ShowcaseSection
            id="webpage"
            title="<WebPage /> Wrapper"
            description="The route-level React Server Component that coordinates page-level Schema.org metadata and automatically injects the canonical @graph script tag for that specific URL."
            fields={webpageFields}
            codeString={webpageCode}
            schemaString={webpageSchema}
            exampleDescription="Wrap individual routes in page.tsx with WebPage from contextual-ui/server."
            schemaDescription="Route-accurate Schema.org WebPage node connecting navbar, footer, and FAQ."
          />

          {/* Navbar Showcase */}
          <ShowcaseSection
            id="navbar"
            title="Navbar"
            description="The Navbar component renders accessible navigation structures with full semantic support."
            controls={navbarControls}
            fields={navbarFields}
            codeString={navbarCode}
            schemaString={navbarSchema}
            exampleDescription="React component implementation using Navbar subcomponents."
            schemaDescription="Schema.org SiteNavigationElement automatically injected in the DOM."
          >
            <Navbar.Root data={navbarData} className="w-full relative">
              <div className="flex justify-between items-center w-full">
                <Navbar.Brand className="font-bold text-lg no-underline flex items-center gap-2.5">
                  <img
                    src={navbarData.brand?.logo || '/images/onigiri_logo.svg'}
                    alt="Contextual UI Logo"
                    className="w-7 h-7 rounded-md object-contain shadow-sm"
                  />
                  {navbarData.brand?.name || 'Contextual UI'}
                </Navbar.Brand>
                <Navbar.Content className="hidden md:flex gap-6 items-center">
                  {navbarData.links.map((link) => (
                    <a
                      key={link.id}
                      href={link.href}
                      className="hover:text-silver no-underline text-sm font-medium transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </Navbar.Content>
                <Navbar.Toggle className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 focus:outline-none cursor-pointer" />
              </div>
              <Navbar.Menu className="absolute top-16 left-[-24px] right-[-24px] md:hidden bg-zinc-950/95 backdrop-blur-xl border-b border-base p-6 flex flex-col gap-4 shadow-2xl">
                {navbarData.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    className="hover:text-silver no-underline text-base font-medium transition-colors py-1"
                  >
                    {link.label}
                  </a>
                ))}
              </Navbar.Menu>
            </Navbar.Root>
          </ShowcaseSection>

          {/* Footer Showcase */}
          <ShowcaseSection
            id="footer"
            title="Footer"
            description="The Footer component organizes structured site links, brand metadata, columnar resources, social profiles, and legal attribution with automatic Schema.org WPFooter structured data injection."
            controls={footerControls}
            fields={footerFields}
            codeString={footerCode}
            schemaString={footerSchema}
            exampleDescription="Accessible, schema-driven multi-column footer layout."
            schemaDescription="Schema.org WPFooter automatically injected in the DOM."
          >
            <Footer.Root data={footerData} className="w-full space-y-8">
              {/* Top Section: Brand & Multi-Column Navigation */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-2 space-y-3">
                  <Footer.Brand className="font-bold text-base no-underline flex items-center gap-2.5 text-zinc-100">
                    {footerData.brand?.logo && (
                      <img
                        src={footerData.brand.logo}
                        alt={footerData.brand.name || 'Contextual UI'}
                        className="w-6 h-6 rounded object-contain"
                      />
                    )}
                    <span>{footerData.brand?.name || 'Contextual UI'}</span>
                  </Footer.Brand>
                  {footerData.brand?.description && (
                    <Footer.Description className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                      {footerData.brand.description}
                    </Footer.Description>
                  )}
                  {footerData.socials && footerData.socials.length > 0 && (
                    <Footer.Socials className="flex flex-wrap gap-2 pt-2">
                      {footerData.socials.map((social) => (
                        <Footer.SocialLink
                          key={social.id}
                          item={social}
                          className="text-[11px] font-mono px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-accent hover:border-accent/40 transition-colors"
                        >
                          {social.label || social.platform}
                        </Footer.SocialLink>
                      ))}
                    </Footer.Socials>
                  )}
                </div>

                <Footer.Columns className="md:col-span-2 grid grid-cols-2 gap-6">
                  {footerData.columns?.map((col) => (
                    <Footer.Column key={col.id} column={col} className="space-y-3">
                      <Footer.ColumnTitle className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
                        {col.title}
                      </Footer.ColumnTitle>
                      <Footer.Links className="space-y-2 list-none p-0 m-0">
                        {col.links.map((link) => (
                          <li key={link.id}>
                            <Footer.Link
                              item={link}
                              className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                            />
                          </li>
                        ))}
                      </Footer.Links>
                    </Footer.Column>
                  ))}
                </Footer.Columns>
              </div>

              {/* Bottom Bar: Copyright & Legal Policies */}
              <Footer.Bottom className="pt-6 border-t border-base flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
                <Footer.Copyright
                  holder={footerData.copyright?.holder}
                  year={footerData.copyright?.year}
                  className="text-zinc-400 text-xs"
                />
                {footerData.legalLinks && footerData.legalLinks.length > 0 && (
                  <div className="flex items-center gap-4 text-xs">
                    {footerData.legalLinks.map((link) => (
                      <Footer.Link
                        key={link.id}
                        item={link}
                        className="hover:text-zinc-200 transition-colors"
                      />
                    ))}
                  </div>
                )}
              </Footer.Bottom>
            </Footer.Root>
          </ShowcaseSection>

          {/* Breadcrumb Showcase */}
          <ShowcaseSection
            id="breadcrumb"
            title="Breadcrumb"
            description="The Breadcrumb component automatically injects Schema.org BreadcrumbList JSON-LD for search engine indexing while enforcing accessible semantic navigation."
            controls={breadcrumbControls}
            fields={breadcrumbFields}
            codeString={breadcrumbCode}
            schemaString={breadcrumbSchema}
            exampleDescription="Accessible breadcrumb trail implementation with list items and separators."
            schemaDescription="Schema.org BreadcrumbList automatically injected in the DOM."
          >
            <Breadcrumb.Root data={breadcrumbList} baseUrl={baseUrl}>
              <Breadcrumb.List className="flex list-none p-0 m-0 gap-2 items-center text-sm">
                {breadcrumbList.map((item, index) => {
                  const isLast = index === breadcrumbList.length - 1;
                  return (
                    <Breadcrumb.Item key={item.id} id={item.id} className="flex items-center gap-2">
                      {isLast ? (
                        <Breadcrumb.Page className="font-semibold">
                          {item.label}
                        </Breadcrumb.Page>
                      ) : (
                        <>
                          <Breadcrumb.Link href={item.url!} className="text-accent hover:underline no-underline">
                            {item.label}
                          </Breadcrumb.Link>
                          <Breadcrumb.Separator className="text-zinc-400">
                            /
                          </Breadcrumb.Separator>
                        </>
                      )}
                    </Breadcrumb.Item>
                  );
                })}
              </Breadcrumb.List>
            </Breadcrumb.Root>
          </ShowcaseSection>

          {/* FAQ Showcase */}
          <ShowcaseSection
            id="faq"
            title="FAQ"
            description="The FAQ component organizes collapsible question-and-answer pairs with automatic Schema.org FAQPage structured data injection."
            controls={faqControls}
            fields={faqFields}
            codeString={faqCode}
            schemaString={faqSchema}
            exampleDescription="Collapsible FAQ layout with trigger buttons and content sections."
            schemaDescription="Schema.org FAQPage automatically injected in the DOM."
          >
            <Faq.Root data={faqList}>
              {faqList.map((item, index) => (
                <Faq.Item key={item.id} id={item.id} className="mb-4 last:mb-0 border-b border-base last:border-b-0 pb-4 last:pb-0">
                  <Faq.Trigger className="bg-transparent border-none font-semibold text-base cursor-pointer text-left w-full hover:text-accent transition-colors py-1">
                    {`${index + 1}. ${item.question}`}
                  </Faq.Trigger>
                  <Faq.Content className="mt-2 text-zinc-400 text-sm leading-relaxed">
                    {item.answer}
                  </Faq.Content>
                </Faq.Item>
              ))}
            </Faq.Root>
          </ShowcaseSection>

          {/* Forms: AutoForm Section */}
          <AutoFormSection formsData={data.forms} />

          {/* Forms: createForm Section */}
          <CreateFormSection />

          {/* Connectors Section */}
          <ConnectorsSection />
        </div>
      </div>
    </div>
  );
}
