import { z } from 'zod';
import { cx } from '../../registry/defineSchema';

export const WebsiteDataSchema = z.object({
  name: cx(z.string(), { label: 'Website Name', widget: 'text' }),
  url: cx(z.string().optional(), { label: 'Website URL', widget: 'text' }),
  description: cx(z.string().optional(), { label: 'Website Description', widget: 'textarea' }),
  publisher: cx(z.string().optional(), { label: 'Publisher Organization ID', widget: 'text' }),
  hasPart: z.array(z.string()).optional(),
});

export type WebsiteData = z.infer<typeof WebsiteDataSchema>;
