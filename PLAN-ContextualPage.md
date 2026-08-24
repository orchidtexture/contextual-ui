# Plan: Implementing ContextualPage Wrapper

## 1. Overview
The goal is to create a top-level `ContextualPage` (or `ContextualProvider`) wrapper component in `@contextual-ui/core`. This wrapper will coordinate data distribution to all contextual UI components on the page and consolidate their schema data into a single, unified Schema.org JSON-LD `@graph`.

## 2. Benefits
- **Unified JSON-LD**: Avoids fragmented `<script type="application/ld+json">` tags scattered across the DOM. Outputs a single, merged `@graph` that Google and other search engines strongly prefer.
- **Auto-Deduplication**: Automatically merges shared entities (e.g., if multiple components reference the same `@id: 'website'`) using `@contextual-ui/jsonld-graph-builder`.
- **Cleaner Component Code**: Child components (like `Faq.Root`, `Navbar.Root`, `Breadcrumb.Root`) can infer their data directly from context rather than requiring explicit `data={...}` prop passing at every usage site.

## 3. Implementation Steps

### Step 1: Create `ContextualPage` Component
- [x] Create `packages/core/src/components/page/page.types.ts`
- [x] Create `packages/core/src/components/page/page.context.ts`
- [x] Create `packages/core/src/components/page/ContextualPage.tsx`
- [x] Create `packages/core/src/components/page/index.ts`
- [x] Integrate `buildGraph` for unified `@graph` JSON-LD output

### Step 2: Refactor Child Components to Consume Context
- [x] Refactor `packages/core/src/components/faq/faq.types.ts` & `Faq.tsx`
- [x] Refactor `packages/core/src/components/breadcrumb/breadcrumb.types.ts` & `Breadcrumb.tsx`
- [x] Refactor `packages/core/src/components/navbar/navbar.types.ts` & `Navbar.tsx`
- [x] Skip inline `<script type="application/ld+json">` when wrapped in `ContextualPage`

### Step 3: Update Exports
- [x] Export `ContextualPage`, `ContextualPageContext`, `useContextualPageContext`, `useIsContextualPage`, and types in `packages/core/src/index.ts`

### Step 4: Testing & Verification
- [x] Build and typecheck across all packages in monorepo
- [x] Verify standalone component behavior vs wrapped `ContextualPage` behavior

## 4. API Design (Draft)

```tsx
import { ContextualPage } from '@contextual-ui/core';
import { mySchema } from './schema';

export default function MyPage({ pageData }) {
  return (
    <ContextualPage schema={mySchema} data={pageData} options={{ baseUrl: 'https://mysite.com' }}>
      <header>
        {/* Navbar auto-fetches data based on its schema key */}
        <Navbar.Root />
      </header>
      <main>
        <Breadcrumb.Root />
        <Faq.Root />
      </main>
    </ContextualPage>
  );
}
```