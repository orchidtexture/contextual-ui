import type { FormEntity, FormField } from 'contextual-ui';

export type StudioFileType = 'schema.ts' | 'FormComponent.tsx' | 'route.ts' | 'ai-prompt.txt';

export interface ConsoleLog {
  id: string;
  timestamp: string;
  type: 'success' | 'error' | 'info';
  title: string;
  payload: any;
}

export interface PresetOption {
  id: string;
  name: string;
  description: string;
  form: FormEntity;
}

export const PRESET_FORMS: PresetOption[] = [
  {
    id: 'contact-sales',
    name: 'Contact Sales & Enterprise',
    description: 'B2B inquiry form with validation, topic dropdown, and terms consent.',
    form: {
      id: 'contact-sales',
      name: 'Contact Sales',
      title: 'Get in Touch with our Team',
      description: 'Fill out the details below and we will respond within 24 hours.',
      actionType: 'ContactAction',
      endpoint: '/api/contact',
      method: 'POST',
      submitLabel: 'Send Inquiry',
      successMessage: 'Thank you! Your message has been received.',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Full Name',
          required: true,
          placeholder: 'Alex Smith',
          validation: { minLength: 2 },
        },
        {
          name: 'email',
          type: 'email',
          label: 'Work Email',
          required: true,
          placeholder: 'alex@company.com',
        },
        {
          name: 'topic',
          type: 'select',
          label: 'Inquiry Topic',
          required: true,
          placeholder: 'Select topic...',
          options: [
            { label: 'Sales & Pricing', value: 'sales' },
            { label: 'Technical Partnership', value: 'partnership' },
            { label: 'Customer Support', value: 'support' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'message',
          type: 'textarea',
          label: 'Message',
          required: true,
          placeholder: 'Describe your use case or project scope...',
          validation: { minLength: 10 },
        },
        {
          name: 'newsletter',
          type: 'boolean',
          label: 'Subscribe to developer product updates',
          required: false,
          defaultValue: false,
        },
      ],
    },
  },
  {
    id: 'lead-waitlist',
    name: 'Product Waitlist & Early Access',
    description: 'High-conversion waitlist form with company role and team size.',
    form: {
      id: 'lead-waitlist',
      name: 'Waitlist Form',
      title: 'Join the Early Access Program',
      description: 'Get priority access to our upcoming developer tools release.',
      actionType: 'SubscribeAction',
      endpoint: '/api/waitlist',
      method: 'POST',
      submitLabel: 'Request Early Access',
      successMessage: "You're on the list! We'll reach out when your spot is ready.",
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Work Email',
          required: true,
          placeholder: 'you@company.com',
        },
        {
          name: 'role',
          type: 'select',
          label: 'Your Role',
          required: true,
          placeholder: 'Select your role...',
          options: [
            { label: 'Software Engineer / Architect', value: 'engineer' },
            { label: 'Founder / Executive', value: 'founder' },
            { label: 'Product Manager', value: 'pm' },
            { label: 'Designer', value: 'designer' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'teamSize',
          type: 'select',
          label: 'Company / Team Size',
          required: false,
          placeholder: 'Select team size...',
          options: [
            { label: '1 - 10 people', value: '1-10' },
            { label: '11 - 50 people', value: '11-50' },
            { label: '51 - 200 people', value: '51-200' },
            { label: '200+ people', value: '200+' },
          ],
        },
      ],
    },
  },
  {
    id: 'bug-feedback',
    name: 'Issue & Feedback Report',
    description: 'Structured form for collecting bug reports and feedback.',
    form: {
      id: 'bug-feedback',
      name: 'Bug Report',
      title: 'Report an Issue or Feedback',
      description: 'Help us improve by providing details on any issues encountered.',
      actionType: 'AssessAction',
      endpoint: '/api/feedback',
      method: 'POST',
      submitLabel: 'Submit Report',
      successMessage: 'Thank you for your feedback! Our team will look into it.',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Issue Summary',
          required: true,
          placeholder: 'Brief summary of the issue...',
          validation: { minLength: 5 },
        },
        {
          name: 'severity',
          type: 'select',
          label: 'Severity Level',
          required: true,
          placeholder: 'Select severity...',
          options: [
            { label: 'Low - Minor annoyance', value: 'low' },
            { label: 'Medium - Normal bug', value: 'medium' },
            { label: 'High - Blocking workflow', value: 'high' },
            { label: 'Critical - System crash', value: 'critical' },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Detailed Description',
          required: true,
          placeholder: 'Steps to reproduce or expected vs actual behavior...',
          validation: { minLength: 10 },
        },
        {
          name: 'email',
          type: 'email',
          label: 'Contact Email (Optional)',
          required: false,
          placeholder: 'If you want follow-up notifications',
        },
      ],
    },
  },
];
