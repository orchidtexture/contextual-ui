# Global Graph Export API Plan

## Overview
This document outlines the architecture and implementation steps to introduce a **Global Graph Export** feature to Contextual UI. This feature allows consumers to automatically generate a unified, sitewide `graph.json` API endpoint containing all JSON-LD entities. It leverages the "Data-Driven Approach," decoupling schema generation from React component rendering.

By using the library's core schema definitions and applying them against raw data across the entire site, we can generate a perfectly interconnected JSON-LD `@graph` object without relying on brittle build-time HTML scraping.

---

## Progress Checklist

- [x] **Phase 1: Architectural Foundation & Package Scaffolding**
  - [x] Create standalone package `@contextual-ui/jsonld-graph-builder` (`packages/jsonld-graph-builder`).
  - [x] Configure zero-dependency `tsup` & `tsconfig` pipeline (CJS/ESM/.d.ts).
  - [x] Establish base types (`GraphBuilderOptions`, `JsonLdObject`, `JsonLdGraphResult`) and ID helpers (`createId`, `refersTo`).
- [x] **Phase 2: Core Library Enhancements (`@contextual-ui/core`)**
  - [x] **2.1 Integrate `schema-dts`**
    - [x] Add `schema-dts` dependency to `@contextual-ui/core`.
    - [x] Export schema types (`Thing`, `WithContext`, `Graph`) from core.
  - [x] **2.2 Enhance JSON-LD Generation Capabilities & Relationship Helpers**
    - [x] Update `defineSchema` return interface to expose `generateJsonLd(data, ctx)`.
    - [x] Pass `createId` and `refersTo` context to `generateJsonLd`.
    - [x] Re-export graph utilities from core for convenient consumer access.
- [x] **Phase 3: Standalone Graph Engine Implementation (`@contextual-ui/jsonld-graph-builder`)**
  - [x] Implement URL / URI canonicalization against `baseUrl`.
  - [x] Implement recursive entity flattener (nested nodes with `@id` pulled to root `@graph`).
  - [x] Implement JSON-LD aware deep merge for identical `@id` nodes (converting single values into arrays when colliding).
  - [x] Implement deduplication strategies (`merge`, `first-wins`, `last-wins`).
  - [x] Add unit tests covering nested flattening, merging, and relative URI resolution.
- [x] **Phase 4: Consumer Integration & Starter Kit Implementation**
  - [x] Create `/api/graph.json` route handler in `apps/starter-kit`.
  - [x] Wire static/dynamic data sources into `buildGraph`.
- [x] **Phase 5: Documentation & Guides**
  - [x] Update `@packages/core/README.md` to categorize and explain the difference between Global Knowledge Graph Entities (e.g. Navbar, FAQs, Articles) and Ephemeral Route-Level Metadata components (e.g. Breadcrumb).
  - [x] Create comprehensive `README.md` at `@packages/jsonld-graph-builder` detailing architecture, flattening, URI canonicalization, and `dedupeStrategy` selection ('merge', 'first-wins', 'last-wins').
  - [x] Document Graph Export pattern in `docs/guides/global-graph-export.md`.
  - [x] Document Serverless large-site segmentation patterns.

---

## 1. Architectural Goals

1.  **Framework Agnosticism:** The core extraction logic must reside in `@contextual-ui/core` / `@contextual-ui/jsonld-graph-builder`, completely independent of Next.js, Remix, or any specific framework routing.
2.  **Referential Integrity:** Ensure interconnected entities (e.g., an `Article` and its `Organization` author) share identical `@id` strings to form a true graph.
3.  **Data-Driven:** Consumers will pass their raw dataset (from any connector or database) through our schema definitions to generate JSON-LD output dynamically.
4.  **Developer Experience:** Provide a simple, centralized function (e.g., `buildGlobalGraph(definitions, dataMap)`) that can be easily dropped into a standard API Route (like `app/api/graph.json/route.ts`).

---

## 2. Core Library Enhancements (`@contextual-ui/core`)

### 2.1 Integrate `schema-dts`
To ensure 100% specification compliance without maintaining custom typings, we use the official `schema-dts` package.
-   [x] Add `schema-dts` to `@contextual-ui/core` dependencies.
-   [x] Ensure `generateJsonLd` return types are strictly typed against `schema-dts` objects (e.g., `Thing`, `Article`, `Organization`).

### 2.2 Enhance JSON-LD Generation Capabilities & Relationship Helpers
Currently, schema definitions generate JSON-LD per component. We need a standardized interface to ensure every schema definition can output its raw JSON-LD representation cleanly without knowing its final domain context.

-   [x] Ensure the return type of `defineSchema` includes a `generateJsonLd(data: T, ctx: Context): Record<string, any>` method.
-   [x] Provide relationship helpers (`createId`, `refersTo`) in context so schema definitions remain pure and domain-agnostic. 

```typescript
// Inside schema definition example
import { Thing, Article } from 'schema-dts';

export const articleSchema = defineSchema({
  generateJsonLd: (data, { createId, refersTo }): Article => ({
    "@type": "Article",
    "@id": createId('article', data.slug),
    "headline": data.title,
    "publisher": refersTo('organization', 'main-org'), 
  })
});
```

---

## 3. The Standalone Package: `@contextual-ui/jsonld-graph-builder`

Instead of burying the graph-merging algorithm inside `@contextual-ui/core`, we created a dedicated, zero-dependency workspace package. This fills a massive gap in the npm ecosystem: a synchronous, lightweight, serverless-friendly JSON-LD flattener and deep-merger (avoiding the bloated, async nature of the official W3C `jsonld.js`).

-   [x] Create `packages/jsonld-graph-builder`.
-   [x] Export the complete `buildGraph` utility from this package.
-   [x] `@contextual-ui/core` re-exports it for convenience.

### 3.1 The `buildGraph` Utility Contract
Develop a highly intelligent utility function that accepts an array of generated JSON-LD objects, normalizes URIs, extracts nested entities, and handles deep merging of duplicate nodes.

-   **Signature Contract:**
    ```typescript
    export interface GraphBuilderOptions {
      /** The root domain used to resolve relative @id URIs */
      baseUrl?: string;
      /** Whether to flatten nested entities into top-level @graph nodes (default: true) */
      flatten?: boolean;
      /** Strategy for handling duplicate @id nodes (default: 'merge') */
      dedupeStrategy?: 'merge' | 'first-wins' | 'last-wins';
    }

    export function buildGraph(
      entities: Array<Record<string, any>>,
      options?: GraphBuilderOptions
    ): {
      "@context": "https://schema.org";
      "@graph": Array<Record<string, any>>;
    }
    ```

### 3.2 Core Logic Algorithms
1.  **URI Resolution:** Iterate through all `@id` properties. If a `baseUrl` is provided, use the native web `URL` API (`new URL(id, baseUrl).href`) to securely resolve root-relative IDs (e.g., `#organization`) against the `baseUrl`.
2.  **Entity Flattening:** Recursively traverse objects. If a nested object has an `@id`, extract it into a top-level node in the `@graph` array and leave behind a reference (`{ "@id": "..." }`). This prevents massive duplication across arrays (e.g., Authors across Articles).
3.  **JSON-LD Aware Deep Merging:** When pushing flattened or top-level nodes into the `@graph`, check if a node with the same `@id` already exists. If `dedupeStrategy: 'merge'`, perform a deep merge so properties from different parts of the site combine into a richer single node. Crucially, this merge must understand JSON-LD rules (e.g., merging two string values into a single array `["url1", "url2"]`).
4.  **Formatting:** Return the strict `@context` and `@graph` object.

---

## 4. Implementation Flow for the Client/Consumer

The consumer will use the tools provided by `@contextual-ui/core` alongside their data fetching logic to build the endpoint.

### 4.1 Data Aggregation Step
The client fetches all necessary data (Products, Articles, Pages) using their preferred method or our connectors.

### 4.2 Schema Application Step
The client maps their raw data through the `generateJsonLd` methods of their respective Contextual UI schema definitions.

### 4.3 Graph Construction Step
The client passes the mapped JSON-LD objects to `buildGraph` (imported from the new builder package) and returns it as a JSON response.

### Example Consumer Implementation (Next.js Route Handler):

```typescript
// app/api/graph.json/route.ts
import { buildGraph } from '@contextual-ui/jsonld-graph-builder';
import { articleSchema, productSchema, organizationSchema } from '@/schemas';
import { db } from '@/db';

export async function GET() {
  // 1. Fetch raw data
  const rawArticles = await db.getArticles();
  const rawProducts = await db.getProducts();
  const orgData = await db.getOrganizationInfo();

  // 2. Generate individual JSON-LD entities
  const jsonLdEntities = [
    organizationSchema.generateJsonLd(orgData),
    ...rawArticles.map(article => articleSchema.generateJsonLd(article)),
    ...rawProducts.map(product => productSchema.generateJsonLd(product))
  ];

  // 3. Build the unified graph with options
  const graph = buildGraph(jsonLdEntities, {
    baseUrl: 'https://example.com',
    flatten: true,
    dedupeStrategy: 'merge'
  });

  return Response.json(graph);
}
```

---

## 5. Edge Cases & Serverless Constraints

### 5.1 Large Site Scaling (The 10k Page Problem)
If a user has tens of thousands of entries, returning a single `graph.json` payload could exceed serverless response limits (e.g., Vercel's 4.5MB limit) or cause memory issues.

-   **Action:** Support and document segmented graph routes (e.g., `/api/graph/articles.json`, `/api/graph/products.json`).
-   **Action:** Ensure `buildGraph` can accept subsets of data efficiently. Future enhancements may include streaming or chunked builders using `CollectionPage` or `ItemList` schemas.

---

## 6. Documentation & Examples

-   **Action:** Update `packages/core/README.md` to document component categorization: Global Knowledge Graph Entities vs. Ephemeral Route-Level Metadata.
-   **Action:** Create a standalone comprehensive `packages/jsonld-graph-builder/README.md` explaining the graph engine, zero-dependency philosophy, flattening, and `dedupeStrategy` choices.
-   **Action:** Create a new guide in the documentation: `docs/guides/global-graph-export.md`.
-   **Action:** Explain the "Data-Driven Approach" vs. HTML scraping, emphasizing referential integrity (`@id`).
-   **Action:** Provide clear code examples for Next.js (App Router API Route) and a framework-agnostic Node.js script (for static site generation).
-   **Action:** Update the `/apps/starter-kit` to include a sample `api/graph.json` endpoint demonstrating this implementation.

---

## 7. Potential Future Enhancements

-   **Connector Integration:** Allow Connectors (e.g., `@contextual-ui/connector-static`) to expose a `.getAllData()` method to further streamline the aggregation step for the client.
-   **Streaming Support:** Add streaming JSON output to `buildGraph` for massive enterprise sites bypassing serverless memory limits.
