'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const SchemaNode = memo(({ data }: NodeProps) => {
  const { type, label, id } = data;
  console.log(data)

  return (
    <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 shadow-lg text-zinc-100 w-[300px] transition-colors duration-200">
      <Handle
        id="target"
        type="target"
        position={Position.Left}
        className="!bg-zinc-600 !w-2 !h-2 !rounded-full !-left-1"
      />
      <div className="mb-2">
        <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
          {type || 'Entity'}
        </span>
      </div>
      <div className="font-medium text-xs text-zinc-100" title={label}>
        {label}
      </div>
      <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[90px]" title={id}>
        {id}
      </span>
      <Handle
        id="source"
        type="source"
        position={Position.Right}
        className="!bg-zinc-600 !w-2 !h-2 !rounded-full !-right-1"
      />
    </div>
  );
});

SchemaNode.displayName = 'SchemaNode';
