import { siteSchema } from './site.schema';
import { staticConnector } from '@contextual-ui/connector-static';
import { createContextualApp, InferData } from '@contextual-ui/core/server';

const connector = staticConnector({
  website: {
    name: 'Contextual UI Starter Kit',
    url: 'https://example.com',
    description: 'A headless UI and semantic SEO Knowledge Graph starter kit.',
  },
  faq: [
    { id: '1', question: 'What is Contextual UI Starter Kit?', answer: 'An open-source starter for SSOT apps.' }
  ],
  navbar: {
    brand: { name: 'Contextual UI', href: '/' },
    links: [
      { id: '1', label: 'Home', href: '/' },
      { id: '2', label: 'CMS Dashboard', href: '/cms' },
    ]
  },
  announcement: {
    enabled: true,
    message: '🚀 Welcome to the Contextual UI Single Source of Truth architecture!',
  }
});

export const siteApp = createContextualApp({
  schema: siteSchema,
  connector: connector,
});

export type SiteData = InferData<typeof siteSchema>;

