'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { initialNodes, initialEdges } from './flowData';
import { HeroFlowNode } from './HeroFlowNode';
import { HeroFlowEdge } from './HeroFlowEdge';
import { FlowChannel, FlowNodeData, FlowEdgeData } from './types';

const nodeTypes = {
  heroNode: HeroFlowNode,
};

const edgeTypes = {
  glowingEdge: HeroFlowEdge,
};

function FlowCanvas() {
  const [selectedChannel, setSelectedChannel] = useState<FlowChannel>('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('engine-node');

  const { fitView } = useReactFlow();

  // Compute edges based on active channel and play state
  const computedEdges = useMemo(() => {
    return initialEdges.map((edge) => {
      const isChannelMatch =
        selectedChannel === 'all' ||
        !edge.data?.channel ||
        edge.data?.channel === selectedChannel;

      return {
        ...edge,
        animated: isChannelMatch,
        data: {
          ...edge.data,
          isActive: isChannelMatch,
          isHighlighted: selectedChannel !== 'all' && isChannelMatch,
        },
      };
    });
  }, [selectedChannel]);

  // Compute nodes with active selection styling
  const computedNodes = useMemo(() => {
    return initialNodes.map((node) => {
      const isChannelMatch =
        selectedChannel === 'all' ||
        !node.data.channel ||
        node.data.channel === selectedChannel;

      const isSelected = node.id === selectedNodeId;

      return {
        ...node,
        selected: isSelected,
        style: {
          opacity: isChannelMatch ? 1 : 0.35,
          transition: 'all 0.3s ease',
        },
      };
    });
  }, [selectedChannel, selectedNodeId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(computedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(computedEdges);

  // Sync state when filter / selection changes
  useEffect(() => {
    setNodes(computedNodes);
  }, [computedNodes, setNodes]);

  useEffect(() => {
    setEdges(computedEdges);
  }, [computedEdges, setEdges]);

  // Initial fit view on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.15, duration: 400 });
    }, 100);
    return () => clearTimeout(timer);
  }, [fitView]);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const handleChannelSelect = (channel: FlowChannel) => {
    setSelectedChannel(channel);
    if (channel === 'ui') setSelectedNodeId('output-ui');
    else if (channel === 'graph') setSelectedNodeId('output-graph');
    else if (channel === 'ai') setSelectedNodeId('output-ai');
    else setSelectedNodeId('engine-node');
  };

  const handleResetView = () => {
    fitView({ padding: 0.15, duration: 300 });
  };

  const activeNodeData = useMemo(() => {
    const found = initialNodes.find((n) => n.id === selectedNodeId);
    return found ? (found.data as FlowNodeData) : null;
  }, [selectedNodeId]);

  return (
    <div className="space-y-4">
      {/* Interactive Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        {/* Channel Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900/90 border border-zinc-800/80 rounded-xl text-xs font-mono">
          <span className="text-zinc-400 text-[11px] px-2 select-none font-semibold uppercase tracking-wider">
            For:
          </span>
          <button
            onClick={() => handleChannelSelect('all')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              selectedChannel === 'all'
                ? 'bg-zinc-800 text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleChannelSelect('ui')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedChannel === 'ui'
                ? 'bg-sky-950/80 text-sky-300 border border-sky-600/50 shadow-sm'
                : 'text-zinc-400 hover:text-sky-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            Humans
          </button>
          <button
            onClick={() => handleChannelSelect('graph')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedChannel === 'graph'
                ? 'bg-purple-950/80 text-purple-300 border border-purple-600/50 shadow-sm'
                : 'text-zinc-400 hover:text-purple-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            Search Engines
          </button>
          <button
            onClick={() => handleChannelSelect('ai')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedChannel === 'ai'
                ? 'bg-rose-950/80 text-rose-300 border border-rose-600/50 shadow-sm'
                : 'text-zinc-400 hover:text-rose-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            AI Agents
          </button>
        </div>
      </div>

      {/* Selected Node Description (simple inline text) */}
      {activeNodeData && (
        <p className="text-sm text-zinc-300 leading-relaxed px-1">
          <span className={`font-mono font-medium text-xs uppercase tracking-wide mr-2 ${activeNodeData.accentClass}`}>
            {activeNodeData.title} &mdash;
          </span>
          {activeNodeData.description}
        </p>
      )}

      {/* ReactFlow Canvas Container */}
      <div className="w-full h-[460px] md:h-[500px] bg-zinc-950 border border-base rounded-2xl overflow-hidden relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          minZoom={0.4}
          maxZoom={1.5}
          zoomOnScroll={false}
          panOnDrag={true}
          attributionPosition="bottom-right"
        >
          <Background color="#52525b" gap={20} size={1} variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
    </div>
  );
}

export function HeroFlowDiagram() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
