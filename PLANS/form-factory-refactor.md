# Plan: Form Factory Refactor (CMS-Driven & Agentic Forms)

## Overview
Currently, `createForm` relies on hardcoded Zod schemas and static JSX fields. This refactor transitions the Form Factory into a truly **Contextual** feature by introducing three distinct layers of automation:
1. **CMS-Driven**: Forms are defined in the CMS (or static connector) and passed down as data.
2. **Dynamic UI & Validation**: The frontend dynamically builds runtime Zod schemas and renders headless React components based on the CMS data.
3. **Agentic Schema.org Action**: The JSON-LD graph builder automatically emits `PotentialAction` entities (e.g., `ContactAction`), exposing a machine-readable "API Spec" for AI agents to interact with the form programmatically without needing a browser DOM.

---

## Phase 1: Define `formRegistry` (Core API)
We need to create a new built-in registry in `packages/core/src/server/registries/`.

**Tasks:**
- [x] Create `form.schema.ts` and `form.utils.ts` in `packages/core/src/components/form/`.
- [x] Define the TypeScript contract for a Form Entity (`FormEntitySchema`, `FormFieldSchema`, `FormDataSchema`).
  - `id`: Unique identifier for the form (e.g., `'contact-sales'`).
  - `actionType`: Schema.org action type (e.g., `'ContactAction'`, `'SearchAction'`, `'SubscribeAction'`).
  - `endpoint`: The API endpoint to hit (e.g., `'/api/contact'`).
  - `method`: HTTP Method (e.g., `'POST'`).
  - `fields`: Array of field configurations:
    - `name`: string (e.g., `'email'`)
    - `type`: `'text' | 'email' | 'textarea' | 'select' | 'boolean' | 'number' | 'tel' | 'url' | 'password'`
    - `label`: string
    - `required`: boolean
    - `placeholder`?: string
    - `options`?: array of strings/objects (for selects)
- [x] Export `formRegistry` and `formsRegistry` to be used inside `defineSchema`.
- [x] Add comprehensive test coverage in `packages/core/src/components/form/form.test.ts`.

---

## Phase 2: Schema.org Graph Integration (Agentic AI)
AI agents need to know how to interact with the form. We will map the form data to a Schema.org `PotentialAction`.

**Tasks:**
- [x] Update `packages/jsonld-graph-builder/src/` with `createPotentialAction`, `createPropertyValueSpecification`, and `inferValuePattern`.
- [x] Map the root form object to a Schema.org Action (`"@type": form.actionType || "ContactAction"`).
- [x] Map the `endpoint` and `method` to an `EntryPoint` target with canonical URL resolution (`canonicalizeUrl`).
- [x] Map the `fields` array into `PropertyValueSpecification` entities with validation rules (`valuePattern`, `valueMinLength`, `valueMaxLength`, `minValue`, `maxValue`, `valueOption`, `valueRequired`).
- [x] Add comprehensive unit tests in `packages/jsonld-graph-builder/src/__tests__/builder.test.ts`.

---

## Phase 3: Dynamic Runtime & UI (`AutoForm`)
Replace or extend the static `createForm` with a dynamic `<AutoForm>` component capable of reading the registry payload.

**Tasks:**
- [x] **Dynamic Zod Generation**: Created `buildZodSchema(fields)` and `buildFieldZodSchema(field)` in `packages/core/src/components/form/buildZodSchema.ts` that dynamically generate Zod schemas in-memory supporting text, email, textarea, select, boolean, number, url, tel, and password field types with custom error messages and constraints.
- [x] **`AutoForm` Component**: Implemented `<AutoForm>` in `packages/core/src/components/form/AutoForm.tsx` consuming `data` (forms registry payload) and `formId`, binding dynamic Zod validation, handling `onBlur` and `onSubmit` states, and managing success/error lifecycles.
- [x] **Headless Slots Support**: Implemented `components` prop with customizable slots (`Form`, `Field`, `Label`, `Input`, `TextArea`, `Select`, `Checkbox`, `ErrorMessage`, `Submit`, `Section`).
- [x] **Unit Tests**: Added test suite in `packages/core/src/components/form/autoForm.test.ts` covering dynamic schema generation, validation constraints, and optional field handling.

---

## Phase 4: Starter Kit & Documentation Updates
Update the starter kit to use the new architecture to prove it works end-to-end.

**Tasks:**
- [ ] Update `connectors/static/src/index.ts` to include a sample `forms` configuration.
- [ ] Update `apps/starter-kit/data/site.schema.ts` to register `forms: formRegistry()`.
- [ ] Create an API route (`apps/starter-kit/app/api/contact/route.ts`) to handle the form submission.
- [ ] Replace the manual `ContactForm` in `DocsClient.tsx` with the new `<AutoForm>` implementation.
- [ ] Update documentation copy to highlight the "Agentic AI Forms" and "CMS-Driven Forms" concepts.

---

## Technical Considerations
- **Security**: The dynamic Zod schema is strictly for client-side validation and DX. The server handling the POST request must still validate the incoming payload independently.
- **Extensibility**: Make sure the `AutoForm` slots can handle custom field types in the future (e.g., Date pickers, File uploads).
