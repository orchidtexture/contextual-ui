import { defineSchema, cx } from './defineSchema';
import { faqRegistry } from '../components/faq/faq.utils';
import { navbarRegistry } from '../components/navbar/navbar.utils';
import { footerRegistry } from '../components/footer/footer.utils';
import { z } from 'zod';

const faqData = [
  { id: '1', question: 'What is Contextual UI?', answer: 'A headless library.' }
];

const navbarData = {
  brand: { name: 'Contextual UI', href: '/' },
  links: [{ id: '1', label: 'Home', href: '/' }]
};

const footerData = {
  brand: { name: 'Contextual UI', href: '/' },
  links: [
    { id: '1', label: 'Docs', href: '/docs' },
    { id: '2', label: 'Schema', href: '/schema' },
  ],
  columns: [
    {
      id: 'resources',
      title: 'Resources',
      links: [{ id: 'r1', label: 'Docs', href: '/docs' }],
    },
  ],
  copyright: {
    holder: 'Tasuku Studio',
    year: 2025,
  },
};

const siteSchema = defineSchema({
  faq: faqRegistry(),
  navbar: navbarRegistry(),
  footer: footerRegistry(),
  title: {
    schema: cx(z.string(), { widget: 'text', label: 'Site Title' })
  }
});

const mockConnector = {
  async fetchData() {
    return {
      faq: faqData,
      navbar: navbarData,
      footer: footerData,
      title: 'My Awesome Site'
    };
  }
};

async function runTests() {
  const rawData = await mockConnector.fetchData();
  const validated = siteSchema.parse(rawData);
  const agentData = siteSchema.getAgentData(validated);
  console.log('Static Connector Agent Data:', JSON.stringify(agentData, null, 2));

  // Test client hydration
  const hydrated = siteSchema.hydrate({
    faq: faqData,
    navbar: navbarData,
    footer: footerData,
    title: 'My Awesome Site'
  });
  console.log('Hydrated Agent Data:', JSON.stringify(hydrated.getAgentData(), null, 2));

  // Test JSON-LD generation
  const graph = hydrated.generateGraph({ baseUrl: 'https://example.com' });
  console.log('Generated Graph:', JSON.stringify(graph, null, 2));
}

runTests();
