import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Content } from './Content';
import type { ContentInput } from '../../content/content.schema';

describe('Content Component Rendering', () => {
  it('renders paragraph blocks with role attributes', () => {
    const input: ContentInput = [
      'Normal introduction paragraph.',
      {
        type: 'paragraph',
        role: 'qualifier',
        text: 'Human verification required before deploying AI decisions.',
      },
      {
        type: 'paragraph',
        role: 'disclaimer',
        text: 'This moving scenario is illustrative and not a guaranteed outcome.',
      },
    ];

    const html = renderToString(<Content data={input} className="prose-content" />);

    expect(html).toContain('data-contextual="content-root"');
    expect(html).toContain('class="prose-content"');
    expect(html).toContain('Normal introduction paragraph.');
    expect(html).toContain('data-role="qualifier"');
    expect(html).toContain('Human verification required');
    expect(html).toContain('data-role="disclaimer"');
    expect(html).toContain('This moving scenario is illustrative');
  });

  it('renders headings with consumer-specified levels', () => {
    const input: ContentInput = [
      { type: 'heading', text: 'Main Heading', level: 2 },
      { type: 'heading', text: 'Sub Subsection', level: 4 },
    ];

    const html = renderToString(<Content data={input} />);

    expect(html).toContain('<h2 data-contextual="content-heading">Main Heading</h2>');
    expect(html).toContain('<h4 data-contextual="content-heading">Sub Subsection</h4>');
  });

  it('renders ordered and unordered lists with rich items', () => {
    const input: ContentInput = [
      {
        type: 'list',
        style: 'unordered',
        items: ['First item', { title: 'Rule', text: 'Never hardcode secrets' }],
      },
      {
        type: 'list',
        style: 'ordered',
        items: ['Step 1', 'Step 2'],
      },
    ];

    const html = renderToString(<Content data={input} />);

    expect(html).toContain('<ul data-contextual="content-list">');
    expect(html).toContain('<li>First item</li>');
    expect(html).toContain('<strong>Rule');
    expect(html).toContain('Never hardcode secrets');
    expect(html).toContain('<ol data-contextual="content-list">');
    expect(html).toContain('<li>Step 1</li>');
  });

  it('renders safe links and enforces noopener on external links', () => {
    const input: ContentInput = [
      {
        type: 'link',
        label: 'Internal Docs',
        href: '/docs',
      },
      {
        type: 'link',
        label: 'External GitHub',
        href: 'https://github.com/orchidtexture/contextual-ui',
        external: true,
      },
    ];

    const html = renderToString(<Content data={input} />);

    expect(html).toContain('href="/docs"');
    expect(html).toContain('href="https://github.com/orchidtexture/contextual-ui"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('renders callout and code blocks', () => {
    const input: ContentInput = [
      {
        type: 'callout',
        title: 'Note',
        text: 'Contextual UI is headless and unstyled.',
        variant: 'note',
      },
      {
        type: 'code',
        code: 'npm install contextual-ui',
        language: 'bash',
      },
    ];

    const html = renderToString(<Content data={input} />);

    expect(html).toContain('data-contextual="content-callout"');
    expect(html).toContain('role="note"');
    expect(html).toContain('<strong>Note</strong>');
    expect(html).toContain('data-contextual="content-code"');
    expect(html).toContain('data-language="bash"');
    expect(html).toContain('npm install contextual-ui');
  });

  it('supports custom component slot overrides', () => {
    const input: ContentInput = [
      {
        type: 'paragraph',
        text: 'Overridden paragraph',
      },
    ];

    const CustomParagraph = ({ block }: any) => (
      <div className="custom-p">{block.text}</div>
    );

    const html = renderToString(
      <Content data={input} components={{ paragraph: CustomParagraph }} />
    );

    expect(html).toContain('<div class="custom-p">Overridden paragraph</div>');
    expect(html).not.toContain('data-contextual="content-paragraph"');
  });

  it('returns null when content is empty or undefined', () => {
    const html = renderToString(<Content data={[]} />);
    expect(html).toBe('');
  });
});
