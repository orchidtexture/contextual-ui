import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Faq } from './index';
import { ContextualSite } from '../site/ContextualSite';

const sampleFaqData = [
  { id: '1', question: 'What is Contextual UI?', answer: 'A headless library.' },
  { id: '2', question: 'How does it work?', answer: 'By generating JSON-LD graphs.' },
];

describe('Faq Component script emission & deduplication', () => {
  it('injects standalone JSON-LD script tag when rendered outside ContextualSite', () => {
    const html = renderToString(
      <Faq.Root data={sampleFaqData}>
        {sampleFaqData.map((item) => (
          <Faq.Item key={item.id} id={item.id}>
            <Faq.Trigger>{item.question}</Faq.Trigger>
            <Faq.Content>{item.answer}</Faq.Content>
          </Faq.Item>
        ))}
      </Faq.Root>
    );

    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain('FAQPage');
    expect(html).toContain('What is Contextual UI?');
  });

  it('does NOT inject duplicate JSON-LD script when rendered inside ContextualSite', () => {
    const siteData = {
      faq: sampleFaqData,
    };

    const html = renderToString(
      <ContextualSite data={siteData} options={{ disableJsonLdScript: true }}>
        <Faq.Root>
          {sampleFaqData.map((item) => (
            <Faq.Item key={item.id} id={item.id}>
              <Faq.Trigger>{item.question}</Faq.Trigger>
              <Faq.Content>{item.answer}</Faq.Content>
            </Faq.Item>
          ))}
        </Faq.Root>
      </ContextualSite>
    );

    // Inside ContextualSite, Faq.Root should NOT inject its own <script>
    expect(html).not.toContain('type="application/ld+json"');
  });

  it('honors explicit injectJsonLd override prop inside ContextualSite', () => {
    const siteData = {
      faq: sampleFaqData,
    };

    const html = renderToString(
      <ContextualSite data={siteData} options={{ disableJsonLdScript: true }}>
        <Faq.Root injectJsonLd={true}>
          {sampleFaqData.map((item) => (
            <Faq.Item key={item.id} id={item.id}>
              <Faq.Trigger>{item.question}</Faq.Trigger>
              <Faq.Content>{item.answer}</Faq.Content>
            </Faq.Item>
          ))}
        </Faq.Root>
      </ContextualSite>
    );

    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain('FAQPage');
  });
});
