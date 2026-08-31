'use client';

import dynamic from 'next/dynamic';
import {
  FileCode,
  ShieldCheck,
  Network,
  Boxes,
  ExternalLink,
  Sparkles,
  Workflow,
  Code2,
  Cpu,
  Bot,
  Sliders,
  ArrowRight,
} from 'lucide-react';
import { Faq, useContextualSiteContext } from 'contextual-ui';
import type { SiteData } from '@/data/site.server';
import { HeroFlowDiagram } from '@/components/hero-flow';

const TriangleSphere = dynamic(() => import('@/components/TriangleSphere'), {
  ssr: false,
  loading: () => <div className="w-full h-[360px] sm:h-[440px] lg:h-[480px]" />,
});

export function HomeClient({ data: explicitData }: { data?: SiteData } = {}) {
  const pageContext = useContextualSiteContext<SiteData>();
  const data = explicitData ?? pageContext?.data;
  const faqItems = data?.faq ?? [];

  return (
    <div className="pt-16 pb-32">
      {/* Main Content with padding-top to account for fixed header */}
      <main className="pt-12 pb-16 px-6 max-w-6xl mx-auto space-y-20 sm:space-y-28">

        {/* Hero Section with Dynamic TriangleSphere */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-50 leading-tight">
              One Schema. UI for Humans, Structured Data for AI & Search Engines.
            </h1>
            <p className="text-lg text-zinc-300 leading-relaxed max-w-2xl">
              Headless components for website building that inject schema markup and expose a full Knowledge Graph for easy integration with agentic workflows.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#data-pipeline"
                className="px-4 py-2 rounded-xl bg-accent text-zinc-950 font-semibold text-xs tracking-tight hover:bg-accent/90 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>Explore Pipeline Diagram</span>
                <span>↓</span>
              </a>
              <a
                href="/docs"
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-base text-xs font-medium transition-colors"
              >
                Browse Docs
              </a>
              <a
                href="/api/graph.json"
                target="_blank"
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-base text-xs font-mono transition-colors"
              >
                /api/graph.json ↗
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 h-[360px] sm:h-[440px] lg:h-[480px] w-full flex items-center justify-center">
            <TriangleSphere className="w-full h-full" />
          </div>
        </section>

        {/* Data Pipeline Flow Diagram Section */}
        <section id="data-pipeline" className="space-y-6 scroll-mt-24">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider">
              <span>●</span> Architecture Flow
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
              Source to Graph & UI
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
              Explore how Contextual UI unifies data ingestion, SSOT schema validation, and multi-channel delivery across React components, Schema.org <code className="code-short">@graph</code> JSON-LD, and structured AI agent feeds.
            </p>
          </div>

          <HeroFlowDiagram />
        </section>

        {/* Core Foundations Section */}
        <section id="foundations" className="space-y-12 sm:space-y-16 scroll-mt-24">
          {/* Section Header */}
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider">
              <span>●</span> Core Foundations
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              Architecture & Core Concepts
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Explore how Contextual UI combines unified schema definitions, sitewide Knowledge Graphs, hierarchical scoping, and headless Radix primitives.
            </p>
          </div>

          {/* Subsections List */}
          <div className="space-y-16 sm:space-y-20">

            {/* Subsection 1: Single Source of Truth (SSOT) */}
            <div id="ssot" className="scroll-mt-24 space-y-6 pt-8 border-t border-zinc-800/80">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
                    Single Source of Truth (SSOT)
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Define your site schema once using standard Zod schemas and pre-built registries. Automatically generate TypeScript types, runtime validation, and Schema.org JSON-LD with zero drift.
                  </p>
                </div>

                <a
                  href="/docs#schemas"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent/80 transition-colors shrink-0 group"
                >
                  <span>Explore Registries in Docs</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border border-base rounded-2xl p-5 bg-zinc-950/60 space-y-2.5 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent">
                    <Boxes className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100">Composable Registries</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Pre-built registries (<code className="text-accent font-mono text-[11px]">websiteRegistry</code>, <code className="text-accent font-mono text-[11px]">faqRegistry</code>, etc.) enforce official Schema.org standards without boilerplate.
                  </p>
                </div>

                <div className="border border-base rounded-2xl p-5 bg-zinc-950/60 space-y-2.5 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100">Automatic Type Inference</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Derive 100% type-safe data models via <code className="text-accent font-mono text-[11px]">InferData&lt;typeof siteSchema&gt;</code> with zero manual duplicate typing.
                  </p>
                </div>

                <div className="border border-base rounded-2xl p-5 bg-zinc-950/60 space-y-2.5 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent">
                    <Workflow className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100">Zero Drift Guarantee</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Modifying data in your connector automatically keeps React UI components, CMS validators, and SEO meta tags synchronized.
                  </p>
                </div>

                <div className="border border-base rounded-2xl p-5 bg-zinc-950/60 space-y-2.5 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100">Custom Zod Extension</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Seamlessly mix standard registries with custom Zod objects for announcement banners, blogs, team bios, and custom product catalogs.
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pt-1">
                <strong className="text-zinc-200 font-medium">Why it matters:</strong> Instead of authoring JSON-LD tags by hand or risking schema mismatches during refactors, your single schema acts as the single source of truth for runtime validation, compile-time TypeScript types, and search/AI crawlers.
              </p>
            </div>

            {/* Subsection 2: Global Knowledge Graph */}
            <div id="knowledge-graph" className="scroll-mt-24 space-y-6 pt-8 border-t border-zinc-800/80">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
                    Global Knowledge Graph
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Connect domain entities, route documents, and UI components into a referentially-linked Schema.org <code className="code-short">@graph</code>. Exposed sitewide via <a href="/api/graph.json" target="_blank" className="text-accent underline">/api/graph.json</a> for search engines and AI agents.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <a
                    href="/schema"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-accent border border-base transition-colors"
                  >
                    <Network className="w-3.5 h-3.5" />
                    <span>Graph Visualizer</span>
                  </a>
                  <a
                    href="/api/graph.json"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-300 border border-base transition-colors"
                  >
                    <span>/api/graph.json</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border border-base rounded-2xl p-5 bg-zinc-950/60 space-y-2.5 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent">
                    <Network className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100">Referential @id Linking</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Entities reference each other with canonical URIs (<code className="text-accent font-mono text-[11px]">#website</code>, <code className="text-accent font-mono text-[11px]">#organization</code>) forming a true Semantic Web graph.
                  </p>
                </div>

                <div className="border border-base rounded-2xl p-5 bg-zinc-950/60 space-y-2.5 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent">
                    <Bot className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100">Agent-Ready API Feed</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Exposes <code className="text-accent font-mono text-[11px]">/api/graph.json</code> so AI agents, RAG pipelines, and LLM search bots consume structured data without parsing messy DOM.
                  </p>
                </div>

                <div className="border border-base rounded-2xl p-5 bg-zinc-950/60 space-y-2.5 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100">Zero Scraping Fragility</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Eliminates scraper breaks from markup updates, hydration mismatches, client-side rendering delays, and token bloat.
                  </p>
                </div>

                <div className="border border-base rounded-2xl p-5 bg-zinc-950/60 space-y-2.5 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100">Interactive Schema Graph</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Built-in visual DAG inspector to visualize node connections, schema types, and attribute relations in real time.
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pt-1">
                <strong className="text-zinc-200 font-medium">Why it matters:</strong> Modern AI search engines (like Perplexity, ChatGPT Search, and Google AI Overviews) and LLM agents prioritize referentially-linked knowledge over isolated meta tags.
              </p>
            </div>

            {/* Subsection 3: Global vs Route Metadata */}
            <div id="metadata-scoping" className="scroll-mt-24 space-y-6 pt-8 border-t border-zinc-800/80">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
                    Global vs Route Metadata
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Distinguish between domain-level entities (<code className="code-short">WebSite</code>, <code className="code-short">Organization</code>), route documents (<code className="code-short">WebPage</code>), and UI components without prop drilling.
                  </p>
                </div>

                <a
                  href="/docs#contextual-site"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent/80 transition-colors shrink-0 group"
                >
                  <span>Read Scoping Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-base rounded-2xl p-5 bg-zinc-950/60 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-accent/20 border border-accent/40 text-accent font-mono text-xs font-bold flex items-center justify-center">1</span>
                      <h4 className="text-sm font-semibold text-zinc-100">Domain Scope</h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">&lt;ContextualSite&gt;</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Mounted at root <code className="code-short">app/layout.tsx</code>. Injects global entities like <code className="text-zinc-200 font-mono text-[11px]">Organization</code>, <code className="text-zinc-200 font-mono text-[11px]">WebSite</code>, and sitewide navigations.
                  </p>
                </div>

                <div className="border border-base rounded-2xl p-5 bg-zinc-950/60 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-accent/20 border border-accent/40 text-accent font-mono text-xs font-bold flex items-center justify-center">2</span>
                      <h4 className="text-sm font-semibold text-zinc-100">Route Scope</h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">&lt;WebPage&gt;</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Wraps individual route pages (<code className="code-short">&lt;WebPage id="docs"&gt;</code>). Scopes canonical URLs, route titles, descriptions, and breadcrumb trails to the active document.
                  </p>
                </div>

                <div className="border border-base rounded-2xl p-5 bg-zinc-950/60 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-accent/20 border border-accent/40 text-accent font-mono text-xs font-bold flex items-center justify-center">3</span>
                      <h4 className="text-sm font-semibold text-zinc-100">Component Scope</h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">&lt;Faq&gt; / &lt;Breadcrumb&gt;</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Headless primitives that consume typed data directly from context, render accessible UI, and attach microdata fragments to the parent page node.
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pt-1">
                <strong className="text-zinc-200 font-medium">Why it matters:</strong> Isolating domain, route, and component contexts prevents metadata leakage across pages while maintaining global entity links throughout the Knowledge Graph.
              </p>
            </div>

            {/* Subsection 4: Headless & Radix Powered */}
            <div id="headless-radix" className="scroll-mt-24 space-y-6 pt-8 border-t border-zinc-800/80">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
                    Headless & Radix Powered
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Unstyled, accessible UI primitives built with Radix UI and the <code className="code-short">asChild</code> pattern. Full styling freedom with Tailwind CSS or any design system, with automated Schema.org markup.
                  </p>
                </div>

                <a
                  href="/docs#components"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent/80 transition-colors shrink-0 group"
                >
                  <span>View Components</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border border-base rounded-2xl p-5 bg-zinc-950/60 space-y-2.5 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100">Radix asChild Pattern</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Slot into your custom button, link, Next.js <code className="text-accent font-mono text-[11px]">&lt;Link&gt;</code>, or motion component without extra wrapper divs.
                  </p>
                </div>

                <div className="border border-base rounded-2xl p-5 bg-zinc-950/60 space-y-2.5 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100">Design System Agnostic</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    100% compatible with Tailwind CSS, Tailwind v4, CSS Modules, Shadcn UI, or custom enterprise design tokens.
                  </p>
                </div>

                <div className="border border-base rounded-2xl p-5 bg-zinc-950/60 space-y-2.5 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100">WAI-ARIA Accessibility</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Full keyboard navigation (Tab, Enter, Space, Arrows), screen reader announcements, and robust ARIA states out of the box.
                  </p>
                </div>

                <div className="border border-base rounded-2xl p-5 bg-zinc-950/60 space-y-2.5 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100">Automated Microdata</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Components quietly emit valid Schema.org microdata and JSON-LD behind the scenes without polluting your JSX styling.
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pt-1">
                <strong className="text-zinc-200 font-medium">Why it matters:</strong> You get top-tier SEO and agentic structured data without compromising your team&apos;s UI design system, component libraries, or frontend styling architecture.
              </p>
            </div>

          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider">
              <span>●</span> FAQ
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-zinc-400">
              Frequently asked questions powered by Contextual UI and Schema.org semantic structured data.
            </p>
          </div>

          <div className="border border-zinc-800 rounded-2xl p-6 shadow-sm bg-zinc-950/40">
            <Faq.Root>
              {faqItems.map((item) => (
                <Faq.Item key={item.id} id={item.id} className="mb-4 last:mb-0 border-b border-zinc-800 last:border-b-0 pb-4 last:pb-0">
                  <Faq.Trigger className="bg-transparent border-none font-semibold text-base cursor-pointer text-left w-full hover:text-accent transition-colors py-1">
                    {item.question}
                  </Faq.Trigger>
                  <Faq.Content className="mt-2 text-zinc-400 text-sm leading-relaxed">
                    {item.answer}
                  </Faq.Content>
                </Faq.Item>
              ))}
            </Faq.Root>
          </div>
        </section>

        {/* Quick Navigation Cards */}
        <section className="pt-10 border-t border-base space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400">Starter Kit Navigation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <a
              href="/docs"
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-base p-4 rounded-xl no-underline text-xs font-semibold transition-colors shadow-sm flex flex-col gap-1"
            >
              <span className="text-accent text-sm">Documentation &rarr;</span>
              <span className="text-zinc-400 font-normal">Explore ContextualSite, Navbar, Breadcrumb, FAQ</span>
            </a>
            <a
              href="/schema"
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-base p-4 rounded-xl no-underline text-xs font-semibold transition-colors shadow-sm flex flex-col gap-1"
            >
              <span className="text-accent text-sm">Schema Graph &rarr;</span>
              <span className="text-zinc-400 font-normal">View SSOT and interactive Knowledge Graph</span>
            </a>
            <a
              href="/api/graph.json"
              target="_blank"
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-base p-4 rounded-xl no-underline text-xs font-semibold transition-colors shadow-sm flex flex-col gap-1"
            >
              <span className="text-accent text-sm">JSON-LD Graph &rarr;</span>
              <span className="text-zinc-400 font-normal">Raw schema.org @graph JSON endpoint</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
