"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ValuesConsoleProps {
  isTriggered: boolean;
}

const VALUES = [
  {
    id: "curiosity",
    key: "CURIOSITY",
    sub: "ASK HOW, NOT JUST WHAT",
    accent: "cyan",
    index: "01",
  },
  {
    id: "collaboration",
    key: "COLLABORATION",
    sub: "BETTER BUILT TOGETHER",
    accent: "purple",
    index: "02",
  },
  {
    id: "inclusivity",
    key: "INCLUSIVITY",
    sub: "BEGINNERS WELCOME",
    accent: "cyan",
    index: "03",
  },
  {
    id: "impact",
    key: "IMPACT",
    sub: "BUILD THINGS THAT OUTLAST THE SEMESTER",
    accent: "purple",
    index: "04",
  },
] as const;

export default function ValuesConsole({ isTriggered }: ValuesConsoleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  // Viewport visibility observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Slow automatic cycling (~4.5s per value)
  useEffect(() => {
    if (!isTriggered || !isVisible || hoveredIndex !== null || prefersReducedMotion) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % VALUES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isTriggered, isVisible, hoveredIndex, prefersReducedMotion]);

  const effectiveActive = hoveredIndex !== null ? hoveredIndex : activeIndex;
  const currentValue = VALUES[effectiveActive];

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={isTriggered ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.97 }}
      transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
      className="w-full rounded-2xl border border-[rgba(255,255,255,0.09)] bg-[#131824] p-3.5 sm:p-4 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.85)] font-sans text-left relative overflow-hidden"
    >
      {/* Ambient sheen — shifts with active value */}
      <div
        className={`pointer-events-none absolute -top-24 -right-24 w-60 h-60 rounded-full transition-opacity duration-700 ${
          currentValue.accent === "purple"
            ? "bg-[radial-gradient(circle,rgba(176,107,255,0.09)_0%,transparent_70%)]"
            : "bg-[radial-gradient(circle,rgba(56,209,255,0.09)_0%,transparent_70%)]"
        }`}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(56,209,255,0.05)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      {/* Frame header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.07)] pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.2)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.12)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.12)]" />
          </div>
          <span className="text-[11px] font-mono text-[var(--text-faint)] ml-2 tracking-wide flex items-center gap-1.5">
            <span className="text-[var(--cyan-bright)]">aiDEAS</span>
            <span className="opacity-40">{"//"}</span>
            <span>VALUES</span>
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(56,209,255,0.08)] px-2.5 py-0.5 text-[10px] font-mono text-[var(--cyan-bright)] border border-[rgba(56,209,255,0.2)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan-bright)] opacity-90" />
          4 CORE VALUES
        </span>
      </div>

      {/* Active value indicator strip */}
      <div className="flex items-center justify-between text-[10px] font-mono tracking-wider uppercase mb-2.5 px-2.5 py-1 bg-[#182030] rounded-lg border border-[rgba(255,255,255,0.05)]">
        {VALUES.map((v, i) => {
          const isActive = i === effectiveActive;
          const isCyan = v.accent === "cyan";
          return (
            <span
              key={v.id}
              className={`font-semibold flex items-center gap-1 transition-colors duration-300 ${
                isActive
                  ? isCyan
                    ? "text-[var(--cyan-bright)]"
                    : "text-[var(--purple-bright)]"
                  : "text-[var(--text-faint)] opacity-40"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  isActive
                    ? isCyan
                      ? "bg-[var(--cyan-bright)]"
                      : "bg-[var(--purple-bright)]"
                    : "bg-[rgba(255,255,255,0.18)]"
                }`}
              />
              {v.key}
            </span>
          );
        })}
      </div>

      {/* Values rows with vertical timeline */}
      <div className="relative pl-5 sm:pl-6 space-y-2">
        {/* Timeline track */}
        <div className="absolute left-2 sm:left-2.5 top-3 bottom-3 w-[2px] bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden">
          <motion.div
            className="w-full bg-gradient-to-b from-[var(--cyan-bright)] via-[var(--purple-bright)] to-[var(--cyan-bright)]"
            initial={{ height: "0%" }}
            animate={{ height: isTriggered ? "100%" : "0%" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
          />
        </div>

        {VALUES.map((v, i) => {
          const isActive = i === effectiveActive;
          const isCyan = v.accent === "cyan";

          return (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, x: -14 }}
              animate={isTriggered ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.22 + i * 0.12 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setActiveIndex(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setActiveIndex(i);
              }}
              className={`relative rounded-xl p-2.5 sm:p-3 transition-all duration-300 cursor-pointer select-none text-left ${
                isActive
                  ? isCyan
                    ? "border border-[rgba(56,209,255,0.38)] bg-[#1c2436] shadow-[0_10px_24px_-8px_rgba(0,0,0,0.65)] -translate-y-0.5"
                    : "border border-[rgba(176,107,255,0.38)] bg-[#211f35] shadow-[0_10px_24px_-8px_rgba(0,0,0,0.65)] -translate-y-0.5"
                  : "border border-[rgba(255,255,255,0.05)] bg-[#151b28]/60 opacity-60 hover:opacity-90 hover:border-[rgba(255,255,255,0.1)]"
              }`}
            >
              {/* Timeline node */}
              <div
                className={`absolute -left-[19px] sm:-left-[21px] top-4 rounded-full border border-[#131824] transition-all duration-300 ${
                  isActive
                    ? isCyan
                      ? "w-3 h-3 -ml-0.5 bg-[var(--cyan-bright)] shadow-[0_0_10px_rgba(56,209,255,0.8)]"
                      : "w-3 h-3 -ml-0.5 bg-[var(--purple-bright)] shadow-[0_0_10px_rgba(176,107,255,0.8)]"
                    : "w-2 h-2 bg-[rgba(255,255,255,0.22)]"
                }`}
              />

              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-[12px] font-mono font-bold tracking-wide transition-colors duration-300 ${
                        isActive
                          ? isCyan
                            ? "text-[var(--cyan-bright)]"
                            : "text-[var(--purple-bright)]"
                          : "text-white/80"
                      }`}
                    >
                      {v.key}
                    </span>
                  </div>
                  <p
                    className={`text-[10.5px] font-mono tracking-wide transition-colors duration-300 ${
                      isActive ? "text-white/75" : "text-[var(--text-faint)]"
                    }`}
                  >
                    {v.sub}
                  </p>
                </div>

                <span
                  className={`shrink-0 text-[11px] font-mono font-bold transition-colors duration-300 ${
                    isActive
                      ? isCyan
                        ? "text-[var(--cyan-bright)] opacity-60"
                        : "text-[var(--purple-bright)] opacity-60"
                      : "text-[rgba(255,255,255,0.12)]"
                  }`}
                >
                  {v.index}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Console footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isTriggered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.75 }}
        className="mt-2.5 pt-2 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between text-[10px] font-mono text-[var(--text-faint)]"
      >
        <span className="flex items-center gap-1.5 truncate">
          <span className="text-[var(--cyan-bright)]">●</span>
          <span>Curiosity · Collaboration · Inclusivity · Impact</span>
        </span>
        <span className="hidden sm:inline text-[var(--text-faint)] opacity-60 ml-2 shrink-0">
          PVGCOET AI &amp; DS
        </span>
      </motion.div>
    </motion.div>
  );
}
