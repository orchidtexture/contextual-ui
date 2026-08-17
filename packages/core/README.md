# @contextual-ui/core

**Contextual UI Core** is the foundational headless component library designed for the modern web—where your UI isn't just consumed by humans, but also by search engines and AI agents.

Built with **React**, **Zod**, and **Radix UI**, it provides the infrastructure to build accessible, type-safe, and SEO-optimized components with zero design opinion.

## 📦 Installation

```bash
npm install @contextual-ui/core zod
# or
pnpm add @contextual-ui/core zod
```

---

## 🧩 Components

### 1. FAQ (SEO & AI Optimized)
The FAQ component handles state, accessibility, and automatically injects `FAQPage` JSON-LD into your page for search engine indexing.

```tsx
import { Faq } from '@contextual-ui/core';

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
import { Navbar } from '@contextual-ui/core';

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
import { createForm } from '@contextual-ui/core';
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
