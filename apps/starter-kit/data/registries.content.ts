import type { CollectionRecord } from 'contextual-ui';

export interface SchemaField {
  name: string;
  type: string;
  required?: boolean;
  schemaOrgMapping?: string;
  description: string;
}

export interface RegistryItem {
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

export const REGISTRIES_DATA: RegistryItem[] = [
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
  {
    id: 'section',
    name: 'sectionRegistry',
    signature: 'sectionRegistry() / sectionsRegistry()',
    schemaType: 'WebPageElement',
    schemaUrl: 'https://schema.org/WebPageElement',
    description: 'Declares structured content sections (articles, headings, qualifiers, prose blocks) with automated Schema.org WebPageElement JSON-LD graph generation and plain-text extraction for AI agents.',
    fields: [
      { name: 'id', type: 'string', required: true, schemaOrgMapping: '@id', description: 'Unique section identifier key (e.g. "hero", "features")' },
      { name: 'pageId', type: 'string', required: false, schemaOrgMapping: 'isPartOf (WebPage)', description: 'Route scoping id binding this section to a specific page' },
      { name: 'title', type: 'string', required: false, schemaOrgMapping: 'name', description: 'Section heading text displayed in UI and search graphs' },
      { name: 'subtitle', type: 'string', required: false, schemaOrgMapping: '—', description: 'Optional section subheading or eyebrow text' },
      { name: 'description', type: 'string', required: false, schemaOrgMapping: 'description', description: 'Section summary or lead paragraph' },
      { name: 'anchor', type: 'string', required: false, schemaOrgMapping: 'url', description: 'HTML fragment anchor id (e.g. "features")' },
      { name: 'content', type: 'ContentBlock[]', required: false, schemaOrgMapping: 'text', description: 'Portable content blocks (paragraphs, headings, lists, code, callouts)' },
      { name: 'type', type: 'string', required: false, schemaOrgMapping: '@type', description: 'Schema.org element type (defaults to "WebPageElement")' },
    ],
    sampleCode: `// data/site.schema.ts
import { defineSchema, sectionRegistry } from 'contextual-ui/server';

export const siteSchema = defineSchema({
  sections: sectionRegistry(),
});`,
    sampleData: `// Ingested connector data
sections: [
  {
    id: 'hero',
    pageId: 'home',
    title: 'Next-Gen Semantic Web',
    description: 'Structured content with built-in Agentic AI and Schema.org SEO.',
    content: [
      { type: 'paragraph', role: 'normal', text: 'Define content once in your data layer.' },
    ],
  },
],`,
  },
  {
    id: 'collection',
    name: 'collectionRegistry',
    signature: 'collectionRegistry() / collectionsRegistry()',
    schemaType: 'ItemList',
    schemaUrl: 'https://schema.org/ItemList',
    description: 'Declares ordered or unordered collections of structured items (features, steps, catalog items) with stable ID resolution, position indexing, and automated Schema.org ItemList / ListItem graph nodes.',
    fields: [
      { name: 'id', type: 'string', required: true, schemaOrgMapping: '@id', description: 'Unique collection identifier (e.g. "features", "quickstart-steps")' },
      { name: 'pageId', type: 'string', required: false, schemaOrgMapping: 'isPartOf (WebPage)', description: 'Route scoping id binding this collection to a specific page' },
      { name: 'title', type: 'string', required: false, schemaOrgMapping: 'name', description: 'Collection heading title' },
      { name: 'description', type: 'string', required: false, schemaOrgMapping: 'description', description: 'Collection descriptive summary' },
      { name: 'ordered', type: 'boolean', required: false, schemaOrgMapping: 'itemListOrder', description: 'Specifies whether items represent a sequential ordered list' },
      { name: 'items', type: 'CollectionItem[]', required: true, schemaOrgMapping: 'itemListElement: ListItem[]', description: 'Array of collection items with stable IDs, titles, descriptions, and content blocks' },
      { name: 'items[].id', type: 'string', required: true, schemaOrgMapping: 'ListItem.@id', description: 'Stable unique identifier for the item' },
      { name: 'items[].title', type: 'string', required: false, schemaOrgMapping: 'ListItem.name', description: 'Item display title' },
      { name: 'items[].description', type: 'string', required: false, schemaOrgMapping: 'ListItem.description', description: 'Item summary or description' },
      { name: 'items[].content', type: 'ContentBlock[]', required: false, schemaOrgMapping: 'ListItem.text', description: 'Structured portable content blocks for the item' },
      { name: 'items[].order', type: 'number', required: false, schemaOrgMapping: 'ListItem.position', description: '1-based sequential position index' },
    ],
    sampleCode: `// data/site.schema.ts
import { defineSchema, collectionRegistry } from 'contextual-ui/server';

export const siteSchema = defineSchema({
  collections: collectionRegistry(),
});`,
    sampleData: `// Ingested connector data
collections: [
  {
    id: 'quickstart-steps',
    pageId: 'docs',
    title: 'Quickstart Guide',
    ordered: true,
    items: [
      { id: 'install', title: 'Install Dependencies', order: 1 },
      { id: 'schema', title: 'Define Site Schema', order: 2 },
    ],
  },
],`,
  },
];

export const schemaRegistriesCollection: CollectionRecord = {
  id: 'schema-registries-list',
  pageId: 'docs',
  title: 'Built-in Registries Reference',
  description: 'Select a registry below to inspect its Schema.org specification, field requirements, and usage examples.',
  ordered: false,
  type: 'ItemList',
  items: REGISTRIES_DATA.map((reg) => ({
    id: reg.id,
    type: 'ListItem',
    title: reg.name,
    description: reg.description,
    content: [
      {
        type: 'list',
        style: 'unordered',
        items: reg.fields.map((f) => ({
          title: `${f.name} (${f.type}${f.required ? ', required' : ''}${f.schemaOrgMapping && f.schemaOrgMapping !== '—' ? ` -> ${f.schemaOrgMapping}` : ''})`,
          text: f.description,
        })),
      },
      {
        type: 'code',
        filename: `${reg.id}.schema.ts`,
        language: 'typescript',
        code: reg.sampleCode,
      },
      {
        type: 'code',
        filename: `${reg.id}.data.ts`,
        language: 'typescript',
        code: reg.sampleData,
      },
    ],
  })),
};
