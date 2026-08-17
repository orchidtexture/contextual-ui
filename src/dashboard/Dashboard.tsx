'use client';

import React, { useState } from 'react';

export interface ContextualDashboardProps {
  context: { raw: Record<string, any> };
  title?: string;
  className?: string;
}

export function ContextualDashboard({
  context,
  title = 'Contextual UI - Dashboard',
  className = '',
}: ContextualDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>(
    Object.keys(context.raw)[0] || ''
  );

  const sections = Object.keys(context.raw);
  const activeData = context.raw[activeTab];

  const faqItems = getFaqItems(activeData);
  const faqTitle = getFaqTitle(activeData);
  const isFaq = isFaqSection(activeTab, activeData);
  const isNavbar = isNavbarSection(activeTab, activeData);

  const itemCount = isFaq
    ? faqItems.length
    : Array.isArray(activeData)
    ? activeData.length
    : Array.isArray(activeData?.items)
    ? activeData.items.length
    : Array.isArray(activeData?.links)
    ? activeData.links.length
    : null;

  return (
    <div
      style={styles.container}
      className={className}
      data-contextual="dashboard-root"
    >
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{title}</h1>
          <p style={styles.subtitle}>
            Single Source of Truth (SSOT) inspection for AI agents, search engines, and human operators.
          </p>
        </div>
      </div>

      {/* Layout */}
      <div style={styles.layout}>
        {/* Sidebar / Section Switcher */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarTitle}>Registered Sections</div>
          {sections.map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                ...styles.tabButton,
                ...(activeTab === key ? styles.tabButtonActive : {}),
              }}
            >
              📂 {key.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Content Viewer */}
        <div style={styles.content}>
          {activeTab && (
            <div>
              <div style={styles.contentHeader}>
                <h2>Section: <span style={{ color: '#2563eb' }}>{activeTab}</span></h2>
                <span style={styles.countBadge}>
                  {itemCount !== null ? `${itemCount} items` : 'Object Data'}
                </span>
              </div>

              {/* Schema-driven Renderers */}
              {isFaq ? (
                <FaqTable data={faqItems} title={faqTitle} />
              ) : isNavbar ? (
                <NavbarViewer data={activeData} />
              ) : (
                <JsonViewer data={activeData} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getFaqItems(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    if (Array.isArray(data.items)) return data.items;
    for (const val of Object.values(data)) {
      if (Array.isArray(val) && val.length > 0 && (val[0]?.question || val[0]?.answer)) {
        return val;
      }
    }
  }
  return [];
}

function getFaqTitle(data: any): string | undefined {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    if (typeof data.title === 'string') return data.title;
  }
  return undefined;
}

function isFaqSection(tab: string, data: any): boolean {
  if (tab.toLowerCase() === 'faq') return true;
  if (Array.isArray(data)) {
    return data.length === 0 || data[0]?.question !== undefined;
  }
  if (data && typeof data === 'object') {
    if (Array.isArray(data.items) && (data.items.length === 0 || data.items[0]?.question !== undefined)) {
      return true;
    }
    for (const val of Object.values(data)) {
      if (Array.isArray(val) && val.length > 0 && val[0]?.question !== undefined) {
        return true;
      }
    }
  }
  return false;
}

function isNavbarSection(tab: string, data: any): boolean {
  if (tab.toLowerCase() === 'navbar' || tab.toLowerCase() === 'nav') return true;
  if (data && typeof data === 'object' && (data.brand !== undefined || Array.isArray(data.links))) {
    return true;
  }
  return false;
}

function FaqTable({ data, title }: { data: any[]; title?: string }) {
  return (
    <div>
      {title && <h3 style={styles.cardTitle}>{title}</h3>}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Question</th>
              <th style={styles.th}>Answer</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id || index} style={styles.tr}>
                <td style={styles.tdId}>{item.id || index + 1}</td>
                <td style={styles.tdQuestion}>{item.question}</td>
                <td style={styles.td}>{item.answer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NavbarViewer({ data }: { data: any }) {
  return (
    <div>
      {data?.brand && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Brand Information</h3>
          <p style={{ margin: '0 0 6px 0' }}><strong>Name:</strong> {data.brand.name}</p>
          <p style={{ margin: '0 0 6px 0' }}><strong>Href:</strong> {data.brand.href}</p>
          {data.brand.logo && <p style={{ margin: 0 }}><strong>Logo:</strong> {data.brand.logo}</p>}
        </div>
      )}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Navigation Links</h3>
        <ul style={styles.ul}>
          {data?.links?.map((link: any, index: number) => (
            <li key={link.id || index} style={styles.li}>
              <span>🔗 {link.label}</span>
              <span style={styles.muted}>({link.href || 'No Href'})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function JsonViewer({ data }: { data: any }) {
  return (
    <pre style={styles.pre}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

// Scoped inline styles for complete isolation and out-of-the-box beauty
const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px',
    // maxWidth: '1200px',
    margin: '0 auto',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '16px',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  layout: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  sidebar: {
    width: '240px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sidebarTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px',
  },
  tabButton: {
    textAlign: 'left',
    padding: '10px 14px',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#4b5563',
    transition: 'all 0.2s',
  },
  tabButtonActive: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    border: '1px solid #bfdbfe',
    fontWeight: '600',
  },
  content: {
    flexGrow: 1,
    minWidth: '280px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    minHeight: '400px',
  },
  contentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #f3f4f6',
    paddingBottom: '12px',
    marginBottom: '16px',
  },
  countBadge: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '12px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '14px',
  },
  th: {
    backgroundColor: '#f9fafb',
    color: '#374151',
    padding: '10px 12px',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: '600',
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #f3f4f6',
    color: '#4b5563',
  },
  tdId: {
    padding: '10px 12px',
    borderBottom: '1px solid #f3f4f6',
    fontFamily: 'monospace',
    color: '#9ca3af',
    fontSize: '12px',
  },
  tdQuestion: {
    padding: '10px 12px',
    borderBottom: '1px solid #f3f4f6',
    fontWeight: '600',
    color: '#1f2937',
  },
  tr: {
    transition: 'background-color 0.2s',
  },
  card: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginTop: 0,
    marginBottom: '12px',
  },
  ul: {
    margin: 0,
    paddingLeft: '20px',
  },
  li: {
    marginBottom: '8px',
    fontSize: '14px',
  },
  muted: {
    color: '#9ca3af',
    marginLeft: '6px',
    fontSize: '12px',
  },
  pre: {
    backgroundColor: '#1f2937',
    color: '#f3f4f6',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontFamily: 'monospace',
    overflowX: 'auto',
  },
};
