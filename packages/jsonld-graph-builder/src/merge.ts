import { DedupeStrategy, JsonLdObject, JsonLdValue } from './types';

/**
 * Deeply merges two JSON-LD values according to Schema.org semantics.
 */
export function mergeJsonLdValues(
  valA: JsonLdValue | undefined,
  valB: JsonLdValue | undefined,
  strategy: DedupeStrategy = 'merge'
): JsonLdValue | undefined {
  if (valA === undefined) return valB;
  if (valB === undefined) return valA;

  if (strategy === 'first-wins') return valA;
  if (strategy === 'last-wins') return valB;

  // If identical primitives
  if (valA === valB) return valA;

  // Array + Array
  if (Array.isArray(valA) && Array.isArray(valB)) {
    const combined = [...valA];
    for (const itemB of valB) {
      if (typeof itemB === 'object' && itemB !== null && '@id' in itemB && (itemB as any)['@id']) {
        const idB = (itemB as any)['@id'];
        const existingIndex = combined.findIndex(
          (itemA) =>
            typeof itemA === 'object' &&
            itemA !== null &&
            '@id' in itemA &&
            (itemA as any)['@id'] === idB
        );
        if (existingIndex >= 0) {
          combined[existingIndex] = mergeJsonLdValues(combined[existingIndex], itemB, strategy)!;
        } else {
          combined.push(itemB);
        }
      } else if (!combined.includes(itemB)) {
        combined.push(itemB);
      }
    }
    return combined;
  }

  // Array + Primitive
  if (Array.isArray(valA) && !Array.isArray(valB)) {
    return valA.includes(valB) ? valA : [...valA, valB];
  }

  // Primitive + Array
  if (!Array.isArray(valA) && Array.isArray(valB)) {
    return valB.includes(valA) ? valB : [valA, ...valB];
  }

  // Object + Object (non-array)
  if (typeof valA === 'object' && valA !== null && typeof valB === 'object' && valB !== null) {
    const objA = valA as JsonLdObject;
    const objB = valB as JsonLdObject;

    // If both have @id and they differ, they represent two distinct entities
    if (objA['@id'] && objB['@id'] && objA['@id'] !== objB['@id']) {
      return [objA, objB];
    }

    return mergeJsonLdNodes(objA, objB, strategy);
  }

  // Differing primitives -> upgrade to array (e.g. sameAs: "url1" + sameAs: "url2" -> ["url1", "url2"])
  return [valA, valB];
}

/**
 * Merges two JSON-LD entity nodes sharing the same @id or structure.
 */
export function mergeJsonLdNodes(
  nodeA: JsonLdObject,
  nodeB: JsonLdObject,
  strategy: DedupeStrategy = 'merge'
): JsonLdObject {
  if (strategy === 'first-wins') return { ...nodeA };
  if (strategy === 'last-wins') return { ...nodeB };

  const merged: JsonLdObject = { ...nodeA };

  for (const [key, valB] of Object.entries(nodeB)) {
    if (key === '@context') continue; // Strip inner @context

    if (!(key in merged) || merged[key] === undefined) {
      merged[key] = valB;
      continue;
    }

    const valA = merged[key];

    if (key === '@type') {
      const typeA = merged['@type'];
      const typeB = nodeB['@type'];
      if (!typeA) {
        merged['@type'] = typeB;
      } else if (!typeB || typeA === typeB) {
        merged['@type'] = typeA;
      } else {
        const typesA = Array.isArray(typeA) ? typeA : [typeA];
        const typesB = Array.isArray(typeB) ? typeB : [typeB];
        merged['@type'] = Array.from(new Set([...typesA, ...typesB])).filter(Boolean) as string[];
      }
      continue;
    }

    merged[key] = mergeJsonLdValues(valA, valB, strategy);
  }

  return merged;
}
