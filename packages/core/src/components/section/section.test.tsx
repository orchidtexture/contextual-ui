import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Section } from './Section';
import type { SectionRecord } from '../../content/content.schema';

describe('Section Primitive Rendering', () => {
  const sampleSection: SectionRecord = {
    id: 'headless-radix',
    pageId: 'home',
    title: 'Headless & Radix Powered',
    subtitle: 'Accessible UI primitives',
    description: 'Unstyled primitives with automated Schema.org markup.',
    anchor: 'headless-radix',
    content: [
      {
        type: 'paragraph',
        role: 'normal',
        text: 'Slot into custom buttons and links.',
      },
      {
        type: 'paragraph',
        role: 'qualifier',
        text: 'Why it matters: You get top-tier SEO without compromising UI styling.',
      },
    ],
  };

  it('renders Section.Root with automatic aria-labelledby and anchor id', () => {
    const html = renderToString(
      <Section.Root data={sampleSection}>
        <Section.Title />
        <Section.Subtitle />
        <Section.Description />
        <Section.Content />
      </Section.Root>
    );

    expect(html).toContain('id="headless-radix"');
    expect(html).toContain('aria-labelledby="headless-radix-heading"');
    expect(html).toContain('data-contextual="section-root"');

    expect(html).toContain('id="headless-radix-heading"');
    expect(html).toContain('data-contextual="section-title"');
    expect(html).toContain('Headless &amp; Radix Powered');

    expect(html).toContain('data-contextual="section-subtitle"');
    expect(html).toContain('Accessible UI primitives');

    expect(html).toContain('data-contextual="section-description"');
    expect(html).toContain('Unstyled primitives with automated Schema.org markup.');

    expect(html).toContain('data-contextual="section-content"');
    expect(html).toContain('Slot into custom buttons and links.');
    expect(html).toContain('data-role="qualifier"');
    expect(html).toContain('Why it matters:');
  });

  it('supports consumer-controlled heading levels (as="h3")', () => {
    const html = renderToString(
      <Section.Root data={sampleSection}>
        <Section.Title as="h3" className="custom-heading-class" />
      </Section.Root>
    );

    expect(html).toContain('<h3 id="headless-radix-heading" data-contextual="section-title" class="custom-heading-class">');
  });

  it('supports explicit children overrides in Title and Description', () => {
    const html = renderToString(
      <Section.Root data={sampleSection}>
        <Section.Title>Custom Overridden Title</Section.Title>
        <Section.Description>Custom Overridden Description</Section.Description>
      </Section.Root>
    );

    expect(html).toContain('Custom Overridden Title');
    expect(html).toContain('Custom Overridden Description');
    expect(html).not.toContain('Headless &amp; Radix Powered');
  });

  it('supports polymorphic asChild rendering with Radix Slot', () => {
    const html = renderToString(
      <Section.Root data={sampleSection} asChild>
        <div className="custom-wrapper-div">
          <Section.Title asChild>
            <h1 className="h1-override" />
          </Section.Title>
        </div>
      </Section.Root>
    );

    expect(html).toContain('<div class="custom-wrapper-div" id="headless-radix" aria-labelledby="headless-radix-heading" data-contextual="section-root">');
    expect(html).toContain('<h1 class="h1-override" id="headless-radix-heading" data-contextual="section-title">Headless &amp; Radix Powered</h1>');
  });

  it('renders purely from explicit props without data record', () => {
    const html = renderToString(
      <Section.Root id="manual-section" title="Manual Section" description="Direct prop description">
        <Section.Title />
        <Section.Description />
      </Section.Root>
    );

    expect(html).toContain('id="manual-section"');
    expect(html).toContain('aria-labelledby="manual-section-heading"');
    expect(html).toContain('Manual Section');
    expect(html).toContain('Direct prop description');
  });
});
