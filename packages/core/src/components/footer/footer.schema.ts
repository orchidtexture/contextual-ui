import { z } from 'zod';

export interface FooterLinkItem {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  target?: string;
  rel?: string;
}

export const FooterLinkItemSchema: z.ZodType<FooterLinkItem> = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
  external: z.boolean().optional(),
  target: z.string().optional(),
  rel: z.string().optional(),
});

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLinkItem[];
}

export const FooterColumnSchema: z.ZodType<FooterColumn> = z.object({
  id: z.string(),
  title: z.string(),
  links: z.array(FooterLinkItemSchema),
});

export interface FooterSocialLink {
  id: string;
  platform: string;
  href: string;
  label?: string;
  icon?: string;
}

export const FooterSocialLinkSchema: z.ZodType<FooterSocialLink> = z.object({
  id: z.string(),
  platform: z.string(),
  href: z.string(),
  label: z.string().optional(),
  icon: z.string().optional(),
});

export interface FooterBrand {
  name: string;
  logo?: string;
  href?: string;
  description?: string;
}

export const FooterBrandSchema: z.ZodType<FooterBrand> = z.object({
  name: z.string(),
  logo: z.string().optional(),
  href: z.string().default('/'),
  description: z.string().optional(),
});

export interface FooterCopyright {
  holder?: string;
  year?: number | string;
  text?: string;
}

export const FooterCopyrightSchema: z.ZodType<FooterCopyright> = z.object({
  holder: z.string().optional(),
  year: z.union([z.number(), z.string()]).optional(),
  text: z.string().optional(),
});

export const FooterDataSchema = z.object({
  brand: FooterBrandSchema.optional(),
  columns: z.array(FooterColumnSchema).optional(),
  links: z.array(FooterLinkItemSchema).optional(),
  legalLinks: z.array(FooterLinkItemSchema).optional(),
  socials: z.array(FooterSocialLinkSchema).optional(),
  copyright: FooterCopyrightSchema.optional(),
});

export type FooterData = z.infer<typeof FooterDataSchema>;
