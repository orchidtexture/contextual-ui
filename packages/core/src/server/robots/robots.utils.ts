import {
  NextRobotsResult,
  RobotsOptions,
  RobotsRule,
  AiBotPolicy,
} from './robots.types';

export const KNOWN_AI_BOTS: readonly string[] = [
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Anthropic-AI',
  'PerplexityBot',
  'Google-Extended',
  'CCBot',
  'Bytespider',
];

/**
 * Builds a structured Next.js-compatible Robots object from configuration options.
 */
export function buildRobotsData(options: RobotsOptions = {}): NextRobotsResult {
  const baseUrl = (options.baseUrl || '').replace(/\/+$/, '');
  const rules: RobotsRule[] = [];

  // 1. User-supplied rules or default wildcard rule
  if (options.rules) {
    if (Array.isArray(options.rules)) {
      rules.push(...options.rules);
    } else {
      rules.push(options.rules);
    }
  } else {
    const defaultRule: RobotsRule = {
      userAgent: '*',
      allow: options.allow !== undefined ? options.allow : '/',
      disallow: options.disallow !== undefined ? options.disallow : [],
    };
    if (typeof options.crawlDelay === 'number') {
      defaultRule.crawlDelay = options.crawlDelay;
    }
    rules.push(defaultRule);
  }

  // 2. AI crawler policies
  if (options.ai) {
    const { defaultAiPolicy = 'inherit', bots = {} } = options.ai;
    const botNames = Array.from(new Set([...KNOWN_AI_BOTS, ...Object.keys(bots)]));

    for (const bot of botNames) {
      const policy: AiBotPolicy = bots[bot] || defaultAiPolicy;

      if (policy === 'allow') {
        rules.push({
          userAgent: bot,
          allow: '/',
        });
      } else if (policy === 'disallow') {
        rules.push({
          userAgent: bot,
          disallow: '/',
        });
      }
      // 'inherit' produces no rule so the bot falls back to the '*' rule
    }
  }

  // 3. Resolve sitemap URL(s)
  let sitemap: string | string[] | undefined;

  if (options.sitemap === false) {
    sitemap = undefined;
  } else if (typeof options.sitemap === 'string') {
    sitemap = resolveUrl(options.sitemap, baseUrl);
  } else if (Array.isArray(options.sitemap)) {
    sitemap = options.sitemap.map((s) => resolveUrl(s, baseUrl));
  } else if (baseUrl) {
    sitemap = `${baseUrl}/sitemap.xml`;
  }

  // 4. Resolve host
  let host = options.host;
  if (!host && baseUrl) {
    try {
      host = new URL(baseUrl).host;
    } catch {
      // Ignore invalid URL
    }
  }

  return {
    rules,
    ...(sitemap ? { sitemap } : {}),
    ...(host ? { host } : {}),
  };
}

/**
 * Renders a structured NextRobotsResult into RFC-compliant robots.txt plain text.
 */
export function generateRobotsTxt(robotsData: NextRobotsResult): string {
  const sections: string[] = [];
  const rulesList = Array.isArray(robotsData.rules)
    ? robotsData.rules
    : [robotsData.rules];

  for (const rule of rulesList) {
    const lines: string[] = [];

    // User-agent directives
    const agents = Array.isArray(rule.userAgent)
      ? rule.userAgent
      : [rule.userAgent || '*'];
    for (const agent of agents) {
      lines.push(`User-agent: ${agent}`);
    }

    // Allow directives
    if (rule.allow !== undefined) {
      const allows = Array.isArray(rule.allow) ? rule.allow : [rule.allow];
      for (const allow of allows) {
        lines.push(`Allow: ${allow}`);
      }
    }

    // Disallow directives
    if (rule.disallow !== undefined) {
      const disallows = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow];
      for (const disallow of disallows) {
        lines.push(`Disallow: ${disallow}`);
      }
    }

    // Crawl-delay directive
    if (typeof rule.crawlDelay === 'number') {
      lines.push(`Crawl-delay: ${rule.crawlDelay}`);
    }

    if (lines.length > 0) {
      sections.push(lines.join('\n'));
    }
  }

  // Host directive
  if (robotsData.host) {
    sections.push(`Host: ${robotsData.host}`);
  }

  // Sitemap directives
  if (robotsData.sitemap) {
    const sitemaps = Array.isArray(robotsData.sitemap)
      ? robotsData.sitemap
      : [robotsData.sitemap];
    const sitemapLines = sitemaps.map((sm) => `Sitemap: ${sm}`);
    sections.push(sitemapLines.join('\n'));
  }

  return sections.join('\n\n') + '\n';
}

function resolveUrl(url: string, baseUrl: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return baseUrl ? `${baseUrl}${cleanPath}` : cleanPath;
}
