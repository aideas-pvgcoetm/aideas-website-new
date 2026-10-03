"use client";

import { useEffect, useRef, useState } from "react";

/* ─── constants ──────────────────────────────────────────────────────────── */
const SESSION_KEY = "aideas-loader-seen";
const MIN_DISPLAY_MS = 3000;
const SAFETY_TIMEOUT_MS = 6500;

/* Restrained palette — not neon */
const SHAFT_CYAN = "rgba(48, 160, 200, 1)";   // muted steel-cyan
const SHAFT_MIST = "rgba(140, 120, 200, 1)";  // very faint violet-mist

/* ─── sessionStorage helpers ─────────────────────────────────────────────── */
function hasSeenLoader(): boolean {
  if (typeof window === "undefined") return true;
  try { return !!sessionStorage.getItem(SESSION_KEY); } catch { return true; }
}
function markLoaderSeen(): void {
  try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* noop */ }
}

/* ─── Canvas: editorial light-shaft wordmark ─────────────────────────────── */
function LightShaftCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxRaw = canvas.getContext("2d");
    if (!ctxRaw) return;
    /* alias as non-null so TypeScript is happy inside closures */
    const c = ctxRaw;

    /* performance: cap DPR at 1.5 */
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width  = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width  = w + "px";
      canvas.style.height = h + "px";
      c.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    let alive = true;
    const t0 = performance.now();

    /* ── shaft geometry (fewer, more restrained) ── */
    const NUM_SHAFTS = 8;
    const shafts = Array.from({ length: NUM_SHAFTS }, (_, i) => ({
      angle : (Math.PI * 2 * i) / NUM_SHAFTS + (Math.random() - 0.5) * 0.45,
      speed : (Math.random() * 0.022 + 0.006) * (Math.random() > 0.5 ? 1 : -1),
      width : Math.random() * 0.06 + 0.025,
      alpha : Math.random() * 0.11 + 0.04,
      isCyan: Math.random() > 0.45,
    }));

    /* ── draw loop ── */
    function draw(now: number) {
      if (!alive) return;
      const t  = (now - t0) / 1000;
      const W  = window.innerWidth;
      const H  = window.innerHeight;
      const cx = W / 2;
      const cy = H / 2;
      const maxR = Math.sqrt(cx * cx + cy * cy) * 1.08;

      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, W, H);

      /* dark charcoal bg */
      c.fillStyle = "#0a0d14";
      c.fillRect(0, 0, W, H);

      /* subtle vertical brightness band (gives the "column of light" feel) */
      const colGrad = c.createLinearGradient(cx - W * 0.28, 0, cx + W * 0.28, 0);
      colGrad.addColorStop(0,   "transparent");
      colGrad.addColorStop(0.5, "rgba(18,24,38,0.55)");
      colGrad.addColorStop(1,   "transparent");
      c.fillStyle = colGrad;
      c.fillRect(0, 0, W, H);

      /* god-ray shafts — very quiet */
      c.save();
      c.globalCompositeOperation = "lighter";
      for (const s of shafts) {
        const angle = prefersReduced ? s.angle : s.angle + s.speed * t;
        const x1 = cx + Math.cos(angle) * maxR;
        const y1 = cy + Math.sin(angle) * maxR;
        const x2 = cx + Math.cos(angle + s.width) * maxR;
        const y2 = cy + Math.sin(angle + s.width) * maxR;
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;

        const pulse = prefersReduced
          ? s.alpha
          : s.alpha * (0.65 + 0.35 * Math.sin(t * 0.9 + s.angle * 2.5));

        c.beginPath();
        c.moveTo(cx, cy);
        c.lineTo(x1, y1);
        c.lineTo(x2, y2);
        c.closePath();

        const g = c.createLinearGradient(cx, cy, mx, my);
        const col = s.isCyan ? SHAFT_CYAN : SHAFT_MIST;
        g.addColorStop(0,    col.replace("1)", `0)`));
        g.addColorStop(0.25, col.replace("1)", `${pulse})`));
        g.addColorStop(1,    col.replace("1)", `0)`));
        c.fillStyle = g;
        c.fill();
      }
      c.restore();

      /* central soft vignette glow */
      const vigR = prefersReduced ? 0.45 : 0.42 + 0.04 * Math.sin(t * 0.55);
      const vig = c.createRadialGradient(cx, cy * 0.88, 0, cx, cy * 0.88, maxR * vigR);
      vig.addColorStop(0,   "rgba(42,55,80,0.28)");
      vig.addColorStop(0.6, "rgba(20,28,48,0.10)");
      vig.addColorStop(1,   "rgba(0,0,0,0)");
      c.fillStyle = vig;
      c.fillRect(0, 0, W, H);

      /* ── wordmark ── */
      const fontSize = Math.min(W * 0.14, H * 0.19, 164);
      /* very gentle bob */
      const bob = prefersReduced ? 0 : Math.sin(t * 0.7) * 3;
      const textY = cy - fontSize * 0.08 + bob;

      /* soft diffuse glow behind text — not a hard outline */
      c.save();
      c.shadowColor = "rgba(50,170,220,0.30)";
      c.shadowBlur  = 60;
      c.font = `700 ${fontSize}px var(--font-inter,Inter,'Geist',system-ui,sans-serif)`;
      c.textAlign    = "center";
      c.textBaseline = "middle";

      /* text fill: soft off-white */
      const tg = c.createLinearGradient(cx - fontSize * 1.8, textY, cx + fontSize * 1.8, textY);
      tg.addColorStop(0,    "#b8c8d8");
      tg.addColorStop(0.38, "#e8eef4");
      tg.addColorStop(0.5,  "#f0f5fa");
      tg.addColorStop(0.62, "#e8eef4");
      tg.addColorStop(1,    "#b8c8d8");
      c.fillStyle = tg;
      c.fillText("aIDEAS", cx, textY);
      c.restore();

      /* subtle separator line beneath wordmark */
      const lineW  = fontSize * 2.8;
      const lineY  = textY + fontSize * 0.58;
      const lineGr = c.createLinearGradient(cx - lineW / 2, lineY, cx + lineW / 2, lineY);
      lineGr.addColorStop(0,   "rgba(80,110,150,0)");
      lineGr.addColorStop(0.5, "rgba(80,120,160,0.22)");
      lineGr.addColorStop(1,   "rgba(80,110,150,0)");
      c.fillStyle = lineGr;
      c.fillRect(cx - lineW / 2, lineY, lineW, 1);

      /* sub-label */
      const subSize = Math.max(fontSize * 0.11, 11);
      c.save();
      c.font = `400 ${subSize}px var(--font-inter,Inter,'Geist',system-ui,sans-serif)`;
      c.textAlign    = "center";
      c.textBaseline = "middle";
      c.shadowBlur   = 0;
      c.fillStyle    = "rgba(140,155,175,0.5)";
      c.fillText(
        "AI & DATA SCIENCE ASSOCIATION OF STUDENTS",
        cx,
        lineY + subSize * 1.9
      );
      c.restore();

      if (!prefersReduced && alive) {
        rafRef.current = requestAnimationFrame(draw);
      }
    }

    if (prefersReduced) {
      draw(performance.now());
    } else {
      rafRef.current = requestAnimationFrame(draw);
    }

    return () => {
      alive = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, display: "block" }}
      aria-hidden="true"
    />
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
/*
 * FLASH FIX STRATEGY
 * ------------------
 * The component starts with `visible = "pending"`.
 * On first render (SSR or hydration) it renders a plain black overlay div.
 * This div is already in the DOM before any client effects run, so the
 * Hero is ALWAYS covered on initial paint.
 *
 * In the useEffect (client only) we check sessionStorage:
 *   - already seen → instantly remove the overlay (setVisible("hidden"))
 *   - not seen     → start canvas + timers (setVisible("showing"))
 *
 * The result: no Hero flash on first visit.
 * On return visits the overlay disappears in a single synchronous effect
 * before the first frame is painted by the browser.
 */

type LoaderState = "pending" | "showing" | "exiting" | "hidden";

export default function HomepageLoadingScreen() {
  const [state, setState] = useState<LoaderState>("pending");
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hasSeenLoader()) {
      /* Return visit: remove immediately — no canvas, no animation */
      setState("hidden");
      return;
    }

    /* First visit */
    markLoaderSeen();
    setState("showing");

    const minTimer = setTimeout(startExit, MIN_DISPLAY_MS);
    const safetyTimer = setTimeout(startExit, SAFETY_TIMEOUT_MS);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(safetyTimer);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  function startExit() {
    setState("exiting");
    exitTimerRef.current = setTimeout(() => setState("hidden"), 650);
  }

  if (state === "hidden") return null;

  /* "pending" renders a plain black panel (no canvas) to cover the Hero
     until the useEffect determines whether to show or hide.
     "showing" / "exiting" renders the full animated overlay. */
  const isAnimating = state === "showing" || state === "exiting";

  return (
    <div
      id="aideas-homepage-loader"
      aria-label="Loading aiDEAS"
      role="status"
      style={{
        position   : "fixed",
        inset      : 0,
        zIndex     : 9999,
        overflow   : "hidden",
        pointerEvents: state === "exiting" ? "none" : "all",
        background : isAnimating ? "transparent" : "#0a0d14",
        opacity    : state === "exiting" ? 0 : 1,
        transition : state === "exiting"
          ? "opacity 0.60s cubic-bezier(0.4,0,0.2,1)"
          : "none",
      }}
    >
      {isAnimating && <LightShaftCanvas />}
    </div>
  );
}
