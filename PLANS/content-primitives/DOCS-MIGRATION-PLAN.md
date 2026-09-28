# Docs Content Migration Plan (V2-5)

**Goal:** Eliminate hardcoded text, code snippets, and tables from `DocsClient.tsx` so that all meaningful documentation content flows through Contextual UI's content primitives. This ensures the Schema.org JSON-LD graph matches the visible UI exactly (Zero Drift Sync), resolving the failing **Probe F3** test.

## 1. Current Anti-Patterns in `DocsClient.tsx`
- **Hardcoded Constants:** Arrays like `REGISTRIES_DATA`, `autoFormPropsRef`, and strings like `autoFormStep1Code` live directly in the React component.
- **Bypassing Primitives:** The UI maps over local constants to render custom `<SchemaFieldsTable>` and `<CodeSnippet>` components instead of using `<Content>` or `<Collection>`.
- **Ghost Content:** Because this content isn't part of the `siteApp` data fetch, the `<WebPage>` server component doesn't see it. The generated JSON-LD graph is empty, causing Probe F3 to fail.

## 2. Execution Batches (Aligned with V2-5 Remediation)

We will execute this migration in focused, bounded batches rather than a single monolithic rewrite.

### Batch 1: Schema Registries Reference (D1/D2)
- **Target:** The `REGISTRIES_DATA` array and the `SchemaRegistriesSection`.
- **Action:** 
  1. Move `REGISTRIES_DATA` into `apps/starter-kit/data/docs.content.ts`.
  2. Structure it as a `CollectionRecord` where each registry (e.g., `websiteRegistry`) is an item.
  3. Map the fields (name, type, requirement, description) into standard schema structures.
  4. Refactor `DocsClient.tsx` to read this collection from `data.collections` and render it using `<Collection.Root>` and `<Content>`, injecting custom UI (like the schema/data tabs) via projection components that read from the canonical item.

### Batch 2: Component Showcases (D3)
- **Target:** The `<ShowcaseSection>` blocks for WebPage, Navbar, Footer, Breadcrumb, FAQ.
- **Action:**
  1. Move `webpageCode`, `navbarCode`, etc., and their associated schema JSON strings into the data layer.
  2. Convert the prop tables (currently passed as `fields={webpageFields}`) into canonical content (either structured table blocks or custom record fields that project to text in the graph).
  3. Ensure the interactive Inspector previews remain functional but derive their descriptive text and code strings from the SSOT.

### Batch 3: Forms & Connectors (D4/D5)
- **Target:** `AutoFormSection`, `createForm` instructions, and `Connectors` section.
- **Action:**
  1. Move the `autoFormStep*Code` strings and the `autoFormPropsRef` array into `docs.content.ts`.
  2. Convert the 4-step AutoForm guide into an ordered `CollectionRecord` (similar to what was done for the Quickstart).
  3. Move the Connector code snippets (Static Config, Headless CMS, Database) into the SSOT.

### Batch 4: Helpers & Meta (D6/D7)
- **Target:** `siteApp.getMetadata()`, `getSitemap()`, and `getRobots()` sections.
- **Action:**
  1. Move parameter tables, description paragraphs, and code examples to the data layer.

## 3. Engineering Rules & Constraints

1. **One Deterministic Boundary:** If a custom interactive UI (like `SchemaFieldsTable`) requires specific data shapes, it must derive from the exact same supplied record that the JSON-LD graph generator reads. Do not maintain a separate "graph summary" string.
2. **Exhaustive Projections:** When using custom data fields (e.g., `item.customData.fields` for a table), ensure we provide a text projection for the graph generator so that AI agents can read the table contents.
3. **No UI State in Canonical Data:** Transient states (like which tab is open) remain in React state. The SSOT contains *all available variants* (e.g., both the schema definition and connector data for registries) so the graph has the complete picture.

## 4. Verification
- **Unit Tests:** Run `pnpm --filter starter-kit exec vitest run tests/content-parity.test.tsx` to ensure UI mutations reflect in the graph.
- **Production Output:** Run `pnpm --filter starter-kit run build` and `pnpm --filter starter-kit run test:production`.
- **Success Criteria:** Probe F3 (`production-output.test.ts`) must pass, verifying that specific phrases from the prop tables and registry descriptions are present in both the HTML body and the `<script type="application/ld+json">` tag.