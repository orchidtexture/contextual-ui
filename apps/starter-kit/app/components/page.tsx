'use client';

import Link from 'next/link';
import { Breadcrumb } from '@contextual-ui/core';

export default function ComponentsPage() {
  const breadcrumbData = [
    { id: '1', label: 'Home', url: '/' },
    { id: '2', label: 'Components', url: '/components' },
    { id: '3', label: 'Breadcrumb', url: '/components#breadcrumb' },
  ];

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 px-6 py-12 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 no-underline text-sm font-medium inline-flex items-center gap-1.5 transition-colors"
        >
          &larr; Back to Home
        </Link>
      </div>

      <div className="mb-8 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <Breadcrumb.Root data={breadcrumbData} baseUrl="https://contextual-ui.dev">
          <Breadcrumb.List className="flex list-none p-0 m-0 gap-2 items-center text-sm">
            {breadcrumbData.map((item, index) => {
              const isLast = index === breadcrumbData.length - 1;
              return (
                <Breadcrumb.Item key={item.id} id={item.id} className="flex items-center gap-2">
                  {isLast ? (
                    <Breadcrumb.Page className="font-semibold text-slate-900">
                      {item.label}
                    </Breadcrumb.Page>
                  ) : (
                    <>
                      <Breadcrumb.Link href={item.url!} className="text-blue-600 hover:underline no-underline">
                        {item.label}
                      </Breadcrumb.Link>
                      <Breadcrumb.Separator className="text-slate-400">
                        /
                      </Breadcrumb.Separator>
                    </>
                  )}
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Component Showcase</h1>
        <p className="text-slate-600 text-base">
          Explore Contextual UI components designed for humans, search engines, and AI agents.
        </p>
      </div>

      <section id="breadcrumb" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Breadcrumb</h2>
        <p className="text-slate-600 mb-6 text-sm leading-relaxed">
          The Breadcrumb component automatically injects Schema.org <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-xs font-mono border border-slate-200">BreadcrumbList</code> JSON-LD for search engine indexing while enforcing accessible semantic navigation.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner">
          <Breadcrumb.Root data={breadcrumbData} baseUrl="https://contextual-ui.dev">
            <Breadcrumb.List className="flex list-none p-0 m-0 gap-2 items-center text-sm">
              {breadcrumbData.map((item, index) => {
                const isLast = index === breadcrumbData.length - 1;
                return (
                  <Breadcrumb.Item key={item.id} id={item.id} className="flex items-center gap-2">
                    {isLast ? (
                      <Breadcrumb.Page className="font-semibold text-slate-900">
                        {item.label}
                      </Breadcrumb.Page>
                    ) : (
                      <>
                        <Breadcrumb.Link href={item.url!} className="text-blue-600 hover:underline no-underline">
                          {item.label}
                        </Breadcrumb.Link>
                        <Breadcrumb.Separator className="text-slate-400">
                          /
                        </Breadcrumb.Separator>
                      </>
                    )}
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </div>
      </section>
    </main>
  );
}
