import { siteSchema } from './site.schema';
import { staticConnector } from 'contextual-ui-connector-static';
import { createContextualApp, InferData } from 'contextual-ui/server';

const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://contextual.site';

const connector = staticConnector({
  organization: {
    name: 'Tasuku Studio',
    url: 'https://tasuku.io',
    logo: '/images/onigiri_logo.svg',
    description: 'Creator and maintainer of Contextual UI.',
    sameAs: [
      'https://github.com/orchidtexture',
      'https://twitter.com/orchidtexture',
    ],
  },
  website: {
    name: 'Contextual UI Starter Kit',
    url: siteUrl,
    description: 'A headless UI and semantic SEO Knowledge Graph starter kit.',
  },
  webpage: {
    name: 'Contextual UI Starter Kit - Home',
    url: siteUrl,
    description: 'A headless UI and semantic SEO Knowledge Graph starter kit.',
  },
  faq: [
    { id: '1', question: 'What is Contextual UI Starter Kit?', answer: 'An open-source starter for SSOT apps.' },
    { id: '2', question: 'How does semantic SEO work with Contextual UI?', answer: 'Contextual UI automatically injects structured JSON-LD graphs for search engines and AI agents.' },
    { id: '3', question: 'Can I use custom Zod schemas for CMS validation?', answer: 'Yes, any Zod schema can be plugged into the CMS dashboard and form generator.' },
    { id: '4', question: 'Why use Contextual UI for building websites when AI is getting better and better?', answer: 'Well, libraries like Contextual UI are the kind of thing that make AI better, so lets use it!' },
  ],
  navbar: {
    brand: { name: 'Contextual', href: '/', logo: '/images/onigiri_logo.svg' },
    links: [
      { id: '1', label: 'Home', href: '/' },
      { id: '2', label: 'Docs', href: '/docs' },
      { id: '3', label: 'Schema Graph', href: '/schema' },
      // { id: '4', label: 'CMS Dashboard', href: '/cms' },
    ]
  },
  footer: {
    brand: {
      name: 'Contextual',
      logo: '/images/onigiri_logo.svg',
      href: '/',
      description: 'Headless UI components with built-in Agentic AI infrastructure and Schema.org SEO.',
    },
    columns: [
      {
        id: 'resources',
        title: 'Resources',
        links: [
          { id: '1', label: 'Docs', href: '/docs' },
          { id: '2', label: 'Schema Graph', href: '/schema' },
          { id: '3', label: '/api/graph.json ↗', href: '/api/graph.json', external: true },
        ],
      },
      {
        id: 'community',
        title: 'Community',
        links: [
          { id: '4', label: 'Tasuku Studio', href: 'https://tasuku.io', external: true },
        ],
      },
    ],
    legalLinks: [
      { id: 'l1', label: 'Privacy Policy', href: '/privacy' },
      { id: 'l2', label: 'Terms of Service', href: '/terms' },
    ],
    socials: [
      { id: 's1', platform: 'GitHub', href: 'https://github.com/orchidtexture', label: 'GitHub' },
      { id: 's2', platform: 'Twitter', href: 'https://twitter.com/orchidtexture', label: 'Twitter / X' },
    ],
    copyright: {
      holder: 'Tasuku Studio',
      year: 2026,
      text: 'Maintained by Tasuku Studio. Open-source under MIT license.',
    },
  },
  announcement: {
    enabled: true,
    message: '🚀 Welcome to the Contextual UI implementation reference website!',
  }
});

export const siteApp = createContextualApp({
  schema: siteSchema,
  connector: connector,
  baseUrl: siteUrl,
});

export type SiteData = InferData<typeof siteSchema>;

