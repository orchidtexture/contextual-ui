# Contextual UI

**Contextual UI** is a headless component library designed for the modern web—where your UI isn't just consumed by humans, but also by search engines and AI agents.

Built with **React**, **Zod**, and **Radix UI**, it provides the infrastructure to build accessible, type-safe, and SEO-optimized components with zero design opinion.

## 🚀 Key Features

- **🤖 Agentic AI Ready**: Built-in methods to export clean, structured data for LLM context windows.
- **🔍 Schema.org SEO**: Automatically generates and injects JSON-LD for components like FAQs.
- **🏗️ Form Factory**: A type-safe engine to create complex forms from Zod schemas with zero boilerplate.
- **⚛️ Headless & Flexible**: Uses `@radix-ui/react-slot` (asChild) for complete styling freedom.
- **🛡️ Type Safe**: Deep TypeScript integration with Zod for end-to-end validation.

---

## 🧠 The Philosophy: Websites as a Single Source of Truth (SSOT)

Historically, websites were treated merely as digital pamphlets—a blank canvas to visually communicate information to a single consumer: the human eye. But in the **Agentic Era**, the role of a website has fundamentally shifted. It is no longer just a marketing surface; it is a central "operations hub" that bridges marketing, customer interaction, operations, and brand narrative.

By treating the website as a **Single Source of Truth (SSOT)** for an organization, we can eliminate information silos and manual data capture. However, this introduces a major challenge: *How do you maintain the visual flexibility of a custom UI for human consumption, while enforcing the strict data structures required by machines to act as a reliable Knowledge Base?*

This is why implementing **Contextual UI components** is crucial. They create a hybrid system that fluently serves the expanding ecosystem of the modern web:

- **🤖 AI Agents & LLMs**: Autonomous agents struggle to extract semantic meaning from complex, chaotic DOM structures. Contextual components separate structured data from presentation, seamlessly turning your website into a dynamic knowledge base that can feed AI agents across your entire business operations.
- **🔍 Search Engines**: SEO requires more than basic meta tags. Crawlers demand rich, structured data (like Schema.org JSON-LD) to truly understand your page and rank it. Contextual components automatically synchronize your visual UI with this machine-readable metadata behind the scenes.
- **🧑‍💻 Humans & Accessibility**: Meaningful context is essential for accessibility. Structuring components contextually ensures that assistive technologies receive automatic ARIA states and logical DOM structures, while the headless nature allows for total design freedom.
- **🏗️ Developer Experience**: When your UI is driven by schemas (like Zod) and well-defined data models, the flow between your backend data, AI knowledge base, and frontend presentation becomes completely predictable and type-safe.

In short, Contextual UI transforms your application from a simple visual pamphlet into an enterprise-grade ecosystem that speaks natively to humans, search engines, and AI agents simultaneously—from a single source of truth.

---

## 📦 Installation

```bash
npm install contextual-ui zod
# or
pnpm add contextual-ui zod
```

---

## 🧩 Components

### 1. FAQ (SEO & AI Optimized)
The FAQ component handles state, accessibility, and automatically injects `FAQPage` JSON-LD into your page for search engine indexing.

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

**Why use it?**
- **SEO**: It automatically renders a JSON-LD `<script>` tag, ensuring search engines like Google can index your FAQ content with rich results.
- **AI**: Use `exportAgentData(data)` to provide clean text to an LLM without HTML noise.

---

### 2. Navbar (Mobile Responsive & Data-Driven)
The Navbar component provides a robust structure for site navigation, handling mobile toggles and accessible state out of the box.

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
      <Navbar.Brand className="font-bold text-xl" />
      
      {/* Desktop Navigation */}
      <Navbar.Content className="hidden md:flex gap-4">
        {navData.links.map(link => (
          <a key={link.id} href={link.href}>{link.label}</a>
        ))}
      </Navbar.Content>

      {/* Mobile Toggle */}
      <Navbar.Toggle className="md:hidden" />

      {/* Mobile Navigation */}
      <Navbar.Menu className="md:hidden flex flex-col mt-4">
        {navData.links.map(link => (
          <a key={link.id} href={link.href} className="py-2">{link.label}</a>
        ))}
      </Navbar.Menu>
    </Navbar.Root>
  );
}
```

**Why use it?**
- **Responsive State**: Built-in state for mobile menu toggles without `useState` boilerplate.
- **Compositional Pattern**: Freedom to structure desktop and mobile menus exactly how you want.
- **Data Validation**: Optional Zod schema validation for nested navigation links.

---

### 3. Form Factory (`createForm`)
Stop writing `useState` and manual validation for every form. Define a schema, and let the factory build the components.

```tsx
'use client';
import { createForm } from 'contextual-ui';
import { z } from 'zod';

// 1. Define your schema
const ContactSchema = z.object({
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message too short"),
});

// 2. Create your typed components
const Form = createForm(ContactSchema);

export default function ContactSection() {
  return (
    <Form.Root onSubmit={(data) => console.log(data)}>
      <Form.Section 
        title="Personal Information" 
        description="We'll never share your email."
        className="space-y-4 mb-6"
      >
        <Form.Field name="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Input className="input-style" />
          <Form.ErrorMessage className="error-style" />
        </Form.Field>
      </Form.Section>

      <Form.Section 
        title="Your Message"
        className="space-y-4 mb-6"
      >
        <Form.Field name="message">
          <Form.Label>Message</Form.Label>
          <Form.TextArea className="input-style" />
          <Form.ErrorMessage />
        </Form.Field>
      </Form.Section>

      <Form.Submit>Send Message</Form.Submit>
    </Form.Root>
  );
}
```

**Why use it?**
- **Type Safety**: The `name` prop on `Field` only accepts keys defined in your Zod schema.
- **Section Grouping**: Organize complex forms cleanly with built-in `Form.Section` headers and descriptions.
- **Accessibility**: Automatically manages `aria-invalid`, `htmlFor`, and focus states.
- **Logic-less UI**: No need to manage `onChange` or `value` manually.

---

## 🤖 AI Agent Integration & The SSOT Registry

Contextual UI components are designed to be "read" by AI. To enforce the Single Source of Truth (SSOT) pattern, Contextual UI provides a unified Data Registry system.

### 1. Define your Context
Combine your site data and validate it using the library's Zod schemas. This centralizes your data for both UI rendering and AI consumption.

```typescript
// data/context.ts
import { 
  defineContext, 
  FaqDataSchema, 
  exportAgentData as exportFaqAgentData,
  NavbarDataSchema,
  exportNavbarAgentData
} from 'contextual-ui';

import { faqData } from './faq';
import { navbarData } from './navbar';

export const siteContext = defineContext({
  faq: {
    schema: FaqDataSchema,
    data: faqData,
    exportAgentData: exportFaqAgentData,
  },
  navbar: {
    schema: NavbarDataSchema,
    data: navbarData,
    exportAgentData: exportNavbarAgentData,
  }
});
```

### 2. Expose the Agent API
Instead of building custom endpoints, use our framework-agnostic route handlers to instantly expose your entire SSOT to AI agents and web crawlers.

**Next.js App Router (`app/contextual/api/route.ts`):**
```typescript
import { createRouteHandler } from 'contextual-ui/server';
import { siteContext } from '@/data/context';

export const { GET } = createRouteHandler(siteContext);
```

**Next.js Pages Router (`pages/api/contextual.ts`):**
```typescript
import { createPagesRouteHandler } from 'contextual-ui/server';
import { siteContext } from '@/data/context';

export default createPagesRouteHandler(siteContext);
```
*(When accessed, this endpoint returns heavily optimized, validated JSON for LLM context windows).*

---

## 📊 The CMS Dashboard

Contextual UI includes a built-in, beautifully styled, and responsive CMS Dashboard. It reads your `siteContext` and uses Zod schemas to automatically generate a visual, read-only interface for human operators to inspect the Knowledge Base.

```tsx
// app/contextual/cms/page.tsx
import { ContextualDashboard } from 'contextual-ui/dashboard';
import { siteContext } from '@/data/context';

export default function CMSPage() {
  return (
    <ContextualDashboard 
      context={siteContext} 
      title="Company Knowledge Base" 
    />
  );
}
```
*Note: The dashboard uses scoped inline styles, guaranteeing it will never conflict with your app's global CSS or Tailwind resets.*

---

## 🛠️ Customization

Every component supports the `asChild` pattern via Radix UI. This means you can use your own styled components or any UI library (Tailwind, Shadcn, etc.):

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
