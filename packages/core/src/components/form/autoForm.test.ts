import { describe, it, expect, vi } from 'vitest';
import { buildZodSchema, buildFieldZodSchema } from './buildZodSchema';
import { FormField, FormEntity } from './form.schema';

const testFields: FormField[] = [
  {
    name: 'fullName',
    type: 'text',
    label: 'Full Name',
    required: true,
    validation: { minLength: 2 },
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email Address',
    required: true,
  },
  {
    name: 'companySize',
    type: 'select',
    label: 'Company Size',
    required: false,
    options: ['1-10', '11-50', '50+'],
  },
  {
    name: 'acceptTerms',
    type: 'boolean',
    label: 'Accept Terms',
    required: true,
  },
  {
    name: 'optionalBio',
    type: 'textarea',
    label: 'Bio',
    required: false,
  },
  {
    name: 'website',
    type: 'url',
    label: 'Website',
    required: false,
  },
  {
    name: 'age',
    type: 'number',
    label: 'Age',
    required: false,
    validation: { min: 18, max: 120 },
  },
];

describe('buildZodSchema dynamic validation', () => {
  it('generates a valid schema and validates matching payload', () => {
    const schema = buildZodSchema(testFields);

    const validData = {
      fullName: 'Alice Smith',
      email: 'alice@example.com',
      companySize: '11-50',
      acceptTerms: true,
      optionalBio: 'Engineer & Designer',
      website: 'https://alice.dev',
      age: 28,
    };

    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails validation when required fields are missing or invalid', () => {
    const schema = buildZodSchema(testFields);

    const invalidData = {
      fullName: 'A', // min 2
      email: 'invalid-email',
      acceptTerms: false, // required boolean true
    };

    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.fullName).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.acceptTerms).toBeDefined();
    }
  });

  it('allows empty optional fields without errors', () => {
    const schema = buildZodSchema(testFields);

    const minimalData = {
      fullName: 'Bob Smith',
      email: 'bob@example.com',
      acceptTerms: true,
      companySize: '',
      optionalBio: '',
      website: '',
    };

    const result = schema.safeParse(minimalData);
    expect(result.success).toBe(true);
  });

  it('validates number ranges properly', () => {
    const schema = buildZodSchema(testFields);

    const underageData = {
      fullName: 'Charlie',
      email: 'charlie@example.com',
      acceptTerms: true,
      age: 15, // min is 18
    };

    const result = schema.safeParse(underageData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.age).toBeDefined();
    }
  });
});
