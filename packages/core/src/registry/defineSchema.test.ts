import { describe, it, expect } from 'vitest';
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

describe('defineSchema', () => {
  it('parses and extracts agent data and hydrates correctly', async () => {
    const rawData = await mockConnector.fetchData();
    const validated = siteSchema.parse(rawData);
    const agentData = siteSchema.getAgentData(validated);
    expect(agentData.title).toBe('My Awesome Site');

    // Test client hydration
    const hydrated = siteSchema.hydrate({
      faq: faqData,
      navbar: navbarData,
      footer: footerData,
      title: 'My Awesome Site'
    });
    expect(hydrated.getAgentData().title).toBe('My Awesome Site');

    // Test JSON-LD generation
    const graph = hydrated.generateGraph({ baseUrl: 'https://example.com' });
    expect(graph['@graph'].length).toBeGreaterThan(0);
  });
});
