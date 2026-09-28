import type { SectionRecord } from 'contextual-ui';
import type { SchemaField } from './registries.content';

export interface FormPropContract {
  name: string;
  type: string;
  required: string;
  description: string;
}

export const AUTO_FORM_PROPS: FormPropContract[] = [
  {
    name: 'data',
    type: 'FormData',
    required: 'Yes (or form)',
    description: 'Ingested forms data from connector/registry (single FormEntity or FormEntity[] array).',
  },
  {
    name: 'formId',
    type: 'string',
    required: 'Optional',
    description: 'Matches a specific form by its id when data contains multiple forms.',
  },
  {
    name: 'form',
    type: 'FormEntity',
    required: 'Optional',
    description: 'Explicit form entity object override (bypassing data lookup).',
  },
  {
    name: 'components',
    type: 'AutoFormCustomComponents',
    required: 'Optional',
    description: 'Custom UI slots for Form, Field, Label, Input, TextArea, Select, Checkbox, ErrorMessage, Submit, Section.',
  },
  {
    name: 'action',
    type: 'string',
    required: 'Optional',
    description: 'Overrides the form submit endpoint (defaults to form.endpoint).',
  },
  {
    name: 'method',
    type: "'POST' | 'GET' | 'PUT' | 'PATCH'",
    required: 'Optional',
    description: 'Overrides HTTP method (defaults to form.method or "POST").',
  },
  {
    name: 'onSubmit',
    type: '(values, form) => void | Promise<void>',
    required: 'Optional',
    description: 'Custom submit handler. If omitted, AutoForm performs a JSON POST fetch to the endpoint automatically.',
  },
  {
    name: 'onSuccess',
    type: '(result) => void',
    required: 'Optional',
    description: 'Callback invoked after successful form submission.',
  },
  {
    name: 'onError',
    type: '(error: ZodError) => void',
    required: 'Optional',
    description: 'Callback invoked when client-side validation fails.',
  },
  {
    name: 'submitLabel',
    type: 'string',
    required: 'Optional',
    description: 'Overrides the submit button text (defaults to form.submitLabel or "Submit").',
  },
];

export const STATIC_FORM_SUBCOMPONENTS = [
  {
    name: 'Form.Root',
    props: 'onSubmit, onError?, className?, id?',
    description: 'Top-level context provider for static forms. Manages state, errors, blur validation, and async lifecycle.',
  },
  {
    name: 'Form.Field',
    props: 'name: keyof Schema, className?',
    description: 'Scopes field context by name. Strictly type-checked against schema keys at compile time.',
  },
  {
    name: 'Form.Label',
    props: 'asChild?, className?, style?',
    description: 'Accessible <label> automatically bound to the input through the field htmlFor attribute.',
  },
  {
    name: 'Form.Input',
    props: 'asChild?, ...InputHTMLAttributes',
    description: 'Controlled input element bound to field value, onChange, onBlur validation, and data-invalid attribute.',
  },
  {
    name: 'Form.TextArea',
    props: 'asChild?, ...TextareaHTMLAttributes',
    description: 'Controlled multi-line textarea with automatic onBlur validation and data-invalid attribute binding.',
  },
  {
    name: 'Form.ErrorMessage',
    props: 'asChild?, className?, style?',
    description: 'Conditionally renders active validation error strings for the scoped field.',
  },
  {
    name: 'Form.Submit',
    props: 'asChild?, ...ButtonHTMLAttributes',
    description: 'Submit button automatically disabled while an async onSubmit promise is pending.',
  },
  {
    name: 'Form.Section',
    props: 'title?, description?, asChild?, className?',
    description: 'Semantic container for grouping related fields with an optional title and description header.',
  },
];

export const autoFormSectionRecord: SectionRecord = {
  id: 'auto-form',
  pageId: 'docs',
  title: 'AutoForm & formRegistry',
  description: '<AutoForm> unifies Headless CMS form definitions, dynamic in-memory Zod validation, and machine-readable Schema.org PotentialAction JSON-LD graphs for AI agents. Define your form structure in your CMS or connector, and render dynamic accessible UI without writing repetitive React field boilerplate.',
  anchor: 'auto-form',
  type: 'WebPageElement',
  content: [
    {
      type: 'list',
      style: 'unordered',
      items: AUTO_FORM_PROPS.map((prop) => ({
        title: `${prop.name} (${prop.type}, ${prop.required})`,
        text: prop.description,
      })),
    },
  ],
};

export const createFormSectionRecord: SectionRecord = {
  id: 'create-form',
  pageId: 'docs',
  title: 'createForm (Static Form Factory)',
  description: 'The createForm factory generates headless, strictly type-safe React form components directly from a hardcoded Zod schema. Ideal for developer-centric custom forms with fixed field requirements, providing automatic blur validation, field name autocompletion, and zero-state boilerplate.',
  anchor: 'create-form',
  type: 'WebPageElement',
  content: [
    {
      type: 'list',
      style: 'unordered',
      items: STATIC_FORM_SUBCOMPONENTS.map((sub) => ({
        title: `${sub.name} (${sub.props})`,
        text: sub.description,
      })),
    },
  ],
};
