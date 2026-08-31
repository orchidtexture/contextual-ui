import { describe, it, expect } from 'vitest';
import { formRegistry, formsRegistry, generateFormJsonLd, exportAgentData } from './form.utils';
import { FormEntitySchema, FormDataSchema } from './form.schema';
import { defineSchema } from '../../registry/defineSchema';

const sampleForm = {
  id: 'contact-sales',
  name: 'Contact Sales',
  description: 'Reach out to our enterprise team',
  actionType: 'ContactAction',
  endpoint: '/api/forms/contact',
  method: 'POST' as const,
  fields: [
    {
      name: 'name',
      type: 'text' as const,
      label: 'Full Name',
      required: true,
      placeholder: 'Jane Doe',
    },
    {
      name: 'email',
      type: 'email' as const,
      label: 'Work Email',
      required: true,
      placeholder: 'jane@company.com',
    },
    {
      name: 'companySize',
      type: 'select' as const,
      label: 'Company Size',
      required: false,
      options: ['1-10', '11-50', '50+'],
    },
    {
      name: 'message',
      type: 'textarea' as const,
      label: 'How can we help?',
      required: true,
    },
  ],
  submitLabel: 'Send Inquiry',
  successMessage: 'Thank you! We will get in touch shortly.',
};

describe('formRegistry and Form Schemas', () => {
  it('validates a valid form entity', () => {
    const result = FormEntitySchema.safeParse(sampleForm);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('contact-sales');
      expect(result.data.fields.length).toBe(4);
      expect(result.data.method).toBe('POST');
    }
  });

  it('validates an array of forms with FormDataSchema', () => {
    const result = FormDataSchema.safeParse([sampleForm]);
    expect(result.success).toBe(true);
  });

  it('validates a single form object with FormDataSchema', () => {
    const result = FormDataSchema.safeParse(sampleForm);
    expect(result.success).toBe(true);
  });

  it('integrates seamlessly with defineSchema', () => {
    const siteSchema = defineSchema({
      forms: formRegistry(),
    });

    const parsed = siteSchema.parse({
      forms: [sampleForm],
    });
    expect(parsed.forms).toBeDefined();

    const agentData = siteSchema.getAgentData(parsed);
    expect(agentData.forms).toBeDefined();
    expect(agentData.forms[0].id).toBe('contact-sales');
    expect(agentData.forms[0].endpoint).toBe('/api/forms/contact');

    const hydrated = siteSchema.hydrate({
      forms: [sampleForm],
    });
    const jsonLd = hydrated.generateJsonLd();
    expect(jsonLd.forms).toBeDefined();
    expect(jsonLd.forms[0]['@type']).toBe('ContactAction');
    expect(jsonLd.forms[0].target.urlTemplate).toBe('/api/forms/contact');
    expect(jsonLd.forms[0].object.length).toBe(4);
    expect(jsonLd.forms[0].object[0].valueName).toBe('name');
    expect(jsonLd.forms[0].object[0].valueRequired).toBe(true);
  });

  it('exports agent data properly', () => {
    const agent = exportAgentData([sampleForm]);
    expect(agent.length).toBe(1);
    expect(agent[0].fields.length).toBe(4);
    expect(agent[0].endpoint).toBe('/api/forms/contact');
  });

  it('generates PotentialAction JSON-LD with PropertyValueSpecifications', () => {
    const jsonLd = generateFormJsonLd([sampleForm]);
    expect(jsonLd.length).toBe(1);
    const action = jsonLd[0];
    expect(action['@context']).toBe('https://schema.org');
    expect(action['@type']).toBe('ContactAction');
    expect(action.target).toEqual({
      '@type': 'EntryPoint',
      urlTemplate: '/api/forms/contact',
      httpMethod: 'POST',
      contentType: 'application/json',
    });
    const emailProp = action.object.find((o) => o.valueName === 'email');
    expect(emailProp).toBeDefined();
    expect(emailProp?.valuePattern).toBe('^.+@.+\\..+$');
  });
});
