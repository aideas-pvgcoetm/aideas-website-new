'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Node,
  Edge,
  Background,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Link from 'next/link';
import { Sparkles, Globe, Network } from 'lucide-react';

import CoreNodeComponent from './CoreNode';
import MemberNodeComponent from './MemberNode';
import DataFlowEdgeComponent from './DataFlowEdge';
import ProfileModal from './ProfileModal';
import LeftDataPanel from './LeftDataPanel';
import { NETWORK_DATA, Member } from './networkData';
import './network.css';

gsap.registerPlugin(ScrollTrigger);

const nodeTypes = {
  coreNode: CoreNodeComponent,
  memberNode: MemberNodeComponent,
};

const edgeTypes = {
  dataFlow: DataFlowEdgeComponent,
};

function NetworkFlowContent() {
  const { setViewport } = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeFocusNodeId, setActiveFocusNodeId] = useState<string>('hod');
  const [isFinalPhase, setIsFinalPhase] = useState<boolean>(false);

  const lastActiveIdRef = useRef<string>('hod');

  // Prevent redundant React re-renders during high-frequency scroll ticks
  const updateFocusId = useCallback((id: string) => {
    if (lastActiveIdRef.current !== id) {
      lastActiveIdRef.current = id;
      setActiveFocusNodeId(id);
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
      position: { x: 200, y: 0 },
      data: {
        name: NETWORK_DATA.core.name,
        role: NETWORK_DATA.core.role,
      },
    });

    // 2. Executive Leadership Nodes (GS & JGS placed side-by-side as parallel equals at y: 950)
    const leadershipPosMap: { [key: string]: { x: number; y: number } } = {
      hod: { x: 200, y: 300 },
      coordinator: { x: 200, y: 600 },
      gs: { x: -20, y: 950 },   // General Secretary - Parallel Left
      jgs: { x: 420, y: 950 },  // Joint General Secretary - Parallel Right
    };

    NETWORK_DATA.leadership.forEach((item) => {
      const pos = leadershipPosMap[item.id] || { x: 200, y: 950 };
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

    // 3. Department & Team Heads - Oval constellation centered around GS & JGS at y: 950
    const headsLayout: { [key: string]: { x: number; y: number } } = {
      // Left Wing (7 Heads)
      nishi_treasurer: { x: -220, y: 950 },
      pranav_treasurer: { x: -480, y: 820 },
      tanvi_edito: { x: -740, y: 1020 },
      priti_edito: { x: -740, y: 1260 },
      arnav_media: { x: -480, y: 1440 },
      atharva_media: { x: -220, y: 1540 },
      manish_marketing: { x: 0, y: 1620 },

      // Right Wing (8 Heads)
      divesh_th: { x: 620, y: 950 },
      aa_th: { x: 880, y: 820 },
      pk_th: { x: 1140, y: 1020 },
      sanket_desig: { x: 1140, y: 1260 },
      kinjal_desig: { x: 880, y: 1440 },
      pranshu_em: { x: 620, y: 1540 },
      anvi_event: { x: 400, y: 1620 },
      kush_marketing: { x: 720, y: 1680 },
    };

    NETWORK_DATA.heads.forEach((item, index) => {
      const pos = headsLayout[item.id] || { x: (index % 2 === 0 ? -220 : 620), y: 950 + index * 90 };
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

    // Executive Leadership branching (aIDEAS -> HOD -> Coordinator -> Parallel split to GS & JGS)
    edgesList.push(
      { id: 'e-aideas-hod', type: 'dataFlow', source: 'aideas', target: 'hod', sourceHandle: 'bottom', targetHandle: 'target-top' },
      { id: 'e-hod-coord', type: 'dataFlow', source: 'hod', target: 'coordinator', sourceHandle: 'source-bottom', targetHandle: 'target-top' },
      { id: 'e-coord-gs', type: 'dataFlow', source: 'coordinator', target: 'gs', sourceHandle: 'source-bottom', targetHandle: 'target-top' },
      { id: 'e-coord-jgs', type: 'dataFlow', source: 'coordinator', target: 'jgs', sourceHandle: 'source-bottom', targetHandle: 'target-top' }
    );

    // Oval constellation connections: GS connects to Left Wing, JGS connects to Right Wing
    NETWORK_DATA.heads.forEach((head) => {
      const isLeft = head.id.includes('nishi') || head.id.includes('pranav') || head.id.includes('tanvi') || head.id.includes('priti') || head.id.includes('arnav') || head.id.includes('atharva') || head.id.includes('manish');
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

  const [nodes] = useState<Node[]>(initialNodes);
  const [edges] = useState<Edge[]>(initialEdges);

  // List of all graph nodes in storytelling tour order (Executive Parallel -> Left Wing -> Right Wing -> Overview)
  const TOUR_NODES = useMemo(
    () => [
      // 1. Executive Leadership Chain (HOD -> Coordinator -> GS & JGS Parallel Equals)
      { id: 'hod', x: 200, y: 300 },
      { id: 'coordinator', x: 200, y: 600 },
      { id: 'gs', x: -20, y: 950 },
      { id: 'jgs', x: 420, y: 950 },

      // 2. Left Wing Semi-Circle Tour (connected from GS)
      { id: 'pranav_treasurer', x: -480, y: 820 },
      { id: 'nishi_treasurer', x: -220, y: 950 },
      { id: 'tanvi_edito', x: -740, y: 1020 },
      { id: 'priti_edito', x: -740, y: 1260 },
      { id: 'arnav_media', x: -480, y: 1440 },
      { id: 'atharva_media', x: -220, y: 1540 },
      { id: 'manish_marketing', x: 0, y: 1620 },

      // 3. Right Wing Semi-Circle Tour (connected from JGS)
      { id: 'anvi_event', x: 400, y: 1620 },
      { id: 'pranshu_em', x: 620, y: 1540 },
      { id: 'kinjal_desig', x: 880, y: 1440 },
      { id: 'sanket_desig', x: 1140, y: 1260 },
      { id: 'pk_th', x: 1140, y: 1020 },
      { id: 'aa_th', x: 880, y: 820 },
      { id: 'divesh_th', x: 620, y: 950 },
      { id: 'kush_marketing', x: 720, y: 1680 },
    ],
    []
  );

  // GSAP ScrollTrigger + Lenis smooth momentum scroll binding
  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;

    // Initialize Lenis smooth scroll engine
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    // Helper to calculate camera viewport center smoothly aligned with right workspace
    const setCam = (targetNodeX: number, targetNodeY: number, zoomVal: number) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isDesktop = viewportWidth >= 1024;
      const isMobile = viewportWidth < 640;

      // On desktop, LeftDataPanel takes ~380px on the left.
      // Right workspace screen center X is (viewportWidth + 380) / 2
      const targetScreenX = isDesktop ? (viewportWidth + 380) / 2 : viewportWidth / 2;
      const targetScreenY = isMobile ? viewportHeight * 0.55 : viewportHeight / 2;

      // Exact React Flow canvas top-left offset formula:
      const x = targetScreenX - targetNodeX * zoomVal;
      const y = targetScreenY - targetNodeY * zoomVal;

      // Duration 0 is critical for smooth 60fps GSAP scroll scrubbing!
      setViewport({ x, y, zoom: zoomVal }, { duration: 0 });
    };

    // GSAP ScrollTrigger timeline
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;
        const isMobile = window.innerWidth < 640;
        const closeZoom = isMobile ? 0.65 : 0.88;
        const fullZoom = isMobile ? 0.40 : 0.52;

        // Phase 1: Guided Close-Up Storytelling Tour (0.00 to 0.85 progress)
        if (p < 0.85) {
          setIsFinalPhase(false);
          const tourProgress = (p / 0.85) * (TOUR_NODES.length - 1);
          const currIdx = Math.floor(tourProgress);
          const nextIdx = Math.min(TOUR_NODES.length - 1, currIdx + 1);
          const frac = tourProgress - currIdx;

          const currNode = TOUR_NODES[currIdx];
          const nextNode = TOUR_NODES[nextIdx];

          const targetX = currNode.x + (nextNode.x - currNode.x) * frac;
          const targetY = currNode.y + (nextNode.y - currNode.y) * frac;

          updateFocusId(currNode.id);
          setCam(targetX, targetY, closeZoom);
        }
        // Phase 2: Final Reveal - Zoom Out to Full Network Overview (0.85 to 1.00 progress)
        else {
          setIsFinalPhase(true);
          const finalProgress = (p - 0.85) / 0.15;
          const lastNode = TOUR_NODES[TOUR_NODES.length - 1];

          // Smoothly transition camera from last tour node to graph center (200, 1250) and zoom out
          const targetX = lastNode.x + (200 - lastNode.x) * finalProgress;
          const targetY = lastNode.y + (1250 - lastNode.y) * finalProgress;
          const zoomVal = closeZoom - (closeZoom - fullZoom) * finalProgress;

          updateFocusId('gs');
          setCam(targetX, targetY, zoomVal);
        }
      },
    });

    return () => {
      st.kill();
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, [setViewport, updateFocusId, TOUR_NODES]);

  // Handle Hover state on node for dimming unrelated nodes
  const onNodeMouseEnter = (_: React.MouseEvent, node: Node) => {
    setHoveredNodeId(node.id);
    if (allMembersMap.has(node.id)) {
      setActiveFocusNodeId(node.id);
    }
  };

  const onNodeMouseLeave = () => {
    setHoveredNodeId(null);
  };

  // Update nodes & edges display state based on activeFocusNodeId and hoveredNodeId
  const displayNodes = useMemo(() => {
    return nodes.map((node) => {
      const isFocused = node.id === activeFocusNodeId;
      const isHovered = node.id === hoveredNodeId;

      let isDimmed = false;
      if (hoveredNodeId) {
        const isConnected =
          node.id === hoveredNodeId ||
          edges.some(
            (e) =>
              (e.source === hoveredNodeId && e.target === node.id) ||
              (e.target === hoveredNodeId && e.source === node.id)
          );
        isDimmed = !isConnected;
      } else if (isFinalPhase) {
        isDimmed = false; // In final reveal, all cards light up together!
      } else {
        // Dim all non-focused background cards during scroll tour so focused card pops out!
        isDimmed = !isFocused;
      }

      return {
        ...node,
        data: {
          ...node.data,
          isActiveFocus: isFocused,
          isHovered,
          isDimmed,
        },
      };
    });
  }, [nodes, edges, activeFocusNodeId, hoveredNodeId, isFinalPhase]);

  const displayEdges = useMemo(() => {
    const focusId = hoveredNodeId || activeFocusNodeId;
    if (!focusId || isFinalPhase) return edges;

    return edges.map((e) => {
      const isConnected = e.source === focusId || e.target === focusId;
      return {
        ...e,
        className: isConnected ? 'highlighted' : 'dimmed',
      };
    });
  }, [edges, hoveredNodeId, activeFocusNodeId, isFinalPhase]);

  // Determine stage step number for Left Data Panel
  const stageStep = useMemo(() => {
    if (activeFocusNodeId === 'hod') return 1;
    if (activeFocusNodeId === 'coordinator') return 2;
    if (activeFocusNodeId === 'jgs') return 3;
    if (activeFocusNodeId === 'gs') return 4;
    return 5;
  }, [activeFocusNodeId]);

  return (
    <div ref={containerRef} className="relative w-full h-[400vh] bg-[#050505]">
      {/* Sticky Fullscreen Viewport */}
      <div ref={stickyRef} className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between">
        
        {/* Compact Header Bar Overlay */}
        <div className="absolute top-14 left-0 right-0 z-30 flex flex-wrap items-center justify-between gap-4 px-6 sm:px-12 pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/40 bg-black/90 text-blue-300 text-xs font-semibold uppercase tracking-widest shadow-lg backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>aIDEAS Team Network</span>
            </div>

            {/* View Switcher Pill */}
            <div className="inline-flex items-center bg-zinc-950/90 border border-zinc-800 rounded-full p-1 shadow-xl backdrop-blur-md text-xs font-medium">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white font-semibold shadow-md">
                <Network className="w-3.5 h-3.5 text-blue-200" />
                2D Story Graph
              </span>
              <Link
                href="/members-globe"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-zinc-400 hover:text-purple-300 hover:bg-purple-950/40 transition-all duration-200"
              >
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                3D World Globe
              </Link>
            </div>
          </div>

          <div className="hidden sm:block text-xs font-mono text-zinc-300 bg-black/80 px-4 py-1.5 rounded-full border border-zinc-800">
            Scroll to Travel Through Graph →
          </div>
        </div>

        {/* Split-Screen Main Content: Left Data Panel & Right Graph Canvas */}
        <div className="relative w-full h-full flex flex-col lg:flex-row items-center pt-24 pb-12 px-4 sm:px-8">
          
          {/* Left Side Panel: Active Focused Member Story & Experience Data */}
          <div className="lg:absolute lg:left-10 lg:top-28 lg:z-40 mb-4 lg:mb-0 w-full lg:w-auto">
            <LeftDataPanel
              stageName={activeFocusMember.role}
              stageStep={stageStep}
              totalSteps={5}
              activeMember={activeFocusMember}
              onOpenModal={(m) => setSelectedMember(m)}
            />
          </div>

          {/* Right Side: Interactive React Flow Graph Canvas */}
          <div className="w-full h-full flex-1">
            <ReactFlow
              nodes={displayNodes}
              edges={displayEdges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodeMouseEnter={onNodeMouseEnter}
              onNodeMouseLeave={onNodeMouseLeave}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              zoomOnScroll={false}
              panOnScroll={false}
              doubleClickZoom={false}
              preventScrolling={false}
              fitViewOptions={{ padding: 0.1 }}
              className="w-full h-full"
            >
              <Background color="#3b82f6" gap={36} size={1} style={{ opacity: 0.08 }} />
              <Controls showInteractive={false} className="!bg-black !border-zinc-800 !fill-blue-400" />
            </ReactFlow>
          </div>

        </div>

        {/* Bottom Footer Bar */}
        <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center pointer-events-none">
          <div className="px-5 py-1.5 rounded-full bg-black/90 border border-blue-500/40 text-blue-300 text-xs font-bold tracking-wider shadow-2xl backdrop-blur-md">
            Connected Community. One Network.
          </div>
        </div>
      </div>

      {/* Member Profile Modal on Node Click */}
      <ProfileModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}

export default function AideasNetwork() {
  return (
    <ReactFlowProvider>
      <NetworkFlowContent />
    </ReactFlowProvider>
  );
}
