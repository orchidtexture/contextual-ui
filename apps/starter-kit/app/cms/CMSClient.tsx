'use client';

import { ContextualDashboard } from 'contextual-ui-dashboard';
import { z } from 'zod';
import { siteSchema } from '@/data/site.schema';

const ContactSchema = z.object({
  email: z.string().email('Invalid email address').describe('Your Email Address'),
  message: z.string().min(10, 'Message is too short').describe('Your Message'),
});

export function CMSClient({ context }: { context: any }) {
  const fullContext = {
    raw: context.raw,
    config: siteSchema.config,
  };

  return (
    <ContextualDashboard
      context={fullContext}
      title="Contextual UI Enterprise CMS"
      forms={{
        contact: ContactSchema,
      }}
    />
  );
}
