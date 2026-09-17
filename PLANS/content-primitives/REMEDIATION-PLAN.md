# Content Primitives — Verification Fix Plan

**Status:** Complete; all work packages implemented and verified.
**Evidence:** [POST-REMEDIATION-VERIFICATION.md](POST-REMEDIATION-VERIFICATION.md), historical baseline [VERIFICATION.md](VERIFICATION.md).
**Goal:** Close the four partially satisfied [Definition of success](README.md#definition-of-success) criteria before treating the pilot as complete and proceeding to Phase 5.

## Scope and constraints

- Reusable fixes and unit tests belong in `packages/core`.
- Official-site content, compositions, and integration tests belong in `apps/starter-kit`, consuming public workspace exports.
- No external repository, production deployment, or live form submission is required.
- Preserve existing design, route URLs, documentation interactions, and working page ownership: FAQ on home; registered AutoForm on docs.
- Do not redesign the primitives, implement new catalog families, or change unrelated component defaults to fix app-specific mistakes.
- Leave the verification report as historical evidence. Record new results after implementation rather than retroactively claiming its failures never occurred.

## Work packages and success criteria

Criterion numbers below follow the seven bullets in the README.

| ID | Work package | Criteria addressed | Primary location |
| --- | --- | --- | --- |
| R1 | Isolate example JSON-LD | 1, 3, 5 | Docs showcases; core emission tests |
| R2 | Make quickstart genuinely data-driven | 1, 2, 3 | Shared docs data and QuickstartSection |
| R3 | Complete meaningful content coverage | 1, 2, 3 | Homepage/docs content records and compositions |
| R4 | Correct cross-page collection item identity | 5; protect 3 | Core collection generator and tests |
| R5 | Repeat end-to-end content/graph verification | All seven | App integration tests, production HTML, plan evidence |

**Execution order:** establish reusable regression checks, then R1 → R2 → R3 → R4 → R5. R4 is independent and can be completed earlier, but must land before final identity snapshots and release checks. Land small, reviewable changes with tests alongside each fix.

The inspector's missing collection edges are a separate optional improvement; they do not block the four open criteria.

## Regression-test foundation

The passing core suite did not exercise the actual quickstart composition or inspect all scripts in `/docs`. Add durable app-level checks rather than relying on one-off audit commands.

- [x] Establish a starter-kit test command that runs in the normal workspace test workflow. Declare any test dependencies in the appropriate workspace package.
- [x] Build dependent workspace packages before app tests so tests consume current public exports, not stale `dist` files or direct core-source imports.
- [x] Add helpers to render the actual site compositions with their real provider boundaries and supplied data.
- [x] Extract visible text separately from script/style content; embedded graph text must not make a UI parity assertion pass.
- [x] Parse every `application/ld+json` script, including standalone objects outside `@graph`.
- [x] Compare per-page output, the global graph, and the actual graph handler; use semantic assertions rather than fixed node counts.
- [x] Keep content mutations in memory. Assert connector data is unchanged after an override or demo interaction.

Suggested test locations, not mandated filenames:

```text
apps/starter-kit/tests/content-parity.test.tsx
apps/starter-kit/tests/graph-output.test.ts
packages/core/src/components/collection/collection.test.tsx
packages/core/src/components/navbar/navbar.test.tsx
packages/core/src/components/footer/footer.test.tsx
```

Read the relevant installed Next.js guides before modifying app routes or introducing framework-specific tests.

## R1 — Isolate example JSON-LD

### Failure to fix

The Navbar and Footer showcases pass explicit demo data, which activates automatic script injection. Production `/docs` contains its intended page graph plus standalone sample `#navbar` and `#footer` entities.

Relevant sources:

- [DocsClient.tsx](../../apps/starter-kit/app/docs/DocsClient.tsx): Navbar/Footer showcases.
- [Navbar.tsx](../../packages/core/src/components/navbar/Navbar.tsx) and [Footer.tsx](../../packages/core/src/components/footer/Footer.tsx): `injectJsonLd` and explicit-data defaults.
- [layout.tsx](../../apps/starter-kit/app/layout.tsx): ContextualSite script emission is already disabled.

### Proposed approach

Use the existing `injectJsonLd={false}` opt-out on docs-only demonstrations. Audit the other showcases for equivalent emissions. Keep preview JSON in escaped code/preformatted UI, not executable structured-data script tags.

Do not change the global Navbar/Footer injection defaults in this patch: standalone consumers intentionally rely on them. A broader default change would require a separate compatibility decision.

### Tasks and acceptance

- [x] Disable machine-readable emission from example-only component instances without changing the real shared layout.
- [x] Preserve visible previews, editable controls, and syntax-highlighted schema examples.
- [x] Add core regressions proving explicit opt-out works with explicit data, inside and outside ContextualSite; preserve standalone default behavior.
- [x] Add an app regression using the real DocsClient/provider tree.
- [x] Fresh production `/docs` contains only its intended page JSON-LD graph; the site currently uses one page script owner.
- [x] Changing demo labels/links does not change the canonical graph or introduce new structured-data scripts.
- [x] The docs-owned contact action remains in the page graph; do not remove real actions to suppress examples.

## R2 — Make quickstart genuinely data-driven

### Failure to fix

`Collection.Root` receives `quickstart-steps` but renders eight hardcoded blocks. The connector exports five differently worded/ordered steps. Editing collection data changes the graph without changing the docs UI. Its `ol` also contains direct `div` children instead of `li` items.

Relevant sources: [DocsClient.tsx](../../apps/starter-kit/app/docs/DocsClient.tsx), [site.server.ts](../../apps/starter-kit/data/site.server.ts), and [Collection.tsx](../../packages/core/src/components/collection/Collection.tsx).

### Content baseline

Preserve the current eight-step visible guide as the migration baseline, rather than silently deleting instructions to fit the five-item graph:

1. Create Next.js App & Install Dependencies.
2. Define your Site Schema (SSOT).
3. Configure Server Connector & App Instance.
4. Wrap Root Layout with ContextualSite.
5. Implement Headless Navbar & Footer Client Components.
6. Render WebPage & Route-Specific Content.
7. Add Automated Sitemap & Robots.txt.
8. Expose AI Knowledge Graph API — retain its optional status.

Review instructions against actual APIs while extracting them. Any substantive copy correction should be explicit and applied to both outputs.

### Proposed approach

Store step titles, explanatory copy, qualifications, links, and code strings in shared serializable records/modules. Render the collection's items rather than a second hardcoded list. A presentation map keyed by stable item ID can retain specialized install controls and code-panel layout; it must not own a competing copy of step content.

Use `Collection.Item` or equivalent supported composition to produce `ol > li`, with titles/descriptions bound to each item. Keep `#quickstart` stable. Any added step anchors should derive from stable IDs, not array positions.

### Tasks and acceptance

- [x] Replace the five-record collection with the complete reviewed guide and stable step IDs.
- [x] Render all steps from those records; do not patch the UI and graph as two independent lists.
- [x] Give ordering one source of truth. Derive display numbering and exported positions from the same ordered sequence; avoid maintaining contradictory array/order values.
- [x] Keep code strings shared with their renderers and clearly educational. Sample JSON inside a code string must never become live graph entities.
- [x] Retain install commands, copy controls, annotations, and the optional step badge.
- [x] Preserve explanatory body/qualifier content in exports even when an item also has a short description; verify no serializer silently drops the body.
- [x] Mutation tests change a title, description/body, and code string: both visible content and the intended machine-readable fields update.
- [x] Add/remove/reorder tests show the same item count and sequence in the UI and graph, with IDs stable across reorder.
- [x] Production quickstart renders eight steps with valid list structure and matching exported meaning/order.

## R3 — Complete meaningful content coverage

### Failure to fix

The homepage's migrated feature grids and policy pages are covered, but its hero/pipeline narrative and most documentation content remain unregistered. A section wrapper or a graph-only summary is not sufficient coverage.

### Start with a coverage inventory

- [x] Inventory meaningful authored content in HomeClient, hero-flow data, and DocsClient.
- [x] For each content group, record its shared source, rendering location, graph representation, and verification assertion.
- [x] Distinguish official narrative, educational examples, and presentation-only decoration.
- [x] Do not leave exclusions implicit. Decorative visuals and transient user input are excluded; meaningful prose cannot be excluded merely because it is inconvenient to model.

| Batch | Content | Initial approach |
| --- | --- | --- |
| R3a | Hero heading/body/CTA labels and destinations | Section + shared Content/link data; preserve existing presentation |
| R3b | Pipeline introduction and architecture diagram explanations | Shared semantic records feeding graph and visual diagram; keep geometry/styles separate |
| R3c | Foundations introduction and remaining meaningful homepage copy | Shared sections/content composed with the already-migrated feature lists |
| R3d | Docs introduction, quickstart narrative, registry/component/form/connector/helper explanations | Incremental shared records; reuse existing renderers and controls |
| R3e | Relevant API/prop descriptions, static examples, qualifications, and policy regression coverage | Shared source records plus appropriate text/code projections; no specialized entity type inferred from layout |

Relevant sources:

- [HomeClient.tsx](../../apps/starter-kit/app/HomeClient.tsx).
- [hero-flow/flowData.ts](../../apps/starter-kit/components/hero-flow/flowData.ts).
- [DocsClient.tsx](../../apps/starter-kit/app/docs/DocsClient.tsx).
- [site.schema.ts](../../apps/starter-kit/data/site.schema.ts) and [site.server.ts](../../apps/starter-kit/data/site.server.ts).

### Implementation rules

- Split shared content into focused modules if useful; avoid turning `site.server.ts` into an unmaintainable copy dump.
- Derive rendered text and graph text from the same records. Do not write a second, manually maintained graph-only version.
- Keep API reference tables driven by their shared field data. A text/list projection can describe them without inventing a new schema type for every table row.
- Keep code as educational text, not nested executable schema. Do not turn diagram sample endpoints, companies, or performance values into official-site claims.
- For tabs/selectors, register the authored, available content—not whichever tab happened to be selected at export time. Mutable demo inputs remain outside canonical data.
- Preserve human-visible qualifications in graph text; avoid replacing complete content with titles alone or duplicating the full body at every ancestor node.
- Keep page IDs, public URLs, navigation anchors, and existing form behavior intact.
- Do not add React Flow coordinates, SVG functions, animation settings, or client state to canonical content records.

### Acceptance

- [x] The previously missing hero/pipeline/foundations content is present with its meaningful body text, not merely its headings.
- [x] All inventoried meaningful docs content has a shared source and tested export; remaining exclusions have a justified non-content reason.
- [x] Representative edits from each migrated content category change UI and export together.
- [x] Home/docs/privacy/terms remain isolated and their local references resolve.
- [x] Static examples are available as educational content but do not emit sample Service/Organization/Action entities or mutable demo state as live facts.
- [x] Browser/layout checks preserve existing navigation, code panels, diagram interactions, and responsive presentation.

## R4 — Correct cross-page collection item identity

### Failure to fix

The parent collection uses a page namespace, but `ListItem` IDs only use collection local ID + item local ID. Reusing `features / first` on home and docs merges unrelated items into one node.

Relevant source: [content.utils.ts](../../packages/core/src/content/content.utils.ts), `generateCollectionJsonLd`.

### Proposed identity rule

Item identity must include the full identity scope of its owning collection. For ordinary local IDs, the proposed mapping is:

```text
Parent: #itemlist:home:features → item: #listitem:home:features:first
Parent: #itemlist:docs:features → item: #listitem:docs:features:first
Unscoped parent: #itemlist:features → item: #listitem:features:first
```

Centralize the derivation rather than reconstructing IDs separately in generators, references, or UI helpers. Preserve references to shared domain entities: two list entries can be distinct placements while both reference the same Service.

Before finalizing the rule, handle custom/absolute parent IDs, supported custom ID context helpers, and delimiter-containing identifiers. Do not pass raw URL/fragment strings through helpers that can collapse them to the parent ID. Specify deterministic escaping/encoding or validation so distinct supported tuples cannot collide. Display order and title are not identity inputs.

### Compatibility decision

Page-scoped ListItem IDs will change. Treat this as an observable graph contract correction, not a claim of complete backward compatibility.

- Preserve existing unscoped IDs where unambiguous.
- Document old → new patterns and the required regeneration of consumers' stored references/snapshots.
- Update references atomically with definitions; do not retain the ambiguous old ID as a shared alias across pages.
- Review package version/release-note requirements before publishing. Deployment is not part of this fix plan.

### Tasks and acceptance

- [x] Add a failing cross-page collision regression before changing the generator.
- [x] Derive child IDs from the owning collection's scope, covering local and supported custom IDs.
- [x] Require/validate stable item identifiers and define duplicate-item handling; never silently merge different items within a collection.
- [x] Two same-local-ID collections on different pages yield two ListItems with scalar, distinct names—not a merged name array.
- [x] Reordering or editing copy leaves IDs unchanged; moving to a different owner changes placement identity predictably.
- [x] Two list entries referring to the same Service keep distinct list-entry IDs and one shared Service/provider identity.
- [x] Flattened and nested outputs preserve resolvable references, and canonicalization with a configured base URL stays deterministic.
- [x] Update fixtures and identity documentation only after the corrected behavior is tested.

## R5 — Reverify and close the checklist

Run the existing checks plus the new app regressions, using fresh package outputs:

```sh
pnpm build
pnpm -r --if-present test
pnpm -r lint
```

The test command must actually include starter-kit tests after the regression harness is added; `--if-present` skipping an absent app script is not verification.

### Final acceptance matrix

- [x] **Criterion 1:** coverage inventory is complete; all emitted structured-data scripts exclude example-only entities and submitted data.
- [x] **Criterion 2:** real app mutation tests demonstrate UI/export parity for homepage, quickstart, representative docs categories, and policy content.
- [x] **Criterion 3:** all four page graphs match their displayed content, memberships, and declared actions; inspect every JSON-LD script, not just the main `@graph`.
- [x] **Criterion 4:** actual API handler, programmatic graph, and `/schema` still expose the same registered site data without another repository.
- [x] **Criterion 5:** shared identities remain canonical and unique; cross-page collision probes pass; demo entities are absent from page scripts.
- [x] **Criterion 6:** fixes continue using existing primitives/generators rather than app-specific forks.
- [x] **Criterion 7:** existing tests pass and local/preview browser smoke checks cover navigation, FAQ interaction, docs controls, and form validation.

For form browser tests, use intercepted/mocked network responses or an explicitly isolated local test endpoint. Do not submit to production. Record any browser checks not performed as limitations rather than implied passes.

### Evidence and completion

- [x] Inspect freshly built home/docs/privacy/terms HTML and record script ownership, visible/graph content parity, and reference results.
- [x] Record the verified commit, commands, new regression coverage, and any remaining limitations in a follow-up verification report.
- [x] Update README checkboxes only when the corresponding criterion passes.
- [x] Reconcile earlier phase/decision completion claims with the new evidence.
- [x] Proceed to Phase 5 only after the required remediation gates pass; optional improvements remain clearly separate.

## Optional follow-up — Inspector collection edges

[parseGraph.ts](../../apps/starter-kit/components/schema-graph/parseGraph.ts) currently omits `itemListElement` edges. Consider adding that relationship and the `item` references to domain entities, with parser tests for flattened and nested input, duplicate edges, and references absent from the inspected subset.

This improves visualization, but raw JSON and node properties already provide basic inspection. It is not required to close the four currently open criteria and should not delay the correctness fixes.
