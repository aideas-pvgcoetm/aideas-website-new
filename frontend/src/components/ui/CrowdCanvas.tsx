'use client';

import { gsap } from 'gsap';
import React, { useEffect, useRef } from 'react';

/**
 * Skiper 39 Canvas_Landing_004 — React + Canvas
 * Inspired by and adapted from https://codepen.io/zadvorsky/pen/xxwbBQV
 * illustration by https://www.openpeeps.com/
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren’t associated with the codepen.io . They’re independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */

export interface CrowdCanvasProps {
  /**
   * Path to the OpenPeeps sprite sheet image.
   * Defaults to the local asset `/images/peeps/all-peeps.png`.
   */
  src?: string;
  /**
   * Number of horizontal columns in the sprite sheet.
   * Default: 15
   */
  rows?: number;
  /**
   * Number of vertical rows in the sprite sheet.
   * Default: 7
   */
  cols?: number;
  /**
   * Opacity of the animated crowd layer (0.0 to 1.0).
   * Default: 0.38 for subtle, non-intrusive background ambiance.
   */
  opacity?: number;
  /**
   * Maximum simultaneous characters on screen.
   * If omitted, dynamically adapts to screen width.
   */
  maxCrowd?: number;
  /**
   * Additional CSS classes for the canvas element.
   */
  className?: string;
}

interface Peep {
  image: HTMLImageElement;
  rect: number[];
  srcWidth: number;
  srcHeight: number;
  drawWidth: number;
  drawHeight: number;
  x: number;
  y: number;
  anchorY: number;
  scaleX: number;
  walk: gsap.core.Timeline | null;
  setRect: (rect: number[]) => void;
  updateScale: (scale: number) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
}

export function CrowdCanvas({
  src = '/images/peeps/all-peeps.png',
  rows = 15,
  cols = 7,
  opacity = 0.38,
  maxCrowd,
  className = 'absolute inset-0 w-full h-full pointer-events-none',
}: CrowdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isDisposed = false;

    // Motion preference check
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Helpers
    const randomRange = (min: number, max: number) =>
      min + Math.random() * (max - min);
    const randomIndex = (array: unknown[]) =>
      (randomRange(0, array.length) | 0);
    const removeFromArray = <T,>(array: T[], i: number): T =>
      array.splice(i, 1)[0];
    const removeItemFromArray = <T,>(array: T[], item: T) => {
      const idx = array.indexOf(item);
      if (idx !== -1) removeFromArray(array, idx);
    };
    const removeRandomFromArray = <T,>(array: T[]): T =>
      removeFromArray(array, randomIndex(array));

    const stage = {
      width: 0,
      height: 0,
      characterScale: 1,
    };

    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    // Peep factory
    const createPeep = (image: HTMLImageElement, rect: number[]): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        srcWidth: 0,
        srcHeight: 0,
        drawWidth: 0,
        drawHeight: 0,
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (r: number[]) => {
          peep.rect = r;
          peep.srcWidth = r[2];
          peep.srcHeight = r[3];
          peep.drawWidth = r[2] * stage.characterScale;
          peep.drawHeight = r[3] * stage.characterScale;
        },
        updateScale: (scale: number) => {
          peep.drawWidth = peep.srcWidth * scale;
          peep.drawHeight = peep.srcHeight * scale;
        },
        render: (c: CanvasRenderingContext2D) => {
          c.save();
          c.translate(peep.x, peep.y);
          c.scale(peep.scaleX, 1);
          c.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.drawWidth,
            peep.drawHeight
          );
          c.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    const resetPeep = ({
      peep,
      currentStage,
    }: {
      peep: Peep;
      currentStage: typeof stage;
    }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;

      // Vertical depth variation tailored for stats section height
      const depthFactor = gsap.parseEase('power1.in')(Math.random());
      const maxVerticalSpread = Math.min(90, Math.max(40, currentStage.height * 0.32));
      const offsetY = -depthFactor * maxVerticalSpread + 18;
      const startY = currentStage.height - peep.drawHeight + offsetY;

      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.drawWidth - 10;
        endX = currentStage.width + 10;
        peep.scaleX = 1;
      } else {
        startX = currentStage.width + peep.drawWidth + 10;
        endX = -peep.drawWidth - 10;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return {
        startX,
        startY,
        endX,
      };
    };

    const normalWalk = ({
      peep,
      props,
    }: {
      peep: Peep;
      props: { startX: number; startY: number; endX: number };
    }) => {
      const { startY, endX } = props;
      // Stride timing
      const distance = Math.abs(endX - peep.x);
      const baseDuration = (distance / 1200) * 11;
      const xDuration = Math.max(6, baseDuration * randomRange(0.8, 1.25));
      const yDuration = 0.24;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.65, 1.35));

      // Horizontal linear translation
      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: 'none',
        },
        0
      );

      // Vertical walking stride bob
      if (!prefersReducedMotion) {
        tl.to(
          peep,
          {
            duration: yDuration,
            repeat: Math.floor(xDuration / yDuration),
            yoyo: true,
            y: startY - 7,
            ease: 'sine.inOut',
          },
          0
        );
      }

      return tl;
    };

    const addPeepToCrowd = () => {
      if (availablePeeps.length === 0) {
        // Replenish available pool if depleted
        availablePeeps.push(...allPeeps);
      }

      const peep = removeRandomFromArray(availablePeeps);
      const props = resetPeep({ peep, currentStage: stage });
      const walk = normalWalk({ peep, props }).eventCallback('onComplete', () => {
        if (isDisposed) return;
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      if (peep.walk) {
        peep.walk.kill();
        peep.walk = null;
      }
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const initCrowd = () => {
      // Determine optimal crowd count for current container dimensions
      let targetCount: number;
      if (typeof maxCrowd === 'number') {
        targetCount = maxCrowd;
      } else if (stage.width >= 1200) {
        targetCount = 20;
      } else if (stage.width >= 768) {
        targetCount = 14;
      } else {
        targetCount = 8;
      }

      // If reduced motion is preferred, keep a minimal subtle presence
      if (prefersReducedMotion) {
        targetCount = Math.min(targetCount, 6);
      }

      for (let i = 0; i < targetCount; i++) {
        const peep = addPeepToCrowd();
        if (peep.walk) {
          // Stagger initial positions across their paths
          peep.walk.progress(Math.random());
        }
      }
    };

    const render = () => {
      if (!canvas || isDisposed) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
      ctx.scale(dpr, dpr);
      ctx.globalAlpha = opacity;

      for (let i = 0; i < crowd.length; i++) {
        crowd[i].render(ctx);
      }

      ctx.restore();
    };

    const resize = () => {
      if (!canvas || isDisposed) return;

      const rect = canvas.getBoundingClientRect();
      const clientWidth = rect.width || canvas.clientWidth || 1200;
      const clientHeight = rect.height || canvas.clientHeight || 300;

      stage.width = clientWidth;
      stage.height = clientHeight;

      // Scale character heights proportionally so they sit comfortably in the stats section
      // In OpenPeeps, sprite cell height is 324px. In ~300px stats section, 140px-170px is ideal.
      const targetHeight = Math.min(175, Math.max(125, stage.height * 0.52));
      stage.characterScale = targetHeight / 324;

      const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
      canvas.width = Math.round(stage.width * dpr);
      canvas.height = Math.round(stage.height * dpr);

      // Update scale on all peeps
      allPeeps.forEach((peep) => {
        peep.updateScale(stage.characterScale);
      });

      // Clear existing crowd tweens
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
    };

    // Load sprite sheet image
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (isDisposed) return;

      const { naturalWidth: width, naturalHeight: height } = img;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep(img, [
            (i % rows) * rectWidth,
            ((i / rows) | 0) * rectHeight,
            rectWidth,
            rectHeight,
          ])
        );
      }

      resize();
      gsap.ticker.add(render);
    };

    img.onerror = () => {
      // Gracefully handle image load failure without throwing
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[CrowdCanvas] Failed to load sprite sheet from: ${src}`);
      }
    };

    img.src = src;

    // Resize handling with ResizeObserver for accurate container dimensions
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && canvas.parentElement) {
      resizeObserver = new ResizeObserver(() => {
        if (!isDisposed && img.complete && allPeeps.length > 0) {
          resize();
        }
      });
      resizeObserver.observe(canvas.parentElement);
    }

    const handleWindowResize = () => {
      if (!isDisposed && img.complete && allPeeps.length > 0) {
        resize();
      }
    };

    window.addEventListener('resize', handleWindowResize, { passive: true });

    return () => {
      isDisposed = true;
      window.removeEventListener('resize', handleWindowResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      gsap.ticker.remove(render);
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
      crowd.length = 0;
      availablePeeps.length = 0;
      allPeeps.length = 0;
    };
  }, [src, rows, cols, opacity, maxCrowd]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}

export default CrowdCanvas;
