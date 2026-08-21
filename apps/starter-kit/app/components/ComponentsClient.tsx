'use client';

import { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-okaidia.css';
import { Breadcrumb, Navbar, Faq } from '@contextual-ui/core';
import type { SiteData } from '@/data/site.server';

function ShowcaseSection({
  id,
  title,
  description,
  children,
  codeString,
  schemaString,
  exampleDescription,
  schemaDescription,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
  codeString: string;
  schemaString: string;
  exampleDescription: string;
  schemaDescription: string;
}) {
  const [activeTab, setActiveTab] = useState<'example' | 'schema'>('example');

  useEffect(() => {
    Prism.highlightAll();
  }, [activeTab]);

  return (
    <section id={id} className="border border-base rounded-2xl p-10 shadow-sm">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <p className="mb-6 text-sm leading-relaxed">{description}</p>

      <div className="border border-base rounded-xl p-4 shadow-inner mb-6">
        {children}
      </div>

      <div className="flex flex-col justify-start items-start pb-2 mb-2 gap-4">
        <div className="flex ml-auto border border-base">
          <button
            onClick={() => setActiveTab('example')}
            className={`py-1.5 px-3 text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'example'
                ? 'bg-zinc-800 text-accent'
                : ' hover:bg-zinc-900'
            }`}
            type="button"
          >
            Example Code
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`p-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'schema'
                ? 'bg-zinc-800 text-accent'
                : ' hover:bg-zinc-900'
            }`}
            type="button"
          >
            JSONLD
          </button>
        </div>
        <span className="text-sm text-zinc-400 font-medium">
          {activeTab === 'example' ? exampleDescription : schemaDescription}
        </span>
      </div>

      <pre className="!bg-zinc-950 !text-zinc-100 p-6 rounded-xl text-xs font-mono overflow-x-auto border border-base shadow-inner">
        <code className={activeTab === 'example' ? 'language-jsx' : 'language-json'}>
          {activeTab === 'example' ? codeString : schemaString}
        </code>
      </pre>
    </section>
  );
}

export function ComponentsClient({ data }: { data: SiteData }) {
  const breadcrumbData = [
    { id: '1', label: 'Home', url: '/' },
    { id: '2', label: 'Components', url: '/components' },
    { id: '3', label: 'Showcase', url: '/components#showcase' },
  ];

  const faqData = [
    { id: '1', question: 'What kind of bear is best?', answer: 'Black bear.' },
    { id: '2', question: 'What do bears eat?', answer: 'Beets.' },
    { id: '3', question: 'Is identity theft a joke?', answer: "It's not. Millions of families suffer every year!" }
  ];

  const navbarCode = `<Navbar.Root data={data.navbar} className="flex justify-between items-center w-full">
  <Navbar.Brand className="font-bold text-lg no-underline flex items-center gap-2.5">
    <span>気</span> Contextual UI
  </Navbar.Brand>
  <Navbar.Content className="flex gap-6 items-center">
    {data.navbar?.links.map((link) => (
      <a key={link.id} href={link.href}>{link.label}</a>
    ))}
  </Navbar.Content>
</Navbar.Root>`;

  const navbarSchema = JSON.stringify({
    "@type": "SiteNavigationElement",
    "name": "Navigation Bar",
    "brand": {
      "@type": "Brand",
      "name": "Contextual UI",
      "url": "/"
    },
    "hasPart": data.navbar?.links.map(link => ({
      "@type": "WebPage",
      "name": link.label,
      "url": link.href
    }))
  }, null, 2);

  const breadcrumbCode = `<Breadcrumb.Root data={breadcrumbData} baseUrl="https://contextual-ui.dev">
  <Breadcrumb.List className="flex list-none p-0 m-0 gap-2 items-center text-sm">
    {breadcrumbData.map((item, index) => (
      <Breadcrumb.Item key={item.id}>
        <Breadcrumb.Link href={item.url}>{item.label}</Breadcrumb.Link>
      </Breadcrumb.Item>
    ))}
  </Breadcrumb.List>
</Breadcrumb.Root>`;

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbData.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://contextual-ui.dev${item.url}`
    }))
  }, null, 2);

  const faqCode = `<Faq.Root data={faqData}>
  {faqData.map((item) => (
    <Faq.Item key={item.id} id={item.id}>
      <Faq.Trigger>{item.question}</Faq.Trigger>
      <Faq.Content>{item.answer}</Faq.Content>
    </Faq.Item>
  ))}
</Faq.Root>`;

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  }, null, 2);

  return (
    <div className="pt-12">
      <main className="min-h-screen p-16 mx-auto space-y-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-4">Components</h1>
          <p className="text-zinc-400">
            Explore Contextual UI components designed for humans, search engines, and AI agents.
          </p>
        </div>

        {/* Navbar Showcase */}
        <ShowcaseSection
          id="navbar"
          title="Navbar"
          description="The Navbar component renders accessible navigation structures with full semantic support."
          codeString={navbarCode}
          schemaString={navbarSchema}
          exampleDescription="React component implementation using Navbar subcomponents."
          schemaDescription="Schema.org SiteNavigationElement automatically injected in the DOM."
        >
          <Navbar.Root data={data.navbar} className="flex justify-between items-center w-full">
            <Navbar.Brand className="font-bold text-lg no-underline flex items-center gap-2.5">
              <img
                src="/images/contextual-ui-logo.png"
                alt="Contextual UI Logo"
                className="w-7 h-7 rounded-md object-contain shadow-sm text-silver bg-zinc-950 border border-base"
              />
              Contextual UI
            </Navbar.Brand>
            <Navbar.Content className="flex gap-6 items-center">
              {data.navbar?.links.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="hover:text-silver no-underline text-sm font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </Navbar.Content>
          </Navbar.Root>
        </ShowcaseSection>

        {/* Breadcrumb Showcase */}
        <ShowcaseSection
          id="breadcrumb"
          title="Breadcrumb"
          description="The Breadcrumb component automatically injects Schema.org BreadcrumbList JSON-LD for search engine indexing while enforcing accessible semantic navigation."
          codeString={breadcrumbCode}
          schemaString={breadcrumbSchema}
          exampleDescription="Accessible breadcrumb trail implementation with list items and separators."
          schemaDescription="Schema.org BreadcrumbList automatically injected in the DOM."
        >
          <Breadcrumb.Root data={breadcrumbData} baseUrl="https://contextual-ui.dev">
            <Breadcrumb.List className="flex list-none p-0 m-0 gap-2 items-center text-sm">
              {breadcrumbData.map((item, index) => {
                const isLast = index === breadcrumbData.length - 1;
                return (
                  <Breadcrumb.Item key={item.id} id={item.id} className="flex items-center gap-2">
                    {isLast ? (
                      <Breadcrumb.Page className="font-semibold">
                        {item.label}
                      </Breadcrumb.Page>
                    ) : (
                      <>
                        <Breadcrumb.Link href={item.url!} className="text-accent hover:underline no-underline">
                          {item.label}
                        </Breadcrumb.Link>
                        <Breadcrumb.Separator className="text-zinc-400">
                          /
                        </Breadcrumb.Separator>
                      </>
                    )}
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </ShowcaseSection>

        {/* FAQ Showcase */}
        <ShowcaseSection
          id="faq"
          title="FAQ"
          description="The FAQ component organizes collapsible question-and-answer pairs with automatic Schema.org FAQPage structured data injection."
          codeString={faqCode}
          schemaString={faqSchema}
          exampleDescription="Collapsible FAQ layout with trigger buttons and content sections."
          schemaDescription="Schema.org FAQPage automatically injected in the DOM."
        >
          <Faq.Root data={faqData}>
            {faqData.map((item) => (
              <Faq.Item key={item.id} id={item.id} className="mb-4 last:mb-0 border-b border-base last:border-b-0 pb-4 last:pb-0">
                <Faq.Trigger className="bg-transparent border-none font-semibold text-base cursor-pointer text-left w-full hover:text-accent transition-colors py-1">
                  {`${item.id}. ${item.question}`}
                </Faq.Trigger>
                <Faq.Content className="mt-2 text-zinc-400 text-sm leading-relaxed">
                  {item.answer}
                </Faq.Content>
              </Faq.Item>
            ))}
          </Faq.Root>
        </ShowcaseSection>
      </main>
    </div>
  );
}
