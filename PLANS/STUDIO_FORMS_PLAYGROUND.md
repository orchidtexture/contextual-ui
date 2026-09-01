# Studio Forms Playground Implementation Plan

## Overview
We are building a "Studio" section in the `starter-kit` app. This will serve as an interactive playground for developers and "vibecoders" to explore and configure the `contextual-ui` Forms. 

Instead of a live-compilation editor, we are using the **Code Generator (Option B)** approach. Users tweak visual controls or configuration, interact with the generated form, and see the exact React/Zod code update in real-time. This code is read-only but ready to copy.

## Key Features
1. **Live Visualizer**: A functional rendering of the form based on current configuration.
2. **Code Generator Pane**: Shows the exact code needed to implement the form (Zod schema, React Component, API route).
3. **Interactive Console**: A simulated terminal that catches form `onSubmit` events, displaying JSON payloads and validation errors to prove the form works.
4. **AI Prompt Exporter**: A "Copy implementation prompt" button that wraps the generated code in instructions for AI coding assistants (Cursor, Claude, etc.) so vibecoders can instantly implement the form in their own apps.

---

## 1. Routing & Navigation
* **Navbar Update**: Add a "Studio" link to `apps/starter-kit/components/Navbar.tsx`.
* **New Routes**:
  * `app/studio/layout.tsx`: A custom full-screen (IDE-like) layout that removes the standard site footer and enforces a `h-screen` container.
  * `app/studio/page.tsx`: Redirects to `/studio/forms` (allows future expansion like `/studio/workflows`).
  * `app/studio/forms/page.tsx`: The main workspace for the Forms playground.

---

## 2. UI Layout (The "IDE" View)
The workspace will use a responsive grid (e.g., Tailwind `grid-cols-12` on desktop):

* **Left Pane (Col Span 3) - Builder/Config**: 
  * Controls to add/remove fields (Text, Email, Select, Checkbox).
  * Toggles for validation (Required, Min length).
  * A mock file tree showing the generated files.
* **Middle Pane (Col Span 5) - Editor & Console**:
  * **Top (Code View)**: Syntax-highlighted block (via PrismJS, which is already in `package.json`) showing the selected file's generated code. Tabs to switch between `schema.ts`, `FormComponent.tsx`, etc.
  * **Bottom (Console)**: A dark terminal window. Prints out formatted JSON when the form in the Visualizer is submitted.
* **Right Pane (Col Span 4) - Visualizer**:
  * Clean, isolated canvas.
  * Renders the actual form UI built from the configuration.

---

## 3. Implementation Steps

### Step 1: Scaffolding Routes & Layout
- Create the folder structure for `app/studio`.
- Implement `layout.tsx` to handle the full-bleed layout.
- Update `Navbar.tsx` to include the Studio route.

### Step 2: State Management (The Form Definition)
- Define a TypeScript type for the playground configuration (e.g., `FormDefinition`).
- Set up a React state (or context) in `app/studio/forms/page.tsx` that holds an array of fields, their types, and constraints.

### Step 3: The Code Generators
- Create utility functions in a new folder (e.g., `app/studio/forms/generators`).
- **`generateSchema(config)`**: Outputs the Zod schema string.
- **`generateComponent(config)`**: Outputs the React Hook Form / Contextual UI component string.
- **`generateApiRoute(config)`**: Outputs a basic Next.js Route Handler string.

### Step 4: Building the Panes
- **Visualizer**: Create a dynamic component that takes the `config` state and renders the actual UI elements. Wire its `onSubmit` to update a `consoleLogs` state.
- **Console**: A simple scrollable `div` styled like a terminal mapping over `consoleLogs`.
- **Editor**: A component using PrismJS to render the strings produced by the Code Generators based on the active tab.

### Step 5: The "Copy for AI" Feature
- Create a button that aggregates all generated files.
- Formats them into a prompt template, e.g.:
  ```text
  I want to implement a form in my Next.js app using contextual-ui. 
  Please create the following files exactly as provided:

  File: schema.ts
  [Code]

  File: FormComponent.tsx
  [Code]
  ```
- Use the Clipboard API to copy it.

---

## Next Steps
Once approved, we will begin with Step 1 (Scaffolding Routes & Layout) and Step 2 (State Management).
