import React from 'react';
import { ZodError } from 'zod';
import { FormData, FormEntity, FormField } from './form.schema';

export interface AutoFormFieldProps {
  name: string;
  field: FormField;
  className?: string;
  children: React.ReactNode;
}

export interface AutoFormLabelProps {
  htmlFor?: string;
  field: FormField;
  className?: string;
  children: React.ReactNode;
}

export interface AutoFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  field: FormField;
  dataInvalid?: boolean;
}

export interface AutoFormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  field: FormField;
  dataInvalid?: boolean;
}

export interface AutoFormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  field: FormField;
  options?: Array<{ label: string; value: string }>;
  dataInvalid?: boolean;
}

export interface AutoFormErrorMessageProps {
  name: string;
  error?: string;
  className?: string;
  children?: React.ReactNode;
}

export interface AutoFormSubmitProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting?: boolean;
}

export interface AutoFormSectionProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export interface AutoFormCustomComponents {
  Form?: React.ComponentType<React.FormHTMLAttributes<HTMLFormElement> & { isSubmitting?: boolean }>;
  Field?: React.ComponentType<AutoFormFieldProps>;
  Label?: React.ComponentType<AutoFormLabelProps>;
  Input?: React.ComponentType<AutoFormInputProps>;
  TextArea?: React.ComponentType<AutoFormTextAreaProps>;
  Select?: React.ComponentType<AutoFormSelectProps>;
  Checkbox?: React.ComponentType<AutoFormInputProps>;
  ErrorMessage?: React.ComponentType<AutoFormErrorMessageProps>;
  Submit?: React.ComponentType<AutoFormSubmitProps>;
  Section?: React.ComponentType<AutoFormSectionProps>;
}

export interface AutoFormProps {
  /** Ingested forms data from connector/registry (single FormEntity or FormEntity[]) */
  data?: FormData;
  /** Unique ID of the form to render (if data is an array or if matching a specific form) */
  formId?: string;
  /** Explicit form entity definition */
  form?: FormEntity;
  /** Action endpoint override */
  action?: string;
  /** HTTP method override */
  method?: 'POST' | 'GET' | 'PUT' | 'PATCH';
  /** Custom onSubmit callback (called after successful dynamic Zod validation) */
  onSubmit?: (values: Record<string, any>, form: FormEntity) => void | Promise<void>;
  /** Optional onError callback when validation fails */
  onError?: (error: ZodError) => void;
  /** Optional onSuccess callback */
  onSuccess?: (result: any) => void;
  /** Custom UI slots */
  components?: AutoFormCustomComponents;
  /** Custom class name on the form root */
  className?: string;
  /** Custom submit button label */
  submitLabel?: string;
  /** Form title override */
  title?: React.ReactNode;
  /** Form description override */
  description?: React.ReactNode;
  /** Children render prop or custom layout if developers want to insert elements */
  children?: React.ReactNode;
}
