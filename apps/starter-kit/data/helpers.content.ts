import type { SectionRecord } from 'contextual-ui';
import type { SchemaField } from './registries.content';

export const HELPER_FIELDS: SchemaField[] = [
  {
    name: 'pageIdOrOptions',
    type: 'string | GetMetadataOptions',
    required: false,
    schemaOrgMapping: 'WebPage.@id / url',
    description: 'Page identifier (e.g. "privacy", "home") or options object. Defaults to "home" or root website when omitted.',
  },
  {
    name: 'overrides',
    type: 'Partial<Metadata>',
    required: false,
    schemaOrgMapping: '—',
    description: 'Custom metadata overrides (e.g. title, openGraph images, twitter card, keywords, robots).',
  },
  {
    name: 'returns',
    type: 'Promise<Metadata>',
    required: true,
    schemaOrgMapping: '—',
    description: 'Next.js App Router-compatible Metadata object with metadataBase, title, description, alternates, openGraph, and twitter.',
  },
];

export const SITEMAP_FIELDS: SchemaField[] = [
  {
    name: 'options.baseUrl',
    type: 'string',
    required: false,
    schemaOrgMapping: 'WebSite.url',
    description: 'Base canonical domain (e.g. "https://example.com"). Defaults to siteApp.baseUrl or data.website.url.',
  },
  {
    name: 'options.exclude',
    type: 'string[]',
    required: false,
    schemaOrgMapping: '—',
    description: 'Paths or glob patterns to omit (e.g. ["/cms", "/cms/*", "/admin", "/studio*"]).',
  },
  {
    name: 'options.additionalRoutes',
    type: 'SitemapItem[]',
    required: false,
    schemaOrgMapping: '—',
    description: 'Additional routes or dynamic records outside the primary schema to append with deduplication.',
  },
  {
    name: 'options.defaultPriority',
    type: 'number',
    required: false,
    schemaOrgMapping: '—',
    description: 'Default priority (0.0 to 1.0). Root "/" defaults to 1.0, subpages default to 0.8.',
  },
  {
    name: 'options.defaultChangeFrequency',
    type: 'SitemapChangeFrequency',
    required: false,
    schemaOrgMapping: '—',
    description: '"always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never". Root defaults to "daily", subpages to "weekly".',
  },
  {
    name: 'returns (getSitemap)',
    type: 'Promise<MetadataRoute.Sitemap>',
    required: true,
    schemaOrgMapping: '—',
    description: 'Array of items typed directly for Next.js App Router app/sitemap.ts export.',
  },
  {
    name: 'returns (generateSitemapXml)',
    type: 'Promise<string>',
    required: true,
    schemaOrgMapping: '—',
    description: 'RFC-compliant XML string conforming to Sitemaps 0.9 specification with entity escaping.',
  },
  {
    name: 'returns (createSitemapHandler)',
    type: '{ GET: (req: Request) => Promise<Response> }',
    required: true,
    schemaOrgMapping: '—',
    description: 'Standard Web Response route handler for Next.js, Remix, Astro, or TanStack.',
  },
];

export const ROBOTS_FIELDS: SchemaField[] = [
  {
    name: 'options.baseUrl',
    type: 'string',
    required: false,
    schemaOrgMapping: 'WebSite.url',
    description: 'Base canonical domain. Used to formulate "Sitemap: ${baseUrl}/sitemap.xml" and "Host: hostname".',
  },
  {
    name: 'options.disallow',
    type: 'string | string[]',
    required: false,
    schemaOrgMapping: '—',
    description: 'Paths forbidden for standard crawlers (e.g. ["/cms", "/cms/"]).',
  },
  {
    name: 'options.allow',
    type: 'string | string[]',
    required: false,
    schemaOrgMapping: '—',
    description: 'Paths explicitly permitted (defaults to "/").',
  },
  {
    name: 'options.aiRobots',
    type: 'AiOptions',
    required: false,
    schemaOrgMapping: '—',
    description: 'Preset policies for AI training and search bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bytespider).',
  },
  {
    name: 'options.sitemap',
    type: 'string | string[] | boolean',
    required: false,
    schemaOrgMapping: '—',
    description: 'Sitemap URL directive. Defaults to true ("${baseUrl}/sitemap.xml"). Set false to suppress.',
  },
  {
    name: 'returns (getRobots)',
    type: 'Promise<MetadataRoute.Robots>',
    required: true,
    schemaOrgMapping: '—',
    description: 'Structured object typed directly for Next.js App Router app/robots.ts export.',
  },
  {
    name: 'returns (generateRobotsTxt)',
    type: 'Promise<string>',
    required: true,
    schemaOrgMapping: '—',
    description: 'RFC 9309 compliant robots.txt plain-text representation.',
  },
  {
    name: 'returns (createRobotsHandler)',
    type: '{ GET: (req: Request) => Promise<Response> }',
    required: true,
    schemaOrgMapping: '—',
    description: 'Standard Web Response route handler for Next.js, Remix, Astro, or TanStack.',
  },
];

export const helpersSectionRecord: SectionRecord = {
  id: 'helpers',
  pageId: 'docs',
  title: 'Helpers: siteApp.getMetadata()',
  description: 'Next.js Metadata helper that eliminates duplication between your data connector, Schema.org JSON-LD graphs, and HTML <head> meta tags. Since siteApp already knows each page\'s title, description, canonical URL, and base URL from your Single Source of Truth (SSOT), siteApp.getMetadata(pageId) generates fully typed, route-accurate Next.js Metadata in a single line.',
  anchor: 'helpers',
  type: 'WebPageElement',
  content: [
    {
      type: 'list',
      style: 'unordered',
      items: HELPER_FIELDS.map((f) => ({
        title: `${f.name} (${f.type}${f.required ? ', required' : ''})`,
        text: f.description,
      })),
    },
  ],
};

export const sitemapSectionRecord: SectionRecord = {
  id: 'sitemap-helper',
  pageId: 'docs',
  title: 'Helpers: siteApp.getSitemap() & XML Generation',
  description: 'Automated sitemap generator that derives route URLs directly from your connector schema (webpage: [...]). Eliminates maintaining hardcoded XML files or duplicate route lists. Provides typed Next.js App Router metadata, web-standard route handlers, and static XML formatting.',
  anchor: 'sitemap',
  type: 'WebPageElement',
  content: [
    {
      type: 'list',
      style: 'unordered',
      items: SITEMAP_FIELDS.map((f) => ({
        title: `${f.name} (${f.type}${f.required ? ', required' : ''})`,
        text: f.description,
      })),
    },
  ],
};

export const robotsSectionRecord: SectionRecord = {
  id: 'robots-helper',
  pageId: 'docs',
  title: 'Helpers: siteApp.getRobots() & AI Agent Controls',
  description: 'Configures search engine indexing policies, automatically links your canonical sitemap and host, and provides first-class controls for LLM search bots (PerplexityBot) and AI training crawlers (GPTBot, ClaudeBot, Google-Extended).',
  anchor: 'robots',
  type: 'WebPageElement',
  content: [
    {
      type: 'list',
      style: 'unordered',
      items: ROBOTS_FIELDS.map((f) => ({
        title: `${f.name} (${f.type}${f.required ? ', required' : ''})`,
        text: f.description,
      })),
    },
  ],
};
