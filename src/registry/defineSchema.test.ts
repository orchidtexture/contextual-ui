import { defineSchema, staticConnector } from './defineSchema';
import { faqRegistry } from '../components/faq/faq.utils';
import { navbarRegistry } from '../components/navbar/navbar.utils';

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
});

const serverContext = siteSchema.withConnector(staticConnector({
  faq: faqData,
  navbar: navbarData,
}));

async function runTests() {
  const agentData = await serverContext.getAgentData();
  console.log('New Connector Agent Data:', agentData);

  // Test client hydration
  const hydrated = siteSchema.hydrate({
    faq: faqData,
    navbar: navbarData,
  });
  console.log('Hydrated Agent Data:', hydrated.getAgentData());
}

runTests();
