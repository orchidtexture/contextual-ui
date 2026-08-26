'use client';

import { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-okaidia.css';
import { ContextualSite, Breadcrumb, Navbar, Faq, Footer } from '@contextual-ui/core';
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
  children?: React.ReactNode;
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
    <section id={id} className="border-b border-base shadow-sm scroll-mt-28 pb-12">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <p className="mb-6 text-sm leading-relaxed text-zinc-300">{description}</p>

      {children && (
        <div className="border border-base rounded-xl p-4 shadow-inner mb-6">
          {children}
        </div>
      )}

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

      <pre className="!bg-zinc-900 !text-zinc-100 p-6 !rounded-xl text-xs font-mono overflow-x-auto border border-base shadow-inner">
        <code className={activeTab === 'example' ? 'language-jsx' : 'language-json'}>
          {activeTab === 'example' ? codeString : schemaString}
        </code>
      </pre>
    </section>
  );
}

export function DocsClient({ data }: { data: SiteData }) {
  const [activeId, setActiveId] = useState<string>('contextual-site');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-120px 0px -50% 0px' }
    );

    const sections = ['contextual-site', 'navbar', 'footer', 'breadcrumb', 'faq'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const breadcrumbData = [
    { id: '1', label: 'Home', url: '/' },
    { id: '2', label: 'Docs', url: '/docs' },
    { id: '3', label: 'Showcase', url: '/docs#showcase' },
  ];

  const faqData = [
    { id: '1', question: 'What kind of bear is best?', answer: 'Black bear.' },
    { id: '2', question: 'What do bears eat?', answer: 'Beets.' },
    { id: '3', question: 'Is identity theft a joke?', answer: "It's not. Millions of families suffer every year!" }
  ];

  const contextualSiteCode = `import { siteApp } from '@/data/site.server';
import { ContextualSite, Navbar, Faq } from '@contextual-ui/core';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await siteApp.fetchData();
  const graph = await siteApp.getGraph({
    graphOptions: { baseUrl: 'https://contextual.site' },
  });

  return (
    <html lang="en">
      <body>
        <ContextualSite data={data} graph={graph}>
          {/* Child components automatically infer data from context */}
          <Navbar.Root />
          {children}
        </ContextualSite>
      </body>
    </html>
  );
}`;

  const contextualSiteSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://contextual.site/#website",
        "name": data.website?.name || "Contextual UI Starter Kit",
        "url": "https://contextual.site",
        "description": data.website?.description || "A headless UI and semantic SEO Knowledge Graph starter kit."
      },
      {
        "@type": "SiteNavigationElement",
        "@id": "https://contextual.site/#navbar",
        "name": "Navigation Bar",
        "isPartOf": { "@id": "https://contextual.site/#website" },
        "hasPart": data.navbar?.links.map(link => ({
          "@type": "WebPage",
          "name": link.label,
          "url": link.href
        }))
      },
      {
        "@type": "FAQPage",
        "@id": "https://contextual.site/#faq",
        "isPartOf": { "@id": "https://contextual.site/#website" },
        "mainEntity": (data.faq || []).map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      }
    ]
  }, null, 2);

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

  const footerCode = `<Footer.Root data={data.footer} className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-400">
  <div className="flex items-center gap-2">
    <span>Maintained by</span>
    <a
      href="https://tasuku.io"
      target="_blank"
      rel="noopener noreferrer"
      className="text-zinc-200 hover:text-accent font-semibold transition-colors underline underline-offset-4"
    >
      {data.footer?.copyright?.holder || 'Tasuku Studio'}
    </a>
  </div>
  <div className="flex items-center gap-6">
    {data.footer?.links?.map((link) => (
      <Footer.Link
        key={link.id}
        item={link}
        className="hover:text-zinc-200 transition-colors"
      />
    ))}
  </div>
</Footer.Root>`;

  const footerSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WPFooter",
    "name": data.footer?.brand?.name || "Contextual UI",
    "url": data.footer?.brand?.href || "/",
    "copyrightHolder": {
      "@type": "Organization",
      "name": data.footer?.copyright?.holder || "Tasuku Studio"
    },
    "copyrightYear": new Date().getFullYear(),
    "hasPart": (data.footer?.links || []).map(link => ({
      "@type": "SiteNavigationElement",
      "name": link.label,
      "url": link.href
    }))
  }, null, 2);

  const breadcrumbCode = `<Breadcrumb.Root data={breadcrumbData} baseUrl="https://contextual.site">
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
      "item": `https://contextual.site${item.url}`
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
    <div className="pt-24 pb-28 max-w-7xl mx-auto px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Docs & Components</h1>
        <p className="text-zinc-400 text-sm">
          Explore Contextual UI site providers and components designed for humans, search engines, and AI agents.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start relative">
        {/* Left Side Menu */}
        <aside className="hidden lg:block lg:sticky lg:top-24 w-64 shrink-0 space-y-6">
          <div className="backdrop-blur-sm shadow-sm space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 px-2 pt-2">
              Documentation
            </h3>
            <nav className="space-y-1">
              {[
                { id: 'contextual-site', label: 'ContextualSite', desc: 'Site Provider & Graph' },
                { id: 'navbar', label: 'Navbar', desc: 'Navigation Bar' },
                { id: 'footer', label: 'Footer', desc: 'Footer & Attribution' },
                { id: 'breadcrumb', label: 'Breadcrumb', desc: 'Breadcrumb Trail' },
                { id: 'faq', label: 'FAQ', desc: 'FAQ & Questions' },
              ].map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                      setActiveId(item.id);
                    }}
                    className={`flex flex-col px-3 py-2.5 rounded-xl text-sm transition-colors no-underline ${
                      isActive
                        ? 'text-accent border border-base shadow-sm font-medium'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'
                    }`}
                  >
                    <span className="font-semibold">{item.label}</span>
                    <span className="text-[11px] text-zinc-400">{item.desc}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 space-y-12 w-full">
          {/* Mobile Navigation Pills */}
          <div className="flex lg:hidden overflow-x-auto gap-2 pb-2 border-b border-base w-full">
            {[
              { id: 'contextual-site', label: 'ContextualSite' },
              { id: 'navbar', label: 'Navbar' },
              { id: 'footer', label: 'Footer' },
              { id: 'breadcrumb', label: 'Breadcrumb' },
              { id: 'faq', label: 'FAQ' },
            ].map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                    setActiveId(item.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors no-underline ${
                    isActive
                      ? 'bg-zinc-900 text-accent border border-base'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* ContextualSite Showcase */}
          <ShowcaseSection
            id="contextual-site"
            title="<ContextualSite /> Provider"
            description="The root provider that coordinates domain-level data distribution to all contextual UI components and consolidates their schema data into a single, unified Schema.org JSON-LD @graph."
            codeString={contextualSiteCode}
            schemaString={contextualSiteSchema}
            exampleDescription="Wrap your root layout with ContextualSite to provide data and unified @graph script."
            schemaDescription="Unified Schema.org @graph automatically injected in a single script tag."
          />

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
            <Navbar.Root data={data.navbar} className="w-full relative">
              <div className="flex justify-between items-center w-full">
                <Navbar.Brand className="font-bold text-lg no-underline flex items-center gap-2.5">
                  <img
                    src="/images/contextual-ui-logo.png"
                    alt="Contextual UI Logo"
                    className="w-7 h-7 rounded-md object-contain shadow-sm text-silver bg-zinc-950 border border-base"
                  />
                  Contextual UI
                </Navbar.Brand>
                <Navbar.Content className="hidden md:flex gap-6 items-center">
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
                <Navbar.Toggle className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 focus:outline-none cursor-pointer" />
              </div>
              <Navbar.Menu className="absolute top-16 left-[-24px] right-[-24px] md:hidden bg-zinc-950/95 backdrop-blur-xl border-b border-base p-6 flex flex-col gap-4 shadow-2xl">
                {data.navbar?.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    className="hover:text-silver no-underline text-base font-medium transition-colors py-1"
                  >
                    {link.label}
                  </a>
                ))}
              </Navbar.Menu>
            </Navbar.Root>
          </ShowcaseSection>

          {/* Footer Showcase */}
          <ShowcaseSection
            id="footer"
            title="Footer"
            description="The Footer component organizes structured site links, brand metadata, and legal attribution with automatic Schema.org WPFooter structured data injection."
            codeString={footerCode}
            schemaString={footerSchema}
            exampleDescription="Accessible footer layout with links and copyright."
            schemaDescription="Schema.org WPFooter automatically injected in the DOM."
          >
            <Footer.Root data={data.footer} className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span>Maintained by</span>
                <a
                  href="https://tasuku.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-200 hover:text-accent font-semibold transition-colors underline underline-offset-4 decoration-zinc-700 hover:decoration-accent"
                >
                  {data.footer?.copyright?.holder || 'Tasuku Studio'}
                </a>
              </div>
              <div className="flex items-center gap-6">
                {data.footer?.links?.map((link) => (
                  <Footer.Link
                    key={link.id}
                    item={link}
                    className="hover:text-zinc-200 transition-colors"
                  />
                ))}
              </div>
            </Footer.Root>
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
            <Breadcrumb.Root data={breadcrumbData} baseUrl="https://contextual.site">
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
        </div>
      </div>
    </div>
  );
}
