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
    color,
    accentClass,
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
        <span
          className="text-[9px] px-1 rounded bg-zinc-800/50 text-zinc-400"
          style={{ color: selected ? color : undefined }}
        >
          {selected ? 'ACTIVE' : 'VIEW'}
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
