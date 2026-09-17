import { z } from 'zod';
import { cx } from '../../registry/defineSchema';

export const PostalAddressSchema = z.object({
  streetAddress: cx(z.string().optional(), { label: 'Street Address', widget: 'text' }),
  addressLocality: cx(z.string().optional(), { label: 'City / Locality', widget: 'text' }),
  addressRegion: cx(z.string().optional(), { label: 'State / Region', widget: 'text' }),
  postalCode: cx(z.string().optional(), { label: 'Postal Code', widget: 'text' }),
  addressCountry: cx(z.string().optional(), { label: 'Country', widget: 'text' }),
});
export type PostalAddress = z.infer<typeof PostalAddressSchema>;

export const OrganizationDataSchema = z.object({
  id: cx(z.string().optional(), { label: 'Organization ID', widget: 'text' }),
  name: cx(z.string(), { label: 'Organization Name', widget: 'text' }),
  legalName: cx(z.string().optional(), { label: 'Legal Name', widget: 'text' }),
  url: cx(z.string().optional(), { label: 'Organization URL', widget: 'text' }),
  logo: cx(z.string().optional(), { label: 'Logo URL', widget: 'text' }),
  description: cx(z.string().optional(), { label: 'Description', widget: 'textarea' }),
  sameAs: cx(z.array(z.string()).optional(), { label: 'Social Profiles (sameAs)', widget: 'text' }),
  email: cx(z.string().optional(), { label: 'Contact Email', widget: 'text' }),
  telephone: cx(z.string().optional(), { label: 'Telephone', widget: 'text' }),
  address: cx(z.union([z.string(), PostalAddressSchema]).optional(), { label: 'Postal Address', widget: 'text' }),
  foundingDate: cx(z.string().optional(), { label: 'Founding Date', widget: 'text' }),
});

export type OrganizationData = z.infer<typeof OrganizationDataSchema>;
