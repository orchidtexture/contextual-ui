'use client';

import { Faq } from '@contextual-ui/core';
import type { SiteData } from '@/data/site.server';

export function HomeClient({ data }: { data: SiteData }) {
  return (
    <div className="pt-16 pb-28">
      {/* Main Content with padding-top to account for fixed header */}
      <main className="pt-12 pb-16 px-6 max-w-4xl mx-auto space-y-12">

        {/* {data.announcement?.enabled && (
          <div className="bg-silver p-4 rounded-xl text-zinc-900 text-sm shadow-sm font-medium">
            {data.announcement.message}
          </div>
        )} */}

        {/* Hero Section */}
        <div className="space-y-4 border-b border-base pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-base text-xs font-mono text-accent">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            @contextual-ui/core v0.1
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            UI for Humans, Search Engines & AI Agents
          </h1>
          <p className="text-lg text-zinc-300 leading-relaxed">
            Foundational headless component library built with <strong className="text-zinc-100 font-semibold">React</strong>, <strong className="text-zinc-100 font-semibold">Zod</strong>, and <strong className="text-zinc-100 font-semibold">Radix UI</strong>. It provides the infrastructure to build accessible, type-safe, and SEO-optimized components with zero design opinion, paired with an integrated Schema.org Knowledge Graph engine.
          </p>
        </div>

        {/* SSOT & Architecture Pillars */}
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

        {/* FAQ Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">FAQ</h2>
            <p className="text-sm text-zinc-400">
              Frequently asked questions powered by Contextual UI and Schema.org semantic structured data.
            </p>
          </div>

          <div className="border border-zinc-200 rounded-2xl p-6 shadow-sm bg-zinc-950/20">
            <Faq.Root data={data.faq}>
              {data.faq.map((item) => (
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
        </div>

        {/* Quick Navigation Cards */}
        <div className="pt-6 border-t border-base space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400">Starter Kit Navigation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <a
              href="/components"
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-base p-4 rounded-xl no-underline text-xs font-semibold transition-colors shadow-sm flex flex-col gap-1"
            >
              <span className="text-accent text-sm">Components &rarr;</span>
              <span className="text-zinc-400 font-normal">Explore Navbar, Breadcrumb, FAQ showcase</span>
            </a>
            <a
              href="/schema"
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-base p-4 rounded-xl no-underline text-xs font-semibold transition-colors shadow-sm flex flex-col gap-1"
            >
              <span className="text-accent text-sm">Schema Graph &rarr;</span>
              <span className="text-zinc-400 font-normal">View SSOT and interactive Knowledge Graph</span>
            </a>
            {/* <a
              href="/cms"
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-base p-4 rounded-xl no-underline text-xs font-semibold transition-colors shadow-sm flex flex-col gap-1"
            >
              <span className="text-accent text-sm">CMS Dashboard &rarr;</span>
              <span className="text-zinc-400 font-normal">Manage site content and live updates</span>
            </a> */}
            <a
              href="/api/graph.json"
              target="_blank"
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-base p-4 rounded-xl no-underline text-xs font-semibold transition-colors shadow-sm flex flex-col gap-1"
            >
              <span className="text-accent text-sm">JSON-LD Graph &rarr;</span>
              <span className="text-zinc-400 font-normal">Raw schema.org @graph JSON endpoint</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
