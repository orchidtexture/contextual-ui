# Contextual UI Architectural Refactoring Plan

This document outlines the transition to an **Open Core Monorepo Architecture**. The goal is to decouple connectors from the core library, establish a Zod-based metadata protocol for UI rendering, and organize the codebase to support open-source growth and commercial enterprise extensions.

---

## Phase 1: Monorepo Restructuring & Core Decoupling (✅ Completed)
Reorganize the repository into a structured `pnpm` monorepo, isolating the framework-agnostic UI core from framework-specific plugins and connectors.

### 1.1 Directory Structure Setup
- [x] Create `/packages` directory for core libraries.
  - [x] Move core UI components, schemas, and hydration logic to `/packages/core`.
  - [x] Move CMS/Dashboard components to `/packages/dashboard`.
- [x] Create `/connectors` directory for data source plugins.
- [x] Create `/apps` directory for implementations (`/apps/starter-kit` queued).
- [x] Update `pnpm-workspace.yaml` to include workspace packages:
  ```yaml
  packages:
    - 'packages/*'
    - 'connectors/*'
    - 'apps/*'
  ```

### 1.2 Build & Dependency Alignment
- [x] Update `package.json` names (`@contextual-ui/core`, `@contextual-ui/dashboard`, `@contextual-ui/connector-static`).
- [x] Adjust `tsup.config.ts` and `tsconfig.json` for each package to ensure clean builds and proper `.d.ts` generation.
- [x] Ensure `@contextual-ui/core` only lists `zod` and `@radix-ui/*` as dependencies (no Next.js or ORMs).

---

## Phase 2: Core Refactoring (Decoupling) (✅ Completed)
Remove data-fetching concepts from the core UI and schema library.

### 2.1 Remove Connectors from Core
- [x] Remove `.withConnector()` and `fetchData()` from `src/registry/defineSchema.ts`.
- [x] Remove `staticConnector` and server context types from the core package.
- [x] Redefine `defineSchema` to purely output validation rules, agent formatters, and JSON-LD generators (`hydrate`, `parse`, `getAgentData`).

### 2.2 Rebuild Hydration Pipeline
- [x] Update the `siteSchema.hydrate(rawData)` logic to operate purely as a synchronous Zod validation and formatting layer.
- [x] Ensure the core dashboard components accept standard JSON/Object inputs.

---

## Phase 3: The Zod Metadata Protocol (✅ Completed)
Establish a standardized way to pass UI hints (widgets, labels, states) through standard Zod schemas using `.describe()`.

### 3.1 Metadata Specification
- [x] Define TypeScript interface for UI Metadata (`UIMetadata`).

### 3.2 Metadata Utility (`cx`)
- [x] Create utility function `cx(schema, meta)` that serializes UI configuration into Zod's `.describe()` string and export `getFieldMetadata`.

### 3.3 Dashboard Parser
- [x] Update `@contextual-ui/dashboard` components to safely parse `schema._def.description` and render the appropriate widgets (mapping `widget` metadata to form input widgets, labels, and placeholders).

---

## Phase 4: Developing the Connector Ecosystem (🔄 In Progress / Partial)
Build independent packages responsible for data retrieval and injection.

### 4.1 Connector Protocol
- [x] Establish standalone connector pattern returning `{ fetchData() }`.
  
### 4.2 First Open-Source Connectors
- [x] Create `@contextual-ui/connector-static` as a standalone package for local JSON/JS objects.
- [ ] (Future) Scaffold `@contextual-ui/connector-postgres` or `@contextual-ui/connector-notion`.

### 4.3 Framework Adapters (Optional)
- [x] Maintained `createRouteHandler` and `createPagesRouteHandler` inside `@contextual-ui/core/server`.

---

## Phase 5: Documentation & Starter Kit (⏳ Pending)
Update external-facing materials to reflect the new architecture.

- [ ] Update `README.md` to reflect the Open Core philosophy and monorepo packages.
- [ ] Build `/apps/starter-kit` demonstrating the flow:
  1. Define schema in `@contextual-ui/core`
  2. Fetch data via `@contextual-ui/connector-static`
  3. Validate and hydrate in UI.
- [ ] Document the Zod Metadata Protocol (`cx` utility).

---

## Commercial Guardrails Checklist
- [x] Are all enterprise dependencies (e.g., Salesforce SDKs, heavy SQL drivers) isolated in private packages outside the core monorepo?
- [x] Does `@contextual-ui/core` run flawlessly in both Node.js and Browser environments without warnings?
- [ ] Can a user swap out the default CMS Dashboard for their own UI using the raw metadata from the `cx` utility?