# WebSite vs WebPage Architectural Shift Plan

## Objective
Fix the Schema.org graph semantics by introducing a distinct `WebPage` node. Currently, UI components (`#navbar`, `#footer`, `#faq`) are attached directly to the global `WebSite` node. According to Schema.org, a `WebSite` represents the global domain, while layout components belong to a specific `WebPage` (the current document/URL). 

We will introduce a `WebPage` node that references the `WebSite` via `isPartOf`, and the UI components will reference the `WebPage` instead.

We will use **Option A** for `FAQPage`, where the FAQ component still generates an entity of `@type: 'FAQPage'` (which is a subclass of `WebPage`), but points its `isPartOf` to the main `#webpage` node.

## Checklist

### 1. Create `WebPage` Component (`packages/core`)
- [x] Create `packages/core/src/components/webpage/webpage.schema.ts`:
  - Define `WebpageDataSchema` with fields like `name`, `url`, `description`, `hasPart` (optional string array).
- [x] Create `packages/core/src/components/webpage/webpage.utils.ts`:
  - Implement `generateWebpageJsonLd(data, ctx)`:
    - `@type: 'WebPage'`
    - `@id: create('webpage')`
    - `isPartOf: refer('website')`
    - `hasPart`: map `data.hasPart` or default to `[refer('navbar'), refer('faq'), refer('footer')]`
  - Implement `exportAgentData` and `webpageRegistry`.
- [x] Create `packages/core/src/components/webpage/index.ts` to export the new module.
- [x] Update `packages/core/src/index.ts` to export `webpageRegistry` and `WebpageData`.

### 2. Update Existing Core Components
- [x] Update `packages/core/src/components/website/website.utils.ts`:
  - Remove the default `hasPart: [refer('navbar'), refer('faq'), refer('footer')]`.
  - Let it default to pointing to `webpage`? Actually, `WebPage` pointing to `WebSite` via `isPartOf` is sufficient in Schema.org. You can optionally add `hasPart` if `data.hasPart` is provided, but don't hardcode layout components.
- [x] Update `packages/core/src/components/navbar/navbar.utils.ts`:
  - Change `isPartOf: refer('website')` to `isPartOf: refer('webpage')`.
- [x] Update `packages/core/src/components/footer/footer.utils.ts`:
  - Change `isPartOf: refer('website')` to `isPartOf: refer('webpage')`.
- [x] Update `packages/core/src/components/faq/faq.utils.ts`:
  - Change `isPartOf: refer('website')` to `isPartOf: refer('webpage')`.
- [x] Update `packages/core/src/components/breadcrumb/breadcrumb.utils.ts`:
  - Change `isPartOf: refer('website')` to `isPartOf: refer('webpage')`.

### 3. Update Starter Kit (`apps/starter-kit`)
- [x] Update `apps/starter-kit/data/site.schema.ts`:
  - Import and add `webpage: webpageRegistry()` to `defineSchema`.
- [x] Update `apps/starter-kit/data/site.server.ts`:
  - Provide mock/default data for `webpage` in the `staticConnector` (e.g., `name: 'Contextual UI Starter Kit - Home', url: siteUrl, description: '...'`).
- [x] Optionally run `pnpm build` in root to verify `core` compiles and the Next.js app builds properly with the new data contract.

### 4. Route-Specific WebPage Support (`packages/core` & `starter-kit`)
- [x] Update `packages/core/src/server/createContextualApp.ts`:
  - Allow `dataOverrides?: Partial<InferData<TSchema>>` in `GetGraphOptions`.
  - In `getGraph(handlerOptions)` and `fetchData(overrides?)`, merge `dataOverrides` with raw data before hydration.
- [x] Add unit tests in `packages/core/src/server/createContextualApp.test.ts` to test `dataOverrides` for route-specific `webpage` metadata generation.

### 5. Shift JSON-LD Script Injection to Page Level (`WebPage` Component)
- [x] Create `packages/core/src/components/webpage/WebPage.tsx`:
  - An async React Server Component (or utility wrapper) that accepts `app`, `name`, `url`, `description`, and `children`.
  - Inside, it calls `app.getGraph({ dataOverrides: { webpage: { name, url, description } } })` and renders the `<script type="application/ld+json">`.
- [x] Update `packages/core/src/components/site/ContextualSite.tsx` (if needed) to ensure that the layout's global graph script doesn't conflict. We can disable the automatic script injection when using App Router, or add a `disableJsonLdScript` prop check in `app/layout.tsx`.
- [x] Refactor starter-kit routes:
  - `apps/starter-kit/app/layout.tsx`: pass `options={{ disableJsonLdScript: true }}` to `<ContextualSite>`.
  - `apps/starter-kit/app/page.tsx`: Wrap contents with `<WebPage name="Home" ...>`.
  - `apps/starter-kit/app/docs/page.tsx`: Wrap contents with `<WebPage name="Documentation" url="/docs" ...>`.
  - Update `/schema` and `/cms` routes similarly.

### 6. Update Documentation (`docs/`)
- [x] Review and update `docs/guides/global-graph-export.md`:
  - Add `webpageRegistry` where `websiteRegistry` or other core registries are mentioned.
  - Explain how `WebSite` represents the global domain while `WebPage` represents the current URL document.
  - Document the `<WebPage>` wrapper component and how it handles per-route schema injection without relying on "overrides".
- [x] Update starter kit README and core README where architecture graphs or schemas are illustrated.
