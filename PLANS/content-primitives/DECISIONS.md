# Decisions and Open Questions

This document separates the agreed direction from proposed implementation details. Update it as each phase resolves its questions; nothing below is an implemented API contract yet.

## Agreed direction

| Decision | Basis |
| --- | --- |
| Favor a small set of primitives | User preference: compose primitives to update or create catalog components |
| Use `co-jp` as the first concrete pilot | The exploration identified real missing content across several layouts |
| Plan before implementation | Current work creates planning documents only |

## Recommended design defaults

These are recommendations from the exploration, subject to validation.

| Recommendation | Reason |
| --- | --- |
| Shared serializable data feeds both UI and exports | Component-local JSX is the main source of missing graph content |
| Section, Content, and Collection capabilities form the initial surface | Covers narrative, grids, lists, and flows without one primitive per layout |
| Domain entities remain independent of layout | One Service can appear in multiple sections and pages |
| Page membership is explicit | Global exports and page scripts need different content selection |
| Static paths remain server-friendly | Export completeness must not depend on browser mounts or client context |
| Qualifications are retained in standard graph text | Agent-only data must not be the only place containing important caveats |
| Generic primitives do not infer specialized claims | Cards are not automatically Products; ordered steps are not automatically HowTo |
| Service and Organization enrichment come before a larger catalog | They add concrete business meaning to existing pilot content |

## Open decisions by phase

### Phase 1 — Contracts and graph behavior

- [x] **Page membership:** Dual-resolution supported: Section records define `pageId` (e.g. `'home'`, `'privacy'`), and WebPage records can explicitly define `hasPart` / `sections`. Dynamically linked via `resolvePageParts`, eliminating hardcoded `#faq` references on pages like `/privacy`.
- [x] **Identity:** Standardized `#section:{pageId}:{sectionId}` or `#section:{sectionId}`, canonicalized to `{baseUrl}/#section:...` in Knowledge Graph.
- [x] **Scope API:** When `pageId` is specified, `createContextualApp.getGraph({ pageId })` isolates the graph to that page's sections, WebPage, and relevant non-global entities (`faq`, `forms` on `home`), while global layout entities (`Organization`, `WebSite`, `Navbar`, `Footer`) remain shared. When `includeAll: true` (e.g. `/graph.json`), all pages, all sections, and all entities are exported.
- [x] **Invalid data:** Safe normalization and text extraction; invalid blocks are filtered out with warnings rather than aborting site builds.
- [x] **Script ownership:** `<WebPage>` and `<ContextualSite>` own JSON-LD script emission using `serializeJsonLd()` with `\u003c` escaping against `</script>` breakouts. Child primitives render semantic DOM only.
- [x] **Implementation location:** Implemented in `@contextual-ui/core` (`packages/core/src/content/`), with full backward compatibility and 97 passing unit tests.

### Phase 2 — Public primitive surface

- [ ] **Names and count:** does Content need a standalone public family or only a model/renderer used by Section?
- [ ] **Data access:** explicit props, render callbacks, context-based compound components, or a combination that preserves a server-only path.
- [ ] **Body format:** smallest block/inline model that covers the pilot without becoming a full rich-text platform.
- [ ] **Collections:** inline descriptive items versus entity references, including deterministic registry ownership.
- [ ] **Presentation overrides:** how to allow layout customization without encouraging competing text sources.
- [ ] **Standalone behavior:** whether standalone primitives emit JSON-LD, and how that is explicitly controlled.

### Phase 3 — Entity semantics

- [ ] **Service fields:** initial optional field set and exact reference contract.
- [ ] **Representative:** supported truthful relationship, or retained prose until a Person/Role model is justified.
- [ ] **Document identity:** whether privacy needs a separate CreativeWork or page sections alone are sufficient.
- [ ] **Agent output:** serializer-only in the pilot or a separately specified public endpoint.

### Phases 4–5 — Pilot and promotion

- [ ] **Catalog scope:** which compositions add enough reusable value to ship.
- [ ] **Packaging:** temporary development dependency strategy and final artifact/version used by `co-jp`.
- [ ] **Breaking changes:** which scope/identity/default changes require opt-in behavior or a versioned migration.
- [ ] **Diagnostics:** which content drift checks are practical without pretending to inspect arbitrary UI automatically.

## Guardrails from the source content

- The moving-company section is illustrative, not evidence of a completed client project.
- Time savings are to be evaluated in a prototype, not guaranteed.
- Human checking and correction are explicit parts of the proposed workflows.
- The company representative is not automatically its founder.
- Contact navigation is not itself form submission.
- A privacy page should not claim ownership of the home FAQ.

## Decision log

```text
Decision: Content Model & Page-Scoped Knowledge Graph Foundations
Status: accepted
Phase: Phase 1
Reason: Resolve page isolation, eliminate dangling #faq references on non-home pages (like /privacy), and provide serializable content blocks for sections.
Compatibility impact: Fully backward-compatible; existing schemas and tests pass without modification.
Validation evidence: packages/core/src/content/content.test.ts (97 passing unit tests), multi-package monorepo build, and starter-kit build.
```

Return to the [plan overview](README.md).
