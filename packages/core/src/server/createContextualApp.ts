import { createGraphRouteHandler, GraphRouteHandlerOptions } from './createGraphRouteHandler';
import { InferData } from '../registry/defineSchema';
import { buildGraph, JsonLdObject } from 'jsonld-graph-builder';
import type {
  Metadata,
  GetMetadataOptions,
  MetadataAlternates,
  MetadataOpenGraph,
  MetadataTwitter,
  OGImage,
} from './metadata.types';
import {
  SitemapItem,
  SitemapOptions,
  SitemapRouteHandlerOptions,
  extractWebpages,
  buildSitemapItems,
  generateSitemapXml,
  createSitemapRouteHandler,
  createPagesSitemapRouteHandler,
} from './sitemap';
import {
  NextRobotsResult,
  RobotsOptions,
  RobotsRouteHandlerOptions,
  buildRobotsData,
  generateRobotsTxt,
  createRobotsRouteHandler,
  createPagesRobotsRouteHandler,
} from './robots';

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
    async getMetadata(
      pageIdOrOptions?: string | GetMetadataOptions<TSchema>,
      overrides?: Partial<Metadata>
    ): Promise<Metadata> {
      let targetPageId: string | undefined;
      let targetPageUrl: string | undefined;
      let customBaseUrl: string | undefined;
      let dataOverrides: Partial<InferData<TSchema>> | undefined;
      let metadataOverrides: Partial<Metadata> | undefined;

      if (typeof pageIdOrOptions === 'string') {
        targetPageId = pageIdOrOptions;
        metadataOverrides = overrides;
      } else if (pageIdOrOptions && typeof pageIdOrOptions === 'object') {
        targetPageId = pageIdOrOptions.pageId;
        targetPageUrl = pageIdOrOptions.pageUrl;
        customBaseUrl = pageIdOrOptions.baseUrl;
        dataOverrides = pageIdOrOptions.dataOverrides;
        metadataOverrides = pageIdOrOptions.metadataOverrides || overrides;
      } else {
        metadataOverrides = overrides;
      }

      const raw = await options.connector.fetchData();
      const effectiveBaseUrl = customBaseUrl || options.baseUrl || raw?.website?.url;

      let metadataBase: URL | undefined = undefined;
      if (effectiveBaseUrl) {
        try {
          metadataBase = new URL(effectiveBaseUrl);
        } catch {
          // Ignore invalid absolute URLs
        }
      }

      const webpageKey = raw && ('webpage' in raw) ? 'webpage' : (raw && ('webpages' in raw) ? 'webpages' : undefined);
      let page: any = undefined;

      if (webpageKey && raw[webpageKey]) {
        const webpageData = raw[webpageKey];
        if (Array.isArray(webpageData)) {
          if (targetPageId || targetPageUrl) {
            page = webpageData.find(
              (p) =>
                (targetPageId && (p.id === targetPageId || p.url === targetPageId || p.url === `/${targetPageId}` || p.id === targetPageId.replace(/^\//, ''))) ||
                (targetPageUrl && (p.url === targetPageUrl || p.url === `/${targetPageUrl}` || p.id === targetPageUrl.replace(/^\//, '')))
            );
          }
          if (!page && !targetPageId && !targetPageUrl) {
            page = webpageData.find((p) => p.id === 'home' || p.url === '/') || webpageData[0];
          }
        } else if (typeof webpageData === 'object') {
          page = webpageData;
        }
      }

      // If page was not found in data but targetPageId was provided, provide a fallback structure
      if (!page && targetPageId) {
        page = {
          id: targetPageId,
          name: undefined,
          url: targetPageId.startsWith('/') ? targetPageId : `/${targetPageId}`,
          description: undefined,
        };
      }

      // Apply dataOverrides if provided
      if (dataOverrides && webpageKey && dataOverrides[webpageKey as keyof InferData<TSchema>]) {
        const overrideVal = dataOverrides[webpageKey as keyof InferData<TSchema>];
        const pageOverride = Array.isArray(overrideVal) ? overrideVal[0] : overrideVal;
        page = { ...(page || {}), ...(pageOverride || {}) };
      }

      const title = metadataOverrides?.title !== undefined
        ? metadataOverrides.title
        : (page?.name || page?.title || raw?.website?.name || undefined);
      const description = metadataOverrides?.description !== undefined
        ? metadataOverrides.description
        : (page?.description || raw?.website?.description || undefined);

      let alternates: MetadataAlternates | undefined = undefined;
      const canonicalUrl = metadataOverrides?.alternates?.canonical !== undefined
        ? metadataOverrides.alternates.canonical
        : (page?.url || (targetPageId === 'home' || page?.id === 'home' ? '/' : undefined));
      if (canonicalUrl) {
        alternates = {
          canonical: canonicalUrl,
        };
      }
      if (page?.languages) {
        alternates = { ...(alternates || {}), languages: page.languages };
      }

      let images: OGImage[] | undefined = undefined;
      if (page?.images && Array.isArray(page.images) && page.images.length > 0) {
        images = page.images;
      } else if (page?.image) {
        images = [page.image];
      } else if (raw?.website?.image) {
        images = [raw.website.image];
      } else if (raw?.website?.images && Array.isArray(raw.website.images) && raw.website.images.length > 0) {
        images = raw.website.images;
      } else if (raw?.organization?.logo) {
        images = [raw.organization.logo];
      }

      const locale = page?.inLanguage || raw?.website?.inLanguage || undefined;
      const siteName = raw?.website?.name || raw?.organization?.name || undefined;

      const openGraph: MetadataOpenGraph = {
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(page?.url ? { url: page.url } : {}),
        ...(siteName ? { siteName } : {}),
        ...(locale ? { locale } : {}),
        type: (page?.type || 'website'),
        ...(images && images.length > 0 ? { images } : {}),
        ...(page?.openGraph || {}),
      };

      let twitterSite: string | undefined = undefined;
      if (raw?.organization?.twitter) {
        twitterSite = raw.organization.twitter.startsWith('@')
          ? raw.organization.twitter
          : `@${raw.organization.twitter}`;
      } else if (Array.isArray(raw?.organization?.sameAs)) {
        const twitterUrl = raw.organization.sameAs.find(
          (url: string) => typeof url === 'string' && (url.includes('twitter.com/') || url.includes('x.com/'))
        );
        if (twitterUrl) {
          const match = twitterUrl.match(/(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/);
          if (match && match[1]) {
            twitterSite = `@${match[1]}`;
          }
        }
      }

      const twitter: MetadataTwitter = {
        card: 'summary_large_image',
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(twitterSite ? { site: twitterSite } : {}),
        ...(images && images.length > 0 ? { images } : {}),
        ...(page?.twitter || {}),
      };

      const result: Metadata = {
        ...(metadataBase ? { metadataBase } : {}),
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(alternates ? { alternates } : {}),
        openGraph,
        twitter,
      };

      if (metadataOverrides) {
        if (metadataOverrides.openGraph) {
          result.openGraph = {
            ...(result.openGraph || {}),
            ...metadataOverrides.openGraph,
          };
        }
        if (metadataOverrides.twitter) {
          result.twitter = {
            ...(result.twitter || {}),
            ...metadataOverrides.twitter,
          };
        }
        if (metadataOverrides.alternates) {
          result.alternates = {
            ...(result.alternates || {}),
            ...metadataOverrides.alternates,
          };
        }
        for (const [key, value] of Object.entries(metadataOverrides)) {
          if (key === 'openGraph' || key === 'twitter' || key === 'alternates') {
            continue;
          }
          if (value !== undefined) {
            (result as any)[key] = value;
          }
        }
      }

      return result;
    },
    async getSitemap(sitemapOptions?: SitemapOptions): Promise<SitemapItem[]> {
      const raw = await options.connector.fetchData();
      const effectiveBaseUrl = sitemapOptions?.baseUrl || options.baseUrl || raw?.website?.url;
      const webpages = extractWebpages(raw);
      return buildSitemapItems(webpages, {
        ...sitemapOptions,
        baseUrl: effectiveBaseUrl,
      });
    },
    async generateSitemapXml(sitemapOptions?: SitemapOptions): Promise<string> {
      const items = await this.getSitemap(sitemapOptions);
      return generateSitemapXml(items);
    },
    createSitemapHandler(handlerOptions?: SitemapRouteHandlerOptions) {
      return createSitemapRouteHandler(async () => this.getSitemap(handlerOptions), handlerOptions);
    },
    createPagesSitemapHandler(handlerOptions?: SitemapRouteHandlerOptions) {
      return createPagesSitemapRouteHandler(async () => this.getSitemap(handlerOptions), handlerOptions);
    },
    async getRobots(robotsOptions?: RobotsOptions): Promise<NextRobotsResult> {
      const raw = await options.connector.fetchData();
      const effectiveBaseUrl = robotsOptions?.baseUrl || options.baseUrl || raw?.website?.url;
      return buildRobotsData({
        ...robotsOptions,
        baseUrl: effectiveBaseUrl,
      });
    },
    async generateRobotsTxt(robotsOptions?: RobotsOptions): Promise<string> {
      const robotsData = await this.getRobots(robotsOptions);
      return generateRobotsTxt(robotsData);
    },
    createRobotsHandler(handlerOptions?: RobotsRouteHandlerOptions) {
      return createRobotsRouteHandler(async () => this.getRobots(handlerOptions), handlerOptions);
    },
    createPagesRobotsHandler(handlerOptions?: RobotsRouteHandlerOptions) {
      return createPagesRobotsRouteHandler(async () => this.getRobots(handlerOptions), handlerOptions);
    },
  };
}
