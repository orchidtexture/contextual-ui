# Contextual UI Starter Kit

This is the official reference implementation for **Contextual UI**. It is a [Next.js](https://nextjs.org/) application that demonstrates how to integrate the entire Contextual UI ecosystem—including core components, data connectors, knowledge graph exports, and the CMS dashboard—into a real-world project.

---

## 🚀 What's Included

This starter kit showcases the **Single Source of Truth (SSOT)** pattern:

- **Frontend UI**: Implementing headless `@contextual-ui/core` components (`Navbar`, `Faq`, `Breadcrumb`, `createForm`).
- **Data Connectors**: Using `@contextual-ui/connector-static` to bind schemas to static data sources.
- **Sitewide Knowledge Graph**: Exposing an interconnected Schema.org `/api/graph.json` endpoint via `@contextual-ui/jsonld-graph-builder`.
- **AI Agent API**: Exposing your structured data as clean, agent-readable JSON via `/api/contextual`.
- **CMS Dashboard**: Rendering `@contextual-ui/dashboard` to inspect raw data, validate JSON-LD, and edit content visually.

---

## 🛠️ Getting Started

```bash
# From the root of the monorepo:
pnpm --filter starter-kit dev

# OR from inside the apps/starter-kit directory:
cd apps/starter-kit
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the starter kit.

---

## 📖 Step-by-Step Implementation Guide

Follow these steps to implement Contextual UI in any Next.js App Router project:

### Step 1: Install Dependencies

```bash
pnpm add @contextual-ui/core @contextual-ui/connector-static zod
# or
npm install @contextual-ui/core @contextual-ui/connector-static zod
```

---

### Step 2: Define your Centralized Schema (`data/site.schema.ts`)

Define your data structures using standard Zod schemas combined with Contextual UI's built-in registries. This file is isomorphic (safe for both server and client).

```typescript
// data/site.schema.ts
import { defineSchema, websiteRegistry, navbarRegistry, faqRegistry, cx } from '@contextual-ui/core/server';
import { z } from 'zod';

export const siteSchema = defineSchema({
  // Built-in registries with automatic JSON-LD Schema.org generators
  website: websiteRegistry(),
  navbar: navbarRegistry(),
  faq: faqRegistry(),

  // Custom schema section with UI hints via cx()
  announcement: {
    schema: z.object({
      enabled: z.boolean(),
      message: cx(z.string(), { label: 'Announcement Banner Text', widget: 'text' }),
    }),
  },
});
```

---

### Step 3: Connect your Data Source (`data/site.server.ts`)

Bind your schema to a data source using a server connector (or database/CMS client):

```typescript
// data/site.server.ts
import { staticConnector } from '@contextual-ui/connector-static';

export const siteConnector = staticConnector({
  website: {
    name: 'My Website',
    url: 'https://example.com',
    description: 'A modern Next.js website powered by Contextual UI.',
  },
  navbar: {
    brand: { name: 'My Website', href: '/' },
    links: [
      { id: '1', label: 'Home', href: '/' },
      { id: '2', label: 'Components', href: '/components' },
    ],
  },
  faq: [
    { id: '1', question: 'How does this work?', answer: 'It connects data to UI and SEO automatically.' },
  ],
  announcement: {
    enabled: true,
    message: 'Welcome to our website!',
  },
});
```

---

### Step 4: Render Accessible UI Components (`app/page.tsx`)

Fetch your data on the server and pass it to headless Contextual UI components. These components render accessible markup for users and automatically inject per-page `<script type="application/ld+json">` tags for Googlebot.

```tsx
// app/page.tsx (Server Component)
import { siteConnector } from '@/data/site.server';
import { Faq } from '@contextual-ui/core';

export default async function HomePage() {
  const data = await siteConnector.fetchData();

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Frequently Asked Questions</h1>

      {/* Automatically emits FAQPage Schema.org JSON-LD */}
      <Faq.Root data={data.faq}>
        {data.faq.map((item: any) => (
          <Faq.Item key={item.id} id={item.id} className="mb-4">
            <Faq.Trigger className="font-semibold text-lg cursor-pointer">
              {item.question}
            </Faq.Trigger>
            <Faq.Content className="mt-2 text-slate-600">
              {item.answer}
            </Faq.Content>
          </Faq.Item>
        ))}
      </Faq.Root>
    </main>
  );
}
```

---

### Step 5: Export the Sitewide Knowledge Graph (`app/api/graph.json/route.ts`)

Create a dedicated route handler to serve a unified, referentially-linked Schema.org `@graph` for search engines and AI agents.

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

### Step 6: Expose the AI Agent Data Endpoint (`app/api/contextual/route.ts`)

Provide a clean JSON feed of your site data stripped of HTML tags for LLM ingestion:

```typescript
// app/api/contextual/route.ts
import { siteSchema } from '@/data/site.schema';
import { siteConnector } from '@/data/site.server';
import { createRouteHandler } from '@contextual-ui/core/server';

export async function GET(req: Request) {
  const rawData = await siteConnector.fetchData();
  const hydrated = siteSchema.hydrate(rawData);
  const handler = createRouteHandler(hydrated);
  return handler.GET(req);
}
```

---

### Step 7: Embed the CMS Dashboard (`app/cms/page.tsx`)

Render the visual editing and inspection dashboard:

```tsx
// app/cms/page.tsx (Server Component)
import { siteConnector } from '@/data/site.server';
import { siteSchema } from '@/data/site.schema';
import { CMSDashboard } from '@contextual-ui/dashboard';

export default async function CMSPage() {
  const rawData = await siteConnector.fetchData();
  const hydrated = siteSchema.hydrate(rawData);

  return <CMSDashboard schema={hydrated} />;
}
```

---

## 📂 Project Structure

```text
apps/starter-kit/
├── app/
│   ├── api/
│   │   ├── contextual/    # 🤖 Clean plain text JSON for AI agents & LLMs
│   │   └── graph.json/    # 🌐 Unified Schema.org Knowledge Graph (@graph)
│   ├── cms/               # 📊 The Contextual CMS Dashboard route
│   ├── components/        # 🧩 Route showcasing route-level components (Breadcrumb)
│   ├── layout.tsx         # 📐 Root layout with CustomNavbar
│   └── page.tsx           # 🏠 Main homepage
├── components/            # 🎨 UI Wrappers around Contextual UI primitives
└── data/
    ├── site.schema.ts     # 📐 Centralized Zod schema definitions (SSOT)
    └── site.server.ts     # 🔌 Server connector binding data to schemas
```

---

## 📚 Related Packages

- [@contextual-ui/core](../../packages/core/README.md) — Headless UI components & schema engine.
- [@contextual-ui/jsonld-graph-builder](../../packages/jsonld-graph-builder/README.md) — Zero-dependency Schema.org `@graph` flattener and merger.
- [@contextual-ui/dashboard](../../packages/dashboard/README.md) — Isomorphic CMS dashboard for visual schema management.
- [@contextual-ui/connector-static](../../connectors/static/README.md) — Static data connector.

---

## 📜 License

MIT © Tasuku Studio, Inc.
