import { z } from 'zod';
import { cx } from '../../registry/defineSchema';

export const WebpageItemSchema = z.object({
  id: z.string().optional().describe('Unique identifier/slug for the page (e.g. "home", "docs")'),
  name: cx(z.string().optional(), { label: 'Page Name / Title', widget: 'text' }),
  url: cx(z.string().optional(), { label: 'Page URL', widget: 'text' }),
  description: cx(z.string().optional(), { label: 'Page Description', widget: 'textarea' }),
  isPartOf: cx(z.string().optional(), { label: 'Website ID', widget: 'text' }),
  hasPart: z.array(z.string()).optional(),
  inLanguage: z.string().optional(),
});

export const WebpageDataSchema = z.union([
  WebpageItemSchema,
  z.array(WebpageItemSchema),
]);

export type WebpageItem = z.infer<typeof WebpageItemSchema>;
export type WebpageData = z.infer<typeof WebpageDataSchema>;

