import { ContextRegistry, ContextConfig } from '../registry/defineContext';

export interface RouteHandlerOptions {
  headers?: Record<string, string>;
}

export function createRouteHandler<TConfig extends ContextConfig>(
  registry: ContextRegistry<TConfig>,
  options: RouteHandlerOptions = {}
) {
  return {
    GET: async (_req: Request): Promise<Response> => {
      try {
        const agentData = registry.getAgentData();
        const defaultHeaders = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=60, s-maxage=300',
          ...options.headers,
        };

        return new Response(JSON.stringify(agentData, null, 2), {
          status: 200,
          headers: defaultHeaders,
        });
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : String(error),
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
    },
  };
}

/**
 * Creates a Next.js Pages Router compatible API handler (pages/api/*).
 */
export function createPagesRouteHandler<TConfig extends ContextConfig>(
  registry: ContextRegistry<TConfig>,
  options: RouteHandlerOptions = {}
) {
  return async (req: any, res: any) => {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
      const agentData = registry.getAgentData();
      const defaultHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60, s-maxage=300',
        ...options.headers,
      };

      for (const [key, value] of Object.entries(defaultHeaders)) {
        res.setHeader(key, value);
      }

      return res.status(200).json(agentData);
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  };
}

