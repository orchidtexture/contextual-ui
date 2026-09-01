import type { FormEntity, FormField } from 'contextual-ui';

function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, (chr) => chr.toLowerCase());
}

function toPascalCase(str: string): string {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function generateFieldZodCode(field: FormField): string {
  const { name, label, type, required, validation, options } = field;
  const fieldTitle = label || name;
  const customMsg = validation?.customErrorMessage;

  switch (type) {
    case 'email': {
      if (required) {
        return `z.string().email('${customMsg || 'Please enter a valid email address'}')`;
      }
      return `z.string().email('${customMsg || 'Please enter a valid email address'}').optional().or(z.literal(''))`;
    }

    case 'number': {
      let code = 'z.coerce.number()';
      if (validation?.min !== undefined) {
        code += `.min(${validation.min}${customMsg ? `, '${customMsg}'` : ''})`;
      }
      if (validation?.max !== undefined) {
        code += `.max(${validation.max}${customMsg ? `, '${customMsg}'` : ''})`;
      }
      return required ? code : `${code}.optional()`;
    }

    case 'boolean': {
      if (required) {
        return `z.boolean().refine((val) => val === true, { message: '${customMsg || `${fieldTitle} is required`}' })`;
      }
      return 'z.boolean().optional()';
    }

    case 'select': {
      if (options && options.length > 0) {
        const values = options.map((opt) =>
          typeof opt === 'string' ? opt : opt.value
        );
        const enumList = values.map((v) => `'${v}'`).join(', ');
        const enumCode = `z.enum([${enumList}])`;
        return required ? enumCode : `${enumCode}.optional().or(z.literal(''))`;
      }
      return required
        ? `z.string().min(1, '${customMsg || `${fieldTitle} is required`}')`
        : 'z.string().optional()';
    }

    case 'url': {
      if (required) {
        return `z.string().url('${customMsg || 'Please enter a valid URL'}')`;
      }
      return `z.string().url('${customMsg || 'Please enter a valid URL'}').optional().or(z.literal(''))`;
    }

    case 'textarea':
    case 'text':
    case 'password':
    case 'tel':
    default: {
      let code = 'z.string()';
      if (required) {
        const minVal = validation?.minLength ?? 1;
        const msg = customMsg || `${fieldTitle} is required`;
        code += `.min(${minVal}, '${msg}')`;
      } else if (validation?.minLength) {
        code += `.min(${validation.minLength}${customMsg ? `, '${customMsg}'` : ''})`;
      }

      if (validation?.maxLength) {
        code += `.max(${validation.maxLength}${customMsg ? `, '${customMsg}'` : ''})`;
      }

      if (validation?.pattern) {
        code += `.regex(/${validation.pattern}/, '${customMsg || 'Invalid format'}')`;
      }

      return required ? code : `${code}.optional().or(z.literal(''))`;
    }
  }
}

export function generateSchema(form: FormEntity): string {
  const schemaName = `${toCamelCase(form.id || 'form')}Schema`;
  const typeName = `${toPascalCase(form.id || 'form')}Input`;

  const fieldsCode = form.fields
    .map((field) => `  ${field.name}: ${generateFieldZodCode(field)},`)
    .join('\n');

  return `import { z } from 'zod';

/**
 * Validation schema for ${form.title || form.name || form.id}
 * Action type: ${form.actionType || 'Action'}
 */
export const ${schemaName} = z.object({
${fieldsCode}
});

export type ${typeName} = z.infer<typeof ${schemaName}>;
`;
}
