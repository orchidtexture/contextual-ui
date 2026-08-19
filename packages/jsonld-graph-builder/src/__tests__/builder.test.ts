import { describe, it, expect } from 'vitest';
import { buildGraph, createId, refersTo } from '../index';

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

  it('handles createId and refersTo helpers seamlessly', () => {
    const id = createId('article', 'seo-post');
    const ref = refersTo('organization', 'main');

    expect(id).toBe('#article:seo-post');
    expect(ref).toEqual({ '@id': '#organization:main' });
  });

  it('handles empty inputs safely', () => {
    const result = buildGraph([]);
    expect(result).toEqual({
      '@context': 'https://schema.org',
      '@graph': [],
    });
  });
});
