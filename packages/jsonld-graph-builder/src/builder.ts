import { extractAndFlattenEntities } from './flatten';
import { mergeJsonLdNodes } from './merge';
import { GraphBuilderOptions, JsonLdGraphResult, JsonLdObject } from './types';

/**
 * Builds a unified, referentially-sound Schema.org JSON-LD @graph from individual entities.
 *
 * @param entities Array of raw or nested JSON-LD objects.
 * @param options Configuration for baseUrl, flattening, and deduplication.
 * @returns Standard Schema.org Graph object.
 */
export function buildGraph(
  entities: Array<JsonLdObject>,
  options: GraphBuilderOptions = {}
): JsonLdGraphResult {
  const {
    baseUrl,
    flatten = true,
    dedupeStrategy = 'merge',
  } = options;

  if (!entities || !Array.isArray(entities)) {
    return {
      '@context': 'https://schema.org',
      '@graph': [],
    };
  }

  // 1. Flatten and canonicalize all entities and sub-entities
  const allNodes = extractAndFlattenEntities(entities, baseUrl, flatten);

  // 2. Merge nodes by @id
  const nodeMap = new Map<string, JsonLdObject>();
  const anonymousNodes: JsonLdObject[] = [];

  for (const node of allNodes) {
    const id = node['@id'];
    if (!id) {
      anonymousNodes.push(node);
      continue;
    }

    const existing = nodeMap.get(id);
    if (!existing) {
      nodeMap.set(id, node);
    } else {
      const merged = mergeJsonLdNodes(existing, node, dedupeStrategy);
      nodeMap.set(id, merged);
    }
  }

  const finalGraph: JsonLdObject[] = [
    ...Array.from(nodeMap.values()),
    ...anonymousNodes,
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': finalGraph,
  };
}
