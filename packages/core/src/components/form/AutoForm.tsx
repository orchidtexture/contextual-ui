'use client';

import React, { useState, useMemo, useCallback } from 'react';
import type { FormEntity } from './form.schema';
import { normalizeForms } from './form.utils';
import { buildZodSchema } from './buildZodSchema';
import type { AutoFormProps } from './autoForm.types';

export function AutoForm({
  data,
  formId,
  form: explicitForm,
  action,
  method,
  onSubmit,
  onError,
  onSuccess,
  components = {},
  className,
  submitLabel,
  title,
  description,
  children,
}: AutoFormProps) {
  // 1. Resolve Target Form Entity
  const formEntity: FormEntity | undefined = useMemo(() => {
    if (explicitForm) return explicitForm;
    if (!data) return undefined;
    const forms = normalizeForms(data);
    if (formId) {
      return forms.find((f) => f.id === formId) || forms[0];
    }
    return forms[0];
  }, [explicitForm, data, formId]);

  // 2. Build Dynamic Zod Schema in-memory
  const schema = useMemo(() => {
    if (!formEntity?.fields) return null;
    return buildZodSchema(formEntity.fields);
  }, [formEntity?.fields]);

  // 3. Form State
  const initialValues = useMemo(() => {
    const vals: Record<string, any> = {};
    if (formEntity?.fields) {
      for (const field of formEntity.fields) {
        if (field.defaultValue !== undefined) {
          vals[field.name] = field.defaultValue;
        } else if (field.type === 'boolean') {
          vals[field.name] = false;
        } else {
          vals[field.name] = '';
        }
      }
    }
    return vals;
  }, [formEntity?.fields]);

  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Field change handler
  const handleChange = useCallback((name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }, []);

  // Field blur validation handler
  const handleBlur = useCallback(
    (name: string) => {
      if (!schema) return;
      const result = schema.safeParse(values);
      if (!result.success) {
        const fieldErrors = (
          result.error.flatten().fieldErrors as Record<string, string[] | undefined>
        )[name];
        setErrors((prev) => ({ ...prev, [name]: fieldErrors }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [schema, values]
  );

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schema || !formEntity) return;

    setIsSubmitting(true);
    const result = schema.safeParse(values);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as any);
      onError?.(result.error);
      setIsSubmitting(false);
      return;
    }

    try {
      setErrors({});
      if (onSubmit) {
        await onSubmit(result.data, formEntity);
      } else {
        const endpoint = action || formEntity.endpoint;
        const httpMethod = method || formEntity.method || 'POST';
        const response = await fetch(endpoint, {
          method: httpMethod,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result.data),
        });
        if (!response.ok) {
          throw new Error(`Form submission failed: ${response.statusText}`);
        }
      }
      setIsSuccess(true);
      onSuccess?.(result.data);
    } catch (err: any) {
      console.error('[Contextual UI AutoForm] Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formEntity) {
    return null;
  }

  // Component slot overrides or default elements
  const FormComp = components.Form || 'form';
  const FieldComp = components.Field || DefaultField;
  const LabelComp = components.Label || DefaultLabel;
  const InputComp = components.Input || DefaultInput;
  const TextAreaComp = components.TextArea || DefaultTextArea;
  const SelectComp = components.Select || DefaultSelect;
  const CheckboxComp = components.Checkbox || DefaultCheckbox;
  const ErrorMessageComp = components.ErrorMessage || DefaultErrorMessage;
  const SubmitComp = components.Submit || DefaultSubmit;
  const SectionComp = components.Section || DefaultSection;

  const displayTitle = title ?? formEntity.title ?? formEntity.name;
  const displayDescription = description ?? formEntity.description;
  const displaySubmitLabel = submitLabel ?? formEntity.submitLabel ?? 'Submit';

  return (
    <FormComp
      id={formEntity.id}
      onSubmit={handleSubmit}
      className={className}
      data-contextual="auto-form"
      data-form-id={formEntity.id}
    >
      <SectionComp title={displayTitle} description={displayDescription}>
        {formEntity.fields.map((field) => {
          const fieldError = errors[field.name]?.[0];
          const hasError = !!fieldError;
          const value = values[field.name];

          const optionsList = field.options?.map((opt) =>
            typeof opt === 'string' ? { label: opt, value: opt } : opt
          );

          return (
            <FieldComp
              key={field.name}
              name={field.name}
              field={field}
              className="space-y-1.5"
            >
              {field.type !== 'boolean' && (
                <LabelComp htmlFor={field.name} field={field}>
                  {field.label || field.name}
                  {field.required && (
                    <span className="text-accent ml-1" aria-hidden="true">
                      *
                    </span>
                  )}
                </LabelComp>
              )}

              {/* Textarea */}
              {field.type === 'textarea' ? (
                <TextAreaComp
                  id={field.name}
                  name={field.name}
                  field={field}
                  value={value || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onBlur={() => handleBlur(field.name)}
                  placeholder={field.placeholder}
                  dataInvalid={hasError}
                  aria-invalid={hasError}
                  aria-describedby={hasError ? `${field.name}-error` : undefined}
                />
              ) : field.type === 'select' ? (
                /* Select */
                <SelectComp
                  id={field.name}
                  name={field.name}
                  field={field}
                  value={value || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onBlur={() => handleBlur(field.name)}
                  options={optionsList}
                  dataInvalid={hasError}
                  aria-invalid={hasError}
                >
                  <option value="" disabled>
                    {field.placeholder || `Select ${field.label || field.name}...`}
                  </option>
                  {optionsList?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </SelectComp>
              ) : field.type === 'boolean' ? (
                /* Checkbox */
                <div className="flex items-center gap-2">
                  <CheckboxComp
                    id={field.name}
                    name={field.name}
                    type="checkbox"
                    field={field}
                    checked={Boolean(value)}
                    onChange={(e) => handleChange(field.name, e.target.checked)}
                    onBlur={() => handleBlur(field.name)}
                    dataInvalid={hasError}
                    aria-invalid={hasError}
                  />
                  <LabelComp htmlFor={field.name} field={field}>
                    {field.label || field.name}
                    {field.required && (
                      <span className="text-accent ml-1" aria-hidden="true">
                        *
                      </span>
                    )}
                  </LabelComp>
                </div>
              ) : (
                /* Standard Input */
                <InputComp
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  field={field}
                  value={value || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onBlur={() => handleBlur(field.name)}
                  placeholder={field.placeholder}
                  dataInvalid={hasError}
                  aria-invalid={hasError}
                  aria-describedby={hasError ? `${field.name}-error` : undefined}
                />
              )}

              {/* Error Message */}
              {hasError && (
                <ErrorMessageComp name={field.name} error={fieldError}>
                  {fieldError}
                </ErrorMessageComp>
              )}
            </FieldComp>
          );
        })}

        {/* Custom children injection slot */}
        {children}

        {/* Success Message */}
        {isSuccess && formEntity.successMessage && (
          <div
            data-contextual="form-success"
            className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-lg text-xs"
          >
            {formEntity.successMessage}
          </div>
        )}

        {/* Submit Button */}
        <SubmitComp
          type="submit"
          disabled={isSubmitting}
          isSubmitting={isSubmitting}
        >
          {displaySubmitLabel}
        </SubmitComp>
      </SectionComp>
    </FormComp>
  );
}

// Default Headless Fallback Components
function DefaultField({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div data-contextual="form-field" className={className}>{children}</div>;
}

function DefaultLabel({ htmlFor, children, className }: { htmlFor?: string; children: React.ReactNode; className?: string }) {
  return (
    <label htmlFor={htmlFor} data-contextual="form-label" className={className}>
      {children}
    </label>
  );
}

function DefaultInput({ field, dataInvalid, ...props }: any) {
  return <input data-contextual="form-input" data-invalid={dataInvalid} {...props} />;
}

function DefaultTextArea({ field, dataInvalid, ...props }: any) {
  return <textarea data-contextual="form-textarea" data-invalid={dataInvalid} {...props} />;
}

function DefaultSelect({ field, options, dataInvalid, children, ...props }: any) {
  return (
    <select data-contextual="form-select" data-invalid={dataInvalid} {...props}>
      {children}
    </select>
  );
}

function DefaultCheckbox({ field, dataInvalid, ...props }: any) {
  return <input type="checkbox" data-contextual="form-checkbox" data-invalid={dataInvalid} {...props} />;
}

function DefaultErrorMessage({ error, children, className }: any) {
  return (
    <span data-contextual="form-error" className={className}>
      {children || error}
    </span>
  );
}

function DefaultSubmit({ isSubmitting, children, ...props }: any) {
  return (
    <button data-contextual="form-submit" disabled={isSubmitting} {...props}>
      {children}
    </button>
  );
}

function DefaultSection({ title, description, children, className }: any) {
  return (
    <div data-contextual="form-section" className={className}>
      {(title || description) && (
        <div data-contextual="form-section-header" className="space-y-1 mb-4">
          {title && <h3 data-contextual="form-section-title">{title}</h3>}
          {description && <p data-contextual="form-section-description">{description}</p>}
        </div>
      )}
      <div data-contextual="form-section-content" className="space-y-4">
        {children}
      </div>
    </div>
  );
}
