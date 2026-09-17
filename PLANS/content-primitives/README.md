# Content Primitives: From Page Content to Composable Catalog Components

**Status:** Phases 1–4 and Remediation have been implemented and verified: **All 7 criteria verified**. See the [remediation plan](REMEDIATION-PLAN.md) and [post-remediation verification report](POST-REMEDIATION-VERIFICATION.md). Phase 5 is ready to proceed.

**Next:** Proceed to Phase 5: [Catalog composition and release](05-catalog-composition-and-release.md).

## Direction

Build a small set of headless, data-driven primitives that can be composed into existing or new catalog components. Do not create a new core component for every visual section found in a website.

[`apps/starter-kit`](../../apps/starter-kit/README.md) is the first-party implementation and validation target, and is deployed as the Contextual UI official website. Its homepage, docs, policy content, and graph inspector will demonstrate the primitives using the actual workspace packages.

`co-jp` is a separate repository that inspired the requirements. It remains an external use case and a possible future adoption test, not a required checkout, implementation target, or release gate for this plan.

The intended flow is:

```text
Shared, serializable content and entity data
  ├─ Headless primitives → custom UI / catalog compositions
  ├─ Schema.org adapters → page JSON-LD / global graph.json
  └─ Agent-data serializers → optional richer integrations
```

Rendering a wrapper alone does not register its children with the graph. The data must drive both outputs.

## Principles

- **Composition first:** a hero, feature grid, or timeline is usually a composition, not a new semantic primitive.
- **Content before markup:** preserve meaningful text, qualifications, and relationships, not just section names.
- **One source of truth:** avoid parallel JSX copy and graph-only copy.
- **Accurate semantics:** visual cards are not automatically Products, Offers, or Reviews.
- **Explicit ownership:** distinguish page sections from the entities they describe.
- **Server-friendly:** static content should not require client-side registration or hydration to become exportable.
- **Incremental adoption:** retain existing design and existing contextual-ui components while migrating one section at a time.

## Phases

| Phase | Document | Outcome |
| --- | --- | --- |
| 1 | [Data and graph foundations](01-data-and-graph-foundations.md) | Implemented; cross-page collection-item identity needs follow-up |
| 2 | [Composable primitives](02-composable-primitives.md) | Section, Content, and Collection implemented; core render tests pass |
| 3 | [Semantic entity adapters](03-semantic-entity-adapters.md) | Service adapter and Organization enrichment implemented and unit-tested |
| 4 | [Official website / starter-kit pilot](04-starter-kit-pilot.md) | Partial content migration; docs edit parity and example isolation need follow-up |
| 5 | [Catalog composition and release](05-catalog-composition-and-release.md) | Proven compositions, regression coverage, documentation, and release gate |

Read [Decisions and open questions](DECISIONS.md) alongside the phases. The [verification report](VERIFICATION.md) records observed behavior and supersedes earlier blanket completion claims; passing tests/builds does not establish every planned guarantee.

### Execution order

1. Validate Phase 1 against starter-kit page ownership, especially the registered form rendered on `/docs` rather than home.
2. Build a small Phase 2 slice using the homepage's `#headless-radix` feature cards, then the docs quickstart steps.
3. Complete the Phase 4 website migration; add Phase 3 adapters only where real content or an isolated example needs them.
4. Promote patterns proven by the website and docs in Phase 5.

Tests accompany every phase. Reusable code belongs in `packages/core`; site content and compositions belong in `apps/starter-kit`, consuming `contextual-ui` through `workspace:*`. Verify package exports/builds, not direct imports from core source. External repository adoption is a later, separately scoped activity.

## Definition of success

- [x] The official site's meaningful homepage, docs, and policy content is available in the graph; example-only data is not asserted as live site facts.
  - Verified: hero, pipeline narrative, foundations, and docs sections registered. Docs showcases use `injectJsonLd={false}` and emit zero standalone scripts. Production `/docs` contains exactly 1 page script.
- [x] Editing shared content updates both rendered UI and machine-readable output.
  - Verified: quickstart guide and documentation sections consume shared records. In-memory mutation tests prove editing title, description, and code snippets updates both visible UI text and graph output.
- [x] Home, docs, privacy, and terms graphs contain the correct page content and relationships.
  - Verified: all 4 page graphs contain isolated, route-accurate content. Zero missing local references across all page graphs and the global graph.
- [x] `/schema` and `/api/graph.json` make the actual site's content inspectable without an external repository.
  - Verified: actual GET handler output, equality with programmatic graph, and real content in the inspector's production HTML.
- [x] Shared entities have stable IDs and are not duplicated per visual section.
  - Verified: collection items derive IDs from collection scope (`#listitem:home:features:first` vs `#listitem:docs:features:first`). Unique IDs verified across all entities. Duplicate item IDs rejected.
- [x] Several catalog patterns can be built from the same primitives without forking graph generators.
  - Verified: feature-card layouts, ordered quickstart flow (`ol > li`), and policy Content rendering reuse core implementations.
- [x] Existing FAQ, form, navbar, and footer integrations continue working.
  - Verified: FAQ accordions, AutoForm with dynamic Zod validation, shared Navbar, and Footer render correctly at SSR/unit/production build level.

**Verification evidence:** 155 core tests, 9 graph-builder tests, and 14 starter-kit app tests passed (178 total); workspace/starter-kit production builds and configured typechecks passed. See [POST-REMEDIATION-VERIFICATION.md](POST-REMEDIATION-VERIFICATION.md) for full evidence and audit details.

Node count and rich-result eligibility are not success metrics on their own.

## Not in this initial effort

- DOM scraping, React-tree discovery, or client-side mount registration as the graph source.
- A full CMS, rich-text editor, or general-purpose page builder.
- Implementing the entire schema-aware component backlog.
- Invented performance claims, customer success stories, commercial terms, or person relationships.
- Automatic execution of actions found in the graph.
- Guaranteed search rankings or rich results.

## Related material

- [Schema-aware components backlog](../schema-components-backlog.md)
- [Global graph export guide](../../docs/guides/global-graph-export.md)
- [WebSite / WebPage plan](../PLAN-WebSite-WebPage-Fix.md)
- [ContextualSite plan](../PLAN-ContextualSite.md)
- [Official website / starter-kit README](../../apps/starter-kit/README.md)
- [Website schema](../../apps/starter-kit/data/site.schema.ts)
- [Website connector](../../apps/starter-kit/data/site.server.ts)

All required sources and examples live in this repository. Historical `co-jp` observations are retained as research context only. This plan supplements the existing backlog rather than changing it.
