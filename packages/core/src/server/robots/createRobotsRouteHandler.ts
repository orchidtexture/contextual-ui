import { NextRobotsResult, RobotsRouteHandlerOptions } from './robots.types';
import { generateRobotsTxt } from './robots.utils';

export type RobotsSource =
  | NextRobotsResult
  | (() => Promise<NextRobotsResult> | NextRobotsResult);

export function createRobotsRouteHandler(
  source: RobotsSource,
  options: RobotsRouteHandlerOptions = {}
) {
  return {
    GET: async (_req: Request): Promise<Response> => {
      try {
        const robotsData = typeof source === 'function' ? await Promise.resolve(source()) : source;
        const text = generateRobotsTxt(robotsData);

        const defaultHeaders = {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': options.cacheControl || 'public, max-age=3600, s-maxage=86400',
          ...options.headers,
        };

        return new Response(text, {
          status: 200,
          headers: defaultHeaders,
        });
      } catch (error) {
        return new Response(
          `# Error generating robots.txt: ${error instanceof Error ? error.message : String(error)}`,
          {
            status: 500,
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
            },
          }
        );
      }
    },
  };
}

/**
 * Creates a Next.js Pages Router compatible API handler (pages/robots.txt.ts or pages/api/*).
 */
export function createPagesRobotsRouteHandler(
  source: RobotsSource,
  options: RobotsRouteHandlerOptions = {}
) {
  return async (req: any, res: any) => {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).send('Method Not Allowed');
    }

    try {
      const robotsData = typeof source === 'function' ? await Promise.resolve(source()) : source;
      const text = generateRobotsTxt(robotsData);

      const defaultHeaders = {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': options.cacheControl || 'public, max-age=3600, s-maxage=86400',
        ...options.headers,
      };

      for (const [key, value] of Object.entries(defaultHeaders)) {
        res.setHeader(key, value);
      }

      return res.status(200).send(text);
    } catch (error) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(500).send(
        `# Error generating robots.txt: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };
}
