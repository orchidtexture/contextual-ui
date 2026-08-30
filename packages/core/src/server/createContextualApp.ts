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

export type GetGraphOptions<
  TSchema extends { hydrate: (d: any) => any; parse: (d: any) => any; config?: any } = any
> = GraphRouteHandlerOptions & {
  includeKeys?: string[];
  excludeKeys?: string[];
  includeAll?: boolean;
  pageId?: string;
  pageUrl?: string;
  dataOverrides?: Partial<InferData<TSchema>>;
};

export function createContextualApp<
  TSchema extends { hydrate: (d: any) => any; parse: (d: any) => any; config?: any },
  TConnector extends { fetchData: () => Promise<any> }
>(options: ContextualAppOptions<TSchema, TConnector>) {
  const getHydrated = async (
    overrides?: Partial<InferData<TSchema>>,
    pageId?: string,
    pageUrl?: string
  ) => {
    const raw = await options.connector.fetchData();
    const merged: Record<string, any> = { ...raw, ...overrides };

    // Support single page resolution when an array of webpages is configured
    const webpageKey = ('webpage' in merged) ? 'webpage' : (('webpages' in merged) ? 'webpages' : undefined);
    if (webpageKey && Array.isArray(raw[webpageKey])) {
      const pageList: any[] = raw[webpageKey];
      if (pageId || pageUrl) {
        const found = pageList.find(
          (p) =>
            (pageId && p.id === pageId) ||
            (pageUrl && (p.url === pageUrl || p.url === `/${pageUrl}` || p.id === pageUrl.replace(/^\//, '')))
        );
        const overrideItem = overrides?.[webpageKey as keyof InferData<TSchema>];
        const pageOverride = Array.isArray(overrideItem) ? overrideItem[0] : overrideItem;

        if (found) {
          merged[webpageKey] = { ...found, ...(pageOverride || {}) };
        } else if (pageOverride && Object.keys(pageOverride).length > 0) {
          merged[webpageKey] = {
            ...(pageId ? { id: pageId } : {}),
            ...(pageUrl ? { url: pageUrl } : {}),
            ...pageOverride,
          };
        }
      } else if (overrides && overrides[webpageKey as keyof InferData<TSchema>]) {
        const overrideVal = overrides[webpageKey as keyof InferData<TSchema>];
        if (!Array.isArray(overrideVal) && typeof overrideVal === 'object') {
          const overrideObj = overrideVal as any;
          const found = pageList.find(
            (p) =>
              (overrideObj.id && p.id === overrideObj.id) ||
              (overrideObj.url && p.url === overrideObj.url)
          );
          if (found) {
            merged[webpageKey] = { ...found, ...overrideObj };
          } else {
            merged[webpageKey] = overrideObj;
          }
        }
      }
    }

    return options.schema.hydrate(merged);
  };

  return {
    schema: options.schema,
    connector: options.connector,
    async fetchData(dataOverrides?: Partial<InferData<TSchema>>): Promise<InferData<TSchema>> {
      const hydrated = await getHydrated(dataOverrides);
      return hydrated.raw as InferData<TSchema>;
    },
    async getGraph(handlerOptions?: GetGraphOptions<TSchema>) {
      const hydrated = await getHydrated(
        handlerOptions?.dataOverrides,
        handlerOptions?.pageId,
        handlerOptions?.pageUrl
      );
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

      const entities = Object.values(filteredGenerated).flat().filter(Boolean) as JsonLdObject[];
      const graphOptions = {
        baseUrl: options.baseUrl,
        ...handlerOptions?.graphOptions,
      };
      return buildGraph(entities, graphOptions);
    },
    createGraphHandler(handlerOptions?: GetGraphOptions<TSchema>) {
      return {
        GET: async (req: Request) => {
          const hydrated = await getHydrated(
            handlerOptions?.dataOverrides,
            handlerOptions?.pageId,
            handlerOptions?.pageUrl
          );
          const effectiveOptions: GetGraphOptions<TSchema> = {
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
    createGraphRouteHandler(handlerOptions?: GetGraphOptions<TSchema>) {
      return this.createGraphHandler(handlerOptions);
    },
  };
}
