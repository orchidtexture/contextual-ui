'use client';

import React, { useState, useCallback, useMemo, createContext, useContext } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ZodSchema, TypeOf } from 'zod';
import {
  FormRootProps,
  FormFieldProps,
  FormLabelProps,
  FormInputProps,
  FormTextAreaProps,
  FormSubmitProps,
  FormErrorMessageProps,
  FormContextValue,
  FormItemContextValue,
} from './form.types';

export function createForm<T extends ZodSchema>(schema: T) {
  const FormContext = createContext<FormContextValue<T> | null>(null);
  const FormItemContext = createContext<FormItemContextValue<T> | null>(null);

  function Root({ onSubmit, onError, children, className, id }: FormRootProps<T>) {
    const [values, setValues] = useState<Partial<TypeOf<T>>>({});
    const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getFieldProps = useCallback((name: keyof TypeOf<T>) => ({
      name: String(name),
      value: (values[name] as string) || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValues((prev) => ({ ...prev, [name]: e.target.value }));
      },
      onBlur: () => {
        // Validation on blur for specific field
        const result = schema.safeParse(values);
        if (!result.success) {
          const fieldErrors = (result.error.flatten().fieldErrors as Record<string, string[] | undefined>)[name as string];
          setErrors((prev) => ({ ...prev, [name]: fieldErrors }));
        } else {
          setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
      },
    }), [values]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
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
        await onSubmit(result.data);
      } finally {
        setIsSubmitting(false);
      }
    };

    const contextValue = useMemo(() => ({
      values,
      errors,
      isSubmitting,
      getFieldProps,
    }), [values, errors, isSubmitting, getFieldProps]);

    return (
      <FormContext.Provider value={contextValue}>
        <form id={id} onSubmit={handleSubmit} className={className} data-contextual="form-root">
          {children}
        </form>
      </FormContext.Provider>
    );
  }

  function Field({ name, children, className }: FormFieldProps<T>) {
    return (
      <FormItemContext.Provider value={{ name }}>
        <div data-contextual="form-field" data-field={String(name)} className={className}>
          {children}
        </div>
      </FormItemContext.Provider>
    );
  }

  function Label({ children, asChild, className }: FormLabelProps) {
    const context = useContext(FormItemContext);
    if (!context) throw new Error('Form.Label must be used within Form.Field');
    const Comp = asChild ? Slot : 'label';
    return (
      <Comp htmlFor={String(context.name)} className={className} data-contextual="form-label">
        {children}
      </Comp>
    );
  }

  function Input({ asChild, className, ...props }: FormInputProps) {
    const itemContext = useContext(FormItemContext);
    const formContext = useContext(FormContext);
    if (!itemContext || !formContext) throw new Error('Form.Input must be used within Form.Field inside Form.Root');
    
    const fieldProps = formContext.getFieldProps(itemContext.name);
    const Comp = asChild ? Slot : 'input';

    return (
      <Comp
        {...fieldProps}
        {...props}
        className={className}
        data-contextual="form-input"
        data-invalid={!!formContext.errors[String(itemContext.name)]}
      />
    );
  }

  function TextArea({ asChild, className, ...props }: FormTextAreaProps) {
    const itemContext = useContext(FormItemContext);
    const formContext = useContext(FormContext);
    if (!itemContext || !formContext) throw new Error('Form.TextArea must be used within Form.Field inside Form.Root');
    
    const fieldProps = formContext.getFieldProps(itemContext.name);
    const Comp = asChild ? Slot : 'textarea';

    return (
      <Comp
        {...fieldProps}
        {...props}
        className={className}
        data-contextual="form-textarea"
        data-invalid={!!formContext.errors[String(itemContext.name)]}
      />
    );
  }

  function Submit({ children, asChild, className, ...props }: FormSubmitProps) {
    const context = useContext(FormContext);
    if (!context) throw new Error('Form.Submit must be used within Form.Root');
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        type="submit"
        disabled={context.isSubmitting}
        className={className}
        data-contextual="form-submit"
        {...props}
      >
        {children}
      </Comp>
    );
  }

  function ErrorMessage({ className, asChild }: FormErrorMessageProps) {
    const itemContext = useContext(FormItemContext);
    const formContext = useContext(FormContext);
    if (!itemContext || !formContext) throw new Error('Form.ErrorMessage must be used within Form.Field');
    
    const fieldErrors = formContext.errors[String(itemContext.name)];
    if (!fieldErrors || fieldErrors.length === 0) return null;

    const Comp = asChild ? Slot : 'span';
    return (
      <Comp className={className} data-contextual="form-error">
        {fieldErrors[0]}
      </Comp>
    );
  }

  return {
    Root,
    Field,
    Label,
    Input,
    TextArea,
    Submit,
    ErrorMessage,
  };
}
