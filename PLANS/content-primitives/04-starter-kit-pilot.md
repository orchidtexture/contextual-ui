# Phase 4 — Official Website / Starter Kit Pilot

**Status:** Proposed · **Dependency:** [Phase 2](02-composable-primitives.md); [Phase 3](03-semantic-entity-adapters.md) only where relevant · **Next:** [Phase 5](05-catalog-composition-and-release.md)

## Goal and repository boundary

Use [`apps/starter-kit`](../../apps/starter-kit/README.md), the deployed Contextual UI official website, as the first-party implementation, demonstration, and integration-test target. Preserve its design, public routes, documentation, and interactive examples while making its real content exportable.

`co-jp` inspired the requirements but is a separate repository. Its source, checkout, environment, and deployment are not dependencies of this work. Future adoption there is a separate task, not a prerequisite for completing these phases.

## Responsibilities

| Location | Responsibility |
| --- | --- |
| `packages/core/src/content/` and core components | Reusable contracts, primitives, serializers, and unit tests |
| `apps/starter-kit/data/` | Official website content and explicit page bindings |
| `apps/starter-kit/components/` and routes | Site-specific layouts composed from the primitives |
| `/docs` | Public usage documentation and clearly identified demonstrations |
| `/schema` and `/api/graph.json` | Inspection and export of the actual site's registered content |

Consume the library through the existing `contextual-ui: workspace:*` dependency. Do not import core source directly or duplicate its implementation in the app. Account for package builds when testing export changes.

## Prerequisite: verify Phase 1 against this site

The current core implementation implicitly associates forms with `home`, while `DocsClient.tsx` renders the registered `contact-sales` AutoForm on `/docs`. Correct generic page membership before relying on it in the pilot.

- [ ] Bind registered content/actions to their declared pages, not a hardcoded home convention.
- [ ] Test home FAQ, docs AutoForm, and privacy/terms isolation together.
- [ ] Keep documentation examples and mutable playground state separate from live site entities.
- [ ] Preserve `<WebPage>` as the page script owner; the current layout disables `<ContextualSite>` script emission.

## Migration method

For each bounded section:

1. Inventory text, items, links, qualifications, and source anchors.
2. Move canonical content from JSX/local arrays to shared serializable records.
3. Register the records and declare their page relationships.
4. Preserve the existing layout using the primitives and the same records.
5. Compare rendered content, page graph, global graph, and inspector output.
6. Remove duplicate content only after the checks pass.

Content can be split into focused modules assembled by `data/site.server.ts`. Keep icons, diagram coordinates, animation, syntax highlighting, and transient UI state in the presentation layer. Read relevant installed Next.js documentation before implementing application changes.

## Suggested batches

### A. First Phase 2 slice: homepage feature cards

Source: [`app/HomeClient.tsx`](../../apps/starter-kit/app/HomeClient.tsx).

Start with the `#headless-radix` subsection: its title, introductory copy, four feature cards, and concluding “Why it matters” paragraph. It provides a bounded Section + Content + Collection example without requiring new domain adapters.

Then apply the same primitives to the `#ssot`, `#knowledge-graph`, and `#metadata-scoping` subsections. Preserve existing anchors and visual treatments. Scoping categories are not automatically ordered instructions simply because the cards are numbered.

### B. A second layout: docs quickstart

Source: [`app/docs/DocsClient.tsx`](../../apps/starter-kit/app/docs/DocsClient.tsx), `#quickstart`.

Use its ordered setup steps to validate Collection beyond a marketing grid. Start with step titles, explanatory text, and links; keep code examples in one shared source with the existing code renderer. Decide explicitly how code text is represented in the content contract before claiming full docs export coverage. Do not build a SoftwareSourceCode adapter merely to render a code block.

Expand to other documentation sections incrementally rather than rewriting the entire DocsClient file. Preserve copy controls, navigation, schema selectors, component demos, and form behavior. Add documentation for the new primitives only once their APIs are verified.

### C. Hero and architecture explanation

Sources:

- [`app/HomeClient.tsx`](../../apps/starter-kit/app/HomeClient.tsx): hero and `#data-pipeline` introduction.
- [`components/hero-flow/flowData.ts`](../../apps/starter-kit/components/hero-flow/flowData.ts): architecture node titles, descriptions, details, and sample snippets.

Reuse semantic text in the diagram and export rather than registering React Flow node/edge objects wholesale. The pipeline branches into multiple outputs; do not present it as a strictly linear HowTo. Separate diagram geometry and styling from content.

`TriangleSphere` is visual decoration, not a knowledge entity. Diagram code and JSON payloads describe examples; they must not become real companies, guarantees, published endpoints, or live actions in the official site's graph. Review sample API names/claims against the actual library when migrating them.

### D. Plain documents and multi-page coverage

Migrate the actual short policy content in:

- [`app/privacy/page.tsx`](../../apps/starter-kit/app/privacy/page.tsx).
- [`app/terms/page.tsx`](../../apps/starter-kit/app/terms/page.tsx).

These server-rendered routes validate static Content without a client provider requirement. Preserve their existing wording; do not import company details or legal text from `co-jp` or invent service offerings for the official website.

### E. Inspect the real graph

- [`app/api/graph.json/route.ts`](../../apps/starter-kit/app/api/graph.json/route.ts): existing global endpoint; do not assume a root `/graph.json` route exists.
- [`app/schema/page.tsx`](../../apps/starter-kit/app/schema/page.tsx): obtains the live graph; keep its displayed schema example aligned with the actual schema.
- [`components/schema-graph/parseGraph.ts`](../../apps/starter-kit/components/schema-graph/parseGraph.ts): verify new nodes and relationships remain inspectable. The current parser only draws selected relationship kinds; the JSON output remains authoritative.

Retain `SITE_URL` / `NEXT_PUBLIC_SITE_URL` configuration. Do not hardcode the external inspiration site's domain or change public URLs as part of this pilot.

## Production and example boundaries

- Registered official content is public site data.
- Demonstration schemas, sample companies, sample graphs, and code snippets are educational content, not assertions about the official site.
- Live form definitions may describe actual actions; submitted values and API responses must not enter public graphs.
- Local edits in docs demos, CMS, or Studio must not silently rewrite the canonical site graph.
- Keep interactive diagrams and forms in client components where necessary; do not make the primitive API client-only because HomeClient currently is.
- Use local/preview verification before any deployment. This plan does not authorize production form submissions or deployments.

## Acceptance checks

- [ ] The first feature subsection's four items and conclusion appear from shared data in UI and graph.
- [ ] The docs quickstart reuses Collection with correct order and its own page anchors.
- [ ] Home, docs, privacy, and terms contain only their declared content and relevant shared entities.
- [ ] The docs form is not incorrectly attributed to home; sample FAQ/demo data is not conflated with the home FAQ.
- [ ] `/schema` can inspect the new content from the same source as `/api/graph.json`.
- [ ] Navigation, metadata, sitemap, robots, existing components, and responsive layouts have no unintended regressions.
- [ ] Graph generation does not depend on mounting interactive components.
- [ ] Core tests and the starter-kit package build succeed using public workspace exports.
- [ ] Validation works from this repository alone, without a `co-jp` checkout.

Record friction as evidence for the primitive API, a semantic adapter, or an app-level composition. Promote catalog components only after these uses demonstrate real reuse.
