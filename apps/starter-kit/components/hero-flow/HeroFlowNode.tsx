'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FlowNodeData } from './types';

export const HeroFlowNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const {
    stage,
    title,
    subtitle,
    badge,
    icon,
    color,
    accentClass,
    tags,
  } = data;

  const isOutput = stage === 'output';
  const isSource = stage === 'source';

  return (
    <div
      className={`group relative w-[220px] sm:w-[230px] rounded-2xl p-3.5 transition-all duration-300 cursor-pointer select-none bg-zinc-900/95 backdrop-blur-md border ${
        selected
          ? 'border-zinc-300 ring-2 shadow-2xl scale-[1.02]'
          : 'border-zinc-800/90 hover:border-zinc-700 hover:shadow-xl hover:scale-[1.01]'
      }`}
      style={{
        boxShadow: selected
          ? `0 0 25px ${color}33, 0 10px 20px -5px rgba(0,0,0,0.5)`
          : undefined,
      }}
    >
      {/* Ambient gradient flare in top-right */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-40"
        style={{ backgroundColor: color }}
      />

      {/* Target Handle (Left) - Not needed for Source node */}
      {!isSource && (
        <Handle
          id="target"
          type="target"
          position={Position.Left}
          className="!w-2.5 !h-2.5 !rounded-full !bg-zinc-700 !border-2 !border-zinc-900 !-left-1.5 transition-all duration-200 group-hover:!bg-zinc-400"
        />
      )}

      {/* Header bar */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={`inline-flex items-center gap-1.5 text-[9px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border border-zinc-800/80 bg-zinc-950/80 ${accentClass}`}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: color }}
          />
          {badge}
        </span>
        <span className="text-sm select-none" role="img" aria-label={title}>
          {icon}
        </span>
      </div>

      {/* Title & Subtitle */}
      <div className="space-y-0.5 mb-2.5">
        <h4 className="text-xs font-bold text-zinc-100 tracking-tight leading-snug group-hover:text-white transition-colors">
          {title}
        </h4>
        <p className="text-[11px] text-zinc-400 font-mono truncate leading-tight">
          {subtitle}
        </p>
      </div>

      {/* Mini Feature Chips / Tags */}
      <div className="flex flex-wrap gap-1">
        {tags.slice(0, 2).map((tag, i) => (
          <span
            key={i}
            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-950/60 border border-zinc-800 text-zinc-400 group-hover:border-zinc-700 transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Click indicator hint */}
      <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
        <span className="group-hover:text-zinc-300 transition-colors flex items-center gap-1">
          <span>Inspect Spec</span>
          <span className="text-xs">→</span>
        </span>
        <span
          className="text-[9px] px-1 rounded bg-zinc-800/50 text-zinc-400"
          style={{ color: selected ? color : undefined }}
        >
          {selected ? 'ACTIVE' : 'VIEW'}
        </span>
      </div>

      {/* Source Handle (Right) - Not needed for Output nodes */}
      {!isOutput && (
        <Handle
          id="source"
          type="source"
          position={Position.Right}
          className="!w-2.5 !h-2.5 !rounded-full !bg-zinc-700 !border-2 !border-zinc-900 !-right-1.5 transition-all duration-200 group-hover:!bg-zinc-400"
        />
      )}
    </div>
  );
});

HeroFlowNode.displayName = 'HeroFlowNode';
