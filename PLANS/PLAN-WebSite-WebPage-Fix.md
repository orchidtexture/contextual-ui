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
- [ ] Update `apps/starter-kit/data/site.schema.ts`:
  - Import and add `webpage: webpageRegistry()` to `defineSchema`.
- [ ] Update `apps/starter-kit/data/site.server.ts`:
  - Provide mock/default data for `webpage` in the `staticConnector` (e.g., `name: 'Contextual UI Starter Kit - Home', url: siteUrl, description: '...'`).
- [ ] Optionally run `pnpm build` in root to verify `core` compiles and the Next.js app builds properly with the new data contract.

### 4. Update Documentation (`docs/`)
- [ ] Review and update `docs/guides/global-graph-export.md`:
  - Add `webpageRegistry` where `websiteRegistry` or other core registries are mentioned if appropriate.
  - Update any structural descriptions mentioning that `WebSite` contains page-level elements to clarify that `WebPage` handles layout components.
- [ ] Create or update documentation to explain the semantic distinction between `WebSite` and `WebPage` to help users understand why the split exists.
