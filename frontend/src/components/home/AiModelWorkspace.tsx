"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AiModelWorkspaceProps {
  isTriggered: boolean;
}

export default function AiModelWorkspace({ isTriggered }: AiModelWorkspaceProps) {
  // Baseline training metrics
  const [metrics, setMetrics] = useState({
    epoch: 1,
    accuracy: 68.2,
    loss: 0.385,
    progressText: 0,
    isReady: false,
  });

  // Interactive Loss Decay state
  const [isHoveringLoss, setIsHoveringLoss] = useState(false);
  const [interactiveLoss, setInteractiveLoss] = useState<number | null>(null);
  const [probeRatio, setProbeRatio] = useState<number>(0.8);
  const lossSvgRef = useRef<SVGSVGElement>(null);

  // Model Network: subtle low-frequency organic drift state (every ~3.8s)
  const [networkStep, setNetworkStep] = useState(0);
  const [isHoveringModel, setIsHoveringModel] = useState(false);

  // Stepwise training animation on scroll entrance
  useEffect(() => {
    if (!isTriggered) return;

    const steps = [
      { delay: 180, data: { epoch: 9, accuracy: 77.4, loss: 0.285, progressText: 18, isReady: false } },
      { delay: 420, data: { epoch: 19, accuracy: 84.1, loss: 0.198, progressText: 38, isReady: false } },
      { delay: 700, data: { epoch: 28, accuracy: 90.3, loss: 0.134, progressText: 56, isReady: false } },
      { delay: 950, data: { epoch: 34, accuracy: 93.6, loss: 0.096, progressText: 68, isReady: false } },
      { delay: 1180, data: { epoch: 37, accuracy: 94.7, loss: 0.083, progressText: 74, isReady: true } },
    ];

    const timers = steps.map((step) =>
      setTimeout(() => {
        setMetrics(step.data);
      }, step.delay)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isTriggered]);

  // Occasional low-frequency network drift (only while section is triggered/visible)
  useEffect(() => {
    if (!isTriggered) return;

    const interval = setInterval(() => {
      setNetworkStep((prev) => (prev + 1) % 4);
    }, 3600);

    return () => clearInterval(interval);
  }, [isTriggered]);

  // Node position variations for organic slow movement (±1.5px subtle drift)
  const driftOffsets = [
    // Step 0: baseline
    [
      { dx: 0, dy: 0 }, { dx: 0, dy: 0 }, { dx: 0, dy: 0 },
      { dx: 0, dy: 0 }, { dx: 0, dy: 0 }, { dx: 0, dy: 0 },
      { dx: 0, dy: 0 }, { dx: 0, dy: 0 }
    ],
    // Step 1: slight upward drift in hidden layer
    [
      { dx: 0.5, dy: -0.8 }, { dx: -0.4, dy: 0.6 }, { dx: 0.6, dy: -0.5 },
      { dx: -0.8, dy: -1.2 }, { dx: 0.9, dy: 0.8 }, { dx: -0.6, dy: -1.0 },
      { dx: 0.5, dy: 0.8 }, { dx: -0.4, dy: -0.7 }
    ],
    // Step 2: slight contraction
    [
      { dx: -0.6, dy: 0.5 }, { dx: 0.5, dy: -0.6 }, { dx: -0.4, dy: 0.7 },
      { dx: 0.6, dy: 0.9 }, { dx: -0.7, dy: -0.8 }, { dx: 0.8, dy: 0.6 },
      { dx: -0.6, dy: -0.6 }, { dx: 0.5, dy: 0.9 }
    ],
    // Step 3: gentle expansion
    [
      { dx: 0.4, dy: -0.5 }, { dx: -0.5, dy: 0.4 }, { dx: 0.3, dy: -0.6 },
      { dx: -0.5, dy: 0.7 }, { dx: 0.6, dy: -0.6 }, { dx: -0.4, dy: 0.8 },
      { dx: 0.4, dy: 0.5 }, { dx: -0.5, dy: -0.5 }
    ]
  ];

  const currentOffsets = driftOffsets[networkStep];

  // Base coordinates for the 8 nodes
  const baseNodes = [
    { x: 20, y: 5 },  // 0: Input 1
    { x: 20, y: 12 }, // 1: Input 2
    { x: 20, y: 19 }, // 2: Input 3
    { x: 80, y: 3 },  // 3: Hidden 1
    { x: 80, y: 12 }, // 4: Hidden 2
    { x: 80, y: 21 }, // 5: Hidden 3
    { x: 140, y: 8 }, // 6: Output 1
    { x: 140, y: 16 } // 7: Output 2
  ];

  // Compute actual coordinates with organic drift + hover response
  const activeNodes = baseNodes.map((node, i) => {
    const drift = currentOffsets[i];
    const hoverShiftX = isHoveringModel ? (i < 3 ? 0.8 : i < 6 ? 0 : -0.8) : 0;
    const hoverShiftY = isHoveringModel ? (i % 2 === 0 ? -0.7 : 0.7) : 0;
    return {
      x: node.x + drift.dx + hoverShiftX,
      y: node.y + drift.dy + hoverShiftY
    };
  });

  // Connections between nodes
  const connections = [
    [0, 3], [0, 4],
    [1, 3], [1, 4], [1, 5],
    [2, 4], [2, 5],
    [3, 6],
    [4, 6], [4, 7],
    [5, 7]
  ];

  // Handle Loss Decay Graph interaction
  const handleLossMouseMove = (e: React.MouseEvent<SVGSVGElement | HTMLDivElement>) => {
    if (!lossSvgRef.current) return;
    const rect = lossSvgRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setProbeRatio(ratio);

    // Realistic loss decay curve value calculation:
    // When scrubbing left (earlier epochs) loss is slightly higher (e.g. 0.096)
    // When scrubbing right (later convergence) loss is lower (e.g. 0.074)
    // Baseline at convergence is 0.083
    const calculatedLoss = parseFloat((0.098 - ratio * 0.026).toFixed(3));
    setInteractiveLoss(calculatedLoss);
  };

  const handleLossMouseLeave = () => {
    setIsHoveringLoss(false);
    setInteractiveLoss(null);
    setProbeRatio(0.8);
  };

  // Currently displayed loss (interactive value or converged metrics value)
  const displayedLoss =
    isHoveringLoss && interactiveLoss !== null
      ? interactiveLoss.toFixed(3)
      : metrics.loss.toFixed(3);

  // Dynamic SVG loss curve path based on hover probe
  const probeX = 160 * probeRatio;
  // Curve equation: y = 5 + (probeRatio^0.65) * 14
  const probeY = 5 + Math.pow(probeRatio, 0.7) * 14;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={isTriggered ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 22, scale: 0.98 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
      className="ai-workspace-container w-full rounded-2xl border border-[rgba(255,255,255,0.11)] bg-[#151922] p-3.5 sm:p-4 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.85)] font-sans text-left relative overflow-hidden transition-colors duration-300"
    >
      {/* Subtle background ambient sheen */}
      <div
        className="pointer-events-none absolute -top-20 -right-20 w-52 h-52 rounded-full bg-[radial-gradient(circle,rgba(56,209,255,0.08)_0%,transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 w-52 h-52 rounded-full bg-[radial-gradient(circle,rgba(176,107,255,0.06)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      {/* Frame Header Bar */}
      <div className="ai-workspace-header flex items-center justify-between border-b border-[rgba(255,255,255,0.07)] pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.22)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.14)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.14)]" />
          </div>
          <span className="text-[11px] font-mono text-[var(--text-faint)] ml-2 tracking-wide flex items-center gap-1.5">
            <span className="text-[var(--cyan-bright)]">aiDEAS</span>
            <span className="opacity-40">/</span>
            <span>pipeline.py</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(56,209,255,0.09)] px-2.5 py-0.5 text-[10px] font-mono text-[var(--cyan-bright)] border border-[rgba(56,209,255,0.22)]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                metrics.isReady
                  ? "bg-[#38d1ff] shadow-[0_0_8px_#38d1ff]"
                  : "bg-[#f59e0b] animate-pulse"
              }`}
            />
            {metrics.isReady ? "MODEL READY" : "TRAINING"}
          </span>
        </div>
      </div>

      {/* Pipeline Stage Tracker */}
      <div className="ai-workspace-pipeline flex items-center justify-between text-[10px] font-mono tracking-wider uppercase text-[var(--text-faint)] mb-2.5 px-2.5 py-1 bg-[#1a202c] rounded-lg border border-[rgba(255,255,255,0.06)]">
        <span className="text-[var(--cyan-bright)] font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan-bright)]" />
          DATASET
        </span>
        <span className="text-[rgba(255,255,255,0.25)]">→</span>
        <span
          className={`font-semibold flex items-center gap-1 transition-colors ${
            isHoveringModel ? "text-[var(--purple-bright)] drop-shadow-[0_0_6px_rgba(176,107,255,0.6)]" : "text-[var(--purple-bright)]"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--purple-bright)]" />
          MODEL
        </span>
        <span className="text-[rgba(255,255,255,0.25)]">→</span>
        <span
          className={`font-semibold flex items-center gap-1 transition-colors ${
            isHoveringLoss ? "text-[var(--cyan-bright)] drop-shadow-[0_0_6px_rgba(56,209,255,0.6)]" : "text-[var(--cyan-bright)]"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan-bright)] animate-pulse" />
          TRAINING
        </span>
        <span className="text-[rgba(255,255,255,0.25)]">→</span>
        <span
          className={`${
            metrics.isReady ? "text-[#38d1ff] font-semibold" : "text-[var(--text-faint)]"
          } flex items-center gap-1`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              metrics.isReady ? "bg-[#38d1ff]" : "bg-[rgba(255,255,255,0.2)]"
            }`}
          />
          OUTPUT
        </span>
      </div>

      {/* Main Grid: Refined graphite gray panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* PANEL 1: DATASET */}
        <div className="ai-workspace-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1f2633] p-2.5 sm:p-3 flex flex-col justify-between transition-colors duration-200 hover:border-[rgba(255,255,255,0.14)]">
          <div>
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[rgba(255,255,255,0.07)]">
              <span className="text-[11px] font-mono tracking-wider font-semibold text-[var(--cyan-bright)] uppercase">
                DATASET
              </span>
              <span className="ai-workspace-tag text-[9px] font-mono text-[var(--text-faint)] bg-[#283245] px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.05)]">
                v1.2.0
              </span>
            </div>

            <div className="space-y-1 text-[11.5px] font-mono">
              <div className="flex justify-between items-center text-[var(--text-dim)]">
                <span className="text-[11px] text-[var(--text-faint)]">Training Samples</span>
                <span className="text-white ai-workspace-value font-medium">12,480</span>
              </div>
              <div className="flex justify-between items-center text-[var(--text-dim)]">
                <span className="text-[11px] text-[var(--text-faint)]">Validation</span>
                <span className="text-white ai-workspace-value font-medium">2,400</span>
              </div>
              <div className="flex justify-between items-center text-[var(--text-dim)]">
                <span className="text-[11px] text-[var(--text-faint)]">Features</span>
                <span className="text-white ai-workspace-value font-medium">128</span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-1.5 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between text-[10px] font-mono text-[var(--text-faint)]">
            <span>Augmentation</span>
            <span className="text-[var(--cyan-bright)]">Enabled</span>
          </div>
        </div>

        {/* PANEL 2: MODEL (Interactive & subtly animated neural network) */}
        <div
          onMouseEnter={() => setIsHoveringModel(true)}
          onMouseLeave={() => setIsHoveringModel(false)}
          className={`ai-workspace-card rounded-xl border p-2.5 sm:p-3 flex flex-col justify-between transition-all duration-300 ${
            isHoveringModel
              ? "border-[rgba(176,107,255,0.35)] bg-[#232b3a] shadow-[0_0_18px_-6px_rgba(176,107,255,0.22)]"
              : "border-[rgba(255,255,255,0.08)] bg-[#1f2633]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[rgba(255,255,255,0.07)]">
              <span className="text-[11px] font-mono tracking-wider font-semibold text-[var(--purple-bright)] uppercase flex items-center gap-1.5">
                MODEL
                {isHoveringModel && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--purple-bright)] animate-pulse" />
                )}
              </span>
              <span className="ai-workspace-tag text-[9px] font-mono text-[var(--text-faint)] bg-[#283245] px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.05)]">
                Transformer / MLP
              </span>
            </div>

            <div className="space-y-1 text-[11.5px] font-mono">
              <div className="flex justify-between items-center text-[var(--text-dim)]">
                <span className="text-[11px] text-[var(--text-faint)]">Architecture</span>
                <span className="text-white ai-workspace-value font-medium">Neural Network</span>
              </div>
              <div className="flex justify-between items-center text-[var(--text-dim)]">
                <span className="text-[11px] text-[var(--text-faint)]">Layers</span>
                <span className="text-white ai-workspace-value font-medium">8</span>
              </div>
              <div className="flex justify-between items-center text-[var(--text-dim)]">
                <span className="text-[11px] text-[var(--text-faint)]">Parameters</span>
                <span className="text-white ai-workspace-value font-medium">2.4M</span>
              </div>
            </div>
          </div>

          {/* Subtly Animated SVG Neural Layer Connection Visual */}
          <div className="mt-1.5 pt-1.5 border-t border-[rgba(255,255,255,0.05)] relative">
            <svg viewBox="0 0 160 24" className="w-full h-5 overflow-visible">
              {/* Connecting wires that update smoothly with organic node positions */}
              {connections.map(([fromIdx, toIdx], cIdx) => {
                const p1 = activeNodes[fromIdx];
                const p2 = activeNodes[toIdx];
                const isCyanLine = cIdx % 2 === 0;
                return (
                  <line
                    key={`conn-${cIdx}`}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={
                      isHoveringModel
                        ? isCyanLine
                          ? "rgba(56,209,255,0.48)"
                          : "rgba(176,107,255,0.48)"
                        : isCyanLine
                        ? "rgba(56,209,255,0.22)"
                        : "rgba(176,107,255,0.22)"
                    }
                    strokeWidth={isHoveringModel ? "1.2" : "1"}
                    style={{
                      transition: "x1 1.2s ease-out, y1 1.2s ease-out, x2 1.2s ease-out, y2 1.2s ease-out, stroke 0.3s ease",
                    }}
                  />
                );
              })}

              {/* Animated Neural Nodes with slow organic drift */}
              {activeNodes.map((pos, nIdx) => {
                const isCyan = nIdx < 3 || nIdx === 6;
                const radius = isHoveringModel ? 2.4 : 2.2;
                return (
                  <circle
                    key={`node-${nIdx}`}
                    cx={pos.x}
                    cy={pos.y}
                    r={radius}
                    fill={isCyan ? "#38d1ff" : "#b06bff"}
                    opacity={isHoveringModel ? 1 : 0.88}
                    style={{
                      transition: "cx 1.2s cubic-bezier(0.4, 0, 0.2, 1), cy 1.2s cubic-bezier(0.4, 0, 0.2, 1), fill 0.3s ease",
                      filter: isHoveringModel
                        ? `drop-shadow(0 0 3px ${isCyan ? "#38d1ff" : "#b06bff"})`
                        : "none",
                    }}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* PANEL 3: TRAINING (Interactive Loss Decay Area) */}
        <div
          onMouseEnter={() => setIsHoveringLoss(true)}
          onMouseLeave={handleLossMouseLeave}
          onMouseMove={handleLossMouseMove}
          className={`ai-workspace-card rounded-xl border p-2.5 sm:p-3 flex flex-col justify-between transition-all duration-300 cursor-crosshair ${
            isHoveringLoss
              ? "border-[rgba(56,209,255,0.38)] bg-[#232b3a] shadow-[0_0_18px_-6px_rgba(56,209,255,0.25)]"
              : "border-[rgba(255,255,255,0.08)] bg-[#1f2633]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[rgba(255,255,255,0.07)]">
              <span className="text-[11px] font-mono tracking-wider font-semibold text-[var(--cyan-bright)] uppercase flex items-center gap-1.5">
                TRAINING
                {isHoveringLoss && (
                  <span className="text-[9px] font-mono text-[var(--cyan-bright)] opacity-75 font-normal">
                    (probe)
                  </span>
                )}
              </span>
              <span className="text-[10px] font-mono text-[var(--cyan-bright)]">
                {metrics.progressText}%
              </span>
            </div>

            <div className="space-y-1 text-[11.5px] font-mono">
              <div className="flex justify-between items-center text-[var(--text-dim)]">
                <span className="text-[11px] text-[var(--text-faint)]">Epoch</span>
                <span className="text-white ai-workspace-value font-medium">{metrics.epoch} / 50</span>
              </div>
              <div className="flex justify-between items-center text-[var(--text-dim)]">
                <span className="text-[11px] text-[var(--text-faint)]">Accuracy</span>
                <span className="text-[var(--cyan-bright)] font-medium">{metrics.accuracy}%</span>
              </div>
              <div className="flex justify-between items-center text-[var(--text-dim)]">
                <span className="text-[11px] text-[var(--text-faint)]">Loss</span>
                <span
                  className={`font-medium transition-colors duration-200 ${
                    isHoveringLoss ? "text-[var(--cyan-bright)] font-bold" : "text-white ai-workspace-value"
                  }`}
                >
                  {displayedLoss}
                </span>
              </div>
            </div>

            {/* GPU-Accelerated Framer Motion Progress Bar */}
            <div className="mt-2">
              <div className="h-1.5 w-full bg-[rgba(255,255,255,0.08)] ai-workspace-tag rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[var(--cyan-bright)] to-[var(--purple-bright)]"
                  initial={{ width: "0%" }}
                  animate={{ width: isTriggered ? "74%" : "0%" }}
                  transition={{ duration: 1.18, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Training Loss Curve SVG */}
          <div className="mt-1.5 pt-1.5 border-t border-[rgba(255,255,255,0.05)]">
            <div className="flex items-center justify-between text-[9px] font-mono text-[var(--text-faint)] mb-0.5">
              <span className="flex items-center gap-1">
                <span>loss_decay</span>
                {isHoveringLoss && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan-bright)] animate-ping" />
                )}
              </span>
              <span className="text-[var(--cyan-bright)] font-mono transition-all duration-150">
                {displayedLoss}
              </span>
            </div>
            <svg
              ref={lossSvgRef}
              viewBox="0 0 160 22"
              className="w-full h-5 overflow-visible select-none"
            >
              <defs>
                <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38d1ff" stopOpacity={isHoveringLoss ? "0.32" : "0.2"} />
                  <stop offset="100%" stopColor="#38d1ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area polygon */}
              <polygon
                points={`0,5 25,${isHoveringLoss ? 7 : 8} 50,${isHoveringLoss ? 10 : 12} 80,${isHoveringLoss ? 13 : 14} 110,${isHoveringLoss ? 16 : 17} 135,${isHoveringLoss ? 17 : 18} 160,${isHoveringLoss ? 18 : 19} 160,22 0,22`}
                fill="url(#lossGrad)"
                style={{ transition: "points 0.3s ease" }}
              />

              {/* Loss Curve line */}
              <motion.path
                d={
                  isHoveringLoss
                    ? "M0,5 Q40,11 80,13 T160,18"
                    : "M0,5 Q40,13 80,15 T160,19"
                }
                fill="none"
                stroke="#38d1ff"
                strokeWidth={isHoveringLoss ? "1.8" : "1.5"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isTriggered ? 1 : 0 }}
                transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
                style={{ transition: "d 0.35s ease, stroke-width 0.2s ease" }}
              />

              {/* Interactive cursor probe point and hairline on the curve */}
              {isHoveringLoss && (
                <g>
                  {/* Vertical probe hairline */}
                  <line
                    x1={probeX}
                    y1="0"
                    x2={probeX}
                    y2="22"
                    stroke="rgba(56,209,255,0.45)"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                  {/* Interactive probe circle */}
                  <circle
                    cx={probeX}
                    cy={probeY}
                    r="2.8"
                    fill="#38d1ff"
                    stroke="#151922"
                    strokeWidth="1"
                    style={{
                      filter: "drop-shadow(0 0 4px #38d1ff)",
                    }}
                  />
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* PANEL 4: OUTPUT */}
        <div className="ai-workspace-card rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1f2633] p-2.5 sm:p-3 flex flex-col justify-between transition-colors duration-200 hover:border-[rgba(255,255,255,0.14)]">
          <div>
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[rgba(255,255,255,0.07)]">
              <span className="text-[11px] font-mono tracking-wider font-semibold text-white ai-workspace-value uppercase">
                OUTPUT
              </span>
              <span className="ai-workspace-tag text-[9px] font-mono text-[var(--cyan-bright)] bg-[#283245] px-1.5 py-0.5 rounded border border-[rgba(56,209,255,0.18)]">
                v2.4
              </span>
            </div>

            <div className="space-y-1 text-[11.5px] font-mono">
              <div className="flex justify-between items-center text-[var(--text-dim)]">
                <span className="text-[11px] text-[var(--text-faint)]">Status</span>
                <span
                  className={`font-semibold ${
                    metrics.isReady ? "text-[#38d1ff]" : "text-[#f59e0b]"
                  }`}
                >
                  {metrics.isReady ? "MODEL READY" : "TRAINING"}
                </span>
              </div>
              <div className="flex justify-between items-center text-[var(--text-dim)]">
                <span className="text-[11px] text-[var(--text-faint)]">Inference</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ACTIVE
                </span>
              </div>
              <div className="flex justify-between items-center text-[var(--text-dim)]">
                <span className="text-[11px] text-[var(--text-faint)]">Latency</span>
                <span className="text-white ai-workspace-value font-medium">1.4 ms</span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-1.5 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between text-[10px] font-mono text-[var(--text-faint)]">
            <span>Export Target</span>
            <span className="text-[var(--purple-bright)]">ONNX / TensorRT</span>
          </div>
        </div>
      </div>

      {/* Frame Bottom Console Status */}
      <div className="mt-2.5 pt-2 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between text-[10px] font-mono text-[var(--text-faint)]">
        <span className="flex items-center gap-1.5 truncate">
          <span className="text-[var(--cyan-bright)]">●</span>
          <span>Checkpoint saved:</span>
          <span className="text-white ai-workspace-value opacity-85">checkpoints/aideas-v2.4.pt</span>
        </span>
        <span className="hidden sm:inline text-[var(--text-faint)] opacity-60">
          CUDA 12.2 • FP16
        </span>
      </div>
    </motion.div>
  );
}
