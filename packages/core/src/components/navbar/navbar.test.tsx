import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Navbar } from './index';
import { ContextualSite } from '../site/ContextualSite';

const sampleNavData = {
  brand: {
    name: 'Contextual UI',
    logo: '/images/logo.svg',
    href: '/',
  },
  links: [
    { id: 'features', label: 'Features', href: '/#features' },
    { id: 'docs', label: 'Docs', href: '/docs' },
    { id: 'github', label: 'GitHub', href: 'https://github.com/orchidtexture/contextual-ui', external: true },
  ],
};

describe('Navbar Components', () => {
  it('renders Navbar.Brand automatically from context data', () => {
    const html = renderToString(
      <Navbar.Root data={sampleNavData}>
        <Navbar.Brand />
      </Navbar.Root>
    );

    expect(html).toContain('data-contextual="navbar-brand"');
    expect(html).toContain('Contextual UI');
    expect(html).toContain('src="/images/logo.svg"');
    expect(html).toContain('href="/"');
  });

  it('supports Navbar.Brand with render prop function', () => {
    const html = renderToString(
      <Navbar.Root data={sampleNavData}>
        <Navbar.Brand className="custom-brand">
          {(brand) => (
            <span className="brand-title">{brand?.name?.toUpperCase()}</span>
          )}
        </Navbar.Brand>
      </Navbar.Root>
    );

    expect(html).toContain('class="custom-brand"');
    expect(html).toContain('CONTEXTUAL UI');
  });

  it('renders Navbar.Links with render prop function', () => {
    const html = renderToString(
      <Navbar.Root data={sampleNavData}>
        <Navbar.Links className="nav-links">
          {(links) => (
            <ul>
              {links.map((link) => (
                <li key={link.id}>
                  <Navbar.Link item={link} className="nav-link" />
                </li>
              ))}
            </ul>
          )}
        </Navbar.Links>
      </Navbar.Root>
    );

    expect(html).toContain('data-contextual="navbar-links"');
    expect(html).toContain('Features');
    expect(html).toContain('href="/#features"');
    expect(html).toContain('href="/docs"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('renders Navbar.Links automatically when no children provided', () => {
    const html = renderToString(
      <Navbar.Root data={sampleNavData}>
        <Navbar.Links className="auto-links" />
      </Navbar.Root>
    );

    expect(html).toContain('data-contextual="navbar-links"');
    expect(html).toContain('Features');
    expect(html).toContain('Docs');
  });

  it('renders Navbar.Links with renderItem prop', () => {
    const html = renderToString(
      <Navbar.Root data={sampleNavData}>
        <Navbar.Links
          className="custom-links"
          renderItem={(item) => (
            <Navbar.Link key={item.id} item={item} className="item-styled" />
          )}
        />
      </Navbar.Root>
    );

    expect(html).toContain('data-contextual="navbar-links"');
    expect(html).toContain('class="custom-links"');
    expect(html).toContain('class="item-styled"');
    expect(html).toContain('Docs');
  });

  it('renders Navbar.Link with external link attributes automatically', () => {
    const html = renderToString(
      <Navbar.Root data={sampleNavData}>
        <Navbar.Link href="https://example.com">External Link</Navbar.Link>
      </Navbar.Root>
    );

    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('External Link');
  });

  it('renders Navbar.Links with linkClassName automatically applied', () => {
    const html = renderToString(
      <Navbar.Root data={sampleNavData}>
        <Navbar.Links className="auto-links" linkClassName="styled-link-class" />
      </Navbar.Root>
    );

    expect(html).toContain('data-contextual="navbar-links"');
    expect(html).toContain('class="styled-link-class"');
    expect(html).toContain('Features');
    expect(html).toContain('Docs');
  });

  it('appends child Navbar.Link inside Navbar.Links and inherits linkClassName', () => {
    const html = renderToString(
      <Navbar.Root data={sampleNavData}>
        <Navbar.Links
          className="flex gap-6 items-center"
          linkClassName="hover:text-silver text-sm"
        >
          <Navbar.Link href="/custom-link">Custom Link</Navbar.Link>
          <Navbar.Link href="/override" className="override-class">
            Override Link
          </Navbar.Link>
        </Navbar.Links>
      </Navbar.Root>
    );

    expect(html).toContain('data-contextual="navbar-links"');
    expect(html).toContain('class="flex gap-6 items-center"');
    // Schema links should have linkClassName
    expect(html).toContain('href="/docs"');
    // Child link without className inherits linkClassName
    expect(html).toContain('href="/custom-link"');
    expect(html).toContain('class="hover:text-silver text-sm"');
    // Child link with explicit className overrides it
    expect(html).toContain('class="override-class"');
  });

  it('resolves data automatically from ContextualSite without explicit data prop', () => {
    const siteData = {
      navbar: sampleNavData,
    };

    const html = renderToString(
      <ContextualSite data={siteData}>
        <Navbar.Root>
          <Navbar.Brand />
          <Navbar.Links
            className="flex gap-6 items-center"
            linkClassName="site-link"
          />
        </Navbar.Root>
      </ContextualSite>
    );

    expect(html).toContain('Contextual UI');
    expect(html).toContain('class="site-link"');
    expect(html).toContain('Features');
    expect(html).toContain('Docs');
  });
});
