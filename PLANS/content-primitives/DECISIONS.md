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

- [x] **Page membership:** Authoritative manifest precedence established: explicit WebPage `hasPart` / `sections` authoritatively defines page members; when omitted, record ownership (`pageId`) determines membership and dynamically derives `hasPart` and `isPartOf` via `resolvePageParts`. Unassigned items fall back to `home` (or single page) for backward compatibility.
- [x] **Identity:** Section IDs use `#section:{pageId}:{sectionId}` or `#section:{sectionId}`, canonicalized to `{baseUrl}/#section:...` in Knowledge Graph. Forms use `#action:form-{formId}`, FAQ uses `#faq`.
- [x] **Scope API:** Generic page-membership filtering across all entities (`sections`, `forms`, `faq`, and custom non-global keys). When `pageId` is specified, `createContextualApp.getGraph({ pageId })` isolates the graph to that page's declared sections, forms, and entities plus shared global entities (`Organization`, `WebSite`, `Navbar`, `Footer`). When `includeAll: true`, all pages, all sections, and all entities are exported.
- [x] **Invalid data & Link safety:** Safe link protocol validation via `isSafeHref` (rejects `javascript:`, `data:`, `vbscript:`, `file:`; accepts `http:`, `https:`, `mailto:`, `tel:`, and relative paths). Corrupted or unsafe blocks are sanitized during normalization. Resilient hydration logs diagnostic warnings in development while preserving raw data to prevent runtime crashes.
- [x] **Reference validation:** `validateGraphReferences()` verifies graph reference integrity, checking all `@id` pointers and distinguishing intentionally external references (social links, external org URLs) from missing local records.
- [x] **Script ownership:** WebPage and ContextualSite use safe script serialization (`serializeJsonLd()` with `\u003c` escaping). The starter-kit layout disables ContextualSite emission so WebPage owns page output. Phase 2 primitives will not emit duplicate scripts.
- [x] **Implementation location:** Contracts, utilities, and validation in `packages/core/src/content/`. Verified with 112 passing unit tests in core and 14 static prerendered routes in `apps/starter-kit`.

### Phase 2 — Public primitive surface

- [x] **Names and count:** Three core capabilities provided without catalog bloat: `Section` (`Section.Root`, `.Title`, `.Subtitle`, `.Description`, `.Content`), `Content` (standalone functional renderer and `Section.Content`), and `Collection` (`Collection.Root`, `.Item`, `.Title`, `.Description`, `.Content`).
- [x] **Data access:** Supported via dual patterns: context-based compound components for declarative composition without prop drilling, explicit prop passing for server components and granular overrides, and render callbacks (`children={(items) => ...}`) on `Collection.Root` and `Collection.Item`.
- [x] **Body format:** Discriminated serializable union: `paragraph` (with roles: `normal`, `lead`, `note`, `qualifier`, `disclaimer`), `heading` (`level: 2-6`), `list` (`ordered` / `unordered`), `link` (validated against safe protocols), `callout` (`info`, `warning`, `note`, `caveat`), and `code` (`code`, `language`, `filename`).
- [x] **Collections:** Structured `CollectionRecord` and `CollectionItem` schema. Maps to Schema.org `ItemList` with `ListItem` entries. Preserves explicit item positions and `itemListOrder` for ordered collections (such as docs steps). Supports domain entity references via `item`.
- [x] **Presentation overrides:** Polymorphic `asChild` support with Radix Slot across all subcomponents, custom component overrides via `components?: ContentComponentOverrides` prop on `Content`, and standard CSS / Tailwind styling.
- [x] **Standalone behavior:** Script ownership rule enforced: primitives inside `ContextualSite` / `WebPage` do not emit duplicate JSON-LD scripts (`injectJsonLd ?? !isInsideSite`), while standalone usage outside site context automatically emits valid Schema.org script tags.

### Phase 3 — Entity semantics

- [x] **Service fields:** Typed `ServiceItem` and `ServiceData` schemas with `id`, `name`, `description`, `serviceType`, `areaServed`, `audience`, `url`, `image`, `provider` (linking to canonical Organization), and `pageId`. Commercial terms, pricing, and offers remain absent unless supplied by source content.
- [x] **Representative:** Person/founder roles explicitly deferred. Representative information is preserved in section body copy rather than asserting an unvetted founder relationship.
- [x] **Organization enrichment:** Structured `PostalAddress` (`streetAddress`, `addressLocality`, `addressRegion`, `postalCode`, `addressCountry`) and `foundingDate` added to `OrganizationDataSchema` and exported accurately in JSON-LD and agent data.
- [x] **Document identity:** Page sections with `WebPageElement` provide clean, accurate coverage for policy documents without inventing non-standard Schema.org types. Full CreativeWork adapter remains deferred.
- [x] **Agent output:** Serializer-only implemented in core (`exportServiceAgentData`, `exportOrgAgentData`). A separate public `/api/agent-data` endpoint is deferred to avoid unvetted surface expansion.

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
Decision: Official Website Content Migration Pilot
Status: accepted and implemented
Phase: Phase 4
Reason: Migrate homepage feature sections, docs quickstart, and static policy pages (privacy, terms) to shared serializable records using Section, Content, and Collection primitives without altering visual presentation.
Capabilities validated: Headless Section, Content, and Collection applied across home (#ssot, #knowledge-graph, #metadata-scoping, #headless-radix), docs (#quickstart ordered steps), and policy routes (/privacy, /terms).
Validation evidence: Complete Schema.org JSON-LD graph generation with zero missing local IDs, static prerendering across all 14 Next.js 16 App Router routes in apps/starter-kit, and live graph inspection at /schema and /api/graph.json.
```

```text
Decision: Semantic Entity Adapters (Service & Organization Enrichment)
Status: accepted and implemented
Phase: Phase 3
Reason: Add domain meaning for Service and enriched Organization facts without catalog bloat or inferring unsupported business claims.
Capabilities shipped: Service entity adapter (Schema.org Service, provider reference to Organization, ItemList item pointer support) and Organization enrichment (structured PostalAddress, foundingDate).
Validation evidence: 142 passing unit tests in packages/core (including service and organization enrichment test suite), clean workspace builds, and 0 missing local IDs in reference validation.
```

```text
Decision: Composable Primitives (Section, Content, Collection)
Status: accepted and implemented
Phase: Phase 2
Reason: Provide small, headless primitives that cover page regions, serializable body models, and ordered/unordered item collections without creating specialized catalog components.
Capabilities shipped: Section, Content, Collection with Radix Slot asChild polymorphism, accessible aria-labelledby heading association, and Schema.org WebPageElement + ItemList/ListItem generation.
Validation evidence: 134 passing unit tests in packages/core (including Content, Section, and Collection test suites) and Next.js 16 static prerendering across all 14 routes in apps/starter-kit.
```

```text
Decision: Generic Page-Scoped Knowledge Graph & Starter-Kit Scoping Hardening
Status: accepted and verified
Phase: Phase 1
Reason: Resolve page isolation, eliminate dangling references, support generic page membership for forms/faq/sections, validate safe link protocols, and ensure starter-kit official site compatibility.
Precedence rule: Explicit WebPage hasPart/sections takes precedence as authoritative manifest; omitted manifests dynamically derive hasPart from record pageId ownership.
Compatibility impact: Fully backward-compatible. Legacy unassigned entities default to home (multi-page) or the single page.
Validation evidence: 112 passing unit tests in packages/core (including self-contained home/docs/privacy/terms fixture with registered form on docs and FAQ on home, link safety tests, and reference integrity verification) and clean starter-kit static export of 14 routes.
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
