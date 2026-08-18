'use client';

import { Faq, Navbar } from '@contextual-ui/core';

export function HomeClient({ data }: { data: any }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Fixed Header Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center px-6 shadow-sm">
        <div className="max-w-3xl w-full mx-auto flex justify-between items-center">
          <Navbar.Root data={data.navbar} className="flex justify-between items-center w-full">
            <Navbar.Brand href="/" className="font-bold text-lg text-slate-900 no-underline flex items-center gap-2.5">
              <span className="bg-blue-600 text-white w-7 h-7 inline-flex items-center justify-center rounded-lg text-sm font-semibold shadow-sm">
                C
              </span>
              Contextual UI
            </Navbar.Brand>
            <Navbar.Content className="flex gap-6 items-center">
              {data.navbar?.links.map((link: any) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="text-slate-600 hover:text-blue-600 no-underline text-sm font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/components"
                className="text-emerald-600 hover:text-emerald-700 no-underline text-sm font-semibold transition-colors"
              >
                Components
              </a>
            </Navbar.Content>
          </Navbar.Root>
        </div>
      </header>

      {/* Main Content with padding-top to account for fixed header */}
      <main className="pt-28 pb-16 px-6 max-w-3xl mx-auto">
        {data.announcement?.enabled && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6 text-blue-900 text-sm shadow-sm">
            {data.announcement.message}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">FAQ Section</h1>
          <p className="text-slate-600 text-base">
            Frequently asked questions powered by Contextual UI and Schema.org semantic structured data.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <Faq.Root data={data.faq}>
            {data.faq.map((item: any) => (
              <Faq.Item key={item.id} id={item.id} className="mb-4 last:mb-0 border-b border-slate-100 last:border-b-0 pb-4 last:pb-0">
                <Faq.Trigger className="bg-transparent border-none font-semibold text-base cursor-pointer text-left w-full text-slate-800 hover:text-blue-600 transition-colors py-1">
                  {item.question}
                </Faq.Trigger>
                <Faq.Content className="mt-2 text-slate-600 text-sm leading-relaxed">
                  {item.answer}
                </Faq.Content>
              </Faq.Item>
            ))}
          </Faq.Root>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 flex gap-3 flex-wrap items-center">
          <a
            href="/components"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg no-underline text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            Explore Components Showcase &rarr;
          </a>
          <a
            href="/cms"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg no-underline text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            Open CMS Dashboard &rarr;
          </a>
          <a
            href="/api/contextual"
            target="_blank"
            className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg no-underline text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            View AI Agent API JSON &rarr;
          </a>
        </div>
      </main>
    </div>
  );
}
