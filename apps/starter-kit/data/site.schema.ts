import { defineSchema, faqRegistry, navbarRegistry, cx } from '@contextual-ui/core/server';
import { z } from 'zod';

export const siteSchema = defineSchema({
  faq: faqRegistry(),
  navbar: navbarRegistry(),
  announcement: {
    schema: z.object({
      enabled: z.boolean(),
      message: cx(z.string(), { label: 'Announcement Banner Text', widget: 'text' }),
    }),
  },
});
