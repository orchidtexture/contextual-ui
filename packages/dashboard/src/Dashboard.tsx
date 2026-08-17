'use client';

import { useState, useMemo } from 'react';
import { createForm, getFieldMetadata } from '@contextual-ui/core';
import dashboardCss from './dashboard.css';

export interface ContextualDashboardProps {
  context: { 
    raw: Record<string, any>;
    config?: Record<string, any> 
  };
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const formEntry = forms ? forms[activeTab] : undefined;
  const isFormTab = formEntry !== undefined;
  const formSchema = isFormTab
    ? isZodSchema(formEntry)
      ? formEntry
      : formEntry?.schema
    : undefined;

  const activeData = !isFormTab ? context.raw[activeTab] : null;
  const sectionConfig = context.config ? context.config[activeTab] : undefined;
  const sectionType = sectionConfig?.type;
  const generateJsonLd = sectionConfig?.generateJsonLd;

  const faqItems = sectionType === 'faq' ? getFaqItems(activeData) : !isFormTab ? getFaqItems(activeData) : [];
  const faqTitle = sectionType === 'faq' ? getFaqTitle(activeData) : !isFormTab ? getFaqTitle(activeData) : undefined;
  const isFaq = sectionType === 'faq' || (!isFormTab && isFaqSection(activeTab, activeData));
  const isNavbar = sectionType === 'navbar' || (!isFormTab && isNavbarSection(activeTab, activeData));

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
      className={`contextual-dashboard ${className}`}
      data-contextual="dashboard-root"
    >
      <style dangerouslySetInnerHTML={{ __html: dashboardCss }} />
      {/* Header */}
      <div className="contextual-dashboard-header">
        <div>
          <h1 className="contextual-dashboard-title">{title}</h1>
          <p className="contextual-dashboard-subtitle">
            Single Source of Truth (SSOT) inspection for AI agents, search engines, and human operators.
          </p>
        </div>
      </div>

      {/* Layout */}
      <div className="contextual-dashboard-layout">
        {/* Collapsible Sidebar / Section Switcher */}
        <div
          className={`contextual-sidebar ${
            isSidebarCollapsed ? 'collapsed' : ''
          }`}
        >
          <div className="contextual-sidebar-header">
            <span className="contextual-sidebar-title">Navigation</span>
            <button
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              className="contextual-sidebar-toggle"
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              type="button"
            >
              {isSidebarCollapsed ? '»' : '«'}
            </button>
          </div>

          <div className="contextual-nav-group">
            <div className="contextual-nav-group-title">Registered Data</div>
            {dataSections.map((key) => (
              <button
                key={key}
                onClick={() => {
                  console.log('Tab clicked:', key);
                  setActiveTab(key);
                }}
                title={key.toUpperCase()}
                className={`contextual-tab-button ${
                  activeTab === key ? 'contextual-tab-button-active' : ''
                }`}
                type="button"
                style={{ position: 'relative', zIndex: 10 }}
              >
                <span style={{ pointerEvents: 'none' }}>📂</span>
                <span className="label" style={{ pointerEvents: 'none' }}>{key.toUpperCase()}</span>
              </button>
            ))}
          </div>

          {formKeys.length > 0 && (
            <div className="contextual-nav-group" style={{ marginTop: '16px' }}>
              <div className="contextual-nav-group-title">Form Registry</div>
              {formKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    console.log('Form tab clicked:', key);
                    setActiveTab(key);
                  }}
                  title={key.toUpperCase()}
                  className={`contextual-tab-button ${
                    activeTab === key ? 'contextual-tab-button-active' : ''
                  }`}
                  type="button"
                  style={{ position: 'relative', zIndex: 10 }}
                >
                  <span style={{ pointerEvents: 'none' }}>📝</span>
                  <span className="label" style={{ pointerEvents: 'none' }}>{key.toUpperCase()}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Viewer */}
        <div className="contextual-content">
          {activeTab && (
            <div>
              <div className="contextual-content-header">
                <h2>
                  Section: <span style={{ color: '#2563eb' }}>{activeTab}</span>
                </h2>
                <span className="contextual-count-badge">
                  {itemCount !== null ? itemCount : 'Object Data'}
                </span>
              </div>

              {/* Schema-driven Renderers or Auto-Generated Form Sandboxes */}
              {formSchema ? (
                <AutoFormViewer schema={formSchema} />
              ) : generateJsonLd ? (
                <SchemaAwareViewer 
                  data={activeData} 
                  generateJsonLd={generateJsonLd} 
                  isFaq={isFaq}
                  faqItems={faqItems}
                  faqTitle={faqTitle}
                  isNavbar={isNavbar}
                />
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
      <div className="contextual-sub-tab-header">
        <button
          onClick={() => setSubMode('sandbox')}
          className={`contextual-sub-tab-button ${
            subMode === 'sandbox' ? 'contextual-sub-tab-button-active' : ''
          }`}
          type="button"
        >
          🧪 Interactive Sandbox
        </button>
        <button
          onClick={() => setSubMode('spec')}
          className={`contextual-sub-tab-button ${
            subMode === 'spec' ? 'contextual-sub-tab-button-active' : ''
          }`}
          type="button"
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
              const typeDef = fieldsMap[fieldName];
              const meta = getFieldMetadata(typeDef) || {};
              const widgetType = meta.widget || (
                fieldName.toLowerCase().includes('message') ||
                fieldName.toLowerCase().includes('description') ||
                fieldName.toLowerCase().includes('content')
                  ? 'textarea'
                  : 'text'
              );
              const label = meta.label || (fieldName.charAt(0).toUpperCase() + fieldName.slice(1));
              const placeholder = meta.placeholder || `Enter ${fieldName}...`;

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
                      {label}
                    </DynamicForm.Label>
                    {widgetType === 'textarea' || widgetType === 'rich-text' ? (
                      <DynamicForm.TextArea
                        className="contextual-form-input"
                        placeholder={placeholder}
                        rows={meta.rows || 4}
                      />
                    ) : (
                      <DynamicForm.Input
                        className="contextual-form-input"
                        placeholder={placeholder}
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
              <DynamicForm.Submit className="contextual-submit-button">
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
            <div className="contextual-success-box">
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
          <div className="contextual-table-wrapper">
            <table className="contextual-table">
              <thead>
                <tr>
                  <th className="contextual-th">Field Name</th>
                  <th className="contextual-th">Type</th>
                  <th className="contextual-th">Constraints / Description</th>
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
                    <tr key={fieldName}>
                      <td className="contextual-td-question">{fieldName}</td>
                      <td className="contextual-td-id">{typeName}</td>
                      <td className="contextual-td">
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
      {title && <h3 className="contextual-card-title">{title}</h3>}
      <div className="contextual-table-wrapper">
        <table className="contextual-table">
          <thead>
            <tr>
              <th className="contextual-th">ID</th>
              <th className="contextual-th">Question</th>
              <th className="contextual-th">Answer</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id || index}>
                <td className="contextual-td-id">{item.id || index + 1}</td>
                <td className="contextual-td-question">{item.question}</td>
                <td className="contextual-td">{item.answer}</td>
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
        <div className="contextual-card">
          <h3 className="contextual-card-title">Brand Information</h3>
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
      <div className="contextual-card">
        <h3 className="contextual-card-title">Navigation Links</h3>
        <ul className="contextual-ul">
          {data?.links?.map((link: any, index: number) => (
            <li key={link.id || index} className="contextual-li">
              <span>🔗 {link.label}</span>
              <span className="contextual-muted">({link.href || 'No Href'})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SchemaAwareViewer({
  data,
  generateJsonLd,
  isFaq,
  faqItems,
  faqTitle,
  isNavbar,
}: {
  data: any;
  generateJsonLd: (data: any) => any;
  isFaq: boolean;
  faqItems: any[];
  faqTitle?: string;
  isNavbar: boolean;
}) {
  const [viewMode, setViewMode] = useState<'data' | 'schema'>('data');
  const jsonLdData = useMemo(() => {
    try {
      return generateJsonLd(data);
    } catch (e) {
      return { error: 'Failed to generate JSON-LD', details: String(e) };
    }
  }, [data, generateJsonLd]);

  return (
    <div>
      <div className="contextual-sub-tab-header">
        <button
          onClick={() => setViewMode('data')}
          className={`contextual-sub-tab-button ${
            viewMode === 'data' ? 'contextual-sub-tab-button-active' : ''
          }`}
          type="button"
        >
          📋 Current Data
        </button>
        <button
          onClick={() => setViewMode('schema')}
          className={`contextual-sub-tab-button ${
            viewMode === 'schema' ? 'contextual-sub-tab-button-active' : ''
          }`}
          type="button"
        >
          🕸️ JSON-LD Schema
        </button>
      </div>

      {viewMode === 'data' ? (
        isFaq ? (
          <FaqTable data={faqItems} title={faqTitle} />
        ) : isNavbar ? (
          <NavbarViewer data={data} />
        ) : (
          <JsonViewer data={data} />
        )
      ) : (
        <JsonViewer data={jsonLdData} />
      )}
    </div>
  );
}

function JsonViewer({ data }: { data: any }) {
  return <pre className="contextual-pre">{JSON.stringify(data, null, 2)}</pre>;
}
