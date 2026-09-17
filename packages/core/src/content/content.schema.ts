import { z } from 'zod';
import { cx } from '../registry/defineSchema';

/**
 * Supported roles for content blocks, providing semantic intent for readers,
 * search engines, and AI agents (e.g. distinguishing caveats and disclaimers).
 */
export const ContentBlockRoleSchema = z.enum([
  'normal',
  'lead',
  'note',
  'qualifier',
  'disclaimer',
]);
export type ContentBlockRole = z.infer<typeof ContentBlockRoleSchema>;

/**
 * Paragraph content block.
 */
export const ParagraphBlockSchema = z.object({
  type: z.literal('paragraph'),
  text: cx(z.string(), { label: 'Text', widget: 'textarea' }),
  role: ContentBlockRoleSchema.optional().default('normal'),
});
export type ParagraphBlock = z.infer<typeof ParagraphBlockSchema>;

/**
 * Heading content block for long-form section content.
 */
export const HeadingBlockSchema = z.object({
  type: z.literal('heading'),
  text: cx(z.string(), { label: 'Heading', widget: 'text' }),
  level: z.union([
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
  ]).optional().default(2),
});
export type HeadingBlock = z.infer<typeof HeadingBlockSchema>;

/**
 * List item inside a list block.
 */
export const ContentListItemSchema = z.union([
  z.string(),
  z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    text: z.string(),
    role: z.string().optional(),
  }),
]);
export type ContentListItem = z.infer<typeof ContentListItemSchema>;

/**
 * List content block (ordered or unordered).
 */
export const ListBlockSchema = z.object({
  type: z.literal('list'),
  style: z.enum(['unordered', 'ordered']).optional().default('unordered'),
  items: z.array(ContentListItemSchema),
});
export type ListBlock = z.infer<typeof ListBlockSchema>;

/**
 * Link content block.
 */
export const LinkBlockSchema = z.object({
  type: z.literal('link'),
  label: cx(z.string(), { label: 'Label', widget: 'text' }),
  href: cx(z.string(), { label: 'URL', widget: 'text' }),
  external: z.boolean().optional(),
  relationship: z.string().optional(),
});
export type LinkBlock = z.infer<typeof LinkBlockSchema>;

/**
 * Callout content block (caveat, warning, note, info).
 */
export const CalloutBlockSchema = z.object({
  type: z.literal('callout'),
  title: z.string().optional(),
  text: z.string(),
  variant: z.enum(['info', 'warning', 'note', 'caveat']).optional().default('info'),
});
export type CalloutBlock = z.infer<typeof CalloutBlockSchema>;

/**
 * Discriminated union of all supported serializable content block types.
 */
export const ContentBlockSchema = z.discriminatedUnion('type', [
  ParagraphBlockSchema,
  HeadingBlockSchema,
  ListBlockSchema,
  LinkBlockSchema,
  CalloutBlockSchema,
]);
export type ContentBlock = z.infer<typeof ContentBlockSchema>;

/**
 * Ergonomic input representation: string, block, or array of strings/blocks.
 */
export const ContentInputSchema = z.union([
  z.string(),
  ContentBlockSchema,
  z.array(z.union([z.string(), ContentBlockSchema])),
]);
export type ContentInput = z.infer<typeof ContentInputSchema>;

/**
 * Schema for an individual page section record.
 */
export const SectionRecordSchema = z.object({
  id: cx(z.string(), { label: 'Section ID', widget: 'text' }),
  pageId: cx(z.string().optional(), { label: 'Page ID', widget: 'text' }),
  title: cx(z.string().optional(), { label: 'Section Title', widget: 'text' }),
  subtitle: cx(z.string().optional(), { label: 'Subtitle', widget: 'text' }),
  description: cx(z.string().optional(), { label: 'Description', widget: 'textarea' }),
  anchor: cx(z.string().optional(), { label: 'DOM Anchor', widget: 'text' }),
  content: ContentInputSchema.optional(),
  order: z.number().optional(),
  about: z.union([z.string(), z.array(z.string())]).optional(),
  mainEntity: z.union([z.string(), z.array(z.string())]).optional(),
  inLanguage: z.string().optional(),
  type: z.string().optional().default('WebPageElement'),
});
export type SectionRecord = z.infer<typeof SectionRecordSchema>;

/**
 * Section registry schema: single section or an array of sections.
 */
export const SectionDataSchema = z.union([
  SectionRecordSchema,
  z.array(SectionRecordSchema),
]);
export type SectionData = z.infer<typeof SectionDataSchema>;
