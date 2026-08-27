# 🕸️ Schema.org Graph Architecture Fixes Plan

This document outlines the critical flaws, semantic inconsistencies, and concrete implementation steps required to perfect the Contextual UI JSON-LD graph generation.

---

## 📋 Progress Checklist

- [x] **Step 1**: Fix URL Canonicalization in `jsonld-graph-builder` (`canonicalize.ts` & `flatten.ts`)
- [ ] **Step 2**: Introduce `Organization` Component in `packages/core` (`schema`, `utils`, `registry`)
- [ ] **Step 3**: Fix `WPFooter` Semantics & Deduplication in `packages/core/src/components/footer`
- [ ] **Step 4**: Unify `SiteNavigationElement` Types in `packages/core/src/components/navbar`
- [ ] **Step 5**: Fix `WebSite` and `FAQPage` Linkages in `packages/core`
- [ ] **Step 6**: Update Starter Kit Data & Verification in `apps/starter-kit`

---

## 1. The Critical Flaws & Inconsistencies

### 🔴 1. Duplicate References in `WPFooter.hasPart`
* **Issue**: The `hasPart` array of `WPFooter` (`#footer`) contains duplicate `@id` references for the same navigation items.
* **Root Cause**: In `footer.utils.ts`, the `allLinks` variable blindly concatenates `[...columnLinks, ...flatLinks, ...legalLinks]`. If the source data (e.g., `site.server.ts`) includes the same links in `columns` and top-level `links`, they get duplicated. Furthermore, they lack section-scoped IDs (e.g., `footer-nav:resources-1` vs `footer-nav:1`).

### 🔴 2. Relative URLs Violate Schema.org Standards
* **Issue**: Multiple nodes output relative URLs (e.g., `"url": "/docs"`).
* **Root Cause**: The `jsonld-graph-builder` package currently only canonicalizes the `@id` field. In Schema.org / JSON-LD, standard URI fields like `url`, `item`, `logo`, `image`, and `sameAs` **must be absolute, canonical URIs** (e.g., `https://example.com/docs`). Relative URLs trigger warnings in Google's Rich Results Test and fail IRI resolution in RDF parsers.

### 🔴 3. `sameAs` Attached to `WPFooter` (Semantic Modeling Error)
* **Issue**: Social media links (GitHub, Twitter) are attached to the `WPFooter` entity via `sameAs`.
* **Root Cause**: In Schema.org, `sameAs` defines entity co-reference (i.e. *"this entity is identical to the entity at this URI"*). Attaching it to `WPFooter` asserts that the **HTML footer element itself** is a GitHub repository. Social profiles semantically belong to an **`Organization`** or **`Person`**.

### 🟡 4. Inconsistent Navigation Item Types
* **Issue**: Navbar items are generated with `@type: "WebPage"`, while Footer items are generated with `@type: "SiteNavigationElement"`.
* **Fix**: Site navigation links should be consistent. Following Google's specification for sitelinks, both should use `SiteNavigationElement`.

### 🟡 5. Anonymous Blank Node for `copyrightHolder` / `Organization`
* **Issue**: The footer outputs `"copyrightHolder": { "@type": "Organization", "name": "Tasuku Studio" }` without an `@id`.
* **Fix**: This creates an anonymous blank node. It should be a dedicated entity node (`https://example.com/#organization`) that is centrally referenced by both `WebSite.publisher` and `WPFooter.copyrightHolder`.

### 🟡 6. Asymmetrical `WebSite.hasPart`
* **Issue**: `WPFooter` declares `isPartOf: #website`, but `WebSite` does not declare `#footer` in its `hasPart` array.
* **Fix**: Parent-child bidirectional references should be complete and symmetrical. `WebSite` must explicitly list `#footer`.

### 🟡 7. Missing `url` on `FAQPage`
* **Issue**: The `FAQPage` entity is missing its canonical `"url"` property, which is highly recommended for page-level entities.

---

## 2. Ideal Graph Benchmark

The goal is to output a fully canonicalized, referentially-sound Schema.org JSON-LD graph that looks exactly like this:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      "name": "Tasuku Studio",
      "url": "https://tasuku.io",
      "logo": "https://example.com/images/onigiri_logo.svg",
      "sameAs": [
        "https://github.com/orchidtexture",
        "https://twitter.com/orchidtexture"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://example.com/#website",
      "name": "Contextual UI Starter Kit",
      "url": "https://example.com",
      "description": "A headless UI and semantic SEO Knowledge Graph starter kit.",
      "publisher": { "@id": "https://example.com/#organization" },
      "hasPart": [
        { "@id": "https://example.com/#navbar" },
        { "@id": "https://example.com/#faq" },
        { "@id": "https://example.com/#footer" }
      ]
    },
    {
      "@type": "SiteNavigationElement",
      "@id": "https://example.com/#navbar",
      "name": "Contextual",
      "url": "https://example.com/",
      "isPartOf": { "@id": "https://example.com/#website" },
      "hasPart": [
        { "@id": "https://example.com/#nav:1" },
        { "@id": "https://example.com/#nav:2" },
        { "@id": "https://example.com/#nav:3" }
      ]
    },
    {
      "@type": "SiteNavigationElement",
      "@id": "https://example.com/#nav:1",
      "name": "Home",
      "url": "https://example.com/"
    },
    {
      "@type": "SiteNavigationElement",
      "@id": "https://example.com/#nav:2",
      "name": "Docs",
      "url": "https://example.com/docs"
    },
    {
      "@type": "SiteNavigationElement",
      "@id": "https://example.com/#nav:3",
      "name": "Schema Graph",
      "url": "https://example.com/schema"
    },
    {
      "@type": "FAQPage",
      "@id": "https://example.com/#faq",
      "url": "https://example.com",
      "isPartOf": { "@id": "https://example.com/#website" },
      "mainEntity": [
        { "@id": "https://example.com/#faq-q:1" },
        { "@id": "https://example.com/#faq-q:2" },
        { "@id": "https://example.com/#faq-q:3" },
        { "@id": "https://example.com/#faq-q:4" }
      ]
    },
    {
      "@type": "Question",
      "@id": "https://example.com/#faq-q:1",
      "name": "What is Contextual UI Starter Kit?",
      "acceptedAnswer": { "@id": "https://example.com/#faq-a:1" }
    },
    {
      "@type": "Answer",
      "@id": "https://example.com/#faq-a:1",
      "text": "An open-source starter for SSOT apps."
    },
    {
      "@type": "WPFooter",
      "@id": "https://example.com/#footer",
      "name": "Contextual",
      "description": "Headless UI components with built-in Agentic AI infrastructure and Schema.org SEO.",
      "url": "https://example.com/",
      "isPartOf": { "@id": "https://example.com/#website" },
      "copyrightHolder": { "@id": "https://example.com/#organization" },
      "copyrightYear": 2026,
      "hasPart": [
        { "@id": "https://example.com/#footer-nav:resources-1" },
        { "@id": "https://example.com/#footer-nav:resources-2" },
        { "@id": "https://example.com/#footer-nav:resources-3" },
        { "@id": "https://example.com/#footer-nav:community-4" },
        { "@id": "https://example.com/#footer-nav:legal-l1" },
        { "@id": "https://example.com/#footer-nav:legal-l2" }
      ]
    },
    {
      "@type": "SiteNavigationElement",
      "@id": "https://example.com/#footer-nav:resources-1",
      "name": "Docs",
      "url": "https://example.com/docs"
    },
    {
      "@type": "SiteNavigationElement",
      "@id": "https://example.com/#footer-nav:resources-2",
      "name": "Schema Graph",
      "url": "https://example.com/schema"
    },
    {
      "@type": "SiteNavigationElement",
      "@id": "https://example.com/#footer-nav:resources-3",
      "name": "/api/graph.json ↗",
      "url": "https://example.com/api/graph.json"
    },
    {
      "@type": "SiteNavigationElement",
      "@id": "https://example.com/#footer-nav:community-4",
      "name": "Tasuku Studio",
      "url": "https://tasuku.io"
    },
    {
      "@type": "SiteNavigationElement",
      "@id": "https://example.com/#footer-nav:legal-l1",
      "name": "Privacy Policy",
      "url": "https://example.com/privacy"
    },
    {
      "@type": "SiteNavigationElement",
      "@id": "https://example.com/#footer-nav:legal-l2",
      "name": "Terms of Service",
      "url": "https://example.com/terms"
    }
  ]
}
```

---

## 3. Implementation Steps Detail

### Step 1: Fix URL Canonicalization (`jsonld-graph-builder`)
* Update `packages/jsonld-graph-builder/src/canonicalize.ts` and `flatten.ts` to map through standard URL properties (`url`, `item`, `target`, `logo`, `image`) and resolve relative paths (`/docs`, `/`) against `baseUrl` into fully-qualified absolute URLs.
* Ensure tests in `jsonld-graph-builder` pass with canonicalized URLs.

### Step 2: Introduce an `Organization` Component
* Create `packages/core/src/components/organization/` with `organization.schema.ts` and `organization.utils.ts`.
* Move social links, main logo, and publisher data definitions into this schema.
* Generate an `#organization` JSON-LD entity.
* Export from `packages/core/src/index.ts` and `packages/core/src/server/index.ts`.

### Step 3: Fix `WPFooter` Semantic Issues (`packages/core/src/components/footer`)
* Update `footer.utils.ts` to deduplicate links effectively.
* Scope IDs by section (e.g., `footer-nav:resources-1`, `footer-nav:legal-1`) to avoid collisions.
* Remove `sameAs` generation from the footer (delegate to the Organization component).
* Reference the `Organization` component for the `copyrightHolder` (`refer('organization')`).

### Step 4: Fix `SiteNavigationElement` Types (`packages/core/src/components/navbar`)
* Update `navbar.utils.ts` to map children using `@type: 'SiteNavigationElement'` instead of `'WebPage'`.

### Step 5: Fix `WebSite` and `FAQPage` Linkages (`packages/core`)
* Update `website.utils.ts`: Ensure `#footer` is added to the default `hasPart` list. Add a `publisher` link to the `#organization` entity.
* Update `faq.utils.ts`: Emit the `url` property pointing back to the canonical page context (passing `baseUrl` if necessary or canonicalizing `/`).

### Step 6: Update `apps/starter-kit` Data definitions & Verify
* Update `apps/starter-kit/data/site.schema.ts` to include the new `Organization` registry.
* Clean up duplicate link arrays in `apps/starter-kit/data/site.server.ts` (e.g. relying entirely on `columns` for the footer structure).
* Adjust `apps/starter-kit/components/hero-flow/flowData.ts` to reflect the updated schema and accurate JSON-LD syntax.
* Run end-to-end checks to verify the produced graph matches the benchmark.
