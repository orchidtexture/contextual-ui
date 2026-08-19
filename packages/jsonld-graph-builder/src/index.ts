import { GraphBuilderOptions, JsonLdGraphResult, JsonLdObject } from './types';

export * from './types';
export * from './helpers';

/**
 * Builds a unified Schema.org JSON-LD @graph from individual entities.
 */
export function buildGraph(
  entities: Array<JsonLdObject>,
  _options?: GraphBuilderOptions
): JsonLdGraphResult {
  // Stub for architectural foundation (implemented in subsequent phases)
  return {
    '@context': 'https://schema.org',
    '@graph': entities,
  };
}
