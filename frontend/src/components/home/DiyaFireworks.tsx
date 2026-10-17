'use client';

import { useEffect, useRef, useCallback } from 'react';

export interface DiyaFireworksProps {
  /**
   * Incremented each time the diya button is activated to launch or add a celebration.
   */
  triggerCount: number;
}

interface Particle {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  flicker: boolean;
  gravity: number;
  friction: number;
}

interface Rocket {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  palette: string[];
  trailColor: string;
  trail: Array<{ x: number; y: number; alpha: number }>;
}

const PALETTES = {
  cyanGold: ['#30D0F0', '#38BDF8', '#00F0FF', '#FFB800', '#FDE047', '#FFFFFF'],
  violetCyan: ['#B060F0', '#C084FC', '#30D0F0', '#38BDF8', '#E879F9', '#FFFFFF'],
  goldAmber: ['#FFB800', '#F59E0B', '#FBBF24', '#FDE047', '#FFFBEB', '#FFFFFF'],
  electricBlue: ['#30D0F0', '#3B82F6', '#60A5FA', '#93C5FD', '#FFFFFF'],
  royalFestive: ['#FFB800', '#B060F0', '#30D0F0', '#F43F5E', '#FDE047', '#FFFFFF'],
};

export default function DiyaFireworks({ triggerCount }: DiyaFireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const isRunningRef = useRef(false);

  // Simulation arrays
  const rocketsRef = useRef<Rocket[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  // Clear all pending timeouts
  const clearScheduled = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  // Helper to spawn a burst of particles at (x, y)
  const spawnBurst = useCallback((x: number, y: number, palette: string[], count = 50) => {
    const particles = particlesRef.current;
    const baseHueIndex = Math.floor(Math.random() * palette.length);

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 5.5 + 1.2;
      const color = Math.random() > 0.3 ? palette[baseHueIndex] : palette[Math.floor(Math.random() * palette.length)];

      particles.push({
        x,
        y,
        prevX: x,
        prevY: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: Math.random() * 0.014 + 0.012,
        color,
        size: Math.random() * 2.2 + 1.2,
        flicker: Math.random() > 0.5,
        gravity: 0.055,
        friction: 0.965,
      });
    }

    // Add a few bright glittering center embers
    for (let j = 0; j < 8; j++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 0.5;
      particles.push({
        x,
        y,
        prevX: x,
        prevY: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.018,
        color: '#FFFFFF',
        size: 2.5,
        flicker: true,
        gravity: 0.03,
        friction: 0.94,
      });
    }
  }, []);

  // Helper to spawn a rocket from bottom-left toward target
  const launchRocket = useCallback(
    (targetX: number, targetY: number, palette: string[], startX?: number, startY?: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const originX = startX ?? Math.min(140, canvas.clientWidth * 0.15);
      const originY = startY ?? canvas.clientHeight - 80;

      const dx = targetX - originX;
      const dy = targetY - originY;
      const distance = Math.hypot(dx, dy);
      const speed = Math.min(14, Math.max(9, distance / 40));

      const angle = Math.atan2(dy, dx);

      rocketsRef.current.push({
        x: originX,
        y: originY,
        prevX: originX,
        prevY: originY,
        targetX,
        targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: '#FDE047',
        palette,
        trailColor: 'rgba(255, 200, 80, 0.7)',
        trail: [],
      });
    },
    []
  );

  // Soft sparkle cluster for prefers-reduced-motion
  const spawnReducedMotionCelebration = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const originX = Math.min(130, canvas.clientWidth * 0.14);
    const originY = canvas.clientHeight - 130;
    const colors = ['#30D0F0', '#FFB800', '#B060F0', '#FFFFFF'];

    for (let i = 0; i < 22; i++) {
      const angle = Math.random() * Math.PI * 0.7 - Math.PI * 0.85; // gently upward
      const speed = Math.random() * 1.8 + 0.4;
      particlesRef.current.push({
        x: originX + (Math.random() - 0.5) * 60,
        y: originY + (Math.random() - 0.5) * 40,
        prevX: originX,
        prevY: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.022,
        color: colors[i % colors.length],
        size: Math.random() * 2 + 1.2,
        flicker: true,
        gravity: 0.015,
        friction: 0.98,
      });
    }
  }, []);

  // Main animation loop
  const runAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Use gentle clear overlay so trails have a natural brief persistence
    ctx.clearRect(0, 0, width, height);

    const rockets = rocketsRef.current;
    const particles = particlesRef.current;

    // 1. Update and render rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.prevX = r.x;
      r.prevY = r.y;

      r.x += r.vx;
      r.y += r.vy;

      // Gravity affects rocket trajectory gently
      r.vy += 0.07;

      // Add trail point
      r.trail.push({ x: r.x, y: r.y, alpha: 1 });
      if (r.trail.length > 7) r.trail.shift();

      // Render rocket trail
      ctx.beginPath();
      ctx.moveTo(r.prevX, r.prevY);
      ctx.lineTo(r.x, r.y);
      ctx.strokeStyle = r.trailColor;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Rocket sparks
      for (const t of r.trail) {
        t.alpha -= 0.12;
        if (t.alpha > 0) {
          ctx.beginPath();
          ctx.arc(t.x + (Math.random() - 0.5) * 3, t.y + (Math.random() - 0.5) * 3, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 220, 120, ${t.alpha})`;
          ctx.fill();
        }
      }

      // Rocket head glow
      ctx.beginPath();
      ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = r.color;
      ctx.fill();

      // Check detonation: when close to target or moving downward (apogee reached)
      const distToTarget = Math.hypot(r.targetX - r.x, r.targetY - r.y);
      if (distToTarget < 22 || r.vy >= 0 || r.y <= r.targetY) {
        spawnBurst(r.x, r.y, r.palette, Math.floor(Math.random() * 15 + 50));
        rockets.splice(i, 1);
      }
    }

    // 2. Update and render burst particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.prevX = p.x;
      p.prevY = p.y;

      p.x += p.vx;
      p.y += p.vy;

      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;

      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      const displayAlpha = p.flicker && Math.random() > 0.35 ? p.alpha * (Math.random() * 0.5 + 0.5) : p.alpha;

      // Draw particle trail / velocity streak
      ctx.beginPath();
      ctx.moveTo(p.prevX, p.prevY);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, displayAlpha));
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Soft ambient aura around brighter embers
      if (p.size > 2 && displayAlpha > 0.4) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = displayAlpha * 0.25;
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;

    // Check if simulation should continue
    if (rockets.length > 0 || particles.length > 0) {
      animFrameRef.current = requestAnimationFrame(runAnimation);
    } else {
      // Finished: clear canvas completely and reset loop flag
      ctx.clearRect(0, 0, width, height);
      isRunningRef.current = false;
      animFrameRef.current = null;
    }
  }, [spawnBurst]);

  // Handle new trigger
  useEffect(() => {
    if (triggerCount <= 0) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      spawnReducedMotionCelebration();
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        animFrameRef.current = requestAnimationFrame(runAnimation);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    // Launch choreographed celebration spread across the viewport
    // Wave 1: Immediate launches from diya (0ms - 150ms)
    launchRocket(w * 0.26, h * 0.36, PALETTES.cyanGold);
    launchRocket(w * 0.46, h * 0.28, PALETTES.goldAmber);

    // Initial festive burst directly above diya for immediate visual gratification
    spawnBurst(Math.min(160, w * 0.16), h * 0.65, PALETTES.electricBlue, 30);

    // Wave 2: Staggered bursts expanding across center and right (250ms - 600ms)
    const t1 = window.setTimeout(() => {
      launchRocket(w * 0.64, h * 0.32, PALETTES.violetCyan);
      launchRocket(w * 0.36, h * 0.44, PALETTES.electricBlue);
    }, 280);

    // Wave 3: Higher apex bursts across top center & wide right (650ms - 1000ms)
    const t2 = window.setTimeout(() => {
      launchRocket(w * 0.54, h * 0.22, PALETTES.royalFestive);
      launchRocket(w * 0.78, h * 0.38, PALETTES.cyanGold);
    }, 680);

    // Wave 4: Grand finale cascading sparkles (1100ms - 1500ms)
    const t3 = window.setTimeout(() => {
      launchRocket(w * 0.42, h * 0.30, PALETTES.goldAmber);
      launchRocket(w * 0.24, h * 0.40, PALETTES.violetCyan);
    }, 1200);

    timeoutsRef.current.push(t1, t2, t3);

    // Start rendering loop if not already running
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      animFrameRef.current = requestAnimationFrame(runAnimation);
    }
  }, [triggerCount, launchRocket, spawnBurst, spawnReducedMotionCelebration, runAnimation]);

  // Handle window resizing and high-DPI scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      clearScheduled();
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [clearScheduled]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
      aria-hidden="true"
    />
  );
}
