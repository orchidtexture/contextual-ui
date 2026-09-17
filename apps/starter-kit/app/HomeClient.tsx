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
import { Faq, Section, Collection, useContextualSiteContext } from 'contextual-ui';
import type { SiteData } from '@/data/site.server';
import { HeroFlowDiagram } from '@/components/hero-flow';
import { heroSection, pipelineSection, foundationsSection } from '@/data/home.content';

const TriangleSphere = dynamic(() => import('@/components/TriangleSphere'), {
  ssr: false,
  loading: () => <div className="w-full h-[360px] sm:h-[440px] lg:h-[480px]" />,
});

export function HomeClient({ data: explicitData }: { data?: SiteData } = {}) {
  const pageContext = useContextualSiteContext<SiteData>();
  const data = explicitData ?? pageContext?.data;
  const faqItems = data?.faq ?? [];

  const sectionList = (data as any)?.sections ?? [];
  const heroSectionData = sectionList.find((s: any) => s.id === 'hero') ?? heroSection;
  const pipelineSectionData = sectionList.find((s: any) => s.id === 'data-pipeline') ?? pipelineSection;
  const foundationsSectionData = sectionList.find((s: any) => s.id === 'foundations') ?? foundationsSection;
  const ssotSection = sectionList.find((s: any) => s.id === 'ssot');
  const kgSection = sectionList.find((s: any) => s.id === 'knowledge-graph');
  const scopingSection = sectionList.find((s: any) => s.id === 'metadata-scoping');
  const headlessSection = sectionList.find((s: any) => s.id === 'headless-radix');

  const collectionList = (data as any)?.collections ?? [];
  const ssotFeatures = collectionList.find((c: any) => c.id === 'ssot-features');
  const kgFeatures = collectionList.find((c: any) => c.id === 'knowledge-graph-features');
  const scopingFeatures = collectionList.find((c: any) => c.id === 'metadata-scoping-features');
  const headlessFeatures = collectionList.find((c: any) => c.id === 'headless-features');

  return (
    <div className="pt-16 pb-32">
      {/* Main Content with padding-top to account for fixed header */}
      <main className="pt-12 pb-16 px-6 max-w-6xl mx-auto space-y-20 sm:space-y-28">

        {/* Hero Section with Dynamic TriangleSphere */}
        <Section.Root data={heroSectionData} id="hero" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          <div className="lg:col-span-7 space-y-6">
            <Section.Title as="h1" className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-50 leading-tight" />
            <Section.Description className="text-lg text-zinc-300 leading-relaxed max-w-2xl" />
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
        </Section.Root>

        {/* Data Pipeline Flow Diagram Section */}
        <Section.Root data={pipelineSectionData} id="data-pipeline" className="space-y-6 scroll-mt-24">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider">
              <span>●</span> {pipelineSectionData.subtitle || 'Architecture Flow'}
            </div>
            <Section.Title as="h2" className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100" />
            <Section.Description className="text-sm text-zinc-400 leading-relaxed max-w-3xl" />
          </div>

          <HeroFlowDiagram />
        </Section.Root>

        {/* Core Foundations Section */}
        <Section.Root data={foundationsSectionData} id="foundations" className="space-y-12 sm:space-y-16 scroll-mt-24">
          {/* Section Header */}
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider">
              <span>●</span> {foundationsSectionData.subtitle || 'Core Foundations'}
            </div>
            <Section.Title as="h2" className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100" />
            <Section.Description className="text-sm sm:text-base text-zinc-400 leading-relaxed" />
          </div>

          {/* Subsections List */}
          <div className="space-y-16 sm:space-y-20">

            {/* Subsection 1: Single Source of Truth (SSOT) */}
            <Section.Root data={ssotSection} id="ssot" className="scroll-mt-24 space-y-6 pt-8 border-t border-zinc-800/80">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <Section.Title as="h3" className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100" />
                  <Section.Description className="text-sm text-zinc-400 leading-relaxed" />
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
                <Collection.Root data={ssotFeatures} ordered className="lg:col-span-6 grid grid-cols-1 gap-3">
                  {(items) => {
                    const icons = [Boxes, ShieldCheck, Workflow];
                    return items.map((item, idx) => {
                      const Icon = icons[idx] || Boxes;
                      return (
                        <Collection.Item
                          key={item.id}
                          item={item}
                          className="border border-base rounded-2xl p-4 bg-zinc-950/60 flex items-start gap-3.5 shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent shrink-0 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <Collection.Title as="h4" className="text-sm font-semibold text-zinc-100" />
                            <Collection.Description className="text-xs text-zinc-400 leading-relaxed mt-0.5" />
                          </div>
                        </Collection.Item>
                      );
                    });
                  }}
                </Collection.Root>

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
            </Section.Root>

            {/* Subsection 2: Global Knowledge Graph */}
            <Section.Root data={kgSection} id="knowledge-graph" className="scroll-mt-24 space-y-6 pt-8 border-t border-zinc-800/80">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <Section.Title as="h3" className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100" />
                  <Section.Description className="text-sm text-zinc-400 leading-relaxed" />
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
                <Collection.Root data={kgFeatures} className="lg:col-span-6 grid grid-cols-1 gap-3">
                  {(items) => {
                    const icons = [Network, Bot, Cpu];
                    return items.map((item, idx) => {
                      const Icon = icons[idx] || Network;
                      return (
                        <Collection.Item
                          key={item.id}
                          item={item}
                          className="border border-base rounded-2xl p-4 bg-zinc-950/60 flex items-start gap-3.5 shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent shrink-0 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <Collection.Title as="h4" className="text-sm font-semibold text-zinc-100" />
                            <Collection.Description className="text-xs text-zinc-400 leading-relaxed mt-0.5" />
                          </div>
                        </Collection.Item>
                      );
                    });
                  }}
                </Collection.Root>

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
            </Section.Root>

            {/* Subsection 3: Global vs Route Metadata */}
            <Section.Root data={scopingSection} id="metadata-scoping" className="scroll-mt-24 space-y-6 pt-8 border-t border-zinc-800/80">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <Section.Title as="h3" className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100" />
                  <Section.Description className="text-sm text-zinc-400 leading-relaxed" />
                </div>

                <a
                  href="/docs#contextual-site"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent/80 transition-colors shrink-0 group"
                >
                  <span>Read Scoping Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>

              <Collection.Root data={scopingFeatures} ordered className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(items) =>
                  items.map((item, idx) => (
                    <Collection.Item
                      key={item.id}
                      item={item}
                      className="border border-base rounded-2xl p-5 bg-zinc-950/60 space-y-2.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-accent/20 border border-accent/40 text-accent font-mono text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <Collection.Title as="h4" className="text-sm font-semibold text-zinc-100" />
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                          {idx === 0 ? '<ContextualSite>' : idx === 1 ? '<WebPage>' : '<Faq> / <Breadcrumb>'}
                        </span>
                      </div>
                      <Collection.Description className="text-xs text-zinc-400 leading-relaxed" />
                    </Collection.Item>
                  ))
                }
              </Collection.Root>

              <Section.Content className="text-xs sm:text-sm text-zinc-400 leading-relaxed pt-1" />
            </Section.Root>

            {/* Subsection 4: Headless & Radix Powered */}
            <Section.Root
              data={headlessSection}
              id="headless-radix"
              className="scroll-mt-24 space-y-6 pt-8 border-t border-zinc-800/80"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <Section.Title as="h3" className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100" />
                  <Section.Description className="text-sm text-zinc-400 leading-relaxed" />
                </div>

                <a
                  href="/docs#components"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent/80 transition-colors shrink-0 group"
                >
                  <span>View Components</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>

              <Collection.Root data={headlessFeatures} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(items) => {
                  const icons = [Code2, Sparkles, ShieldCheck, FileCode];
                  return items.map((item, idx) => {
                    const Icon = icons[idx] || Code2;
                    return (
                      <Collection.Item
                        key={item.id}
                        item={item}
                        className="border border-base rounded-2xl p-5 bg-zinc-950/60 space-y-2.5 shadow-sm"
                      >
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent">
                          <Icon className="w-4 h-4" />
                        </div>
                        <Collection.Title as="h4" className="text-sm font-semibold text-zinc-100" />
                        <Collection.Description className="text-xs text-zinc-400 leading-relaxed" />
                      </Collection.Item>
                    );
                  });
                }}
              </Collection.Root>

              <Section.Content className="text-xs sm:text-sm text-zinc-400 leading-relaxed pt-1" />
            </Section.Root>

          </div>
        </Section.Root>

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
