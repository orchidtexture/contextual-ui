'use client';

import React, { memo } from 'react';
import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';
import { FlowEdgeData } from './types';

export const HeroFlowEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<FlowEdgeData>) => {
  const [edgePath] = getBezierPath({
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
    </>
  );
});

HeroFlowEdge.displayName = 'HeroFlowEdge';
