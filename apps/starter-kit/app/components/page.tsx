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
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '14px' }}>
          &larr; Back to Home
        </Link>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <Breadcrumb.Root data={breadcrumbData} baseUrl="https://contextual-ui.dev">
          <Breadcrumb.List style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '8px', alignItems: 'center', fontSize: '14px' }}>
            {breadcrumbData.map((item, index) => {
              const isLast = index === breadcrumbData.length - 1;
              return (
                <Breadcrumb.Item key={item.id} id={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isLast ? (
                    <Breadcrumb.Page style={{ fontWeight: 600, color: '#111827' }}>
                      {item.label}
                    </Breadcrumb.Page>
                  ) : (
                    <>
                      <Breadcrumb.Link href={item.url!} style={{ color: '#2563eb', textDecoration: 'none' }}>
                        {item.label}
                      </Breadcrumb.Link>
                      <Breadcrumb.Separator style={{ color: '#9ca3af' }}>
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

      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Component Showcase</h1>
      <p style={{ color: '#4b5563', marginBottom: '32px' }}>
        Explore Contextual UI components designed for humans, search engines, and AI agents.
      </p>

      <section id="breadcrumb" style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>Breadcrumb</h2>
        <p style={{ color: '#4b5563', marginBottom: '16px', fontSize: '15px', lineHeight: '1.5' }}>
          The Breadcrumb component automatically injects Schema.org <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>BreadcrumbList</code> JSON-LD for search engine indexing while enforcing accessible semantic navigation.
        </p>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
          <Breadcrumb.Root data={breadcrumbData} baseUrl="https://contextual-ui.dev">
            <Breadcrumb.List style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '8px', alignItems: 'center', fontSize: '14px' }}>
              {breadcrumbData.map((item, index) => {
                const isLast = index === breadcrumbData.length - 1;
                return (
                  <Breadcrumb.Item key={item.id} id={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isLast ? (
                      <Breadcrumb.Page style={{ fontWeight: 600, color: '#111827' }}>
                        {item.label}
                      </Breadcrumb.Page>
                    ) : (
                      <>
                        <Breadcrumb.Link href={item.url!} style={{ color: '#2563eb', textDecoration: 'none' }}>
                          {item.label}
                        </Breadcrumb.Link>
                        <Breadcrumb.Separator style={{ color: '#9ca3af' }}>
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
