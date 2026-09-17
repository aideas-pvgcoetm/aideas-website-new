"use client";

import { useEffect, useRef, useState } from "react";

interface NeuralBackgroundProps {
  className?: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  depth: number;
  baseAlpha: number;
  alpha: number;
  colorType: "silver" | "cyan" | "purple";
  hasRing: boolean;
  isFiring: boolean;
  fireProgress: number;
  fireCooldown: number;
  flash: number;
  mouseInfluence: number;
}

interface Signal {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  color: string;
}

const COLOR_RGB_DARK = {
  silver: {
    core: "rgba(242, 246, 255, ",
    halo: "rgba(215, 230, 255, ",
    line: "220, 228, 242",
  },
  cyan: {
    core: "rgba(56, 209, 255, ",
    halo: "rgba(56, 209, 255, ",
    line: "56, 209, 255",
  },
  purple: {
    core: "rgba(176, 107, 255, ",
    halo: "rgba(176, 107, 255, ",
    line: "176, 107, 255",
  },
};

const COLOR_RGB_LIGHT = {
  silver: {
    core: "rgba(95, 108, 125, ",
    halo: "rgba(145, 158, 175, ",
    line: "85, 100, 118",
  },
  cyan: {
    core: "rgba(0, 162, 216, ",
    halo: "rgba(56, 209, 255, ",
    line: "0, 162, 216",
  },
  purple: {
    core: "rgba(139, 92, 246, ",
    halo: "rgba(176, 107, 255, ",
    line: "139, 92, 246",
  },
};

const MAX_DISTANCE = 115;
const MAX_DISTANCE_SQ = MAX_DISTANCE * MAX_DISTANCE;
const MOUSE_RADIUS = 170;
const MAX_SPEED = 0.5;
const MAX_SIGNALS = 2;

function DesktopNeuralCanvas({ className = "" }: NeuralBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Check accessibility: prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let rafId: number | null = null;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let parentRect = parent.getBoundingClientRect();

    // Raw cursor coordinates from window listener (zero React state, zero DOM queries in mousemove)
    let rawMouseX = -9999;
    let rawMouseY = -9999;
    let mouseActive = false;

    // Smoothed container-relative cursor
    const mouse = {
      x: -9999,
      y: -9999,
      isActive: false,
    };

    let nodes: Node[] = [];
    let signals: Signal[] = [];

    // Initialize crystalline nodes:
    // Desktop (>= 1024px): 120 nodes
    // Tablet (768px - 1023px): 65 nodes
    const initNodes = () => {
      const isTablet = width < 1024;
      const totalCount = isTablet ? 65 : 120;

      nodes = [];
      signals = [];

      // Hierarchy:
      // ~77% silver/cool-white (majority)
      // ~17% soft cyan (primary accent)
      // ~6% soft violet (secondary accent)
      // Area behind left headline/CTA is kept calmer for clean typography readability
      const leftCount = Math.round(totalCount * 0.28);
      const rightCount = totalCount - leftCount;

      const createNode = (x: number, y: number, isLeftZone: boolean): Node => {
        const randType = Math.random();
        const colorType: "silver" | "cyan" | "purple" =
          randType < 0.77 ? "silver" : randType < 0.94 ? "cyan" : "purple";

        // Depth variation (0.75 - 1.25) provides 3D optical hierarchy
        const depth = 0.75 + Math.random() * 0.5;
        const radius = (isLeftZone ? 1.0 + Math.random() * 0.8 : 1.1 + Math.random() * 1.0) * depth;
        const baseAlpha = (isLeftZone ? 0.22 + Math.random() * 0.26 : 0.35 + Math.random() * 0.42) * (depth * 0.9);
        const hasRing = Math.random() < 0.16;

        return {
          x,
          y,
          vx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.26,
          vy: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.26,
          radius,
          depth,
          baseAlpha,
          alpha: baseAlpha,
          colorType,
          hasRing,
          isFiring: false,
          fireProgress: 0,
          fireCooldown: Math.floor(Math.random() * 200) + 60,
          flash: 0,
          mouseInfluence: 0,
        };
      };

      // Calmer left zone
      for (let i = 0; i < leftCount; i++) {
        const x = Math.random() * (width * 0.42);
        const y = Math.random() * height;
        nodes.push(createNode(x, y, true));
      }

      // Richer right zone and negative spaces
      for (let i = 0; i < rightCount; i++) {
        const x = width * 0.42 + Math.random() * (width * 0.58);
        const y = Math.random() * height;
        nodes.push(createNode(x, y, false));
      }
    };

    const updateParentRect = () => {
      if (parent) {
        parentRect = parent.getBoundingClientRect();
      }
    };

    const resizeCanvas = () => {
      updateParentRect();
      width = Math.floor(parentRect.width);
      height = Math.floor(parentRect.height);

      if (width <= 0 || height <= 0) return;

      // Cap DPR at 1.35 to preserve crisp crystalline visuals while keeping fillrate ultra-fast
      const dpr = Math.min(window.devicePixelRatio || 1, 1.35);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      if (nodes.length === 0 || Math.abs(nodes[0].x - width) > width * 1.5) {
        initNodes();
      }
    };

    // Lightweight mouse listeners (zero DOM querying during move)
    const handleMouseMove = (e: MouseEvent) => {
      rawMouseX = e.clientX;
      rawMouseY = e.clientY;
      mouseActive = true;
    };

    const handleMouseLeave = () => {
      mouseActive = false;
      rawMouseX = -9999;
      rawMouseY = -9999;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", updateParentRect, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    let frameCount = 0;

    const render = () => {
      if (!isVisible) {
        rafId = null;
        return;
      }

      frameCount++;
      ctx.clearRect(0, 0, width, height);

      const isLightMode = typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "light";
      const COLOR_RGB = isLightMode ? COLOR_RGB_LIGHT : COLOR_RGB_DARK;

      // Compute relative mouse position within Hero
      if (
        mouseActive &&
        rawMouseX >= parentRect.left &&
        rawMouseX <= parentRect.right &&
        rawMouseY >= parentRect.top &&
        rawMouseY <= parentRect.bottom
      ) {
        mouse.x = rawMouseX - parentRect.left;
        mouse.y = rawMouseY - parentRect.top;
        mouse.isActive = true;
      } else {
        mouse.isActive = false;
        mouse.x = -9999;
        mouse.y = -9999;
      }

      // 1. Spontaneous quiet firing (every ~220 frames = ~3.6s, disabled if reduced motion)
      if (!prefersReducedMotion && frameCount % 220 === 0 && signals.length < MAX_SIGNALS) {
        const eligible: number[] = [];
        for (let i = 0; i < nodes.length; i++) {
          if (!nodes[i].isFiring && nodes[i].fireCooldown <= 0) {
            eligible.push(i);
          }
        }
        if (eligible.length > 0) {
          const chosenIdx = eligible[Math.floor(Math.random() * eligible.length)];
          const chosen = nodes[chosenIdx];
          chosen.isFiring = true;
          chosen.fireProgress = 0;
          chosen.fireCooldown = 320 + Math.floor(Math.random() * 180);
        }
      }

      // 2. Update Node Positions & Cursor Interaction
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        if (n.fireCooldown > 0) n.fireCooldown--;
        if (n.flash > 0) n.flash = Math.max(0, n.flash - 0.045);

        if (n.isFiring) {
          n.fireProgress += 0.035;
          if (n.fireProgress >= 1) {
            n.isFiring = false;
            n.fireProgress = 0;
          }
        }

        // Calmer alpha directly behind headline/CTA area to preserve effortless typography readability
        const inHeadlineZone =
          n.x < width * 0.44 && n.y > height * 0.18 && n.y < height * 0.74;
        const targetAlpha = inHeadlineZone ? n.baseAlpha * 0.4 : n.baseAlpha;

        // Controlled magnetic pull: gentle 6-12px drift, no swarming or chasing
        if (mouse.isActive && !prefersReducedMotion) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.hypot(dx, dy);

          if (dist < MOUSE_RADIUS && dist > 1) {
            const proximity = 1 - dist / MOUSE_RADIUS;
            const pull = Math.pow(proximity, 1.35) * 0.1;
            n.vx += (dx / dist) * pull;
            n.vy += (dy / dist) * pull;

            n.mouseInfluence = Math.min(1, n.mouseInfluence + 0.14);

            // Subtle firing trigger on close cursor approach
            if (dist < 50 && !n.isFiring && n.fireCooldown <= 0 && Math.random() < 0.04) {
              n.isFiring = true;
              n.fireProgress = 0;
              n.fireCooldown = 240;
            }
          } else {
            n.mouseInfluence = Math.max(0, n.mouseInfluence - 0.035);
          }
        } else {
          n.mouseInfluence = Math.max(0, n.mouseInfluence - 0.035);
        }

        n.alpha = n.isFiring
          ? Math.min(1, targetAlpha + 0.55 * Math.sin(n.fireProgress * Math.PI))
          : n.flash > 0
          ? Math.min(1, targetAlpha + n.flash * 0.45)
          : n.mouseInfluence > 0
          ? Math.min(1, targetAlpha + n.mouseInfluence * 0.42)
          : targetAlpha;

        if (!prefersReducedMotion) {
          n.vx *= 0.94;
          n.vy *= 0.94;

          const spd = Math.hypot(n.vx, n.vy);
          if (spd > MAX_SPEED) {
            n.vx = (n.vx / spd) * MAX_SPEED;
            n.vy = (n.vy / spd) * MAX_SPEED;
          }

          n.x += n.vx;
          n.y += n.vy;

          // Soft boundaries
          const pad = 12;
          if (n.x < pad) {
            n.x = pad;
            n.vx = Math.abs(n.vx);
          } else if (n.x > width - pad) {
            n.x = width - pad;
            n.vx = -Math.abs(n.vx);
          }
          if (n.y < pad) {
            n.y = pad;
            n.vy = Math.abs(n.vy);
          } else if (n.y > height - pad) {
            n.y = height - pad;
            n.vy = -Math.abs(n.vy);
          }
        }
      }

      // Map active signals for fast line tinting lookup
      const activeSignalMap = new Set<string>();
      for (let s = 0; s < signals.length; s++) {
        const sig = signals[s];
        const key = sig.fromIdx < sig.toIdx ? `${sig.fromIdx}_${sig.toIdx}` : `${sig.toIdx}_${sig.fromIdx}`;
        activeSignalMap.add(key);
      }

      // 3. Draw Clean Straight Connections (Optimized: fast rejection, no square roots for non-matches)
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        let closestNeighbor: { idx: number; distSq: number } | null = null;

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          if (Math.abs(dx) > MAX_DISTANCE) continue;
          const dy = n1.y - n2.y;
          if (Math.abs(dy) > MAX_DISTANCE) continue;

          const distSq = dx * dx + dy * dy;
          if (distSq < MAX_DISTANCE_SQ) {
            if (!closestNeighbor || distSq < closestNeighbor.distSq) {
              closestNeighbor = { idx: j, distSq };
            }

            const dist = Math.sqrt(distSq);
            const proximity = 1 - dist / MAX_DISTANCE;
            const mouseBoost = Math.max(n1.mouseInfluence, n2.mouseInfluence);

            const lineKey = `${i}_${j}`;
            const isSignalLine = activeSignalMap.has(lineKey);

            // Restrained opacity: clearly visible on normal desktop, brighter when cursor is active
            const baseOpacity = isLightMode
              ? proximity * 0.22 * Math.min(n1.alpha, n2.alpha)
              : proximity * 0.15 * Math.min(n1.alpha, n2.alpha);
            const lineOpacity = isSignalLine
              ? isLightMode ? 0.48 : 0.38
              : Math.min(isLightMode ? 0.58 : 0.55, baseOpacity + mouseBoost * (isLightMode ? 0.18 : 0.14));

            // Default cool silver/white; subtly tinted toward cyan or violet on accents/signals
            const lineRGB = isSignalLine
              ? n1.colorType === "purple" || n2.colorType === "purple"
                ? COLOR_RGB.purple.line
                : COLOR_RGB.cyan.line
              : n1.colorType === "cyan" && n2.colorType === "cyan"
              ? COLOR_RGB.cyan.line
              : n1.colorType === "purple" && n2.colorType === "purple"
              ? COLOR_RGB.purple.line
              : COLOR_RGB.silver.line;

            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(${lineRGB}, ${lineOpacity})`;
            ctx.lineWidth = isSignalLine
              ? isLightMode ? 1.0 : 0.9
              : isLightMode ? 0.78 : 0.65;
            ctx.stroke();
          }
        }

        // Launch signal when firing begins
        if (
          !prefersReducedMotion &&
          n1.isFiring &&
          n1.fireProgress > 0.05 &&
          n1.fireProgress < 0.13 &&
          closestNeighbor &&
          signals.length < MAX_SIGNALS
        ) {
          const color =
            n1.colorType === "purple"
              ? isLightMode
                ? "rgba(139, 92, 246, 0.95)"
                : "rgba(176, 107, 255, 0.95)"
              : n1.colorType === "cyan"
              ? isLightMode
                ? "rgba(0, 162, 216, 0.95)"
                : "rgba(56, 209, 255, 0.95)"
              : isLightMode
              ? "rgba(95, 108, 125, 0.95)"
              : "rgba(245, 250, 255, 0.95)";

          signals.push({
            fromIdx: i,
            toIdx: closestNeighbor.idx,
            progress: 0,
            speed: 0.025,
            color,
          });
        }
      }

      // 4. Update & Draw Traveling Signals (Optimized: avoid shadowBlur GPU stalls)
      for (let s = signals.length - 1; s >= 0; s--) {
        const sig = signals[s];
        sig.progress += sig.speed;

        const fromNode = nodes[sig.fromIdx];
        const toNode = nodes[sig.toIdx];

        if (!fromNode || !toNode) {
          signals.splice(s, 1);
          continue;
        }

        if (sig.progress >= 1) {
          toNode.flash = 1.0;
          signals.splice(s, 1);
          continue;
        }

        const sx = fromNode.x + (toNode.x - fromNode.x) * sig.progress;
        const sy = fromNode.y + (toNode.y - fromNode.y) * sig.progress;

        // Outer soft glow halo (lightweight two-pass circle instead of shadowBlur)
        ctx.beginPath();
        ctx.arc(sx, sy, 4.0, 0, Math.PI * 2);
        ctx.fillStyle = sig.color.replace("0.95", "0.22");
        ctx.fill();

        // Traveling signal core bead
        ctx.beginPath();
        ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = sig.color;
        ctx.fill();
      }

      // 5. Draw Crystalline Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const col = COLOR_RGB[n.colorType];

        // Micro-ring on select nodes
        if (n.hasRing) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 3.2, 0, Math.PI * 2);
          ctx.strokeStyle = `${col.halo}${n.alpha * 0.35})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }

        // Firing pulse wave
        if (n.isFiring) {
          const pulseR = n.radius + 5.0 * (1 - n.fireProgress);
          ctx.beginPath();
          ctx.arc(n.x, n.y, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = `${col.halo}${n.alpha * 0.45})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }

        // Refined halo on active or mouse-influenced nodes
        if (n.isFiring || n.flash > 0 || n.mouseInfluence > 0.2) {
          const haloR = n.radius + (n.mouseInfluence > 0.2 ? 3.2 : 2.6);
          ctx.beginPath();
          ctx.arc(n.x, n.y, haloR, 0, Math.PI * 2);
          ctx.fillStyle = `${col.halo}${n.alpha * 0.28})`;
          ctx.fill();
        }

        // Crystalline Core Dot
        ctx.beginPath();
        ctx.arc(
          n.x,
          n.y,
          n.isFiring || n.mouseInfluence > 0.3 ? n.radius * 1.25 : n.radius,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `${col.core}${n.alpha})`;
        ctx.fill();
      }

      // If reduced motion, render single frame and halt
      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(render);
      }
    };

    // IntersectionObserver: halts RAF loop when Hero is scrolled off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;

        if (isVisible && !wasVisible) {
          updateParentRect();
          if (!rafId && !prefersReducedMotion) {
            rafId = requestAnimationFrame(render);
          }
        } else if (!isVisible && rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(parent);
    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      if (prefersReducedMotion) {
        render();
      }
    });
    resizeObserver.observe(parent);

    // Initial render / loop start
    if (prefersReducedMotion) {
      render();
    } else {
      rafId = requestAnimationFrame(render);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", updateParentRect);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
      aria-hidden="true"
    />
  );
}

export function NeuralBackground({ className = "" }: NeuralBackgroundProps) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    // Breakpoint: 768px + fine pointer (mouse/trackpad).
    // On mobile or touch devices (<768px or coarse pointer), interactive canvas is NEVER mounted.
    const mql = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    setIsDesktop(mql.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    mql.addEventListener("change", handleMediaChange);
    return () => {
      mql.removeEventListener("change", handleMediaChange);
    };
  }, []);

  // Return null on mobile / touch-only / SSR: zero canvas in DOM, zero RAF loops, zero listeners
  if (!isDesktop) {
    return null;
  }

  return <DesktopNeuralCanvas className={className} />;
}

export default NeuralBackground;
