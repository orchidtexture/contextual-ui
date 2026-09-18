# Content Primitives — Failing-Case Matrix (V2-0)

**Date:** 2026-09-17
**Status:** Durable failure cases established; all 5 findings (F1–F5) reproduced in repository tests with exact assertion errors.
**Governing plan:** [REMEDIATION-PLAN-V2.md](REMEDIATION-PLAN-V2.md) (Work Package V2-0)

---

## 1. Durable Failure Cases Matrix

| Finding | Target WP | Test Path | Test Name | Command | Expected Assertion Error | Current Status |
|---|---|---|---|---|---|---|
| **F1** (Identity origin loss) | V2-1 | `packages/core/src/content/content-identity-failures.test.ts` | `Fixture 1 (Direct & App): distinct absolute parent URIs with different origins do not collide` | `pnpm --filter contextual-ui exec vitest run src/content/content-identity-failures.test.ts` | `expected '#itemlist:features' not to be '#itemlist:features'` | ❌ RED (Reproduced) |
| **F1** (Identity custom parent) | V2-1 | `packages/core/src/content/content-identity-failures.test.ts` | `Fixture 2 (Direct & App): custom fragment collection ID resolves without missing local references` | `pnpm --filter contextual-ui exec vitest run src/content/content-identity-failures.test.ts` | `expected '#itemlist:docs:custom-list' to be '#custom-list'` | ❌ RED (Reproduced) |
| **F1** (Identity delimiter collision) | V2-1 | `packages/core/src/content/content-identity-failures.test.ts` | `Fixture 3 (Direct & App): delimiter collision at tuple boundary generates distinct IDs` | `pnpm --filter contextual-ui exec vitest run src/content/content-identity-failures.test.ts` | `expected '#listitem:home:features:extra:first' not to be '#listitem:home:features:extra:first'` | ❌ RED (Reproduced) |
| **F2** (Whitespace duplicate item ID) | V2-1 | `packages/core/src/content/content-identity-failures.test.ts` | `Fixture 4 (Direct & App): whitespace-equivalent item IDs are rejected with validation error` | `pnpm --filter contextual-ui exec vitest run src/content/content-identity-failures.test.ts` | `expected [Function] to throw an error` | ❌ RED (Reproduced) |
| **F2** (Empty string item ID fallback) | V2-1 | `packages/core/src/content/content-identity-failures.test.ts` | `Fixture 5 (Direct & App): empty string item ID is rejected instead of falling back to position` | `pnpm --filter contextual-ui exec vitest run src/content/content-identity-failures.test.ts` | `expected [Function] to throw an error` | ❌ RED (Reproduced) |
| **F3** (Docs content coverage) | V2-2 / V2-5 | `apps/starter-kit/tests/production/production-output.test.ts` | `Probe F3 (Failing): meaningful docs field contracts and component descriptions are in docs graph` | `pnpm --filter starter-kit run test:production` | `expected 'Tasuku Studio...' to contain 'Primary display name of the website'` | ❌ RED (Reproduced) |
| **F4** (Hero CTA edit parity) | V2-3 | `apps/starter-kit/tests/durable-failures.test.tsx` | `Probe 1 (Failing): mutating hero CTA label and href updates visible UI and graph together` | `pnpm --filter starter-kit exec vitest run tests/durable-failures.test.tsx` | `expected '...Explore Pipeline Diagram...' to contain 'REVERIFY_CTA_SENTINEL'` | ❌ RED (Reproduced) |
| **F4** (Diagram stage edit parity) | V2-3 | `apps/starter-kit/tests/durable-failures.test.tsx` | `Probe 2 (Failing): mutating supplied pipeline-stage description updates diagram UI and graph together` | `pnpm --filter starter-kit exec vitest run tests/durable-failures.test.tsx` | `expected '...Contextual Engine...' to contain 'REVERIFY_PIPELINE_BODY'` | ❌ RED (Reproduced) |
| **F5** (Quickstart paragraph body) | V2-4 | `apps/starter-kit/tests/durable-failures.test.tsx` | `Probe 3 (Failing): adding a paragraph body to a quickstart step renders in UI and graph` | `pnpm --filter starter-kit exec vitest run tests/durable-failures.test.tsx` | `expected 'Docs...' to contain 'REVERIFY_PARAGRAPH_BODY: Detailed schema...'` | ❌ RED (Reproduced) |
| **F5** (Quickstart optional qualification) | V2-4 | `apps/starter-kit/tests/durable-failures.test.tsx` | `Probe 4 (Failing): quickstart API step preserves optional qualification in its own graph node` | `pnpm --filter starter-kit exec vitest run tests/durable-failures.test.tsx` | `expected 'expose ai knowledge graph api...' to contain 'optional'` | ❌ RED (Reproduced) |
| **F5** (Quickstart order without repair) | V2-4 | `apps/starter-kit/tests/durable-failures.test.tsx` | `Probe 5 (Failing): reversing step definitions without repairing order derives sequential positions` | `pnpm --filter starter-kit exec vitest run tests/durable-failures.test.tsx` | `expected 8 to be 1` | ❌ RED (Reproduced) |

---

## 2. Retained Positive Probes (Protection Against Regression)

| Probe | Test Path | Test Name | Command | Result |
|---|---|---|---|---|
| Positive Probe 1 | `apps/starter-kit/tests/durable-failures.test.tsx` | `Positive Probe 1: mutating existing quickstart code updates visible UI and graph text together` | `pnpm --filter starter-kit exec vitest run tests/durable-failures.test.tsx` | ✅ PASSED |
| Positive Probe 2 | `apps/starter-kit/tests/durable-failures.test.tsx` | `Positive Probe 2: removing two steps and adding one updates UI list and graph count` | `pnpm --filter starter-kit exec vitest run tests/durable-failures.test.tsx` | ✅ PASSED |

---

## 3. Test Infrastructure and Verification Commands

The following verification commands are fully established and operational across the monorepo:

| Command | Purpose | Failure Mode / Current Status |
|---|---|---|
| `pnpm -r lint` | Recursive TypeScript typechecking (`tsc --noEmit`) | ✅ **5/5 packages pass**, demonstrably including `starter-kit` |
| `pnpm -r --if-present test` | Recursive unit/SSR test workflow | ❌ **Fails on durable assertion errors** (F1, F2 in core; F4, F5 in starter-kit) |
| `pnpm --filter starter-kit run test:production` | Production artifact & graph verification on `.next` build output | ❌ **Fails on durable assertion error** (F3 docs content missing from graph) |
| `pnpm --filter starter-kit run test:e2e` | Playwright browser smoke test suite against running Next.js server (port 3217) | ✅ **5/5 browser smoke tests pass** with safe network interception |
| `pnpm verify:content` | Aggregate verification pipeline (build → test → lint → test:production → test:e2e) | ❌ **Fails on assertion errors** at Step 2 (as expected before fixes) |

---

## 4. Work Package Transition Map

- **V2-1** will resolve F1 & F2: turning `packages/core/src/content/content-identity-failures.test.ts` from RED to GREEN.
- **V2-2 & V2-5** will resolve F3: turning `Probe F3 (Failing)` in `tests/production/production-output.test.ts` from RED to GREEN.
- **V2-3** will resolve F4: turning Probe 1 & Probe 2 in `tests/durable-failures.test.tsx` from RED to GREEN.
- **V2-4** will resolve F5: turning Probe 3, Probe 4 & Probe 5 in `tests/durable-failures.test.tsx` from RED to GREEN.
- **V2-7** will execute the full aggregate `pnpm verify:content` suite with all gates passing.
