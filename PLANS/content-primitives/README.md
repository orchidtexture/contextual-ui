# Content Primitives: From Page Content to Composable Catalog Components

**Status:** Remediation is partially complete: **3 criteria verified; 4 partially satisfied** in the [independent reverification](REVERIFICATION.md). The earlier [post-remediation report](POST-REMEDIATION-VERIFICATION.md) is retained as historical evidence; its all-seven completion verdict is superseded.

**Next:** Execute the proposed [remaining-issues remediation plan (V2)](REMEDIATION-PLAN-V2.md), which maps every reverification finding to fixes, durable regressions and final evidence. The [original remediation plan](REMEDIATION-PLAN.md) remains the acceptance baseline. Do not proceed through the [Phase 5](05-catalog-composition-and-release.md) gate until the remaining criteria pass.

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
| 1 | [Data and graph foundations](01-data-and-graph-foundations.md) | Ordinary cross-page item identity fixed; custom IDs, delimiters and item validation still need follow-up |
| 2 | [Composable primitives](02-composable-primitives.md) | Section, Content, and Collection implemented; core render tests pass |
| 3 | [Semantic entity adapters](03-semantic-entity-adapters.md) | Service adapter and Organization enrichment implemented and unit-tested |
| 4 | [Official website / starter-kit pilot](04-starter-kit-pilot.md) | Example scripts isolated; content coverage, CTA/diagram parity and quickstart qualifications/body/order remain partial |
| 5 | [Catalog composition and release](05-catalog-composition-and-release.md) | Proven compositions, regression coverage, documentation, and release gate |

Read [Decisions and open questions](DECISIONS.md) alongside the phases. The latest [reverification report](REVERIFICATION.md) supersedes blanket completion claims in the phase/decision documents and earlier reports; passing tests/builds does not establish every planned guarantee.

### Execution order

1. Validate Phase 1 against starter-kit page ownership, especially the registered form rendered on `/docs` rather than home.
2. Build a small Phase 2 slice using the homepage's `#headless-radix` feature cards, then the docs quickstart steps.
3. Complete the Phase 4 website migration; add Phase 3 adapters only where real content or an isolated example needs them.
4. Promote patterns proven by the website and docs in Phase 5.

Tests accompany every phase. Reusable code belongs in `packages/core`; site content and compositions belong in `apps/starter-kit`, consuming `contextual-ui` through `workspace:*`. Verify package exports/builds, not direct imports from core source. External repository adoption is a later, separately scoped activity.

## Definition of success

- [ ] The official site's meaningful homepage, docs, and policy content is available in the graph; example-only data is not asserted as live site facts.
  - Partial: example-only scripts are isolated, but substantial docs bodies/API references and quickstart qualifications/commands remain unexported.
- [ ] Editing shared content updates both rendered UI and machine-readable output.
  - Partial: main quickstart titles/descriptions/code and section summaries work; CTA, supplied diagram-stage and quickstart paragraph mutations change the graph without changing the UI.
- [ ] Home, docs, privacy, and terms graphs contain the correct page content and relationships.
  - Partial: current registered memberships and all four page reference audits pass; complete content/qualification parity does not.
- [x] `/schema` and `/api/graph.json` make the actual site's content inspectable without an external repository.
  - Verified: actual GET handler output, equality with programmatic graph, and real content in the inspector's production HTML.
- [ ] Shared entities have stable IDs and are not duplicated per visual section.
  - Partial: ordinary home/docs placements are distinct, but custom/absolute IDs and delimiters still collide or break references. Whitespace-equivalent item IDs can merge; empty IDs fall back to position.
- [x] Several catalog patterns can be built from the same primitives without forking graph generators.
  - Verified: feature-card layouts, ordered quickstart flow (`ol > li`), and policy Content rendering reuse core implementations.
- [x] Existing FAQ, form, navbar, and footer integrations continue working.
  - Verified within unit/SSR/build and selected browser smoke scope: FAQ, shared/mobile navigation, docs controls, and intercepted AutoForm validation/submission work. No production form submission was made.

**Latest verification evidence:** 178 existing tests and builds passed; all four configured lint/typecheck scripts and a separate starter-kit `tsc --noEmit` passed. Additional acceptance probes found 5 failures and 2 passes. Local production/browser verification passed 21 smoke checks. See [REVERIFICATION.md](REVERIFICATION.md) for the reviewed uncommitted tree, reproduced failures, evidence and limitations.

Node count and rich-result eligibility are not success metrics on their own.

## Not in this initial effort

- DOM scraping, React-tree discovery, or client-side mount registration as the graph source.
- A full CMS, rich-text editor, or general-purpose page builder.
- Implementing the entire schema-aware component backlog.
- Invented performance claims, customer success stories, commercial terms, or person relationships.
- Automatic execution of actions found in the graph.
- Guaranteed search rankings or rich results.

## Related material

- [Remaining-issues remediation plan (V2)](REMEDIATION-PLAN-V2.md)
- [Schema-aware components backlog](../schema-components-backlog.md)
- [Global graph export guide](../../docs/guides/global-graph-export.md)
- [WebSite / WebPage plan](../PLAN-WebSite-WebPage-Fix.md)
- [ContextualSite plan](../PLAN-ContextualSite.md)
- [Official website / starter-kit README](../../apps/starter-kit/README.md)
- [Website schema](../../apps/starter-kit/data/site.schema.ts)
- [Website connector](../../apps/starter-kit/data/site.server.ts)

All required sources and examples live in this repository. Historical `co-jp` observations are retained as research context only. This plan supplements the existing backlog rather than changing it.
