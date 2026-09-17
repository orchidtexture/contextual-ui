# Phase 1 — Data and Graph Foundations

**Status:** Proposed · **Dependency:** None · **Next:** [Phase 2](02-composable-primitives.md)

## Goal

Define how shared content becomes UI, page-scoped JSON-LD, and a global graph before deciding the final component APIs.

## Observed baseline

The exploration used `co-jp`'s installed `contextual-ui@0.2.0-beta.3` and generated its graph in memory with the options from `app/graph.json/route.ts`: `includeAll: true`, flattening, and merge deduplication.

There were **8 top-level nodes**:

- One Organization and one WebSite.
- Two WebPages: home and privacy.
- One SiteNavigationElement and one WPFooter.
- One FAQPage and one ContactAction, with nested data.

The service descriptions, use-case entries, process steps, moving-company scenario, company address and representative, and privacy-policy body were not represented by their own registered content. Some related themes appear in the FAQ and page descriptions; that is not complete content coverage.

The privacy WebPage also references the FAQ through the current default `hasPart`, although the privacy UI does not render it.

## Existing extension points and constraints

Relevant source:

- [`defineSchema.ts`](../../packages/core/src/registry/defineSchema.ts): Zod schema, `generateJsonLd`, `exportAgentData`, and `isGlobal` hooks.
- [`createContextualApp.ts`](../../packages/core/src/server/createContextualApp.ts): data hydration, page selection, and graph assembly.
- [`createGraphRouteHandler.ts`](../../packages/core/src/server/createGraphRouteHandler.ts): endpoint generation and registry filtering.
- [`webpage.utils.ts`](../../packages/core/src/components/webpage/webpage.utils.ts): page identity and `hasPart` defaults.
- [`WebPage.tsx`](../../packages/core/src/components/webpage/WebPage.tsx): page-level script emission.

Important limitations to account for:

- A registered data model without a JSON-LD generator does not appear in `graph.json`.
- `exportAgentData` is a separate output; it is not automatically included in the JSON-LD endpoint.
- `isGlobal` and key filters operate at registry-section level, not arbitrary content-record/page membership level.
- Current `includeKeys` behavior is additive to global defaults, not a strict whitelist. Preserve compatibility or explicitly version a change.
- Current hydration can retain invalid input after a warning. Decide how new contracts report or reject invalid export data rather than assuming hydration is strict.

## Work packages

### 1. Shared content contract

- [ ] Define serializable content records: stable local ID, title, optional summary, body, language, and supported references.
- [ ] Separate body text from presentation: no `ReactNode`, SVG, or component functions in canonical data.
- [ ] Keep formatting deterministic. CSS and renderers may alter presentation, but not independently rewrite exported content.
- [ ] Treat qualifiers and disclaimers as first-class content, not optional graph metadata.
- [ ] Keep module organization flexible: shared data need not live in one giant `site.server.ts` file.

### 2. Identity and page membership

- [ ] Define stable IDs for pages, sections, collections, items, and domain entities.
- [ ] Keep existing entity IDs stable where possible, especially Organization and WebPage IDs.
- [ ] Distinguish a graph `@id` from a navigable DOM anchor/URL; expose source anchors where available.
- [ ] Choose one authoritative page-membership representation and derive inverse relationships.

Recommended starting point: a page manifest with ordered section references. An alternative is ownership stored on section records. Do not require authors to maintain both independently. The same membership data should guide rendering and graph selection.

A section placement belongs to a page; a Service or Organization can be described on multiple pages without becoming multiple entities.

### 3. Graph scope and relationships

- [ ] Define global export as all eligible public content and entities across pages.
- [ ] Define page export as that page's declared content plus relevant shared entity dependencies.
- [ ] Build `WebPage.hasPart` from actual page membership rather than unconditional defaults.
- [ ] Use `isPartOf` for section/page relationships and appropriate references for subjects and entities.
- [ ] Establish precedence for page selection, include/exclude keys, legacy defaults, and dependency resolution.
- [ ] Avoid dangling internal references; distinguish intentionally external references from missing local records.
- [ ] Route and programmatic graph generation must share selection and serialization rules.

Conceptual relationship model, not a finalized ID format:

```text
Home WebPage ─hasPart→ Services section ─mainEntity→ Service ItemList
                                                       └─item→ Service
                                                                 └─provider→ Organization
Privacy WebPage ─hasPart→ Privacy content sections
```

### 4. Output ownership

- [ ] Choose one owner for page-level JSON-LD emission; composed primitives must not each inject duplicate scripts.
- [ ] Keep graph generation independent of rendering order, browser execution, and mounted components.
- [ ] Define standalone primitive behavior separately from app-integrated behavior.
- [ ] Apply safe JSON-LD script serialization and validate supported link protocols for rendered content.
- [ ] Export public content only; form field definitions are not submitted user data.

Shared data and manifests reduce drift but cannot prove arbitrary custom JSX displays every declared field. Use fixtures and targeted render/export checks rather than promising automatic visibility detection.

## Exit criteria

- [ ] Contract and scope decisions are recorded in [DECISIONS.md](DECISIONS.md).
- [ ] Fixtures cover home, privacy, and an entity reused across pages.
- [ ] Tests demonstrate deterministic IDs, page isolation, reference resolution, and equivalent endpoint/programmatic selection.
- [ ] Legacy integrations have an explicit compatibility path.
- [ ] The contract can represent a real pilot section without requiring a new catalog component.
