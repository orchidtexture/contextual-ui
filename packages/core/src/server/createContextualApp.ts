import { GraphRouteHandlerOptions } from './createGraphRouteHandler';
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
    let targetPage: any = undefined;
    const isSinglePage = !webpageKey || !raw[webpageKey] || (Array.isArray(raw[webpageKey]) && raw[webpageKey].length <= 1);

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
          targetPage = { ...found, ...(pageOverride || {}) };
          merged[webpageKey] = targetPage;
        } else if (pageOverride && Object.keys(pageOverride).length > 0) {
          targetPage = {
            ...(pageId ? { id: pageId } : {}),
            ...(pageUrl ? { url: pageUrl } : {}),
            ...pageOverride,
          };
          merged[webpageKey] = targetPage;
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
            targetPage = { ...found, ...overrideObj };
            merged[webpageKey] = targetPage;
          } else {
            targetPage = overrideObj;
            merged[webpageKey] = overrideObj;
          }
        }
      }
    } else if (webpageKey && typeof merged[webpageKey] === 'object') {
      targetPage = merged[webpageKey];
    }

    // Support page-scoped filtering when pageId or pageUrl is specified
    const resolvedTargetId = targetPage?.id || pageId || (pageUrl === '/' ? 'home' : (pageUrl ? pageUrl.replace(/^\//, '') : undefined));

    if (resolvedTargetId && (pageId || pageUrl)) {
      const declaredParts: string[] | undefined = Array.isArray(targetPage?.hasPart)
        ? targetPage.hasPart
        : (Array.isArray(targetPage?.sections) ? targetPage.sections : undefined);

      const matchesPart = (id: string, itemPageId?: string) => {
        if (!id) return false;
        return Boolean(
          declaredParts?.includes(id) ||
          declaredParts?.includes(`#${id}`) ||
          declaredParts?.includes(`section:${id}`) ||
          (itemPageId ? declaredParts?.includes(`section:${itemPageId}:${id}`) : false) ||
          (itemPageId ? declaredParts?.includes(`#section:${itemPageId}:${id}`) : false) ||
          declaredParts?.includes(`action:${id}`) ||
          declaredParts?.includes(`#action:${id}`)
        );
      };

      // 1. Filter sections
      const sectionKey = ('sections' in merged) ? 'sections' : (('section' in merged) ? 'section' : undefined);
      if (sectionKey && Array.isArray(merged[sectionKey])) {
        merged[sectionKey] = (merged[sectionKey] as any[]).filter((s: any) => {
          if (declaredParts && declaredParts.length > 0) return matchesPart(s.id, s.pageId);
          if (s.pageId) return s.pageId === resolvedTargetId;
          return resolvedTargetId === 'home' || isSinglePage;
        });
      }

      // 2. Filter forms
      const formKey = ('forms' in merged) ? 'forms' : (('form' in merged) ? 'form' : undefined);
      if (formKey && merged[formKey]) {
        const formList: any[] = Array.isArray(merged[formKey]) ? merged[formKey] : [merged[formKey]];
        const filteredForms = formList.filter((f: any) => {
          if (declaredParts && declaredParts.length > 0) {
            return matchesPart(f.id) || matchesPart(`form-${f.id}`) || declaredParts.includes('forms') || declaredParts.includes('#forms');
          }
          if (f.pageId) return f.pageId === resolvedTargetId;
          return resolvedTargetId === 'home' || isSinglePage;
        });
        if (Array.isArray(merged[formKey])) {
          merged[formKey] = filteredForms;
        } else {
          merged[formKey] = filteredForms.length > 0 ? filteredForms[0] : undefined;
        }
      }

      // 3. Filter faq
      const faqKey = ('faq' in merged) ? 'faq' : undefined;
      if (faqKey && merged[faqKey]) {
        let faqBelongs = false;
        if (declaredParts && declaredParts.length > 0) {
          faqBelongs = declaredParts.includes('faq') || declaredParts.includes('#faq');
        } else {
          const faqData = merged[faqKey];
          const faqPageId = faqData?.pageId || (Array.isArray(faqData) ? faqData[0]?.pageId : undefined);
          if (faqPageId) {
            faqBelongs = faqPageId === resolvedTargetId;
          } else {
            faqBelongs = resolvedTargetId === 'home' || isSinglePage;
          }
        }
        if (!faqBelongs) {
          merged[faqKey] = [];
        }
      }

      // 4. Filter collections
      const colKey = ('collections' in merged) ? 'collections' : (('collection' in merged) ? 'collection' : undefined);
      if (colKey && Array.isArray(merged[colKey])) {
        merged[colKey] = (merged[colKey] as any[]).filter((c: any) => {
          if (declaredParts && declaredParts.length > 0) return matchesPart(c.id, c.pageId);
          if (c.pageId) return c.pageId === resolvedTargetId;
          return resolvedTargetId === 'home' || isSinglePage;
        });
      }

      // 5. Filter services
      const serviceKey = ('services' in merged) ? 'services' : (('service' in merged) ? 'service' : undefined);
      if (serviceKey && Array.isArray(merged[serviceKey])) {
        merged[serviceKey] = (merged[serviceKey] as any[]).filter((s: any) => {
          if (declaredParts && declaredParts.length > 0) return matchesPart(s.id, s.pageId);
          if (s.pageId) return s.pageId === resolvedTargetId;
          return resolvedTargetId === 'home' || isSinglePage;
        });
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
      const rawData = await options.connector.fetchData();
      const targetPageId = handlerOptions?.pageId || (handlerOptions?.pageUrl === '/' ? 'home' : (handlerOptions?.pageUrl ? handlerOptions.pageUrl.replace(/^\//, '') : undefined));

      const webpageKey = ('webpage' in rawData) ? 'webpage' : (('webpages' in rawData) ? 'webpages' : undefined);
      const isSinglePage = !webpageKey || !rawData[webpageKey] || (Array.isArray(rawData[webpageKey]) && rawData[webpageKey].length <= 1);
      const sectionKey = ('sections' in rawData) ? 'sections' : (('section' in rawData) ? 'section' : undefined);
      const colKey = ('collections' in rawData) ? 'collections' : (('collection' in rawData) ? 'collection' : undefined);
      const serviceKey = ('services' in rawData) ? 'services' : (('service' in rawData) ? 'service' : undefined);
      const formKey = ('forms' in rawData) ? 'forms' : (('form' in rawData) ? 'form' : undefined);
      const faqKey = ('faq' in rawData) ? 'faq' : undefined;

      const extendedJsonLdContext = {
        ...(handlerOptions?.jsonLdContext || {}),
        hasFaq: Boolean(rawData.faq),
        targetPageId,
        isSinglePage,
        resolvePageParts: (pId: string) => {
          const parts: Array<string | { '@id': string }> = [];
          if (rawData.navbar) parts.push('navbar');

          if (sectionKey && Array.isArray(rawData[sectionKey])) {
            const matched = rawData[sectionKey].filter((s: any) => {
              if (s.pageId) return s.pageId === pId;
              return pId === 'home' || isSinglePage;
            });
            for (const s of matched) {
              const sId = s.id?.startsWith('#') || s.id?.startsWith('http')
                ? s.id
                : (s.pageId ? `section:${s.pageId}:${s.id}` : `section:${s.id}`);
              parts.push(sId);
            }
          }

          if (colKey && Array.isArray(rawData[colKey])) {
            const matchedCols = rawData[colKey].filter((c: any) => {
              if (c.pageId) return c.pageId === pId;
              return pId === 'home' || isSinglePage;
            });
            for (const c of matchedCols) {
              const cId = c.id?.startsWith('#') || c.id?.startsWith('http')
                ? c.id
                : (c.pageId ? `itemlist:${c.pageId}:${c.id}` : `itemlist:${c.id}`);
              parts.push(cId);
            }
          }

          if (serviceKey && Array.isArray(rawData[serviceKey])) {
            const matchedServices = rawData[serviceKey].filter((s: any) => {
              if (s.pageId) return s.pageId === pId;
              return pId === 'home' || isSinglePage;
            });
            for (const s of matchedServices) {
              const sId = s.id?.startsWith('#') || s.id?.startsWith('http')
                ? s.id
                : (s.pageId ? `service:${s.pageId}:${s.id}` : `service:${s.id}`);
              parts.push(sId);
            }
          }

          if (formKey && rawData[formKey]) {
            const formList: any[] = Array.isArray(rawData[formKey]) ? rawData[formKey] : [rawData[formKey]];
            const matched = formList.filter((f: any) => {
              if (f.pageId) return f.pageId === pId;
              return pId === 'home' || isSinglePage;
            });
            for (const f of matched) {
              parts.push(`action:form-${f.id}`);
            }
          }

          if (faqKey && rawData[faqKey]) {
            const faqData = rawData[faqKey];
            const faqPageId = faqData?.pageId || (Array.isArray(faqData) ? faqData[0]?.pageId : undefined);
            const matchesFaq = faqPageId ? faqPageId === pId : (pId === 'home' || isSinglePage);
            if (matchesFaq) {
              parts.push('faq');
            }
          }

          if (rawData.footer) parts.push('footer');
          return parts;
        },
      };

      const hydrated = await getHydrated(
        handlerOptions?.dataOverrides,
        handlerOptions?.pageId,
        handlerOptions?.pageUrl
      );
      const generated = hydrated.generateJsonLd(extendedJsonLdContext);
      const config = hydrated.config || options.schema.config || {};
      
      const filteredGenerated: Record<string, any> = {};
      const includeKeys = handlerOptions?.includeKeys;
      const excludeKeys = handlerOptions?.excludeKeys;
      const includeAll = handlerOptions?.includeAll;

      for (const [key, val] of Object.entries(generated)) {
        if (!val) continue;
        if (Array.isArray(val) && val.length === 0) continue;

        if (excludeKeys?.includes(key)) continue;
        
        if (includeKeys?.includes(key)) {
          filteredGenerated[key] = val;
          continue;
        }

        if (includeAll) {
          filteredGenerated[key] = val;
          continue;
        }

        // When a specific page is targeted, include page-scoped non-global entities that were hydrated for this page
        if (targetPageId) {
          if (
            key === 'sections' ||
            key === 'section' ||
            key === 'collections' ||
            key === 'collection' ||
            key === 'services' ||
            key === 'service' ||
            key === 'forms' ||
            key === 'form' ||
            key === 'faq'
          ) {
            filteredGenerated[key] = val;
            continue;
          }
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
        GET: async (_req: Request) => {
          try {
            const graph = await this.getGraph(handlerOptions);
            const defaultHeaders = {
              'Content-Type': 'application/ld+json; charset=utf-8',
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'public, max-age=60, s-maxage=300',
              ...handlerOptions?.headers,
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
