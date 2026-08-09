import { defineContext } from './defineContext';
import { FaqDataSchema, exportAgentData as exportFaqAgentData } from '../components/faq';
import { NavbarDataSchema, exportAgentData as exportNavbarAgentData } from '../components/navbar';

const faqData = [
  { id: '1', question: 'What is Contextual UI?', answer: 'A headless library.' }
];

const navbarData = {
  brand: { name: 'Contextual UI', href: '/' },
  links: [{ id: '1', label: 'Home', href: '/' }]
};

const siteContext = defineContext({
  faq: {
    schema: FaqDataSchema,
    data: faqData,
    exportAgentData: exportFaqAgentData,
  },
  navbar: {
    schema: NavbarDataSchema,
    data: navbarData,
    exportAgentData: exportNavbarAgentData,
  }
});

// Test type inference and agent data generation
const agentData = siteContext.getAgentData();
console.log('Agent Data:', agentData);
