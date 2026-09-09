import { describe, it, expect } from 'vitest';
import { buildRobotsData, generateRobotsTxt } from './robots.utils';
import { createRobotsRouteHandler } from './createRobotsRouteHandler';

describe('robots.utils', () => {
  describe('buildRobotsData', () => {
    it('creates default allow all rule with baseUrl sitemap and host', () => {
      const robots = buildRobotsData({
        baseUrl: 'https://example.com',
      });

      expect(robots.rules).toEqual([
        {
          userAgent: '*',
          allow: '/',
          disallow: [],
        },
      ]);
      expect(robots.sitemap).toBe('https://example.com/sitemap.xml');
      expect(robots.host).toBe('example.com');
    });

    it('respects disallow paths and suppresses sitemap if false', () => {
      const robots = buildRobotsData({
        baseUrl: 'https://example.com',
        disallow: ['/admin', '/cms'],
        sitemap: false,
      });

      expect(robots.rules).toEqual([
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/cms'],
        },
      ]);
      expect(robots.sitemap).toBeUndefined();
    });

    it('applies AI bot policies', () => {
      const robots = buildRobotsData({
        baseUrl: 'https://example.com',
        ai: {
          defaultAiPolicy: 'disallow',
          bots: {
            PerplexityBot: 'allow',
          },
        },
      });

      const rules = Array.isArray(robots.rules) ? robots.rules : [robots.rules];
      const gptRule = rules.find((r) => r.userAgent === 'GPTBot');
      const perplexityRule = rules.find((r) => r.userAgent === 'PerplexityBot');

      expect(gptRule?.disallow).toBe('/');
      expect(perplexityRule?.allow).toBe('/');
    });
  });

  describe('generateRobotsTxt', () => {
    it('renders clean RFC-compliant robots.txt string', () => {
      const txt = generateRobotsTxt({
        rules: [
          {
            userAgent: '*',
            allow: '/',
            disallow: ['/cms', '/admin'],
          },
          {
            userAgent: 'GPTBot',
            disallow: '/',
          },
        ],
        sitemap: 'https://example.com/sitemap.xml',
        host: 'example.com',
      });

      expect(txt).toContain('User-agent: *\nAllow: /\nDisallow: /cms\nDisallow: /admin');
      expect(txt).toContain('User-agent: GPTBot\nDisallow: /');
      expect(txt).toContain('Host: example.com');
      expect(txt).toContain('Sitemap: https://example.com/sitemap.xml');
    });

    it('supports multiple sitemaps', () => {
      const txt = generateRobotsTxt({
        rules: [{ userAgent: '*', allow: '/' }],
        sitemap: ['https://example.com/sitemap-1.xml', 'https://example.com/sitemap-2.xml'],
      });

      expect(txt).toContain('Sitemap: https://example.com/sitemap-1.xml');
      expect(txt).toContain('Sitemap: https://example.com/sitemap-2.xml');
    });
  });

  describe('createRobotsRouteHandler', () => {
    it('returns plain text response from static data', async () => {
      const handler = createRobotsRouteHandler({
        rules: [{ userAgent: '*', allow: '/' }],
        sitemap: 'https://example.com/sitemap.xml',
      });
      const res = await handler.GET(new Request('http://localhost/robots.txt'));

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toBe('text/plain; charset=utf-8');
      const text = await res.text();
      expect(text).toContain('User-agent: *');
      expect(text).toContain('Sitemap: https://example.com/sitemap.xml');
    });

    it('returns plain text response from async resolver', async () => {
      const handler = createRobotsRouteHandler(async () => ({
        rules: [{ userAgent: 'ClaudeBot', disallow: '/' }],
      }));
      const res = await handler.GET(new Request('http://localhost/robots.txt'));

      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain('User-agent: ClaudeBot');
      expect(text).toContain('Disallow: /');
    });
  });
});
