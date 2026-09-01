import type { FormEntity } from 'contextual-ui';

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[a-z]/, (chr) => chr.toUpperCase());
}

function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, (chr) => chr.toLowerCase());
}

export function generateComponent(form: FormEntity): string {
  const componentName = `${toPascalCase(form.id || 'Custom')}Form`;
  const configName = `${toCamelCase(form.id || 'custom')}FormConfig`;

  const configJson = JSON.stringify(form, null, 2);

  return `'use client';

import React, { useState } from 'react';
import { AutoForm, type FormEntity } from 'contextual-ui';

export const ${configName}: FormEntity = ${configJson};

const autoFormCustomSlots = {
  Field: ({ children, className }: any) => (
    <div className={\`space-y-1 \${className || ''}\`}>{children}</div>
  ),
  Label: ({ htmlFor, children }: any) => (
    <label htmlFor={htmlFor} className="block text-xs font-mono text-zinc-300">
      {children}
    </label>
  ),
  Input: ({ field, dataInvalid, ...props }: any) => (
    <input
      {...props}
      className="w-full px-3 py-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-xs"
    />
  ),
  TextArea: ({ field, dataInvalid, ...props }: any) => (
    <textarea
      rows={3}
      {...props}
      className="w-full px-3 py-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-xs"
    />
  ),
  Select: ({ field, options, dataInvalid, children, ...props }: any) => (
    <select
      {...props}
      className="w-full px-3 py-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-xs cursor-pointer"
    >
      {children}
    </select>
  ),
  ErrorMessage: ({ error }: any) => (
    <span className="text-rose-400 text-[11px] font-mono mt-1 block">{error}</span>
  ),
  Submit: ({ isSubmitting, children, ...props }: any) => (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full py-2.5 bg-accent hover:opacity-90 disabled:opacity-50 text-zinc-950 font-medium rounded-lg transition-colors text-xs font-mono cursor-pointer flex items-center justify-center gap-2"
      {...props}
    >
      {isSubmitting ? 'Submitting...' : children}
    </button>
  ),
};

export function ${componentName}() {
  const [responseStatus, setResponseStatus] = useState<string | null>(null);

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const res = await fetch(${configName}.endpoint, {
        method: ${configName}.method || 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error(\`Server returned \${res.status}\`);
      }

      const data = await res.json();
      setResponseStatus('Form submitted successfully!');
      return data;
    } catch (error) {
      console.error('Submission error:', error);
      setResponseStatus('Failed to submit form.');
      throw error;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-glass-card">
      <AutoForm
        form={${configName}}
        components={autoFormCustomSlots}
        onSubmit={handleSubmit}
        className="space-y-4"
      />
      {responseStatus && (
        <p className="mt-4 text-xs font-mono text-zinc-400 text-center">
          {responseStatus}
        </p>
      )}
    </div>
  );
}
`;
}
