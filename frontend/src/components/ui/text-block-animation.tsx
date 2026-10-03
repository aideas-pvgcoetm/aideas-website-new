"use client";

import { useEffect, useRef } from "react";
import { type ReactNode } from "react";

// Blocks initialized in the same frame share one global layout refresh.
const pendingRefreshes = new Set<symbol>();
let refreshFrame: number | null = null;

function scheduleRefresh(refresh: () => void) {
  const request = Symbol();
  pendingRefreshes.add(request);
  if (refreshFrame === null) {
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = null;
      pendingRefreshes.clear();
      refresh();
    });
  }
  return () => {
    pendingRefreshes.delete(request);
    if (pendingRefreshes.size === 0 && refreshFrame !== null) {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = null;
    }
  };
}

interface TextBlockAnimationProps {
  children: ReactNode;
  deferUntilSectionInView?: boolean;
  animateOnScroll?: boolean;
  delay?: number;
  blockColor?: string;
  stagger?: number;
  duration?: number;
}

export default function TextBlockAnimation({
  children,
  deferUntilSectionInView = false,
  animateOnScroll = true,
  delay = 0,
  blockColor = "#35C7F3",
  stagger = 0.08,
  duration = 0.6,
}: TextBlockAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;
    let started = false;
    let cleanupAnimation: (() => void) | undefined;

    const initialize = async () => {
      if (started || disposed) return;
      started = true;
      const [{ gsap }, { SplitText }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/SplitText"),
        import("gsap/ScrollTrigger"),
      ]);
      // Imports cannot be cancelled; do not initialize an unmounted effect.
      if (disposed) return;
      gsap.registerPlugin(SplitText, ScrollTrigger);

      // Create SplitText
      const split = new SplitText(container, {
        type: "lines",
        linesClass: "block-line-parent",
      });

      const lines = split.lines;

      const context = gsap.context(() => {
        // Create wrapper divs and blocks
        const blocks: HTMLElement[] = [];
        lines.forEach((line) => {
          if (!line.parentNode) return;

          const wrapper = document.createElement("div");
          wrapper.style.position = "relative";
          wrapper.style.display = "block";
          wrapper.style.overflow = "hidden";

          const block = document.createElement("div");
          block.style.position = "absolute";
          block.style.top = "0";
          block.style.left = "0";
          block.style.width = "100%";
          block.style.height = "100%";
          block.style.backgroundColor = blockColor;
          block.style.zIndex = "2";
          block.style.transform = "scaleX(0)";
          block.style.transformOrigin = "left center";

          line.parentNode.insertBefore(wrapper, line);
          wrapper.appendChild(line);
          wrapper.appendChild(block);

          gsap.set(line as HTMLElement, { opacity: 0 });
          blocks.push(block);
        });

        // Create timeline with ScrollTrigger
        const timeline = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: animateOnScroll
            ? {
                trigger: container,
                start: "top 85%",
                toggleActions: "play none none reverse",
              }
            : null,
          delay: delay,
        });

        // Reveal animation: block sweeps from left
        timeline.to(blocks, {
          scaleX: 1,
          duration: duration,
          stagger: stagger,
          transformOrigin: "left center",
        })
          .set(lines as HTMLElement[], { opacity: 1 }, `<${duration / 2}`)
          .to(blocks, {
            scaleX: 0,
            duration: duration,
            stagger: stagger,
            transformOrigin: "right center",
          }, `<${duration * 0.4}`);

      }, container);

      // Keep the text hidden until the original line/sweep setup is ready.
      container.style.visibility = "";
      const cancelRefresh = scheduleRefresh(() => ScrollTrigger.refresh());
      cleanupAnimation = () => {
        cancelRefresh();
        // Revert/kill the timeline, its ScrollTrigger, and all gsap.set calls.
        context.revert();
        // Restores original HTML, including removing our custom line wrappers.
        split.revert();
      };
    };

    let observer: IntersectionObserver | undefined;
    if (deferUntilSectionInView) {
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        observer?.disconnect();
        void initialize();
      }, { rootMargin: "400px 0px", threshold: 0 });
      observer.observe(container.closest("section") ?? container);
    } else {
      void initialize();
    }

    return () => {
      disposed = true;
      observer?.disconnect();
      cleanupAnimation?.();
      if (deferUntilSectionInView) container.style.visibility = "hidden";
    };
  }, [
    deferUntilSectionInView,
    animateOnScroll,
    delay,
    blockColor,
    stagger,
    duration,
  ]);

  return (
    <div ref={containerRef} style={{ position: "relative", visibility: deferUntilSectionInView ? "hidden" : undefined }}>
      {children}
    </div>
  );
}
