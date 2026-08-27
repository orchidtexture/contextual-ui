# jsonld-graph-builder

An ultra-lightweight, zero-dependency, synchronous **Schema.org JSON-LD Graph Engine**.

Designed specifically for modern serverless and edge runtimes (Next.js App Router, Cloudflare Workers, Node.js, Vercel Edge), it extracts nested entities, normalizes URIs, and merges colliding `@id` nodes into a unified, referentially-sound Schema.org `@graph` structure for search engines and AI agents.

---

## ⚡ Why `jsonld-graph-builder`?

Most existing JSON-LD tooling falls into one of two extremes:

1. **The W3C `jsonld.js` package:** An enormous, asynchronous library built for full RDF triple parsing that makes remote HTTP requests to fetch external contexts. It is too heavy and slow for modern serverless edge endpoints.
2. **Naive Array Wrappers:** Libraries that simply place objects into an array and use a basic "first-wins" deduplication (deleting entire nodes if an `@id` repeats).

`jsonld-graph-builder` fills the gap:
* **Zero Dependencies:** Pure TypeScript with zero runtime overhead.
* **Synchronous & Serverless Ready:** Executes in `<1ms`, ideal for Edge Route Handlers and SSG builds.
* **Recursive Entity Flattening:** Automatically pulls nested entities with `@id` into top-level nodes and replaces them with reference pointers (`{ "@id": "..." }`).
* **JSON-LD Aware Deep Merging:** Understands Schema.org semantics when combining duplicate `@id` nodes (e.g. upgrading colliding scalar properties into arrays).
* **Graph-RAG & AI Agent Friendly:** Transforms isolated web components into a fully connected, single-root Knowledge Graph.

---

## 📦 Installation

```bash
pnpm add jsonld-graph-builder
# or
npm install jsonld-graph-builder
```

---

## 🚀 Quick Start

```typescript
import { buildGraph, createId, refersTo } from 'jsonld-graph-builder';

// 1. Root WebSite Entity (The Entry Point)
const website = {
  '@type': 'WebSite',
  '@id': createId('website'),
  name: 'Acme Corp',
  url: 'https://acme.com',
  hasPart: [refersTo('navbar'), refersTo('faq')],
};

// 2. Navigation Entity
const navbar = {
  '@type': 'SiteNavigationElement',
  '@id': createId('navbar'),
  isPartOf: refersTo('website'),
  name: 'Main Navigation',
  hasPart: [
    {
      '@type': 'WebPage',
      '@id': createId('nav', 'home'),
      name: 'Home',
      url: '/',
    },
    {
      '@type': 'WebPage',
      '@id': createId('nav', 'about'),
      name: 'About',
      url: '/about',
    },
  ],
};

// 3. FAQ Entity
const faq = {
  '@type': 'FAQPage',
  '@id': createId('faq'),
  isPartOf: refersTo('website'),
  mainEntity: [
    {
      '@type': 'Question',
      '@id': createId('faq-q', '1'),
      name: 'What is Acme Corp?',
      acceptedAnswer: {
        '@type': 'Answer',
        '@id': createId('faq-a', '1'),
        text: 'A modern cloud software provider.',
      },
    },
  ],
};

// 4. Build the unified Knowledge Graph
const graph = buildGraph([website, navbar, faq], {
  baseUrl: 'https://acme.com',
  flatten: true,
  dedupeStrategy: 'merge',
});

console.log(JSON.stringify(graph, null, 2));
```

### Output:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://acme.com/#website",
      "name": "Acme Corp",
      "url": "https://acme.com",
      "hasPart": [
        { "@id": "https://acme.com/#navbar" },
        { "@id": "https://acme.com/#faq" }
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://acme.com/#nav:home",
      "name": "Home",
      "url": "/"
    },
    {
      "@type": "WebPage",
      "@id": "https://acme.com/#nav:about",
      "name": "About",
      "url": "/about"
    },
    {
      "@type": "SiteNavigationElement",
      "@id": "https://acme.com/#navbar",
      "isPartOf": { "@id": "https://acme.com/#website" },
      "name": "Main Navigation",
      "hasPart": [
        { "@id": "https://acme.com/#nav:home" },
        { "@id": "https://acme.com/#nav:about" }
      ]
    },
    {
      "@type": "Answer",
      "@id": "https://acme.com/#faq-a:1",
      "text": "A modern cloud software provider."
    },
    {
      "@type": "Question",
      "@id": "https://acme.com/#faq-q:1",
      "name": "What is Acme Corp?",
      "acceptedAnswer": {
        "@id": "https://acme.com/#faq-a:1"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://acme.com/#faq",
      "isPartOf": { "@id": "https://acme.com/#website" },
      "mainEntity": [
        { "@id": "https://acme.com/#faq-q:1" }
      ]
    }
  ]
}
```

---

## 🧠 Understanding `dedupeStrategy`

When multiple data sources or page components emit schemas sharing the same `@id`, `dedupeStrategy` determines how conflicting properties are resolved:

### 1. `'merge'` (Default & Recommended for 95% of use cases)
* **How it works:** Performs a deep, Schema.org-aware merge.
  * If both nodes provide different scalar values for a field (e.g., `"sameAs": "twitter.com"` and `"sameAs": "linkedin.com"`), it upgrades them into a combined array `["twitter.com", "linkedin.com"]`.
  * If both nodes provide matching values, duplicates are removed.
  * Sub-objects without `@id` (e.g., `address`) are deeply merged recursively.
* **When to use:** When different parts of your site contribute complementary information about the same entity. (e.g., An article mentions an Author stub, while the About page provides full social links and bio).

### 2. `'first-wins'`
* **How it works:** The first entity encountered in the array retains authority over all its properties. Subsequent nodes sharing the same `@id` will only contribute keys that were previously `undefined`.
* **When to use:** When you have a dedicated, authoritative global schema defined first (such as your site-wide Organization schema) and you want to prevent downstream components from mutating or expanding its fields.

### 3. `'last-wins'`
* **How it works:** Overwrites earlier properties with incoming keys from later nodes.
* **When to use:** In sequential processing pipelines or stateful streams where later entries represent updated or overriding records.

---

## 🌐 Serverless Route Handler Example (Next.js App Router)

```typescript
// app/api/graph.json/route.ts
import { buildGraph } from 'jsonld-graph-builder';
import { db } from '@/lib/db';

export async function GET() {
  const [siteInfo, navLinks, faqs] = await Promise.all([
    db.getSiteInfo(),
    db.getNavLinks(),
    db.getFaqs(),
  ]);

  const graph = buildGraph([siteInfo, navLinks, faqs], {
    baseUrl: 'https://example.com',
    flatten: true,
    dedupeStrategy: 'merge',
  });

  return new Response(JSON.stringify(graph, null, 2), {
    headers: {
      'Content-Type': 'application/ld+json; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300',
    },
  });
}
```

---

## 🛠️ API Reference

### `buildGraph(entities, options?)`

* **`entities: Array<JsonLdObject>`** — Array of JSON-LD objects to combine.
* **`options?: GraphBuilderOptions`**:
  * **`baseUrl?: string`** — The root domain used to resolve relative `@id` URIs (e.g. `'https://example.com'`).
  * **`flatten?: boolean`** *(default: `true`)* — Automatically extracts nested entities with `@id` into top-level `@graph` nodes.
  * **`dedupeStrategy?: 'merge' | 'first-wins' | 'last-wins'`** *(default: `'merge'`)* — Strategy for handling duplicate `@id` nodes.

### Helpers

* **`createId(type: string, id?: string): string`**
  * Generates a normalized `#type:id` fragment identifier.
  * Example: `createId('article', 'post-1')` $\rightarrow$ `'#article:post-1'`
* **`refersTo(type: string, id?: string): { "@id": string }`**
  * Creates a standard JSON-LD reference pointer object.
  * Example: `refersTo('organization', 'main')` $\rightarrow$ `{ "@id": "#organization:main" }`
* **`canonicalizeId(id: string, baseUrl?: string): string`**
  * Resolves relative IDs (`#org`, `/path#id`) against the canonical `baseUrl`.

---

## 📜 License

MIT © Tasuku Studio, Inc.
