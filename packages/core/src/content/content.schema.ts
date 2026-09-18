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

const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/**
 * Validates whether a URL/URI href string uses a safe protocol for web links.
 * Rejects dangerous schemes like javascript:, data:, vbscript:, and file:.
 */
export function isSafeHref(href: string): boolean {
  if (typeof href !== 'string') return false;
  const trimmed = href.trim();
  if (trimmed.length === 0) return false;

  // Relative paths and anchor fragments are safe
  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('../')
  ) {
    return true;
  }

  // Protocol-relative URLs
  if (trimmed.startsWith('//')) {
    return true;
  }

  const colonIndex = trimmed.indexOf(':');
  if (colonIndex > 0) {
    const scheme = trimmed.slice(0, colonIndex + 1).toLowerCase();
    if (scheme === 'javascript:' || scheme === 'data:' || scheme === 'vbscript:' || scheme === 'file:') {
      return false;
    }
    return SAFE_PROTOCOLS.has(scheme);
  }

  return false;
}

/**
 * Link content block.
 */
export const LinkBlockSchema = z.object({
  type: z.literal('link'),
  label: cx(z.string(), { label: 'Label', widget: 'text' }),
  href: cx(
    z.string().refine((val) => isSafeHref(val), {
      message: 'Unsafe or unsupported link protocol. Allowed: http, https, mailto, tel, or relative path.',
    }),
    { label: 'URL', widget: 'text' }
  ),
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
 * Code snippet content block for documentation and setup instructions.
 */
export const CodeBlockSchema = z.object({
  type: z.literal('code'),
  code: cx(z.string(), { label: 'Code', widget: 'textarea' }),
  language: z.string().optional(),
  filename: z.string().optional(),
});
export type CodeBlock = z.infer<typeof CodeBlockSchema>;

/**
 * Discriminated union of all supported serializable content block types.
 */
export const ContentBlockSchema = z.discriminatedUnion('type', [
  ParagraphBlockSchema,
  HeadingBlockSchema,
  ListBlockSchema,
  LinkBlockSchema,
  CalloutBlockSchema,
  CodeBlockSchema,
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

/**
 * Schema for an individual item inside a collection.
 */
export const CollectionItemSchema = z.object({
  id: cx(z.string(), { label: 'Item ID', widget: 'text' }),
  title: cx(z.string().optional(), { label: 'Item Title', widget: 'text' }),
  name: cx(z.string().optional(), { label: 'Item Name', widget: 'text' }),
  description: cx(z.string().optional(), { label: 'Description', widget: 'textarea' }),
  content: ContentInputSchema.optional(),
  url: z.string().optional(),
  order: z.number().optional(),
  item: z.union([z.string(), z.record(z.string(), z.any())]).optional(),
  type: z.string().optional().default('ListItem'),
});
export type CollectionItem = z.infer<typeof CollectionItemSchema>;

/**
 * Schema for a structured collection of items (features, steps, catalog items).
 */
export const CollectionRecordSchema = z.object({
  id: cx(z.string(), { label: 'Collection ID', widget: 'text' }),
  pageId: cx(z.string().optional(), { label: 'Page ID', widget: 'text' }),
  title: cx(z.string().optional(), { label: 'Collection Title', widget: 'text' }),
  name: cx(z.string().optional(), { label: 'Collection Name', widget: 'text' }),
  description: cx(z.string().optional(), { label: 'Description', widget: 'textarea' }),
  ordered: z.boolean().optional().default(false),
  items: z.array(CollectionItemSchema).default([]),
  type: z.string().optional().default('ItemList'),
});
export type CollectionRecord = z.infer<typeof CollectionRecordSchema>;

/**
 * Collection registry schema: single collection or an array of collections.
 */
export const CollectionDataSchema = z.union([
  CollectionRecordSchema,
  z.array(CollectionRecordSchema),
]);
export type CollectionData = z.infer<typeof CollectionDataSchema>;
