'use client';

import { Faq, Navbar } from '@contextual-ui/core';

export function HomeClient({ data }: { data: any }) {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {data.announcement?.enabled && (
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', color: '#1e40af' }}>
          {data.announcement.message}
        </div>
      )}

      <Navbar.Root data={data.navbar} className="flex justify-between items-center mb-10">
        <Navbar.Brand className="font-bold text-xl no-underline text-black" />
        <Navbar.Content className="flex gap-4">
          {data.navbar?.links.map((link: any) => (
            <a key={link.id} href={link.href} style={{ color: '#2563eb', textDecoration: 'none' }}>{link.label}</a>
          ))}
        </Navbar.Content>
      </Navbar.Root>

      <h1>FAQ Section</h1>
      <Faq.Root data={data.faq}>
        {data.faq.map((item: any) => (
          <Faq.Item key={item.id} id={item.id} className="mb-4 border-b border-gray-200 pb-3">
            <Faq.Trigger className="bg-transparent border-none font-semibold text-base cursor-pointer text-left w-full">
              {item.question}
            </Faq.Trigger>
            <Faq.Content className="mt-2 text-gray-600">
              {item.answer}
            </Faq.Content>
          </Faq.Item>
        ))}
      </Faq.Root>

      <div style={{ marginTop: '40px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
        <a href="/cms" style={{ background: '#2563eb', color: '#fff', padding: '10px 16px', borderRadius: '6px', textDecoration: 'none', marginRight: '12px' }}>
          Open CMS Dashboard &rarr;
        </a>
        <a href="/api/contextual" target="_blank" style={{ background: '#4b5563', color: '#fff', padding: '10px 16px', borderRadius: '6px', textDecoration: 'none' }}>
          View AI Agent API JSON &rarr;
        </a>
      </div>
    </main>
  );
}
