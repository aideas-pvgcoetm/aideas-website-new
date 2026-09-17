"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface CommunityNetworkProps {
  isTriggered: boolean;
}

export default function CommunityNetwork({ isTriggered }: CommunityNetworkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Active path cycling state
  const [pathIndex, setPathIndex] = useState(0);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  // Viewport visibility observer to pause animation when off-screen
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Center visual anchor: aiDEAS
  const centerNode = { id: "center", label: "aiDEAS", x: 230, y: 130 };

  // 6 Primary Outer Nodes arranged with intentional, organic spacing
  const primaryNodes = [
    {
      id: "ai",
      label: "AI",
      x: 100,
      y: 62,
      labelX: 100,
      labelY: 42,
      accent: "cyan",
      role: "Machine Intelligence",
    },
    {
      id: "nlp",
      label: "NLP",
      x: 285,
      y: 42,
      labelX: 285,
      labelY: 24,
      accent: "purple",
      role: "Language Models",
    },
    {
      id: "cv",
      label: "COMPUTER VISION",
      x: 380,
      y: 82,
      labelX: 380,
      labelY: 62,
      accent: "cyan",
      role: "Spatial & Image AI",
    },
    {
      id: "cloud",
      label: "CLOUD",
      x: 370,
      y: 195,
      labelX: 370,
      labelY: 220,
      accent: "purple",
      role: "Distributed Systems",
    },
    {
      id: "ds",
      label: "DATA SCIENCE",
      x: 195,
      y: 226,
      labelX: 195,
      labelY: 248,
      accent: "cyan",
      role: "Analytics & Statistics",
    },
    {
      id: "ml",
      label: "ML",
      x: 75,
      y: 165,
      labelX: 75,
      labelY: 190,
      accent: "purple",
      role: "Core Algorithms",
    },
  ];

  // PRIMARY CONNECTIONS: Direct radial links from center (aiDEAS) to each domain
  const primaryLinks = primaryNodes.map((n) => ({
    key: `center-${n.id}`,
    from: "center",
    to: n.id,
    x1: centerNode.x,
    y1: centerNode.y,
    x2: n.x,
    y2: n.y,
    accent: n.accent,
  }));

  // SECONDARY CONNECTIONS: Inter-domain relationships
  const secondaryLinks = [
    { key: "ai-cv", from: "ai", to: "cv", x1: 100, y1: 62, x2: 380, y2: 82 },
    { key: "nlp-ai", from: "nlp", to: "ai", x1: 285, y1: 42, x2: 100, y2: 62 },
    { key: "nlp-cv", from: "nlp", to: "cv", x1: 285, y1: 42, x2: 380, y2: 82 },
    { key: "cv-cloud", from: "cv", to: "cloud", x1: 380, y1: 82, x2: 370, y2: 195 },
    { key: "cloud-ds", from: "cloud", to: "ds", x1: 370, y1: 195, x2: 195, y2: 226 },
    { key: "ds-ml", from: "ds", to: "ml", x1: 195, y1: 226, x2: 75, y2: 165 },
    { key: "ml-ai", from: "ml", to: "ai", x1: 75, y1: 165, x2: 100, y2: 62 },
  ];

  // BACKGROUND / TERTIARY CHORDS (very faint depth lines)
  const tertiaryLinks = [
    { key: "ml-cv", x1: 75, y1: 165, x2: 380, y2: 82 },
    { key: "nlp-ds", x1: 285, y1: 42, x2: 195, y2: 226 },
  ];

  // Active path sequences for Linear-style choreographed focus
  const activePathSequences = [
    {
      id: "seq-ai-cv",
      primaryNodeId: "ai",
      activeNodeIds: ["ai", "cv"],
      activeLineKeys: ["center-ai", "ai-cv", "center-cv"],
      focusedDomain: "AI → Computer Vision",
      statHighlight: "DOMAINS",
    },
    {
      id: "seq-nlp",
      primaryNodeId: "nlp",
      activeNodeIds: ["nlp"],
      activeLineKeys: ["center-nlp"],
      focusedDomain: "Natural Language Processing",
      statHighlight: "PROJECTS",
    },
    {
      id: "seq-ml-ds",
      primaryNodeId: "ml",
      activeNodeIds: ["ml", "ds"],
      activeLineKeys: ["center-ml", "ds-ml", "center-ds"],
      focusedDomain: "ML → Data Science",
      statHighlight: "MEMBERS",
    },
    {
      id: "seq-cloud",
      primaryNodeId: "cloud",
      activeNodeIds: ["cloud"],
      activeLineKeys: ["center-cloud", "cv-cloud"],
      focusedDomain: "Cloud Infrastructure",
      statHighlight: "DOMAINS",
    },
  ];

  // Slow, calm automatic cycling between paths (~5.2s per path)
  useEffect(() => {
    if (!isTriggered || !isVisible || hoveredNodeId !== null || prefersReducedMotion) {
      return;
    }

    const interval = setInterval(() => {
      setPathIndex((prev) => (prev + 1) % activePathSequences.length);
    }, 5200);

    return () => clearInterval(interval);
  }, [isTriggered, isVisible, hoveredNodeId, prefersReducedMotion, activePathSequences.length]);

  // Compute active nodes and lines based on hover or current sequence
  const currentSeq = activePathSequences[pathIndex];

  const activeNodeIds = hoveredNodeId
    ? [hoveredNodeId]
    : currentSeq.activeNodeIds;

  const primaryActiveNode = hoveredNodeId
    ? primaryNodes.find((n) => n.id === hoveredNodeId) || primaryNodes[0]
    : primaryNodes.find((n) => n.id === currentSeq.primaryNodeId) || primaryNodes[0];

  const activeLineKeys = hoveredNodeId
    ? [
        `center-${hoveredNodeId}`,
        ...secondaryLinks
          .filter((l) => l.from === hoveredNodeId || l.to === hoveredNodeId)
          .map((l) => l.key),
      ]
    : currentSeq.activeLineKeys;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={isTriggered ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.97 }}
      transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
      className="community-container w-full rounded-2xl border border-[rgba(255,255,255,0.09)] bg-[#131824] p-3.5 sm:p-4 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.85)] font-sans text-left relative overflow-hidden"
    >
      {/* Subtle background ambient sheen */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(56,209,255,0.08)_0%,transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(176,107,255,0.06)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      {/* Frame Header Bar */}
      <div className="community-header flex items-center justify-between border-b border-[rgba(255,255,255,0.07)] pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.2)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.12)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.12)]" />
          </div>
          <span className="text-[11px] font-mono text-[var(--text-faint)] ml-2 tracking-wide flex items-center gap-1.5">
            <span className="text-[var(--cyan-bright)]">aiDEAS</span>
            <span className="opacity-40">{"//"}</span>
            <span>STUDENT NETWORK</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(56,209,255,0.08)] px-2.5 py-0.5 text-[10px] font-mono text-[var(--cyan-bright)] border border-[rgba(56,209,255,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-90" />
            ACTIVE GRAPH
          </span>
        </div>
      </div>

      {/* Metadata Metrics Strip with Subtle Focus Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={isTriggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid grid-cols-3 gap-2 mb-2.5"
      >
        <div
          className={`community-card rounded-lg border px-2.5 py-1.5 flex items-center justify-between font-mono text-[11px] transition-all duration-400 ${
            currentSeq.statHighlight === "MEMBERS"
              ? "community-card-active border-[rgba(56,209,255,0.3)] bg-[#1a2336] shadow-[0_0_12px_-4px_rgba(56,209,255,0.25)]"
              : "border-[rgba(255,255,255,0.05)] bg-[#151b28]/60"
          }`}
        >
          <span className="text-[var(--text-faint)] text-[10px] tracking-wider uppercase">MEMBERS</span>
          <span className="text-[var(--cyan-bright)] font-bold">42</span>
        </div>

        <div
          className={`community-card rounded-lg border px-2.5 py-1.5 flex items-center justify-between font-mono text-[11px] transition-all duration-400 ${
            currentSeq.statHighlight === "DOMAINS"
              ? "community-card-active border-[rgba(176,107,255,0.3)] bg-[#211f35] shadow-[0_0_12px_-4px_rgba(176,107,255,0.25)]"
              : "border-[rgba(255,255,255,0.05)] bg-[#151b28]/60"
          }`}
        >
          <span className="text-[var(--text-faint)] text-[10px] tracking-wider uppercase">DOMAINS</span>
          <span className="text-[var(--purple-bright)] font-bold">7</span>
        </div>

        <div
          className={`community-card rounded-lg border px-2.5 py-1.5 flex items-center justify-between font-mono text-[11px] transition-all duration-400 ${
            currentSeq.statHighlight === "PROJECTS"
              ? "community-card-active border-[rgba(56,209,255,0.3)] bg-[#1a2336] shadow-[0_0_12px_-4px_rgba(56,209,255,0.25)]"
              : "border-[rgba(255,255,255,0.05)] bg-[#151b28]/60"
          }`}
        >
          <span className="text-[var(--text-faint)] text-[10px] tracking-wider uppercase">PROJECTS</span>
          <span className="text-white community-footer-text font-bold">18</span>
        </div>
      </motion.div>

      {/* SVG Network Visualization */}
      <div className="community-svg-wrap relative w-full rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0d121e] p-2 overflow-hidden">
        {/* Active path label pill inside the network display */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan-bright)] opacity-80" />
          <span className="text-[9.5px] font-mono text-[var(--text-faint)] tracking-wider uppercase">
            PATH:{" "}
            <span className="text-white/90 font-medium">
              {hoveredNodeId
                ? `FOCUS // ${primaryActiveNode.label} (${primaryActiveNode.role})`
                : currentSeq.focusedDomain}
            </span>
          </span>
        </div>

        <svg viewBox="0 0 460 260" className="w-full h-auto max-h-[260px] overflow-visible select-none">
          <defs>
            <linearGradient id="centerCoreGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38d1ff" />
              <stop offset="100%" stopColor="#b06bff" />
            </linearGradient>

            <filter id="subtleCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38d1ff" floodOpacity="0.6" />
            </filter>
            <filter id="subtlePurpleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#b06bff" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* 1. TERTIARY / BACKGROUND CHORDS (Extremely faint) */}
          {tertiaryLinks.map((line, i) => (
            <motion.line
              key={`tertiary-${line.key}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
              strokeDasharray="2 3"
              initial={{ opacity: 0 }}
              animate={isTriggered ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.45 + i * 0.05 }}
            />
          ))}

          {/* 2. SECONDARY CONNECTIONS (Inter-domain relationships) */}
          {secondaryLinks.map((line) => {
            const isLineActive = activeLineKeys.includes(line.key);
            return (
              <motion.line
                key={`secondary-${line.key}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={isLineActive ? "rgba(56,209,255,0.75)" : "rgba(255,255,255,0.08)"}
                strokeWidth={isLineActive ? 1.6 : 1}
                strokeDasharray={isLineActive ? "none" : "3 3"}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isTriggered ? { pathLength: 1, opacity: isLineActive ? 1 : 0.55 } : { opacity: 0 }}
                transition={{ duration: 0.75, delay: 0.35, ease: "easeOut" }}
                style={{
                  transition: "stroke 0.4s ease, stroke-width 0.4s ease, opacity 0.4s ease",
                }}
              />
            );
          })}

          {/* 3. PRIMARY RADIAL CONNECTIONS (aiDEAS center to domains) */}
          {primaryLinks.map((line, i) => {
            const isLineActive = activeLineKeys.includes(line.key);
            const isCyan = line.accent === "cyan";

            return (
              <motion.line
                key={`primary-${line.key}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={
                  isLineActive
                    ? isCyan
                      ? "rgba(56,209,255,0.9)"
                      : "rgba(176,107,255,0.9)"
                    : isCyan
                    ? "rgba(56,209,255,0.22)"
                    : "rgba(176,107,255,0.22)"
                }
                strokeWidth={isLineActive ? 1.8 : 1.25}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isTriggered ? { pathLength: 1, opacity: isLineActive ? 1 : 0.45 } : { opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.04, ease: "easeOut" }}
                style={{
                  transition: "stroke 0.4s ease, stroke-width 0.4s ease, opacity 0.4s ease",
                }}
              />
            );
          })}

          {/* 4. SUBTLE SIGNAL TRAVELING ALONG ACTIVE PRIMARY PATH */}
          {!prefersReducedMotion && isTriggered && isVisible && (
            <motion.circle
              key={`pulse-${primaryActiveNode.id}-${pathIndex}`}
              r={2.6}
              fill={primaryActiveNode.accent === "cyan" ? "#38d1ff" : "#b06bff"}
              initial={{ cx: centerNode.x, cy: centerNode.y, opacity: 0 }}
              animate={{
                cx: [centerNode.x, primaryActiveNode.x],
                cy: [centerNode.y, primaryActiveNode.y],
                opacity: [0, 0.95, 0],
              }}
              transition={{
                duration: 1.8,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 2.8,
              }}
              style={{
                filter: `drop-shadow(0 0 4px ${
                  primaryActiveNode.accent === "cyan" ? "#38d1ff" : "#b06bff"
                })`,
              }}
            />
          )}

          {/* 5. CENTER NODE (aiDEAS - Visual Anchor) */}
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={isTriggered ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: `${centerNode.x}px ${centerNode.y}px` }}
          >
            {/* Outermost faint ambient ring */}
            <circle
              cx={centerNode.x}
              cy={centerNode.y}
              r={46}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
            {/* Inner faint ring with slow breath */}
            <motion.circle
              cx={centerNode.x}
              cy={centerNode.y}
              r={36}
              fill="rgba(56,209,255,0.03)"
              stroke="rgba(56,209,255,0.18)"
              strokeWidth="1"
              animate={
                !prefersReducedMotion && isTriggered
                  ? { r: [36, 38, 36], opacity: [0.7, 0.9, 0.7] }
                  : { r: 36, opacity: 0.7 }
              }
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Center Anchor Base Disc */}
            <circle
              cx={centerNode.x}
              cy={centerNode.y}
              r={24}
              fill="#131926"
              stroke="url(#centerCoreGrad)"
              strokeWidth="1.5"
              filter="drop-shadow(0 0 8px rgba(56,209,255,0.25))"
              className="community-center-disc"
            />
            {/* aiDEAS Branding Label */}
            <text
              x={centerNode.x}
              y={centerNode.y + 4}
              textAnchor="middle"
              fontSize="11"
              fontFamily="var(--font-display), sans-serif"
              fontWeight="800"
              letterSpacing="0.06em"
              className="pointer-events-none"
            >
              <tspan fill="#38d1ff">ai</tspan>
              <tspan fill="#b06bff">DEAS</tspan>
            </text>
          </motion.g>

          {/* 6. PRIMARY DOMAIN NODES */}
          {primaryNodes.map((n, i) => {
            const isCyan = n.accent === "cyan";
            const isActive = activeNodeIds.includes(n.id);
            const isHovered = hoveredNodeId === n.id;

            return (
              <motion.g
                key={n.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={isTriggered ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.26 + i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  transformOrigin: `${n.x}px ${n.y}px`,
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredNodeId(n.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={() => setHoveredNodeId(hoveredNodeId === n.id ? null : n.id)}
              >
                {/* Hit target helper */}
                <circle cx={n.x} cy={n.y} r={22} fill="transparent" />

                {/* Outer halo / ring - active state contrast */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={isActive ? (isHovered ? 17 : 15) : 13}
                  className={!isActive ? "community-node-halo-inactive" : ""}
                  fill={
                    isActive
                      ? isCyan
                        ? "rgba(56,209,255,0.12)"
                        : "rgba(176,107,255,0.12)"
                      : "rgba(255,255,255,0.02)"
                  }
                  stroke={
                    isActive
                      ? isCyan
                        ? "rgba(56,209,255,0.7)"
                        : "rgba(176,107,255,0.7)"
                      : "rgba(255,255,255,0.15)"
                  }
                  strokeWidth={isActive ? 1.5 : 1}
                  style={{
                    transition: "r 0.35s ease, stroke 0.35s ease, fill 0.35s ease",
                  }}
                />

                {/* Core node dot */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={isActive ? 4.2 : 3.2}
                  fill={isCyan ? "#38d1ff" : "#b06bff"}
                  opacity={isActive ? 1 : 0.45}
                  filter={
                    isActive
                      ? isCyan
                        ? "url(#subtleCyanGlow)"
                        : "url(#subtlePurpleGlow)"
                      : "none"
                  }
                  style={{
                    transition: "r 0.35s ease, opacity 0.35s ease",
                  }}
                />

                {/* Technical Node Label */}
                <text
                  x={n.labelX}
                  y={n.labelY}
                  textAnchor="middle"
                  className="community-node-label"
                  fill={
                    isActive
                      ? isCyan
                        ? "#9ae6fd"
                        : "#dcbaff"
                      : "rgba(255,255,255,0.45)"
                  }
                  fontSize="9.5"
                  fontFamily="ui-monospace, monospace"
                  fontWeight={isActive ? "700" : "500"}
                  letterSpacing="0.05em"
                  style={{
                    transition: "fill 0.35s ease, font-weight 0.35s ease",
                  }}
                >
                  {n.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Frame Bottom Console Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isTriggered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="community-footer mt-2.5 pt-2 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between text-[10px] font-mono text-[var(--text-faint)]"
      >
        <span className="flex items-center gap-1.5 truncate">
          <span className="text-[var(--cyan-bright)]">●</span>
          <span>Cross-year peer mentorship</span>
          <span className="text-[rgba(255,255,255,0.2)]">•</span>
          <span className="text-white/80 community-footer-text">PVGCOET AI & DS Chapter</span>
        </span>
        <span className="hidden sm:inline text-[var(--text-faint)] opacity-60 ml-2 shrink-0">
          Weekly Syncs
        </span>
      </motion.div>
    </motion.div>
  );
}
