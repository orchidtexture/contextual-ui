import { describe, it, expect } from 'vitest';
import {
  buildGraph,
  createId,
  refersTo,
  createPotentialAction,
  createPropertyValueSpecification,
  inferValuePattern,
} from '../index';

describe('JSON-LD Graph Builder', () => {
  it('canonicalizes relative @id values against baseUrl', () => {
    const entities = [
      {
        '@type': 'Organization',
        '@id': '#organization',
        name: 'Acme Corp',
      },
      {
        '@type': 'WebSite',
        '@id': '/site#website',
        name: 'Acme Site',
      },
    ];

    const result = buildGraph(entities, {
      baseUrl: 'https://example.com',
    });

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@graph']).toHaveLength(2);
    expect(result['@graph'][0]['@id']).toBe('https://example.com/#organization');
    expect(result['@graph'][1]['@id']).toBe('https://example.com/site#website');
  });

  it('flattens nested entities into root @graph and leaves reference pointers', () => {
    const article = {
      '@type': 'Article',
      '@id': '#article/1',
      headline: 'Deep Dive into Structured Data',
      author: {
        '@type': 'Person',
        '@id': '#author/jane',
        name: 'Jane Doe',
      },
    };

    const result = buildGraph([article], {
      baseUrl: 'https://example.com',
      flatten: true,
    });

    expect(result['@graph']).toHaveLength(2);

    const flattenedArticle = result['@graph'].find((n) => n['@type'] === 'Article');
    const flattenedAuthor = result['@graph'].find((n) => n['@type'] === 'Person');

    expect(flattenedArticle).toBeDefined();
    expect(flattenedAuthor).toBeDefined();

    expect(flattenedArticle!['@id']).toBe('https://example.com/#article/1');
    expect(flattenedArticle!.author).toEqual({
      '@id': 'https://example.com/#author/jane',
    });

    expect(flattenedAuthor!['@id']).toBe('https://example.com/#author/jane');
    expect(flattenedAuthor!.name).toBe('Jane Doe');
  });

  it('deeply merges nodes with identical @id', () => {
    const orgStub = {
      '@type': 'Organization',
      '@id': 'https://example.com/#org',
      name: 'Acme Corp',
      sameAs: 'https://twitter.com/acme',
    };

    const orgDetailed = {
      '@type': 'Organization',
      '@id': 'https://example.com/#org',
      telephone: '+1-555-555-5555',
      sameAs: 'https://linkedin.com/company/acme',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'San Francisco',
      },
    };

    const result = buildGraph([orgStub, orgDetailed], {
      dedupeStrategy: 'merge',
    });

    expect(result['@graph']).toHaveLength(1);
    const org = result['@graph'][0];

    expect(org.name).toBe('Acme Corp');
    expect(org.telephone).toBe('+1-555-555-5555');
    // Colliding sameAs should be merged into an array
    expect(org.sameAs).toEqual([
      'https://twitter.com/acme',
      'https://linkedin.com/company/acme',
    ]);
    expect(org.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'San Francisco',
    });
  });

  it('respects first-wins deduplication strategy', () => {
    const nodeA = {
      '@id': '#org',
      name: 'First Org',
    };
    const nodeB = {
      '@id': '#org',
      name: 'Second Org',
    };

    const result = buildGraph([nodeA, nodeB], {
      dedupeStrategy: 'first-wins',
    });

    expect(result['@graph']).toHaveLength(1);
    expect(result['@graph'][0].name).toBe('First Org');
  });

  it('respects last-wins deduplication strategy', () => {
    const nodeA = {
      '@id': '#org',
      name: 'First Org',
    };
    const nodeB = {
      '@id': '#org',
      name: 'Second Org',
    };

    const result = buildGraph([nodeA, nodeB], {
      dedupeStrategy: 'last-wins',
    });

    expect(result['@graph']).toHaveLength(1);
    expect(result['@graph'][0].name).toBe('Second Org');
  });

  it('canonicalizes relative url and standard URI properties against baseUrl', () => {
    const nav = {
      '@type': 'SiteNavigationElement',
      '@id': '#navbar',
      url: '/',
      hasPart: [
        {
          '@type': 'SiteNavigationElement',
          '@id': '#nav:1',
          name: 'Home',
          url: '/',
        },
        {
          '@type': 'SiteNavigationElement',
          '@id': '#nav:2',
          name: 'Docs',
          url: '/docs',
        },
      ],
    };

    const org = {
      '@type': 'Organization',
      '@id': '#organization',
      logo: '/images/logo.svg',
      sameAs: ['https://github.com/tasuku', '/about'],
    };

    const breadcrumbs = {
      '@type': 'BreadcrumbList',
      '@id': '#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          '@id': '#breadcrumb-1',
          position: 1,
          name: 'Home',
          item: '/',
        },
        {
          '@type': 'ListItem',
          '@id': '#breadcrumb-2',
          position: 2,
          name: 'Docs',
          item: '/docs',
        },
      ],
    };

    const result = buildGraph([nav, org, breadcrumbs], {
      baseUrl: 'https://example.com',
      flatten: true,
    });

    const navbarNode = result['@graph'].find((n) => n['@id'] === 'https://example.com/#navbar');
    const navHomeNode = result['@graph'].find((n) => n['@id'] === 'https://example.com/#nav:1');
    const navDocsNode = result['@graph'].find((n) => n['@id'] === 'https://example.com/#nav:2');
    const orgNode = result['@graph'].find((n) => n['@id'] === 'https://example.com/#organization');
    const bcHomeNode = result['@graph'].find((n) => n['@id'] === 'https://example.com/#breadcrumb-1');
    const bcDocsNode = result['@graph'].find((n) => n['@id'] === 'https://example.com/#breadcrumb-2');

    expect(navbarNode?.url).toBe('https://example.com/');
    expect(navHomeNode?.url).toBe('https://example.com/');
    expect(navDocsNode?.url).toBe('https://example.com/docs');
    expect(orgNode?.logo).toBe('https://example.com/images/logo.svg');
    expect(orgNode?.sameAs).toEqual(['https://github.com/tasuku', 'https://example.com/about']);
    expect(bcHomeNode?.item).toBe('https://example.com/');
    expect(bcDocsNode?.item).toBe('https://example.com/docs');
  });

  it('handles createId and refersTo helpers seamlessly', () => {
    const id = createId('article', 'seo-post');
    const ref = refersTo('organization', 'main');

    expect(id).toBe('#article:seo-post');
    expect(ref).toEqual({ '@id': '#organization:main' });
  });

  it('builds and canonicalizes potentialAction entities for AI agents', () => {
    const action = createPotentialAction({
      id: 'contact',
      actionType: 'ContactAction',
      name: 'Contact Sales',
      target: {
        urlTemplate: '/api/contact',
        httpMethod: 'POST',
      },
      object: [
        {
          valueName: 'email',
          valueRequired: true,
          valuePattern: '^.+@.+\\..+$',
        },
        {
          valueName: 'companySize',
          valueRequired: false,
          valueOption: ['1-10', '11-50', '50+'],
        },
      ],
    });

    const result = buildGraph([action], {
      baseUrl: 'https://example.com',
    });

    expect(result['@graph']).toHaveLength(1);
    const actionNode = result['@graph'][0];

    expect(actionNode['@id']).toBe('https://example.com/#action:contact');
    expect(actionNode['@type']).toBe('ContactAction');
    expect(actionNode.name).toBe('Contact Sales');
    expect(actionNode.target).toEqual({
      '@type': 'EntryPoint',
      urlTemplate: 'https://example.com/api/contact',
      httpMethod: 'POST',
      contentType: 'application/json',
    });
    expect(actionNode.object).toEqual([
      {
        '@type': 'PropertyValueSpecification',
        valueName: 'email',
        valueRequired: true,
        valuePattern: '^.+@.+\\..+$',
      },
      {
        '@type': 'PropertyValueSpecification',
        valueName: 'companySize',
        valueRequired: false,
        valueOption: ['1-10', '11-50', '50+'],
      },
    ]);
  });

  it('handles empty inputs safely', () => {
    const result = buildGraph([]);
    expect(result).toEqual({
      '@context': 'https://schema.org',
      '@graph': [],
    });
  });
});
