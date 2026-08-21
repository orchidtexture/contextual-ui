import { Node, Edge } from 'reactflow';

export interface GraphEntity {
  '@id': string;
  '@type'?: string | string[];
  name?: string;
  headline?: string;
  title?: string;
  [key: string]: any;
}

export function parseGraphToReactFlow(graphData: any): { nodes: Node[]; edges: Edge[] } {
  const graphArray: GraphEntity[] = Array.isArray(graphData)
    ? graphData
    : graphData?.['@graph'] || (graphData && typeof graphData === 'object' ? Object.values(graphData) : []);

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const seenNodeIds = new Set<string>();
  const edgeSet = new Set<string>();

  // First pass: collect all valid node IDs
  for (const entity of graphArray) {
    if (entity && typeof entity === 'object' && entity['@id']) {
      seenNodeIds.add(entity['@id']);
    }
  }

  // Second pass: create nodes and edges
  for (const entity of graphArray) {
    if (!entity || typeof entity !== 'object' || !entity['@id']) continue;

    const id = entity['@id'];
    const rawType = entity['@type'] || 'Thing';
    const type = Array.isArray(rawType) ? rawType.join(', ') : rawType;

    // Determine label
    const name = entity.name || entity.headline || entity.title;
    let label = name;
    if (!label) {
      try {
        const url = new URL(id);
        const hash = url.hash;
        if (hash) {
          label = hash.replace(/^#/, '');
        } else {
          const segments = url.pathname.split('/').filter(Boolean);
          label = segments[segments.length - 1] || id;
        }
      } catch {
        const parts = id.split('#');
        label = parts[parts.length - 1] || id;
      }
    }

    nodes.push({
      id,
      type: 'schemaNode',
      position: { x: 0, y: 0 },
      data: {
        id,
        type,
        label,
        properties: entity,
      },
    });

    // Helper to scan properties for references, ignoring isPartOf
    const scanValue = (val: any, propKey?: string) => {
      if (!val) return;
      if (propKey === 'isPartOf') return;

      if (typeof val === 'object') {
        if (val['@id'] && seenNodeIds.has(val['@id'])) {
          const targetId = val['@id'];
          const edgeKey = `${id}->${targetId}`;
          if (!edgeSet.has(edgeKey)) {
            edgeSet.add(edgeKey);
            edges.push({
              id: edgeKey,
              source: id,
              target: targetId,
              type: 'smoothstep',
              sourceHandle: 'source',
              targetHandle: 'target',
              animated: false,
              style: { stroke: '#52525b', strokeWidth: 2 },
            });
          }
        } else if (Array.isArray(val)) {
          for (const item of val) {
            scanValue(item, propKey);
          }
        } else {
          for (const subKey of Object.keys(val)) {
            if (subKey === 'isPartOf') continue;
            scanValue(val[subKey], subKey);
          }
        }
      } else if (typeof val === 'string' && seenNodeIds.has(val)) {
        if (propKey === 'isPartOf') return;
        const targetId = val;
        const edgeKey = `${id}->${targetId}`;
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          edges.push({
            id: edgeKey,
            source: id,
            target: targetId,
            type: 'smoothstep',
            sourceHandle: 'source',
            targetHandle: 'target',
            animated: false,
            style: { stroke: '#52525b', strokeWidth: 2 },
          });
        }
      }
    };

    for (const key of Object.keys(entity)) {
      if (key === '@id' || key === '@type' || key === '@context' || key === 'isPartOf') continue;
      if (['hasPart', 'mainEntity', 'acceptedAnswer'].includes(key)) {
        scanValue(entity[key], key);
      }
    }
  }

  return { nodes, edges };
}
