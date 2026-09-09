import { SitemapItem, SitemapOptions } from './sitemap.types';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDate(date: string | Date | undefined): string | undefined {
  if (!date) return undefined;
  if (date instanceof Date) {
    if (isNaN(date.getTime())) return undefined;
    return date.toISOString();
  }
  const parsed = new Date(date);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }
  return date;
}

/**
 * Normalizes a route path to always have a leading slash and no trailing slash
 * (unless it's the root '/').
 */
export function normalizePath(path: string): string {
  if (!path) return '/';
  let normalized = path.trim();
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.replace(/\/+$/, '');
  }
  return normalized;
}

/**
 * Checks whether a given route path matches an exclusion pattern.
 * Supports exact matches, prefix matches, and wildcard patterns (*).
 */
export function isPathExcluded(path: string, pattern: string): boolean {
  const normPath = normalizePath(path);
  const normPattern = pattern.trim();

  if (normPattern.includes('*')) {
    const regexPattern = `^${normPattern
      .split('*')
      .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
      .join('.*')}$`;
    const regex = new RegExp(regexPattern);
    return regex.test(normPath) || regex.test(path);
  }

  const cleanPattern = normalizePath(normPattern);
  if (normPath === cleanPattern) return true;
  if (normPath.startsWith(`${cleanPattern}/`)) return true;

  return false;
}

/**
 * Extracts a normalized list of webpage entities from arbitrary site data.
 */
export function extractWebpages(data: any): any[] {
  if (!data || typeof data !== 'object') return [];

  const raw = ('webpage' in data) ? data.webpage : (('webpages' in data) ? data.webpages : undefined);

  if (Array.isArray(raw)) {
    return raw.filter((item) => item !== null && typeof item === 'object');
  }

  if (raw && typeof raw === 'object') {
    return [raw];
  }

  return [];
}

/**
 * Builds an array of canonical SitemapItems from raw webpage entities and options.
 */
export function buildSitemapItems(
  webpages: any[],
  options: SitemapOptions = {}
): SitemapItem[] {
  const baseUrl = (options.baseUrl || '').replace(/\/+$/, '');
  const excludeList = options.exclude || [];
  const items: SitemapItem[] = [];
  const seenUrls = new Set<string>();

  const processPage = (page: any) => {
    if (!page || typeof page !== 'object') return;
    if (typeof options.filter === 'function' && !options.filter(page)) return;

    const rawUrl = page.url || (page.id ? `/${page.id}` : undefined);
    if (!rawUrl || typeof rawUrl !== 'string') return;

    // Check exclusion
    const pathOnly = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
      ? new URL(rawUrl).pathname
      : normalizePath(rawUrl);

    for (const pattern of excludeList) {
      if (isPathExcluded(pathOnly, pattern)) {
        return;
      }
    }

    // Resolve full URL
    let fullUrl: string;
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      fullUrl = rawUrl;
    } else {
      const normalized = normalizePath(rawUrl);
      fullUrl = normalized === '/' ? (baseUrl || '/') : `${baseUrl}${normalized}`;
    }

    if (seenUrls.has(fullUrl)) return;
    seenUrls.add(fullUrl);

    const isHome = pathOnly === '/' || fullUrl === baseUrl || fullUrl === `${baseUrl}/`;

    // Determine priority
    const priority = typeof page.priority === 'number'
      ? page.priority
      : isHome
      ? (options.defaultPriority !== undefined ? options.defaultPriority : 1.0)
      : (options.defaultPriority !== undefined ? options.defaultPriority : 0.8);

    // Determine changeFrequency
    const changeFrequency = page.changeFrequency || page.changefreq
      ? (page.changeFrequency || page.changefreq)
      : isHome
      ? 'daily'
      : (options.defaultChangeFrequency || 'weekly');

    // Determine lastModified
    const lastModified = page.lastModified || page.dateModified || options.defaultLastModified;

    const sitemapItem: SitemapItem = {
      url: fullUrl,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency,
      priority,
    };

    if (Array.isArray(page.alternateRefs)) {
      sitemapItem.alternateRefs = page.alternateRefs;
    }

    items.push(sitemapItem);
  };

  // Process extracted webpages
  for (const page of webpages) {
    processPage(page);
  }

  // If no pages were found but a baseUrl exists, provide a fallback home item
  if (items.length === 0 && baseUrl) {
    const isExcluded = excludeList.some((pat) => isPathExcluded('/', pat));
    if (!isExcluded) {
      items.push({
        url: baseUrl,
        lastModified: options.defaultLastModified,
        changeFrequency: 'daily',
        priority: 1.0,
      });
      seenUrls.add(baseUrl);
    }
  }

  // Append additional custom routes
  if (Array.isArray(options.additionalRoutes)) {
    for (const route of options.additionalRoutes) {
      let fullUrl = route.url;
      if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
        const normalized = normalizePath(fullUrl);
        fullUrl = normalized === '/' ? (baseUrl || '/') : `${baseUrl}${normalized}`;
      }

      if (!seenUrls.has(fullUrl)) {
        seenUrls.add(fullUrl);
        items.push({
          ...route,
          url: fullUrl,
        });
      }
    }
  }

  return items;
}

/**
 * Serializes an array of SitemapItems into a standard sitemap XML document.
 */
export function generateSitemapXml(items: SitemapItem[]): string {
  const urlEntries = items
    .map((item) => {
      const parts: string[] = [];
      parts.push(`    <loc>${escapeXml(item.url)}</loc>`);

      const formattedDate = formatDate(item.lastModified);
      if (formattedDate) {
        parts.push(`    <lastmod>${escapeXml(formattedDate)}</lastmod>`);
      }

      if (item.changeFrequency) {
        parts.push(`    <changefreq>${escapeXml(item.changeFrequency)}</changefreq>`);
      }

      if (typeof item.priority === 'number') {
        parts.push(`    <priority>${item.priority.toFixed(1)}</priority>`);
      }

      if (Array.isArray(item.alternateRefs) && item.alternateRefs.length > 0) {
        for (const alt of item.alternateRefs) {
          parts.push(
            `    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(alt.href)}" />`
          );
        }
      }

      return `  <url>\n${parts.join('\n')}\n  </url>`;
    })
    .join('\n');

  const hasAlternates = items.some(
    (item) => Array.isArray(item.alternateRefs) && item.alternateRefs.length > 0
  );

  const xmlnsAttrs = [
    'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    ...(hasAlternates ? ['xmlns:xhtml="http://www.w3.org/1999/xhtml"'] : []),
  ].join(' ');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${xmlnsAttrs}>\n${urlEntries}\n</urlset>`;
}
