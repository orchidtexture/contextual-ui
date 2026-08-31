import {
  defineSchema,
  organizationRegistry,
  websiteRegistry,
  webpageRegistry,
  navbarRegistry,
  faqRegistry,
  footerRegistry,
  formRegistry,
} from 'contextual-ui/server';
import { z } from 'zod';

export const siteSchema = defineSchema({
  organization: organizationRegistry(),
  website: websiteRegistry(),
  webpage: webpageRegistry(),
  navbar: navbarRegistry(),
  footer: footerRegistry(),
  faq: faqRegistry(),
  forms: formRegistry(),
  announcement: {
    schema: z.object({
      enabled: z.boolean(),
      message: z.string().describe('Announcement Banner Text'),
    }),
  },
});
