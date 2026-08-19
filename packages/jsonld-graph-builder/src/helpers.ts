/**
 * Helper to generate a standardized relative or absolute @id identifier.
 *
 * @example
 * createId('article', 'my-first-post') // -> '#article:my-first-post'
 * createId('organization', 'main')     // -> '#organization:main'
 * createId('website')                  // -> '#website'
 */
export function createId(type: string, id?: string): string {
  const normalizedType = type.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (!id) {
    return `#${normalizedType}`;
  }
  if (id.startsWith('#') || id.startsWith('/') || id.startsWith('http://') || id.startsWith('https://')) {
    return id;
  }
  return `#${normalizedType}:${id}`;
}

/**
 * Helper to create a JSON-LD reference node pointer `{ "@id": "..." }`.
 *
 * @example
 * refersTo('organization', 'main') // -> { "@id": "#organization:main" }
 */
export function refersTo(type: string, id?: string): { '@id': string } {
  return {
    '@id': createId(type, id),
  };
}
