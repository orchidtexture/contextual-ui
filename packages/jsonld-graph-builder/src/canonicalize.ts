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

/**
 * Resolves a relative URL/URI against an optional baseUrl.
 */
export function canonicalizeUrl(urlStr: string | undefined, baseUrl?: string): string | undefined {
  if (!urlStr || typeof urlStr !== 'string') return urlStr;
  if (!baseUrl) return urlStr;

  // Already absolute URIs (e.g. https://, http://, mailto:, tel:, urn:, data:)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(urlStr)) {
    return urlStr;
  }

  try {
    const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return new URL(urlStr, base).href;
  } catch {
    return urlStr;
  }
}

const URL_PROPERTIES = new Set([
  'url',
  'item',
  'sameAs',
  'logo',
  'image',
  'target',
  'urlTemplate',
  'contentUrl',
  'thumbnailUrl',
  'embedUrl',
  'discussionUrl',
  'actionUrl',
  'serviceUrl',
  'termsOfService',
  'privacyPolicy',
]);

/**
 * Checks if a JSON-LD property name is expected to contain a URL value.
 */
export function isUrlProperty(property: string): boolean {
  return URL_PROPERTIES.has(property);
}

