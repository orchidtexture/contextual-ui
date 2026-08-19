import { buildGraph, GraphBuilderOptions, JsonLdObject } from '@contextual-ui/jsonld-graph-builder';

export interface GraphRouteHandlerOptions {
  headers?: Record<string, string>;
  graphOptions?: GraphBuilderOptions;
}

export function createGraphRouteHandler(
  hydrated: any,
  options: GraphRouteHandlerOptions = {}
) {
  return {
    GET: async (_req: Request): Promise<Response> => {
      try {
        let entities: JsonLdObject[] = [];

        if (typeof hydrated.generateJsonLd === 'function') {
          const generated = await Promise.resolve(hydrated.generateJsonLd());
          if (Array.isArray(generated)) {
            entities = generated as JsonLdObject[];
          } else if (typeof generated === 'object' && generated !== null) {
            entities = Object.values(generated).filter(Boolean) as JsonLdObject[];
          }
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
