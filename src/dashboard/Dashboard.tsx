'use client';

import React, { useState, useMemo } from 'react';
import { createForm } from '../components/form';

export interface ContextualDashboardProps {
  context: { raw: Record<string, any> };
  forms?: Record<string, any>;
  title?: string;
  className?: string;
}

export function ContextualDashboard({
  context,
  forms,
  title = 'Contextual UI - Dashboard',
  className = '',
}: ContextualDashboardProps) {
  const dataSections = Object.keys(context.raw);
  const formKeys = forms ? Object.keys(forms) : [];

  const [activeTab, setActiveTab] = useState<string>(
    dataSections[0] || formKeys[0] || ''
  );

  const formEntry = forms ? forms[activeTab] : undefined;
  const isFormTab = formEntry !== undefined;
  const formSchema = isFormTab
    ? isZodSchema(formEntry)
      ? formEntry
      : formEntry?.schema
    : undefined;

  const activeData = !isFormTab ? context.raw[activeTab] : null;

  const faqItems = !isFormTab ? getFaqItems(activeData) : [];
  const faqTitle = !isFormTab ? getFaqTitle(activeData) : undefined;
  const isFaq = !isFormTab && isFaqSection(activeTab, activeData);
  const isNavbar = !isFormTab && isNavbarSection(activeTab, activeData);

  const itemCount = isFormTab
    ? formSchema
      ? `${Object.keys(getSchemaFields(formSchema)).length} Schema Fields`
      : 'Interactive Form'
    : isFaq
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
          <div style={styles.sidebarTitle}>Registered Data</div>
          {dataSections.map((key) => (
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

          {formKeys.length > 0 && (
            <>
              <div style={{ ...styles.sidebarTitle, marginTop: '16px' }}>Form Registry</div>
              {formKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    ...styles.tabButton,
                    ...(activeTab === key ? styles.tabButtonActive : {}),
                  }}
                >
                  📝 {key.toUpperCase()}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Content Viewer */}
        <div style={styles.content}>
          {activeTab && (
            <div>
              <div style={styles.contentHeader}>
                <h2>Section: <span style={{ color: '#2563eb' }}>{activeTab}</span></h2>
                <span style={styles.countBadge}>
                  {itemCount !== null ? itemCount : 'Object Data'}
                </span>
              </div>

              {/* Schema-driven Renderers or Auto-Generated Form Sandboxes */}
              {formSchema ? (
                <AutoFormViewer schema={formSchema} />
              ) : isFaq ? (
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

function isZodSchema(obj: any): boolean {
  return obj && typeof obj.safeParse === 'function';
}

function getSchemaFields(schema: any): Record<string, any> {
  if (!schema) return {};
  if (typeof schema.shape === 'function') {
    return schema.shape();
  }
  if (schema.shape && typeof schema.shape === 'object') {
    return schema.shape;
  }
  if (schema._def && typeof schema._def.shape === 'function') {
    return schema._def.shape();
  }
  if (schema._def && schema._def.innerType) {
    return getSchemaFields(schema._def.innerType);
  }
  return {};
}

function getZodTypeName(typeDef: any): string {
  if (!typeDef) return 'unknown';
  const typeName = typeDef._def?.typeName || typeDef.constructor?.name;
  if (typeName) {
    return typeName.replace(/^Zod/, '').toLowerCase();
  }
  return 'any';
}

function AutoFormViewer({ schema }: { schema: any }) {
  const [subMode, setSubMode] = useState<'sandbox' | 'spec'>('sandbox');
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [submitError, setSubmitError] = useState<any>(null);

  const DynamicForm = useMemo(() => createForm(schema), [schema]);
  const fieldsMap = getSchemaFields(schema);
  const fieldNames = Object.keys(fieldsMap);

  return (
    <div>
      <div style={styles.subTabHeader}>
        <button
          onClick={() => setSubMode('sandbox')}
          style={{
            ...styles.subTabButton,
            ...(subMode === 'sandbox' ? styles.subTabButtonActive : {}),
          }}
        >
          🧪 Interactive Sandbox
        </button>
        <button
          onClick={() => setSubMode('spec')}
          style={{
            ...styles.subTabButton,
            ...(subMode === 'spec' ? styles.subTabButtonActive : {}),
          }}
        >
          📋 Schema Specification
        </button>
      </div>

      {subMode === 'sandbox' ? (
        <div>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
            Auto-generated interactive form based on Zod schema validation rules.
          </p>
          <DynamicForm.Root
            onSubmit={(data) => {
              setSubmittedData(data);
              setSubmitError(null);
            }}
            onError={(err) => {
              setSubmitError(err);
              setSubmittedData(null);
            }}
          >
            {fieldNames.map((fieldName) => {
              const isTextArea =
                fieldName.toLowerCase().includes('message') ||
                fieldName.toLowerCase().includes('description') ||
                fieldName.toLowerCase().includes('content');

              return (
                <div key={fieldName} style={{ marginBottom: '16px' }}>
                  <DynamicForm.Field name={fieldName as any}>
                    <DynamicForm.Label
                      style={{
                        display: 'block',
                        fontWeight: 600,
                        fontSize: '14px',
                        marginBottom: '6px',
                        color: '#374151',
                      }}
                    >
                      {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                    </DynamicForm.Label>
                    {isTextArea ? (
                      <DynamicForm.TextArea
                        style={styles.formInput}
                        placeholder={`Enter ${fieldName}...`}
                      />
                    ) : (
                      <DynamicForm.Input
                        style={styles.formInput}
                        placeholder={`Enter ${fieldName}...`}
                      />
                    )}
                    <DynamicForm.ErrorMessage
                      style={{
                        color: '#dc2626',
                        fontSize: '12px',
                        marginTop: '4px',
                        display: 'block',
                      }}
                    />
                  </DynamicForm.Field>
                </div>
              );
            })}

            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
              }}
            >
              <DynamicForm.Submit style={styles.submitButton}>
                Submit Form
              </DynamicForm.Submit>
              {submitError && (
                <span style={{ color: '#dc2626', fontSize: '13px' }}>
                  Validation failed. Check errors above.
                </span>
              )}
            </div>
          </DynamicForm.Root>

          {submittedData && (
            <div style={styles.successBox}>
              <strong>🎉 Validated & Submitted Successfully:</strong>
              <pre
                style={{
                  margin: '8px 0 0 0',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              >
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
            Inspect the underlying Zod schema rules, types, and constraints.
          </p>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Field Name</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Constraints / Description</th>
                </tr>
              </thead>
              <tbody>
                {fieldNames.map((fieldName) => {
                  const typeDef = fieldsMap[fieldName];
                  const typeName = getZodTypeName(typeDef);
                  const isOptional =
                    typeDef?._def?.typeName === 'ZodOptional' ||
                    typeDef?.isOptional?.();

                  return (
                    <tr key={fieldName} style={styles.tr}>
                      <td style={styles.tdQuestion}>{fieldName}</td>
                      <td style={styles.tdId}>{typeName}</td>
                      <td style={styles.td}>
                        {isOptional ? 'Optional' : 'Required'}
                        {typeDef?.description
                          ? ` — "${typeDef.description}"`
                          : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function getFaqItems(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    if (Array.isArray(data.items)) return data.items;
    for (const val of Object.values(data)) {
      if (
        Array.isArray(val) &&
        val.length > 0 &&
        (val[0]?.question || val[0]?.answer)
      ) {
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
    if (
      Array.isArray(data.items) &&
      (data.items.length === 0 || data.items[0]?.question !== undefined)
    ) {
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
  if (
    data &&
    typeof data === 'object' &&
    (data.brand !== undefined || Array.isArray(data.links))
  ) {
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
          <p style={{ margin: '0 0 6px 0' }}>
            <strong>Name:</strong> {data.brand.name}
          </p>
          <p style={{ margin: '0 0 6px 0' }}>
            <strong>Href:</strong> {data.brand.href}
          </p>
          {data.brand.logo && (
            <p style={{ margin: 0 }}>
              <strong>Logo:</strong> {data.brand.logo}
            </p>
          )}
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
  return <pre style={styles.pre}>{JSON.stringify(data, null, 2)}</pre>;
}

// Scoped inline styles for complete isolation and out-of-the-box beauty
const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    padding: '24px',
    margin: '0 auto',
    width: '100%',
    height: '100vh',
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
  formPreviewWrapper: {
    padding: '8px 0',
  },
  subTabHeader: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '12px',
  },
  subTabButton: {
    padding: '6px 12px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    color: '#4b5563',
  },
  subTabButtonActive: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    border: '1px solid #bfdbfe',
    fontWeight: 600,
  },
  formInput: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
  },
  successBox: {
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '6px',
    color: '#166534',
    fontSize: '14px',
  },
};
