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
} from 'lucide-react';
import { Breadcrumb, Navbar, Faq, Footer, createForm } from '@contextual-ui/core';
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

function FormFactorySection() {
  const formExampleCode = `import { z } from 'zod';
import { createForm } from '@contextual-ui/core';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const ContactForm = createForm(contactSchema);

export function ContactDemo() {
  return (
    <ContactForm.Root 
      onSubmit={(data) => alert(JSON.stringify(data, null, 2))}
      className="space-y-4 max-w-md mx-auto"
    >
      <div className="flex gap-4">
        <ContactForm.Field name="name" className="flex-1">
          <ContactForm.Label className="block text-sm text-zinc-300 mb-1">Name</ContactForm.Label>
          <ContactForm.Input className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white" />
          <ContactForm.ErrorMessage className="text-red-400 text-xs mt-1 block" />
        </ContactForm.Field>

        <ContactForm.Field name="email" className="flex-1">
          <ContactForm.Label className="block text-sm text-zinc-300 mb-1">Email</ContactForm.Label>
          <ContactForm.Input type="email" className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white" />
          <ContactForm.ErrorMessage className="text-red-400 text-xs mt-1 block" />
        </ContactForm.Field>
      </div>

      <ContactForm.Field name="message">
        <ContactForm.Label className="block text-sm text-zinc-300 mb-1">Message</ContactForm.Label>
        <ContactForm.TextArea rows={2} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white" />
        <ContactForm.ErrorMessage className="text-red-400 text-xs mt-1 block" />
      </ContactForm.Field>

      <ContactForm.Submit className="w-full py-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors">
        Send Message
      </ContactForm.Submit>
    </ContactForm.Root>
  );
}`;

  return (
    <div id="form-factory" className="scroll-mt-32">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Form Factory</h2>
        <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed">
          The <code className="code-short">createForm</code> factory provides a fully type-safe, Zod-powered form solution. 
          It generates context-aware components for your schema without boilerplate.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Live Demo */}
        <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 backdrop-blur-sm relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <ContactForm.Root 
            onSubmit={async (data) => {
              alert(JSON.stringify(data, null, 2));
            }}
            className="space-y-4 max-w-md mx-auto relative z-10"
          >
            <div className="flex gap-4">
              <ContactForm.Field name="name" className="flex-1">
                <ContactForm.Label className="block text-sm text-zinc-300 mb-1">Name</ContactForm.Label>
                <ContactForm.Input className="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
                <ContactForm.ErrorMessage className="text-red-400 text-xs mt-1 block" />
              </ContactForm.Field>

              <ContactForm.Field name="email" className="flex-1">
                <ContactForm.Label className="block text-sm text-zinc-300 mb-1">Email</ContactForm.Label>
                <ContactForm.Input type="email" className="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
                <ContactForm.ErrorMessage className="text-red-400 text-xs mt-1 block" />
              </ContactForm.Field>
            </div>

            <ContactForm.Field name="message">
              <ContactForm.Label className="block text-sm text-zinc-300 mb-1">Message</ContactForm.Label>
              <ContactForm.TextArea rows={2} className="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
              <ContactForm.ErrorMessage className="text-red-400 text-xs mt-1 block" />
            </ContactForm.Field>

            <ContactForm.Submit className="w-full py-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors">
              Send Message
            </ContactForm.Submit>
          </ContactForm.Root>
        </div>

        {/* Code Snippet */}
        <div className="rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-xl">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-mono text-zinc-300">ContactForm.tsx</span>
            </div>
          </div>
          <div className="p-4 overflow-x-auto text-[13px] leading-relaxed">
            <pre className="!m-0 !bg-transparent !p-0">
              <code
                className="language-tsx"
                dangerouslySetInnerHTML={{
                  __html: highlightCode(formExampleCode, 'tsx'),
                }}
              />
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectorsSection() {
  const [activeTab, setActiveTab] = useState<'static' | 'cms' | 'database'>('static');

  const staticCode = `import { staticConnector } from '@contextual-ui/connector-static';
import { createContextualApp } from '@contextual-ui/core/server';
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
});`;

  const cmsCode = `import { createContextualApp } from '@contextual-ui/core/server';
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
});`;

  const databaseCode = `import { createContextualApp } from '@contextual-ui/core/server';
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

      <pre className="!bg-zinc-900 !text-zinc-100 p-6 !rounded-xl text-xs font-mono overflow-x-auto border border-base shadow-inner">
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

      <pre className="!bg-zinc-900 !text-zinc-100 p-6 !rounded-xl text-xs font-mono overflow-x-auto border border-base shadow-inner">
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
  const [activeId, setActiveId] = useState<string>('contextual-site');

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

  const componentNavItems = [
    { id: 'contextual-site', label: 'ContextualSite', desc: 'Site Provider & Graph' },
    { id: 'navbar', label: 'Navbar', desc: 'Navigation Bar' },
    { id: 'footer', label: 'Footer', desc: 'Footer & Attribution' },
    { id: 'breadcrumb', label: 'Breadcrumb', desc: 'Breadcrumb Trail' },
    { id: 'faq', label: 'FAQ', desc: 'FAQ & Accordion' },
  ];

  const factoryNavItems = [
    { id: 'form-factory', label: 'Form Factory', desc: 'Type-safe Forms' },
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

    const sections = ['contextual-site', 'navbar', 'footer', 'breadcrumb', 'faq', 'connectors'];
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
import { ContextualSite, Navbar, Faq } from '@contextual-ui/core';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await siteApp.fetchData();
  const graph = await siteApp.getGraph({
    graphOptions: { baseUrl: 'https://contextual.site' },
  });

  return (
    <html lang="en">
      <body>
        <ContextualSite data={data} graph={graph}>
          {/* Child components automatically infer data from context */}
          <Navbar.Root />
          {children}
        </ContextualSite>
      </body>
    </html>
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
        "@type": "SiteNavigationElement",
        "@id": "https://contextual.site/#navbar",
        "name": "Navigation Bar",
        "isPartOf": { "@id": "https://contextual.site/#website" },
        "hasPart": (data.navbar?.links || []).map(link => ({
          "@type": "WebPage",
          "name": link.label,
          "url": link.href
        }))
      },
      {
        "@type": "FAQPage",
        "@id": "https://contextual.site/#faq",
        "isPartOf": { "@id": "https://contextual.site/#website" },
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
    "@type": "SiteNavigationElement",
    "name": "Navigation Bar",
    "brand": {
      "@type": "Brand",
      "name": navbarData.brand?.name || "Contextual UI",
      "url": navbarData.brand?.href || "/"
    },
    "hasPart": navbarData.links.map(link => ({
      "@type": "WebPage",
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
          className="w-6 h-6 rounded object-contain border border-base bg-zinc-950"
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
    "isPartOf": { "@id": "https://contextual.site/#website" },
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
        <h1 className="text-2xl font-bold tracking-tight mb-2">Docs & Components</h1>
        <p className="text-zinc-400 text-sm">
          Explore Contextual UI site providers and components designed for humans, search engines, and AI agents.
          Use the interactive data source controls to customize component mock data, add or remove items, and see real-time UI rendering and Schema.org JSON-LD graph generation.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start relative">
        {/* Left Side Menu */}
        <aside className="hidden lg:block lg:sticky lg:top-24 w-64 shrink-0 space-y-6">
          <div className="backdrop-blur-sm shadow-sm space-y-6">
            {/* Subsection 1: Components */}
            <div className="space-y-2">
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

            {/* Subsection 2: Factories */}
            <div className="space-y-2 pt-3 border-t border-base">
              <h3 className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-400 px-3 pt-1">
                Factories
              </h3>
              <nav className="space-y-1">
                {factoryNavItems.map((item) => {
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

            {/* Subsection 3: Connectors */}
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
            {[...componentNavItems, ...factoryNavItems, ...connectorNavItems].map((item) => {
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

          {/* ContextualSite Showcase */}
          <ShowcaseSection
            id="contextual-site"
            title="<ContextualSite /> Provider"
            description="The root provider that coordinates domain-level data distribution to all contextual UI components and consolidates their schema data into a single, unified Schema.org JSON-LD @graph."
            fields={contextualSiteFields}
            codeString={contextualSiteCode}
            schemaString={contextualSiteSchema}
            exampleDescription="Wrap your root layout with ContextualSite to provide data and unified @graph script."
            schemaDescription="Unified Schema.org @graph automatically injected in a single script tag."
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
                    className="w-7 h-7 rounded-md object-contain shadow-sm text-silver bg-zinc-950 border border-base"
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
                        className="w-6 h-6 rounded object-contain border border-base bg-zinc-950"
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

          {/* Form Factory Section */}
          <FormFactorySection />

          {/* Connectors Section */}
          <ConnectorsSection />
        </div>
      </div>
    </div>
  );
}
