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

### 2. Form Factory (`createForm`)
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
      <Form.Field name="email">
        <Form.Label>Email Address</Form.Label>
        <Form.Input className="input-style" />
        <Form.ErrorMessage className="error-style" />
      </Form.Field>

      <Form.Field name="message">
        <Form.Label>Message</Form.Label>
        <Form.TextArea className="input-style" />
        <Form.ErrorMessage />
      </Form.Field>

      <Form.Submit>Send Message</Form.Submit>
    </Form.Root>
  );
}
```

**Why use it?**
- **Type Safety**: The `name` prop on `Field` only accepts keys defined in your Zod schema.
- **Accessibility**: Automatically manages `aria-invalid`, `htmlFor`, and focus states.
- **Logic-less UI**: No need to manage `onChange` or `value` manually.

---

## 🤖 AI Agent Integration

Contextual UI components are designed to be "read" by AI. 

If you are building an AI-powered assistant that needs to know the content of your page, you can export the raw data structure without worrying about the React component tree:

```typescript
import { exportAgentData } from 'contextual-ui';

// In an API route or Server Action
const contextForAI = exportAgentData(faqData); 
// Returns clean [{ question, answer }] array
```

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
