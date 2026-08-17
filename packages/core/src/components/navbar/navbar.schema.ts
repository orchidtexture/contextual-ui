import { z } from 'zod';

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  children?: NavItem[];
}

export const NavItemSchema: z.ZodType<NavItem> = z.lazy(() => z.object({
  id: z.string(),
  label: z.string(),
  href: z.string().optional(),
  children: z.array(NavItemSchema).optional(),
}));

export const NavbarDataSchema = z.object({
  brand: z.object({
    name: z.string(),
    logo: z.string().optional(),
    href: z.string().default('/'),
  }).optional(),
  links: z.array(NavItemSchema),
});

export type NavbarData = z.infer<typeof NavbarDataSchema>;
