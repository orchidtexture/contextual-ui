import type { SectionRecord } from 'contextual-ui';
import { autoFormSectionRecord, createFormSectionRecord } from './forms.content';
import { helpersSectionRecord, sitemapSectionRecord, robotsSectionRecord } from './helpers.content';

export const docsSections: SectionRecord[] = [
  {
    id: 'schema-registries',
    pageId: 'docs',
    title: 'Schema Registries & defineSchema',
    description: 'defineSchema allows you to compose pre-built, type-validated Schema.org registries and custom Zod schemas into a unified contract. Each registry automatically validates runtime data, generates compile-time TypeScript types, and compiles referentially linked Schema.org @graph JSON-LD nodes.',
    anchor: 'schemas',
    type: 'WebPageElement',
  },
  autoFormSectionRecord,
  createFormSectionRecord,
  {
    id: 'connectors',
    pageId: 'docs',
    title: 'Connectors & Data Layer',
    description: 'Connectors decouple your data sources (Static JSON, Headless CMS, Database ORMs, or REST APIs) from your React UI components and SEO knowledge graphs. Any source that fulfills the simple contract can be plugged into createContextualApp.',
    anchor: 'connectors',
    type: 'WebPageElement',
  },
  helpersSectionRecord,
  sitemapSectionRecord,
  robotsSectionRecord,
];
