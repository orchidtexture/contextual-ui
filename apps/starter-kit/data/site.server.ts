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
    { id: '1', question: 'What is Contextual UI Starter Kit?', answer: 'An open-source starter for SSOT apps.' },
    { id: '2', question: 'How does semantic SEO work with Contextual UI?', answer: 'Contextual UI automatically injects structured JSON-LD graphs for search engines and AI agents.' },
    { id: '3', question: 'Can I use custom Zod schemas for CMS validation?', answer: 'Yes, any Zod schema can be plugged into the CMS dashboard and form generator.' }
  ],
  navbar: {
    brand: { name: 'Contextual UI', href: '/' },
    links: [
      { id: '1', label: 'Home', href: '/' },
      { id: '2', label: 'Components', href: '/components' },
      { id: '3', label: 'Schema Graph', href: '/schema' },
      // { id: '4', label: 'CMS Dashboard', href: '/cms' },
    ]
  },
  announcement: {
    enabled: true,
    message: '🚀 Welcome to the Contextual UI implementation reference website!',
  }
});

export const siteApp = createContextualApp({
  schema: siteSchema,
  connector: connector,
});

export type SiteData = InferData<typeof siteSchema>;

