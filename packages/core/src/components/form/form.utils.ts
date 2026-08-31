import { createId, refersTo } from 'jsonld-graph-builder';
import type { JsonLdContext } from '../../registry/defineSchema';
import { FormDataSchema, FormData, FormEntity } from './form.schema';

/**
 * Normalizes single or array form data into an array of FormEntity objects.
 */
export function normalizeForms(data: FormData): FormEntity[] {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

/**
 * Generates a Schema.org PotentialAction JSON-LD object for each form.
 */
export function generateFormJsonLd(data: FormData, ctx?: Partial<JsonLdContext>) {
  const create = ctx?.createId ?? createId;
  const refer = ctx?.refersTo ?? refersTo;
  const forms = normalizeForms(data);

  return forms.map((form) => ({
    '@context': 'https://schema.org',
    '@type': form.actionType || 'ContactAction',
    '@id': create(`form-${form.id}`),
    name: form.name || form.title || form.id,
    description: form.description,
    isPartOf: refer('webpage'),
    target: {
      '@type': 'EntryPoint',
      urlTemplate: form.endpoint,
      httpMethod: form.method || 'POST',
      contentType: 'application/json',
    },
    object: form.fields.map((field) => ({
      '@type': 'PropertyValueSpecification',
      valueName: field.name,
      valueRequired: field.required ?? false,
      ...(field.type === 'email' ? { valuePattern: '^.+@.+\\..+$' } : {}),
      ...(field.description ? { description: field.description } : {}),
    })),
  }));
}

/**
 * Exports plain data for internal AI agents or other integrations.
 */
export function exportAgentData(data: FormData) {
  const forms = normalizeForms(data);
  return forms.map((form) => ({
    id: form.id,
    name: form.name || form.title || form.id,
    description: form.description,
    actionType: form.actionType,
    endpoint: form.endpoint,
    method: form.method,
    fields: form.fields.map((field) => ({
      name: field.name,
      type: field.type,
      label: field.label,
      required: field.required,
      placeholder: field.placeholder,
      options: field.options,
    })),
    submitLabel: form.submitLabel,
  }));
}

/**
 * Creates a structural registry item for forms in defineSchema.
 */
export function formRegistry() {
  return {
    type: 'forms' as const,
    schema: FormDataSchema,
    exportAgentData,
    generateJsonLd: generateFormJsonLd,
    isGlobal: false,
  };
}

export const formsRegistry = formRegistry;
