# Plan: Sitemap and Robots.txt Generation in Contextual UI

## 1. Executive Summary
This document outlines the architecture and implementation plan for adding automated **Sitemap (`sitemap.xml`)** and **Robots (`robots.txt`)** generation to Contextual UI.

Because Contextual UI connectors already store structured site metadata—specifically `website` and `webpage` entities with paths, titles, and descriptions—the library can derive canonical sitemaps and search/AI crawler policies with zero boilerplate.

### Architecture Principle: Server Layer vs. Component Layer
- **`<ContextualSite />` (Component Layer):** Remains a React UI provider (`'use client'`) responsible for DOM attributes, child context distribution, and inline JSON-LD `<script>` injection. Web crawlers do not inspect HTML DOM trees for sitemaps and robots files; they make direct HTTP requests for root assets (`/sitemap.xml` and `/robots.txt`).
- **`createContextualApp` (Server Layer):** Serves as the home for sitemap and robots generation. It mirrors existing server APIs (`getMetadata()`, `getGraph()`, `createGraphHandler()`) by providing:
  1. Native typed objects for Next.js App Router conventions (`app/sitemap.ts`, `app/robots.ts`).
  2. Standard Web `Response` route handlers (`createSitemapHandler()`, `createRobotsHandler()`) for Remix, Next.js Route Handlers, Astro, and TanStack Start.
  3. Raw XML/plain-text string formatters (`generateSitemapXml()`, `generateRobotsTxt()`) for Pages Router and build scripts/SPAs.

---

## 2. Goals & Key Features

1. **Connector Route Discovery:** Automatically extract route entries from connector data (`webpage` list or single `webpage`), falling back to `website.url`.
2. **Framework Agnostic:** Deliver formatters for:
   - Next.js App Router (`MetadataRoute.Sitemap`, `MetadataRoute.Robots`).
   - Standard Web API `Request` / `Response` (Remix, Next.js Route Handlers, Astro, TanStack).
   - Plain string outputs (Next.js Pages Router `getServerSideProps`, SSG / Vite build scripts).
3. **Route Filtering & Custom Additions:**
   - Exclude paths via glob or path prefixes (e.g. `/cms*`, `/studio*`, `/api*`, `noindex`).
   - Include external/dynamic routes not managed by the connector.
   - Configure custom priorities, `changeFrequency`, and `lastModified`.
4. **Agentic AI & Crawler Control:**
   - Dedicated presets in `robots.txt` for controlling AI crawlers (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Bytespider`, `CCBot`).
   - Auto-link the canonical sitemap and optional `/llms.txt` in `robots.txt`.

---

## 3. API & Type Design

### 3.1 Sitemap Types (`packages/core/src/server/sitemap/sitemap.types.ts`)

```typescript
export type SitemapChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

export interface SitemapItem {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: SitemapChangeFrequency;
  priority?: number;
  alternateRefs?: Array<{
    href: string;
    hreflang: string;
  }>;
}

export interface SitemapOptions {
  /** Base URL of the website. Defaults to options.baseUrl or data.website.url */
  baseUrl?: string;
  /** Paths or route patterns to exclude (e.g. ['/cms', '/cms/*', '/admin', '/studio']) */
  exclude?: string[];
  /** Additional static or dynamic routes to append */
  additionalRoutes?: SitemapItem[];
  /** Default priority for pages if unspecified (default: 0.8; root page defaults to 1.0) */
  defaultPriority?: number;
  /** Default changeFrequency if unspecified (default: 'weekly'; root defaults to 'daily') */
  defaultChangeFrequency?: SitemapChangeFrequency;
  /** Default lastModified date (defaults to current date) */
  defaultLastModified?: Date;
  /** Filter callback for granular page inclusion */
  filter?: (page: any) => boolean;
}

export interface SitemapRouteHandlerOptions extends SitemapOptions {
  headers?: Record<string, string>;
  cacheControl?: string;
}
```

### 3.2 Robots Types (`packages/core/src/server/robots/robots.types.ts`)

```typescript
export interface RobotsRule {
  userAgent?: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
}

export type AiBotPolicy = 'allow' | 'disallow' | 'inherit';

export interface RobotsAiOptions {
  /** Policy applied to standard AI agents (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot) */
  defaultAiPolicy?: AiBotPolicy;
  /** Specific overrides per bot */
  bots?: {
    GPTBot?: AiBotPolicy;
    ClaudeBot?: AiBotPolicy;
    PerplexityBot?: AiBotPolicy;
    'Google-Extended'?: AiBotPolicy;
    CCBot?: AiBotPolicy;
    Bytespider?: AiBotPolicy;
    [customBot: string]: AiBotPolicy | undefined;
  };
}

export interface RobotsOptions {
  /** Base URL for sitemap reference */
  baseUrl?: string;
  /** Custom rules */
  rules?: RobotsRule | RobotsRule[];
  /** Default disallow paths (e.g. ['/cms', '/api']) */
  disallow?: string[];
  /** Auto-reference the sitemap. Set false to disable */
  sitemap?: string | string[] | boolean;
  /** Host directive */
  host?: string;
  /** Preset AI agent bot rules */
  ai?: RobotsAiOptions;
}

export interface RobotsRouteHandlerOptions extends RobotsOptions {
  headers?: Record<string, string>;
  cacheControl?: string;
}

export interface NextRobotsResult {
  rules: RobotsRule | RobotsRule[];
  sitemap?: string | string[];
  host?: string;
}
```

### 3.3 Methods Added to `createContextualApp`

```typescript
export interface ContextualAppInstance<TSchema, TConnector> {
  // Existing methods
  fetchData(): Promise<InferData<TSchema>>;
  getGraph(options?: GetGraphOptions<TSchema>): Promise<JsonLdGraphResult>;
  createGraphHandler(options?: GetGraphOptions<TSchema>): { GET: (req: Request) => Promise<Response> };
  getMetadata(pageIdOrOptions?: string | GetMetadataOptions<TSchema>, overrides?: Partial<Metadata>): Promise<Metadata>;

  // New Sitemap Methods
  getSitemap(options?: SitemapOptions): Promise<SitemapItem[]>;
  generateSitemapXml(options?: SitemapOptions): Promise<string>;
  createSitemapHandler(options?: SitemapRouteHandlerOptions): { GET: (req: Request) => Promise<Response> };

  // New Robots Methods
  getRobots(options?: RobotsOptions): Promise<NextRobotsResult>;
  generateRobotsTxt(options?: RobotsOptions): Promise<string>;
  createRobotsHandler(options?: RobotsRouteHandlerOptions): { GET: (req: Request) => Promise<Response> };
}
```

---

## 4. Implementation Steps

### Phase 1: Pure Utility Modules in Core
- [x] Create `packages/core/src/server/sitemap/sitemap.types.ts`
- [x] Create `packages/core/src/server/sitemap/sitemap.utils.ts`
  - `extractWebpages(data)`: normalizes single or array `webpage` / `webpages`.
  - `buildSitemapItems(webpages, options)`: filters excluded paths, applies default priorities and frequencies, canonicalizes URLs.
  - `generateSitemapXml(items)`: renders compliant XML `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`.
- [x] Create `packages/core/src/server/sitemap/index.ts`
- [x] Create `packages/core/src/server/robots/robots.types.ts`
- [x] Create `packages/core/src/server/robots/robots.utils.ts`
  - `buildRobotsData(options)`: compiles user rules, AI crawler presets, and sitemap directives.
  - `generateRobotsTxt(robotsData)`: renders RFC-compliant plain text.
- [x] Create `packages/core/src/server/robots/index.ts`

### Phase 2: Server Route Handlers
- [x] Create `packages/core/src/server/sitemap/createSitemapRouteHandler.ts`
  - Returns `{ GET: (req: Request) => Response }` with `Content-Type: application/xml`.
- [x] Create `packages/core/src/server/robots/createRobotsRouteHandler.ts`
  - Returns `{ GET: (req: Request) => Response }` with `Content-Type: text/plain`.

### Phase 3: Wire into `createContextualApp`
- [ ] Update `packages/core/src/server/createContextualApp.ts`:
  - Implement `getSitemap(options)`
  - Implement `generateSitemapXml(options)`
  - Implement `createSitemapHandler(options)`
  - Implement `getRobots(options)`
  - Implement `generateRobotsTxt(options)`
  - Implement `createRobotsHandler(options)`
- [ ] Export new types and functions in `packages/core/src/server/index.ts` and `packages/core/src/index.ts`.

### Phase 4: Unit Tests
- [ ] Add `packages/core/src/server/sitemap/sitemap.test.ts`:
  - Empty webpage list vs populated webpage list.
  - URL canonicalization with trailing slash normalization.
  - Path exclusion rules (exact match and prefix/wildcard).
  - XML formatting and escaping.
- [ ] Add `packages/core/src/server/robots/robots.test.ts`:
  - Basic allow/disallow generation.
  - AI bot preset rules (`GPTBot`, `ClaudeBot`, etc.).
  - Plain-text output format verification.
- [ ] Add integration tests in `packages/core/src/server/createContextualApp.test.ts`.

### Phase 5: Starter Kit Adoption
- [ ] Refactor `apps/starter-kit/app/sitemap.ts` to use `siteApp.getSitemap({ exclude: ['/cms', '/cms/*'] })`.
- [ ] Refactor `apps/starter-kit/app/robots.ts` to use `siteApp.getRobots({ disallow: ['/cms', '/cms/'] })`.
- [ ] Verify local build and test endpoint output in `apps/starter-kit`.

---

## 5. Framework Usage Examples

### Next.js App Router (Recommended)

```typescript
// app/sitemap.ts
import { siteApp } from '@/data/site.server';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return siteApp.getSitemap({
    exclude: ['/cms', '/cms/*', '/studio*'],
  });
}
```

```typescript
// app/robots.ts
import { siteApp } from '@/data/site.server';
import type { MetadataRoute } from 'next';

export default async function robots(): Promise<MetadataRoute.Robots> {
  return siteApp.getRobots({
    disallow: ['/cms', '/studio'],
    ai: {
      defaultAiPolicy: 'allow',
    },
  });
}
```

### Remix / React Router v7

```typescript
// app/routes/sitemap[.]xml.ts
import { siteApp } from '~/data/site.server';
import type { LoaderFunctionArgs } from '@remix-run/node';

export const loader = ({ request }: LoaderFunctionArgs) => {
  return siteApp.createSitemapHandler().GET(request);
};
```

```typescript
// app/routes/robots[.]txt.ts
import { siteApp } from '~/data/site.server';
import type { LoaderFunctionArgs } from '@remix-run/node';

export const loader = ({ request }: LoaderFunctionArgs) => {
  return siteApp.createRobotsHandler().GET(request);
};
```

### Next.js Pages Router

```typescript
// pages/sitemap.xml.ts
import type { GetServerSideProps } from 'next';
import { siteApp } from '@/data/site.server';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const xml = await siteApp.generateSitemapXml({
    exclude: ['/cms', '/cms/*'],
  });

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
```

---

## 6. Verification Plan

1. **Build & Typecheck:** Run `pnpm build` across the monorepo to verify that core exports and types compile without errors.
2. **Automated Tests:** Execute `pnpm test` in `packages/core` ensuring all sitemap and robots unit tests pass.
3. **Starter Kit Verification:** Run `pnpm --filter starter-kit build` and verify that `GET /sitemap.xml` and `GET /robots.txt` respond with valid XML and plain-text output.
