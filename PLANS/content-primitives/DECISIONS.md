# Decisions and Open Questions

This document separates agreed direction, the initial Phase 1 implementation, and open validation/API decisions. Passing the initial tests does not establish all planned guarantees. Update it as the official website validates the contracts.

## Agreed direction

| Decision | Basis |
| --- | --- |
| Favor a small set of primitives | User preference: compose primitives to update or create catalog components |
| Use `apps/starter-kit` as the first-party pilot | It is in this monorepo and is deployed as the Contextual UI official website |
| Keep `co-jp` as external research context | It inspired the requirements but is a separate repository, not an implementation dependency |
| Keep reusable APIs in core and site compositions in the app | The starter kit consumes the library's public `workspace:*` exports |
| Validate Phase 1 before Phase 2 | The official docs form exposes a home-specific ownership assumption in the initial implementation |

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
| Add domain adapters only when a real use or isolated example needs them | Service/Organization enrichment must not force unrelated business content onto the official website |

## Open decisions by phase

### Phase 1 — Contracts and graph behavior

- [ ] **Page membership (reopened):** The initial implementation uses section `pageId` and page-parts resolution. Settle one authoritative contract/precedence and verify the public schema supports it; do not require competing declarations.
- [x] **Identity (initial):** Section IDs use `#section:{pageId}:{sectionId}` or `#section:{sectionId}`, canonicalized with the configured base URL. Broader reference guarantees still need coverage.
- [ ] **Scope API (reopened):** Replace implicit `home` ownership of non-global forms/FAQ with explicit membership. The starter kit renders its registered form on docs, not home. Preserve documented include/exclude behavior and validate dependencies.
- [ ] **Invalid data (reopened):** The existing hydration path can retain invalid values after warnings; normalization is not proof of strict validation or diagnostic omission. Verify and document the actual policy.
- [x] **Script ownership:** WebPage and ContextualSite use safe script serialization. The starter-kit layout disables ContextualSite emission so WebPage owns page output. Phase 2 primitives should not emit duplicate scripts by default.
- [x] **Implementation location:** Initial contracts/utilities are in `packages/core/src/content/`. Integration examples and validation belong in `apps/starter-kit`; initial passing tests/builds are evidence, not a blanket backward-compatibility guarantee.

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
- [x] **Development target:** use the starter kit's existing `workspace:*` dependencies and public exports; no external checkout or source-import shortcut.
- [ ] **Packaging:** verify the release artifact in a disposable consumer in addition to workspace integration. External `co-jp` adoption is a separate task.
- [ ] **Breaking changes:** which scope/identity/default changes require opt-in behavior or a versioned migration.
- [ ] **Diagnostics:** which content drift checks are practical without pretending to inspect arbitrary UI automatically.

## Content and repository guardrails

- The official website is a production-facing app, not a disposable test fixture. Preserve its design, routes, and interactive behavior; deployments require separate approval.
- Docs/diagram sample companies, graphs, endpoints, and performance claims are examples, not live official-site assertions.
- Submitted form values and mutable playground state must not enter the public graph.
- Page ownership follows declared content, not a convention that all forms or FAQ belong to home.
- External research still informs core fixtures: illustrative scenarios are not completed projects, intended savings are not guarantees, human-review caveats must survive export, and a representative is not automatically a founder.
- Do not copy external company/legal content into the official site to exercise a domain adapter.

## Decision log

```text
Decision: Initial Content Model & Page-Scoped Graph Foundations
Status: implemented initially; generic membership and validation guarantees reopened
Phase: Phase 1
Reason: Provide serializable content and page selection; starter-kit inspection subsequently exposed home-specific form ownership.
Compatibility impact: Must be reviewed before changing defaults; passing existing tests alone does not guarantee backward compatibility.
Validation evidence: Initial core suite reported 97 passing tests and workspace/starter-kit builds. A docs-owned form fixture is still required.
```

```text
Decision: Official Website as First-Party Implementation Target
Status: accepted
Phase: All phases
Reason: apps/starter-kit is the deployed official website within this monorepo; co-jp is a separate repository used for inspiration.
Compatibility impact: Retargets planned integration work only. External repositories and runtime code are unchanged by this plan revision.
Validation evidence: Starter-kit workspace dependencies, HomeClient feature sections, docs quickstart/AutoForm, policy pages, and existing /schema + /api/graph.json surfaces.
```

Return to the [plan overview](README.md).
