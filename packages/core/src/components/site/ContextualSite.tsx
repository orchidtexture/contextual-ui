'use client';

import { useMemo } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { buildGraph, JsonLdObject } from '@contextual-ui/jsonld-graph-builder';
import { ContextualSiteContext } from './site.context';
import { ContextualSiteProps, ContextualSiteContextValue } from './site.types';

function isHydratedContext(data: any): boolean {
  return (
    data !== null &&
    typeof data === 'object' &&
    'raw' in data &&
    typeof data.generateJsonLd === 'function'
  );
}

export function ContextualSite<
  TSchema extends { hydrate: (data: any) => any; generateJsonLd?: (data: any, ctx?: any) => any } = any,
  TData = any
>({
  schema,
  data: rawData,
  graph: explicitGraph,
  options,
  children,
  asChild = false,
  className,
  ...props
}: ContextualSiteProps<TSchema, TData>) {
  const { data, graph, getAgentData } = useMemo(() => {
    if (explicitGraph !== undefined) {
      return {
        data: rawData,
        graph: explicitGraph,
        getAgentData: undefined,
      };
    }

    let resolvedData: any = rawData;
    let entities: JsonLdObject[] = [];
    let agentDataGetter: (() => Record<string, any>) | undefined;

    if (isHydratedContext(rawData)) {
      const hydrated = rawData as any;
      resolvedData = hydrated.raw;
      agentDataGetter = hydrated.getAgentData?.bind(hydrated);

      const generated = hydrated.generateJsonLd(options?.jsonLdContext);
      if (Array.isArray(generated)) {
        entities = generated;
      } else if (typeof generated === 'object' && generated !== null) {
        entities = Object.values(generated).filter(Boolean) as JsonLdObject[];
      }
    } else if (schema && typeof schema.hydrate === 'function' && rawData !== undefined) {
      const hydrated = schema.hydrate(rawData);
      resolvedData = hydrated.raw;
      agentDataGetter = hydrated.getAgentData?.bind(hydrated);

      const generated = hydrated.generateJsonLd(options?.jsonLdContext);
      if (Array.isArray(generated)) {
        entities = generated;
      } else if (typeof generated === 'object' && generated !== null) {
        entities = Object.values(generated).filter(Boolean) as JsonLdObject[];
      }
    } else if (schema && typeof schema.generateJsonLd === 'function' && rawData !== undefined) {
      const generated = schema.generateJsonLd(rawData, options?.jsonLdContext);
      if (Array.isArray(generated)) {
        entities = generated;
      } else if (typeof generated === 'object' && generated !== null) {
        entities = Object.values(generated).filter(Boolean) as JsonLdObject[];
      }
    }

    const builtGraph = entities.length > 0 ? buildGraph(entities, options) : null;

    return {
      data: resolvedData,
      graph: builtGraph,
      getAgentData: agentDataGetter,
    };
  }, [schema, rawData, explicitGraph, options]);

  const contextValue = useMemo<ContextualSiteContextValue>(
    () => ({
      data,
      graph,
      isContextualSite: true,
      getAgentData,
    }),
    [data, graph, getAgentData]
  );

  const Comp = asChild ? Slot : 'div';

  return (
    <ContextualSiteContext.Provider value={contextValue}>
      <Comp
        data-contextual="site-root"
        className={className}
        {...props}
      >
        {!options?.disableJsonLdScript && graph && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
          />
        )}
        {children}
      </Comp>
    </ContextualSiteContext.Provider>
  );
}
