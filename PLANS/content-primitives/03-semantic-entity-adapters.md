# Phase 3 — Semantic Entity Adapters

**Status:** Complete · **Dependency:** [Phase 1](01-data-and-graph-foundations.md), coordinated with [Phase 2](02-composable-primitives.md) · **Integration:** [Phase 4](04-starter-kit-pilot.md)

## Goal and scope

Add domain meaning without turning every semantic type into a layout primitive. Domain adapters belong in `packages/core`; the official website in `apps/starter-kit` consumes them only where its actual content warrants them.

This phase is not a blanket prerequisite for the initial homepage/docs migration. Generic Section, Content, and Collection capabilities cover those first slices. Do not create business services, company-profile pages, or unsupported company facts on the official website merely to exercise an adapter.

`co-jp`'s services and company information remain motivating research examples. If an adapter is useful but has no live official-site use, validate it with self-contained core fixtures and a clearly identified docs example, or defer it. No external repository is needed.

## 1. Service — candidate adapter

The original research identified business-process review, AI-tool/system development, and post-launch integration support. These are services, unlike the official website's feature cards about the library.

### Proposed model

- Stable ID, name, description, and optional image/source URL.
- Optional service type, area served, and audience where supported by source content.
- Provider reference to a canonical Organization.

### Tasks, when justified

- [x] Add a typed Service schema, registry adapter, JSON-LD generator, and agent-data serializer.
- [x] Test an ItemList referencing Service nodes that share one provider.
- [x] Keep offers, pricing, availability, and commercial terms absent unless supplied by actual content.
- [x] Validate Schema.org property domains/ranges and URL handling in fixtures.
- [x] If demonstrated in docs, label sample services as examples and keep their entity graph isolated from the official site's global graph.

A future `ServiceList` or `ServiceCard` is a composition, not a prerequisite for the first-party content pilot. Do not relabel library features as services or products for richer markup.

## 2. Organization enrichment — candidate extensions

The official site already registers Tasuku Studio as creator and maintainer in [`data/site.server.ts`](../../apps/starter-kit/data/site.server.ts). Preserve that identity and its existing supported fields. It does not currently provide the company-profile content observed in `co-jp`.

### Tasks, when justified

- [x] Evaluate PostalAddress and founding-date support against a real use or isolated fixture.
- [x] Reuse the existing organization record across official-site pages without duplicating it per section.
- [x] Preserve names faithfully; a displayed English name is not automatically a separate legal entity or legal name.
- [x] Validate person roles explicitly; “representative” does not automatically imply `founder`.
- [x] Do not copy external company/contact facts into the official website without a separately approved content change.

A future organization-profile composition may render a definition list from selected fields. It should not create another Organization node or a new “Fact” entity for every row. A general Person registry can remain deferred.

## 3. Interpret website and example content conservatively

| Content | Initial representation | Avoid |
| --- | --- | --- |
| Homepage feature cards | Section + descriptive ItemList | Product, Offer, or Service assertions inferred from card layout |
| Docs quickstart | Section + ordered Collection | Automatic HowTo typing solely because steps are numbered |
| Architecture diagram | Shared explanatory content with a custom visual renderer | Treating branching outputs as a linear procedure or exporting diagram geometry |
| Privacy/terms text | Page sections with readable content | Invented specialized policy types or imported legal copy |
| Live docs AutoForm | Existing registered action bound to its actual page | Implicit home ownership or exporting submitted values |
| Sample code/graphs | Educational content and isolated example output | Treating sample companies, endpoints, or performance values as live facts |

Retain multilingual and illustrative-scenario fixtures inspired by the original research. Preserve human-review requirements and distinguish intended outcomes from verified results, but do not publish an external client's scenario as official-site business evidence.

## 4. JSON-LD versus richer agent data

The same records may support two serializers:

- **JSON-LD:** standard types, supported properties, accurate relationships, and meaningful text.
- **Agent data:** optional application distinctions such as `kind: illustrative` or `limitations`.

These example keys are application data, not proposed Schema.org properties. Qualifications must survive in supported graph text even if no separate agent-data endpoint is built.

- [x] Decide whether the official site needs an agent-data endpoint beyond its existing `/api/graph.json`; serializer tests alone may be sufficient initially.
- [x] If added, specify discovery, public-data boundaries, and example-state isolation separately.

## Exit criteria for adapters selected for implementation

- [x] Core fixtures prove stable identities, shared-provider deduplication, and accurate fields without an external checkout.
- [x] No unsupported commercial terms, person roles, or official-site facts are inferred.
- [x] Example graphs remain distinguishable from the live site graph.
- [x] Domain-model tests run independently of catalog rendering.
- [x] Deferred adapters are explicitly recorded and do not block the generic starter-kit migration.
