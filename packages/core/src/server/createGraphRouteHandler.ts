import { buildGraph, GraphBuilderOptions, JsonLdObject } from 'jsonld-graph-builder';
import type { JsonLdContext } from '../registry/defineSchema';

export interface GraphRouteHandlerOptions {
  headers?: Record<string, string>;
  graphOptions?: GraphBuilderOptions;
  jsonLdContext?: Partial<JsonLdContext>;
  includeKeys?: string[];
  excludeKeys?: string[];
  includeAll?: boolean;
}

export function createGraphRouteHandler(
  hydrated: any,
  options: GraphRouteHandlerOptions = {}
) {
  return {
    GET: async (_req: Request): Promise<Response> => {
      try {
        let entities: JsonLdObject[] = [];

        // The route handler should also filter based on isGlobal
        const generated = await Promise.resolve(hydrated.generateJsonLd());
        const config = hydrated.config || {};
        
        const filteredGenerated: Record<string, any> = {};
        const includeKeys = options.includeKeys;
        const excludeKeys = options.excludeKeys;
        const includeAll = options.includeAll;

        for (const [key, val] of Object.entries(generated)) {
          if (excludeKeys?.includes(key)) continue;

          if (includeKeys?.includes(key)) {
            filteredGenerated[key] = val;
            continue;
          }

          if (includeAll) {
            filteredGenerated[key] = val;
            continue;
          }

          // Fallback to registry default behavior for global / route endpoints
          const isGlobal = config[key]?.isGlobal !== false;
          if (isGlobal) {
            filteredGenerated[key] = val;
          }
        }

        if (typeof filteredGenerated === 'object' && filteredGenerated !== null) {
          entities = Object.values(filteredGenerated).flat().filter(Boolean) as JsonLdObject[];
        }

        const graph = buildGraph(entities, options.graphOptions);

        const defaultHeaders = {
          'Content-Type': 'application/ld+json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=60, s-maxage=300',
          ...options.headers,
        };

        return new Response(JSON.stringify(graph, null, 2), {
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
