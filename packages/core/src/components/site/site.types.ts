import { ReactNode, HTMLAttributes } from 'react';
import { GraphBuilderOptions, JsonLdGraphResult } from 'jsonld-graph-builder';
import type { JsonLdContext } from '../../registry/defineSchema';

export interface ContextualSiteOptions extends GraphBuilderOptions {
  /** Optional custom context for createId / refersTo */
  jsonLdContext?: Partial<JsonLdContext>;
  /** Disable automatic rendering of the <script type="application/ld+json"> tag */
  disableJsonLdScript?: boolean;
}

export interface ContextualSiteContextValue<TData = Record<string, any>> {
  data?: TData;
  isContextualSite: boolean;
  graph?: JsonLdGraphResult | null;
  getAgentData?: () => Record<string, any>;
}

export interface ContextualSiteProps<
  TSchema extends { hydrate: (data: any) => any; generateJsonLd?: (data: any, ctx?: any) => any } = any,
  TData = any
> extends HTMLAttributes<HTMLDivElement> {
  /** Schema definition returned by `defineSchema` (for client usage) */
  schema?: TSchema;
  /** Raw data or HydratedContext matching the schema */
  data?: TData;
  /** Pre-built Schema.org graph object (ideal for Server Components across RSC boundary) */
  graph?: JsonLdGraphResult | null;
  /** Options for graph building (e.g. baseUrl) and JSON-LD generation */
  options?: ContextualSiteOptions;
  /** Render as a Radix Slot to merge props onto child element */
  asChild?: boolean;
  /** Children to render */
  children?: ReactNode;
}
