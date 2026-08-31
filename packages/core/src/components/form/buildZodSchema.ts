import { z } from 'zod';
import { FormField } from './form.schema';

/**
 * Builds a dynamic Zod validator for an individual FormField.
 */
export function buildFieldZodSchema(field: FormField): z.ZodTypeAny {
  const { type, required, validation } = field;
  const customMsg = validation?.customErrorMessage;
  const fieldName = field.label || field.name;

  let baseSchema: z.ZodTypeAny;

  switch (type) {
    case 'email': {
      let s = z.string();
      if (required) {
        s = s.min(1, customMsg || `${fieldName} is required`);
      }
      baseSchema = s.email(customMsg || 'Please enter a valid email address');
      if (!required) {
        baseSchema = baseSchema.optional().or(z.literal(''));
      }
      break;
    }
    case 'number': {
      let s = z.coerce.number();
      if (validation?.min !== undefined) {
        s = s.min(validation.min, customMsg);
      }
      if (validation?.max !== undefined) {
        s = s.max(validation.max, customMsg);
      }
      baseSchema = required ? s : s.optional();
      break;
    }
    case 'boolean': {
      baseSchema = required
        ? z.boolean().refine((val) => val === true, {
            message: customMsg || `${fieldName} must be accepted`,
          })
        : z.boolean().optional();
      break;
    }
    case 'select': {
      if (field.options && field.options.length > 0) {
        const optionValues = field.options.map((opt) =>
          typeof opt === 'string' ? opt : opt.value
        );
        if (optionValues.length > 0) {
          const enumSchema = z.enum(optionValues as [string, ...string[]]);
          baseSchema = required
            ? enumSchema
            : enumSchema.optional().or(z.literal(''));
        } else {
          baseSchema = required
            ? z.string().min(1, customMsg || `${fieldName} is required`)
            : z.string().optional();
        }
      } else {
        baseSchema = required
          ? z.string().min(1, customMsg || `${fieldName} is required`)
          : z.string().optional();
      }
      break;
    }
    case 'url': {
      let s = z.string();
      if (required) {
        s = s.min(1, customMsg || `${fieldName} is required`);
      }
      baseSchema = s.url(customMsg || 'Please enter a valid URL');
      if (!required) {
        baseSchema = baseSchema.optional().or(z.literal(''));
      }
      break;
    }
    case 'text':
    case 'textarea':
    case 'tel':
    case 'password':
    default: {
      let s = z.string();
      if (required) {
        s = s.min(
          validation?.minLength ?? 1,
          customMsg || `${fieldName} is required`
        );
      } else if (validation?.minLength) {
        s = s.min(validation.minLength, customMsg);
      }
      if (validation?.maxLength) {
        s = s.max(validation.maxLength, customMsg);
      }
      if (validation?.pattern) {
        s = s.regex(new RegExp(validation.pattern), customMsg || 'Invalid format');
      }
      baseSchema = required ? s : s.optional().or(z.literal(''));
      break;
    }
  }

  return baseSchema;
}

/**
 * Dynamically builds a full Zod schema object from an array of CMS FormFields.
 */
export function buildZodSchema(
  fields: FormField[]
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of fields) {
    shape[field.name] = buildFieldZodSchema(field);
  }
  return z.object(shape);
}
