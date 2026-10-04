"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";

const MAX_DPR = 2;
const TAU = Math.PI * 2;
const MIN_RADIUS = 0.6;
const MAX_DOTS = 1024;
const PERSPECTIVE = 3.5;
const DEPTH_SIZE = 1;
const DEPTH_FADE = 1;

function clamp01(x: number): number {
    return x < 0 ? 0 : x > 1 ? 1 : x;
}

function dotsN(base: number, n: number): number {
    const v = Math.round(base * n);
    return v < 1 ? 1 : v;
}

function dotsCbrt(base: number, n: number): number {
    const v = Math.round(base * Math.pow(n, 1 / 3));
    return v < 1 ? 1 : v;
}

function fib(i: number, n: number): [number, number, number] {
    const y = 1 - (i / Math.max(1, n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = 2.399963 * i;
    return [Math.cos(th) * r, y, Math.sin(th) * r];
}

type Dot = [number, number, number, number?, number?, string?];

function spin(p: Dot, yaw: number, pitch: number): Dot {
    const ca = Math.cos(yaw);
    const sa = Math.sin(yaw);
    const rx = p[0] * ca - p[2] * sa;
    let rz = p[0] * sa + p[2] * ca;
    const co = Math.cos(pitch);
    const so = Math.sin(pitch);
    const ry = p[1] * co - rz * so;
    rz = p[1] * so + rz * co;
    return [rx, ry, rz, p[3], p[4], p[5]];
}

type Params = {
    n: number;
    sp: number;
    ds: number;
    yw: number;
    sn: number;
    pc: number;
    t: number;
    dot: string;
    acc: string;
};

type Emit = (x: number, y: number, r: number, a: number, col: string) => void;

function project(
    pts: Dot[],
    size: number,
    baseSpread: number,
    P: Params,
    emit: Emit
) {
    const c = size / 2;
    const R = size * baseSpread * P.sp;
    const pv = PERSPECTIVE;

    const yaw = P.yw + TAU * P.sn * P.t;
    const list: Array<[number, number, number, number, string, number]> = [];
    for (const p of pts) {
        const q = spin(p, yaw, P.pc);
        const z = q[2];
        const s = pv / (pv - z);
        const f = clamp01((z + 1.1) / 2.2);
        list.push([
            c + q[0] * R * s,
            c + q[1] * R * s,
            P.ds * (0.4 + 1.6 * DEPTH_SIZE * f) * s * (q[3] === undefined ? 1 : q[3]),
            (0.07 + 0.93 * Math.pow(f, 1.55 * DEPTH_FADE)) * (q[4] === undefined ? 1 : q[4]),
            q[5] || P.dot,
            z,
        ]);
    }
    list.sort((a, b) => a[5] - b[5]);
    for (const d of list) emit(d[0], d[1], d[2], d[3], d[4]);
}

const fitCache = new Map<string, number>();
function autoFit(
    size: number,
    baseSpread: number,
    frameFn: (t: number, P: Params, out: Dot[]) => void,
    P: Params,
    restYaw: number,
    restPitch: number
): number {
    const key = size + "/" + baseSpread + "/" + P.n + "/" + P.sp + "/" + restYaw + "/" + restPitch + "/" + P.sn;
    const hit = fitCache.get(key);
    if (hit !== undefined) return hit;
    const half = size / 2;
    let ext = 0;
    const probe: Params = { ...P, ds: 1, dot: "#fff", acc: "#fff", t: 0, yw: restYaw, pc: restPitch };
    const emit: Emit = (x, y, r, a) => {
        if (a <= 0.05 || r <= 0.15) return;
        ext = Math.max(ext, Math.abs(x - half) + 0.5 * r, Math.abs(y - half) + 0.5 * r);
    };
    for (let k = 0; k < 20; k += 1) {
        probe.t = k / 20;
        const out: Dot[] = [];
        frameFn(probe.t, probe, out);
        project(out, size, baseSpread, probe, emit);
    }
    const fit = ext > 1 ? Math.max(0.55, Math.min(1.7, (0.415 * size) / ext)) : 1;
    fitCache.set(key, fit);
    return fit;
}

function dotScaleFor(size: number): number {
    if (size <= 46) return 0.4;
    if (size <= 190) return 0.4 + ((size - 46) / 144) * 0.6;
    if (size <= 340) return 1 + ((size - 190) / 150) * 0.55;
    return 1.55;
}

type RGBA = [number, number, number, number];

function parseColor(input: string | undefined, fb: RGBA): RGBA {
    if (!input) return fb;
    const str = String(input).trim();
    if (str.charAt(0) === "#") {
        let hex = str.slice(1);
        if (hex.length === 3 || hex.length === 4) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + (hex.length === 4 ? hex[3] + hex[3] : "");
        }
        if (hex.length >= 6) {
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            const a = hex.length >= 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
            if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return [r, g, b, a];
        }
        return fb;
    }
    const m = str.match(/[\d.]+/g);
    if (m && m.length >= 3) {
        return [
            Math.min(255, parseFloat(m[0])),
            Math.min(255, parseFloat(m[1])),
            Math.min(255, parseFloat(m[2])),
            m.length >= 4 ? Math.min(1, parseFloat(m[3])) : 1,
        ];
    }
    return fb;
}

function css(c: RGBA): string {
    return "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + c[3] + ")";
}

function num(v: unknown, fb: number): number {
    return typeof v === "number" && isFinite(v) ? v : fb;
}

function clampN(v: number, lo: number, hi: number): number {
    return v < lo ? lo : v > hi ? hi : v;
}

export type Ball = { spread?: number; turn?: number; tilt?: number };
export type Pointer = { drag?: number; damping?: number };
const BALL_DEFAULTS: Required<Ball> = { spread: 100, turn: 0, tilt: 0 };
const POINTER_DEFAULTS: Required<Pointer> = { drag: 100, damping: 20 };

export interface OrbProps {
    style?: React.CSSProperties;
    className?: string;
    width?: number;
    height?: number;
    dotColor?: string;
    accentColor?: string;
    density?: number;
    dotSize?: number;
    speed?: number;
    spinTurns?: number;
    ball?: Ball;
    pointer?: Pointer;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Particle Gimbal / OrbGyro — Original Colors Preserved (#F4F1EA / #00CDFF)
// ─────────────────────────────────────────────────────────────────────────────

const GYRO_PERIOD = 6.2;
const GYRO_BASE_SPREAD = 0.29;

function frameGyro(t: number, P: Params, out: Dot[]) {
    const per = dotsN(40, P.n);

    for (let r = 0; r < 3; r += 1) {
        const rad = [1, 0.78, 0.56][r];
        for (let i = 0; i < per; i += 1) {
            const a = (i / per) * TAU;

            out.push(
                spin(
                    spin(
                        [Math.cos(a) * rad, Math.sin(a) * rad, 0, 0.8, 0.9, r === 1 ? P.acc : P.dot],
                        0,
                        (r + 1) * TAU * t
                    ),
                    1.05 * r,
                    0.3
                )
            );
        }
    }

    const core = dotsN(38, P.n);
    for (let i = 0; i < core; i += 1) {
        const q = spin(fib(i, core), -2 * TAU * t, 0.4);
        out.push([q[0] * 0.3, q[1] * 0.3, q[2] * 0.3, 0.85, 0.9, P.dot]);
    }
}

export function OrbGyro(props: OrbProps) {
    const {
        style,
        className = "",
        dotColor = "#F4F1EA",
        accentColor = "#00CDFF",
        density = 120,
        dotSize = 75,
        speed = 28,
        spinTurns = 1,
        ball,
        pointer,
        width,
        height,
    } = props;

    const ball_ = { ...BALL_DEFAULTS, ...(ball || {}) };
    const pointer_ = { ...POINTER_DEFAULTS, ...(pointer || {}) };

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sizeRef = useRef({ w: 0, h: 0 });
    sizeRef.current = { w: num(width, 0), h: num(height, 0) };

    const vRef = useRef<Record<string, number | string>>({});
    vRef.current = {
        dot: dotColor,
        acc: accentColor,
        speed: clampN(num(speed, 28), -100, 100) / 50,
        density: clampN(num(density, 120), 20, 300) / 100,
        dotSize: clampN(num(dotSize, 75), 20, 300) / 100,
        spinTurns: Math.round(clampN(num(spinTurns, 1), -3, 3)),
        drag: clampN(num(pointer_.drag, 100), 0, 300) / 100,
        damping: clampN(num(pointer_.damping, 20), 1, 100),
        spread: clampN(num(ball_.spread, 95), 40, 180) / 100,
        turn: (clampN(num(ball_.turn, 0), -180, 180) * Math.PI) / 180,
        tilt: (clampN(num(ball_.tilt, 0), -90, 90) * Math.PI) / 180,
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const drag = { active: false, lx: 0, ly: 0, lt: 0, yaw: 0, pitch: 0, vx: 0, vy: 0 };
        let raf = 0;
        let last = performance.now();
        let phase = 0;
        let isVisible = true;

        const render = (now: number) => {
            if (!isVisible) return;
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            const v = vRef.current;

            const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
            const cw = sizeRef.current.w || canvas.clientWidth || 120;
            const ch = sizeRef.current.h || canvas.clientHeight || 120;
            const bw = Math.max(1, Math.round(cw * dpr));
            const bh = Math.max(1, Math.round(ch * dpr));
            if (canvas.width !== bw || canvas.height !== bh) {
                canvas.width = bw;
                canvas.height = bh;
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, cw, ch);

            phase = (phase + (dt * (v.speed as number)) / GYRO_PERIOD) % 1;
            if (phase < 0) phase += 1;

            const size = Math.max(4, Math.min(cw, ch));
            const bx = (cw - size) / 2;
            const by = (ch - size) / 2;

            const dotCol = css(parseColor(v.dot as string, [244, 241, 234, 1]));
            const accCol = css(parseColor(v.acc as string, [232, 133, 60, 1]));

            if (!drag.active) {
                const decay = Math.exp(-(v.damping as number) * 0.12 * dt);
                drag.yaw += drag.vx * dt;
                drag.pitch += drag.vy * dt;
                drag.vx *= decay;
                drag.vy *= decay;
            }
            const restPitch = v.tilt as number;
            drag.pitch = clampN(drag.pitch, -Math.PI / 2 - restPitch, Math.PI / 2 - restPitch);

            const P: Params = {
                n: v.density as number,
                sp: v.spread as number,
                ds: dotScaleFor(size) * (v.dotSize as number),
                yw: (v.turn as number) + drag.yaw,
                sn: v.spinTurns as number,
                pc: restPitch + drag.pitch,
                t: phase,
                dot: dotCol,
                acc: accCol,
            };

            const fit = autoFit(size, GYRO_BASE_SPREAD, frameGyro, P, v.turn as number, restPitch);
            const half = size / 2;

            const out: Dot[] = [];
            frameGyro(phase, P, out);
            let drawn = 0;
            project(out, size, GYRO_BASE_SPREAD, P, (x, y, r, a, col) => {
                if (drawn >= MAX_DOTS) return;

                const rr = r * (0.55 + 0.45 * fit);
                if (rr <= 0.05 || a <= 0.004) return;
                const cx = bx + half + (x - half) * fit;
                const cy = by + half + (y - half) * fit;

                let dr = rr;
                let da = Math.min(1, a);
                if (dr < MIN_RADIUS) {
                    da *= (dr / MIN_RADIUS) * (dr / MIN_RADIUS);
                    dr = MIN_RADIUS;
                }
                ctx.globalAlpha = da;
                ctx.fillStyle = col;
                ctx.beginPath();
                ctx.arc(cx, cy, dr, 0, TAU);
                ctx.fill();
                drawn += 1;
            });
            ctx.globalAlpha = 1;

            raf = requestAnimationFrame(render);
        };

        const onDown = (e: PointerEvent) => {
            if ((vRef.current.drag as number) <= 0) return;
            drag.active = true;
            drag.lx = e.clientX;
            drag.ly = e.clientY;
            drag.lt = performance.now();
            drag.vx = 0;
            drag.vy = 0;
            try {
                canvas.setPointerCapture(e.pointerId);
            } catch {}
        };
        const onMove = (e: PointerEvent) => {
            if (!drag.active) return;
            const k = (((vRef.current.drag as number) * TAU) / Math.max(1, canvas.clientWidth || 120));
            const dx = (e.clientX - drag.lx) * k;
            const dy = (e.clientY - drag.ly) * k;
            const now2 = performance.now();
            const span = Math.max(1, now2 - drag.lt);
            drag.lx = e.clientX;
            drag.ly = e.clientY;
            drag.lt = now2;

            drag.yaw -= dx;
            drag.pitch += dy;
            drag.vx = (-dx / span) * 1000;
            drag.vy = (dy / span) * 1000;
        };
        const onUp = () => {
            drag.active = false;
        };

        canvas.addEventListener("pointerdown", onDown);
        canvas.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);

        const observer = new IntersectionObserver(([entry]) => {
            const visible = entry?.isIntersecting ?? true;
            if (visible && !isVisible) {
                isVisible = true;
                last = performance.now();
                raf = requestAnimationFrame(render);
            } else if (!visible && isVisible) {
                isVisible = false;
                cancelAnimationFrame(raf);
            }
        }, { threshold: 0.05 });
        observer.observe(canvas);

        raf = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(raf);
            observer.disconnect();
            canvas.removeEventListener("pointerdown", onDown);
            canvas.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointercancel", onUp);
        };
    }, []);

    return (
        <div
            className={className}
            style={{
                position: "relative",
                overflow: "hidden",
                minWidth: 24,
                minHeight: 24,
                width: typeof width === "number" && width > 0 ? width : "100%",
                height: typeof height === "number" && height > 0 ? height : "100%",
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
                    touchAction: "none",
                }}
            />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Particle Enfold / OrbGrid — Original Colors Preserved (#F4F1EA / #00FFBE)
// ─────────────────────────────────────────────────────────────────────────────

const GRID_PERIOD = 5.0;
const GRID_BASE_SPREAD = 0.28;

function frameGrid(t: number, P: Params, out: Dot[]) {
    const k = 0.5 - 0.5 * Math.cos(TAU * t);

    const m = dotsCbrt(2, P.n);
    for (let x = -m; x <= m; x += 1) {
        for (let y = -m; y <= m; y += 1) {
            for (let z = -m; z <= m; z += 1) {
                const p = [(x / m) * 0.62, (y / m) * 0.62, (z / m) * 0.62];
                const len = Math.hypot(p[0], p[1], p[2]);

                const u = len < 1e-6 ? p : [p[0] / len, p[1] / len, p[2] / len];
                const corner = Math.abs(x) === m && Math.abs(y) === m && Math.abs(z) === m;
                out.push(
                    spin(
                        [
                            p[0] + (u[0] - p[0]) * k,
                            p[1] + (u[1] - p[1]) * k,
                            p[2] + (u[2] - p[2]) * k,
                            corner ? 1.3 : 0.8,
                            0.9,
                            corner ? P.acc : P.dot,
                        ],
                        TAU * t,
                        0.42
                    )
                );
            }
        }
    }
}

export function OrbGrid(props: OrbProps) {
    const {
        style,
        className = "",
        dotColor = "#F4F1EA",
        accentColor = "#00FFBE",
        density = 130,
        dotSize = 75,
        speed = 25,
        spinTurns = 1,
        ball,
        pointer,
        width,
        height,
    } = props;

    const ball_ = { ...BALL_DEFAULTS, ...(ball || {}) };
    const pointer_ = { ...POINTER_DEFAULTS, ...(pointer || {}) };

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sizeRef = useRef({ w: 0, h: 0 });
    sizeRef.current = { w: num(width, 0), h: num(height, 0) };

    const vRef = useRef<Record<string, number | string>>({});
    vRef.current = {
        dot: dotColor,
        acc: accentColor,
        speed: clampN(num(speed, 25), -100, 100) / 50,
        density: clampN(num(density, 130), 20, 300) / 100,
        dotSize: clampN(num(dotSize, 75), 20, 300) / 100,
        spinTurns: Math.round(clampN(num(spinTurns, 1), -3, 3)),
        drag: clampN(num(pointer_.drag, 100), 0, 300) / 100,
        damping: clampN(num(pointer_.damping, 20), 1, 100),
        spread: clampN(num(ball_.spread, 95), 40, 180) / 100,
        turn: (clampN(num(ball_.turn, 0), -180, 180) * Math.PI) / 180,
        tilt: (clampN(num(ball_.tilt, 0), -90, 90) * Math.PI) / 180,
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const drag = { active: false, lx: 0, ly: 0, lt: 0, yaw: 0, pitch: 0, vx: 0, vy: 0 };
        let raf = 0;
        let last = performance.now();
        let phase = 0;
        let isVisible = true;

        const render = (now: number) => {
            if (!isVisible) return;
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            const v = vRef.current;

            const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR) || 1;
            const cw = sizeRef.current.w || canvas.clientWidth || 120;
            const ch = sizeRef.current.h || canvas.clientHeight || 120;
            const bw = Math.max(1, Math.round(cw * dpr));
            const bh = Math.max(1, Math.round(ch * dpr));
            if (canvas.width !== bw || canvas.height !== bh) {
                canvas.width = bw;
                canvas.height = bh;
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, cw, ch);

            phase = (phase + (dt * (v.speed as number)) / GRID_PERIOD) % 1;
            if (phase < 0) phase += 1;

            const size = Math.max(4, Math.min(cw, ch));
            const bx = (cw - size) / 2;
            const by = (ch - size) / 2;

            const dotCol = css(parseColor(v.dot as string, [244, 241, 234, 1]));
            const accCol = css(parseColor(v.acc as string, [232, 133, 60, 1]));

            if (!drag.active) {
                const decay = Math.exp(-(v.damping as number) * 0.12 * dt);
                drag.yaw += drag.vx * dt;
                drag.pitch += drag.vy * dt;
                drag.vx *= decay;
                drag.vy *= decay;
            }
            const restPitch = v.tilt as number;
            drag.pitch = clampN(drag.pitch, -Math.PI / 2 - restPitch, Math.PI / 2 - restPitch);

            const P: Params = {
                n: v.density as number,
                sp: v.spread as number,
                ds: dotScaleFor(size) * (v.dotSize as number),
                yw: (v.turn as number) + drag.yaw,
                sn: v.spinTurns as number,
                pc: restPitch + drag.pitch,
                t: phase,
                dot: dotCol,
                acc: accCol,
            };

            const fit = autoFit(size, GRID_BASE_SPREAD, frameGrid, P, v.turn as number, restPitch);
            const half = size / 2;

            const out: Dot[] = [];
            frameGrid(phase, P, out);
            let drawn = 0;
            project(out, size, GRID_BASE_SPREAD, P, (x, y, r, a, col) => {
                if (drawn >= MAX_DOTS) return;

                const rr = r * (0.55 + 0.45 * fit);
                if (rr <= 0.05 || a <= 0.004) return;
                const cx = bx + half + (x - half) * fit;
                const cy = by + half + (y - half) * fit;

                let dr = rr;
                let da = Math.min(1, a);
                if (dr < MIN_RADIUS) {
                    da *= (dr / MIN_RADIUS) * (dr / MIN_RADIUS);
                    dr = MIN_RADIUS;
                }
                ctx.globalAlpha = da;
                ctx.fillStyle = col;
                ctx.beginPath();
                ctx.arc(cx, cy, dr, 0, TAU);
                ctx.fill();
                drawn += 1;
            });
            ctx.globalAlpha = 1;

            raf = requestAnimationFrame(render);
        };

        const onDown = (e: PointerEvent) => {
            if ((vRef.current.drag as number) <= 0) return;
            drag.active = true;
            drag.lx = e.clientX;
            drag.ly = e.clientY;
            drag.lt = performance.now();
            drag.vx = 0;
            drag.vy = 0;
            try {
                canvas.setPointerCapture(e.pointerId);
            } catch {}
        };
        const onMove = (e: PointerEvent) => {
            if (!drag.active) return;
            const k = (((vRef.current.drag as number) * TAU) / Math.max(1, canvas.clientWidth || 120));
            const dx = (e.clientX - drag.lx) * k;
            const dy = (e.clientY - drag.ly) * k;
            const now2 = performance.now();
            const span = Math.max(1, now2 - drag.lt);
            drag.lx = e.clientX;
            drag.ly = e.clientY;
            drag.lt = now2;

            drag.yaw -= dx;
            drag.pitch += dy;
            drag.vx = (-dx / span) * 1000;
            drag.vy = (dy / span) * 1000;
        };
        const onUp = () => {
            drag.active = false;
        };

        canvas.addEventListener("pointerdown", onDown);
        canvas.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);

        const observer = new IntersectionObserver(([entry]) => {
            const visible = entry?.isIntersecting ?? true;
            if (visible && !isVisible) {
                isVisible = true;
                last = performance.now();
                raf = requestAnimationFrame(render);
            } else if (!visible && isVisible) {
                isVisible = false;
                cancelAnimationFrame(raf);
            }
        }, { threshold: 0.05 });
        observer.observe(canvas);

        raf = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(raf);
            observer.disconnect();
            canvas.removeEventListener("pointerdown", onDown);
            canvas.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointercancel", onUp);
        };
    }, []);

    return (
        <div
            className={className}
            style={{
                position: "relative",
                overflow: "hidden",
                minWidth: 24,
                minHeight: 24,
                width: typeof width === "number" && width > 0 ? width : "100%",
                height: typeof height === "number" && height > 0 ? height : "100%",
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
                    touchAction: "none",
                }}
            />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Particle Dome / OrbBand — Original Colors Preserved (#F4F1EA / #00FFE5)
// ─────────────────────────────────────────────────────────────────────────────

const BAND_PERIOD = 5.2;
const BAND_BASE_SPREAD = 0.3;

function frameBand(t: number, P: Params, out: Dot[]) {
    const n = dotsN(150, P.n);

    const az = TAU * t;
    const el = 0.9 * Math.sin(TAU * t);
    const ax = [Math.cos(az) * Math.cos(el), Math.sin(el), Math.sin(az) * Math.cos(el)];
    for (let i = 0; i < n; i += 1) {
        const q = fib(i, n);
        const g = Math.exp(-Math.pow(5 * Math.abs(q[0] * ax[0] + q[1] * ax[1] + q[2] * ax[2]), 2));
        out.push(spin([q[0], q[1], q[2], 0.5 + 1.5 * g, 0.22 + 0.78 * g, g > 0.7 ? P.acc : P.dot], 0, 0.36));
    }
}

export function OrbBand(props: OrbProps) {
    const {
        style,
        className = "",
        dotColor = "#F4F1EA",
        accentColor = "#00FFE5",
        density = 140,
        dotSize = 75,
        speed = 26,
        spinTurns = 1,
        ball,
        pointer,
        width,
        height,
    } = props;

    const ball_ = { ...BALL_DEFAULTS, ...(ball || {}) };
    const pointer_ = { ...POINTER_DEFAULTS, ...(pointer || {}) };

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sizeRef = useRef({ w: 0, h: 0 });
    sizeRef.current = { w: num(width, 0), h: num(height, 0) };

    const vRef = useRef<Record<string, number | string>>({});
    vRef.current = {
        dot: dotColor,
        acc: accentColor,
        speed: clampN(num(speed, 26), -100, 100) / 50,
        density: clampN(num(density, 140), 20, 300) / 100,
        dotSize: clampN(num(dotSize, 75), 20, 300) / 100,
        spinTurns: Math.round(clampN(num(spinTurns, 1), -3, 3)),
        drag: clampN(num(pointer_.drag, 100), 0, 300) / 100,
        damping: clampN(num(pointer_.damping, 20), 1, 100),
        spread: clampN(num(ball_.spread, 95), 40, 180) / 100,
        turn: (clampN(num(ball_.turn, -180), -180, 180) * Math.PI) / 180,
        tilt: (clampN(num(ball_.tilt, -90), -90, 90) * Math.PI) / 180,
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const drag = { active: false, lx: 0, ly: 0, lt: 0, yaw: 0, pitch: 0, vx: 0, vy: 0 };
        let raf = 0;
        let last = performance.now();
        let phase = 0;
        let isVisible = true;

        const render = (now: number) => {
            if (!isVisible) return;
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            const v = vRef.current;

            const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR) || 1;
            const cw = sizeRef.current.w || canvas.clientWidth || 120;
            const ch = sizeRef.current.h || canvas.clientHeight || 120;
            const bw = Math.max(1, Math.round(cw * dpr));
            const bh = Math.max(1, Math.round(ch * dpr));
            if (canvas.width !== bw || canvas.height !== bh) {
                canvas.width = bw;
                canvas.height = bh;
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, cw, ch);

            phase = (phase + (dt * (v.speed as number)) / BAND_PERIOD) % 1;
            if (phase < 0) phase += 1;

            const size = Math.max(4, Math.min(cw, ch));
            const bx = (cw - size) / 2;
            const by = (ch - size) / 2;

            const dotCol = css(parseColor(v.dot as string, [244, 241, 234, 1]));
            const accCol = css(parseColor(v.acc as string, [232, 133, 60, 1]));

            if (!drag.active) {
                const decay = Math.exp(-(v.damping as number) * 0.12 * dt);
                drag.yaw += drag.vx * dt;
                drag.pitch += drag.vy * dt;
                drag.vx *= decay;
                drag.vy *= decay;
            }
            const restPitch = v.tilt as number;
            drag.pitch = clampN(drag.pitch, -Math.PI / 2 - restPitch, Math.PI / 2 - restPitch);

            const P: Params = {
                n: v.density as number,
                sp: v.spread as number,
                ds: dotScaleFor(size) * (v.dotSize as number),
                yw: (v.turn as number) + drag.yaw,
                sn: v.spinTurns as number,
                pc: restPitch + drag.pitch,
                t: phase,
                dot: dotCol,
                acc: accCol,
            };

            const fit = autoFit(size, BAND_BASE_SPREAD, frameBand, P, v.turn as number, restPitch);
            const half = size / 2;

            const out: Dot[] = [];
            frameBand(phase, P, out);
            let drawn = 0;
            project(out, size, BAND_BASE_SPREAD, P, (x, y, r, a, col) => {
                if (drawn >= MAX_DOTS) return;

                const rr = r * (0.55 + 0.45 * fit);
                if (rr <= 0.05 || a <= 0.004) return;
                const cx = bx + half + (x - half) * fit;
                const cy = by + half + (y - half) * fit;

                let dr = rr;
                let da = Math.min(1, a);
                if (dr < MIN_RADIUS) {
                    da *= (dr / MIN_RADIUS) * (dr / MIN_RADIUS);
                    dr = MIN_RADIUS;
                }
                ctx.globalAlpha = da;
                ctx.fillStyle = col;
                ctx.beginPath();
                ctx.arc(cx, cy, dr, 0, TAU);
                ctx.fill();
                drawn += 1;
            });
            ctx.globalAlpha = 1;

            raf = requestAnimationFrame(render);
        };

        const onDown = (e: PointerEvent) => {
            if ((vRef.current.drag as number) <= 0) return;
            drag.active = true;
            drag.lx = e.clientX;
            drag.ly = e.clientY;
            drag.lt = performance.now();
            drag.vx = 0;
            drag.vy = 0;
            try {
                canvas.setPointerCapture(e.pointerId);
            } catch {}
        };
        const onMove = (e: PointerEvent) => {
            if (!drag.active) return;
            const k = (((vRef.current.drag as number) * TAU) / Math.max(1, canvas.clientWidth || 120));
            const dx = (e.clientX - drag.lx) * k;
            const dy = (e.clientY - drag.ly) * k;
            const now2 = performance.now();
            const span = Math.max(1, now2 - drag.lt);
            drag.lx = e.clientX;
            drag.ly = e.clientY;
            drag.lt = now2;

            drag.yaw -= dx;
            drag.pitch += dy;
            drag.vx = (-dx / span) * 1000;
            drag.vy = (dy / span) * 1000;
        };
        const onUp = () => {
            drag.active = false;
        };

        canvas.addEventListener("pointerdown", onDown);
        canvas.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);

        const observer = new IntersectionObserver(([entry]) => {
            const visible = entry?.isIntersecting ?? true;
            if (visible && !isVisible) {
                isVisible = true;
                last = performance.now();
                raf = requestAnimationFrame(render);
            } else if (!visible && isVisible) {
                isVisible = false;
                cancelAnimationFrame(raf);
            }
        }, { threshold: 0.05 });
        observer.observe(canvas);

        raf = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(raf);
            observer.disconnect();
            canvas.removeEventListener("pointerdown", onDown);
            canvas.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointercancel", onUp);
        };
    }, []);

    return (
        <div
            className={className}
            style={{
                position: "relative",
                overflow: "hidden",
                minWidth: 24,
                minHeight: 24,
                width: typeof width === "number" && width > 0 ? width : "100%",
                height: typeof height === "number" && height > 0 ? height : "100%",
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
                    touchAction: "none",
                }}
            />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Particle Winding / OrbCoil — Original Colors Preserved (#F4F1EA / #00FFE5)
// ─────────────────────────────────────────────────────────────────────────────

const COIL_PERIOD = 6.0;
const COIL_BASE_SPREAD = 0.3;

function frameCoil(t: number, P: Params, out: Dot[]) {
    const n = dotsN(150, P.n);
    const turns = 2 + 6 * (0.5 - 0.5 * Math.cos(TAU * t));
    for (let i = 0; i < n; i += 1) {
        const u = (i / n + t) % 1;
        const th = Math.PI * u;
        const sr = Math.sin(th);
        const az = u * TAU * turns + TAU * t;
        const f = Math.pow(Math.sin(Math.PI * u), 0.45);

        out.push(
            spin([Math.cos(az) * sr, Math.cos(th), Math.sin(az) * sr, 0.6 + 0.9 * f, f, i % 15 === 0 ? P.acc : P.dot], 0.3, 0.36)
        );
    }
}

export function OrbCoil(props: OrbProps) {
    const {
        style,
        className = "",
        dotColor = "#F4F1EA",
        accentColor = "#00FFE5",
        density = 140,
        dotSize = 65,
        speed = 30,
        spinTurns = 2,
        ball,
        pointer,
        width,
        height,
    } = props;

    const ball_ = { ...BALL_DEFAULTS, ...(ball || {}) };
    const pointer_ = { ...POINTER_DEFAULTS, ...(pointer || {}) };

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sizeRef = useRef({ w: 0, h: 0 });
    sizeRef.current = { w: num(width, 0), h: num(height, 0) };

    const vRef = useRef<Record<string, number | string>>({});
    vRef.current = {
        dot: dotColor,
        acc: accentColor,
        speed: clampN(num(speed, 30), -100, 100) / 50,
        density: clampN(num(density, 140), 20, 300) / 100,
        dotSize: clampN(num(dotSize, 65), 20, 300) / 100,
        spinTurns: Math.round(clampN(num(spinTurns, 2), -3, 3)),
        drag: clampN(num(pointer_.drag, 100), 0, 300) / 100,
        damping: clampN(num(pointer_.damping, 47), 1, 100),
        spread: clampN(num(ball_.spread, 100), 40, 180) / 100,
        turn: (clampN(num(ball_.turn, -180), -180, 180) * Math.PI) / 180,
        tilt: (clampN(num(ball_.tilt, 16), -90, 90) * Math.PI) / 180,
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const drag = { active: false, lx: 0, ly: 0, lt: 0, yaw: 0, pitch: 0, vx: 0, vy: 0 };
        let raf = 0;
        let last = performance.now();
        let phase = 0;
        let isVisible = true;

        const render = (now: number) => {
            if (!isVisible) return;
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            const v = vRef.current;

            const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR) || 1;
            const cw = sizeRef.current.w || canvas.clientWidth || 120;
            const ch = sizeRef.current.h || canvas.clientHeight || 120;
            const bw = Math.max(1, Math.round(cw * dpr));
            const bh = Math.max(1, Math.round(ch * dpr));
            if (canvas.width !== bw || canvas.height !== bh) {
                canvas.width = bw;
                canvas.height = bh;
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, cw, ch);

            phase = (phase + (dt * (v.speed as number)) / COIL_PERIOD) % 1;
            if (phase < 0) phase += 1;

            const size = Math.max(4, Math.min(cw, ch));
            const bx = (cw - size) / 2;
            const by = (ch - size) / 2;

            const dotCol = css(parseColor(v.dot as string, [244, 241, 234, 1]));
            const accCol = css(parseColor(v.acc as string, [232, 133, 60, 1]));

            if (!drag.active) {
                const decay = Math.exp(-(v.damping as number) * 0.12 * dt);
                drag.yaw += drag.vx * dt;
                drag.pitch += drag.vy * dt;
                drag.vx *= decay;
                drag.vy *= decay;
            }
            const restPitch = v.tilt as number;
            drag.pitch = clampN(drag.pitch, -Math.PI / 2 - restPitch, Math.PI / 2 - restPitch);

            const P: Params = {
                n: v.density as number,
                sp: v.spread as number,
                ds: dotScaleFor(size) * (v.dotSize as number),
                yw: (v.turn as number) + drag.yaw,
                sn: v.spinTurns as number,
                pc: restPitch + drag.pitch,
                t: phase,
                dot: dotCol,
                acc: accCol,
            };

            const fit = autoFit(size, COIL_BASE_SPREAD, frameCoil, P, v.turn as number, restPitch);
            const half = size / 2;

            const out: Dot[] = [];
            frameCoil(phase, P, out);
            let drawn = 0;
            project(out, size, COIL_BASE_SPREAD, P, (x, y, r, a, col) => {
                if (drawn >= MAX_DOTS) return;

                const rr = r * (0.55 + 0.45 * fit);
                if (rr <= 0.05 || a <= 0.004) return;
                const cx = bx + half + (x - half) * fit;
                const cy = by + half + (y - half) * fit;

                let dr = rr;
                let da = Math.min(1, a);
                if (dr < MIN_RADIUS) {
                    da *= (dr / MIN_RADIUS) * (dr / MIN_RADIUS);
                    dr = MIN_RADIUS;
                }
                ctx.globalAlpha = da;
                ctx.fillStyle = col;
                ctx.beginPath();
                ctx.arc(cx, cy, dr, 0, TAU);
                ctx.fill();
                drawn += 1;
            });
            ctx.globalAlpha = 1;

            raf = requestAnimationFrame(render);
        };

        const onDown = (e: PointerEvent) => {
            if ((vRef.current.drag as number) <= 0) return;
            drag.active = true;
            drag.lx = e.clientX;
            drag.ly = e.clientY;
            drag.lt = performance.now();
            drag.vx = 0;
            drag.vy = 0;
            try {
                canvas.setPointerCapture(e.pointerId);
            } catch {}
        };
        const onMove = (e: PointerEvent) => {
            if (!drag.active) return;
            const k = (((vRef.current.drag as number) * TAU) / Math.max(1, canvas.clientWidth || 120));
            const dx = (e.clientX - drag.lx) * k;
            const dy = (e.clientY - drag.ly) * k;
            const now2 = performance.now();
            const span = Math.max(1, now2 - drag.lt);
            drag.lx = e.clientX;
            drag.ly = e.clientY;
            drag.lt = now2;

            drag.yaw -= dx;
            drag.pitch += dy;
            drag.vx = (-dx / span) * 1000;
            drag.vy = (dy / span) * 1000;
        };
        const onUp = () => {
            drag.active = false;
        };

        canvas.addEventListener("pointerdown", onDown);
        canvas.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);

        const observer = new IntersectionObserver(([entry]) => {
            const visible = entry?.isIntersecting ?? true;
            if (visible && !isVisible) {
                isVisible = true;
                last = performance.now();
                raf = requestAnimationFrame(render);
            } else if (!visible && isVisible) {
                isVisible = false;
                cancelAnimationFrame(raf);
            }
        }, { threshold: 0.05 });
        observer.observe(canvas);

        raf = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(raf);
            observer.disconnect();
            canvas.removeEventListener("pointerdown", onDown);
            canvas.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointercancel", onUp);
        };
    }, []);

    return (
        <div
            className={className}
            style={{
                position: "relative",
                overflow: "hidden",
                minWidth: 24,
                minHeight: 24,
                width: typeof width === "number" && width > 0 ? width : "100%",
                height: typeof height === "number" && height > 0 ? height : "100%",
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
                    touchAction: "none",
                }}
            />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Unified 2×2 Particle Panel: Black-on-Black Surface & Original Component Colors
// ─────────────────────────────────────────────────────────────────────────────

function ParticleTile({
    children,
    title,
}: {
    children: React.ReactNode;
    title: string;
}) {
    return (
        <div
            title={title}
            className="group relative w-full h-full bg-[#05070B] overflow-hidden select-none cursor-pointer"
        >
            {/* Seamless unified #05070B tile interior without separate box colors or hover shifts */}
            <div className="w-full h-full pointer-events-auto">
                {children}
            </div>
        </div>
    );
}

export default function ParticlePanel() {
    return (
        <div className="w-full max-w-[610px] h-full min-h-[460px] lg:min-h-[515px] xl:min-h-[525px] bg-[#05070B] rounded-2xl border border-white/[0.08] overflow-hidden relative shadow-[0_20px_40px_rgba(0,0,0,0.85)]">
            {/* Minimal 1px '+' cross divider structure */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/[0.08] z-10 pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/[0.08] z-10 pointer-events-none" />

            <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                {/* TOP LEFT: Particle Gimbal / OrbGyro (Original colors: #F4F1EA / #00CDFF) */}
                <ParticleTile title="Particle Gimbal">
                    <OrbGyro
                        dotColor="#F4F1EA"
                        accentColor="#00CDFF"
                        density={105}
                        dotSize={60}
                        speed={24}
                        spinTurns={1}
                        ball={{ spread: 80, turn: 0, tilt: 0 }}
                        pointer={{ drag: 100, damping: 20 }}
                    />
                </ParticleTile>

                {/* TOP RIGHT: Particle Enfold / OrbGrid (Original colors: #F4F1EA / #00FFBE) */}
                <ParticleTile title="Particle Enfold">
                    <OrbGrid
                        dotColor="#F4F1EA"
                        accentColor="#00FFBE"
                        density={105}
                        dotSize={60}
                        speed={22}
                        spinTurns={1}
                        ball={{ spread: 80, turn: 0, tilt: 0 }}
                        pointer={{ drag: 100, damping: 20 }}
                    />
                </ParticleTile>

                {/* BOTTOM LEFT: Particle Dome / OrbBand (Original colors: #F4F1EA / #00FFE5) */}
                <ParticleTile title="Particle Dome">
                    <OrbBand
                        dotColor="#F4F1EA"
                        accentColor="#00FFE5"
                        density={115}
                        dotSize={60}
                        speed={22}
                        spinTurns={1}
                        ball={{ spread: 80, turn: -180, tilt: -90 }}
                        pointer={{ drag: 100, damping: 20 }}
                    />
                </ParticleTile>

                {/* BOTTOM RIGHT: Particle Winding / OrbCoil (Original colors: #F4F1EA / #00FFE5) */}
                <ParticleTile title="Particle Winding">
                    <OrbCoil
                        dotColor="#F4F1EA"
                        accentColor="#00FFE5"
                        density={115}
                        dotSize={52}
                        speed={26}
                        spinTurns={2}
                        ball={{ spread: 85, turn: -180, tilt: 16 }}
                        pointer={{ drag: 100, damping: 47 }}
                    />
                </ParticleTile>
            </div>
        </div>
    );
}
