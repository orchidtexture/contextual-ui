import { siteSchema } from './site.schema';
import { staticConnector } from '@contextual-ui/connector-static';

export const siteConnector = staticConnector({
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
