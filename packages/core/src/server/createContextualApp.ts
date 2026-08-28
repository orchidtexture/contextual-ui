import { createGraphRouteHandler, GraphRouteHandlerOptions } from './createGraphRouteHandler';
import { InferData } from '../registry/defineSchema';
import { buildGraph, JsonLdObject } from 'jsonld-graph-builder';

export interface ContextualAppOptions<
  TSchema extends { hydrate: (d: any) => any; parse: (d: any) => any; config?: any },
  TConnector extends { fetchData: () => Promise<any> }
> {
  schema: TSchema;
  connector: TConnector;
  baseUrl?: string;
}

export type GetGraphOptions = GraphRouteHandlerOptions & {
  includeKeys?: string[];
  excludeKeys?: string[];
  includeAll?: boolean;
};

export function createContextualApp<
  TSchema extends { hydrate: (d: any) => any; parse: (d: any) => any; config?: any },
  TConnector extends { fetchData: () => Promise<any> }
>(options: ContextualAppOptions<TSchema, TConnector>) {
  const getHydrated = async () => {
    const raw = await options.connector.fetchData();
    return options.schema.hydrate(raw);
  };

  return {
    schema: options.schema,
    connector: options.connector,
    async fetchData(): Promise<InferData<TSchema>> {
      const raw = await options.connector.fetchData();
      return options.schema.hydrate(raw).raw as InferData<TSchema>;
    },
    async getGraph(handlerOptions?: GetGraphOptions) {
      const hydrated = await getHydrated();
      const generated = hydrated.generateJsonLd(handlerOptions?.jsonLdContext);
      const config = hydrated.config || options.schema.config || {};
      
      const filteredGenerated: Record<string, any> = {};
      const includeKeys = handlerOptions?.includeKeys;
      const excludeKeys = handlerOptions?.excludeKeys;
      const includeAll = handlerOptions?.includeAll;

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

        // If not strictly included/excluded, fallback to registry default behavior
        const isGlobal = config[key]?.isGlobal !== false;
        if (isGlobal) {
          filteredGenerated[key] = val;
        }
      }

      const entities = Object.values(filteredGenerated).filter(Boolean) as JsonLdObject[];
      const graphOptions = {
        baseUrl: options.baseUrl,
        ...handlerOptions?.graphOptions,
      };
      return buildGraph(entities, graphOptions);
    },
    createGraphHandler(handlerOptions?: GetGraphOptions) {
      return {
        GET: async (req: Request) => {
          const hydrated = await getHydrated();
          const effectiveOptions: GetGraphOptions = {
            ...handlerOptions,
            graphOptions: {
              baseUrl: options.baseUrl,
              ...handlerOptions?.graphOptions,
            },
          };
          const graphHandler = createGraphRouteHandler(hydrated, effectiveOptions);
          return graphHandler.GET(req);
        },
      };
    },
    createGraphRouteHandler(handlerOptions?: GetGraphOptions) {
      return this.createGraphHandler(handlerOptions);
    },
  };
}
