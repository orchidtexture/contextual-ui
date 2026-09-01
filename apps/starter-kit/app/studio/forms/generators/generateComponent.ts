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
    <section className="w-full max-w-xl mx-auto p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-sm">
      <AutoForm
        form={${configName}}
        onSubmit={handleSubmit}
        className="space-y-5"
      />
      {responseStatus && (
        <p className="mt-4 text-xs font-mono text-zinc-400 text-center">
          {responseStatus}
        </p>
      )}
    </section>
  );
}
`;
}
