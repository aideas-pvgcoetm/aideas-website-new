'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback, startTransition } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Node,
  Edge,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import CoreNodeComponent from './CoreNode';
import MemberNodeComponent from './MemberNode';
import DataFlowEdgeComponent from './DataFlowEdge';
import ProfileModal from './ProfileModal';
import LeftDataPanel from './LeftDataPanel';
import MobileTeamView from './MobileTeamView';
import { NETWORK_DATA, Member } from './networkData';
import { ActiveNodeContext } from './ActiveNodeContext';
import './network.css';

gsap.registerPlugin(ScrollTrigger);

const nodeTypes = {
  coreNode: CoreNodeComponent,
  memberNode: MemberNodeComponent,
};

const edgeTypes = {
  dataFlow: DataFlowEdgeComponent,
};

// Catmull-Rom C1 smooth spline camera trajectory calculation
function getCatmullRomPoint(
  points: Array<{ x: number; y: number }>,
  t: number
): { x: number; y: number } {
  const count = points.length;
  if (count === 0) return { x: 0, y: 0 };
  if (count === 1) return { x: points[0].x, y: points[0].y };

  const clampedT = Math.max(0, Math.min(count - 1, t));
  const idx = Math.floor(clampedT);
  const frac = clampedT - idx;

  if (idx >= count - 1) return { x: points[count - 1].x, y: points[count - 1].y };

  const p0 = points[Math.max(0, idx - 1)];
  const p1 = points[idx];
  const p2 = points[Math.min(count - 1, idx + 1)];
  const p3 = points[Math.min(count - 1, idx + 2)];

  const f2 = frac * frac;
  const f3 = f2 * frac;

  const x = 0.5 * (
    (2 * p1.x) +
    (-p0.x + p2.x) * frac +
    (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * f2 +
    (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * f3
  );

  const y = 0.5 * (
    (2 * p1.y) +
    (-p0.y + p2.y) * frac +
    (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * f2 +
    (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * f3
  );

  return { x, y };
}

function NetworkFlowContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const viewportElRef = useRef<HTMLElement | null>(null);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeFocusNodeId, setActiveFocusNodeId] = useState<string>('hod');
  const [isFinalPhase, setIsFinalPhase] = useState<boolean>(false);
  const [isTitleVisible, setIsTitleVisible] = useState<boolean>(false);

  const lastActiveIdRef = useRef<string>('hod');
  const isFinalPhaseRef = useRef<boolean>(false);

  // Preload all member photos in GPU memory on component mount
  useEffect(() => {
    const imagesToPreload = [
      NETWORK_DATA.core.logo,
      ...NETWORK_DATA.leadership.map((m) => m.image),
      ...NETWORK_DATA.heads.map((m) => m.image),
    ].filter(Boolean);

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Non-blocking concurrent React transition for active node updates during scroll
  const updateFocusId = useCallback((id: string) => {
    if (lastActiveIdRef.current !== id) {
      lastActiveIdRef.current = id;
      startTransition(() => {
        setActiveFocusNodeId(id);
      });
    }
  }, []);

  // Member select handler
  const handleSelectMember = useCallback((member: Member) => {
    setSelectedMember(member);
  }, []);

  // Map of all members by ID for easy lookup
  const allMembersMap = useMemo(() => {
    const map = new Map<string, Member>();
    NETWORK_DATA.leadership.forEach((m) => map.set(m.id, m));
    NETWORK_DATA.heads.forEach((m) => map.set(m.id, m));
    return map;
  }, []);

  // Currently active focus member object for Left Data Panel
  const activeFocusMember = useMemo(() => {
    if (allMembersMap.has(activeFocusNodeId)) {
      return allMembersMap.get(activeFocusNodeId)!;
    }
    return NETWORK_DATA.leadership[0]; // Default to HOD
  }, [activeFocusNodeId, allMembersMap]);

  // Build static node data with generous vertical gap & balanced wings
  const initialNodes: Node[] = useMemo(() => {
    const nodesList: Node[] = [];

    // 1. Core Root Node: aIDEAS (Top of Center Column)
    nodesList.push({
      id: 'aideas',
      type: 'coreNode',
      position: { x: 132.5, y: 0 },
      data: {
        name: NETWORK_DATA.core.name,
        role: NETWORK_DATA.core.role,
      },
    });

    // 2. Executive Leadership Nodes (Coordinators & GS/JGS placed side-by-side as parallel equals)
    const leadershipPosMap: { [key: string]: { x: number; y: number } } = {
      hod: { x: 200, y: 220 },
      coordinator: { x: -80, y: 440 },   // Faculty Coordinator 1 - Parallel Left
      coordinator2: { x: 480, y: 440 },  // Faculty Coordinator 2 - Parallel Right
      gs: { x: -80, y: 680 },   // General Secretary - Parallel Left
      jgs: { x: 480, y: 680 },  // Joint General Secretary - Parallel Right
    };

    NETWORK_DATA.leadership.forEach((item) => {
      const pos = leadershipPosMap[item.id] || { x: 200, y: 680 };
      nodesList.push({
        id: item.id,
        type: 'memberNode',
        position: pos,
        data: {
          member: item,
          isLeadership: true,
          onSelectMember: handleSelectMember,
        },
      });
    });

    // 3. Department & Team Heads - Balanced wings around GS & JGS (max y: 960)
    const headsLayout: { [key: string]: { x: number; y: number } } = {
      // Left Wing (GS sub-tree: 6 Heads)
      nishi_treasurer: { x: -440, y: 520 },
      arnav_media: { x: -640, y: 660 },
      atharva_media: { x: -640, y: 820 },
      manish_marketing: { x: -440, y: 960 },
      sanket_desig: { x: -220, y: 940 },
      kinjal_desig: { x: -40, y: 920 },

      // Bottom Center & Right Wing (JGS sub-tree: 7 Heads)
      pranshu_em: { x: 200, y: 920 },
      anvi_event: { x: 440, y: 920 },
      kush_marketing: { x: 620, y: 940 },
      priti_edito: { x: 840, y: 960 },
      pk_th: { x: 1040, y: 820 },
      divesh_th: { x: 1040, y: 660 },
      aa_th: { x: 840, y: 520 },
    };

    NETWORK_DATA.heads.forEach((item, index) => {
      const pos = headsLayout[item.id] || { x: (index % 2 === 0 ? -220 : 620), y: 800 };
      nodesList.push({
        id: item.id,
        type: 'memberNode',
        position: pos,
        data: {
          member: item,
          isLeadership: false,
          idleDelayIndex: index,
          onSelectMember: handleSelectMember,
        },
      });
    });

    return nodesList;
  }, [handleSelectMember]);

  // Build connection edges for both Left and Right wings
  const initialEdges: Edge[] = useMemo(() => {
    const edgesList: Edge[] = [];

    // Executive Leadership branching (aIDEAS -> HOD -> Parallel Coordinators -> GS & JGS)
    edgesList.push(
      { id: 'e-aideas-hod', type: 'dataFlow', source: 'aideas', target: 'hod', sourceHandle: 'bottom', targetHandle: 'target-top' },
      { id: 'e-hod-coord', type: 'dataFlow', source: 'hod', target: 'coordinator', sourceHandle: 'source-bottom', targetHandle: 'target-top' },
      { id: 'e-hod-coord2', type: 'dataFlow', source: 'hod', target: 'coordinator2', sourceHandle: 'source-bottom', targetHandle: 'target-top' },
      { id: 'e-coord-gs', type: 'dataFlow', source: 'coordinator', target: 'gs', sourceHandle: 'source-bottom', targetHandle: 'target-top' },
      { id: 'e-coord2-jgs', type: 'dataFlow', source: 'coordinator2', target: 'jgs', sourceHandle: 'source-bottom', targetHandle: 'target-top' }
    );

    // Oval constellation connections: GS connects to Left Wing, JGS connects to Right Wing
    NETWORK_DATA.heads.forEach((head) => {
      const isLeft =
        head.id.includes('nishi') ||
        head.id.includes('arnav') ||
        head.id.includes('atharva') ||
        head.id.includes('manish') ||
        head.id.includes('sanket') ||
        head.id.includes('kinjal');

      const parentExecutiveId = isLeft ? 'gs' : 'jgs';

      edgesList.push({
        id: `e-${parentExecutiveId}-${head.id}`,
        type: 'dataFlow',
        source: parentExecutiveId,
        target: head.id,
        sourceHandle: isLeft ? 'source-left' : 'source-right',
        targetHandle: isLeft ? 'target-right' : 'target-left',
      });
    });

    return edgesList;
  }, []);

  // List of all graph nodes in storytelling tour order matching exact initialNodes coordinates
  const TOUR_NODES = useMemo(
    () => [
      // 1. Executive Leadership Chain
      { id: 'hod', x: 200, y: 220 },
      { id: 'coordinator', x: -80, y: 440 },
      { id: 'coordinator2', x: 480, y: 440 },
      { id: 'gs', x: -80, y: 680 },
      { id: 'jgs', x: 480, y: 680 },

      // 2. Left Wing Tour
      { id: 'nishi_treasurer', x: -440, y: 520 },
      { id: 'arnav_media', x: -640, y: 660 },
      { id: 'atharva_media', x: -640, y: 820 },
      { id: 'manish_marketing', x: -440, y: 960 },
      { id: 'sanket_desig', x: -220, y: 940 },
      { id: 'kinjal_desig', x: -40, y: 920 },

      // 3. Bottom Center & Right Wing Tour
      { id: 'pranshu_em', x: 200, y: 920 },
      { id: 'anvi_event', x: 440, y: 920 },
      { id: 'kush_marketing', x: 620, y: 940 },
      { id: 'priti_edito', x: 840, y: 960 },
      { id: 'aa_th', x: 840, y: 520 },
      { id: 'divesh_th', x: 1040, y: 660 },
      { id: 'pk_th', x: 1040, y: 820 },
    ],
    []
  );

  // Stage Jump Navigation Helper
  const jumpToStage = useCallback((progressFraction: number) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
    const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetY = containerTop + totalHeight * Math.max(0, Math.min(1, progressFraction));
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }, []);

  // GSAP ScrollTrigger binding (uses global Lenis instance from layout.tsx)
  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;

    // Cache viewport element reference once on mount
    viewportElRef.current = document.querySelector('.react-flow__viewport') as HTMLElement;

    // Direct GPU hardware-accelerated viewport transformer (0ms React overhead during scroll)
    const setCam = (targetNodeX: number, targetNodeY: number, zoomVal: number, overrideTargetScreenX?: number) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isDesktop = viewportWidth >= 1024;
      const isMobile = viewportWidth < 640;

      const targetScreenX = overrideTargetScreenX !== undefined
        ? overrideTargetScreenX
        : (isDesktop && !isFinalPhaseRef.current)
        ? (viewportWidth + 490) / 2
        : viewportWidth / 2;

      const targetScreenY = isMobile
        ? (!isFinalPhaseRef.current ? viewportHeight * 0.30 : viewportHeight * 0.45)
        : viewportHeight / 2;

      // Exact React Flow canvas top-left offset formula:
      const x = targetScreenX - targetNodeX * zoomVal;
      const y = targetScreenY - targetNodeY * zoomVal;

      if (!viewportElRef.current) {
        viewportElRef.current = document.querySelector('.react-flow__viewport') as HTMLElement;
      }

      if (viewportElRef.current) {
        viewportElRef.current.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0px) scale(${zoomVal.toFixed(4)})`;
        viewportElRef.current.style.willChange = 'transform';
      }
    };

    // GSAP ScrollTrigger timeline with instant 0.12s tactile tracking & Catmull-Rom spline pathing
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.12,
      onUpdate: (self) => {
        const p = self.progress;

        const isMobile = window.innerWidth < 640;
        const closeZoom = isMobile ? 0.82 : 0.82;
        const fullZoom = isMobile ? 0.22 : 0.38;

        // Phase 1: Guided Close-Up Storytelling Tour (0.00 to 0.85 progress)
        if (p < 0.85) {
          if (isFinalPhaseRef.current) {
            isFinalPhaseRef.current = false;
            setIsFinalPhase(false);
          }
          setIsTitleVisible((prev) => (prev ? false : prev));

          const tourProgress = (p / 0.85) * (TOUR_NODES.length - 1);
          const currIdx = Math.floor(tourProgress);
          const frac = tourProgress - currIdx;

          // Catmull-Rom C1 smooth spline point calculation for 100% fluid camera flow
          const splinePoint = getCatmullRomPoint(TOUR_NODES, tourProgress);
          const rawTargetX = splinePoint.x;
          const targetY = splinePoint.y;

          const targetX = isMobile ? rawTargetX : (200 + (rawTargetX - 200) * 0.45);

          const activeId = TOUR_NODES[frac > 0.5 ? Math.min(TOUR_NODES.length - 1, currIdx + 1) : currIdx].id;
          updateFocusId(activeId);
          setCam(targetX, targetY, closeZoom);
        }
        // Phase 2: Final Reveal - Zoom Out to Full Network Overview (0.85 to 1.00 progress)
        else {
          if (!isFinalPhaseRef.current) {
            isFinalPhaseRef.current = true;
            setIsFinalPhase(true);
          }
          const wantTitle = p >= 0.90;
          setIsTitleVisible((prev) => (prev !== wantTitle ? wantTitle : prev));

          const finalProgress = (p - 0.85) / 0.15;
          const smoothFinal = 0.5 - 0.5 * Math.cos(finalProgress * Math.PI);

          const lastNode = TOUR_NODES[TOUR_NODES.length - 1];
          const lastDampenedX = isMobile ? lastNode.x : (200 + (lastNode.x - 200) * 0.45);

          const viewportWidth = window.innerWidth;
          const rightCenter = (viewportWidth + 490) / 2;
          const screenCenter = viewportWidth / 2;

          const targetScreenX = rightCenter - (rightCenter - screenCenter) * smoothFinal;

          const overviewTargetY = isMobile ? 480 : 150;
          const targetX = lastDampenedX + (200 - lastDampenedX) * smoothFinal;
          const targetY = lastNode.y + (overviewTargetY - lastNode.y) * smoothFinal;
          const zoomVal = closeZoom - (closeZoom - fullZoom) * smoothFinal;

          updateFocusId('');
          setCam(targetX, targetY, zoomVal, targetScreenX);
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [updateFocusId, TOUR_NODES]);

  // Dedicated Mobile Touch Swipe Gesture Handler for Fluid 1:1 Mobile Card Scrolling
  useEffect(() => {
    const el = stickyRef.current;
    if (!el || window.innerWidth >= 640) return;

    let startY = 0;
    let startScrollY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startY = e.touches[0].clientY;
        startScrollY = window.scrollY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const currentY = e.touches[0].clientY;
        const deltaY = startY - currentY;
        window.scrollTo({ top: startScrollY + deltaY * 1.5, behavior: 'auto' });
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  // Handle Hover state on node for dimming unrelated nodes
  const onNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
    setHoveredNodeId(node.id);
    if (allMembersMap.has(node.id)) {
      setActiveFocusNodeId(node.id);
    }
  }, [allMembersMap]);

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
  }, []);

  // Determine stage step number for Left Data Panel
  const stageStep = useMemo(() => {
    if (activeFocusNodeId === 'hod') return 1;
    if (activeFocusNodeId === 'coordinator' || activeFocusNodeId === 'coordinator2') return 2;
    if (activeFocusNodeId === 'gs') return 3;
    if (activeFocusNodeId === 'jgs') return 4;
    return 5;
  }, [activeFocusNodeId]);

  // Active node context value memoization
  const activeNodeContextValue = useMemo(() => ({
    activeFocusNodeId,
    hoveredNodeId,
    isFinalPhase,
  }), [activeFocusNodeId, hoveredNodeId, isFinalPhase]);

  return (
    <ActiveNodeContext.Provider value={activeNodeContextValue}>
      {/* Mobile View: Dedicated Team Directory Card Layout */}
      <div className="block sm:hidden pt-20">
        <MobileTeamView onSelectMember={(m) => setSelectedMember(m)} />
      </div>

      {/* Desktop View: Full 2D ReactFlow Story Graph */}
      <div ref={containerRef} className="hidden sm:block relative w-full h-[400vh] bg-[#020f1c]">
        {/* Sticky Fullscreen Viewport */}
        <div ref={stickyRef} className="sticky top-0 w-full h-[100dvh] overflow-hidden flex flex-col justify-between z-10 bg-[#020f1c]">
          
          {/* Pure #020f1c Background Layer */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#020f1c]">
            {/* Subtle Ambient Radial Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-cyan-600/10 blur-3xl rounded-full pointer-events-none" />
          </div>

          {/* Header Bar Overlay with Category Section Stage Shortcuts */}
          <div className="absolute top-20 lg:top-24 left-0 right-0 z-30 flex flex-wrap items-center justify-between gap-2 px-3 sm:px-12 pointer-events-none">
            {/* Category Section Shortcut Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto bg-[#020f1c]/90 backdrop-blur-md p-1.5 rounded-2xl border border-blue-500/30 shadow-xl overflow-x-auto whitespace-nowrap max-w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <button
                onClick={() => jumpToStage(0.15)}
                className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-mono font-bold transition-all shrink-0 ${
                  activeFocusNodeId === 'gs' || activeFocusNodeId === 'jgs'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/50'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                Leadership
              </button>

              <button
                onClick={() => jumpToStage(0.0)}
                className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-mono font-bold transition-all shrink-0 ${
                  activeFocusNodeId === 'hod' || activeFocusNodeId.includes('coord')
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/50'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                Faculty
              </button>

              <button
                onClick={() => jumpToStage(0.25)}
                className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-mono font-bold transition-all shrink-0 ${
                  activeFocusNodeId === 'nishi_treasurer' || activeFocusNodeId.includes('pranshu') || activeFocusNodeId.includes('anvi')
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/50'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                Events &amp; Finance
              </button>

              <button
                onClick={() => jumpToStage(0.75)}
                className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-mono font-bold transition-all shrink-0 ${
                  activeFocusNodeId.includes('th')
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/50'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                Web &amp; Tech
              </button>

              <button
                onClick={() => jumpToStage(0.40)}
                className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-mono font-bold transition-all shrink-0 ${
                  activeFocusNodeId.includes('marketing')
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/50'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                Marketing
              </button>

              <button
                onClick={() => jumpToStage(0.45)}
                className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-mono font-bold transition-all shrink-0 ${
                  activeFocusNodeId.includes('desig')
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/50'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                Design
              </button>

              <button
                onClick={() => jumpToStage(0.30)}
                className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-mono font-bold transition-all shrink-0 ${
                  activeFocusNodeId.includes('media') || activeFocusNodeId.includes('edito')
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/50'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                Media &amp; Editorial
              </button>

              <button
                onClick={() => jumpToStage(0.95)}
                className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-mono font-bold transition-all shrink-0 ${
                  isFinalPhase
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/50'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                Full Overview
              </button>
            </div>

            <div className="hidden lg:block text-xs font-mono text-zinc-300 bg-black/80 px-4 py-1.5 rounded-full border border-zinc-800 pointer-events-auto shadow-lg">
              Scroll to Travel Through Graph →
            </div>
          </div>

          {/* Main Viewport Container */}
          <div className="relative w-full h-full">
            
            {/* Fullscreen Interactive React Flow Graph Canvas (Base Layer z-0) */}
            <div className="absolute inset-0 w-full h-full z-0" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
              <ReactFlow
                nodes={initialNodes}
                edges={initialEdges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodeMouseEnter={onNodeMouseEnter}
                onNodeMouseLeave={onNodeMouseLeave}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                zoomOnScroll={false}
                panOnScroll={false}
                panOnDrag={false}
                zoomOnDoubleClick={false}
                preventScrolling={false}
                minZoom={0.1}
                maxZoom={1.5}
                onlyRenderVisibleElements={false}
                fitViewOptions={{ padding: 0.1 }}
              >
                <Controls showInteractive={false} className="hidden sm:flex" />
              </ReactFlow>
            </div>

            {/* Floating Left/Bottom Data Panel: Active Focused Member Story & Experience Data */}
            <div className={`absolute bottom-3 sm:bottom-auto sm:top-[150px] lg:top-[160px] left-2 right-2 sm:left-8 sm:right-auto lg:left-10 z-40 transition-all duration-500 ${isFinalPhase ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
              <LeftDataPanel
                stageName={activeFocusMember.role}
                stageStep={stageStep}
                totalSteps={5}
                activeMember={activeFocusMember}
                onOpenModal={(m) => setSelectedMember(m)}
              />
            </div>

            {/* Grand Standalone Header Banner: WE ARE TEAM aIDEAS (Only appears when scroll reaches 90%+) */}
            <div
              className={`absolute top-[160px] sm:top-[165px] lg:top-[170px] left-0 right-0 z-30 flex flex-col items-center justify-center transition-all duration-700 ease-out pointer-events-none ${
                isTitleVisible
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-90 -translate-y-6'
              }`}
            >
              <h1 className="text-xl sm:text-4xl lg:text-5xl font-black font-[family-name:var(--font-orbitron)] tracking-wider text-center px-4 leading-none text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-200 to-purple-400 drop-shadow-[0_0_35px_rgba(59,130,246,0.95)]">
                WE ARE TEAM <span className="lowercase text-cyan-400">a</span>IDEAS
              </h1>

              <p className="text-[8px] sm:text-xs font-semibold font-[family-name:var(--font-orbitron)] text-zinc-300 mt-2 tracking-[0.25em] uppercase text-center drop-shadow-lg opacity-90">
                Artificial Intelligence &amp; Data Science Student Association
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Member Profile Modal on Node/Card Click */}
      <ProfileModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </ActiveNodeContext.Provider>
  );
}

export default function AideasNetwork() {
  return (
    <ReactFlowProvider>
      <NetworkFlowContent />
    </ReactFlowProvider>
  );
}
