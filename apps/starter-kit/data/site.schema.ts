import { defineSchema, faqRegistry, navbarRegistry, footerRegistry, websiteRegistry } from '@contextual-ui/core/server';
import { z } from 'zod';

export const siteSchema = defineSchema({
  website: websiteRegistry(),
  faq: faqRegistry(),
  navbar: navbarRegistry(),
  footer: footerRegistry(),
  announcement: {
    schema: z.object({
      enabled: z.boolean(),
      message: z.string().describe('Announcement Banner Text'),
    }),
  },
});
