import { defineSchema, faqRegistry, navbarRegistry, websiteRegistry } from '@contextual-ui/core/server';
import { z } from 'zod';

export const siteSchema = defineSchema({
  website: websiteRegistry(),
  faq: faqRegistry(),
  navbar: navbarRegistry(),
  announcement: {
    schema: z.object({
      enabled: z.boolean(),
      message: z.string().describe('Announcement Banner Text'),
    }),
  },
});
