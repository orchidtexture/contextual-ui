export interface RobotsRule {
  userAgent?: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
  other?: Record<string, string | number | Array<string | number>>;
}

export interface StrictRobotsRule {
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
  other?: Record<string, string | number | Array<string | number>>;
}

export type AiBotPolicy = 'allow' | 'disallow' | 'inherit';

export interface KnownAiBots {
  GPTBot?: AiBotPolicy;
  'ChatGPT-User'?: AiBotPolicy;
  ClaudeBot?: AiBotPolicy;
  'Anthropic-AI'?: AiBotPolicy;
  PerplexityBot?: AiBotPolicy;
  'Google-Extended'?: AiBotPolicy;
  CCBot?: AiBotPolicy;
  Bytespider?: AiBotPolicy;
  [customBot: string]: AiBotPolicy | undefined;
}

export interface RobotsAiOptions {
  /**
   * Default policy for all recognized AI crawlers.
   * - 'allow': Explicitly grants access to AI search and training crawlers.
   * - 'disallow': Explicitly blocks AI crawlers from indexing the site.
   * - 'inherit': Omits specific bot rules and lets them follow the generic userAgent '*' rule.
   */
  defaultAiPolicy?: AiBotPolicy;
  /**
   * Per-bot policy overrides.
   */
  bots?: KnownAiBots;
}

export interface RobotsOptions {
  /**
   * Base URL of the website. Used to formulate the absolute Sitemap URL.
   */
  baseUrl?: string;
  /**
   * Custom rules array or single rule object. If provided, merges with or replaces default rules.
   */
  rules?: RobotsRule | RobotsRule[];
  /**
   * Convenience array or single string of allowed paths for the default userAgent ('*').
   * Defaults to '/'.
   */
  allow?: string | string[];
  /**
   * Convenience array or single string of disallowed paths for the default userAgent ('*').
   */
  disallow?: string | string[];
  /**
   * Crawl delay in seconds for the default userAgent ('*').
   */
  crawlDelay?: number;
  /**
   * Sitemap URL(s) to advertise.
   * - true (default): automatically appends `${baseUrl}/sitemap.xml` if baseUrl exists.
   * - false: suppresses sitemap reference.
   * - string or string[]: specifies custom sitemap URL(s).
   */
  sitemap?: string | string[] | boolean;
  /**
   * Preferred Host directive.
   */
  host?: string;
  /**
   * AI bot crawler configuration presets.
   */
  ai?: RobotsAiOptions;
}

export interface RobotsRouteHandlerOptions extends RobotsOptions {
  headers?: Record<string, string>;
  cacheControl?: string;
}

export interface NextRobotsResult {
  rules: StrictRobotsRule[] | RobotsRule;
  sitemap?: string | string[];
  host?: string;
}
