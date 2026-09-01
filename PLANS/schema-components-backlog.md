# Contextual UI - Schema-Aware Components Backlog

This document tracks the planned schema-aware headless components to be added to the Contextual UI library. These components will enhance both SEO (Rich Snippets) and AI Agent consumption (Knowledge Graph depth) by mapping UI patterns directly to Schema.org entities.

## Content & Publishing
- [ ] **`Article` / `BlogPosting`**
  - **Sub-components:** `Article.Root`, `Article.Header`, `Article.Author`, `Article.Content`, `Article.PublishDate`
  - **Value:** Blogs are the primary driver of organic traffic. Automatically generating `BlogPosting` schema linked to a `Person` (author) and `Organization` (publisher) is massive for E-E-A-T.
- [ ] **`HowTo` / `Process`**
  - **Sub-components:** `HowTo.Root`, `HowTo.Step`, `HowTo.Direction`
  - **Value:** Perfect for documentation sites, starter kits, or recipes. `HowTo` schema reliably generates highly visible step-by-step rich snippets in Google Search.

## E-commerce & SaaS Conversions
- [ ] **`Product` & `Offer`**
  - **Sub-components:** `Product.Root`, `Product.Price`, `Product.Image`, `Product.Description`
  - **Value:** Crucial for SaaS pricing pages or e-commerce. Automatically emits `Product` and `Offer` schemas, enabling rich product results (price, availability) in search.
- [ ] **`Review` / `Testimonial`**
  - **Sub-components:** `Review.Root`, `Review.Rating`, `Review.Author`, `Review.Body`
  - **Value:** Almost every marketing site has a testimonial section. Emitting `Review` and `AggregateRating` schema provides star ratings in search results, significantly boosting click-through rates.

## Entities & Relationships
- [ ] **`Person`**
  - **Sub-components:** `Person.Root`, `Person.Name`, `Person.JobTitle`, `Person.SocialLinks`
  - **Value:** Used for team pages, author bylines, or speaker profiles. It builds the Knowledge Graph by linking people to the `Organization` using properties like `alumniOf`, `employee`, or `founder`.

## Rich Media & Interactive
- [ ] **`VideoObject`**
  - **Sub-components:** `Video.Root`, `Video.Player`, `Video.Thumbnail`
  - **Value:** For landing page promo videos or tutorial videos. `VideoObject` schema is notoriously tedious to write manually but is highly rewarded by Google Video search.
- [ ] **`Event`**
  - **Sub-components:** `Event.Root`, `Event.Date`, `Event.Location`
  - **Value:** Great for webinars, conferences, or live streams.

## Marketing & UI Patterns (Replacing Custom Boilerplate)
- [ ] **`Feature` / `ItemList`**
  - **Sub-components:** `Feature.Root`, `Feature.Title`, `Feature.Description`
  - **Value:** Replaces custom HTML grids. Semantic structuring for feature grids and value pillars on marketing sites, potentially emitting `ItemList` or `Offer` schema.
- [ ] **`CodeSnippet` / `SoftwareSourceCode`**
  - **Sub-components:** `CodeSnippet.Root`, `CodeSnippet.Code`
  - **Value:** For developer tool sites. Automatically emits the Schema.org `SoftwareSourceCode` entity, telling search engines and AI agents exactly what language the code is in and what it demonstrates.
- [ ] **`CallToAction` / `EntryPoint`**
  - **Sub-components:** `Action.Root`
  - **Value:** Wraps Next.js links or buttons to explicitly emit `EntryPoint` actions (e.g., `ReadAction`, `SearchAction`), telling AI agents what happens when the user interacts.
