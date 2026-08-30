# Guide: Exporting a Global JSON-LD Knowledge Graph

This guide explains how to generate a sitewide `https://yourdomain.com/api/graph.json` endpoint using Contextual UI and `@contextual-ui/jsonld-graph-builder`.

---

## 1. The Architectural Philosophy: Data-Driven vs. HTML Scraping

Contextual UI separates schema generation from React component rendering:

* **Traditional HTML Scraping (Brittle):** Post-build scripts crawl and parse `<script type="application/ld+json">` tags out of static HTML files. This is slow, prone to parsing errors, and fails on dynamic server-rendered routes.
* **The Data-Driven Approach (Contextual UI):** The same data sources that feed your UI components are fed into your centralized schema definitions to generate a unified, deduplicated `@graph` directly via an API route.

---

## 2. Setting Up `/api/graph.json` (Next.js App Router)

### Step 1: Define Schemas
```typescript
// data/site.schema.ts
import {
  defineSchema,
  websiteRegistry,
  webpageRegistry,
  faqRegistry,
  navbarRegistry
} from '@contextual-ui/core/server';

export const siteSchema = defineSchema({
  website: websiteRegistry(),
  webpage: webpageRegistry(),
  navbar: navbarRegistry(),
  faq: faqRegistry(),
});
```

### Step 2: Create the API Route Handler
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

## 3. Scaling for Large Sites (10,000+ Pages)

When dealing with tens of thousands of dynamic records (products, blog articles), sending the entire database in a single `graph.json` payload can exceed serverless response payload limits (e.g., Vercel's 4.5MB limit).

### Segmented Graph Routes
You can segment your knowledge graph into domain-specific endpoints:

* `/api/graph/organization.json` — Organization, WebSite, and Navbar schemas.
* `/api/graph/articles.json` — Paginated or categorized article nodes.
* `/api/graph/products.json` — Catalog entities.

```typescript
// app/api/graph/articles/route.ts
import { buildGraph } from '@contextual-ui/jsonld-graph-builder';
import { articleSchema } from '@/schemas/article';
import { db } from '@/db';

export async function GET(req: Request) {
  const articles = await db.getArticles({ limit: 100 });
  const entities = articles.map(a => articleSchema.generateJsonLd(a));

  const graph = buildGraph(entities, {
    baseUrl: 'https://example.com',
  });

  return Response.json(graph, {
    headers: { 'Content-Type': 'application/ld+json' },
  });
}
```

---

## 4. WebSite vs. WebPage & Page-Level Graph Ingestion

Schema.org distinguishes between a top-level `WebSite` and individual `WebPage` nodes:
* `WebSite` represents the global domain and points to the publishing `Organization`.
* `WebPage` represents the specific route/URL document, referencing the `WebSite` via `isPartOf`.
* Layout components (`Navbar`, `Footer`, `FAQPage`, `Breadcrumb`) belong to and reference the `WebPage`.

### Using `<WebPage />` for Route-Level Schema Injection (Next.js App Router)

In Next.js App Router, you can define your known site pages in your data connector as an array:

```typescript
// data/site.server.ts
export const connector = staticConnector({
  website: { name: 'Contextual UI', url: 'https://example.com' },
  webpage: [
    { id: 'home', name: 'Home', url: '/' },
    { id: 'docs', name: 'Documentation', url: '/docs', description: 'Learn how to use Contextual UI.' },
  ],
  // ...
});
```

When hitting `/api/graph.json`, Contextual UI exports all `WebPage` nodes into the global Knowledge Graph for AI agents.

Inside individual route files (`page.tsx`), use `<WebPage>` with the matching `id` or inline overrides to inject the route-specific graph for search engines:

```tsx
// app/docs/page.tsx
import { siteApp } from '@/data/site.server';
import { WebPage } from 'contextual-ui/server';
import { DocsClient } from './DocsClient';

export default async function DocsPage() {
  const data = await siteApp.fetchData();

  return (
    <WebPage app={siteApp} id="docs">
      <DocsClient data={data} />
    </WebPage>
  );
}
```
