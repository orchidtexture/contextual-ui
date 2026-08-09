# Contextual UI: CMS Dashboard & Agent API Implementation Plan

## Feasibility Assessment

**Is this plan feasible? Yes.**
After reviewing the project's current architecture (`React`, `Zod`, `Radix UI`, `tsup`), the proposed plan is highly feasible and aligns perfectly with the existing technical stack:

1. **Architecture alignment**: The components are already strictly typed using Zod schemas (`FaqDataSchema`, `NavbarDataSchema`), which makes automatic UI generation for the CMS dashboard trivial.
2. **Framework agnostic**: By utilizing the standard web `Request`/`Response` API, the API handler (`createRouteHandler`) will work seamlessly in modern edge/serverless environments (Next.js App Router, Remix, standard Node.js).
3. **Build system compatibility**: The current build system uses `tsup`. It is extremely easy to modify `tsup.config.ts` to output multiple entry points (`server`, `dashboard`, `index`) to ensure server logic isn't bundled into the client React code.

---

## Step-by-Step Implementation Plan

### Phase 1: The Core Data Registry (`src/registry`)
**Goal**: Create a centralized way to define and validate the Single Source of Truth (SSOT).

1. **Implement `defineContext`**:
   - Create a utility `src/registry/defineContext.ts`.
   - It will accept an object mapping keys (e.g., `faq`, `navbar`) to data.
   - It will use existing component Zod schemas to validate the data at runtime.
   - It will expose a method `getAgentData()` that runs the individual `exportAgentData` methods and bundles them into a single, clean JSON object for AI consumption.

### Phase 2: Framework-Agnostic API Handlers (`src/server`)
**Goal**: Allow developers to expose the SSOT to AI agents with a single line of code.

1. **Implement `createRouteHandler`**:
   - Create `src/server/createRouteHandler.ts`.
   - Take the context object returned by `defineContext` as an argument.
   - Return a `GET` function adhering to the standard Web Fetch API signature (`(req: Request) => Response`).
   - This directly enables Next.js App Router compatibility (e.g., `export const { GET } = createRouteHandler(siteContext)`).

### Phase 3: The CMS Dashboard Component (`src/dashboard`)
**Goal**: Provide an out-of-the-box, read-only visualization of the SSOT for human operators.

1. **Build `ContextualDashboard`**:
   - Create `src/dashboard/Dashboard.tsx`.
   - Accept the context object as a prop.
   - Map over the registered context sections.
2. **Schema-Driven Rendering**:
   - Since we know the data shapes via Zod, implement strict type-guards.
   - Render `FaqData` as an HTML Table (Question/Answer columns).
   - Render `NavbarData` as a nested list or tree.
   - Apply inline styles or minimal scoped CSS to ensure the dashboard looks good out-of-the-box without clashing with the host application's CSS (like Tailwind resets).

### Phase 4: Build System & Package Exports Update
**Goal**: Allow clean imports (`contextual-ui/server`, `contextual-ui/dashboard`) without bloating client bundles.

1. **Update `tsup.config.ts`**:
   - Change `entry` to handle multiple endpoints: 
     `entry: ['src/index.ts', 'src/server/index.ts', 'src/dashboard/index.ts']`
2. **Update `package.json` Exports**:
   - Configure the `"exports"` map to point to the separate build artifacts.
   - Ensure `package.json` defines proper types for these subpaths so TypeScript resolves them correctly in user projects.

### Phase 5 (Future Expansion): Interactive CMS
**Goal**: Transition from a read-only viewer to an active SSOT editor.

1. **Integrate `createForm`**:
   - Leverage the existing `FormFactory` in `src/components/form`.
   - Add an `onSave` prop to `ContextualDashboard`.
   - When a user clicks "Edit" on a section (e.g., FAQ), use `createForm(FaqDataSchema)` to instantly render a strictly-typed editor.
   - Allow the user to mutate the SSOT and push changes back to their database.
