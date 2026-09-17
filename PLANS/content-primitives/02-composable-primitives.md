# Phase 2 — Composable Primitives

**Status:** Proposed · **Dependency:** [Phase 1](01-data-and-graph-foundations.md) · **Next:** [Phase 3](03-semantic-entity-adapters.md)

## Goal

Provide the smallest reusable surface that covers ordinary page content, repeated items, and ordered flows. Validate it on `co-jp` before expanding the catalog.

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

The renderer and text serializer must share the same input. Preserve Japanese text, meaningful order, list items, links where useful, and final qualification paragraphs. Decorative responsive line breaks may remain presentation-only.

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
<Section.Root data={useCasesSection}>
  <Section.Title className="existing-heading-styles" />
  <Section.Description />
  <Collection.Root data={useCasesCollection}>
    {/* Custom item layout reads the same registered item records. */}
  </Collection.Root>
  <Section.Content /> {/* Includes the human-review qualification. */}
</Section.Root>
```

The graph is generated from these registered records independently of this JSX. The components should not mutate a registry while rendering.

## Implementation tasks

- [ ] Prototype Section and Content with the introduction and note from `UseCases.tsx`.
- [ ] Add Collection for its six items using the same canonical records.
- [ ] Render `Process.tsx` as an ordered collection to test a second layout.
- [ ] Keep the ordinary server-rendered path usable without a client context provider.
- [ ] Decide whether compound components use explicit data, context, or a server-compatible alternative before stabilizing the API.
- [ ] Preserve headless styling; support polymorphism/`asChild` only with tested valid DOM behavior.
- [ ] Define how optional presentation overrides interact with canonical text and drift diagnostics.
- [ ] Keep graph generation utilities usable without React.

## Exit criteria

- [ ] The same primitives produce a use-case list, a process flow, and a plain text section.
- [ ] Tests cover text completeness, item order, missing/duplicate IDs, safe links, and script serialization.
- [ ] Render tests cover heading association, valid list markup, and custom layouts.
- [ ] Content is available in global and correct page graphs without browser execution.
- [ ] No specialized `Hero`, `Feature`, or `Process` primitive is required to achieve this coverage.
