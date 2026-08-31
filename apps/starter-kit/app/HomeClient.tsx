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
            Build Websites Optimized for Search & AI Agents.
            </h1>
            <p className="text-lg text-zinc-300 leading-relaxed max-w-2xl">
              Stop writing boilerplate schema markup. Use our open-source headless components to build accessible UIs that automatically compile into an unified JSON-LD Knowledge Graph for Next-Gen SEO and LLM ingestion.
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
                    Define your site schema once in Zod. Automatically generate TypeScript types, runtime validation, and Schema.org JSON-LD with zero drift.
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

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                {/* 3 Value Pillars */}
                <div className="lg:col-span-6 grid grid-cols-1 gap-3">
                  <div className="border border-base rounded-2xl p-4 bg-zinc-950/60 flex items-start gap-3.5 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent shrink-0 mt-0.5">
                      <Boxes className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-100">1. Define Once</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">
                        Compose Schema.org registries (<code className="text-accent font-mono text-[11px]">websiteRegistry</code>, <code className="text-accent font-mono text-[11px]">faqRegistry</code>) and custom Zod schemas.
                      </p>
                    </div>
                  </div>

                  <div className="border border-base rounded-2xl p-4 bg-zinc-950/60 flex items-start gap-3.5 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-100">2. Auto Type Inference</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">
                        Derive 100% type-safe models via <code className="text-accent font-mono text-[11px]">InferData&lt;typeof siteSchema&gt;</code> with zero manual duplication.
                      </p>
                    </div>
                  </div>

                  <div className="border border-base rounded-2xl p-4 bg-zinc-950/60 flex items-start gap-3.5 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent shrink-0 mt-0.5">
                      <Workflow className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-100">3. Zero Drift Sync</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">
                        Connector data automatically keeps headless React UI components and SEO JSON-LD graphs in sync.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Micro Code Preview Card */}
                <div className="lg:col-span-6 border border-base rounded-2xl bg-zinc-950/80 p-5 font-mono text-xs shadow-inner flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80 text-[11px] text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                        <span className="ml-2 text-zinc-400 font-medium">data/site.schema.ts</span>
                      </div>
                      <span className="text-accent font-semibold">SSOT Contract</span>
                    </div>

                    <pre className="text-zinc-300 overflow-x-auto leading-relaxed !bg-transparent !p-0 !m-0">
                      <code>
                        <span className="text-purple-400">export const</span> siteSchema = <span className="text-accent">defineSchema</span>({'{'}{'\n'}
                        {'  '}organization: <span className="text-accent">organizationRegistry</span>(),{'\n'}
                        {'  '}website: <span className="text-accent">websiteRegistry</span>(),{'\n'}
                        {'  '}faq: <span className="text-accent">faqRegistry</span>(),{'\n'}
                        {'}'});{'\n\n'}
                        <span className="text-zinc-500">// TypeScript type derived automatically</span>{'\n'}
                        <span className="text-purple-400">export type</span> <span className="text-amber-300">SiteData</span> = <span className="text-accent">InferData</span>&lt;<span className="text-purple-400">typeof</span> siteSchema&gt;;
                      </code>
                    </pre>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span className="text-emerald-400">● Runtime Validated</span>
                    <span>Schema.org @graph Ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subsection 2: Global Knowledge Graph */}
            <div id="knowledge-graph" className="scroll-mt-24 space-y-6 pt-8 border-t border-zinc-800/80">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
                    Global Knowledge Graph
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Entities, route documents, and component metadata compile into a single referentially-linked Schema.org <code className="code-short">@graph</code>. Exposed sitewide for AI agents, LLM pipelines, and search bots.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <a
                    href="/api/graph.json"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-300 border border-base transition-colors"
                  >
                    <span>/api/graph.json</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="/schema"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 hover:bg-accent/20 text-xs font-mono text-accent border border-accent/30 transition-colors"
                    title="Interactive visualization demo of this site's graph"
                  >
                    <Network className="w-3.5 h-3.5" />
                    <span>Visualizer Demo</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                {/* 3 Value Pillars */}
                <div className="lg:col-span-6 grid grid-cols-1 gap-3">
                  <div className="border border-base rounded-2xl p-4 bg-zinc-950/60 flex items-start gap-3.5 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent shrink-0 mt-0.5">
                      <Network className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-100">Referential @id Linking</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">
                        Entities reference each other with canonical URIs (<code className="text-accent font-mono text-[11px]">#website</code>, <code className="text-accent font-mono text-[11px]">#organization</code>) forming a true Semantic Web graph.
                      </p>
                    </div>
                  </div>

                  <div className="border border-base rounded-2xl p-4 bg-zinc-950/60 flex items-start gap-3.5 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-100">Agent-Ready API Endpoint</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">
                        Exposes <code className="text-accent font-mono text-[11px]">/api/graph.json</code> so AI agents (Perplexity, ChatGPT Search, Claude) consume clean structured data without parsing messy DOM.
                      </p>
                    </div>
                  </div>

                  <div className="border border-base rounded-2xl p-4 bg-zinc-950/60 flex items-start gap-3.5 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent shrink-0 mt-0.5">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-100">Zero Scraping Fragility</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">
                        Eliminates scraper breaks from markup refactors, client hydration delays, and costly LLM token waste.
                      </p>
                    </div>
                  </div>
                </div>

                {/* JSON-LD Graph Endpoint Preview */}
                <div className="lg:col-span-6 border border-base rounded-2xl bg-zinc-950/80 p-5 font-mono text-xs shadow-inner flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80 text-[11px] text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                        <span className="ml-2 text-zinc-400 font-medium">GET /api/graph.json</span>
                      </div>
                      <span className="text-accent font-semibold">JSON-LD @graph</span>
                    </div>

                    <pre className="text-zinc-300 overflow-x-auto leading-relaxed !bg-transparent !p-0 !m-0">
                      <code>
                        {'{'}{'\n'}
                        {'  '}<span className="text-zinc-500">"@context":</span> <span className="text-emerald-400">"https://schema.org"</span>,{'\n'}
                        {'  '}<span className="text-zinc-500">"@graph":</span> [{'\n'}
                        {'    '}{'{'}{'\n'}
                        {'      '}<span className="text-zinc-500">"@type":</span> <span className="text-amber-300">"WebSite"</span>,{'\n'}
                        {'      '}<span className="text-zinc-500">"@id":</span> <span className="text-accent">"https://contextual.site/#website"</span>,{'\n'}
                        {'      '}<span className="text-zinc-500">"publisher":</span> {'{'} <span className="text-zinc-500">"@id":</span> <span className="text-accent">"https://contextual.site/#org"</span> {'}'}{'\n'}
                        {'    '}{'}'},{'\n'}
                        {'    '}{'{'}{'\n'}
                        {'      '}<span className="text-zinc-500">"@type":</span> <span className="text-amber-300">"Organization"</span>,{'\n'}
                        {'      '}<span className="text-zinc-500">"@id":</span> <span className="text-accent">"https://contextual.site/#org"</span>{'\n'}
                        {'    '}{'}'}{'\n'}
                        {'  '}]{'\n'}
                        {'}'}
                      </code>
                    </pre>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span className="text-emerald-400">● Live AI Feed</span>
                    <a href="/schema" className="text-accent hover:underline flex items-center gap-1">
                      <span>Explore visualizer demo</span>
                      <span>&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
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
      </main>
    </div>
  );
}
