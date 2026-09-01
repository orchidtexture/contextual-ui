# contextual-ui

**Contextual UI** is the foundational headless component library designed for the modern web—where your UI isn't just consumed by humans, but also by search engines and AI agents.

Built with **React**, **Zod**, and **Radix UI**, it provides the infrastructure to build accessible, type-safe, and SEO-optimized components with zero design opinion, paired with an integrated Schema.org Knowledge Graph engine.

## 📦 Installation

```bash
npm install contextual-ui zod
# or
pnpm add contextual-ui zod
```

---

## 🚀 Quickstart: The Single Source of Truth (SSOT) Pattern

### 1. Define Schema (`site.schema.ts`)
Combine standard Zod schemas with pre-built registries that automatically generate Schema.org JSON-LD:

```typescript
import {
  defineSchema,
  websiteRegistry,
  webpageRegistry,
  navbarRegistry,
  footerRegistry,
  faqRegistry,
  formRegistry,
} from 'contextual-ui/server';
import { z } from 'zod';

export const siteSchema = defineSchema({
  website: websiteRegistry(),
  webpage: webpageRegistry(),
  navbar: navbarRegistry(),
  footer: footerRegistry(),
  faq: faqRegistry(),
  forms: formRegistry(),
  announcement: {
    schema: z.object({
      enabled: z.boolean(),
      message: z.string().describe('Announcement text'),
    }),
  },
});
```

### 2. Connect & Wrap into Contextual App (`site.server.ts`)
Use `createContextualApp` to combine your schema and data connector into a unified, fully typed application context:

```typescript
import { siteSchema } from './site.schema';
import { staticConnector } from 'contextual-ui-connector-static';
import { createContextualApp, InferData } from 'contextual-ui/server';

const connector = staticConnector({
  website: { name: 'My App', url: 'https://example.com' },
  webpage: [
    { id: 'home', name: 'Home', url: '/' },
    { id: 'docs', name: 'Docs', url: '/docs', description: 'Documentation' },
  ],
  faq: [{ id: '1', question: 'What is this?', answer: 'An SSOT UI kit.' }],
  navbar: { links: [{ id: '1', label: 'Home', href: '/' }] },
  footer: {
    brand: { name: 'My App', description: 'Contextual headless UI.' },
    columns: [{ id: 'links', title: 'Links', links: [{ id: '1', label: 'Docs', href: '/docs' }] }],
  },
  forms: [
    {
      id: 'contact-sales',
      name: 'Contact Sales',
      endpoint: '/api/contact',
      method: 'POST',
      fields: [
        { name: 'name', type: 'text', label: 'Full Name', required: true },
        { name: 'email', type: 'email', label: 'Email', required: true },
        { name: 'message', type: 'textarea', label: 'Message', required: true },
      ],
    },
  ],
  announcement: { enabled: true, message: 'Welcome!' },
});

export const siteApp = createContextualApp({
  schema: siteSchema,
  connector,
  baseUrl: 'https://example.com',
});

// Fully inferred TypeScript types for your components
export type SiteData = InferData<typeof siteSchema>;
```

### 3. Render with `ContextualSite` & `WebPage` (`app/layout.tsx` and `app/page.tsx`)
Wrap your layout or app root with `ContextualSite` to distribute global data, and wrap routes with `<WebPage />` from `contextual-ui/server` to inject route-accurate Schema.org JSON-LD graphs:

```tsx
// app/layout.tsx
import { siteApp } from '@/data/site.server';
import { ContextualSite } from 'contextual-ui';
import { Navbar } from '@/components/Navbar';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const data = await siteApp.fetchData();

  return (
    <html lang="en">
      <body>
        <ContextualSite data={data} options={{ disableJsonLdScript: true }}>
          <Navbar />
          {children}
        </ContextualSite>
      </body>
    </html>
  );
}
```

```tsx
// app/docs/page.tsx
import { siteApp } from '@/data/site.server';
import { WebPage } from 'contextual-ui/server';
import { DocsClient } from './DocsClient';

export default async function DocsPage() {
  const data = await siteApp.fetchData();

  return (
    <WebPage app={siteApp} id="docs">
      <DocsClient data={data} />
    </WebPage>
  );
}
```

> **Note:** Child components can also be used standalone (outside `ContextualSite`), in which case you pass `data={...}` explicitly and they will render their own local `<script type="application/ld+json">` tag. When wrapped in `ContextualSite`, inline script tags are automatically suppressed in favor of the unified site graph.

---

## 🏛️ Site Wrapper: `<ContextualSite />`

`ContextualSite` coordinates domain-level data distribution and Schema.org `WebSite` graph generation across your entire site:

* **Unified `@graph` Generation:** Compiles all schema sections into a single Schema.org `@graph` object, deduplicating shared entities (e.g. `@id: 'website'`).
* **Contextual Data Distribution:** Child components (`Navbar.Root`, `Faq.Root`, `Breadcrumb.Root`) automatically retrieve their respective data slice from context without manual prop passing.
* **Custom Section Keys:** Use `sectionKey="myCustomKey"` on child components if your schema uses custom section names.
* **Slot / Layout Support:** Supports `asChild` via Radix UI Slot, allowing you to attach site context directly onto existing container elements.

### Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `data` | `SiteData \| HydratedContext` | Data object matching the schema or a hydrated context. |
| `graph` | `JsonLdGraphResult` | Pre-built Schema.org graph (ideal for passing across Server/Client boundary in RSC). |
| `schema` | `SchemaDefinition` | Schema definition returned by `defineSchema(...)` (for client usage). |
| `options` | `ContextualSiteOptions` | Graph configuration (e.g., `baseUrl`, `dedupeStrategy`, `disableJsonLdScript`). |
| `asChild` | `boolean` | If true, merges props onto the immediate child element instead of rendering a `<div>`. |
| `className` | `string` | CSS class name for the wrapper element. |

---

## 📱 Architecture Patterns: SPAs vs. Multi-Page Applications

Contextual UI supports both Single-Page Applications (SPAs) and Server-Rendered Multi-Page Applications (Next.js App Router):

### Pattern 1: Multi-Page Applications (Next.js App Router)
In multi-page architectures, layout components (`<ContextualSite>`) distribute global data (`navbar`, `footer`), while `<WebPage>` in each `page.tsx` generates route-specific Schema.org JSON-LD scripts with accurate URLs and titles:

* **Root Layout (`app/layout.tsx`)**: Wraps the tree with `<ContextualSite data={data}>` (no `graph` prop passed, so no sitewide script is injected).
* **Page (`app/docs/page.tsx`)**: Wraps content with `<WebPage app={siteApp} name="Docs" url="/docs">`, which compiles and injects the route-accurate Schema.org graph.

### Pattern 2: Single-Page Applications & Landing Pages (Vite, CRA, or 1-Page Next.js)
If your app is a single landing page without multiple sub-routes, `<ContextualSite>` handles everything in one place:

```tsx
// App.tsx (Single Landing Page / SPA)
import { ContextualSite, Navbar, Faq, Footer } from 'contextual-ui';
import { siteSchema } from './site.schema';
import { siteData } from './site.data';

export default function App() {
  return (
    <ContextualSite schema={siteSchema} data={siteData}>
      <Navbar.Root />
      <main>
        <Faq.Root />
      </main>
      <Footer.Root />
    </ContextualSite>
  );
}
```
In this mode, `<ContextualSite>` compiles the unified Schema.org `@graph` (combining `Organization`, `WebSite`, `WebPage`, `Navbar`, `FAQPage`, `Footer`) and injects the `<script type="application/ld+json">` automatically.

### Pattern 3: Client-Routed SPAs (React Router / TanStack Router)
For SPAs with client-side routing:
* Put `<ContextualSite data={siteData}>` around your root router.
* Render `<WebPage name="Docs" url="/docs">` inside each client route view to dynamically set route metadata.

---

## 🌐 Structured Data Architecture: Global Graph vs. Route-Level Metadata

Contextual UI components distinguish between two fundamental types of structured data:

### 1. Global Knowledge Graph Entities (Domain-Level)
* **Components & Schemas:** `websiteRegistry` (`WebSite`), `navbarRegistry` (`SiteNavigationElement`), `faqRegistry` (`FAQPage`), `Organization`, `Article`, `Product`.
* **Where they live:** Defined centrally in your `siteSchema` (Single Source of Truth) and backed by CMS/connectors or databases.
* **How they are consumed:**
  1. Rendered in React UI for users.
  2. Injected into HTML via `<script type="application/ld+json">`.
  3. Exported sitewide to `/api/graph.json` via `jsonld-graph-builder` for search engine knowledge graphs and AI agent ingestion.

### 2. Ephemeral Route-Level Metadata (Page-Level Hierarchy)
* **Components & Schemas:** `breadcrumbRegistry` (`BreadcrumbList`), `WebPage`.
* **Where they live:** Derived dynamically from the active URL (`pathname`), routing params, or local page tree.
* **How they are consumed:**
  1. Rendered as interactive navigation breadcrumbs on the specific page.
  2. Injected directly into that page's HTML `<head>` / DOM for search crawlers visiting that exact URL.
  3. *Not* forced into the global `/api/graph.json` knowledge graph, avoiding unnecessary coupling between ephemeral page paths and centralized data schemas.

---

## ⚡ Global Knowledge Graph Export (`/api/graph.json`)

Contextual UI provides one-line route handler generators to serve a unified, referentially-linked Schema.org `@graph` for search engines and AI agents with zero runtime scraping.

### Using `createContextualApp` (Recommended)

```typescript
// app/api/graph.json/route.ts
import { siteApp } from '@/data/site.server';

// Serves the full Knowledge Graph (inherits baseUrl from createContextualApp)
export const { GET } = siteApp.createGraphHandler({
  includeAll: true, // Exports all schema sections (including non-global ones like FAQ)
  graphOptions: {
    flatten: true,
    dedupeStrategy: 'merge',
  },
});
```

### Graph Filtering & Privacy Options

You can control which schema sections are exported to the `@graph` or layout script:

| Option | Type | Description |
| :--- | :--- | :--- |
| `includeAll` | `boolean` | When `true`, exports all schema sections, bypassing the default `isGlobal: false` filter (e.g. including FAQPage, local page entities). |
| `includeKeys` | `string[]` | Whitelist specific schema sections to include (e.g. `['website', 'navbar', 'faq']`). |
| `excludeKeys` | `string[]` | Exclude specific sensitive or private schema sections (e.g. `['internalAnnouncement', 'adminConfig']`). |
| `graphOptions.baseUrl` | `string` | Override the default `baseUrl` configured in `createContextualApp`. |
| `graphOptions.flatten` | `boolean` | Flattens nested entities to the root `@graph` array with `@id` pointers (default: `true`). |
| `graphOptions.dedupeStrategy` | `'merge' \| 'replace' \| 'keep-first'` | Strategy for resolving entities with duplicate `@id`s (default: `'merge'`). |

### Using Standalone `createGraphRouteHandler`

```typescript
// app/api/graph.json/route.ts
import { siteSchema } from '@/data/site.schema';
import { siteConnector } from '@/data/site.server';
import { createGraphRouteHandler } from 'contextual-ui/server';

export async function GET(req: Request) {
  const rawData = await siteConnector.fetchData();
  const hydrated = siteSchema.hydrate(rawData);

  const handler = createGraphRouteHandler(hydrated, {
    graphOptions: {
      baseUrl: 'https://example.com',
      flatten: true,
      dedupeStrategy: 'merge',
    },
  });

  return handler.GET(req);
}
```

---

## 🧩 Built-in Schema Registries

### 1. WebSite (`websiteRegistry`)
Defines the root `WebSite` entity that interconnects all child components (`navbar`, `faq`) into a single connected knowledge graph.

```typescript
import { defineSchema, websiteRegistry, navbarRegistry, faqRegistry } from 'contextual-ui/server';

export const siteSchema = defineSchema({
  website: websiteRegistry(),
  navbar: navbarRegistry(),
  faq: faqRegistry(),
});
```

### 2. Organization (`organizationRegistry`)
Defines brand and publisher identity, legal entity data, logo, social profile links (`sameAs`), and contact channels for Knowledge Graph schemas.

```typescript
import { defineSchema, organizationRegistry } from 'contextual-ui/server';

export const siteSchema = defineSchema({
  organization: organizationRegistry(),
});
```

### 3. WebPage (`webpageRegistry` & `<WebPage />`)
Defines route document metadata (title, canonical URL, description, language) and injects route-specific Schema.org JSON-LD scripts on server or client pages.

```tsx
import { WebPage } from 'contextual-ui/server';
import { siteApp } from '@/data/site.server';

export default async function DocsPage() {
  const data = await siteApp.fetchData();
  return (
    <WebPage app={siteApp} id="docs">
      <main>Documentation content</main>
    </WebPage>
  );
}
```

### 4. Navbar (`navbarRegistry` & `<Navbar />`)
Provides responsive navigation structure, mobile drawer toggles, and injects `SiteNavigationElement` linked upward to the root `WebSite`.

```tsx
import { Navbar } from 'contextual-ui';

const navData = {
  brand: { name: 'Contextual UI', href: '/' },
  links: [
    { id: '1', label: 'Features', href: '#features' },
    { id: '2', label: 'Docs', href: '/docs' },
  ]
};

export function Header() {
  return (
    <Navbar.Root data={navData} className="flex justify-between p-4">
      <Navbar.Brand href="/" className="font-bold text-xl" />
      <Navbar.Content className="hidden md:flex gap-4">
        {navData.links.map(link => (
          <a key={link.id} href={link.href}>{link.label}</a>
        ))}
      </Navbar.Content>
      <Navbar.Toggle className="md:hidden" />
      <Navbar.Menu className="md:hidden flex flex-col mt-4">
        {navData.links.map(link => (
          <a key={link.id} href={link.href} className="py-2">{link.label}</a>
        ))}
      </Navbar.Menu>
    </Navbar.Root>
  );
}
```

### 5. Footer (`footerRegistry` & `<Footer />`)
Provides structured footer navigation, columnar and flat link organization, social profiles, and copyright handling while injecting Schema.org `WPFooter` and `SiteNavigationElement` nodes into the global Knowledge Graph.

```tsx
import { Footer } from 'contextual-ui';

const footerData = {
  brand: {
    name: 'Contextual UI',
    description: 'Headless UI with built-in Agentic AI and Schema.org SEO.',
  },
  columns: [
    {
      id: 'resources',
      title: 'Resources',
      links: [
        { id: '1', label: 'Docs', href: '/docs' },
        { id: '2', label: 'Schema Graph', href: '/schema' },
      ],
    },
  ],
  socials: [
    { id: '1', platform: 'github', href: 'https://github.com/tasuku-io' },
  ],
  copyright: {
    holder: 'Tasuku Studio',
  },
};

export function SiteFooter() {
  return (
    <Footer.Root data={footerData} className="p-8 border-t">
      <Footer.Brand />
      <Footer.Description />
      <Footer.Columns>
        <Footer.Column id="resources">
          <Footer.ColumnTitle />
          <Footer.Links />
        </Footer.Column>
      </Footer.Columns>
      <Footer.Socials />
      <Footer.Copyright />
    </Footer.Root>
  );
}
```

### 6. FAQ (`faqRegistry` & `<Faq />`)
Handles collapsible state, accessible ARIA roles, and automatically generates Schema.org `FAQPage`, `Question`, and `Answer` nodes with linked `@id` identifiers.

```tsx
import { Faq } from 'contextual-ui';

const data = [
  { id: '1', question: 'What is Contextual UI?', answer: 'A headless library...' }
];

export function FaqSection() {
  return (
    <Faq.Root data={data}>
      {data.map((item) => (
        <Faq.Item key={item.id} id={item.id}>
          <Faq.Trigger className="accordion-trigger">
            {item.question}
          </Faq.Trigger>
          <Faq.Content className="accordion-content">
            {item.answer}
          </Faq.Content>
        </Faq.Item>
      ))}
    </Faq.Root>
  );
}
```

### 7. Breadcrumb (`breadcrumbRegistry` & `<Breadcrumb />`)
Renders accessible breadcrumb hierarchy and emits Schema.org `BreadcrumbList` JSON-LD directly into the page DOM.

```tsx
import { Breadcrumb } from 'contextual-ui';

const breadcrumbData = [
  { id: '1', label: 'Home', url: '/' },
  { id: '2', label: 'Documentation', url: '/docs' },
  { id: '3', label: 'Core Components', url: '/docs/core' }
];

export function PageBreadcrumbs() {
  return (
    <Breadcrumb.Root data={breadcrumbData} baseUrl="https://yoursite.com">
      <Breadcrumb.List className="flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbData.map((item, index) => {
          const isLast = index === breadcrumbData.length - 1;
          return (
            <Breadcrumb.Item key={item.id} id={item.id} className="flex items-center space-x-2">
              {isLast ? (
                <Breadcrumb.Page className="font-semibold text-gray-900">
                  {item.label}
                </Breadcrumb.Page>
              ) : (
                <>
                  <Breadcrumb.Link href={item.url} className="hover:underline text-blue-600">
                    {item.label}
                  </Breadcrumb.Link>
                  <Breadcrumb.Separator className="text-gray-400">
                    /
                  </Breadcrumb.Separator>
                </>
              )}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}
```

---

## 📝 Forms & Agentic Actions

Contextual UI provides two complementary form paradigms:
1. **Dynamic CMS / Agentic Forms (`formRegistry` & `<AutoForm />`)**: Dynamic forms driven by CMS or connector schemas that compile in-memory Zod validators on the fly, render accessible UI, and emit Schema.org `PotentialAction` JSON-LD for AI search engines and autonomous agents.
2. **Static Form Factory (`createForm`)**: Compile-time type-safe compound form components generated directly from standard static Zod schemas with zero boilerplate.

---

### A. Dynamic CMS & Agentic Forms (`formRegistry` + `<AutoForm />`)

#### 1. Declare in Schema (`site.schema.ts`)
Add `forms: formRegistry()` (or `formsRegistry()`) to your schema:

```typescript
import { defineSchema, formRegistry } from 'contextual-ui/server';

export const siteSchema = defineSchema({
  forms: formRegistry(),
});
```

This automatically generates Schema.org `PotentialAction` objects (`@type: ContactAction`, `target: EntryPoint`, `object: PropertyValueSpecification[]`) in your site's Knowledge Graph (`/api/graph.json`), allowing AI agents and web crawlers to discover and execute form actions programmatically.

#### 2. Form Data Structure (`FormEntity`)
Define forms in your connector or headless CMS:

```typescript
import { FormEntity } from 'contextual-ui';

const contactForm: FormEntity = {
  id: 'contact-sales',
  name: 'Contact Sales',
  title: 'Get in Touch',
  description: 'Reach out to our enterprise solutions team.',
  actionType: 'ContactAction',
  endpoint: '/api/contact',
  method: 'POST',
  submitLabel: 'Send Inquiry',
  successMessage: 'Thank you! We will get back to you within 24 hours.',
  fields: [
    {
      name: 'fullName',
      type: 'text',
      label: 'Full Name',
      required: true,
      placeholder: 'Jane Doe',
      validation: { minLength: 2 },
    },
    {
      name: 'email',
      type: 'email',
      label: 'Work Email',
      required: true,
      placeholder: 'jane@company.com',
    },
    {
      name: 'companySize',
      type: 'select',
      label: 'Company Size',
      required: false,
      placeholder: 'Select company size...',
      options: [
        { label: '1 - 10 employees', value: '1-10' },
        { label: '11 - 50 employees', value: '11-50' },
        { label: '50+ employees', value: '50+' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'How can we help?',
      required: true,
      placeholder: 'Tell us about your project...',
      validation: { minLength: 10, maxLength: 1000 },
    },
    {
      name: 'acceptTerms',
      type: 'boolean',
      label: 'I agree to the privacy policy',
      required: true,
    },
  ],
};
```

#### 3. Render with `<AutoForm />`
`<AutoForm />` dynamically compiles an in-memory Zod schema via `buildZodSchema(...)` and handles field state, real-time blur validation, and submission:

```tsx
'use client';
import { AutoForm } from 'contextual-ui';

export function ContactSection({ formsData }: { formsData: any }) {
  return (
    <AutoForm
      data={formsData}
      formId="contact-sales"
      onSuccess={(data) => console.log('Submitted successfully:', data)}
      className="max-w-xl mx-auto space-y-4"
    />
  );
}
```

> **Note:** If no custom `onSubmit` is provided, `<AutoForm />` automatically sends a JSON `POST` (or configured `method`) request to the form's `endpoint`.

#### 4. Customizing UI Slots (`AutoFormCustomComponents`)
Override default headless elements with your design system or Tailwind styles using the `components` prop:

```tsx
<AutoForm
  data={formsData}
  formId="contact-sales"
  components={{
    Field: ({ children, className }) => (
      <div className={`mb-4 ${className}`}>{children}</div>
    ),
    Label: ({ htmlFor, children }) => (
      <label htmlFor={htmlFor} className="block text-sm font-medium text-zinc-200 mb-1">
        {children}
      </label>
    ),
    Input: ({ dataInvalid, ...props }) => (
      <input
        {...props}
        className={`w-full px-3 py-2 bg-zinc-900 border rounded-lg text-sm ${
          dataInvalid ? 'border-red-500' : 'border-zinc-700 focus:border-blue-500'
        }`}
      />
    ),
    TextArea: ({ dataInvalid, ...props }) => (
      <textarea
        {...props}
        rows={4}
        className={`w-full px-3 py-2 bg-zinc-900 border rounded-lg text-sm ${
          dataInvalid ? 'border-red-500' : 'border-zinc-700 focus:border-blue-500'
        }`}
      />
    ),
    Select: ({ options, dataInvalid, children, ...props }) => (
      <select
        {...props}
        className={`w-full px-3 py-2 bg-zinc-900 border rounded-lg text-sm ${
          dataInvalid ? 'border-red-500' : 'border-zinc-700'
        }`}
      >
        {children}
      </select>
    ),
    Checkbox: ({ dataInvalid, ...props }) => (
      <input
        type="checkbox"
        {...props}
        className="h-4 w-4 rounded border-zinc-700 text-blue-600 focus:ring-blue-500"
      />
    ),
    ErrorMessage: ({ children }) => (
      <span className="text-xs text-red-400 mt-1 block">{children}</span>
    ),
    Submit: ({ isSubmitting, children, ...props }) => (
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg transition"
        {...props}
      >
        {isSubmitting ? 'Submitting...' : children}
      </button>
    ),
  }}
/>
```

#### `<AutoForm />` Props Reference

| Prop | Type | Description |
| :--- | :--- | :--- |
| `data` | `FormData` | Ingested forms data from connector/registry (single `FormEntity` or `FormEntity[]`). |
| `formId` | `string` | Unique ID of the target form to render when `data` contains multiple forms. |
| `form` | `FormEntity` | Explicit form entity definition (alternative to `data`). |
| `action` | `string` | Submission API endpoint override. |
| `method` | `'POST' \| 'GET' \| 'PUT' \| 'PATCH'` | HTTP method override (default: `'POST'`). |
| `onSubmit` | `(values, form) => void \| Promise<void>` | Custom submit handler. If omitted, performs a `fetch()` POST to `endpoint`. |
| `onError` | `(error: ZodError) => void` | Validation error callback triggered on failed submission. |
| `onSuccess` | `(result: any) => void` | Success callback triggered after successful submission. |
| `components` | `AutoFormCustomComponents` | Custom UI slot overrides (`Form`, `Field`, `Label`, `Input`, `TextArea`, `Select`, `Checkbox`, `ErrorMessage`, `Submit`, `Section`). |
| `submitLabel` | `string` | Submit button text override. |
| `title` | `React.ReactNode` | Form title override. |
| `description` | `React.ReactNode` | Form description override. |
| `className` | `string` | CSS class name applied to the form root element. |
| `children` | `React.ReactNode` | Optional child slot to insert additional elements before the submit button. |

---

### B. Static Form Factory (`createForm`)

When building developer-centric forms with static schemas, `createForm(schema)` produces strictly typed compound components tied directly to your Zod schema keys.

#### 1. Define Schema & Call `createForm`

```tsx
'use client';
import { createForm } from 'contextual-ui';
import { z } from 'zod';

export const ContactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  category: z.enum(['sales', 'support', 'billing']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const ContactForm = createForm(ContactSchema);
```

#### 2. Compose Headless Form UI

```tsx
'use client';
import { ContactForm } from './ContactForm';

export function ContactPage() {
  return (
    <ContactForm.Root
      onSubmit={async (data) => {
        // data is fully typed as z.infer<typeof ContactSchema>
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }}
      className="max-w-md mx-auto space-y-4"
    >
      <ContactForm.Section title="Contact Us" description="Fill out the form below.">
        {/* Full Name */}
        <ContactForm.Field name="fullName">
          <ContactForm.Label className="block text-sm font-medium mb-1">
            Full Name
          </ContactForm.Label>
          <ContactForm.Input
            placeholder="Jane Doe"
            className="w-full px-3 py-2 border rounded-md"
          />
          <ContactForm.ErrorMessage className="text-xs text-red-500 mt-1" />
        </ContactForm.Field>

        {/* Email */}
        <ContactForm.Field name="email">
          <ContactForm.Label className="block text-sm font-medium mb-1">
            Work Email
          </ContactForm.Label>
          <ContactForm.Input
            type="email"
            placeholder="jane@company.com"
            className="w-full px-3 py-2 border rounded-md"
          />
          <ContactForm.ErrorMessage className="text-xs text-red-500 mt-1" />
        </ContactForm.Field>

        {/* Message */}
        <ContactForm.Field name="message">
          <ContactForm.Label className="block text-sm font-medium mb-1">
            Message
          </ContactForm.Label>
          <ContactForm.TextArea
            rows={4}
            placeholder="How can we help?"
            className="w-full px-3 py-2 border rounded-md"
          />
          <ContactForm.ErrorMessage className="text-xs text-red-500 mt-1" />
        </ContactForm.Field>
      </ContactForm.Section>

      <ContactForm.Submit className="w-full py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
        Send Message
      </ContactForm.Submit>
    </ContactForm.Root>
  );
}
```

#### `createForm` Subcomponents Reference

| Component | Props | Description |
| :--- | :--- | :--- |
| `Form.Root` | `onSubmit`, `onError?`, `className?`, `id?`, `children` | Root `<form>` container that manages shared state, validation lifecycle, and async submit handling. |
| `Form.Section` | `title?`, `description?`, `asChild?`, `className?`, `style?`, `children` | Semantic grouping container that renders an optional header (title + description) and content area. |
| `Form.Field` | `name: keyof Schema`, `className?`, `children` | Scoped field context wrapper ensuring `Form.Label`, `Form.Input`, and `Form.ErrorMessage` are bound to the typed field. |
| `Form.Label` | `asChild?`, `className?`, `style?`, `children` | Accessible label element that automatically binds `htmlFor` to the parent field `name`. |
| `Form.Input` | `asChild?`, `...InputHTMLAttributes` | Controlled input element bound to field values, change handlers, blur validation, and `data-invalid`. |
| `Form.TextArea` | `asChild?`, `...TextareaHTMLAttributes` | Controlled textarea element bound to field values, change handlers, blur validation, and `data-invalid`. |
| `Form.Submit` | `asChild?`, `...ButtonHTMLAttributes` | Submit button automatically disabled during async `onSubmit` resolution (`data-contextual="form-submit"`). |
| `Form.ErrorMessage` | `asChild?`, `className?`, `style?` | Conditionally renders the first active validation error string for the scoped field. |

---

### C. Dynamic Zod Builders & Schema Utilities

Contextual UI exports helper utilities to build or inspect dynamic schemas programmatically:

```typescript
import {
  buildZodSchema,
  buildFieldZodSchema,
  generateFormJsonLd,
  exportFormAgentData,
  FormField,
} from 'contextual-ui';

// Build a single field validator
const singleField: FormField = {
  name: 'email',
  type: 'email',
  required: true,
};
const emailValidator = buildFieldZodSchema(singleField);

// Build an entire Zod object schema dynamically from field definitions
const fullSchema = buildZodSchema([
  { name: 'name', type: 'text', required: true, validation: { minLength: 2 } },
  { name: 'age', type: 'number', required: false, validation: { min: 18, max: 120 } },
]);

// Export PotentialAction JSON-LD
const jsonLdActions = generateFormJsonLd(formData);

// Export plain structured agent data for AI tools
const agentActions = exportFormAgentData(formData);
```

---

### D. Form TypeScript Types Reference

Contextual UI exports all TypeScript interfaces and Zod schemas for forms:

```typescript
import type {
  // Static Form Types
  FormRootProps,
  FormFieldProps,
  FormLabelProps,
  FormInputProps,
  FormTextAreaProps,
  FormSubmitProps,
  FormErrorMessageProps,
  FormSectionProps,
  FormContextValue,
  FormItemContextValue,

  // AutoForm Types
  AutoFormProps,
  AutoFormCustomComponents,
  AutoFormFieldProps,
  AutoFormLabelProps,
  AutoFormInputProps,
  AutoFormTextAreaProps,
  AutoFormSelectProps,
  AutoFormErrorMessageProps,
  AutoFormSubmitProps,
  AutoFormSectionProps,

  // Schema & Entity Types
  FormData,
  FormEntity,
  FormField,
  FormFieldOption,
  FormFieldValidation,
} from 'contextual-ui';

import {
  FormDataSchema,
  FormEntitySchema,
  FormFieldSchema,
  FormFieldOptionSchema,
  FormFieldValidationSchema,
} from 'contextual-ui';
```

#### Field Types & Validation Matrix

| Field Type (`FormField['type']`) | Supported Validation Rules (`FormFieldValidation`) | Rendered Default Element (`AutoForm`) |
| :--- | :--- | :--- |
| `'text'` | `minLength`, `maxLength`, `pattern`, `customErrorMessage` | `<input type="text" />` |
| `'email'` | `pattern`, `customErrorMessage` | `<input type="email" />` |
| `'textarea'` | `minLength`, `maxLength`, `pattern`, `customErrorMessage` | `<textarea />` |
| `'select'` | `options: Array<{ label, value } \| string>` | `<select>` with `<option>` items |
| `'number'` | `min`, `max`, `customErrorMessage` | `<input type="number" />` (with `z.coerce.number()`) |
| `'boolean'` | `customErrorMessage` (enforces `true` when required) | `<input type="checkbox" />` |
| `'tel'` | `minLength`, `maxLength`, `pattern`, `customErrorMessage` | `<input type="tel" />` |
| `'url'` | `pattern`, `customErrorMessage` | `<input type="url" />` |
| `'password'` | `minLength`, `maxLength`, `pattern`, `customErrorMessage` | `<input type="password" />` |

---

## 🛠️ Customization

Every UI component supports the `asChild` pattern via Radix UI, allowing you to use your own styled components or design systems (Tailwind CSS, Shadcn UI, etc.):

```tsx
<Form.Submit asChild>
  <button className="your-custom-tailwind-classes">
    Submit
  </button>
</Form.Submit>
```

---

## 📜 License

MIT © Tasuku Studio, Inc.
