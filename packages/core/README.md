# @contextual-ui/core

**Contextual UI Core** is the foundational headless component library designed for the modern web—where your UI isn't just consumed by humans, but also by search engines and AI agents.

Built with **React**, **Zod**, and **Radix UI**, it provides the infrastructure to build accessible, type-safe, and SEO-optimized components with zero design opinion, paired with an integrated Schema.org Knowledge Graph engine.

## 📦 Installation

```bash
npm install @contextual-ui/core zod
# or
pnpm add @contextual-ui/core zod
```

---

## 🚀 Quickstart: The Single Source of Truth (SSOT) Pattern

### 1. Define Schema (`site.schema.ts`)
Combine standard Zod schemas with pre-built registries that automatically generate Schema.org JSON-LD:

```typescript
import { defineSchema, websiteRegistry, navbarRegistry, faqRegistry } from '@contextual-ui/core/server';
import { z } from 'zod';

export const siteSchema = defineSchema({
  website: websiteRegistry(),
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
import { staticConnector } from '@contextual-ui/connector-static';
import { createContextualApp, InferData } from '@contextual-ui/core/server';

const connector = staticConnector({
  website: { name: 'My App', url: 'https://example.com' },
  faq: [{ id: '1', question: 'What is this?', answer: 'An SSOT UI kit.' }],
  navbar: { links: [{ id: '1', label: 'Home', href: '/' }] },
  announcement: { enabled: true, message: 'Welcome!' },
});

export const siteApp = createContextualApp({
  schema: siteSchema,
  connector,
});

// Fully inferred TypeScript types for your components
export type SiteData = InferData<typeof siteSchema>;
```

### 3. Consume in Server Components (`app/page.tsx`)
Fetch data with zero manual hydration boilerplate and complete type safety:

```tsx
import { siteApp } from '@/data/site.server';
import { Faq } from '@contextual-ui/core';

export default async function Page() {
  const data = await siteApp.fetchData();

  return (
    <Faq.Root data={data.faq}>
      {data.faq.map((item) => (
        <Faq.Item key={item.id} id={item.id}>
          <Faq.Trigger>{item.question}</Faq.Trigger>
          <Faq.Content>{item.answer}</Faq.Content>
        </Faq.Item>
      ))}
    </Faq.Root>
  );
}
```

---

## 🌐 Structured Data Architecture: Global Graph vs. Route-Level Metadata

Contextual UI components distinguish between two fundamental types of structured data:

### 1. Global Knowledge Graph Entities (Domain-Level)
* **Components & Schemas:** `websiteRegistry` (`WebSite`), `navbarRegistry` (`SiteNavigationElement`), `faqRegistry` (`FAQPage`), `Organization`, `Article`, `Product`.
* **Where they live:** Defined centrally in your `siteSchema` (Single Source of Truth) and backed by CMS/connectors or databases.
* **How they are consumed:**
  1. Rendered in React UI for users.
  2. Injected into HTML via `<script type="application/ld+json">`.
  3. Exported sitewide to `/api/graph.json` via `@contextual-ui/jsonld-graph-builder` for search engine knowledge graphs and AI agent ingestion.

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

export const { GET } = siteApp.createGraphHandler({
  graphOptions: {
    baseUrl: 'https://example.com',
    flatten: true,
    dedupeStrategy: 'merge',
  },
});
```

### Using Standalone `createGraphRouteHandler`

```typescript
// app/api/graph.json/route.ts
import { siteSchema } from '@/data/site.schema';
import { siteConnector } from '@/data/site.server';
import { createGraphRouteHandler } from '@contextual-ui/core/server';

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
import { defineSchema, websiteRegistry, navbarRegistry, faqRegistry } from '@contextual-ui/core/server';

export const siteSchema = defineSchema({
  website: websiteRegistry(),
  navbar: navbarRegistry(),
  faq: faqRegistry(),
});
```

### 2. FAQ (`faqRegistry` & `<Faq />`)
Handles collapsible state, accessible ARIA roles, and automatically generates Schema.org `FAQPage`, `Question`, and `Answer` nodes with linked `@id` identifiers.

```tsx
import { Faq } from '@contextual-ui/core';

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
import { Navbar } from '@contextual-ui/core';

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

### 4. Breadcrumb (`breadcrumbRegistry` & `<Breadcrumb />`)
Renders accessible breadcrumb hierarchy and emits Schema.org `BreadcrumbList` JSON-LD directly into the page DOM.

```tsx
import { Breadcrumb } from '@contextual-ui/core';

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

### 5. Form Factory (`createForm`)
Type-safe form builder generated directly from standard Zod schemas.

```tsx
'use client';
import { createForm } from '@contextual-ui/core';
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
