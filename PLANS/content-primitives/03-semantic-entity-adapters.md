# Phase 3 — Semantic Entity Adapters

**Status:** Proposed · **Dependency:** [Phase 1](01-data-and-graph-foundations.md), coordinated with [Phase 2](02-composable-primitives.md) · **Next:** [Phase 4](04-co-jp-pilot.md)

## Goal

Add domain meaning without turning every semantic type into a new layout primitive. A Service registry and an Organization model should work with the same Section, Content, and Collection capabilities.

## 1. Service

`co-jp/app/components/Services.tsx` describes three services:

1. Business-process review and improvement proposals.
2. AI-tool adoption and system development.
3. Tool integration and post-launch improvement.

### Proposed model

- Stable ID, name, description, and optional image/source URL.
- Optional service type, area served, and audience where supported by the source content.
- Provider reference to the existing Organization.

### Tasks

- [ ] Add a typed Service schema, registry adapter, JSON-LD generator, and agent-data serializer.
- [ ] Connect the services section to an ItemList whose entries reference canonical Service nodes.
- [ ] Reuse organization identity instead of embedding a new company definition per service.
- [ ] Keep offers, pricing, availability, and commercial terms optional and outside the initial pilot unless actual content supplies them.
- [ ] Validate Schema.org property domains/ranges and URL handling in fixtures.

A future `ServiceList` or `ServiceCard` catalog component is a composition of these models and primitives, not a prerequisite for exporting services.

## 2. Organization enrichment

The current Organization schema supports basic identity, description, social links, email, and telephone. The About section has additional facts that the schema does not yet represent.

### Tasks

- [ ] Add structured PostalAddress support and founding date.
- [ ] Populate existing supported fields from shared public data where appropriate, including legal name and contact email.
- [ ] Represent public company names faithfully; do not assume a displayed English name is a separate legal entity or official legal name.
- [ ] Reuse the same organization record in About and the privacy contact block.
- [ ] Determine a truthful representation of the listed company representative before introducing a person relationship.
- [ ] Keep the existing Organization ID stable and test deduplication across page graphs.

Do not infer `founder` from the label “representative.” If no agreed structured role is available yet, preserve the visible representative information in the section body rather than emitting an incorrect relationship. A general Person registry can be deferred until needed.

An organization-profile catalog composition may render a definition list (`dl`, `dt`, `dd`) using selected fields. It should not create a second Organization entity or require a standalone “Fact” entity for every row.

## 3. Interpret pilot content conservatively

| Content | Initial representation | Avoid |
| --- | --- | --- |
| Six use cases | Section + descriptive ItemList | Claiming each is a separately sold service |
| Engagement process | Section + ordered ItemList | Automatically treating any timeline as HowTo |
| Moving-company example | Section/content composition; optional CreativeWork if it adds meaning | Claiming a completed client case study or measured success |
| Privacy policy | Page sections with full readable content; optional document-level CreativeWork | Inventing a Schema.org PrivacyPolicy type |
| Contact introduction | Section referencing the existing contact action where appropriate | Creating a second executable action for an anchor link |

For the moving-company example, preserve the problem, proposed assistance, human responsibilities, intended outcome, and explicit illustrative disclaimer. Intended outcomes are not verified results.

## 4. JSON-LD versus richer agent data

The same records may support two serializers:

- **JSON-LD:** standard types, supported properties, accurate relationships, and complete meaningful text.
- **Agent data:** optional domain distinctions such as `kind: illustrative`, `humanResponsibilities`, or `limitations`.

These example keys are application data, not proposed Schema.org properties. The graph must retain the qualifications in supported text fields even if a separate agent-data endpoint is never built.

- [ ] Decide whether the pilot needs a public agent-data endpoint or only serializer tests.
- [ ] If an endpoint is added later, document its discovery, scope, validation, and public-data boundary separately from `graph.json`.

## Exit criteria

- [ ] Three Service entities link to one canonical Organization.
- [ ] Company address and founding date are available from shared data and exported accurately.
- [ ] No unsupported commercial or person relationship is inferred.
- [ ] Scenario qualifications survive serialization without requiring a new Scenario primitive.
- [ ] Domain-model tests run independently of catalog rendering.
