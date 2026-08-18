'use client';

import { ContextualDashboard } from '@contextual-ui/dashboard';
import { z } from 'zod';
import { cx } from '@contextual-ui/core';
import { siteSchema } from '@/data/site.schema';

const ContactSchema = z.object({
  email: cx(z.string().email('Invalid email address'), { label: 'Your Email', widget: 'text', placeholder: 'name@example.com' }),
  message: cx(z.string().min(10, 'Message is too short'), { label: 'Your Message', widget: 'textarea', placeholder: 'Tell us about your project...', rows: 5 }),
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
