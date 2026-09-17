"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface WorkshopConsoleProps {
  isTriggered: boolean;
}

export default function WorkshopConsole({ isTriggered }: WorkshopConsoleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Active event state (0: Computer Vision, 1: Generative AI, 2: 24 HR Hackathon)
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

  // Viewport visibility observer to pause cycling when off-screen
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

  // Events configuration
  const events = [
    {
      id: "cv",
      title: "COMPUTER VISION",
      type: "Workshop",
      date: "OCT 12",
      seats: "24 seats",
      seatsLeft: "8 left",
      accent: "cyan",
      tags: ["PyTorch", "YOLOv8"],
      category: "WORKSHOPS",
    },
    {
      id: "genai",
      title: "GENERATIVE AI",
      type: "Workshop",
      date: "OCT 26",
      seats: "32 seats",
      seatsLeft: "Full",
      accent: "purple",
      tags: ["Transformers", "RAG"],
      category: "WORKSHOPS",
    },
    {
      id: "hackathon",
      title: "24 HR HACKATHON",
      type: "Flagship Sprint",
      date: "NOV 14–15",
      seats: "18 TEAMS",
      seatsLeft: "6 MENTORS",
      accent: "grad",
      tags: ["Open Track", "AI/DS"],
      category: "HACKATHONS",
    },
  ];

  // Very slow, deliberate automatic focus switching (Linear choreography: ~4.8s per event)
  useEffect(() => {
    if (!isTriggered || !isVisible || hoveredIndex !== null || prefersReducedMotion) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % events.length);
    }, 4800);

    return () => clearInterval(interval);
  }, [isTriggered, isVisible, hoveredIndex, prefersReducedMotion, events.length]);

  const effectiveActive = hoveredIndex !== null ? hoveredIndex : activeIndex;
  const currentEvent = events[effectiveActive];

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={isTriggered ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.97 }}
      transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
      className="workshop-container w-full rounded-2xl border border-[rgba(255,255,255,0.09)] bg-[#131824] p-3.5 sm:p-4 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.85)] font-sans text-left relative overflow-hidden"
    >
      {/* Subtle ambient lighting - responsive to active event's accent */}
      <div
        className={`pointer-events-none absolute -top-24 -right-24 w-60 h-60 rounded-full transition-opacity duration-700 ${
          currentEvent.accent === "purple"
            ? "bg-[radial-gradient(circle,rgba(176,107,255,0.09)_0%,transparent_70%)]"
            : "bg-[radial-gradient(circle,rgba(56,209,255,0.09)_0%,transparent_70%)]"
        }`}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(56,209,255,0.05)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      {/* Frame Header Bar */}
      <div className="workshop-header flex items-center justify-between border-b border-[rgba(255,255,255,0.07)] pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.2)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.12)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.12)]" />
          </div>
          <span className="text-[11px] font-mono text-[var(--text-faint)] ml-2 tracking-wide flex items-center gap-1.5">
            <span className="text-[var(--cyan-bright)]">aiDEAS</span>
            <span className="opacity-40">{"//"}</span>
            <span>WORKSHOP LAB</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(56,209,255,0.08)] px-2.5 py-0.5 text-[10px] font-mono text-[var(--cyan-bright)] border border-[rgba(56,209,255,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan-bright)] opacity-90" />
            SCHEDULED • 3 SESSIONS
          </span>
        </div>
      </div>

      {/* Workflow Category Indicator - Subtle state reflection */}
      <div className="workshop-cat-bar flex items-center justify-between text-[10px] font-mono tracking-wider uppercase text-[var(--text-faint)] mb-2.5 px-2.5 py-1 bg-[#182030] rounded-lg border border-[rgba(255,255,255,0.05)]">
        <span
          className={`font-semibold flex items-center gap-1.5 transition-colors duration-400 ${
            currentEvent.category === "WORKSHOPS"
              ? "text-[var(--cyan-bright)] drop-shadow-[0_0_6px_rgba(56,209,255,0.45)]"
              : "text-[var(--text-faint)] opacity-60"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              currentEvent.category === "WORKSHOPS" ? "bg-[var(--cyan-bright)]" : "bg-[rgba(255,255,255,0.25)]"
            }`}
          />
          WORKSHOPS
        </span>
        <span className="text-[rgba(255,255,255,0.2)]">•</span>
        <span
          className={`font-semibold flex items-center gap-1.5 transition-colors duration-400 ${
            currentEvent.category === "HACKATHONS"
              ? "text-[var(--purple-bright)] drop-shadow-[0_0_6px_rgba(176,107,255,0.45)]"
              : "text-[var(--text-faint)] opacity-60"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              currentEvent.category === "HACKATHONS" ? "bg-[var(--purple-bright)]" : "bg-[rgba(255,255,255,0.25)]"
            }`}
          />
          HACKATHONS
        </span>
        <span className="text-[rgba(255,255,255,0.2)]">•</span>
        <span className="text-white/60 flex items-center gap-1">BUILDING</span>
        <span className="text-[rgba(255,255,255,0.2)]">•</span>
        <span className="text-[var(--cyan-bright)]/60 flex items-center gap-1">COLLABORATION</span>
      </div>

      {/* Events List with Connected Timeline */}
      <div className="relative pl-5 sm:pl-6 space-y-2.5">
        {/* Subtle Vertical Timeline Track */}
        <div className="absolute left-2 sm:left-2.5 top-3 bottom-3 w-[2px] bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden">
          <motion.div
            className="w-full bg-gradient-to-b from-[var(--cyan-bright)] via-[var(--purple-bright)] to-[var(--cyan-bright)]"
            initial={{ height: "0%" }}
            animate={{ height: isTriggered ? "100%" : "0%" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
          />
        </div>

        {events.map((ev, i) => {
          const isActive = i === effectiveActive;
          const isCyan = ev.accent === "cyan";
          const isPurple = ev.accent === "purple";

          return (
            <motion.div
              key={ev.title}
              initial={{ opacity: 0, x: -14 }}
              animate={isTriggered ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.22 + i * 0.14 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setActiveIndex(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActiveIndex(i);
                }
              }}
              className={`relative rounded-xl p-2.5 sm:p-3 transition-all duration-400 cursor-pointer select-none text-left ${
                isActive
                  ? isCyan
                    ? "workshop-card-active-cyan border border-[rgba(56,209,255,0.38)] bg-[#1c2436] shadow-[0_10px_24px_-8px_rgba(0,0,0,0.65)] -translate-y-0.5"
                    : isPurple
                    ? "workshop-card-active-purple border border-[rgba(176,107,255,0.38)] bg-[#211f35] shadow-[0_10px_24px_-8px_rgba(0,0,0,0.65)] -translate-y-0.5"
                    : "workshop-card-active-cyan border border-[rgba(56,209,255,0.35)] bg-[#1e2336] shadow-[0_10px_24px_-8px_rgba(0,0,0,0.65)] -translate-y-0.5"
                  : "workshop-card-inactive border border-[rgba(255,255,255,0.05)] bg-[#151b28]/60 opacity-65 hover:opacity-90 hover:border-[rgba(255,255,255,0.1)]"
              }`}
            >
              {/* Timeline node marker on the vertical line */}
              <div
                className={`absolute -left-[19px] sm:-left-[21px] top-4 rounded-full border border-[#131824] transition-all duration-400 ${
                  isActive
                    ? isCyan
                      ? "w-3 h-3 -ml-0.5 bg-[var(--cyan-bright)] shadow-[0_0_10px_rgba(56,209,255,0.8)]"
                      : isPurple
                      ? "w-3 h-3 -ml-0.5 bg-[var(--purple-bright)] shadow-[0_0_10px_rgba(176,107,255,0.8)]"
                      : "w-3 h-3 -ml-0.5 bg-gradient-to-r from-[var(--cyan-bright)] to-[var(--purple-bright)] shadow-[0_0_10px_rgba(56,209,255,0.8)]"
                    : "w-2 h-2 bg-[rgba(255,255,255,0.22)]"
                }`}
              />

              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`workshop-event-title text-[12px] sm:text-[13px] font-mono font-bold tracking-wide transition-colors duration-300 ${
                        isActive
                          ? isCyan
                            ? "text-[var(--cyan-bright)] drop-shadow-[0_0_6px_rgba(56,209,255,0.3)]"
                            : isPurple
                            ? "text-[var(--purple-bright)] drop-shadow-[0_0_6px_rgba(176,107,255,0.3)]"
                            : "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]"
                          : "text-white/80"
                      }`}
                    >
                      {ev.title}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors duration-300 ${
                        isActive
                          ? isCyan
                            ? "text-[var(--cyan-bright)] bg-[rgba(56,209,255,0.08)] border-[rgba(56,209,255,0.2)]"
                            : isPurple
                            ? "text-[var(--purple-bright)] bg-[rgba(176,107,255,0.08)] border-[rgba(176,107,255,0.2)]"
                            : "text-white bg-[rgba(255,255,255,0.08)] border-[rgba(255,255,255,0.15)]"
                          : "text-[var(--text-faint)] bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.04)]"
                      }`}
                    >
                      {ev.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[var(--text-dim)]">
                    <span
                      className={`workshop-event-title flex items-center gap-1 transition-colors duration-300 ${
                        isActive ? "text-white font-medium" : "text-white/70"
                      }`}
                    >
                      <span className="text-[var(--text-faint)]">Date:</span> {ev.date}
                    </span>
                    <span className="text-[rgba(255,255,255,0.15)]">•</span>
                    <span
                      className={`workshop-event-title flex items-center gap-1 transition-colors duration-300 ${
                        isActive ? "text-white/90" : "text-white/60"
                      }`}
                    >
                      <span className="text-[var(--text-faint)]">Capacity:</span> {ev.seats}
                    </span>
                    <span className="text-[rgba(255,255,255,0.15)]">•</span>
                    <span
                      className={`transition-colors duration-300 ${
                        ev.seatsLeft === "Full"
                          ? isActive
                            ? "text-[var(--purple-bright)] font-semibold"
                            : "text-[var(--purple-bright)]/70 font-medium"
                          : isActive
                          ? "text-emerald-400 font-semibold"
                          : "text-emerald-400/70 font-medium"
                      }`}
                    >
                      {ev.seatsLeft}
                    </span>
                  </div>
                </div>

                {/* Tech tags */}
                <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                  <div className="flex gap-1">
                    {ev.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors duration-300 ${
                          isActive
                            ? isCyan
                              ? "text-cyan-200 bg-[rgba(56,209,255,0.08)] border-[rgba(56,209,255,0.22)]"
                              : isPurple
                              ? "text-purple-200 bg-[rgba(176,107,255,0.08)] border-[rgba(176,107,255,0.22)]"
                              : "text-white bg-[rgba(255,255,255,0.08)] border-[rgba(255,255,255,0.18)]"
                            : "text-[var(--text-faint)] bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.04)]"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Console Bottom Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isTriggered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.65 }}
        className="mt-2.5 pt-2 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between text-[10px] font-mono text-[var(--text-faint)]"
      >
        <span className="flex items-center gap-1.5 truncate">
          <span className="text-[var(--cyan-bright)]">●</span>
          <span>Open to all branches</span>
          <span className="text-[rgba(255,255,255,0.2)]">•</span>
          <span className="text-white/80">Industry Mentors</span>
        </span>
        <span className="hidden sm:inline text-[var(--text-faint)] opacity-60 ml-2 shrink-0">
          PVGCOET Campus
        </span>
      </motion.div>
    </motion.div>
  );
}
