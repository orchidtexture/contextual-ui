# contextual-ui

**Contextual UI** is the foundational headless component library designed for the modern web—where your UI isn't just consumed by humans, but also by search engines and AI agents.

Built with **React**, **Zod**, and **Radix UI**, it provides the infrastructure to build accessible, type-safe, and SEO-optimized components with zero design opinion, paired with an integrated Schema.org Knowledge Graph engine.

## 📦 Installation

```bash
npm install contextual-ui zod
# or
pnpm add contextual-ui zod
```

---

## 🚀 Quickstart: The Single Source of Truth (SSOT) Pattern

### 1. Define Schema (`site.schema.ts`)
Combine standard Zod schemas with pre-built registries that automatically generate Schema.org JSON-LD:

```typescript
import {
  defineSchema,
  websiteRegistry,
  webpageRegistry,
  navbarRegistry,
  faqRegistry,
} from 'contextual-ui/server';
import { z } from 'zod';

export const siteSchema = defineSchema({
  website: websiteRegistry(),
  webpage: webpageRegistry(),
  navbar: navbarRegistry(),
  faq: faqRegistry(),
  announcement: {
    schema: z.object({
      enabled: z.boolean(),
      message: z.string().describe('Announcement text'),
    }),
  },
});
```

### 2. Connect & Wrap into Contextual App (`site.server.ts`)
Use `createContextualApp` to combine your schema and data connector into a unified, fully typed application context:

```typescript
import { siteSchema } from './site.schema';
import { staticConnector } from 'contextual-ui-connector-static';
import { createContextualApp, InferData } from 'contextual-ui/server';

const connector = staticConnector({
  website: { name: 'My App', url: 'https://example.com' },
  faq: [{ id: '1', question: 'What is this?', answer: 'An SSOT UI kit.' }],
  navbar: { links: [{ id: '1', label: 'Home', href: '/' }] },
  announcement: { enabled: true, message: 'Welcome!' },
});

export const siteApp = createContextualApp({
  schema: siteSchema,
  connector,
  baseUrl: 'https://example.com',
});

// Fully inferred TypeScript types for your components
export type SiteData = InferData<typeof siteSchema>;
```

### 3. Render with `ContextualSite` & `WebPage` (`app/layout.tsx` and `app/page.tsx`)
Wrap your layout or app root with `ContextualSite` to distribute global data, and wrap routes with `<WebPage />` from `contextual-ui/server` to inject route-accurate Schema.org JSON-LD graphs:

```tsx
// app/layout.tsx
import { siteApp } from '@/data/site.server';
import { ContextualSite } from 'contextual-ui';
import { Navbar } from '@/components/Navbar';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const data = await siteApp.fetchData();

  return (
    <html lang="en">
      <body>
        <ContextualSite data={data} options={{ disableJsonLdScript: true }}>
          <Navbar />
          {children}
        </ContextualSite>
      </body>
    </html>
  );
}
```

```tsx
// app/docs/page.tsx
import { siteApp } from '@/data/site.server';
import { WebPage } from 'contextual-ui/server';
import { DocsClient } from './DocsClient';

export default async function DocsPage() {
  const data = await siteApp.fetchData({
    webpage: {
      name: 'Docs',
      url: '/docs',
    },
  });

  return (
    <WebPage app={siteApp} name="Docs" url="/docs">
      <DocsClient data={data} />
    </WebPage>
  );
}
```

> **Note:** Child components can also be used standalone (outside `ContextualSite`), in which case you pass `data={...}` explicitly and they will render their own local `<script type="application/ld+json">` tag. When wrapped in `ContextualSite`, inline script tags are automatically suppressed in favor of the unified site graph.

---

## 🏛️ Site Wrapper: `<ContextualSite />`

`ContextualSite` coordinates domain-level data distribution and Schema.org `WebSite` graph generation across your entire site:

* **Unified `@graph` Generation:** Compiles all schema sections into a single Schema.org `@graph` object, deduplicating shared entities (e.g. `@id: 'website'`).
* **Contextual Data Distribution:** Child components (`Navbar.Root`, `Faq.Root`, `Breadcrumb.Root`) automatically retrieve their respective data slice from context without manual prop passing.
* **Custom Section Keys:** Use `sectionKey="myCustomKey"` on child components if your schema uses custom section names.
* **Slot / Layout Support:** Supports `asChild` via Radix UI Slot, allowing you to attach site context directly onto existing container elements.

### Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `data` | `SiteData \| HydratedContext` | Data object matching the schema or a hydrated context. |
| `graph` | `JsonLdGraphResult` | Pre-built Schema.org graph (ideal for passing across Server/Client boundary in RSC). |
| `schema` | `SchemaDefinition` | Schema definition returned by `defineSchema(...)` (for client usage). |
| `options` | `ContextualSiteOptions` | Graph configuration (e.g., `baseUrl`, `dedupeStrategy`, `disableJsonLdScript`). |
| `asChild` | `boolean` | If true, merges props onto the immediate child element instead of rendering a `<div>`. |
| `className` | `string` | CSS class name for the wrapper element. |

---

## 📱 Architecture Patterns: SPAs vs. Multi-Page Applications

Contextual UI supports both Single-Page Applications (SPAs) and Server-Rendered Multi-Page Applications (Next.js App Router):

### Pattern 1: Multi-Page Applications (Next.js App Router)
In multi-page architectures, layout components (`<ContextualSite>`) distribute global data (`navbar`, `footer`), while `<WebPage>` in each `page.tsx` generates route-specific Schema.org JSON-LD scripts with accurate URLs and titles:

* **Root Layout (`app/layout.tsx`)**: Wraps the tree with `<ContextualSite data={data}>` (no `graph` prop passed, so no sitewide script is injected).
* **Page (`app/docs/page.tsx`)**: Wraps content with `<WebPage app={siteApp} name="Docs" url="/docs">`, which compiles and injects the route-accurate Schema.org graph.

### Pattern 2: Single-Page Applications & Landing Pages (Vite, CRA, or 1-Page Next.js)
If your app is a single landing page without multiple sub-routes, `<ContextualSite>` handles everything in one place:

```tsx
// App.tsx (Single Landing Page / SPA)
import { ContextualSite, Navbar, Faq, Footer } from 'contextual-ui';
import { siteSchema } from './site.schema';
import { siteData } from './site.data';

export default function App() {
  return (
    <ContextualSite schema={siteSchema} data={siteData}>
      <Navbar.Root />
      <main>
        <Faq.Root />
      </main>
      <Footer.Root />
    </ContextualSite>
  );
}
```
In this mode, `<ContextualSite>` compiles the unified Schema.org `@graph` (combining `Organization`, `WebSite`, `WebPage`, `Navbar`, `FAQPage`, `Footer`) and injects the `<script type="application/ld+json">` automatically.

### Pattern 3: Client-Routed SPAs (React Router / TanStack Router)
For SPAs with client-side routing:
* Put `<ContextualSite data={siteData}>` around your root router.
* Render `<WebPage name="Docs" url="/docs">` inside each client route view to dynamically set route metadata.

---

## 🌐 Structured Data Architecture: Global Graph vs. Route-Level Metadata

Contextual UI components distinguish between two fundamental types of structured data:

### 1. Global Knowledge Graph Entities (Domain-Level)
* **Components & Schemas:** `websiteRegistry` (`WebSite`), `navbarRegistry` (`SiteNavigationElement`), `faqRegistry` (`FAQPage`), `Organization`, `Article`, `Product`.
* **Where they live:** Defined centrally in your `siteSchema` (Single Source of Truth) and backed by CMS/connectors or databases.
* **How they are consumed:**
  1. Rendered in React UI for users.
  2. Injected into HTML via `<script type="application/ld+json">`.
  3. Exported sitewide to `/api/graph.json` via `jsonld-graph-builder` for search engine knowledge graphs and AI agent ingestion.

### 2. Ephemeral Route-Level Metadata (Page-Level Hierarchy)
* **Components & Schemas:** `breadcrumbRegistry` (`BreadcrumbList`), `WebPage`.
* **Where they live:** Derived dynamically from the active URL (`pathname`), routing params, or local page tree.
* **How they are consumed:**
  1. Rendered as interactive navigation breadcrumbs on the specific page.
  2. Injected directly into that page's HTML `<head>` / DOM for search crawlers visiting that exact URL.
  3. *Not* forced into the global `/api/graph.json` knowledge graph, avoiding unnecessary coupling between ephemeral page paths and centralized data schemas.

---

## ⚡ Global Knowledge Graph Export (`/api/graph.json`)

Contextual UI provides one-line route handler generators to serve a unified, referentially-linked Schema.org `@graph` for search engines and AI agents with zero runtime scraping.

### Using `createContextualApp` (Recommended)

```typescript
// app/api/graph.json/route.ts
import { siteApp } from '@/data/site.server';

// Serves the full Knowledge Graph (inherits baseUrl from createContextualApp)
export const { GET } = siteApp.createGraphHandler({
  includeAll: true, // Exports all schema sections (including non-global ones like FAQ)
  graphOptions: {
    flatten: true,
    dedupeStrategy: 'merge',
  },
});
```

### Graph Filtering & Privacy Options

You can control which schema sections are exported to the `@graph` or layout script:

| Option | Type | Description |
| :--- | :--- | :--- |
| `includeAll` | `boolean` | When `true`, exports all schema sections, bypassing the default `isGlobal: false` filter (e.g. including FAQPage, local page entities). |
| `includeKeys` | `string[]` | Whitelist specific schema sections to include (e.g. `['website', 'navbar', 'faq']`). |
| `excludeKeys` | `string[]` | Exclude specific sensitive or private schema sections (e.g. `['internalAnnouncement', 'adminConfig']`). |
| `graphOptions.baseUrl` | `string` | Override the default `baseUrl` configured in `createContextualApp`. |
| `graphOptions.flatten` | `boolean` | Flattens nested entities to the root `@graph` array with `@id` pointers (default: `true`). |
| `graphOptions.dedupeStrategy` | `'merge' \| 'replace' \| 'keep-first'` | Strategy for resolving entities with duplicate `@id`s (default: `'merge'`). |

### Using Standalone `createGraphRouteHandler`

```typescript
// app/api/graph.json/route.ts
import { siteSchema } from '@/data/site.schema';
import { siteConnector } from '@/data/site.server';
import { createGraphRouteHandler } from 'contextual-ui/server';

export async function GET(req: Request) {
  const rawData = await siteConnector.fetchData();
  const hydrated = siteSchema.hydrate(rawData);

  const handler = createGraphRouteHandler(hydrated, {
    graphOptions: {
      baseUrl: 'https://example.com',
      flatten: true,
      dedupeStrategy: 'merge',
    },
  });

  return handler.GET(req);
}
```

---

## 🧩 Built-in Schema Registries

### 1. WebSite (`websiteRegistry`)
Defines the root `WebSite` entity that interconnects all child components (`navbar`, `faq`) into a single connected knowledge graph.

```typescript
import { defineSchema, websiteRegistry, navbarRegistry, faqRegistry } from 'contextual-ui/server';

export const siteSchema = defineSchema({
  website: websiteRegistry(),
  navbar: navbarRegistry(),
  faq: faqRegistry(),
});
```

### 2. FAQ (`faqRegistry` & `<Faq />`)
Handles collapsible state, accessible ARIA roles, and automatically generates Schema.org `FAQPage`, `Question`, and `Answer` nodes with linked `@id` identifiers.

```tsx
import { Faq } from 'contextual-ui';

const data = [
  { id: '1', question: 'What is Contextual UI?', answer: 'A headless library...' }
];

export function FaqSection() {
  return (
    <Faq.Root data={data}>
      {data.map((item) => (
        <Faq.Item key={item.id} id={item.id}>
          <Faq.Trigger className="accordion-trigger">
            {item.question}
          </Faq.Trigger>
          <Faq.Content className="accordion-content">
            {item.answer}
          </Faq.Content>
        </Faq.Item>
      ))}
    </Faq.Root>
  );
}
```

### 3. Navbar (`navbarRegistry` & `<Navbar />`)
Provides responsive navigation structure, mobile drawer toggles, and injects `SiteNavigationElement` linked upward to the root `WebSite`.

```tsx
import { Navbar } from 'contextual-ui';

const navData = {
  brand: { name: 'Contextual UI', href: '/' },
  links: [
    { id: '1', label: 'Features', href: '#features' },
    { id: '2', label: 'Docs', href: '/docs' },
  ]
};

export function Header() {
  return (
    <Navbar.Root data={navData} className="flex justify-between p-4">
      <Navbar.Brand href="/" className="font-bold text-xl" />
      <Navbar.Content className="hidden md:flex gap-4">
        {navData.links.map(link => (
          <a key={link.id} href={link.href}>{link.label}</a>
        ))}
      </Navbar.Content>
      <Navbar.Toggle className="md:hidden" />
      <Navbar.Menu className="md:hidden flex flex-col mt-4">
        {navData.links.map(link => (
          <a key={link.id} href={link.href} className="py-2">{link.label}</a>
        ))}
      </Navbar.Menu>
    </Navbar.Root>
  );
}
```

### 4. Footer (`footerRegistry` & `<Footer />`)
Provides structured footer navigation, columnar and flat link organization, social profiles, and copyright handling while injecting Schema.org `WPFooter` and `SiteNavigationElement` nodes into the global Knowledge Graph.

```tsx
import { Footer } from 'contextual-ui';

const footerData = {
  brand: {
    name: 'Contextual UI',
    description: 'Headless UI with built-in Agentic AI and Schema.org SEO.',
  },
  columns: [
    {
      id: 'resources',
      title: 'Resources',
      links: [
        { id: '1', label: 'Docs', href: '/docs' },
        { id: '2', label: 'Schema Graph', href: '/schema' },
      ],
    },
  ],
  socials: [
    { id: '1', platform: 'github', href: 'https://github.com/tasuku-io' },
  ],
  copyright: {
    holder: 'Tasuku Studio',
  },
};

export function SiteFooter() {
  return (
    <Footer.Root data={footerData} className="p-8 border-t">
      <Footer.Brand />
      <Footer.Description />
      <Footer.Columns>
        <Footer.Column id="resources">
          <Footer.ColumnTitle />
          <Footer.Links />
        </Footer.Column>
      </Footer.Columns>
      <Footer.Socials />
      <Footer.Copyright />
    </Footer.Root>
  );
}
```

### 5. Breadcrumb (`breadcrumbRegistry` & `<Breadcrumb />`)
Renders accessible breadcrumb hierarchy and emits Schema.org `BreadcrumbList` JSON-LD directly into the page DOM.

```tsx
import { Breadcrumb } from 'contextual-ui';

const breadcrumbData = [
  { id: '1', label: 'Home', url: '/' },
  { id: '2', label: 'Documentation', url: '/docs' },
  { id: '3', label: 'Core Components', url: '/docs/core' }
];

export function PageBreadcrumbs() {
  return (
    <Breadcrumb.Root data={breadcrumbData} baseUrl="https://yoursite.com">
      <Breadcrumb.List className="flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbData.map((item, index) => {
          const isLast = index === breadcrumbData.length - 1;
          return (
            <Breadcrumb.Item key={item.id} id={item.id} className="flex items-center space-x-2">
              {isLast ? (
                <Breadcrumb.Page className="font-semibold text-gray-900">
                  {item.label}
                </Breadcrumb.Page>
              ) : (
                <>
                  <Breadcrumb.Link href={item.url} className="hover:underline text-blue-600">
                    {item.label}
                  </Breadcrumb.Link>
                  <Breadcrumb.Separator className="text-gray-400">
                    /
                  </Breadcrumb.Separator>
                </>
              )}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}
```

### 6. Form Factory (`createForm`)
Type-safe form builder generated directly from standard Zod schemas.

```tsx
'use client';
import { createForm } from 'contextual-ui';
import { z } from 'zod';

const ContactSchema = z.object({
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message too short"),
});

const Form = createForm(ContactSchema);

export default function ContactSection() {
  return (
    <Form.Root onSubmit={(data) => console.log(data)}>
      <Form.Section title="Contact Us">
        <Form.Field name="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Input />
          <Form.ErrorMessage />
        </Form.Field>
        <Form.Field name="message">
          <Form.Label>Message</Form.Label>
          <Form.TextArea />
          <Form.ErrorMessage />
        </Form.Field>
      </Form.Section>
      <Form.Submit>Send Message</Form.Submit>
    </Form.Root>
  );
}
```

---

## 🛠️ Customization

Every UI component supports the `asChild` pattern via Radix UI, allowing you to use your own styled components or design systems (Tailwind CSS, Shadcn UI, etc.):

```tsx
<Form.Submit asChild>
  <button className="your-custom-tailwind-classes">
    Submit
  </button>
</Form.Submit>
```

---

## 📜 License

MIT © Tasuku Studio, Inc.
