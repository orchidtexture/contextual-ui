import { ReactNode, HTMLAttributes } from 'react';
import { GraphBuilderOptions, JsonLdGraphResult } from '@contextual-ui/jsonld-graph-builder';
import type { JsonLdContext } from '../../registry/defineSchema';

export interface ContextualPageOptions extends GraphBuilderOptions {
  /** Optional custom context for createId / refersTo */
  jsonLdContext?: Partial<JsonLdContext>;
  /** Disable automatic rendering of the <script type="application/ld+json"> tag */
  disableJsonLdScript?: boolean;
}

export interface ContextualPageContextValue<TData = Record<string, any>> {
  data?: TData;
  isContextualPage: boolean;
  graph?: JsonLdGraphResult | null;
  getAgentData?: () => Record<string, any>;
}

export interface ContextualPageProps<
  TSchema extends { hydrate: (data: any) => any; generateJsonLd?: (data: any, ctx?: any) => any } = any,
  TData = any
> extends HTMLAttributes<HTMLDivElement> {
  /** Schema definition returned by `defineSchema` */
  schema?: TSchema;
  /** Raw data or HydratedContext matching the schema */
  data?: TData;
  /** Options for graph building (e.g. baseUrl) and JSON-LD generation */
  options?: ContextualPageOptions;
  /** Render as a Radix Slot to merge props onto child element */
  asChild?: boolean;
  /** Children to render */
  children?: ReactNode;
}
