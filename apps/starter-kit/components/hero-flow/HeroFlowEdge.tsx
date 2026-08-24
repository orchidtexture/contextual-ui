'use client';

import React, { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from 'reactflow';
import { FlowEdgeData } from './types';

export const HeroFlowEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  data,
}: EdgeProps<FlowEdgeData>) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    curvature: 0.25,
  });

  const isActive = data?.isActive ?? true;
  const isHighlighted = data?.isHighlighted ?? false;
  const color = data?.color || '#4fabf0';
  const duration = data?.duration || '2.8s';

  return (
    <>
      {/* Background ambient glow path */}
      <BaseEdge
        id={`${id}-glow`}
        path={edgePath}
        style={{
          stroke: color,
          strokeWidth: isHighlighted ? 6 : 3,
          strokeOpacity: isHighlighted ? 0.35 : 0.12,
          transition: 'all 0.3s ease',
        }}
      />

      {/* Main path line */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: isHighlighted ? color : '#3f3f46',
          strokeWidth: isHighlighted ? 2.5 : 1.5,
          strokeDasharray: isHighlighted ? '6 3' : undefined,
          transition: 'all 0.3s ease',
        }}
      />

      {/* Animated Traveling Data Packet Particle */}
      {isActive && (
        <circle
          r={isHighlighted ? 3.5 : 2.5}
          fill={color}
          className="transition-all duration-300"
          style={{
            filter: `drop-shadow(0 0 5px ${color})`,
          }}
        >
          <animateMotion
            dur={duration}
            repeatCount="indefinite"
            path={edgePath}
          />
        </circle>
      )}

      {/* Floating Edge Label Pill */}
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono tracking-tight transition-all duration-300 border backdrop-blur-md select-none ${
              isHighlighted
                ? 'bg-zinc-900/95 text-zinc-100 border-zinc-500 shadow-lg scale-105'
                : 'bg-zinc-950/85 text-zinc-400 border-zinc-800/80 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <span className="inline-block mr-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

HeroFlowEdge.displayName = 'HeroFlowEdge';
