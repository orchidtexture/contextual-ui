import { SitemapItem, SitemapRouteHandlerOptions } from './sitemap.types';
import { generateSitemapXml } from './sitemap.utils';

export type SitemapSource =
  | SitemapItem[]
  | (() => Promise<SitemapItem[]> | SitemapItem[]);

export function createSitemapRouteHandler(
  source: SitemapSource,
  options: SitemapRouteHandlerOptions = {}
) {
  return {
    GET: async (_req: Request): Promise<Response> => {
      try {
        const items = typeof source === 'function' ? await Promise.resolve(source()) : source;
        const xml = generateSitemapXml(items);

        const defaultHeaders = {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': options.cacheControl || 'public, max-age=3600, s-maxage=86400',
          ...options.headers,
        };

        return new Response(xml, {
          status: 200,
          headers: defaultHeaders,
        });
      } catch (error) {
        return new Response(
          `<!-- Error generating sitemap: ${error instanceof Error ? error.message : String(error)} -->`,
          {
            status: 500,
            headers: {
              'Content-Type': 'application/xml; charset=utf-8',
            },
          }
        );
      }
    },
  };
}

/**
 * Creates a Next.js Pages Router compatible API handler (pages/sitemap.xml.ts or pages/api/*).
 */
export function createPagesSitemapRouteHandler(
  source: SitemapSource,
  options: SitemapRouteHandlerOptions = {}
) {
  return async (req: any, res: any) => {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).send('Method Not Allowed');
    }

    try {
      const items = typeof source === 'function' ? await Promise.resolve(source()) : source;
      const xml = generateSitemapXml(items);

      const defaultHeaders = {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': options.cacheControl || 'public, max-age=3600, s-maxage=86400',
        ...options.headers,
      };

      for (const [key, value] of Object.entries(defaultHeaders)) {
        res.setHeader(key, value);
      }

      return res.status(200).send(xml);
    } catch (error) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(500).send(
        `Error generating sitemap: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };
}
