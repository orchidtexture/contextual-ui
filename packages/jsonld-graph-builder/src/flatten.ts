import { canonicalizeId } from './canonicalize';
import { JsonLdObject, JsonLdValue } from './types';

/**
 * Determines whether an object is a full JSON-LD entity with properties or just an @id pointer.
 */
function isEntityWithProperties(obj: Record<string, any>): boolean {
  if (!obj['@id']) return false;
  const keys = Object.keys(obj).filter((k) => k !== '@id' && k !== '@context');
  return keys.length > 0;
}

/**
 * Traverses an entity and flattens any nested sub-entities with an @id to the root array.
 */
export function extractAndFlattenEntities(
  input: JsonLdObject | JsonLdObject[],
  baseUrl?: string,
  flatten: boolean = true
): JsonLdObject[] {
  const extractedNodes: JsonLdObject[] = [];
  const rawEntities = Array.isArray(input) ? input : [input];

  function processValue(val: JsonLdValue | undefined): JsonLdValue | undefined {
    if (val === undefined || val === null) return val;

    if (Array.isArray(val)) {
      return val.map((item) => processValue(item) as JsonLdValue);
    }

    if (typeof val === 'object') {
      const obj = { ...(val as JsonLdObject) };

      // Delete @context inside inner entities
      delete obj['@context'];

      // Canonicalize @id if present
      if (obj['@id']) {
        obj['@id'] = canonicalizeId(obj['@id'], baseUrl);
      }

      if (flatten && isEntityWithProperties(obj)) {
        // Recursively process children of this nested entity
        const processedNested: JsonLdObject = {};
        for (const [k, v] of Object.entries(obj)) {
          processedNested[k] = processValue(v);
        }

        // Add to top-level pool
        extractedNodes.push(processedNested);

        // Replace with reference pointer
        return { '@id': processedNested['@id']! };
      }

      // If not flattening or is a simple sub-object without @id / is a pointer
      const processedObj: JsonLdObject = {};
      for (const [k, v] of Object.entries(obj)) {
        processedObj[k] = processValue(v);
      }
      return processedObj;
    }

    return val;
  }

  for (const entity of rawEntities) {
    if (!entity || typeof entity !== 'object') continue;

    const rootCopy = { ...entity };
    delete rootCopy['@context'];

    if (rootCopy['@id']) {
      rootCopy['@id'] = canonicalizeId(rootCopy['@id'], baseUrl);
    }

    const processedRoot: JsonLdObject = {};
    for (const [k, v] of Object.entries(rootCopy)) {
      processedRoot[k] = processValue(v);
    }

    extractedNodes.push(processedRoot);
  }

  return extractedNodes;
}
