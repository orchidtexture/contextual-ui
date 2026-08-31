import { z } from 'zod';

export const FormFieldOptionSchema = z.union([
  z.string(),
  z.object({
    label: z.string(),
    value: z.string(),
  }),
]);

export const FormFieldValidationSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
  customErrorMessage: z.string().optional(),
});

export const FormFieldSchema = z.object({
  name: z.string().min(1, 'Field name is required'),
  type: z
    .enum([
      'text',
      'email',
      'textarea',
      'select',
      'number',
      'boolean',
      'tel',
      'url',
      'password',
    ])
    .default('text'),
  label: z.string().optional(),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  description: z.string().optional(),
  defaultValue: z.any().optional(),
  options: z.array(FormFieldOptionSchema).optional(),
  validation: FormFieldValidationSchema.optional(),
});

export const FormEntitySchema = z.object({
  id: z.string().min(1, 'Form ID is required'),
  name: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  actionType: z.string().default('ContactAction'),
  endpoint: z.string().min(1, 'Form endpoint is required'),
  method: z.enum(['POST', 'GET', 'PUT', 'PATCH']).default('POST'),
  fields: z.array(FormFieldSchema).default([]),
  submitLabel: z.string().optional().default('Submit'),
  successMessage: z.string().optional(),
});

export const FormDataSchema = z.union([
  z.array(FormEntitySchema),
  FormEntitySchema,
]);

export type FormFieldOption = z.infer<typeof FormFieldOptionSchema>;
export type FormFieldValidation = z.infer<typeof FormFieldValidationSchema>;
export type FormField = z.infer<typeof FormFieldSchema>;
export type FormEntity = z.infer<typeof FormEntitySchema>;
export type FormData = z.infer<typeof FormDataSchema>;
