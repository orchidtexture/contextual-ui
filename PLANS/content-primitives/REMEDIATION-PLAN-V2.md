# Content Primitives — Remaining-Issues Remediation Plan (V2)

**Status:** Proposed; implementation and acceptance checks below are not yet complete.
**Baseline:** [REVERIFICATION.md](REVERIFICATION.md): 3 success criteria verified, 4 partial, findings F1–F5. The implementation is now in the repository at base commit `35e322c`; capture the actual implementation/review commit when executing this plan.
**Goal:** Close criteria **1, 2, 3 and 5**, preserve criteria **4, 6 and 7**, and supply reproducible evidence before opening the Phase 5 gate.
**Relationship to V1:** This is the execution plan for the remaining work in [REMEDIATION-PLAN.md](REMEDIATION-PLAN.md), not a relaxation of its acceptance criteria. Keep all three verification reports unchanged as historical evidence.

## 1. Boundaries and completion rules

- Reusable identity, validation, content serialization and primitive behavior belong in `packages/core`. Site content, projections, compositions and integration/browser tests belong in `apps/starter-kit`.
- Consume public workspace exports and rebuild them before app tests. No direct core-source aliases in the app harness.
- Preserve design, public URLs/anchors, FAQ ownership on home, registered AutoForm ownership on docs, and one WebPage-owned JSON-LD script per content page.
- Preserve R1's explicit demo opt-outs. Do not change global Navbar/Footer defaults or solve coverage by removing real content/actions.
- Do not add catalog families, new domain entity types, a rich-text platform, or an external-repository dependency. Educational code remains text; it must not become live sample organizations, services, endpoints or actions.
- No deployment, publication, production form submission or external service call is authorized. Browser POSTs must be intercepted before they leave the browser.
- A work package is done only when its named regressions, actual app composition checks and evidence pass. A heading, increased node count, manually repaired fixture, or passing old suite is not completion.
- Missing browser execution, an unclassified content group, unexplained exclusions, or a known failing acceptance case blocks final sign-off. Do not convert them into implied passes.

## 2. Work packages and execution order

| ID | Work package | Findings / criteria | Primary locations |
| --- | --- | --- | --- |
| V2-0 | Make the failures durable and establish verification commands | All findings; protects all criteria | App/core tests, package scripts |
| V2-1 | Resolve collection identity and stable-ID validation completely | F1, F2 / 3, 5 | Core content schemas/utilities, page membership and tests |
| V2-2 | Complete the content inventory and prove the shared-data contract | F3, F4, F5 / 1, 2, 3 | App content modules, coverage inventory and tests |
| V2-3 | Bind homepage CTAs and diagram to supplied data | F4 / 1, 2, 3 | HomeClient, hero-flow, home records |
| V2-4 | Finish quickstart content and ordering parity | F5 / 1, 2, 3 | quickstart records, QuickstartSection |
| V2-5 | Migrate all remaining meaningful docs/home content | F3 / 1, 2, 3 | Focused content modules and existing renderers |
| V2-6 | Document compatibility and reconcile completion claims | F1, F2; previous evidence gaps / 5 | Identity guide, release notes, phase/decision documents |
| V2-7 | Run durable production/browser verification and sign off | All seven criteria | App verification harness and new report |

**Order:** V2-0 → V2-1 and V2-2 → V2-3/V2-4 → V2-5 → V2-6 → V2-7. Identity work may run independently of the content inventory, but must finish before graph fixtures and release notes are finalized. Migrate docs in the bounded batches below rather than one large DocsClient rewrite.

Each implementation commit should include its regression tests. Record red-before-fix and green-after-fix evidence; do not leave a completed package dependent on an untracked `/tmp` script.

## 3. V2-0 — Durable failure cases and test infrastructure

Start by translating the reverification's five failing app probes and identity probes into repository tests. Also retain the two positive probes so correct code and add/remove behavior do not regress.

### Required changes

- [ ] Add durable app tests for CTA label **and href**, supplied diagram-stage content, quickstart paragraph content, optional qualification, and reorder without repairing `order` values.
- [ ] Add core failure fixtures for absolute/custom IDs, delimiter collisions, empty IDs and whitespace-equivalent duplicates; execute them through both the direct generator and `createContextualApp`.
- [ ] Strengthen the existing quickstart code-mutation test to assert the exact updated graph `text`, not only UI code and graph name/description.
- [ ] Replace UI containment assertions for reordered content with parsed item-ID sequences, counts and numbering.
- [ ] Replace the policy graph-only “renders” check with actual policy composition rendering and in-memory paragraph/qualifier/link mutation coverage. Reuse the real page content composition; do not make a test-only reconstruction of the policy JSX.
- [ ] Await every graph invocation before checking immutability. Compare the complete connector data before and after overrides, exports and demo interactions, not just one original title.
- [ ] Render UI and generate its page graph from the **same effective supplied data**. A WebPage using the original app while its child gets an override is not an override-parity test.
- [ ] Use an HTML parser with explicitly declared test dependencies for DOM structure and decoded text extraction. Exclude scripts/styles from visible-text assertions; parse **every** JSON-LD script, including standalone objects/arrays. For tabbed content, distinguish rendered DOM text from browser-visible text.
- [ ] Add a starter-kit `lint`/typecheck script so recursive lint no longer silently skips the app. Document that this is TypeScript checking unless an actual linter is added.
- [ ] Keep unit/SSR tests in the recursive test workflow. Add separate documented production-output and browser commands plus an aggregate verification command/CI job that requires all of them.

Before introducing framework-specific harness code, read the relevant **installed** Next.js App Router testing and route documentation. Vitest rendering of resolved server components is supplemental evidence; production route behavior needs the built app. Declare Playwright and its browser setup in the app package, keep browser specs out of Vitest discovery, and document browser installation. Give production-output checks their own configuration/script too, so ordinary app unit tests do not silently depend on a pre-existing `.next` build.

**Exit evidence:** committed failing-case matrix with test paths/names; current failures reproduced; normal workspace tests demonstrably include starter-kit; every final verification command exists and fails on assertion errors rather than skipping missing suites.

## 4. V2-1 — Canonical collection identity and validation

Sources: [content.utils.ts](../../packages/core/src/content/content.utils.ts), [content.schema.ts](../../packages/core/src/content/content.schema.ts), [createContextualApp.ts](../../packages/core/src/server/createContextualApp.ts), [defineSchema.ts](../../packages/core/src/registry/defineSchema.ts).

### Identity contract to implement

1. **Resolve the parent once.** Introduce or refactor a core resolver that accepts collection identity and the supported ID context. Generators, derived WebPage `hasPart`, explicit-membership matching and child identity must use its result, not independently assemble strings.
2. **Preserve explicit identities.** Supported fragment/absolute parent IDs are identities, not slugs. Do not remove their origin, query, fragment, punctuation or namespace. Page ownership adds relationships; it must not rewrite an explicit parent ID. Preserve other currently supported URI forms or explicitly validate/document their rejection before changing behavior.
3. **Encode local tuple components unambiguously.** Preserve ordinary local patterns below. Delimiters and literal escape characters inside a component must not be confused with tuple separators. Use a deterministic, lossless encoding or documented validation—not punctuation-to-underscore replacement.
4. **Derive children from the resolved owner's identity.** A child is a placement within that owner. For nonstandard/custom parent IDs, use a disjoint, reserved encoded-owner namespace or equally collision-safe scheme. Do not feed raw URLs/fragments into a helper that passes them through as the parent. Account for supported fragment/absolute equivalence under a configured base URL.
5. **Keep identity independent of order/copy.** Reordering or editing titles, descriptions, code and qualifications must not change IDs. Changing the owner changes placement identity; shared `item` references still point to one domain entity.
6. **Validate custom helper output.** Test supported `jsonLdContext.createId` and `refersTo` pairs, including absolute/custom parent mappings. Definitions and references must agree. A helper producing ambiguous IDs must fail with a diagnostic, not silently merge records.

Required preserved ordinary patterns:

```text
unscoped features / first  → #itemlist:features      → #listitem:features:first
home / features / first    → #itemlist:home:features → #listitem:home:features:first
docs / features / first    → #itemlist:docs:features → #listitem:docs:features:first
```

Before changing the generator, write the exact encoding/reserved-namespace rules and concrete expected fixtures in the identity contract/tests. Demonstrate that local IDs cannot enter the reserved namespace and collide with custom-parent children. An explicit ID that intentionally denotes the same canonical owner is not a different owner merely because it was supplied in a different spelling.

### Stable-ID and duplicate policy

- Require string, nonempty collection/item IDs and, when supplied, page IDs. Reject leading/trailing whitespace rather than silently trimming it. Define handling of embedded whitespace, Unicode, percent signs and URI delimiter characters.
- Remove item identity fallback to position. Missing, empty and whitespace-only item IDs must fail regardless of item order.
- Detect duplicate item IDs using the same validated/canonical representation used for generation. Check emitted IDs as well, including collisions introduced by custom helpers.
- Detect distinct collection definitions that resolve to an unintended shared identity. Do not turn unrelated owners into one collection/name array; document treatment of explicitly repeated shared-owner records.
- Enforce the policy at schema parsing **and generator entry points**. `defineSchema.hydrate` preserves raw invalid data on validation failure today, so a Zod refinement alone is insufficient. Keep this fix collection-specific; do not silently change global hydration behavior for unrelated registries.
- Build page references from the effective data used for export, including overrides. Add/remove/move overrides must not leave `hasPart` references to old or nonexistent owners. Preserve explicit membership precedence and supported single-record/array forms.

### Required identity test matrix

- [ ] Ordinary scoped/unscoped fixtures above, copy edits, reorder and moving an item to another owner.
- [ ] Different absolute origins, schemes, ports, paths, queries and fragments; custom fragment IDs; generated-looking explicit IDs.
- [ ] Delimiters at **every tuple boundary**, including the reproduced `features / extra:first` vs `features:extra / first` collision.
- [ ] Literal encoded strings versus their delimiter-containing counterparts, Unicode and reserved-namespace adversarial inputs.
- [ ] Missing/non-string/empty/whitespace-only IDs; `first` versus ` first `; repeated valid item IDs; custom-helper output collisions.
- [ ] Direct generation, strict schema parse, resilient hydration, actual `getGraph`, derived/explicit page memberships, and dataOverrides.
- [ ] Flattened and nested graphs with and without a base URL; definitions/references resolve and unrelated names stay scalar. Repeat identical input to prove determinism.
- [ ] A **complete** fixture with two placements, one Service, one Organization/provider and required page/site nodes—not just two references to a nonexistent Service.

**Exit evidence:** F1/F2 regressions green; no dangling custom-owner references; written identity contract and compatibility cases. No snapshots may be updated merely to accept merged identities.

## 5. V2-2 — Coverage inventory and shared-data contract

Create `PLANS/content-primitives/CONTENT-COVERAGE.md` as a deliverable, before claiming another migration batch complete. It is an audit map, not another copy of the prose.

Every content group needs:

```text
stable group ID | page + anchor | classification | authored source + field
actual rendering location/state | primitive/graph projection + field
mutation/coverage test | migration status or explicit exclusion reason
```

Inventory **meaningful body text, links/destinations, subtitles, API descriptions, code, qualifications and available variants**, not only section headings. The table below defines the minimum sweep; split rows into actual groups in the inventory.

| Batch | Mandatory inventory scope |
| --- | --- |
| H1 | Hero heading/body and every CTA label/destination |
| H2 | Pipeline introduction; all diagram node titles/subtitles/explanations; existing details/examples and their actual availability |
| H3 | Foundations introduction; existing feature sections, conclusions, CTA links, inline SSOT/graph examples and FAQ introduction |
| D1 | Docs introduction, navigation descriptions, full eight-step quickstart, optional qualifications and all installation variants |
| D2 | Every registry's description, field reference, schema/data examples, overview/custom-schema explanations |
| D3 | ContextualSite, WebPage, Navbar, Footer, Breadcrumb and FAQ explanations, prop tables, static example/schema descriptions and authored variants |
| D4 | AutoForm and createForm instructions, code steps, validation/lifecycle explanations, prop descriptions and qualifications |
| D5 | Static/CMS/database connector instructions and examples |
| D6 | Metadata helper descriptions, options/return fields, authored page/override examples |
| D7 | Sitemap and robots introductions, complete option tables, handler/Next.js/custom-route/AI-control examples and caveats |
| P1 | Complete privacy/terms text, lists, links and qualifications; preserve wording |

### Source and projection rules

- Prefer existing `SectionRecord`, `CollectionRecord` and content blocks as the effective supplied-data contract. Use typed app-specific records only where they meaningfully preserve table fields or example variants.
- If an app-specific authored record needs a projection, both its UI and its Section/Collection projection must derive from that **same supplied record** through one deterministic boundary. Validate/preserve it in the app's data contract. Do not pair import-time default content with separately overridden projected sections.
- Any materializer must be shared by the connector and override/test path, with an explicit authoritative input. Do not store independently editable prose in both the authored object and its generated graph projection. Use existing core generators after projection; do not fork them in the app.
- Keep official narrative and educational examples distinguishable in the records and exported text. Maintain a canonical authored example/template for editable demos; transient edits may update the preview, not canonical data.
- Export **all authored available variants**, not whichever registry, package manager or tab is initially selected. Generated examples must derive from shared templates plus canonical inputs, never from live user state.
- Keep destination information as well as labels in machine-readable output. If the generic link text projection currently drops `href`, define and test a minimal reusable projection (for example label plus destination in text) and retain structured blocks in agent data. Do not invent navigation Actions or unresolved entity `@id` references for ordinary hyperlinks.
- Preserve meaningful subtitles and qualifications in an appropriate existing text field. Avoid repeating the full body at parent and child nodes; use ownership/reference relationships and concise parent introductions.
- Geometry, colors, icon components, animation and client state are not canonical content. Unused legacy diagram fields must be explicitly reviewed as unused source, not silently exported as site facts or used to excuse missing visitor-visible content.
- Use typed records and exhaustive projections; avoid `any[]` builders and schema-stripped ad hoc fields that make qualifications disappear.

### Contract proof before bulk migration

- [ ] Inventory is complete enough to account for every content group in the sweep above, including exclusions and tab states.
- [ ] Migrate one registry with its full reference table and both example tabs as a vertical slice.
- [ ] Change a field description, code example, qualification and link destination through the authoritative supplied record; prove the actual UI and the intended page/global graph fields change together.
- [ ] Verify graph text cannot satisfy the UI assertion, default imports cannot override supplied content, and connector inputs remain unchanged.
- [ ] Resolve any minimal reusable serialization gap in core with tests before repeating the pattern across docs.

**Exit evidence:** completed inventory structure and a tested source→UI/export contract. Five section summaries cannot satisfy this gate.

## 6. V2-3 — Homepage CTA and diagram parity

- [ ] Render hero CTAs from canonical link records through the existing Content link override or an equivalent supported composition. Keep classes, icons, layout and targets; remove competing JSX labels/hrefs.
- [ ] Pass the effective `pipeline-stages` data from HomeClient into HeroFlowDiagram. Merge semantic records with a stable-ID presentation map in a pure function; remove module-level mutations of `initialNodes` and semantic fallback copies.
- [ ] Make the selected explanation and node labels read the same effective records. Do not maintain an independent `name` that silently overrides an edited `title` in exports unless they deliberately represent different documented fields.
- [ ] Recompute when supplied data changes, not only on module load or first mount. If the selected node disappears, choose an existing node or render an explicit empty state without stale copy. Define deterministic handling of a new stage without bespoke geometry.
- [ ] Keep pipeline branch relationships as diagram presentation; do not introduce a HowTo claim or an artificial linear process to satisfy collection rendering.
- [ ] Complete H3's remaining homepage links, prose and educational examples using V2-2's contract.

**Tests:** mutate CTA label/href; mutate selected and non-selected node title/body/subtitle; rerender with replacement data; remove/select stages; verify UI text/attributes and exact graph fields, stable IDs and unchanged originals. Use browser checks for canvas content not available in SSR. Preserve existing diagram filters, pan/selection and responsive layout.

## 7. V2-4 — Complete quickstart semantics without a parallel guide

- [ ] Preserve all eight current steps and stable IDs; review instructions/code against actual exported APIs. Record any substantive copy corrections explicitly and apply them to both outputs.
- [ ] Make array sequence the only authored order. Remove hand-maintained `order` from step definitions. Prefer omitting it from quickstart collection items so the core generator derives position from array index; number the UI from that same sequence. Do not remove generic explicit-order support from core to solve this app-specific problem.
- [ ] Represent optional status as real canonical qualification content that survives schema hydration, JSON-LD and agent serialization. Render its badge from that qualification, not a step-ID-based `optional` flag in a presentation map.
- [ ] Move create-next-app and pnpm/npm/yarn/bun command strings and their meaningful annotations into shared records. Selectors/copy controls consume those strings; all authored variants remain exportable as educational code.
- [ ] Render the complete ordered block sequence via `Collection.Content`/`Content` overrides or an exhaustive equivalent composition. Preserve **every** paragraph, heading, list, link, code block and callout. Never select only the first matching block.
- [ ] Retain specialized code panels and install controls using presentation-only dispatch. Their slots cannot contain a second copy of the instruction, command, qualification or step title.
- [ ] Preserve `#quickstart`; any added step anchors derive from stable IDs, not positions. Keep `ol > li` and DOM sequence valid.

**Tests:** title, description, body, qualifier, optional label and exact code mutations; link label/href mutation; multiple code/callout blocks; block add/remove/reorder; all package-manager variants; step add/remove/reverse without editing positions. Assert UI item IDs/order/count/numbering, graph `itemListElement` sequence/positions/count/text, unchanged IDs for surviving items and unchanged connector data. Exercise supplied hydrated records, not just the source builder.

**Exit evidence:** the API step's own exported content says it is optional; commands are exported; F5 probes pass; no hidden second source remains in the presentation map.

## 8. V2-5 — Complete docs migration in bounded batches

Use the contract proven in V2-2, not a second hand-maintained graph summary.

Suggested implementation commits:

1. **D1/D2:** docs introduction/navigation descriptions and complete registry reference content. Quickstart itself is owned by V2-4.
2. **D3:** all six component/provider showcases, full prop contracts and canonical educational examples. Preserve editable preview isolation.
3. **D4/D5:** form instructions/prop references and all connector variants. The registered contact action stays live; example actions remain code text.
4. **D6/D7:** metadata, sitemap and robots explanations, tables, examples and qualifications.
5. **P1/final sweep:** real policy mutation tests and inventory reconciliation for any remaining homepage/docs copy.

For **each** batch:

- [ ] Move authored text/field/example data into focused serializable modules; do not move an enormous JSX string into `site.server.ts`.
- [ ] Have tables consume shared field records directly; project field names, types, requirements, schema mappings and descriptions without inventing specialized schema entities for table rows.
- [ ] Supply records to actual renderers through the effective app data path. Remove competing defaults once the supplied-data behavior is covered.
- [ ] Test representative paragraph, reference-row, code, link and qualifier mutations for every category present; test each available variant is in the export and selectable in the UI.
- [ ] Assert semantic coverage for **all inventory groups in the batch**, not only one representative heading. Assertions should verify meaningful body values and relationships at their owning graph nodes.
- [ ] Verify page/global export consistency, no unrelated route content, and no sample-entity/script leakage.
- [ ] Update the inventory with real source paths, graph fields and passing test names. Unmigrated or unjustifiably excluded groups remain blockers.

**Exit evidence:** every inventory group is either implemented/tested or has a reviewed, non-content exclusion. A source sweep of HomeClient, DocsClient and hero-flow finds no unexplained visitor-facing authored prose or static example owned only by JSX/local demo state. A heading-only record or whole-page text blob is not an acceptable substitute for the planned meaningful relationships.

## 9. V2-6 — Compatibility, release notes and plan reconciliation

- [ ] Add an identity/migration guide under `docs/guides/` covering ordinary scoped/unscoped IDs, custom owners, tuple escaping, validation errors and ID-versus-DOM-anchor semantics.
- [ ] Document both the original ambiguous `#listitem:features:first` → page-scoped correction and V2's custom/encoded identity changes. Explain that consumers must regenerate stored references/snapshots atomically; do not retain ambiguous old IDs as shared aliases.
- [ ] Document rejected empty/whitespace identifiers and how authors provide stable replacements. Record any observable link/text serialization change from V2-2.
- [ ] Review the current `contextual-ui` prerelease version and repository release process; record the required version/release-note decision before publishing. Do not claim full backward compatibility or publish as part of this remediation.
- [ ] Reconcile [Phase 1](01-data-and-graph-foundations.md), [Phase 4](04-starter-kit-pilot.md), [DECISIONS.md](DECISIONS.md), the overview and V1's remaining checks with tested behavior. Preserve historical verification reports rather than rewriting their results.
- [ ] Keep Phase 5 catalog packaging and disposable-consumer release-artifact verification explicitly separate. Passing this plan opens that phase; it does not complete its release gate.

**Exit evidence:** implementation-specific migration examples, documented version decision, no contradictory current completion/compatibility claims, and links to the final tests/report.

## 10. V2-7 — Durable production verification and final sign-off

### Commands to establish

The following production/browser scripts are **deliverables**, not commands claimed to exist today:

```sh
pnpm build
pnpm -r --if-present test
pnpm -r lint                         # must now include starter-kit
pnpm --filter starter-kit run test:production
pnpm --filter starter-kit run test:e2e
```

Add `pnpm verify:content` and a corresponding CI job running these gates in order and propagating failures. Build once before inspecting production output; do not inspect stale `.next` files or count a missing suite as a pass. Declare all runner/parser dependencies and use a deterministic localhost port/server lifecycle. Browser setup failures block this gate until resolved or explicitly re-scoped by the maintainer, never silently skipped.

### Production-output assertions

- [ ] Inspect fresh home/docs/privacy/terms HTML. Parse every JSON-LD script, verify script ownership, and compare semantic content with the actual visible/available UI separately from scripts/styles.
- [ ] Assert each inventory group's body, qualifications, code and destinations at its intended graph node; account for tabbed content through authored-variant/browser checks rather than requiring every tab to be simultaneously visible.
- [ ] Verify FAQ/home and ContactAction/docs ownership, explicit/derived memberships, ordinary canonical shared identities and zero missing local references on all four pages and the global graph.
- [ ] Exercise the actual API handler and local HTTP endpoint; verify status/content type and programmatic equality. Compare registered content, allowing documented page-versus-website layout ownership differences rather than demanding inappropriate byte equality across scopes.
- [ ] Parse `/schema`'s displayed JSON and compare it with the actual API; open its graph drawer. Missing optional collection edges are not a blocker.
- [ ] Assert no standalone demo scripts, sample live Service/Organization/Action definitions, submitted values or response payloads in canonical graphs. Educational JSON in code strings is allowed and safely escaped.

### Browser suite

Retain at least the reverification's successful smoke coverage as durable tests:

- [ ] Home FAQ open/close; diagram selection/filtering; supplied diagram-data update coverage.
- [ ] Home CTAs, visible docs-sidebar navigation, existing anchors and shared mobile navbar.
- [ ] Quickstart package selectors, clipboard/code panels, optional badge and valid list structure.
- [ ] Registry/component example tabs, reference-table content, editable Navbar/Footer/FAQ/Breadcrumb demos and reset behavior.
- [ ] Invalid form input produces validation feedback and no POST; valid synthetic input reaches an intercepted local request and renders success.
- [ ] After demo edits and form interactions, page scripts and canonical API data remain unchanged; assert the intercepted request never reaches the real handler.
- [ ] Home/docs at desktop and mobile sizes; no unintended page overflow; representative screenshot comparison/review for hero, diagram, quickstart, reference tables and code panels.
- [ ] No uncaught runtime/hydration errors. Set browser visibility/focus and permissions correctly; click visible controls rather than interpreting hidden-tab/offscreen automation failures as app behavior.

### Final criterion-to-evidence gate

| Criterion | Evidence required to mark complete |
| --- | --- |
| 1 — Coverage and example boundaries | Completed inventory; all-category export assertions; every page script audited; authored variants included and transient facts excluded |
| 2 — Shared edits | Actual composition mutation tests for home, diagram, CTAs, quickstart, each docs category and policies; correct UI attributes and exact graph fields; immutable originals |
| 3 — Page content/relationships | Fresh four-page content checks, correct action/membership ownership and reference integrity; no graph-only summary substituted for visible meaning |
| 4 — Inspectability | Actual programmatic/handler/HTTP output equivalence and `/schema` JSON parity |
| 5 — Identity | Full V2-1 adversarial matrix, complete Service/provider fixture and published-in-repository migration contract |
| 6 — Reuse | Existing core primitives/generators used for all migrated layouts; no app-specific serializer fork |
| 7 — Compatibility | Existing suite plus durable production/browser smoke; preserved navigation, FAQ, docs controls, form behavior and responsive presentation |

### Evidence and closure

- [ ] Record the reviewed commit; if uncommitted changes remain, identify the exact patch/tree rather than naming only its base commit.
- [ ] Write a **new** completion verification report with commands, exit statuses, package/test counts, browser configuration, coverage-inventory links, F1–F5 resolutions and limitations. No minimum node/test count substitutes for the assertions above.
- [ ] Rerun the original five failing app probes and all F1/F2 identity cases as part of the permanent suites. Verify no acceptance test is disabled, weakened or repaired by mutating supposedly independent order/graph data.
- [ ] Independently inspect representative migrated source groups after tests pass to catch content omitted from both fixtures and implementation.
- [ ] Only then mark this plan and the corresponding V1/README criteria complete and open Phase 5. Any remaining required failure keeps the affected criterion unchecked.

## Explicitly separate follow-ups

Inspector collection-edge visualization, broader catalog design, external adoption, production deployment and publication remain outside this plan. The ignored `pnpm.allowBuilds` configuration warning may be handled in a small tooling follow-up; record it accurately rather than calling a warning-bearing run clean. None of these optional items can replace or excuse F1–F5 closure.
