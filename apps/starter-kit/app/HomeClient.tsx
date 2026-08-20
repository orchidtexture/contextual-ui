'use client';

import { Faq } from '@contextual-ui/core';
import type { SiteData } from '@/data/site.server';

export function HomeClient({ data }: { data: SiteData }) {
  return (
    <div className="pt-16">
      {/* Main Content with padding-top to account for fixed header */}
      <main className="pt-12 pb-16 px-6 max-w-3xl mx-auto">

        {data.announcement?.enabled && (
          <div className="bg-silver p-4 rounded-xl mb-6 text-zinc-900 text-sm shadow-sm">
            {data.announcement.message}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">FAQ Section</h1>
          <p className="text-base">
            Frequently asked questions powered by Contextual UI and Schema.org semantic structured data.
          </p>
        </div>

        <div className="border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <Faq.Root data={data.faq}>
            {data.faq.map((item) => (
              <Faq.Item key={item.id} id={item.id} className="mb-4 last:mb-0 border-b border-zinc-100 last:border-b-0 pb-4 last:pb-0">
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

        <div className="mt-10 border-t border-base pt-6 flex gap-3 flex-wrap items-center">
          <a
            href="/components"
            className="bg-accent hover:bg-accent/80 text-zinc-900 px-4 py-2.5 rounded-lg no-underline text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            Explore Components Showcase &rarr;
          </a>
          <a
            href="/cms"
            className="bg-accent hover:bg-accent/80 text-zinc-900 px-4 py-2.5 rounded-lg no-underline text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            Open CMS Dashboard &rarr;
          </a>
          <a
            href="/api/graph.json"
            target="_blank"
            className="bg-accent hover:bg-accent/80 text-zinc-900 px-4 py-2.5 rounded-lg no-underline text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            View JSON-LD Graph JSON &rarr;
          </a>
        </div>
      </main>
    </div>
  );
}
