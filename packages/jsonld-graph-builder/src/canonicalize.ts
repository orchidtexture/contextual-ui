/**
 * Resolves a relative @id against an optional baseUrl.
 */
export function canonicalizeId(id: string | undefined, baseUrl?: string): string | undefined {
  if (!id || typeof id !== 'string') return id;
  if (!baseUrl) return id;

  // Already absolute URIs
  if (id.startsWith('http://') || id.startsWith('https://') || id.startsWith('urn:')) {
    return id;
  }

  try {
    if (id.startsWith('#')) {
      // Relative fragment: attach directly to the baseUrl without replacing the path
      const url = new URL(baseUrl);
      url.hash = id.slice(1);
      return url.href;
    }

    const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return new URL(id, base).href;
  } catch {
    return id;
  }
}
