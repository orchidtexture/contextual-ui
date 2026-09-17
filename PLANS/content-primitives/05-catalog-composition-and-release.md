# Phase 5 — Catalog Composition and Release

**Status:** Proposed · **Dependency:** [Phase 4](04-co-jp-pilot.md)

## Goal

Turn the pilot's proven patterns into reusable catalog components without creating parallel data models or graph generators for each layout.

## Composition candidates

These are candidates to validate, not a commitment to ship every name.

| Catalog pattern | Built from | Semantic specialization |
| --- | --- | --- |
| Hero | Section + Content + link/button presentation | Usually none beyond its page-section role |
| FeatureList / UseCaseList | Section + Collection | Descriptive ItemList |
| ServiceList / ServiceCard | Section + Collection + Service records | Service/provider relationships |
| Process | Section + ordered Collection | Ordered ItemList by default |
| OrganizationProfile | Section + organization field rendering | Existing Organization entity |
| ConsultationSection | Section + Content + existing Form | Reuse the existing contact action |
| Document / Policy content | Section + Content | Optional document metadata |
| Scenario | Section + Content + Collection | Specialized model only if repeated use proves necessary |

A second layout using the same data should not need a second serializer. Catalog components should provide ergonomic defaults and composition slots, not become a separate source of truth.

## Promotion rules

Promote a new catalog component only when:

1. Its composition is useful beyond one hard-coded page.
2. It consumes the shared contracts without copying content into graph-only props.
3. Its accessibility and export behavior are covered by tests.
4. It adds meaningful convenience beyond a thin rename of a primitive.

Promote a new core primitive only when existing capabilities cannot express a recurring requirement cleanly. New Schema.org types alone are not sufficient justification for new layout primitives.

## Relationship to the existing backlog

The [schema-aware components backlog](../schema-components-backlog.md) remains useful as a catalog/domain roadmap:

- **Feature / ItemList:** becomes an early composition over Collection.
- **HowTo / Process:** split their meaning; Process does not imply instructional HowTo semantics.
- **Person:** defer broad UI/API work until a real author/team/role requirement is established.
- **Article / BlogPosting:** can later reuse Content with publication and authorship adapters.
- **CallToAction / EntryPoint:** distinguish navigation from actual actions; do not duplicate existing Form actions.
- **Product / Offer, Review, Video, Event, CodeSnippet:** remain outside this pilot and can reuse primitives where appropriate.
- **Service:** add as a domain-model/catalog candidate when the pilot confirms its API.

When the backlog is revised, correct its search-result assumptions: Google no longer shows HowTo rich results; review markup does not automatically qualify for stars, particularly for self-serving organization/local-business reviews. Schema correctness and knowledge coverage are separate from search-feature eligibility. Recheck current official search documentation before publishing SEO claims.

## Consolidated verification matrix

| Layer | Required checks |
| --- | --- |
| Data contracts | Validation errors, stable IDs, serialization, optional fields, duplicate records |
| Content | Full Japanese text, paragraph/list order, links, preserved qualifiers and disclaimers |
| Graph | Canonical references, entity deduplication, supported property/type mappings, page isolation, no unintended dangling references |
| Output paths | Equivalent graph selection between programmatic and route handlers; global endpoint parity |
| Rendering | Headings, labelled sections, list/definition-list semantics, server rendering, valid custom composition |
| Script/security | Safe JSON-LD script encoding, supported link protocols, no private submission data |
| Compatibility | Existing FAQ/Form/Navbar/Footer, legacy registry behavior, explicit migration notes |
| Pilot experience | Desktop/mobile presentation, navigation/anchors, contact behavior, authoring friction |

Use targeted assertions and representative fixtures, not only large graph snapshots. A snapshot with more nodes is not proof of better coverage.

## Documentation and packaging tasks

- [ ] Finalize names, prop/data access patterns, and ownership of JSON-LD emission.
- [ ] Document the difference between primitives, domain adapters, and catalog compositions.
- [ ] Add a minimal shared-data → custom UI → graph example.
- [ ] Add one complex example preserving an illustrative scenario and its caveats.
- [ ] Document page membership, shared entities, IDs versus anchors, and multi-page export behavior.
- [ ] Explain standalone rendering and app-integrated rendering, including script ownership.
- [ ] Document `exportAgentData` separately from JSON-LD and any optional public endpoint.
- [ ] Verify server/client exports and React-free serializer entry points.
- [ ] Choose a local package testing strategy, then verify the pilot against the actual release artifact rather than only monorepo source.
- [ ] Document compatibility impacts and version any intentional breaking changes.
- [ ] Update relevant backlog/docs only after the implemented behavior is verified.

## Release gate

- [ ] Phase exit criteria are complete and open blocking decisions are resolved.
- [ ] Multiple catalog patterns compose from the same small primitive set.
- [ ] A custom layout can retain semantic coverage without adopting a catalog component.
- [ ] Existing consumers have a documented migration path and no silent graph-scope changes.
- [ ] The `co-jp` acceptance checks pass with the intended package artifact.
- [ ] Deferred work is explicitly recorded instead of silently included in this release.

## Deferred extensions

Evaluate later: advanced rich-text/media blocks, full Person relationships, genuine HowTo content, typed case studies with evidence, richer agent-data discovery, CMS/editor integration, and content/render drift diagnostics across arbitrary custom UI.
