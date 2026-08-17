# Contextual UI

[![npm version](https://img.shields.io/npm/v/@contextual-ui/core.svg?style=flat-square)](https://www.npmjs.com/package/@contextual-ui/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

**Contextual UI** is a headless component library designed for the modern web—where your UI isn't just consumed by humans, but also by search engines and AI agents.

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

## 📦 Monorepo Ecosystem

Contextual UI is built as an open-core monorepo. Here is how the packages are organized:

### Packages (`packages/`)
- [`@contextual-ui/core`](./packages/core/README.md) — The core headless React components and Zod schemas (Faq, Navbar, Form Factory, etc.).
- [`@contextual-ui/dashboard`](./packages/dashboard) — UI components for building internal CMS and Dashboards.

### Connectors (`connectors/`)
- [`@contextual-ui/connector-static`](./connectors/static) — Plugin for static data sourcing.

### Apps (`apps/`)
- [`starter-kit`](./apps/starter-kit) — A reference Next.js implementation showcasing the ecosystem in action.

---

## 🚀 Quick Start

Get started with the core component library in your React/Next.js project.

```bash
npm install @contextual-ui/core zod
# or
pnpm add @contextual-ui/core zod
```

### Example: SEO & AI Optimized FAQ

Contextual UI components are headless, type-safe, and automatically handle structural metadata.

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

For more examples (Navbar, Forms, CMS Integration), see the [`@contextual-ui/core` documentation](./packages/core/README.md).

---

## ✨ Key Features

- **🏗️ Form Factory**: A type-safe engine to create complex forms from Zod schemas with zero boilerplate.
- **⚛️ Headless & Flexible**: Uses `@radix-ui/react-slot` (`asChild`) for complete styling freedom.
- **🛡️ End-to-End Type Safety**: Deep TypeScript integration with Zod for end-to-end validation.
- **🔍 Schema-Driven Metadata**: Automated structured data syncing (JSON-LD) and Agentic context exports.

---

## 🛠️ Contributing Guide

We welcome contributions! To get started developing locally in this monorepo:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (v9+)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/contextual-ui.git
cd contextual-ui

# 2. Install dependencies
pnpm install

# 3. Build the core packages
pnpm build

# 4. Start development mode
pnpm dev
```

Check out the [Architecture Refactor Plan](./ARCHITECTURE_REFACTOR_PLAN.md) to understand how the core is decoupled from data connectors and dashboard components.

---

## 📄 License & Community

- **Community**: Join the discussion on GitHub Discussions or open an Issue.
- **License**: MIT © Tasuku Studio, Inc.
