import { z } from 'zod';
import { cx } from '../../registry/defineSchema';

export const WebpageDataSchema = z.object({
  name: cx(z.string().optional(), { label: 'Page Name / Title', widget: 'text' }),
  url: cx(z.string().optional(), { label: 'Page URL', widget: 'text' }),
  description: cx(z.string().optional(), { label: 'Page Description', widget: 'textarea' }),
  isPartOf: cx(z.string().optional(), { label: 'Website ID', widget: 'text' }),
  hasPart: z.array(z.string()).optional(),
});

export type WebpageData = z.infer<typeof WebpageDataSchema>;
