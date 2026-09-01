import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Footer } from './index';
import { ContextualSite } from '../site/ContextualSite';

const sampleFooterData = {
  brand: {
    name: 'Contextual UI',
    logo: '/images/logo.svg',
    href: '/',
    description: 'Headless AI-ready components with Schema.org SEO.',
  },
  columns: [
    {
      id: 'resources',
      title: 'Resources',
      links: [
        { id: 'docs', label: 'Documentation', href: '/docs' },
        { id: 'guides', label: 'Guides', href: '/guides' },
        { id: 'github', label: 'GitHub', href: 'https://github.com/orchidtexture/contextual-ui', external: true },
      ],
    },
    {
      id: 'company',
      title: 'Company',
      links: [
        { id: 'about', label: 'About Us', href: '/about' },
        { id: 'blog', label: 'Blog', href: '/blog' },
      ],
    },
  ],
  links: [
    { id: 'privacy', label: 'Privacy Policy', href: '/privacy' },
    { id: 'terms', label: 'Terms of Service', href: '/terms' },
  ],
  legalLinks: [
    { id: 'privacy', label: 'Privacy Policy', href: '/privacy' },
    { id: 'terms', label: 'Terms of Service', href: '/terms' },
  ],
  socials: [
    { id: 'twitter', platform: 'Twitter', href: 'https://twitter.com/tasuku_ui', label: 'X / Twitter' },
    { id: 'github', platform: 'GitHub', href: 'https://github.com/orchidtexture/contextual-ui', label: 'GitHub' },
  ],
  copyright: {
    holder: 'Tasuku Studio',
    year: 2025,
  },
};

describe('Footer Components', () => {
  describe('Footer.Brand & Footer.Description', () => {
    it('renders Brand automatically from context data', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData}>
          <Footer.Brand />
        </Footer.Root>
      );

      expect(html).toContain('data-contextual="footer-brand"');
      expect(html).toContain('Contextual UI');
      expect(html).toContain('src="/images/logo.svg"');
      expect(html).toContain('href="/"');
    });

    it('supports Brand with render prop function', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData}>
          <Footer.Brand className="custom-brand">
            {(brand) => <span className="brand-title">{brand?.name?.toUpperCase()}</span>}
          </Footer.Brand>
        </Footer.Root>
      );

      expect(html).toContain('class="custom-brand"');
      expect(html).toContain('CONTEXTUAL UI');
    });

    it('renders Description automatically from context data', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData}>
          <Footer.Description className="desc-class" />
        </Footer.Root>
      );

      expect(html).toContain('data-contextual="footer-description"');
      expect(html).toContain('class="desc-class"');
      expect(html).toContain('Headless AI-ready components with Schema.org SEO.');
    });

    it('supports Description with render prop function', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData}>
          <Footer.Description>
            {(brand) => <em>{brand?.description}</em>}
          </Footer.Description>
        </Footer.Root>
      );

      expect(html).toContain('<em>Headless AI-ready components with Schema.org SEO.</em>');
    });
  });

  describe('Context-driven Link & Title ClassName Inheritance', () => {
    it('inherits linkClassName and titleClassName from Footer.Root', () => {
      const html = renderToString(
        <Footer.Root
          data={sampleFooterData}
          linkClassName="root-link-style"
          titleClassName="root-title-style"
        >
          <Footer.Columns>
            <Footer.Column id="resources" />
          </Footer.Columns>
        </Footer.Root>
      );

      expect(html).toContain('class="root-title-style"');
      expect(html).toContain('class="root-link-style"');
      expect(html).toContain('Documentation');
    });

    it('cascades linkClassName and titleClassName through Footer.Columns', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData} linkClassName="root-link">
          <Footer.Columns
            className="columns-grid"
            linkClassName="columns-link"
            titleClassName="columns-title"
          >
            <Footer.Column id="resources">
              <Footer.ColumnTitle />
              <Footer.Links />
            </Footer.Column>
          </Footer.Columns>
        </Footer.Root>
      );

      expect(html).toContain('class="columns-title"');
      expect(html).toContain('class="columns-link"');
      expect(html).not.toContain('class="root-link"');
    });

    it('allows Footer.Column to override linkClassName and titleClassName for its subtree', () => {
      const html = renderToString(
        <Footer.Root
          data={sampleFooterData}
          linkClassName="root-link"
          titleClassName="root-title"
        >
          <Footer.Columns>
            <Footer.Column
              id="resources"
              linkClassName="column-link"
              titleClassName="column-title"
            >
              <Footer.ColumnTitle />
              <Footer.Links />
              <Footer.Link href="/extra">Extra Resource</Footer.Link>
            </Footer.Column>
          </Footer.Columns>
        </Footer.Root>
      );

      expect(html).toContain('class="column-title"');
      expect(html).toContain('class="column-link"');
      // Extra appended custom link should also inherit column-link
      expect(html).toContain('href="/extra"');
      expect(html).toContain('Extra Resource');
    });

    it('allows individual Footer.Link to override inherited linkClassName', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData} linkClassName="root-link">
          <Footer.Column id="resources">
            <Footer.Link href="/custom" className="explicit-link">
              Explicit Custom Link
            </Footer.Link>
          </Footer.Column>
        </Footer.Root>
      );

      expect(html).toContain('class="explicit-link"');
      expect(html).not.toContain('class="root-link"');
    });
  });

  describe('Footer.Columns & Footer.Column', () => {
    it('auto-renders all columns when no children provided', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData}>
          <Footer.Columns className="grid grid-cols-2" />
        </Footer.Root>
      );

      expect(html).toContain('data-contextual="footer-columns"');
      expect(html).toContain('Resources');
      expect(html).toContain('Company');
      expect(html).toContain('Documentation');
      expect(html).toContain('About Us');
    });

    it('supports render prop function on Footer.Columns', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData}>
          <Footer.Columns className="grid-cols">
            {(columns) => (
              <div className="custom-col-wrapper">
                {columns.map((col) => (
                  <div key={col.id} className="custom-col">
                    <h4>{col.title}</h4>
                    <span className="count">{col.links.length} links</span>
                  </div>
                ))}
              </div>
            )}
          </Footer.Columns>
        </Footer.Root>
      );

      expect(html).toContain('class="custom-col-wrapper"');
      expect(html).toContain('<h4>Resources</h4>');
      expect(html).toContain('class="count"');
      expect(html).toContain('3');
      expect(html).toContain('<h4>Company</h4>');
      expect(html).toContain('2');
    });

    it('supports renderItem on Footer.Columns', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData}>
          <Footer.Columns
            className="grid-cols"
            renderItem={(col) => (
              <section key={col.id} className="rendered-section">
                <h3>{col.title}</h3>
              </section>
            )}
          />
        </Footer.Root>
      );

      expect(html).toContain('class="rendered-section"');
      expect(html).toContain('<h3>Resources</h3>');
      expect(html).toContain('<h3>Company</h3>');
    });

    it('supports render prop function on Footer.Column', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData}>
          <Footer.Column id="resources">
            {(col) => (
              <div className="custom-column-inner">
                <h2>{col?.title}</h2>
                <p>Link count: {col?.links.length}</p>
              </div>
            )}
          </Footer.Column>
        </Footer.Root>
      );

      expect(html).toContain('<h2>Resources</h2>');
      expect(html).toContain('Link count:');
      expect(html).toContain('3');
    });
  });

  describe('Footer.Links (Zero-Wrapper & Render Props)', () => {
    it('renders without forced <ul>/<li> wrapper when no className provided', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData}>
          <Footer.Column id="resources">
            <Footer.Links />
          </Footer.Column>
        </Footer.Root>
      );

      // Should not contain <ul> or <li>
      expect(html).not.toContain('<ul');
      expect(html).not.toContain('<li');
      expect(html).toContain('data-contextual="footer-link"');
      expect(html).toContain('Documentation');
      expect(html).toContain('Guides');
    });

    it('renders container div when className is provided to Footer.Links', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData}>
          <Footer.Column id="resources">
            <Footer.Links className="flex flex-col gap-2" />
          </Footer.Column>
        </Footer.Root>
      );

      expect(html).toContain('data-contextual="footer-links"');
      expect(html).toContain('class="flex flex-col gap-2"');
    });

    it('supports render prop function on Footer.Links', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData}>
          <Footer.Column id="resources">
            <Footer.Links className="custom-nav-list">
              {(links) => (
                <ul className="my-ul">
                  {links.map((link) => (
                    <li key={link.id} className="my-li">
                      <Footer.Link item={link} className="my-link" />
                    </li>
                  ))}
                </ul>
              )}
            </Footer.Links>
          </Footer.Column>
        </Footer.Root>
      );

      expect(html).toContain('class="my-ul"');
      expect(html).toContain('class="my-li"');
      expect(html).toContain('class="my-link"');
      expect(html).toContain('Documentation');
    });

    it('supports renderItem on Footer.Links', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData}>
          <Footer.Column id="resources">
            <Footer.Links
              renderItem={(link) => (
                <span key={link.id} className="link-wrapper">
                  <Footer.Link item={link} />
                </span>
              )}
            />
          </Footer.Column>
        </Footer.Root>
      );

      expect(html).toContain('class="link-wrapper"');
      expect(html).toContain('Documentation');
    });

    it('appends custom child Footer.Link alongside schema links', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData}>
          <Footer.Column id="company" linkClassName="company-link">
            <Footer.Links>
              <Footer.Link href="/careers">Careers</Footer.Link>
            </Footer.Links>
          </Footer.Column>
        </Footer.Root>
      );

      // Should render schema links
      expect(html).toContain('About Us');
      expect(html).toContain('Blog');
      // Should also render custom child link
      expect(html).toContain('href="/careers"');
      expect(html).toContain('Careers');
      // Child link should inherit company-link className
      expect(html).toContain('class="company-link"');
    });
  });

  describe('Footer.Socials & Footer.SocialLink', () => {
    it('auto-renders socials and inherits socialClassName from Footer.Root', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData} socialClassName="root-social-pill">
          <Footer.Socials />
        </Footer.Root>
      );

      expect(html).toContain('data-contextual="footer-social-link"');
      expect(html).toContain('class="root-social-pill"');
      expect(html).toContain('X / Twitter');
      expect(html).toContain('GitHub');
      expect(html).toContain('target="_blank"');
      expect(html).toContain('rel="noopener noreferrer"');
    });

    it('supports socialClassName override on Footer.Socials', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData} socialClassName="root-social">
          <Footer.Socials socialClassName="override-social" className="flex gap-2" />
        </Footer.Root>
      );

      expect(html).toContain('class="flex gap-2"');
      expect(html).toContain('class="override-social"');
      expect(html).not.toContain('class="root-social"');
    });

    it('supports render prop function on Footer.Socials', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData}>
          <Footer.Socials>
            {(socials) => (
              <div className="custom-socials-bar">
                {socials.map((s) => (
                  <a key={s.id} href={s.href} className="badge">
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
          </Footer.Socials>
        </Footer.Root>
      );

      expect(html).toContain('class="custom-socials-bar"');
      expect(html).toContain('class="badge"');
      expect(html).toContain('Twitter');
    });

    it('supports renderItem on Footer.Socials', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData}>
          <Footer.Socials
            renderItem={(item) => (
              <Footer.SocialLink key={item.id} item={item} className="item-social" />
            )}
          />
        </Footer.Root>
      );

      expect(html).toContain('class="item-social"');
      expect(html).toContain('X / Twitter');
    });
  });

  describe('Footer.Bottom & Footer.Copyright', () => {
    it('auto-renders Bottom with copyright and legal links and inherits linkClassName', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData}>
          <Footer.Bottom
            className="bottom-bar"
            linkClassName="bottom-link-style"
          />
        </Footer.Root>
      );

      expect(html).toContain('data-contextual="footer-bottom"');
      expect(html).toContain('class="bottom-bar"');
      expect(html).toContain('data-contextual="footer-copyright"');
      expect(html).toContain('© 2025 Tasuku Studio. All rights reserved.');
      expect(html).toContain('Privacy Policy');
      expect(html).toContain('Terms of Service');
      expect(html).toContain('class="bottom-link-style"');
    });

    it('supports render prop on Footer.Bottom', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData}>
          <Footer.Bottom className="custom-bottom">
            {(data) => (
              <div className="bottom-custom-content">
                <span>{data?.copyright?.holder}</span>
                <span>{data?.legalLinks?.length} legal docs</span>
              </div>
            )}
          </Footer.Bottom>
        </Footer.Root>
      );

      expect(html).toContain('class="custom-bottom"');
      expect(html).toContain('<span>Tasuku Studio</span>');
      expect(html).toContain('legal docs');
    });

    it('supports render prop on Footer.Copyright', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData}>
          <Footer.Copyright className="my-copy">
            {(data) => <span>Copyright {data?.copyright?.year} - {data?.brand?.name}</span>}
          </Footer.Copyright>
        </Footer.Root>
      );

      expect(html).toContain('class="my-copy"');
      expect(html).toContain('2025');
      expect(html).toContain('Contextual UI');
    });
  });

  describe('Pattern Verification from PLAN', () => {
    it('Pattern A: Zero Boilerplate composition works seamlessly', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData} className="bg-zinc-950 p-8">
          <Footer.Brand />
          <Footer.Columns
            className="grid grid-cols-4 gap-8"
            titleClassName="font-bold text-white mb-4"
            linkClassName="text-zinc-400 hover:text-white block py-1"
          />
          <Footer.Bottom
            className="border-t border-zinc-800 mt-8 pt-8 flex justify-between"
            linkClassName="text-xs text-zinc-500 hover:text-white"
          />
        </Footer.Root>
      );

      expect(html).toContain('class="bg-zinc-950 p-8"');
      expect(html).toContain('class="grid grid-cols-4 gap-8"');
      expect(html).toContain('class="font-bold text-white mb-4"');
      expect(html).toContain('class="text-zinc-400 hover:text-white block py-1"');
      expect(html).toContain('class="border-t border-zinc-800 mt-8 pt-8 flex justify-between"');
      expect(html).toContain('class="text-xs text-zinc-500 hover:text-white"');
      expect(html).toContain('Documentation');
      expect(html).toContain('Privacy Policy');
    });

    it('Pattern B: Composable with Custom Elements works seamlessly', () => {
      const html = renderToString(
        <Footer.Root data={sampleFooterData} className="footer-container">
          <Footer.Columns className="grid grid-cols-3">
            <Footer.Column id="resources" linkClassName="hover:underline">
              <Footer.ColumnTitle />
              <Footer.Links />
              <Footer.Link href="/custom">Custom Resource</Footer.Link>
            </Footer.Column>
          </Footer.Columns>
        </Footer.Root>
      );

      expect(html).toContain('class="footer-container"');
      expect(html).toContain('class="grid grid-cols-3"');
      expect(html).toContain('data-id="resources"');
      expect(html).toContain('Documentation');
      expect(html).toContain('href="/custom"');
      expect(html).toContain('Custom Resource');
      expect(html).toContain('class="hover:underline"');
    });

    it('Resolves data from ContextualSite context when no data prop is provided', () => {
      const siteData = {
        footer: sampleFooterData,
      };

      const html = renderToString(
        <ContextualSite data={siteData}>
          <Footer.Root
            linkClassName="site-link"
            titleClassName="site-title"
          >
            <Footer.Brand />
            <Footer.Columns />
            <Footer.Bottom />
          </Footer.Root>
        </ContextualSite>
      );

      expect(html).toContain('Contextual UI');
      expect(html).toContain('class="site-title"');
      expect(html).toContain('class="site-link"');
      expect(html).toContain('Documentation');
      expect(html).toContain('Privacy Policy');
    });
  });
});
