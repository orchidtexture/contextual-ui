import { createGraphRouteHandler, GraphRouteHandlerOptions } from './createGraphRouteHandler';
import { InferData } from '../registry/defineSchema';

export interface ContextualAppOptions<
  TSchema extends { hydrate: (d: any) => any; parse: (d: any) => any; config?: any },
  TConnector extends { fetchData: () => Promise<any> }
> {
  schema: TSchema;
  connector: TConnector;
}

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
    createGraphHandler(handlerOptions?: GraphRouteHandlerOptions) {
      return {
        GET: async (req: Request) => {
          const hydrated = await getHydrated();
          const graphHandler = createGraphRouteHandler(hydrated, handlerOptions);
          return graphHandler.GET(req);
        },
      };
    },
    createGraphRouteHandler(handlerOptions?: GraphRouteHandlerOptions) {
      return this.createGraphHandler(handlerOptions);
    },
  };
}
