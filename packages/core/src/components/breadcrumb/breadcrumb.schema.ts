import { z } from 'zod';

export const BreadcrumbItemSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Label cannot be empty"),
  url: z.string().optional(),
});

export const BreadcrumbDataSchema = z.array(BreadcrumbItemSchema);

export type BreadcrumbItem = z.infer<typeof BreadcrumbItemSchema>;
export type BreadcrumbData = z.infer<typeof BreadcrumbDataSchema>;
