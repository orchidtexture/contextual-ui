'use client';

import React, { useEffect, useState, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { parseGraphToReactFlow } from './parseGraph';
import { getLayoutedElements } from './layout';
import { SchemaNode } from './SchemaNode';

const nodeTypes = {
  schemaNode: SchemaNode,
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  style: { stroke: '#52525b', strokeWidth: 2 },
};

interface SchemaGraphProps {
  graphJson: any;
}

function FlowContent({ graphJson }: SchemaGraphProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    return parseGraphToReactFlow(graphJson);
  }, [graphJson]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isLayouted, setIsLayouted] = useState(false);
  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    let isMounted = true;
    setIsLayouted(false);
    getLayoutedElements(initialNodes, initialEdges).then(
      ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        if (isMounted) {
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);
          setIsLayouted(true);

          // Allow DOM to settle and fit view to all nodes perfectly
          setTimeout(() => {
            reactFlowInstance.fitView({ padding: 0.3, duration: 300 });
          }, 50);
        }
      }
    );
    return () => {
      isMounted = false;
    };
  }, [initialNodes, initialEdges, setNodes, setEdges, reactFlowInstance]);

  return (
    <div className="w-full h-[550px] md:h-[700px] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl relative">
      <div className="absolute top-4 left-4 z-10 bg-zinc-900/85 backdrop-blur border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 flex items-center gap-2 shadow-md">
        <span
          className={`w-2 h-2 rounded-full ${
            isLayouted ? 'bg-accent animate-pulse' : 'bg-amber-500 animate-ping'
          }`}
        ></span>
        {isLayouted
          ? 'Knowledge Graph Visualization'
          : 'Computing Layout...'}
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        minZoom={0.5}
        maxZoom={2}
        attributionPosition="bottom-right"
      >
        <Background color="#9C9C9C" gap={24} size={1} />
      </ReactFlow>
    </div>
  );
}

export function SchemaGraph({ graphJson }: SchemaGraphProps) {
  return (
    <ReactFlowProvider>
      <FlowContent graphJson={graphJson} />
    </ReactFlowProvider>
  );
}
