"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode } from "react";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface TextBlockAnimationProps {
  children: ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
  blockColor?: string;
  stagger?: number;
  duration?: number;
}

export default function TextBlockAnimation({
  children,
  animateOnScroll = true,
  delay = 0,
  blockColor = "#35C7F3",
  stagger = 0.08,
  duration = 0.6,
}: TextBlockAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitText | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const initializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Skip if already initialized (prevents double creation in Strict Mode)
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Create SplitText
    splitRef.current = new SplitText(containerRef.current, {
      type: "lines",
      linesClass: "block-line-parent",
    });

    const lines = splitRef.current.lines;

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
    tlRef.current = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: animateOnScroll
        ? {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        : null,
      delay: delay,
    });

    // Reveal animation: block sweeps from left
    tlRef.current.to(blocks, {
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

    // CRITICAL: Refresh ScrollTrigger after SplitText has created the wrappers/lines.
    // Use requestAnimationFrame to wait for the browser to complete initial layout,
    // then refresh so the trigger element's height/position is correctly calculated.
    const handleRefresh = () => {
      ScrollTrigger.refresh();
    };
    const rafId = requestAnimationFrame(handleRefresh);

    // Also fire on the next GSAP tick as a safety net
    gsap.delayedCall(0, () => {
      ScrollTrigger.refresh();
    });

    // Cleanup on unmount
    return () => {
      initializedRef.current = false;
      cancelAnimationFrame(rafId);
    }
  }, [
    containerRef.current,
    animateOnScroll,
    delay,
    blockColor,
    stagger,
    duration,
  ]);

  return <div ref={containerRef} style={{ position: "relative" }}>{children}</div>;
}