import type { SectionRecord } from 'contextual-ui';
import type { SchemaField } from './registries.content';

export interface ComponentShowcaseRecord {
  id: string;
  anchor: string;
  title: string;
  description: string;
  fields: SchemaField[];
  codeString: string;
  schemaString: string;
  exampleDescription?: string;
  schemaDescription?: string;
}

export const SHOWCASE_COMPONENTS_DATA: ComponentShowcaseRecord[] = [
  {
    id: 'contextual-site',
    anchor: 'contextual-site',
    title: '<ContextualSite /> Provider',
    description: 'The root provider that coordinates domain-level data distribution to all contextual UI components. In single-page apps (SPAs), it compiles and injects the unified Schema.org JSON-LD @graph.',
    exampleDescription: 'Wrap your root layout with ContextualSite to provide data across all components.',
    schemaDescription: 'Unified Schema.org @graph automatically injected in a single script tag for SPAs.',
    fields: [
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
    ],
    codeString: `import { siteApp } from '@/data/site.server';
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
}`,
    schemaString: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://contextual.site/#website",
          "name": "Contextual UI Starter Kit",
          "url": "https://contextual.site",
          "description": "A headless UI and semantic SEO Knowledge Graph starter kit."
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
          "isPartOf": { "@id": "https://contextual.site/#webpage" }
        },
        {
          "@type": "FAQPage",
          "@id": "https://contextual.site/#faq",
          "isPartOf": { "@id": "https://contextual.site/#webpage" }
        },
        {
          "@type": "WPFooter",
          "@id": "https://contextual.site/#footer",
          "isPartOf": { "@id": "https://contextual.site/#webpage" }
        }
      ]
    }, null, 2),
  },
  {
    id: 'webpage',
    anchor: 'webpage',
    title: '<WebPage /> Wrapper',
    description: 'The route-level React Server Component that coordinates page-level Schema.org metadata and automatically injects the canonical @graph script tag for that specific URL.',
    exampleDescription: 'Wrap individual routes in page.tsx with WebPage from contextual-ui/server.',
    schemaDescription: 'Route-accurate Schema.org WebPage node connecting navbar, footer, and FAQ.',
    fields: [
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
    ],
    codeString: `import { siteApp } from '@/data/site.server';
import { WebPage } from 'contextual-ui/server';
import { DocsClient } from './DocsClient';

export const generateMetadata = () => siteApp.getMetadata('docs');

export default async function DocsPage() {
  const data = await siteApp.fetchData();

  return (
    <WebPage app={siteApp} id="docs">
      <DocsClient data={data} />
    </WebPage>
  );
}`,
    schemaString: JSON.stringify({
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
    }, null, 2),
  },
  {
    id: 'navbar',
    anchor: 'navbar',
    title: 'Navbar',
    description: 'The Navbar component renders accessible navigation structures with full semantic support.',
    exampleDescription: 'React component implementation using Navbar subcomponents.',
    schemaDescription: 'Schema.org SiteNavigationElement automatically injected in the DOM.',
    fields: [
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
    ],
    codeString: `<Navbar.Root data={data.navbar} className="flex justify-between items-center w-full">
  <Navbar.Brand className="font-bold text-lg no-underline flex items-center gap-2.5" />
  <Navbar.Links
    className="hidden md:flex gap-6 items-center"
    linkClassName="hover:text-silver no-underline text-sm font-medium transition-colors"
  >
    {/* Optional: Appended custom action / external link */}
    <Navbar.Link
      href="https://github.com/orchidtexture/contextual-ui"
      external
      className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800"
    >
      GitHub
    </Navbar.Link>
  </Navbar.Links>
  <Navbar.Toggle className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 focus:outline-none cursor-pointer" />
  <Navbar.Menu
    className="absolute top-16 left-[-24px] right-[-24px] md:hidden bg-zinc-950/95 backdrop-blur-xl border-b border-base p-6 flex flex-col gap-4 shadow-2xl"
    linkClassName="hover:text-silver no-underline text-base font-medium transition-colors py-1"
  />
</Navbar.Root>`,
    schemaString: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      "@id": "https://contextual.site/#navbar",
      "isPartOf": { "@id": "https://contextual.site/#webpage" },
      "name": "Contextual UI",
      "url": "/",
      "hasPart": [
        { "@type": "SiteNavigationElement", "name": "Home", "url": "/" },
        { "@type": "SiteNavigationElement", "name": "Docs", "url": "/docs" },
        { "@type": "SiteNavigationElement", "name": "Schema Graph", "url": "/schema" }
      ]
    }, null, 2),
  },
  {
    id: 'footer',
    anchor: 'footer',
    title: 'Footer',
    description: 'The Footer component organizes structured site links, brand metadata, columnar resources, social profiles, and legal attribution with automatic Schema.org WPFooter structured data injection.',
    exampleDescription: 'Accessible, schema-driven multi-column footer layout.',
    schemaDescription: 'Schema.org WPFooter automatically injected in the DOM.',
    fields: [
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
    ],
    codeString: `<Footer.Root data={data.footer} className="w-full space-y-8">
  {/* Top Section: Brand & Multi-Column Navigation */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    <div className="md:col-span-2 space-y-3">
      <Footer.Brand className="font-bold text-base no-underline flex items-center gap-2.5 text-zinc-100">
        <img src="/images/onigiri_logo.svg" alt="Contextual" className="w-6 h-6 rounded object-contain" />
        <span>Contextual</span>
      </Footer.Brand>
      <Footer.Description className="text-xs text-zinc-400 max-w-sm leading-relaxed">
        Headless UI components with built-in Agentic AI infrastructure and Schema.org SEO.
      </Footer.Description>
    </div>
  </div>
</Footer.Root>`,
    schemaString: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WPFooter",
      "@id": "https://contextual.site/#footer",
      "isPartOf": { "@id": "https://contextual.site/#webpage" },
      "name": "Contextual UI",
      "copyrightYear": 2026
    }, null, 2),
  },
  {
    id: 'breadcrumb',
    anchor: 'breadcrumb',
    title: 'Breadcrumb',
    description: 'The Breadcrumb component automatically injects Schema.org BreadcrumbList JSON-LD for search engine indexing while enforcing accessible semantic navigation.',
    exampleDescription: 'Accessible breadcrumb trail implementation with list items and separators.',
    schemaDescription: 'Schema.org BreadcrumbList automatically injected in the DOM.',
    fields: [
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
    ],
    codeString: `<Breadcrumb.Root data={breadcrumbData} baseUrl="https://contextual.site">
  <Breadcrumb.List className="flex list-none p-0 m-0 gap-2 items-center text-sm">
    {breadcrumbData.map((item, index) => (
      <Breadcrumb.Item key={item.id}>
        <Breadcrumb.Link href={item.url}>{item.label}</Breadcrumb.Link>
      </Breadcrumb.Item>
    ))}
  </Breadcrumb.List>
</Breadcrumb.Root>`,
    schemaString: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://contextual.site/" },
        { "@type": "ListItem", "position": 2, "name": "Docs", "item": "https://contextual.site/docs" }
      ]
    }, null, 2),
  },
  {
    id: 'faq',
    anchor: 'faq',
    title: 'FAQ',
    description: 'The FAQ component organizes collapsible question-and-answer pairs with automatic Schema.org FAQPage structured data injection.',
    exampleDescription: 'Collapsible FAQ layout with trigger buttons and content sections.',
    schemaDescription: 'Schema.org FAQPage automatically injected in the DOM.',
    fields: [
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
    ],
    codeString: `<Faq.Root data={faqData}>
  {faqData.map((item) => (
    <Faq.Item key={item.id} id={item.id}>
      <Faq.Trigger>{item.question}</Faq.Trigger>
      <Faq.Content>{item.answer}</Faq.Content>
    </Faq.Item>
  ))}
</Faq.Root>`,
    schemaString: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://contextual.site/#faq",
      "isPartOf": { "@id": "https://contextual.site/#webpage" },
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is Contextual UI?",
          "acceptedAnswer": { "@type": "Answer", "text": "A headless UI + SEO library." }
        }
      ]
    }, null, 2),
  },
  {
    id: 'section',
    anchor: 'section',
    title: '<Section /> Primitive',
    description: 'Semantic container component for structured content regions. Coordinates automated headings, accessible aria-labelledby attributes, Radix Slot (asChild) support, and embedded <Content /> rendering.',
    exampleDescription: 'Accessible, schema-bound section layout using Section compound components.',
    schemaDescription: 'Schema.org WebPageElement automatically linked to the owning WebPage.',
    fields: [
      {
        name: 'data',
        type: 'SectionRecord',
        required: false,
        schemaOrgMapping: '@graph (WebPageElement)',
        description: 'Single Source of Truth section data (title, subtitle, description, anchor, content blocks).',
      },
      {
        name: 'id',
        type: 'string',
        required: false,
        schemaOrgMapping: '@id',
        description: 'Unique section identifier. Used for aria-labelledby and DOM id fallback.',
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        schemaOrgMapping: 'name',
        description: 'Explicit section title override (bypasses data.title lookup).',
      },
      {
        name: 'subtitle',
        type: 'string',
        required: false,
        schemaOrgMapping: '—',
        description: 'Explicit section subtitle or eyebrow text override.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        schemaOrgMapping: 'description',
        description: 'Explicit section description override.',
      },
      {
        name: 'anchor',
        type: 'string',
        required: false,
        schemaOrgMapping: 'url',
        description: 'DOM element anchor id used for fragment URL navigation.',
      },
      {
        name: 'asChild',
        type: 'boolean',
        required: false,
        schemaOrgMapping: '—',
        description: 'Merges section behaviors and data attributes onto its immediate child element (Radix Slot).',
      },
    ],
    codeString: `<Section.Root data={sectionData} id="features" className="space-y-4">
  <Section.Title as="h2" className="text-xl font-bold" />
  <Section.Subtitle className="text-xs text-accent font-mono" />
  <Section.Description className="text-sm text-zinc-400" />
  <Section.Content className="space-y-3" />
</Section.Root>`,
    schemaString: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPageElement",
      "@id": "https://contextual.site/#section:docs:features",
      "name": "Core Features",
      "description": "Structured content with built-in Agentic AI and Schema.org SEO.",
      "url": "#features",
      "isPartOf": { "@id": "https://contextual.site/#webpage" }
    }, null, 2),
  },
  {
    id: 'collection',
    anchor: 'collection',
    title: '<Collection /> Primitive',
    description: 'Headless list container component that renders ordered (<ol>) or unordered (<ul>) semantic collections with individual item context, stable ID tracking, and automated Schema.org ItemList markup.',
    exampleDescription: 'Structured item collection rendered with semantic Collection compound components.',
    schemaDescription: 'Schema.org ItemList containing individual ListItem nodes.',
    fields: [
      {
        name: 'data',
        type: 'CollectionRecord',
        required: true,
        schemaOrgMapping: '@graph (ItemList)',
        description: 'Single Source of Truth collection record containing collection metadata and items array.',
      },
      {
        name: 'ordered',
        type: 'boolean',
        required: false,
        schemaOrgMapping: 'itemListOrder',
        description: 'Renders semantic <ol> when true, <ul> when false. Sets data-ordered attribute.',
      },
      {
        name: 'asChild',
        type: 'boolean',
        required: false,
        schemaOrgMapping: '—',
        description: 'Merges collection behaviors and data attributes onto child component.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        schemaOrgMapping: '—',
        description: 'Collection items rendered within collection context.',
      },
    ],
    codeString: `<Collection.Root data={collectionData} ordered className="space-y-4">
  {collectionData.items.map((item, index) => (
    <Collection.Item key={item.id} id={item.id} index={index} className="flex gap-3">
      <span className="font-mono text-accent">{index + 1}</span>
      <div>
        <Collection.Title as="h3" className="font-semibold text-white" />
        <Collection.Description className="text-sm text-zinc-400" />
      </div>
    </Collection.Item>
  ))}
</Collection.Root>`,
    schemaString: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": "https://contextual.site/#itemlist:docs:steps",
      "name": "Quickstart Guide",
      "numberOfItems": 2,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "@id": "https://contextual.site/#listitem:docs:steps:1", "name": "Install Dependencies" },
        { "@type": "ListItem", "position": 2, "@id": "https://contextual.site/#listitem:docs:steps:2", "name": "Define Site Schema" }
      ]
    }, null, 2),
  },
  {
    id: 'content',
    anchor: 'content',
    title: '<Content /> Portable Renderer',
    description: 'Universal renderer for portable, CMS-agnostic content blocks (paragraphs, headings, lists, links, callouts, and code blocks) with custom component slot overrides and plain-text extraction for AI agents.',
    exampleDescription: 'Renders dynamic content blocks with custom Tailwind overrides.',
    schemaDescription: 'All plain text from content blocks is extracted into the parent node text property.',
    fields: [
      {
        name: 'data',
        type: 'ContentInput',
        required: true,
        schemaOrgMapping: 'text (extracted plain-text)',
        description: 'Single or array of ContentBlocks, raw markdown string, or structured Portable Text blocks.',
      },
      {
        name: 'components',
        type: 'ContentComponentOverrides',
        required: false,
        schemaOrgMapping: '—',
        description: 'Custom React component slots for paragraph, heading, list, callout, code, link.',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        schemaOrgMapping: '—',
        description: 'Optional CSS class name for the wrapper container.',
      },
    ],
    codeString: `<Content
  data={section.content}
  components={{
    paragraph: ({ children, role }) => (
      <p className={role === 'qualifier' ? 'text-xs text-accent italic' : 'text-sm text-zinc-300'}>
        {children}
      </p>
    ),
    code: ({ code, language }) => (
      <pre className="p-4 bg-zinc-900 rounded-lg font-mono text-xs text-zinc-100">{code}</pre>
    ),
  }}
/>`,
    schemaString: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPageElement",
      "name": "Documentation Article",
      "text": "Full extracted plain-text of all headings, paragraphs, and list items for AI agents."
    }, null, 2),
  },
];

export const showcaseSections: SectionRecord[] = SHOWCASE_COMPONENTS_DATA.map((showcase) => ({
  id: `showcase-${showcase.id}`,
  pageId: 'docs',
  anchor: showcase.anchor,
  title: showcase.title,
  description: showcase.description,
  type: 'WebPageElement',
  content: [
    {
      type: 'list',
      style: 'unordered',
      items: showcase.fields.map((f) => ({
        title: `${f.name} (${f.type}${f.required ? ', required' : ''}${f.schemaOrgMapping && f.schemaOrgMapping !== '—' ? ` -> ${f.schemaOrgMapping}` : ''})`,
        text: f.description,
      })),
    },
    {
      type: 'code',
      filename: `${showcase.id}.tsx`,
      language: 'typescript',
      code: showcase.codeString,
    },
    ...(showcase.exampleDescription ? [{ type: 'paragraph' as const, role: 'normal' as const, text: showcase.exampleDescription }] : []),
    ...(showcase.schemaDescription ? [{ type: 'paragraph' as const, role: 'normal' as const, text: showcase.schemaDescription }] : []),
  ],
}));
