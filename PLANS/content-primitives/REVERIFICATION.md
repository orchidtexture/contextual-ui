# Content Primitives — Independent Remediation Reverification

**Date:** 2026-09-17 (verification environment UTC date).
**Reviewed tree:** `f03c4c830b3e7178dbad910d1c9903e00c564840` **plus the staged, uncommitted remediation changes**. The base commit alone does not contain the implementation reviewed here.
**Staged patch fingerprint:** SHA-256 of `git diff --cached --binary`: `db93238a4087ab0d07a677541560bcca54c9af32c88fdc6d58a46d299a3fee3b`.
**Verdict:** **3 criteria verified; 4 partially satisfied. Do not close remediation or proceed through the Phase 5 gate yet.**

This report supersedes the completion verdict in [POST-REMEDIATION-VERIFICATION.md](POST-REMEDIATION-VERIFICATION.md). That report and [VERIFICATION.md](VERIFICATION.md) remain unchanged as historical evidence. This verification changes documentation only, not runtime implementation or the existing regression suites.

## Checks rerun

| Check | Result |
| --- | --- |
| `pnpm build` | Passed; workspace packages rebuilt and Next.js production generation completed, 14/14 prerendering tasks |
| `pnpm -r --if-present test` | **178 passed:** 9 graph-builder, 155 core, 14 starter-kit tests; 18 test files across 3 packages |
| `pnpm -r lint` | Passed **the four configured package typechecks**; starter-kit has no `lint` script and is skipped |
| `pnpm --filter starter-kit exec tsc --noEmit` | Passed separately |
| Additional app acceptance probes | **5 failed, 2 passed**; actual HomeClient/DocsClient, real ContextualSite, in-memory overrides, public package exports |
| Core identity probes through built public exports | Ordinary home/docs IDs pass; custom-ID, delimiter, whitespace and empty-ID cases fail the contract below |
| Fresh production HTML and local production server | All JSON-LD scripts parsed on home/docs/privacy/terms; API and inspector checked |
| Local Chrome browser smoke | **21/21 checks passed** after correcting browser focus/visibility and interaction setup; details below |

The app test script builds its workspace dependencies before Vitest, so it does run in the recursive test workflow against fresh public exports. The installed Next.js Vitest guide was consulted; direct component rendering is supplemental SSR evidence, not a substitute for Next.js production/browser verification.

`pnpm` also warns that the root `pnpm.allowBuilds` configuration is ignored by the installed version. This did not fail the commands above.

## Acceptance matrix

| # | Criterion | Result |
| --- | --- | --- |
| 1 | Meaningful content exported; examples not live facts | **Partial:** example script leakage fixed, but substantial authored docs content and quickstart qualifications remain unexported |
| 2 | Shared edits update UI and exports | **Partial:** title/description/code improvements work; hero CTAs, supplied pipeline-stage data and quickstart body mutations still diverge |
| 3 | Four page graphs contain correct content and relationships | **Partial:** existing registered memberships and local references pass; missing content/qualifications prevent full content parity |
| 4 | API and inspector expose actual registered site data | **Verified:** actual handler/programmatic equality, local HTTP 200, inspector JSON equals the API |
| 5 | Stable, unique, canonical identities | **Partial:** ordinary cross-page collision fixed; supported custom IDs and delimiter-containing IDs still collide or leave dangling references |
| 6 | Reuse existing primitives/generators | **Verified:** feature grids, ordered quickstart and policy Content use public core implementations |
| 7 | Existing integrations continue working | **Verified within unit/SSR/build and selected browser smoke scope:** FAQ, navigation, docs controls, mocked AutoForm submission and responsive smoke checks pass |

Work-package disposition: **R1 verified; R2, R3, R4 and R5 partial.** R5 cannot close the plan while the required content and identity gates fail.

## Findings

### F1 — High: custom collection identity loses information and breaks references (R4)

Sources: [content.utils.ts](../../packages/core/src/content/content.utils.ts), lines 293–345; [createContextualApp.ts](../../packages/core/src/server/createContextualApp.ts), lines 247–257.

`deriveCollectionScope` strips custom fragment prefixes, drops the origin/query from absolute IDs, replaces punctuation with underscores, and concatenates unescaped tuple components. `generateCollectionJsonLd` now uses that transformed scope for the **parent** as well as its children. Page membership still constructs references using the original custom ID.

Observed public-generator results:

| Input | Actual result |
| --- | --- |
| Collection IDs `https://a.example/features` and `https://b.example/features`, each with item `first` | Both parents become `#itemlist:features`; both children become `#listitem:features:first`; flattened child `name` is an array containing both unrelated names |
| `(pageId=home, collection=features, item=extra:first)` and `(pageId=home, collection=features:extra, item=first)` | Distinct parent lists share `#listitem:home:features:extra:first` |
| Collection `#custom-list`, owned by docs | Definition becomes `#itemlist:docs:custom-list`, but WebPage `hasPart` still points to `#custom-list` |

The last case was also tested through `createContextualApp`, with Organization, WebSite and WebPage supplied so other dependencies resolve. With base URL `https://example.com`, reference validation reports exactly `https://example.com/#custom-list` as missing, for **both flattened and nested output**.

**Required:** preserve supported explicit parent identities, encode or validate tuple components without lossy collisions, and use one canonical derivation for definitions and references. Add custom/absolute ID and custom-context regression cases, not only ordinary local IDs.

### F2 — High: stable item-ID validation can still silently merge entries (R4)

Source: [content.utils.ts](../../packages/core/src/content/content.utils.ts), lines 327–359.

Duplicate detection compares raw IDs, but ID derivation trims them. Items `first` and ` first ` pass validation, receive the same generated ID, and flatten into one ListItem with `name: ["A", "B"]` and `position: [1, 2]`.

An empty item ID also passes the generator: `it.id || String(position)` substitutes `1`, so the supposedly stable ID depends on display position. The collection schema accepts an empty string as well.

**Required:** validate stable nonempty identifiers before positional fallback and check uniqueness using the same canonical representation used for emitted IDs. Reject ambiguity rather than silently merging entries.

### F3 — High: R3 extracts section summaries, not complete meaningful docs content

Sources: [docs.content.ts](../../apps/starter-kit/data/docs.content.ts), lines 1–44; [DocsClient.tsx](../../apps/starter-kit/app/docs/DocsClient.tsx), especially lines 471–717, 2085+, 2383+, 2749+, 3661–3975 and 4654–5046.

The shared docs module registers five section titles/descriptions. Registry descriptions/field contracts, component explanations and prop tables, form instructions/examples, connector examples, the docs introduction, and sitemap/robots documentation remain local to DocsClient. These are authored documentation, not transient input or decorative geometry.

Representative freshly built `/docs` content:

| Text | Present outside scripts/styles | In docs page graph | In global graph |
| --- | --- | --- | --- |
| `Primary display name of the website` | Yes | **No** | **No** |
| `Declares domain-level website metadata, site display title, description, canonical URL, and search action.` | Yes | **No** | **No** |
| `The Navbar component renders accessible navigation structures with full semantic support.` | Yes | **No** | **No** |
| `The route-level React Server Component that coordinates page-level Schema.org metadata and automatically injects the canonical @graph script tag for that specific URL.` | Yes | **No** | **No** |

No completed content-group inventory mapping shared sources, rendering locations, graph projections and verification assertions was found; the proposed batch table is not that inventory. Authored alternative tabs are still outside canonical records too.

**Required:** finish the inventory and migrate the meaningful bodies, API/prop descriptions, examples and qualifications using shared records. Keep example code as educational text, without promoting example entities to live facts.

### F4 — High: homepage CTA and diagram edits still have two sources of truth (R3)

Sources: [HomeClient.tsx](../../apps/starter-kit/app/HomeClient.tsx), lines 53–96; [home.content.ts](../../apps/starter-kit/data/home.content.ts); [flowData.ts](../../apps/starter-kit/components/hero-flow/flowData.ts), lines 285–292; [HeroFlowDiagram.tsx](../../apps/starter-kit/components/hero-flow/HeroFlowDiagram.tsx).

- Hero link records exist, but the actual CTA labels and destinations are hardcoded JSX. Editing the first shared link's label to `REVERIFY_CTA_SENTINEL` and destination to `/docs#helpers` changes exported text but leaves the UI unchanged.
- The diagram reads module-level `initialNodes`, synchronized once from an imported default collection. HomeClient does not pass its supplied `pipeline-stages` collection into the diagram. Editing the selected `engine-node` description to `REVERIFY_PIPELINE_BODY` changes the graph but not the rendered explanation.

These are failures using the actual app compositions, not mock components. The existing hero/pipeline tests mutate the surrounding **section** title/description, which does not exercise either broken path.

**Required:** bind CTA rendering and diagram semantic copy to the supplied canonical records; keep only geometry/styles/interaction state local.

### F5 — Medium: quickstart remains incomplete as a content contract (R2)

Sources: [quickstart.ts](../../apps/starter-kit/data/quickstart.ts), lines 3–17 and 345–386; [DocsClient.tsx](../../apps/starter-kit/app/docs/DocsClient.tsx), lines 283–453.

The eight titles, descriptions, main code snippets and valid `ol > li` structure are real improvements. Remaining failures:

1. **Optional qualification is lost:** `optional: true` on the API step is discarded by `buildQuickstartCollection`; a separate presentation map supplies the badge. That ListItem contains no optional qualification in its exported text.
2. **Installation commands are presentation-owned:** the create-next-app command and package-manager commands are still JSX/local strings, absent from both page and global graphs.
3. **General body content is not rendered:** QuickstartSection selects only the first code block and first callout. Adding a supported paragraph to a step's content changes the graph but does not appear in the UI; other blocks/additional code or callout blocks are likewise not handled by this composition.
4. **Order has competing sources:** reversing `quickstartStepDefinitions` and calling `buildQuickstartCollection` produces positions `[8,7,6,5,4,3,2,1]`, not positions derived from the new ordered sequence. The existing reorder test manually repairs every `order`, hiding this acceptance failure.

**Required:** retain qualifications and command strings in canonical content, render all supported step content in its authored order, and derive display numbering/exported positions from one sequence. A presentation map must not own competing instructional content.

## Supplemental app probes

Seven temporary acceptance probes were run under the existing starter-kit Vitest configuration, then removed from the workspace. They used fresh public exports and the same real providers/compositions as the app tests.

| Probe | Result |
| --- | --- |
| Change hero CTA label and href; assert graph and actual UI consume the edit | **Failed** at UI assertion |
| Change supplied selected pipeline-stage description; assert graph and actual diagram consume it | **Failed** at UI assertion |
| Add a paragraph body to a quickstart step; assert graph and actual UI consume it | **Failed** at UI assertion |
| Require the API step's own graph node to preserve its optional qualification | **Failed** |
| Reverse shared definitions without repairing order fields; require sequential positions | **Failed:** positions remain 8 through 1 |
| Change existing quickstart code; assert both visible text and graph text change | Passed |
| Remove two quickstart steps and add one; assert UI removal/addition and graph count | Passed |

These failures are **not included** in the 178-test passing baseline. The temporary probes and logs are retained under `/tmp` for this session, not installed as a permanent failing test suite.

Additional durable-test gaps remain: the policy “renders matching graph text” test never renders a policy page or mutates its content; the existing code-mutation test does not assert the changed graph code; reorder only checks UI containment rather than sequence; there are no app add/remove tests in the committed suite. The shared-Service identity test checks two references but does not include an actual Service/provider definition to prove complete reference integrity. Production HTML inspection and browser smoke in this report supplement, but do not replace, durable regressions.

## Production output and browser evidence

Freshly built HTML:

| Route | JSON-LD scripts | Top-level graph nodes | Missing local references |
| --- | ---: | ---: | ---: |
| `/` | 1 | 37 | 0 |
| `/docs` | 1 | 20 | 0 |
| `/privacy` | 1 | 6 | 0 |
| `/terms` | 1 | 6 | 0 |

Counts are diagnostics, not success metrics. `/docs` has exactly eight direct `ol > li` quickstart items in the expected current order. Full privacy/terms section graph text is present in the corresponding visible HTML. FAQ remains home-owned; ContactAction remains docs-owned. No standalone demo navbar/footer, demo FAQ/Breadcrumb, or sample Service entities appear in the docs scripts.

The local production API returns HTTP 200 with JSON-LD. Its graph has **60 unique IDs for 60 nodes** and zero missing local references for the actual connector data. The configured suite confirms actual GET-handler/programmatic equality. Page/global layout `isPartOf` differences are intentional (page vs website ownership), not content divergence. `/schema`'s displayed JSON was parsed in the browser and equals the local API response; its graph drawer opens successfully.

Browser checks used **Chrome 152.0.7977.84**, the freshly built app at `http://127.0.0.1:3217`, and desktop **1440×1000** / mobile **390×844** viewports. Verified:

- Home FAQ opens/closes; diagram channel selection updates the explanation.
- Home-to-docs navigation; a real mouse click on the visible docs Navbar sidebar link reaches `#navbar` with its expected scroll offset.
- Package-manager selector, real clipboard copy, registry selection and connector-data tab.
- Navbar mock brand edit updates the preview and escaped JSON example, not canonical scripts.
- Empty/invalid AutoForm submissions make no request and expose validation feedback; a valid synthetic submission renders success and the submitted payload.
- Page JSON-LD and canonical API output remain byte-for-byte unchanged after the mock edit and form interaction.
- Shared mobile navbar toggles; no page-level horizontal overflow on home/docs at either viewport; screenshots received a basic visual review.
- Inspector receives real content, displays API-equal JSON and opens the graph drawer.

**Safety:** the browser intercepted and fulfilled the only POST (`/api/contact`) with synthetic JSON. No contact handler or production submission was executed. External page requests were blocked. The final browser run recorded zero uncaught runtime exceptions.

**Limits:** no deployment, external-repository adoption, exhaustive keyboard/accessibility audit, full screenshot baseline comparison, or every possible tab/viewport was tested. Browser automation required explicit page visibility/focus and a visible-link mouse interaction; earlier offscreen/hidden-tab scroll and clipboard failures were harness issues, not reported as product defects. Inspector collection edges remain an optional follow-up.

## Closure requirements

1. Fix F1/F2 and add durable custom-ID, delimiter, blank/whitespace, nested/flattened and reference-integrity regressions.
2. Finish the R3 inventory and shared authored-content migration; bind the CTA and diagram to supplied data.
3. Finish quickstart qualification/body/command/order parity and strengthen mutation/add/remove/reorder coverage.
4. Document the observable ListItem-ID migration, required consumer reference/snapshot regeneration and release/version decision. The existing phase/decision documents still contain unreconciled completion/compatibility claims; the previous report is not a migration guide.
5. Rerun the gates against the corrected tree and record a new verdict. Do not infer completion from the currently passing 178 tests.
