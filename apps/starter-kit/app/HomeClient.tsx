'use client';

import { Faq, Navbar } from '@contextual-ui/core';

export function HomeClient({ data }: { data: any }) {

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#fcfcfd' }}>
      {/* Fixed Header Navbar */}
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '64px', 
        background: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(8px)', 
        borderBottom: '1px solid #e5e7eb', 
        zIndex: 50, 
        display: 'flex', 
        alignItems: 'center',
        padding: '0 24px'
      }}>
        <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Navbar.Root data={data.navbar} className="flex justify-between items-center w-full">
            <Navbar.Brand className="font-bold text-lg text-gray-900 no-underline flex items-center gap-2">
              <span style={{ background: '#2563eb', color: '#fff', width: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontSize: '14px' }}>C</span>
              Contextual UI
            </Navbar.Brand>
            <Navbar.Content className="flex gap-6 items-center">
              {data.navbar?.links.map((link: any) => (
                <a key={link.id} href={link.href} style={{ color: '#4b5563', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }}>
                  {link.label}
                </a>
              ))}
              <a href="/components" style={{ color: '#059669', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                Components
              </a>
            </Navbar.Content>
          </Navbar.Root>
        </div>
      </header>

      {/* Main Content with padding-top to account for fixed header */}
      <main style={{ padding: '104px 24px 48px', maxWidth: '800px', margin: '0 auto' }}>
        {data.announcement?.enabled && (
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', color: '#1e40af', fontSize: '14px' }}>
            {data.announcement.message}
          </div>
        )}

        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>FAQ Section</h1>
        <Faq.Root data={data.faq}>
          {data.faq.map((item: any) => (
            <Faq.Item key={item.id} id={item.id} className="mb-4 border-b border-gray-200 pb-3">
              <Faq.Trigger className="bg-transparent border-none font-semibold text-base cursor-pointer text-left w-full text-gray-800">
                {item.question}
              </Faq.Trigger>
              <Faq.Content className="mt-2 text-gray-600 text-sm leading-relaxed">
                {item.answer}
              </Faq.Content>
            </Faq.Item>
          ))}
        </Faq.Root>

        <div style={{ marginTop: '40px', borderTop: '1px solid #e5e7eb', paddingTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/components" style={{ background: '#059669', color: '#fff', padding: '10px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            Explore Components Showcase &rarr;
          </a>
          <a href="/cms" style={{ background: '#2563eb', color: '#fff', padding: '10px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            Open CMS Dashboard &rarr;
          </a>
          <a href="/api/contextual" target="_blank" style={{ background: '#4b5563', color: '#fff', padding: '10px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            View AI Agent API JSON &rarr;
          </a>
        </div>
      </main>
    </div>
  );
}
