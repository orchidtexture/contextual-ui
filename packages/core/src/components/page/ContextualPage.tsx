'use client';

import { useMemo } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { buildGraph, JsonLdObject } from '@contextual-ui/jsonld-graph-builder';
import { ContextualPageContext } from './page.context';
import { ContextualPageProps, ContextualPageContextValue } from './page.types';

function isHydratedContext(data: any): boolean {
  return (
    data !== null &&
    typeof data === 'object' &&
    'raw' in data &&
    typeof data.generateJsonLd === 'function'
  );
}

export function ContextualPage<
  TSchema extends { hydrate: (data: any) => any; generateJsonLd?: (data: any, ctx?: any) => any } = any,
  TData = any
>({
  schema,
  data: rawData,
  options,
  children,
  asChild = false,
  className,
  ...props
}: ContextualPageProps<TSchema, TData>) {
  const { data, graph, getAgentData } = useMemo(() => {
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
  }, [schema, rawData, options]);

  const contextValue = useMemo<ContextualPageContextValue>(
    () => ({
      data,
      graph,
      isContextualPage: true,
      getAgentData,
    }),
    [data, graph, getAgentData]
  );

  const Comp = asChild ? Slot : 'div';

  return (
    <ContextualPageContext.Provider value={contextValue}>
      <Comp
        data-contextual="page-root"
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
    </ContextualPageContext.Provider>
  );
}
