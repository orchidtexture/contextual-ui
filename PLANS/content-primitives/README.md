# Content Primitives: From Page Content to Composable Catalog Components

**Status:** Proposed plan; no implementation started.

## Direction

Build a small set of headless, data-driven primitives that can be composed into existing or new catalog components. Do not create a new core component for every visual section found in a website.

`co-jp` is the first pilot. Its services, use cases, process, company facts, and explanatory text are largely outside the registered data that generates `graph.json`.

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
| 1 | [Data and graph foundations](01-data-and-graph-foundations.md) | Shared contracts, identity, page membership, and export rules |
| 2 | [Composable primitives](02-composable-primitives.md) | Minimal section, content, and collection capabilities |
| 3 | [Semantic entity adapters](03-semantic-entity-adapters.md) | Services and richer organization facts without catalog-specific coupling |
| 4 | [co-jp pilot](04-co-jp-pilot.md) | Real sections migrated without a visual redesign |
| 5 | [Catalog composition and release](05-catalog-composition-and-release.md) | Proven compositions, regression coverage, documentation, and release gate |

Read [Decisions and open questions](DECISIONS.md) alongside the phases. Names and API sketches in these documents are proposals, not existing APIs.

### Execution order

1. Agree on Phase 1 contracts before stabilizing public APIs.
2. Build a small Phase 2 vertical slice using `UseCases.tsx`; do not wait for a complete component catalog.
3. Add Phase 3 entity adapters and complete the Phase 4 migration.
4. Promote only the patterns proven by the pilot in Phase 5.

Tests accompany every phase; Phase 5 consolidates them rather than introducing testing at the end. Temporary custom registries can be tried in `co-jp` through the existing `defineSchema` extension point before their interfaces are promoted to the library.

## Definition of success

- [ ] The pilot's meaningful content is available in the graph, including human-review requirements and illustrative-example disclaimers.
- [ ] Editing shared content updates both rendered UI and machine-readable output.
- [ ] Home and privacy graphs contain the correct page content and relationships.
- [ ] Shared entities have stable IDs and are not duplicated per visual section.
- [ ] Several catalog patterns can be built from the same primitives without forking graph generators.
- [ ] Existing FAQ, form, navbar, and footer integrations continue working.

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
- [co-jp integration notes](../../../co-jp/contextual-ui-steps.md)

Sibling-project links assume `contextual-ui` and `co-jp` share a parent directory. The integration notes include historical examples; the pilot source is authoritative. This plan supplements the existing backlog rather than changing it.
