# Contextual UI Starter Kit

This is the official reference implementation for **Contextual UI**. It is a [Next.js](https://nextjs.org/) application that demonstrates how to integrate the entire Contextual UI ecosystem—including core components, data connectors, and the CMS dashboard—into a real-world project.

## 🚀 What's Included

This starter kit showcases the **Single Source of Truth (SSOT)** pattern:

- **Frontend UI**: Implementing headless `@contextual-ui/core` components (Navbar, Faq, Form Factory).
- **Data Connectors**: Using `@contextual-ui/connector-static` to bind schemas to static data sources.
- **AI/Agent API**: Exposing your structured data as clean, agent-readable JSON via Next.js Route Handlers.
- **CMS Dashboard**: Rendering the `@contextual-ui/dashboard` to inspect raw data, validate JSON-LD, and interact with form sandboxes.

## 🛠️ Getting Started

Since this is part of the Contextual UI monorepo, you can run it using `pnpm` from the root, or navigate directly to the app.

### Running the App

```bash
# From the root of the monorepo:
pnpm --filter starter-kit dev

# OR from inside the apps/starter-kit directory:
cd apps/starter-kit
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```text
apps/starter-kit/
├── app/
│   ├── api/contextual/    # 🤖 Exposes the SSOT to AI agents & crawlers
│   ├── cms/               # 📊 The Contextual CMS Dashboard route
│   └── page.tsx           # 🌐 The main public-facing webpage
├── components/            # 🧩 React components wrapping Contextual UI
└── data/
    ├── site.schema.ts     # 📐 Shared Zod schemas for the site structure
    └── site.server.ts     # 🔌 Server-only data connector binding
```

## 🧠 How it Works

### 1. The Schema (`data/site.schema.ts`)
We define the structure of our data using Zod. This file is isomorphic (safe for both client and server).

### 2. The Connector (`data/site.server.ts`)
We bind the schema to our actual data source (in this case, static dictionaries) using a server-only connector.

### 3. The API (`app/api/contextual/route.ts`)
We pass the bound connector into a Next.js App Router route handler. This creates an endpoint that AI agents and search engines can consume natively.

### 4. The CMS (`app/cms/page.tsx`)
We fetch the data via the connector on the server and pass it down to the `@contextual-ui/dashboard` client component, successfully hydrating the schema into a fully interactive internal tool.

## 📚 Learn More

To learn more about the tools powering this starter kit, check out the package documentation:
- [@contextual-ui/core](../../packages/core/README.md)
- [@contextual-ui/dashboard](../../packages/dashboard/README.md)
- [@contextual-ui/connector-static](../../connectors/static/README.md)
