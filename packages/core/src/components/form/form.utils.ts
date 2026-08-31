import {
  refersTo,
  createPotentialAction,
  inferValuePattern,
} from 'jsonld-graph-builder';
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
 * Generates Schema.org PotentialAction JSON-LD objects with EntryPoint targets
 * and PropertyValueSpecification fields for AI agents and search engines.
 */
export function generateFormJsonLd(data: FormData, ctx?: Partial<JsonLdContext>) {
  const refer = ctx?.refersTo ?? refersTo;
  const forms = normalizeForms(data);

  return forms.map((form) =>
    createPotentialAction({
      id: `form-${form.id}`,
      actionType: form.actionType || 'ContactAction',
      name: form.name || form.title || form.id,
      description: form.description,
      isPartOf: refer('webpage'),
      target: {
        urlTemplate: form.endpoint,
        httpMethod: form.method || 'POST',
        contentType: 'application/json',
      },
      object: form.fields.map((field) => {
        const pattern =
          field.validation?.pattern || inferValuePattern(field.type);

        const options = field.options?.map((opt) =>
          typeof opt === 'string' ? opt : { name: opt.label, value: opt.value }
        );

        return {
          valueName: field.name,
          valueRequired: field.required ?? false,
          ...(pattern ? { valuePattern: pattern } : {}),
          ...(field.validation?.minLength !== undefined
            ? { valueMinLength: field.validation.minLength }
            : {}),
          ...(field.validation?.maxLength !== undefined
            ? { valueMaxLength: field.validation.maxLength }
            : {}),
          ...(field.validation?.min !== undefined
            ? { minValue: field.validation.min }
            : {}),
          ...(field.validation?.max !== undefined
            ? { maxValue: field.validation.max }
            : {}),
          ...(field.defaultValue !== undefined
            ? { defaultValue: field.defaultValue }
            : {}),
          ...(field.description ? { description: field.description } : {}),
          ...(options && options.length > 0 ? { valueOption: options } : {}),
        };
      }),
    })
  );
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
