"use client";

import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: any) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded-md text-xs font-bold text-white shadow-lg cursor-pointer hover:bg-neutral-700 transition"
          title="Modifier la cardinalité"
        >
          <select 
            className="bg-red-400 outline-none cursor-pointer text-center appearance-none"
            value={`${data?.cardMin || '1'},${data?.cardMax || 'n'}`}
            onChange={(e) => {
                const [min, max] = e.target.value.split(',');
                if(data?.onChange) {
                    data.onChange(id, { cardMin: min, cardMax: max });
                }
            }}
          >
            <option value="0,1" className="bg-neutral-800">0, 1</option>
            <option value="1,1" className="bg-neutral-800">1, 1</option>
            <option value="0,n" className="bg-neutral-800">0, n</option>
            <option value="1,n" className="bg-neutral-800">1, n</option>
          </select>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
