# Contextual UI Starter Kit

This is the official reference implementation for **Contextual UI**. It is a [Next.js](https://nextjs.org/) application that demonstrates how to integrate the entire Contextual UI ecosystem—including core components, data connectors, knowledge graph exports, and the CMS dashboard—into a real-world project.

---

## 🚀 What's Included

This starter kit showcases the **Single Source of Truth (SSOT)** pattern:

- **Frontend UI**: Implementing headless `@contextual-ui/core` components (`Navbar`, `Faq`, `Breadcrumb`, `createForm`) with zero `any` types.
- **Data Connectors**: Using `@contextual-ui/connector-static` to bind schemas to static data sources.
- **Sitewide Knowledge Graph**: Exposing an interconnected Schema.org `/api/graph.json` endpoint via `@contextual-ui/jsonld-graph-builder`.
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
import { defineSchema, websiteRegistry, navbarRegistry, faqRegistry } from '@contextual-ui/core/server';
import { z } from 'zod';

export const siteSchema = defineSchema({
  // Built-in registries with automatic JSON-LD Schema.org generators
  website: websiteRegistry(),
  navbar: navbarRegistry(),
  faq: faqRegistry(),

  // Custom schema section with standard Zod validation and field description
  announcement: {
    schema: z.object({
      enabled: z.boolean(),
      message: z.string().describe('Announcement Banner Text'),
    }),
  },
});
```

---

### Step 3: Connect your Data Source & App (`data/site.server.ts`)

Bind your schema to a data connector using `createContextualApp`. This automatically infers TypeScript types and wraps hydration into a unified instance:

```typescript
// data/site.server.ts
import { siteSchema } from './site.schema';
import { staticConnector } from '@contextual-ui/connector-static';
import { createContextualApp, InferData } from '@contextual-ui/core/server';

const connector = staticConnector({
  website: {
    name: 'Contextual UI Starter Kit',
    url: 'https://example.com',
    description: 'A headless UI and semantic SEO Knowledge Graph starter kit.',
  },
  faq: [
    { id: '1', question: 'What is Contextual UI Starter Kit?', answer: 'An open-source starter for SSOT apps.' }
  ],
  navbar: {
    brand: { name: 'Contextual UI', href: '/' },
    links: [
      { id: '1', label: 'Home', href: '/' },
      { id: '2', label: 'CMS Dashboard', href: '/cms' },
    ]
  },
  announcement: {
    enabled: true,
    message: '🚀 Welcome to the Contextual UI Single Source of Truth architecture!',
  }
});

export const siteApp = createContextualApp({
  schema: siteSchema,
  connector: connector,
});

export type SiteData = InferData<typeof siteSchema>;
```

---

### Step 4: Render Type-Safe UI Components (`app/page.tsx`)

Fetch your data on the server with `siteApp.fetchData()`. Contextual UI components provide fully typed data props with zero `any` casting.

```tsx
// app/page.tsx (Server Component)
import { siteApp } from '@/data/site.server';
import { HomeClient } from './HomeClient';

export default async function HomePage() {
  const data = await siteApp.fetchData();
  return <HomeClient data={data} />;
}
```

```tsx
// app/HomeClient.tsx (Client Component)
'use client';

import { Faq } from '@contextual-ui/core';
import type { SiteData } from '@/data/site.server';

export function HomeClient({ data }: { data: SiteData }) {
  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Frequently Asked Questions</h1>

      {/* Fully typed FAQ items */}
      <Faq.Root data={data.faq}>
        {data.faq.map((item) => (
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

Export a complete, referentially-linked Schema.org `@graph` for Google, AI agents, and search bots in a single line:

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

---

### Step 6: Embed the CMS Dashboard (`app/cms/page.tsx`)

Render the visual editing and inspection dashboard:

```tsx
// app/cms/page.tsx (Server Component)
import { siteApp } from '@/data/site.server';
import { CMSClient } from './CMSClient';

export default async function CMSPage() {
  const data = await siteApp.fetchData();
  return <CMSClient context={{ raw: data }} />;
}
```

---

## 📂 Project Structure

```text
apps/starter-kit/
├── app/
│   ├── api/
│   │   └── graph.json/    # 🌐 Unified Schema.org Knowledge Graph (@graph)
│   ├── cms/               # 📊 The Contextual CMS Dashboard route
│   ├── components/        # 🧩 Route showcasing route-level components (Breadcrumb)
│   ├── layout.tsx         # 📐 Root layout with CustomNavbar
│   └── page.tsx           # 🏠 Main homepage
├── components/            # 🎨 UI Wrappers around Contextual UI primitives
└── data/
    ├── site.schema.ts     # 📐 Centralized Zod schema definitions (SSOT)
    └── site.server.ts     # 🔌 Server app binding schemas to connectors
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
