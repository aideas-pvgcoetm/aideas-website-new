'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';
import logoImg from '@/components/logo.png';

export interface CoreNodeData {
  name: string;
  role: string;
  isHovered?: boolean;
  isDimmed?: boolean;
}

function CoreNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as CoreNodeData;

  return (
    <div
      className={`network-node-wrapper relative group select-none ${
        nodeData.isDimmed ? 'dimmed' : ''
      } ${nodeData.isHovered ? 'highlighted' : ''}`}
    >
      {/* Node Pill Container - BIG RECTANGLE BADGE */}
      <div className="relative w-[300px] sm:w-[360px] px-7 py-5 rounded-3xl bg-[#09090b] border-2 border-blue-500/80 shadow-[0_0_45px_rgba(59,130,246,0.6)] flex items-center gap-5 transition-all duration-300 group-hover:scale-105 group-hover:border-blue-400 group-hover:shadow-[0_0_60px_rgba(59,130,246,0.8)]">
        {/* Logo / Central Badge */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1.5 bg-black border-2 border-blue-400/80 flex items-center justify-center shrink-0 shadow-lg">
          <Image
            src={logoImg}
            alt="aIDEAS Logo"
            width={64}
            height={64}
            className="rounded-xl object-contain"
          />
        </div>

        {/* Text Details */}
        <div className="text-left flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {nodeData.name}
            </span>
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse shrink-0" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-blue-400 tracking-wide mt-1">
            {nodeData.role}
          </p>
        </div>
      </div>

      {/* Connection Handle to HOD Node (Bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!bg-blue-500 !w-3 !h-3"
      />
    </div>
  );
}

export default memo(CoreNodeComponent);
