import { z } from 'zod';
import { cx } from '../../registry/defineSchema';

export const OrganizationDataSchema = z.object({
  name: cx(z.string(), { label: 'Organization Name', widget: 'text' }),
  legalName: cx(z.string().optional(), { label: 'Legal Name', widget: 'text' }),
  url: cx(z.string().optional(), { label: 'Organization URL', widget: 'text' }),
  logo: cx(z.string().optional(), { label: 'Logo URL', widget: 'text' }),
  description: cx(z.string().optional(), { label: 'Description', widget: 'textarea' }),
  sameAs: cx(z.array(z.string()).optional(), { label: 'Social Profiles (sameAs)', widget: 'text' }),
  email: cx(z.string().optional(), { label: 'Contact Email', widget: 'text' }),
  telephone: cx(z.string().optional(), { label: 'Telephone', widget: 'text' }),
});

export type OrganizationData = z.infer<typeof OrganizationDataSchema>;
