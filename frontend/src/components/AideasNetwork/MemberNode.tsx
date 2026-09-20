'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Member } from './networkData';

export interface MemberNodeData {
  member: Member;
  isLeadership?: boolean;
  isActiveFocus?: boolean;
  isHovered?: boolean;
  isDimmed?: boolean;
  idleDelayIndex?: number;
  onSelectMember?: (member: Member) => void;
}

function MemberNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as MemberNodeData;
  const { member, isLeadership, isActiveFocus, isHovered, isDimmed, onSelectMember } = nodeData;

  const isMainLeader = member.id === 'gs' || member.id === 'hod' || member.id === 'coordinator';
  const isJGS = member.id === 'jgs';

  // Determine popout direction based on node placement (Right wing pops to left, Left wing/center pops to right)
  const isRightWing =
    member.id.includes('_th') ||
    member.id.includes('desig') ||
    member.id.includes('event') ||
    (member.id.includes('marketing') && !member.id.includes('manish'));

  const popoutPositionClass = isRightWing
    ? 'right-[106%] top-1/2 -translate-y-1/2 slide-in-from-right-3'
    : 'left-[106%] top-1/2 -translate-y-1/2 slide-in-from-left-3';

  return (
    <div
      onClick={() => onSelectMember?.(member)}
      className={`network-node-wrapper relative group cursor-pointer select-none ${
        isDimmed ? 'dimmed' : ''
      } ${isHovered || isActiveFocus ? 'highlighted z-50' : ''}`}
    >
      {/* Main Node Container */}
      <div
        className={`relative flex flex-col items-center p-4 sm:p-5 rounded-3xl bg-[#09090b] border transition-all duration-300 ease-out ${
          isActiveFocus
            ? 'scale-120 sm:scale-125 border-blue-400 shadow-[0_0_50px_rgba(59,130,246,0.9)] ring-2 ring-blue-400 z-50'
            : 'group-hover:scale-108 group-hover:border-blue-400 group-hover:shadow-2xl'
        } ${
          isMainLeader
            ? 'w-[230px] sm:w-[260px] border-blue-500/80 shadow-[0_8px_35px_rgba(59,130,246,0.35)]'
            : isJGS
            ? 'w-[185px] sm:w-[205px] border-blue-500/40 shadow-xl'
            : 'w-[175px] sm:w-[195px] border-zinc-800 shadow-xl'
        }`}
      >
        {/* Active Focus Top Pill */}
        {isActiveFocus && (
          <div className="absolute -top-3.5 px-3.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black tracking-widest uppercase shadow-xl border border-blue-300">
            In Focus
          </div>
        )}

        {/* Circular Profile Image */}
        <div className="relative mb-2.5 shrink-0">
          <img
            src={member.image}
            alt={member.name}
            className={`rounded-full object-cover object-center transition-all duration-300 ${
              isMainLeader
                ? 'w-20 h-20 sm:w-24 sm:h-24 border-3 border-blue-400 group-hover:border-white shadow-xl'
                : isJGS
                ? 'w-15 h-15 sm:w-17 sm:h-17 border-2 border-blue-400/60 group-hover:border-blue-300 shadow-md'
                : 'w-14 h-14 sm:w-16 sm:h-16 border-2 border-zinc-700 group-hover:border-blue-400 shadow-md'
            }`}
          />
        </div>

        {/* Member Name */}
        <h4 className="text-sm sm:text-base font-black text-white text-center leading-tight tracking-tight group-hover:text-blue-300 transition-colors">
          {member.name}
        </h4>

        {/* Member Role */}
        <p className="text-xs sm:text-sm font-bold text-blue-400 text-center mt-1 leading-snug">
          {member.role}
        </p>

        {/* Department Label */}
        {member.department && (
          <span className="mt-2 px-3 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300">
            {member.department}
          </span>
        )}
      </div>

      {/* Smart Side Name & Info Popout Card when Focused or Hovered */}
      {(isActiveFocus || isHovered) && (
        <div
          className={`absolute ${popoutPositionClass} z-[100] pointer-events-none flex flex-col p-4 rounded-2xl bg-black/95 border-2 border-blue-500/70 shadow-[0_15px_45px_rgba(0,0,0,0.95),0_0_35px_rgba(59,130,246,0.45)] whitespace-nowrap animate-in fade-in duration-200`}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            <h5 className="text-sm font-black text-white tracking-tight">{member.name}</h5>
          </div>
          <span className="text-xs font-bold text-blue-400 mt-1">{member.role}</span>
          {member.department && (
            <span className="text-[10px] font-mono text-zinc-400 mt-0.5">{member.department}</span>
          )}
        </div>
      )}

      {/* Handles for connections */}
      <Handle type="target" position={Position.Top} id="target-top" className="!bg-blue-500" />
      <Handle type="target" position={Position.Bottom} id="target-bottom" className="!bg-blue-500" />
      <Handle type="target" position={Position.Left} id="target-left" className="!bg-blue-500" />
      <Handle type="target" position={Position.Right} id="target-right" className="!bg-blue-500" />

      <Handle type="source" position={Position.Top} id="source-top" className="!bg-blue-500" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" className="!bg-blue-500" />
      <Handle type="source" position={Position.Left} id="source-left" className="!bg-blue-500" />
      <Handle type="source" position={Position.Right} id="source-right" className="!bg-blue-500" />
    </div>
  );
}

export default memo(MemberNodeComponent);
