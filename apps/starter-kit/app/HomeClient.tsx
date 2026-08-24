'use client';

import dynamic from 'next/dynamic';
import { Faq, useContextualSiteContext } from '@contextual-ui/core';
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
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-base text-xs font-mono text-accent">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              @contextual-ui/core v0.1
            </div> */}
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-50 leading-tight">
              One Schema. UI for Humans, Structured Data for AI & Search Engines.
            </h1>
            <p className="text-lg text-zinc-300 leading-relaxed max-w-2xl">
              The headless React library that turns your Website into accessible components and referential Schema.org Knowledge Graphs.
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

        {/* SSOT & Architecture Pillars */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider">
              <span>●</span> Core Foundations
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              Single Source of Truth & Architecture Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-base rounded-2xl p-6 bg-zinc-950/40 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span className="text-accent">⚡</span> Single Source of Truth (SSOT)
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Combine standard Zod schemas with pre-built registries ( <code className="text-xs bg-zinc-900 px-1.5 py-0.5 rounded border border-base text-zinc-200">websiteRegistry</code>, <code className="text-xs bg-zinc-900 px-1.5 py-0.5 rounded border border-base text-zinc-200">faqRegistry</code>, <code className="text-xs bg-zinc-900 px-1.5 py-0.5 rounded border border-base text-zinc-200">navbarRegistry</code> ) that automatically generate Schema.org JSON-LD and TypeScript types.
              </p>
            </div>

            <div className="border border-base rounded-2xl p-6 bg-zinc-950/40 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span className="text-accent">🌐</span> Global Knowledge Graph
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Export a unified, referentially-linked Schema.org <code className="text-xs bg-zinc-900 px-1.5 py-0.5 rounded border border-base text-zinc-200">@graph</code> sitewide via <a href="/api/graph.json" target="_blank" className="text-accent underline">/api/graph.json</a> for search engines and AI agents with zero runtime scraping.
              </p>
            </div>

            <div className="border border-base rounded-2xl p-6 bg-zinc-950/40 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span className="text-accent">🧩</span> Global vs Route Metadata
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Distinguish between domain-level knowledge graph entities (<code className="text-xs bg-zinc-900 px-1.5 py-0.5 rounded border border-base text-zinc-200">WebSite</code>, <code className="text-xs bg-zinc-900 px-1.5 py-0.5 rounded border border-base text-zinc-200">FAQPage</code>) and ephemeral page-level metadata (<code className="text-xs bg-zinc-900 px-1.5 py-0.5 rounded border border-base text-zinc-200">BreadcrumbList</code>, <code className="text-xs bg-zinc-900 px-1.5 py-0.5 rounded border border-base text-zinc-200">WebPage</code>).
              </p>
            </div>

            <div className="border border-base rounded-2xl p-6 bg-zinc-950/40 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span className="text-accent">🛠️</span> Headless & Radix Powered
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Supports the <code className="text-xs bg-zinc-900 px-1.5 py-0.5 rounded border border-base text-zinc-200">asChild</code> pattern via Radix UI, allowing full compatibility with Tailwind CSS, design systems, and custom styling.
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
