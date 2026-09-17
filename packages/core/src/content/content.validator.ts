import type { JsonLdGraphResult } from 'jsonld-graph-builder';

export interface GraphReferenceValidationResult {
  valid: boolean;
  missingLocalIds: string[];
  internalReferences: string[];
  externalReferences: string[];
  definedNodeIds: string[];
}

/**
 * Validates reference integrity across a Schema.org JSON-LD @graph.
 * Distinguishes intentionally external references (different origins, mailto, etc.)
 * from internal local references, and reports any missing/dangling local @id records.
 */
export function validateGraphReferences(
  graph: JsonLdGraphResult,
  options?: { baseUrl?: string }
): GraphReferenceValidationResult {
  const nodes = graph?.['@graph'] || [];
  const baseUrl = options?.baseUrl ? options.baseUrl.replace(/\/$/, '') : undefined;

  const definedNodeIds = new Set<string>();
  for (const node of nodes) {
    if (node['@id']) {
      definedNodeIds.add(node['@id']);
    }
  }

  const internalReferences = new Set<string>();
  const externalReferences = new Set<string>();
  const missingLocalIds = new Set<string>();

  function normalizeForLookup(id: string): string[] {
    const variants = [id];
    if (baseUrl) {
      if (id.startsWith('#')) {
        variants.push(`${baseUrl}/${id}`);
        variants.push(`${baseUrl}${id}`);
      } else if (id.startsWith(baseUrl)) {
        const hashIdx = id.indexOf('#');
        if (hashIdx >= 0) {
          variants.push(id.slice(hashIdx));
        }
      }
    }
    return variants;
  }

  function checkReference(refId: string) {
    if (!refId || typeof refId !== 'string') return;

    const isExplicitFragment = refId.startsWith('#');
    const isBaseUrlMatch = baseUrl ? refId.startsWith(baseUrl) : false;
    const isExternalUrl = /^https?:\/\//.test(refId) && !isBaseUrlMatch;
    const isOtherExternal = /^(mailto:|tel:|urn:|schema:)/.test(refId);

    if (isExternalUrl || isOtherExternal) {
      externalReferences.add(refId);
      return;
    }

    if (isExplicitFragment || isBaseUrlMatch) {
      internalReferences.add(refId);
      const variants = normalizeForLookup(refId);
      const exists = variants.some((v) => definedNodeIds.has(v));
      if (!exists) {
        missingLocalIds.add(refId);
      }
    }
  }

  function walk(val: any) {
    if (!val || typeof val !== 'object') return;

    if (Array.isArray(val)) {
      for (const item of val) {
        walk(item);
      }
      return;
    }

    // Pointer reference: { '@id': string }
    if ('@id' in val && typeof val['@id'] === 'string') {
      const keys = Object.keys(val).filter((k) => k !== '@id' && k !== '@context');
      // If it only has @id (pure reference pointer), check it!
      if (keys.length === 0) {
        checkReference(val['@id']);
        return;
      }
    }

    for (const [key, propVal] of Object.entries(val)) {
      if (key === '@context') continue;
      if (
        (key === 'isPartOf' ||
          key === 'hasPart' ||
          key === 'mainEntity' ||
          key === 'about' ||
          key === 'provider') &&
        typeof propVal === 'string'
      ) {
        checkReference(propVal);
      } else {
        walk(propVal);
      }
    }
  }

  for (const node of nodes) {
    for (const [key, val] of Object.entries(node)) {
      if (key === '@id' || key === '@context') continue;
      walk(val);
    }
  }

  const missingList = Array.from(missingLocalIds);

  return {
    valid: missingList.length === 0,
    missingLocalIds: missingList,
    internalReferences: Array.from(internalReferences),
    externalReferences: Array.from(externalReferences),
    definedNodeIds: Array.from(definedNodeIds),
  };
}
