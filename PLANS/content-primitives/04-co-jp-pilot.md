# Phase 4 — co-jp Pilot Migration

**Status:** Proposed · **Dependencies:** [Phase 2](02-composable-primitives.md) and [Phase 3](03-semantic-entity-adapters.md) · **Next:** [Phase 5](05-catalog-composition-and-release.md)

## Goal

Prove the primitives against a real information-rich site while preserving its appearance, behavior, Japanese copy, and existing contextual-ui integration.

The project is at `/Users/luis/Projects/tasuku/co-jp`. Its source and installed package version must be rechecked when implementation begins. Existing uncommitted work must be preserved. Read its `AGENTS.md` and relevant installed Next.js guides before writing application code.

## Migration method

For each section:

1. Inventory its text, items, facts, links, and qualifications.
2. Move canonical content from component defaults/JSX to shared serializable records.
3. Register the records and bind them to the correct page.
4. Render existing styles and layout using the primitives and those records.
5. Compare UI text, page graph, and global graph against the same fixture.
6. Remove duplicate copy only after the section passes its checks.

Content can be split into focused modules and assembled by the connector. Do not simply move every component into one enormous server file. Keep icons, responsive layout, and decorative presentation outside the content model.

During incremental rollout, make one data source authoritative per section; do not silently prefer old defaults over registered data.

## Suggested migration batches

### A. First vertical slice: use cases and process

| Source | Composition | Content to retain |
| --- | --- | --- |
| [`UseCases.tsx`](../../../co-jp/app/components/UseCases.tsx) | Section + Content + Collection | Introduction, six entries, human-review and measurement caveat |
| [`Process.tsx`](../../../co-jp/app/components/Process.tsx) | Section + ordered Collection | Heading, subtitle, three ordered stages |

This slice begins during Phase 2. It validates reuse across two different layouts before the public API is frozen.

### B. Business entities

| Source | Composition | Content to retain |
| --- | --- | --- |
| [`Services.tsx`](../../../co-jp/app/components/Services.tsx) | Section + Collection referencing Services | Three descriptions, images, and provider relationship |
| [`About.tsx`](../../../co-jp/app/components/About.tsx) | Section + organization-backed definition list | Names, representative, address, founding date, activities, website |

### C. Narrative and consultation content

| Source | Composition | Content to retain |
| --- | --- | --- |
| [`Hero.tsx`](../../../co-jp/app/components/Hero.tsx) | Section + Content + ordinary CTA presentation | Positioning, audience/geography, introduction, CTA destination |
| [`MovingCompanyExample.tsx`](../../../co-jp/app/components/MovingCompanyExample.tsx) | Section + Content + descriptive Collection | Scenario context, current burden, system assistance, human verification, intended outcome, illustrative disclaimer |
| [`Contact.tsx`](../../../co-jp/app/components/Contact.tsx) | Section + Content + existing Form | Consultation introduction, checklist, existing action reference |

Do not treat mascot or background decoration as new business entities. A link that scrolls to `#contact` is navigation, not a second submission endpoint.

### D. Privacy content and cross-page verification

Migrate [`privacy/page.tsx`](../../../co-jp/app/privacy/page.tsx):

- [ ] Preserve policy introduction, all six numbered sections, lists, and contact block.
- [ ] Store the visible last-updated date canonically and expose it on an appropriate document/page model if supported.
- [ ] Reuse organization/contact facts rather than copying them into a second record.
- [ ] Keep privacy section membership separate from home content.
- [ ] Remove the incorrect privacy-to-FAQ relationship through the agreed membership model, not a one-off JSON patch.

## Integration surfaces

- [`data/site.schema.ts`](../../../co-jp/data/site.schema.ts): new primitive/entity registries.
- [`data/site.server.ts`](../../../co-jp/data/site.server.ts): shared data assembly and page membership.
- [`app/page.tsx`](../../../co-jp/app/page.tsx) and privacy route: render from the same content bindings used for graph selection.
- [`app/layout.tsx`](../../../co-jp/app/layout.tsx): retain navbar/footer behavior and avoid unnecessarily shipping all new content through client context.
- [`app/graph.json/route.ts`](../../../co-jp/app/graph.json/route.ts) and [`app/api/graph.json/route.ts`](../../../co-jp/app/api/graph.json/route.ts): equivalent global graph output.

Do not alter contact submission behavior as part of this content migration. Existing FAQ and form data should be reused, not reconstructed from the UI.

## Acceptance checks

- [ ] All six use cases, three services, and three process stages appear with their full meaningful text.
- [ ] The example is explicitly illustrative and retains human verification requirements.
- [ ] Organization facts are consistent between About, privacy, and the graph.
- [ ] Privacy includes its policy body but not home-only section membership.
- [ ] Stable IDs, anchors, navigation links, and form behavior remain intact.
- [ ] Desktop/mobile layout and accessible structure have been compared before and after.
- [ ] Existing FAQ, ContactAction, navbar, footer, metadata, sitemap, and robots behavior have no unintended regressions.
- [ ] The graph can be generated without rendering the app or running a browser.
- [ ] Registered data contains no presentation-only React values or submitted contact data.

## Feedback to the library

Record friction rather than immediately adding another primitive. For each awkward case, determine whether it needs a better data accessor, a richer content field, a semantic adapter, or only a catalog composition. Use this evidence to settle the open API decisions in Phase 5.
