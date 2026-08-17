import { defineSchema, cx } from './defineSchema';
import { faqRegistry } from '../components/faq/faq.utils';
import { navbarRegistry } from '../components/navbar/navbar.utils';
import { z } from 'zod';

const faqData = [
  { id: '1', question: 'What is Contextual UI?', answer: 'A headless library.' }
];

const navbarData = {
  brand: { name: 'Contextual UI', href: '/' },
  links: [{ id: '1', label: 'Home', href: '/' }]
};

const siteSchema = defineSchema({
  faq: faqRegistry(),
  navbar: navbarRegistry(),
  title: {
    schema: cx(z.string(), { widget: 'text', label: 'Site Title' })
  }
});

const mockConnector = {
  async fetchData() {
    return {
      faq: faqData,
      navbar: navbarData,
      title: 'My Awesome Site'
    };
  }
};

async function runTests() {
  const rawData = await mockConnector.fetchData();
  const validated = siteSchema.parse(rawData);
  const agentData = siteSchema.getAgentData(validated);
  console.log('Static Connector Agent Data:', agentData);

  // Test client hydration
  const hydrated = siteSchema.hydrate({
    faq: faqData,
    navbar: navbarData,
    title: 'My Awesome Site'
  });
  console.log('Hydrated Agent Data:', hydrated.getAgentData());
}

runTests();
