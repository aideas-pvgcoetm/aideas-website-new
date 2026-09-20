'use client';

import React, { memo } from 'react';
import { EdgeProps, getBezierPath } from '@xyflow/react';

function DataFlowEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const pathId = `edge-path-${id}`;

  return (
    <>
      {/* Base Dotted Connecting Path */}
      <path
        id={pathId}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={style}
      />

      {/* Streaming Glowing Data Particle 1 */}
      <g className="pointer-events-none">
        <circle r="4" fill="#60a5fa" className="drop-shadow-[0_0_10px_rgba(96,165,250,0.95)]">
          <animateMotion
            dur="2.2s"
            repeatCount="indefinite"
            rotate="auto"
          >
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </circle>
      </g>

      {/* Streaming Glowing Data Particle 2 (Staggered Offset) */}
      <g className="pointer-events-none">
        <circle r="3" fill="#bfdbfe" className="drop-shadow-[0_0_8px_rgba(191,219,254,0.9)]">
          <animateMotion
            dur="2.2s"
            begin="1.1s"
            repeatCount="indefinite"
            rotate="auto"
          >
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </circle>
      </g>
    </>
  );
}

export default memo(DataFlowEdgeComponent);
