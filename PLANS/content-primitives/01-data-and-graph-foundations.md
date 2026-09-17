# Phase 1 — Data and Graph Foundations

**Status:** Complete; starter-kit validation gate verified · **Dependency:** None · **Next:** [Phase 2](02-composable-primitives.md)

## Goal

Define how shared content becomes UI, page-scoped JSON-LD, and a global graph before deciding the final component APIs.

## Historical research baseline (external repository)

This baseline describes `co-jp`, not the official website. It remains research context; implementation and integration validation take place in `packages/core` and `apps/starter-kit` within this repository.

The exploration used `co-jp`'s installed `contextual-ui@0.2.0-beta.3` and generated its graph in memory with the options from `app/graph.json/route.ts`: `includeAll: true`, flattening, and merge deduplication.

There were **8 top-level nodes**:

- One Organization and one WebSite.
- Two WebPages: home and privacy.
- One SiteNavigationElement and one WPFooter.
- One FAQPage and one ContactAction, with nested data.

The service descriptions, use-case entries, process steps, moving-company scenario, company address and representative, and privacy-policy body were not represented by their own registered content. Some related themes appear in the FAQ and page descriptions; that is not complete content coverage.

At the time of that exploration, the privacy WebPage also referenced the FAQ through the default `hasPart`, although its UI did not render it.

## Starter-kit validation gate before Phase 2

The initial implementation and its passing tests are not sufficient evidence of generic page ownership. Inspection of the official website exposes a concrete mismatch:

- [`HomeClient.tsx`](../../apps/starter-kit/app/HomeClient.tsx) renders the registered home FAQ, but no registered AutoForm.
- [`DocsClient.tsx`](../../apps/starter-kit/app/docs/DocsClient.tsx) renders `AutoForm` with `formId="contact-sales"` from `data.forms` on `/docs`.
- The current `createContextualApp.getGraph` defaults non-global `forms` to home/single-page targets, rather than their declared placement. The normal `/docs` graph does not include them through that default.
- The site also has privacy and terms pages, plus mutable documentation examples that must not become live site entities.

Before Phase 2:

- [x] Replace implicit home ownership with explicit, generic membership and a documented compatibility path.
- [x] Resolve precedence between section ownership and explicit page parts; avoid two conflicting sources of truth.
- [x] Add a self-contained home/docs/privacy/terms fixture with the registered form on docs and the FAQ on home.
- [x] Assert correct included nodes, page references, and exclusions, including relevant dependencies and endpoint/programmatic parity.
- [x] Keep documentation/playground sample state separate from canonical records.
- [x] Recheck the original completion claims for reference validation, invalid data, and link safety; record remaining gaps rather than treating passing tests as full coverage.

This is a prerequisite hardening task, not a new primitive or a migration of `co-jp`. No external checkout is required. Checked items below record the initial implementation; reopened items require further validation.

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

- [x] Define serializable content records: stable local ID, title, optional summary, body, language, and supported references.
- [x] Separate body text from presentation: no `ReactNode`, SVG, or component functions in canonical data.
- [x] Keep formatting deterministic. CSS and renderers may alter presentation, but not independently rewrite exported content.
- [x] Treat qualifiers and disclaimers as first-class content, not optional graph metadata.
- [x] Keep module organization flexible: shared data need not live in one giant `site.server.ts` file.

### 2. Identity and page membership

- [x] Define stable IDs for pages, sections, collections, items, and domain entities.
- [x] Keep existing entity IDs stable where possible, especially Organization and WebPage IDs.
- [x] Distinguish a graph `@id` from a navigable DOM anchor/URL; expose source anchors where available.
- [x] Choose one authoritative page-membership representation and derive inverse relationships; resolve the current dual-resolution ambiguity.

Recommended starting point: a page manifest with ordered section references. An alternative is ownership stored on section records. Do not require authors to maintain both independently. The same membership data should guide rendering and graph selection.

A section placement belongs to a page; a Service or Organization can be described on multiple pages without becoming multiple entities.

### 3. Graph scope and relationships

- [x] Define global export as all eligible public content and entities across pages.
- [x] Validate page export as that page's declared content plus relevant shared entity dependencies on the starter kit.
- [x] Build `WebPage.hasPart` from actual page membership without home-specific assumptions.
- [x] Use `isPartOf` for section/page relationships and appropriate references for subjects and entities.
- [x] Establish precedence for page selection, include/exclude keys, legacy defaults, and dependency resolution.
- [x] Verify internal reference resolution and distinguish intentionally external references from missing local records.
- [x] Route and programmatic graph generation must share selection and serialization rules.

Conceptual relationship model, not a finalized ID format:

```text
Home WebPage ─hasPart→ Services section ─mainEntity→ Service ItemList
                                                       └─item→ Service
                                                                 └─provider→ Organization
Privacy WebPage ─hasPart→ Privacy content sections
```

### 4. Output ownership

- [x] Choose one owner for page-level JSON-LD emission; composed primitives must not each inject duplicate scripts.
- [x] Keep graph generation independent of rendering order, browser execution, and mounted components.
- [x] Define standalone primitive behavior separately from app-integrated behavior.
- [x] Apply safe JSON-LD script serialization in WebPage and ContextualSite.
- [x] Validate supported link protocols before the Phase 2 content renderer consumes link blocks.
- [x] Export public content only; form field definitions are not submitted user data.

Shared data and manifests reduce drift but cannot prove arbitrary custom JSX displays every declared field. Use fixtures and targeted render/export checks rather than promising automatic visibility detection.

## Exit criteria

- [x] Contract and scope decisions are recorded in [DECISIONS.md](DECISIONS.md).
- [x] Fixtures cover home, privacy, and an entity reused across pages.
- [x] Tests demonstrate deterministic IDs, page isolation, reference resolution, and equivalent endpoint/programmatic selection.
- [x] Document and test the compatibility path when replacing the initial home-specific selection behavior.
- [x] The contract can represent a real pilot section without requiring a new catalog component.
