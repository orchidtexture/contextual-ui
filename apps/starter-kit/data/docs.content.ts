import type { SectionRecord } from 'contextual-ui';

export const docsSections: SectionRecord[] = [
  {
    id: 'schema-registries',
    pageId: 'docs',
    title: 'Schema Registries & defineSchema',
    description: 'defineSchema allows you to compose pre-built, type-validated Schema.org registries and custom Zod schemas into a unified contract. Each registry automatically validates runtime data, generates compile-time TypeScript types, and compiles referentially linked Schema.org @graph JSON-LD nodes.',
    anchor: 'schemas',
    type: 'WebPageElement',
  },
  {
    id: 'auto-form',
    pageId: 'docs',
    title: 'AutoForm & formRegistry',
    description: '<AutoForm> unifies Headless CMS form definitions, dynamic in-memory Zod validation, and machine-readable Schema.org PotentialAction JSON-LD graphs for AI agents. Define your form structure in your CMS or connector, and render dynamic accessible UI without writing repetitive React field boilerplate.',
    anchor: 'auto-form',
    type: 'WebPageElement',
  },
  {
    id: 'create-form',
    pageId: 'docs',
    title: 'createForm (Static Form Factory)',
    description: 'The createForm factory generates headless, strictly type-safe React form components directly from a hardcoded Zod schema. Ideal for developer-centric custom forms with fixed field requirements, providing automatic blur validation, field name autocompletion, and zero-state boilerplate.',
    anchor: 'create-form',
    type: 'WebPageElement',
  },
  {
    id: 'connectors',
    pageId: 'docs',
    title: 'Connectors & Data Layer',
    description: 'Connectors decouple your data sources (Static JSON, Headless CMS, Database ORMs, or REST APIs) from your React UI components and SEO knowledge graphs. Any source that fulfills the simple contract can be plugged into createContextualApp.',
    anchor: 'connectors',
    type: 'WebPageElement',
  },
  {
    id: 'helpers',
    pageId: 'docs',
    title: 'Helpers: siteApp.getMetadata()',
    description: 'Next.js Metadata helper that eliminates duplication between your data connector, Schema.org JSON-LD graphs, and HTML <head> meta tags. Since siteApp already knows each page\'s title, description, canonical URL, and base URL from your Single Source of Truth (SSOT), siteApp.getMetadata(pageId) generates fully typed, route-accurate Next.js Metadata in a single line.',
    anchor: 'helpers',
    type: 'WebPageElement',
  },
];
