# Phase 2 — Composable Primitives

**Status:** Complete · **Dependency:** [Phase 1](01-data-and-graph-foundations.md) · **Next:** [Phase 3](03-semantic-entity-adapters.md)

## Goal

Provide the smallest reusable surface that covers ordinary page content, repeated items, and ordered flows. Implement reusable APIs in `packages/core` and validate them on the official website in `apps/starter-kit` before expanding the catalog.

**Prerequisite:** resolve the [Phase 1 starter-kit scoping gate](01-data-and-graph-foundations.md#starter-kit-validation-gate-before-phase-2). The current home-specific form inference does not match the docs route's actual AutoForm placement.

## Proposed capability set

Names below are working names. Three capabilities do not necessarily require three independent public component families or registries.

| Capability | Candidate API | Responsibility |
| --- | --- | --- |
| Section | `Section.Root`, `.Title`, `.Description` | Named page region, accessible heading relationship, content/entity references |
| Content | `Content` or `Section.Content` | Render a small serializable body model and derive exportable text |
| Collection | `Collection.Root`, `.Item`, item title/body access | Render repeated content or entity references, optionally ordered |

Prefer ordinary HTML inside these primitives over adding a contextual wrapper for every paragraph, icon, or layout container. Domain entities such as Service remain separate data models, not additional mandatory layout primitives.

## Section

### Data and behavior

- Stable identity and page membership according to Phase 1.
- Title, optional short description, body, and optional subject/entity references.
- Explicit or derived heading association for `aria-labelledby`.
- Consumer-controlled heading level and layout; a section does not always imply `h2`.
- DOM anchor support without conflating anchors with entity IDs.

### Graph mapping

Use `WebPageElement` as the default representation of a meaningful page section. Preserve its readable content and connect it to the correct WebPage. Use `about` or `mainEntity` only where the relationship is appropriate, not as universal catch-all properties.

A decorative container does not need to become a graph node. A section describing a service must not masquerade as the service entity itself.

## Content

### Small initial body model

Start with what the pilot requires:

- Paragraphs.
- Headings for longer documents.
- Ordered and unordered prose lists.
- Text and safe links, with limited inline emphasis if needed.

Keep this a small discriminated data model, not a full editor AST. Defer arbitrary HTML, MDX, embedded React, tables, video, and complex media until a concrete use case requires them.

The renderer and text serializer must share the same input. Preserve meaningful order, list items, links, and concluding qualifications. Keep multilingual/Japanese coverage in core fixtures without requiring an external project. Decorative responsive line breaks may remain presentation-only.

The official docs also contain inline code and code blocks. Preserve code as educational content, with one source for its display and any export; determine the minimal representation before claiming complete docs coverage. This does not require a full editor AST or SoftwareSourceCode entity adapter.

### Graph mapping

Export meaningful text on the owning section or appropriate CreativeWork. Do not create a node for each paragraph, heading, or bullet by default. Do not duplicate the complete body into every ancestor node.

Prose lists are body formatting. A structured collection is a set of identifiable items. Reuse internal text/list types where useful without requiring all prose bullets to become `ListItem` entities.

## Collection

### Data and behavior

- Stable item IDs independent of array indexes.
- Explicit ordering semantics, separate from grid/list/timeline appearance.
- Items containing title/body data or references to existing entities.
- Optional images or other presentation data only when used by the pilot; no SVG functions in the content record.
- Access to shared item data without authors duplicating text into a second prop or JSX literal.

### Graph mapping

- Use `ItemList` with `ListItem` entries for identifiable collections.
- Give ordered sequences explicit positions and appropriate `itemListOrder`.
- For plain descriptive items, use supported ListItem fields such as name and description; no fictional Schema.org `Feature` type is needed.
- For domain entities, use `ListItem.item` references to canonical entities rather than copies of their definitions.
- Do not automatically turn an item into a Product, Offer, Review, or HowToStep.

## Illustrative composition

This is an API sketch, not copy-paste-ready code. Data access and nesting rules must be settled during the prototype.

```tsx
<Section.Root data={headlessSection}>
  <Section.Title className="existing-heading-styles" />
  <Section.Description />
  <Collection.Root data={headlessFeatures}>
    {/* Custom item layout reads the same registered item records. */}
  </Collection.Root>
  <Section.Content /> {/* Includes the concluding "Why it matters" text. */}
</Section.Root>
```

The graph is generated from these registered records independently of this JSX. The components should not mutate a registry while rendering.

## Implementation tasks

- [x] Prototype Section and Content with the `#headless-radix` introduction and conclusion in [`HomeClient.tsx`](../../apps/starter-kit/app/HomeClient.tsx).
- [x] Add Collection for its four feature cards using shared site records and existing styling.
- [x] Reuse Collection for ordered steps in the `#quickstart` section of [`DocsClient.tsx`](../../apps/starter-kit/app/docs/DocsClient.tsx).
- [x] Keep documentation examples, generated snippets, and mutable playground data distinct from the site's canonical graph.
- [x] Use public workspace exports and inspect registered content through the existing `/schema` and `/api/graph.json` surfaces.
- [x] Keep the ordinary server-rendered path usable without a client context provider.
- [x] Decide whether compound components use explicit data, context, or a server-compatible alternative before stabilizing the API.
- [x] Preserve headless styling; support polymorphism/`asChild` only with tested valid DOM behavior.
- [x] Define how optional presentation overrides interact with canonical text and drift diagnostics.
- [x] Keep graph generation utilities usable without React.

## Exit criteria

- [x] The same primitives produce a homepage feature grid, docs setup steps, and a plain text section in the starter kit.
- [x] Tests cover text completeness, item order, missing/duplicate IDs, safe links, and script serialization.
- [x] Render tests cover heading association, valid list markup, and custom layouts.
- [x] Content is available in global and correct page graphs without browser execution.
- [x] No specialized `Hero`, `Feature`, or `Process` primitive is required to achieve this coverage.
