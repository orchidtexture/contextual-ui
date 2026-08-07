import { ReactNode } from 'react';
import { ZodSchema, TypeOf, ZodError } from 'zod';

export interface FormRootProps<T extends ZodSchema> {
  onSubmit: (data: TypeOf<T>) => void | Promise<void>;
  onError?: (error: ZodError) => void;
  children: ReactNode;
  className?: string;
  id?: string;
}

export interface FormFieldProps<T extends ZodSchema> {
  name: keyof TypeOf<T>;
  children: ReactNode;
  className?: string;
}

export interface FormLabelProps {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
}

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  asChild?: boolean;
}

export interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  asChild?: boolean;
}

export interface FormSubmitProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export interface FormErrorMessageProps {
  className?: string;
  asChild?: boolean;
}

export interface FormContextValue<T extends ZodSchema> {
  values: Partial<TypeOf<T>>;
  errors: Record<string, string[] | undefined>;
  isSubmitting: boolean;
  getFieldProps: (name: keyof TypeOf<T>) => {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur: () => void;
    name: string;
  };
}

export interface FormItemContextValue<T extends ZodSchema> {
  name: keyof TypeOf<T>;
}
