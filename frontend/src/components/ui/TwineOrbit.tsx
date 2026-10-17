// Helix Reverie / TwineOrbit — adapted for AIDEAS navbar accent
"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type RGBA = [number, number, number, number];

const COLOR_CACHE = new Map<string, RGBA | null>();

function parseColor(input: string | undefined, fallback: RGBA): RGBA {
  if (typeof input !== "string") return fallback;
  let hit = COLOR_CACHE.get(input);
  if (hit === undefined) {
    hit = parseColorRaw(input);
    COLOR_CACHE.set(input, hit);
  }
  return hit ?? fallback;
}

function parseColorRaw(raw: string): RGBA | null {
  let s = raw.trim();
  const v = /^var\(\s*--[^,]+,\s*(.+)\)$/.exec(s);
  if (v) s = v[1].trim();
  if (s[0] === "#") {
    const h = s.slice(1);
    const x = (a: string) => parseInt(a, 16);
    let r: number, g: number, b: number, a = 255;
    if (h.length === 3 || h.length === 4) {
      r = x(h[0] + h[0]); g = x(h[1] + h[1]); b = x(h[2] + h[2]);
      if (h.length === 4) a = x(h[3] + h[3]);
    } else if (h.length === 6 || h.length === 8) {
      r = x(h.slice(0, 2)); g = x(h.slice(2, 4)); b = x(h.slice(4, 6));
      if (h.length === 8) a = x(h.slice(6, 8));
    } else return null;
    const out: RGBA = [r / 255, g / 255, b / 255, a / 255];
    return out.every(Number.isFinite) ? out : null;
  }
  const m = /^(rgba?|hsla?)\(([^)]*)\)$/i.exec(s);
  if (!m) return null;
  const parts = m[2].split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3) return null;
  const numVal = (p: string, scale: number) =>
    p.endsWith("%") ? (parseFloat(p) / 100) * scale : parseFloat(p);
  const alpha = parts.length > 3 ? numVal(parts[3], 1) : 1;
  let rgb: [number, number, number];
  if (m[1].toLowerCase().startsWith("rgb")) {
    rgb = [numVal(parts[0], 255) / 255, numVal(parts[1], 255) / 255, numVal(parts[2], 255) / 255];
  } else {
    const hh = (((parseFloat(parts[0]) % 360) + 360) % 360) / 360;
    const ss = numVal(parts[1], 1), ll = numVal(parts[2], 1);
    const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
    const p = 2 * ll - q;
    const f = (t: number) => {
      t = (t + 1) % 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    rgb = [f(hh + 1 / 3), f(hh), f(hh - 1 / 3)];
  }
  const out: RGBA = [rgb[0], rgb[1], rgb[2], alpha];
  return out.every(Number.isFinite) ? (out.map((c) => Math.min(1, Math.max(0, c))) as RGBA) : null;
}

function cssRgba(c: RGBA): string {
  return `rgba(${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(c[2] * 255)}, ${c[3]})`;
}

const ADVANCED_DEFAULTS = {
  slotMs: 6000,
  ringRadius: 39,
  figureSize: 22,
  ringYOffset: 1,
  startAngle: 0,
  baseTilt: 20,
  pitchRate: 200,
  pitchOffset: 0,
  twistFloor: 0,
  spinRate: 0,
  perspective: 15,
  samples: 360,
  depthContrast: 100,
  backMid: "#565292",
  midColor: "#2A93B3",
  frontMid: "#17C4D9",
  hover: 50,
  hoverSpin: 70,
  hoverGrow: 12,
  hoverReach: 260,
  tap: 50,
  tapTurns: 1,
  tapGrow: 20,
  tapWave: 700,
  grain: 0,
  vignette: 0,
  vignetteColor: "#000000",
};

interface EffectProps {
  windings?: number;
  count?: number;
  thickness?: number;
  advanced?: Partial<typeof ADVANCED_DEFAULTS>;
}

const DEPTH_BUCKETS = 48;
const MAX_SAMPLES = 1200;
const TAP_PULSE_S = 0.9;
const TAP_UNWIND = 0.5;
const MAX_RIPPLES = 6;

interface Ripple {
  x: number;
  y: number;
  t: number;
}

interface Effect {
  px: Float32Array;
  py: Float32Array;
  pz: Float32Array;
  seg: Int32Array;
  order: Int32Array;
  starts: Int32Array;
  cursor: Int32Array;
  noise: CanvasPattern | null;
  ripples: Ripple[];
  seenTaps: number;
}

function bakeEffect(stage: Stage): Effect {
  let noise: CanvasPattern | null = null;
  if (typeof document !== "undefined") {
    const c = document.createElement("canvas");
    c.width = 160;
    c.height = 160;
    const g = c.getContext("2d");
    if (g) {
      const img = g.createImageData(160, 160);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = 255;
      }
      g.putImageData(img, 0, 0);
      noise = stage.ctx.createPattern(c, "repeat");
    }
  }
  return {
    px: new Float32Array(MAX_SAMPLES + 1),
    py: new Float32Array(MAX_SAMPLES + 1),
    pz: new Float32Array(MAX_SAMPLES + 1),
    seg: new Int32Array(MAX_SAMPLES + 1),
    order: new Int32Array(MAX_SAMPLES + 1),
    starts: new Int32Array(DEPTH_BUCKETS + 1),
    cursor: new Int32Array(DEPTH_BUCKETS),
    noise,
    ripples: [],
    seenTaps: stage.pointer.taps,
  };
}

function clampN(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function rampColor(stops: RGBA[], t: number): string {
  const x = clampN(t, 0, 1) * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(x));
  const f = x - i;
  const a = stops[i], b = stops[i + 1];
  const r = Math.round((a[0] + (b[0] - a[0]) * f) * 255);
  const g = Math.round((a[1] + (b[1] - a[1]) * f) * 255);
  const bl = Math.round((a[2] + (b[2] - a[2]) * f) * 255);
  return `rgb(${r}, ${g}, ${bl})`;
}

function drawEffect(
  stage: Stage,
  fx: Effect,
  p: TwineOrbitProps,
  cx: number,
  cy: number,
  size: number,
  clock: number
): void {
  const ctx = stage.ctx;
  const W = stage.W;
  const H = stage.H;
  const adv = { ...ADVANCED_DEFAULTS, ...(p.advanced ?? {}) };
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const n = Math.round(clampN(num(p.count, 8), 1, 24));
  const turns = clampN(num(p.windings, 3), 0, 20);
  const lw = Math.max(0.5, num(p.thickness, 2.5));
  const N = Math.round(clampN(num(adv.samples, 240), 60, MAX_SAMPLES));
  const slotS = Math.max(0.1, num(adv.slotMs, 6000) / 1000);
  const phase = clock / slotS;

  const R = (size * num(adv.ringRadius, 39)) / 100;
  const r0 = (size * num(adv.figureSize, 22)) / 200;
  const ocy = cy + (size * num(adv.ringYOffset, 1)) / 100;
  const start = num(adv.startAngle, 0) * DEG;
  const beta = num(adv.baseTilt, 20) * DEG;
  const cb = Math.cos(beta), sb = Math.sin(beta);
  const pitchK = num(adv.pitchRate, 200) / 100;
  const pitch0 = num(adv.pitchOffset, 0) * DEG;
  const floorT = clampN(num(adv.twistFloor, 0) / 100, 0, 1);
  const tauMax = turns * Math.PI;
  const persp = clampN(num(adv.perspective, 15) / 100, 0, 0.9);
  const spin = num(adv.spinRate, 0) * DEG * clock;
  const contrast = Math.max(0, num(adv.depthContrast, 100) / 100);

  const hoverK = Math.max(0, num(adv.hover, 50)) / 50;
  const ptrX = stage.pointer.x;
  const ptrY = stage.pointer.y;
  const hv = hoverK * stage.pointer.over * (stage.pointer.down ? 1.6 : 1);
  const hoverSpin = num(adv.hoverSpin, 70) * DEG;
  const hoverGrow = num(adv.hoverGrow, 12) / 100;
  const reach = Math.max(1, (r0 * num(adv.hoverReach, 260)) / 100);

  const tapK = Math.max(0, num(adv.tap, 50)) / 50;
  const tapTurns = Math.round(clampN(num(adv.tapTurns, 1), 0, 5));
  const tapGrow = num(adv.tapGrow, 20) / 100;
  const waveW = Math.PI / Math.max(0.05, num(adv.tapWave, 700) / 1000);
  const now = performance.now() / 1000;
  if (stage.pointer.taps !== fx.seenTaps) {
    fx.seenTaps = stage.pointer.taps;
    if (tapK > 0) {
      fx.ripples.push({ x: ptrX, y: ptrY, t: now });
      if (fx.ripples.length > MAX_RIPPLES) fx.ripples.shift();
    }
  }
  const rippleLife = Math.PI / waveW + TAP_PULSE_S;
  fx.ripples = fx.ripples.filter((rp) => now - rp.t < rippleLife);
  const rippleAngles = fx.ripples.map((rp) => Math.atan2(rp.x - cx, ocy - rp.y));

  const stops: RGBA[] = [
    parseColor(p.accent, [0.69, 0.38, 0.94, 1]), // Violet / purple accent
    parseColor(adv.backMid, [0.34, 0.32, 0.57, 1]),
    parseColor(adv.midColor, [0.13, 0.72, 0.94, 1]),
    parseColor(adv.frontMid, [0.22, 0.82, 1, 1]),
    parseColor(p.color, [0.19, 0.82, 0.94, 1]),   // Bright Cyan
  ];
  const styles: string[] = [];
  for (let b = 0; b < DEPTH_BUCKETS; b++) styles.push(rampColor(stops, (b + 0.5) / DEPTH_BUCKETS));

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = lw;

  const { px, py, pz, seg, order, starts, cursor } = fx;

  for (let i = 0; i < n; i++) {
    const th = start + ((i + phase) * TAU) / n;
    const fxc = cx + R * Math.sin(th);
    const fyc = ocy - R * Math.cos(th);

    let k = 0;
    if (hv > 0) {
      const d = Math.hypot(ptrX - fxc, ptrY - fyc) / reach;
      k = hv * Math.exp(-d * d);
    }

    let tapSpin = 0;
    let bump = 0;
    for (let q = 0; q < rippleAngles.length; q++) {
      let d = Math.abs(th - rippleAngles[q]) % TAU;
      if (d > Math.PI) d = TAU - d;
      const e = (now - fx.ripples[q].t - d / waveW) / TAP_PULSE_S;
      if (e <= 0 || e >= 1) continue;
      tapSpin += e * e * (3 - 2 * e);
      bump = Math.max(bump, Math.sin(Math.PI * e));
    }
    const tb = tapK * bump;

    const r = r0 * (1 + k * hoverGrow + tb * tapGrow);
    const tau = tauMax * (floorT + (1 - floorT) * (1 + Math.cos(th)) * 0.5) * (1 - Math.min(1, tb * TAP_UNWIND));
    const yaw = spin + k * hoverSpin + tapSpin * tapTurns * TAU;
    const pitch = th * pitchK + pitch0;
    const cyw = Math.cos(yaw), syw = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);

    for (let j = 0; j < N; j++) {
      const s = (j / N) * TAU;
      const cs = Math.cos(s), ss = Math.sin(s);
      const x0 = cs, y0 = ss * cb, z0 = ss * sb;
      const a = tau * y0;
      const ca = Math.cos(a), sa = Math.sin(a);
      const x1 = x0 * ca + z0 * sa;
      const z1 = -x0 * sa + z0 * ca;
      const x2 = x1 * cyw + z1 * syw;
      const z2 = -x1 * syw + z1 * cyw;
      const y3 = y0 * cp - z2 * sp;
      const z3 = y0 * sp + z2 * cp;
      const f = 1 / Math.max(0.05, 1 - persp * z3);
      px[j] = fxc + x2 * r * f;
      py[j] = fyc - y3 * r * f;
      pz[j] = z3;
    }

    starts.fill(0);
    for (let j = 0; j < N; j++) {
      const j2 = j + 1 === N ? 0 : j + 1;
      const d = ((pz[j] + pz[j2]) * 0.5) * contrast;
      const b = clampN(Math.floor(((d + 1) * 0.5) * DEPTH_BUCKETS), 0, DEPTH_BUCKETS - 1);
      seg[j] = b;
      starts[b + 1]++;
    }
    for (let b = 0; b < DEPTH_BUCKETS; b++) {
      starts[b + 1] += starts[b];
      cursor[b] = starts[b];
    }
    for (let j = 0; j < N; j++) order[cursor[seg[j]]++] = j;

    for (let b = 0; b < DEPTH_BUCKETS; b++) {
      const s0 = starts[b], s1 = starts[b + 1];
      if (s1 <= s0) continue;
      ctx.beginPath();
      for (let q = s0; q < s1; q++) {
        const j = order[q];
        const j2 = j + 1 === N ? 0 : j + 1;
        ctx.moveTo(px[j], py[j]);
        ctx.lineTo(px[j2], py[j2]);
      }
      ctx.strokeStyle = styles[b];
      ctx.stroke();
    }
  }

  const vig = clampN(num(adv.vignette, 0) / 100, 0, 1);
  if (vig > 0) {
    const vc = parseColor(adv.vignetteColor, [0, 0, 0, 1]);
    const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.2, W / 2, H / 2, Math.max(W, H) * 0.75);
    g.addColorStop(0, cssRgba([vc[0], vc[1], vc[2], 0]));
    g.addColorStop(1, cssRgba([vc[0], vc[1], vc[2], vig]));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  const grain = clampN(num(adv.grain, 0) / 100, 0, 1);
  if (grain > 0 && fx.noise) {
    const ox = Math.floor(Math.random() * 160);
    const oy = Math.floor(Math.random() * 160);
    ctx.save();
    ctx.globalAlpha = grain * 0.35;
    ctx.translate(-ox, -oy);
    ctx.fillStyle = fx.noise;
    ctx.fillRect(0, 0, W + ox, H + oy);
    ctx.restore();
  }
}

export interface TwineOrbitProps extends EffectProps {
  background?: string;
  color?: string;
  accent?: string;
  size?: number;
  speed?: number;
  progress?: number;
  style?: CSSProperties;
  className?: string;
}

interface Stage {
  ctx: CanvasRenderingContext2D;
  W: number;
  H: number;
  dpr: number;
  pointer: StagePointer;
}

interface StagePointer {
  x: number;
  y: number;
  over: number;
  down: boolean;
  taps: number;
}

function num(v: unknown, d: number): number {
  return typeof v === "number" && Number.isFinite(v) ? v : d;
}

const __originkitPresetProps = {
  advanced: {
    tap: 50,
    grain: 0,
    hover: 50,
    slotMs: 6000,
    samples: 240,
    tapGrow: 20,
    tapWave: 700,
    baseTilt: 20,
    spinRate: 0,
    tapTurns: 1,
    vignette: 0,
    hoverGrow: 12,
    hoverSpin: 70,
    pitchRate: 200,
    figureSize: 22,
    hoverReach: 260,
    ringRadius: 39,
    startAngle: 0,
    twistFloor: 0,
    perspective: 15,
    pitchOffset: 0,
    ringYOffset: 1,
    depthContrast: 100,
    backMid: "#565292",
    midColor: "#22b8f0",
    frontMid: "#38d1ff",
  },
};

export default function TwineOrbit(props: TwineOrbitProps) {
  const mergedProps: TwineOrbitProps = {
    ...__originkitPresetProps,
    color: "#38d1ff",
    accent: "#b06bff",
    background: "transparent",
    size: 40,
    speed: 35,
    thickness: 1.6,
    ...props,
    advanced: {
      ...__originkitPresetProps.advanced,
      ...(props.advanced ?? {}),
    },
  };

  const { background = "transparent", size = 40, style, className = "" } = mergedProps;
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef(mergedProps);
  propsRef.current = mergedProps;

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stage: Stage = {
      ctx,
      W: 0,
      H: 0,
      dpr: 1,
      pointer: { x: 0, y: 0, over: 0, down: false, taps: 0 },
    };
    const resize = () => {
      stage.W = root.offsetWidth;
      stage.H = root.offsetHeight;
      stage.dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(stage.W * stage.dpr));
      canvas.height = Math.max(1, Math.round(stage.H * stage.dpr));
    };
    const ro = new ResizeObserver(resize);
    ro.observe(root);
    resize();

    let pointerInside = false;
    const onPointerMove = (e: PointerEvent) => {
      stage.pointer.x = e.offsetX;
      stage.pointer.y = e.offsetY;
      pointerInside = true;
    };
    const onPointerLeave = () => {
      pointerInside = false;
      stage.pointer.down = false;
    };
    const onPointerDown = (e: PointerEvent) => {
      onPointerMove(e);
      stage.pointer.down = true;
      stage.pointer.taps++;
    };
    const onPointerUp = () => {
      stage.pointer.down = false;
    };
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerenter", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    let fx: Effect | null = null;
    let key = "";
    let shown = 0;
    let clock = 0;
    let raf = 0;
    let last = -1;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last < 0 ? 0 : Math.min((now - last) / 1000, 1 / 20);
      stage.pointer.over +=
        ((pointerInside ? 1 : 0) - stage.pointer.over) * (1 - Math.exp(-8 * dt));
      last = now;
      const p = propsRef.current;
      const next = JSON.stringify([stage.W, stage.H, stage.dpr]);
      if (next !== key || !fx) {
        key = next;
        fx = bakeEffect(stage);
      }
      const rate =
        (Math.max(0, Math.min(100, num(p.speed, 35))) / 50) * (reduced ? 0.25 : 1);
      const animDt = dt * rate;
      clock += animDt;
      const target =
        typeof p.progress === "number" && Number.isFinite(p.progress)
          ? Math.max(0, Math.min(1, p.progress / 100))
          : null;
      if (target !== null) shown += (target - shown) * (1 - Math.exp(-8 * dt));
      const sz = Math.max(10, Math.min(800, num(p.size, size)));
      ctx.setTransform(stage.dpr, 0, 0, stage.dpr, 0, 0);
      ctx.clearRect(0, 0, stage.W, stage.H);
      drawEffect(
        stage,
        fx,
        p,
        stage.W / 2,
        stage.H / 2,
        sz,
        clock
      );
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerenter", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      ro.disconnect();
    };
  }, [size]);

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label="AIDEAS Helix Orbit decorative animation"
      className={className}
      style={{
        position: "relative",
        width: 42,
        height: 42,
        minWidth: 42,
        minHeight: 42,
        flexShrink: 0,
        overflow: "hidden",
        background,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          cursor: "pointer",
        }}
      />
    </div>
  );
}
