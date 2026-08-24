# Plan: Implementing ContextualSite Wrapper

## 1. Overview
The goal is to create a top-level `ContextualSite` (or `ContextualProvider`) wrapper component in `@contextual-ui/core`. This wrapper will coordinate domain-level data distribution to all contextual UI components on the site and consolidate their schema data into a single, unified Schema.org JSON-LD `@graph`.

## 2. Benefits
- **Unified JSON-LD**: Avoids fragmented `<script type="application/ld+json">` tags scattered across the DOM. Outputs a single, merged `@graph` that Google and other search engines strongly prefer.
- **Auto-Deduplication**: Automatically merges shared entities (e.g., if multiple components reference the same `@id: 'website'`) using `@contextual-ui/jsonld-graph-builder`.
- **Cleaner Component Code**: Child components (like `Faq.Root`, `Navbar.Root`, `Breadcrumb.Root`) can infer their data directly from context rather than requiring explicit `data={...}` prop passing at every usage site.

## 3. Implementation Steps

### Step 1: Create `ContextualSite` Component
- [x] Create `packages/core/src/components/site/site.types.ts`
- [x] Create `packages/core/src/components/site/site.context.ts`
- [x] Create `packages/core/src/components/site/ContextualSite.tsx`
- [x] Create `packages/core/src/components/site/index.ts`
- [x] Integrate `buildGraph` for unified `@graph` JSON-LD output

### Step 2: Refactor Child Components to Consume Context
- [x] Refactor `packages/core/src/components/faq/faq.types.ts` & `Faq.tsx`
- [x] Refactor `packages/core/src/components/breadcrumb/breadcrumb.types.ts` & `Breadcrumb.tsx`
- [x] Refactor `packages/core/src/components/navbar/navbar.types.ts` & `Navbar.tsx`
- [x] Skip inline `<script type="application/ld+json">` when wrapped in `ContextualSite`

### Step 3: Update Exports
- [x] Export `ContextualSite`, `ContextualSiteContext`, `useContextualSiteContext`, `useIsContextualSite`, and types in `packages/core/src/index.ts`

### Step 4: Testing & Verification
- [x] Build and typecheck across all packages in monorepo
- [x] Verify standalone component behavior vs wrapped `ContextualSite` behavior

## 4. API Design

```tsx
// app/layout.tsx
import { ContextualSite } from '@contextual-ui/core';
import { siteApp } from './site.server';

export default async function RootLayout({ children }) {
  const data = await siteApp.fetchData();
  const graph = await siteApp.getGraph({ graphOptions: { baseUrl: 'https://mysite.com' } });

  return (
    <html>
      <body>
        <ContextualSite data={data} graph={graph}>
          <Navbar.Root />
          {children}
        </ContextualSite>
      </body>
    </html>
  );
}
```