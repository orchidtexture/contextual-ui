export type SitemapChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

export interface SitemapAlternateRef {
  href: string;
  hreflang: string;
}

export interface SitemapItem {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: SitemapChangeFrequency;
  priority?: number;
  alternateRefs?: SitemapAlternateRef[];
  alternates?: {
    languages?: Record<string, string>;
  };
  images?: string[];
  videos?: any[];
}

export interface SitemapOptions {
  /**
   * Base URL of the website (e.g., 'https://example.com').
   * Used to canonicalize relative URLs.
   */
  baseUrl?: string;
  /**
   * Paths or glob patterns to exclude from the sitemap.
   * Examples: ['/cms', '/cms/*', '/admin', '/studio*']
   */
  exclude?: string[];
  /**
   * Additional routes not defined in the connector to include in the sitemap.
   */
  additionalRoutes?: SitemapItem[];
  /**
   * Default priority for pages if unspecified.
   * Root ('/') defaults to 1.0; other pages default to 0.8.
   */
  defaultPriority?: number;
  /**
   * Default changeFrequency if unspecified.
   * Root ('/') defaults to 'daily'; other pages default to 'weekly'.
   */
  defaultChangeFrequency?: SitemapChangeFrequency;
  /**
   * Default lastModified date for entries without explicit dates.
   */
  defaultLastModified?: string | Date;
  /**
   * Optional custom filter predicate for granular page inclusion.
   */
  filter?: (page: any) => boolean;
}

export interface SitemapRouteHandlerOptions extends SitemapOptions {
  /**
   * Additional HTTP response headers.
   */
  headers?: Record<string, string>;
  /**
   * Cache-Control header value (defaults to 'public, max-age=3600, s-maxage=86400').
   */
  cacheControl?: string;
}
