'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useScroll } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

const TOTAL_FRAMES = 180;
const MAX_CACHE_DESKTOP = 36;
const MAX_CACHE_MOBILE = 24;
const MAX_CONCURRENT_REQUESTS = 4;

interface StoryBeat {
  id: string;
  eyebrow: string;
  statement: string;
  position: 'left' | 'right' | 'center';
  accent: string;
  startProgress: number;
  peakStart: number;
  peakEnd: number;
  endProgress: number;
}

const STORY_BEATS: StoryBeat[] = [
  {
    id: 'beginning',
    eyebrow: 'THE BEGINNING',
    statement: 'A student idea became a community.',
    position: 'left',
    accent: '#38bdf8',
    startProgress: 0.0,
    peakStart: 0.04,
    peakEnd: 0.16,
    endProgress: 0.21,
  },
  {
    id: 'purpose',
    eyebrow: 'THE PURPOSE',
    statement: 'Learn it. Build it. Make it real.',
    position: 'right',
    accent: '#60a5fa',
    startProgress: 0.21,
    peakStart: 0.25,
    peakEnd: 0.37,
    endProgress: 0.42,
  },
  {
    id: 'method',
    eyebrow: 'THE METHOD',
    statement: 'Theory is only the beginning.',
    position: 'left',
    accent: '#818cf8',
    startProgress: 0.42,
    peakStart: 0.46,
    peakEnd: 0.58,
    endProgress: 0.63,
  },
  {
    id: 'community',
    eyebrow: 'THE COMMUNITY',
    statement: 'Different people. One community.',
    position: 'right',
    accent: '#a78bfa',
    startProgress: 0.63,
    peakStart: 0.67,
    peakEnd: 0.79,
    endProgress: 0.84,
  },
  {
    id: 'future',
    eyebrow: 'THE FUTURE',
    statement: 'And this is only the beginning.',
    position: 'center',
    accent: '#c084fc',
    startProgress: 0.84,
    peakStart: 0.88,
    peakEnd: 1.0,
    endProgress: 1.0,
  },
];

const getFrameUrl = (frameIndex: number): string => {
  const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameIndex)));
  const pad = String(clamped).padStart(3, '0');
  return `/assets/scroll-story/aideas/${pad}.jpg`;
};

export default function ScrollStorySection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stickyViewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // References for memory and draw tracking
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const inFlightRef = useRef<Set<number>>(new Set());
  const queueRef = useRef<number[]>([]);
  const activeRequestsRef = useRef(0);
  const lastDrawnFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const scrollDirectionRef = useRef<'forward' | 'backward' | 'none'>('forward');
  const lastProgressRef = useRef(0);
  const isDestroyedRef = useRef(false);
  const isSectionNearRef = useRef(false);
  const brandLogoRef = useRef<HTMLImageElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasDimensionsRef = useRef<{ canvasW: number; canvasH: number }>({
    canvasW: 1920,
    canvasH: 1080,
  });

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Framer-motion scroll progress linked to the parent scroll-story section
  // Offset start start -> end end: exactly 0.0 at pinning moment, 1.0 at release moment
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ['start start', 'end end'],
  });

  // Update canvas dimensions and backing buffer store (only on resize/init, not on every frame draw)
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Viewport display dimensions: measure outside active scroll draw path
    const stickyViewport = stickyViewportRef.current;
    const rect = stickyViewport ? stickyViewport.getBoundingClientRect() : canvas.getBoundingClientRect();
    const cssWidth = rect.width > 0 ? rect.width : (typeof window !== 'undefined' ? window.innerWidth : 1920);
    const cssHeight = rect.height > 0 ? rect.height : (typeof window !== 'undefined' ? window.innerHeight : 1080);

    // Device Pixel Ratio with safe cap (desktop up to 2.0, mobile up to 2.0)
    const dpr = Math.min((typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1, 2);
    const canvasW = Math.max(1, Math.round(cssWidth * dpr));
    const canvasH = Math.max(1, Math.round(cssHeight * dpr));

    canvasDimensionsRef.current = { canvasW, canvasH };

    // Update backing store dimensions ONLY on resize
    if (canvas.width !== canvasW || canvas.height !== canvasH) {
      canvas.width = canvasW;
      canvas.height = canvasH;
    }

    // Cache and configure 2D context
    let ctx = ctxRef.current;
    if (!ctx) {
      ctx = canvas.getContext('2d', { alpha: false });
      ctxRef.current = ctx;
    }
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      if ('imageSmoothingQuality' in ctx) {
        ctx.imageSmoothingQuality = 'high';
      }
    }
  }, []);

  // Canvas draw logic: high-quality direct buffer drawing preserving full source resolution
  const drawFrameToCanvas = useCallback((img: HTMLImageElement, frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx = ctxRef.current;
    if (!ctx) {
      ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;
      ctxRef.current = ctx;
    }

    // Read cached dimensions - zero layout reads during scrolling
    let { canvasW, canvasH } = canvasDimensionsRef.current;
    if (canvasW <= 0 || canvasH <= 0 || canvas.width === 0 || canvas.height === 0) {
      updateCanvasDimensions();
      canvasW = canvasDimensionsRef.current.canvasW;
      canvasH = canvasDimensionsRef.current.canvasH;
    }

    // Source frame natural dimensions
    const imgW = img.naturalWidth || 1920;
    const imgH = img.naturalHeight || 1080;

    // Aspect ratios (source vs canvas)
    const sourceRatio = imgW / imgH; // 16:9 = 1.7777777777777777
    const canvasRatio = canvasW / canvasH;

    let drawW: number;
    let drawH: number;
    let drawX: number;
    let drawY: number;

    if (canvasRatio >= 1.2) {
      // Desktop / Landscape: Compare canvas aspect ratio vs source aspect ratio
      // Preserves 16:9 artwork without distortion, filling the viewport edge-to-edge
      const scale = canvasRatio > sourceRatio ? canvasW / imgW : canvasH / imgH;
      drawW = Math.round(imgW * scale);
      drawH = Math.round(imgH * scale);
      drawX = Math.round((canvasW - drawW) / 2);
      drawY = Math.round((canvasH - drawH) / 2);
    } else {
      // Mobile / Portrait: Scale to keep central ring and hands prominent without shrinking
      // Preserves 16:9 aspect ratio and centers hands in the upper-mid region (~38% from top)
      const scale = Math.max(canvasW / imgW, (canvasH * 0.48) / imgH);
      drawW = Math.round(imgW * scale);
      drawH = Math.round(imgH * scale);
      drawX = Math.round((canvasW - drawW) / 2);
      drawY = Math.round(canvasH * 0.38 - drawH / 2);
    }

    // High-quality canvas scaling configuration
    ctx.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in ctx) {
      ctx.imageSmoothingQuality = 'high';
    }

    // Deep background base matching frame perimeter
    ctx.fillStyle = '#03070d';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Draw directly from decoded source image to destination canvas buffer
    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Mask the Gemini watermark with the authentic aiDEAS logo
    const maskX = Math.round(drawX + (1732.5 / imgW) * drawW);
    const maskY = Math.round(drawY + (888.5 / imgH) * drawH);
    const maskRadius = Math.round(48 * (drawW / imgW));
    const maskDiameter = maskRadius * 2;

    // Dark circular base with feathered outer edge to cleanly erase the Gemini star without harsh edges
    ctx.save();
    const grad = ctx.createRadialGradient(
      maskX,
      maskY,
      maskRadius * 0.88,
      maskX,
      maskY,
      maskRadius * 1.12
    );
    grad.addColorStop(0, '#03070d');
    grad.addColorStop(0.85, '#03070d');
    grad.addColorStop(1, 'rgba(3, 7, 13, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(maskX, maskY, maskRadius * 1.12, 0, Math.PI * 2);
    ctx.fill();

    // Draw the authentic aiDEAS logo directly over the watermark
    const brandLogo = brandLogoRef.current;
    if (brandLogo && brandLogo.complete && brandLogo.naturalWidth > 0) {
      ctx.drawImage(
        brandLogo,
        maskX - maskRadius,
        maskY - maskRadius,
        maskDiameter,
        maskDiameter
      );
    }
    ctx.restore();

    lastDrawnFrameRef.current = frameNum;
  }, [updateCanvasDimensions]);

  // Request & process frames with bounded memory cache
  const processQueue = useCallback(() => {
    if (isDestroyedRef.current) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const maxCache = isMobile ? MAX_CACHE_MOBILE : MAX_CACHE_DESKTOP;

    // Eviction if cache exceeds threshold
    if (cacheRef.current.size > maxCache) {
      const currentTarget = targetFrameRef.current;
      const sortedKeys = Array.from(cacheRef.current.keys()).sort((a, b) => {
        // Keep frame 1 pinned as initial anchor
        if (a === 1) return -1;
        if (b === 1) return 1;
        return Math.abs(b - currentTarget) - Math.abs(a - currentTarget);
      });

      while (cacheRef.current.size > maxCache && sortedKeys.length > 0) {
        const evictKey = sortedKeys.shift();
        if (evictKey !== undefined && evictKey !== 1 && evictKey !== lastDrawnFrameRef.current) {
          const evictedImg = cacheRef.current.get(evictKey);
          if (evictedImg) {
            evictedImg.onload = null;
            evictedImg.onerror = null;
            evictedImg.src = ''; // Release GPU texture memory cleanly
          }
          cacheRef.current.delete(evictKey);
        }
      }
    }

    // Process in-flight loading with concurrency limiter
    while (
      queueRef.current.length > 0 &&
      activeRequestsRef.current < MAX_CONCURRENT_REQUESTS
    ) {
      const nextIndex = queueRef.current.shift();
      if (!nextIndex || cacheRef.current.has(nextIndex) || inFlightRef.current.has(nextIndex)) {
        continue;
      }

      inFlightRef.current.add(nextIndex);
      activeRequestsRef.current++;

      const img = new Image();
      img.src = getFrameUrl(nextIndex);

      let handled = false;
      const handleSuccess = () => {
        if (handled) return;
        handled = true;
        img.onload = null;
        img.onerror = null;

        inFlightRef.current.delete(nextIndex);
        activeRequestsRef.current--;
        if (isDestroyedRef.current) return;

        cacheRef.current.set(nextIndex, img);

        // If this loaded frame is the current target, or closer than what's currently drawn, render immediately
        const currentTarget = targetFrameRef.current;
        const currentDrawn = lastDrawnFrameRef.current;

        if (
          nextIndex === currentTarget ||
          Math.abs(nextIndex - currentTarget) < Math.abs(currentDrawn - currentTarget)
        ) {
          drawFrameToCanvas(img, nextIndex);
        }

        processQueue();
      };

      const handleError = () => {
        if (handled) return;
        handled = true;
        img.onload = null;
        img.onerror = null;

        inFlightRef.current.delete(nextIndex);
        activeRequestsRef.current--;
        processQueue();
      };

      img.onload = () => {
        if (typeof img.decode === 'function') {
          img.decode().then(handleSuccess).catch(handleSuccess);
        } else {
          handleSuccess();
        }
      };
      img.onerror = handleError;
    }
  }, [drawFrameToCanvas]);

  // Request a specific frame with directional priority preloading
  const requestFrame = useCallback(
    (target: number, direction: 'forward' | 'backward' | 'none') => {
      targetFrameRef.current = target;

      // 1. If target is already decoded, render immediately
      const cachedTarget = cacheRef.current.get(target);
      if (cachedTarget) {
        drawFrameToCanvas(cachedTarget, target);
      } else {
        // Find nearest available cached frame to ensure zero blank flashes
        let nearestFrame = lastDrawnFrameRef.current;
        let minDiff = Infinity;
        for (const key of cacheRef.current.keys()) {
          const diff = Math.abs(key - target);
          if (diff < minDiff) {
            minDiff = diff;
            nearestFrame = key;
          }
        }
        const fallbackImg = cacheRef.current.get(nearestFrame);
        if (fallbackImg) {
          drawFrameToCanvas(fallbackImg, nearestFrame);
        }
      }

      // 2. Build directional preload candidates around target
      const priorityList: number[] = [target];
      const forwardWindow = direction === 'backward' ? 6 : 14;
      const backwardWindow = direction === 'forward' ? 5 : 12;

      for (let i = 1; i <= Math.max(forwardWindow, backwardWindow); i++) {
        if (direction === 'backward') {
          if (i <= forwardWindow && target - i >= 1) priorityList.push(target - i);
          if (i <= backwardWindow && target + i <= TOTAL_FRAMES) priorityList.push(target + i);
        } else {
          if (i <= forwardWindow && target + i <= TOTAL_FRAMES) priorityList.push(target + i);
          if (i <= backwardWindow && target - i >= 1) priorityList.push(target - i);
        }
      }

      // Re-order queue prioritizing nearest frames to current target
      const unqueued = priorityList.filter(
        (f) => !cacheRef.current.has(f) && !inFlightRef.current.has(f) && !queueRef.current.includes(f)
      );

      queueRef.current = [...unqueued, ...queueRef.current.filter((f) => Math.abs(f - target) <= 25)];
      processQueue();
    },
    [drawFrameToCanvas, processQueue]
  );

  // Initial Load: Frame 1 immediately on mount
  useEffect(() => {
    isDestroyedRef.current = false;
    const initialImg = new Image();
    initialImg.src = getFrameUrl(1);

    const onInitialLoad = () => {
      if (isDestroyedRef.current) return;
      cacheRef.current.set(1, initialImg);
      requestAnimationFrame(() => {
        drawFrameToCanvas(initialImg, 1);
      });
      // Preload subsequent frames 2, 3, 4, 5
      for (let f = 2; f <= 6; f++) {
        queueRef.current.push(f);
      }
      processQueue();
    };

    // Preload authentic aiDEAS logo for watermark masking
    const brandLogo = new Image();
    brandLogo.src = '/assets/img/logo-icon.png';
    const onBrandLoad = () => {
      brandLogoRef.current = brandLogo;
      const currentDrawn = lastDrawnFrameRef.current;
      const currentImg = cacheRef.current.get(currentDrawn) || cacheRef.current.get(1);
      if (currentImg) {
        drawFrameToCanvas(currentImg, currentDrawn);
      }
    };
    brandLogo.onload = onBrandLoad;
    if (brandLogo.complete && brandLogo.naturalWidth > 0) {
      brandLogoRef.current = brandLogo;
    } else if (typeof brandLogo.decode === 'function') {
      brandLogo.decode().then(onBrandLoad).catch(onBrandLoad);
    }

    initialImg.onload = onInitialLoad;
    initialImg.onerror = (e) => {
      console.error('[ScrollStory] Failed to load frame 001 from URL:', initialImg.src, e);
      setLoadError(`Failed to load frame 001 from: ${initialImg.src}`);
    };

    if (typeof initialImg.decode === 'function') {
      initialImg.decode().then(onInitialLoad).catch(onInitialLoad);
    }

    const currentCache = cacheRef.current;
    const currentInFlight = inFlightRef.current;

    return () => {
      isDestroyedRef.current = true;
      brandLogo.onload = null;
      brandLogo.onerror = null;
      initialImg.onload = null;
      initialImg.onerror = null;
      currentCache.forEach((img) => {
        img.onload = null;
        img.onerror = null;
        img.src = '';
      });
      currentCache.clear();
      currentInFlight.clear();
      queueRef.current = [];
    };
  }, [drawFrameToCanvas, processQueue]);

  // Viewport proximity tracking with IntersectionObserver
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isSectionNearRef.current = entry.isIntersecting;
      },
      { rootMargin: '350px 0px 350px 0px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // ResizeObserver to ensure canvas always redraws cleanly when layout settles
  useEffect(() => {
    const target = stickyViewportRef.current || canvasRef.current;
    if (!target) return;

    const handleResize = () => {
      updateCanvasDimensions();
      const currentDrawn = lastDrawnFrameRef.current;
      const img = cacheRef.current.get(currentDrawn) || cacheRef.current.get(1);
      if (img) {
        drawFrameToCanvas(img, currentDrawn);
      }
    };

    handleResize();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        handleResize();
      });
      ro.observe(target);
    }

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [updateCanvasDimensions, drawFrameToCanvas]);

  // Listen to scroll progress and request frames
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollProgress(latest);

      // Determine scroll direction
      const diff = latest - lastProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        scrollDirectionRef.current = diff > 0 ? 'forward' : 'backward';
      }
      lastProgressRef.current = latest;

      let targetFrame: number;
      if (prefersReducedMotion) {
        // Reduced motion: step between 5 representative keyframe states
        if (latest < 0.2) targetFrame = 1;
        else if (latest < 0.4) targetFrame = Math.round(TOTAL_FRAMES * 0.25);
        else if (latest < 0.6) targetFrame = Math.round(TOTAL_FRAMES * 0.5);
        else if (latest < 0.8) targetFrame = Math.round(TOTAL_FRAMES * 0.75);
        else targetFrame = TOTAL_FRAMES;
      } else {
        // Continuous smooth frame interpolation from 1 to TOTAL_FRAMES
        targetFrame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(1 + latest * (TOTAL_FRAMES - 1))));
      }

      requestFrame(targetFrame, scrollDirectionRef.current);
    });

    return () => unsubscribe();
  }, [scrollYProgress, requestFrame, prefersReducedMotion]);

  // Calculate visual properties for each story beat based on scrollProgress
  const beatStates = useMemo(() => {
    return STORY_BEATS.map((beat) => {
      const { startProgress, peakStart, peakEnd, endProgress } = beat;
      if (scrollProgress < startProgress || scrollProgress > endProgress) {
        return { ...beat, opacity: 0, translateY: 24, isVisible: false };
      }
      if (scrollProgress < peakStart) {
        const t = (scrollProgress - startProgress) / (peakStart - startProgress);
        return {
          ...beat,
          opacity: t,
          translateY: (1 - t) * 24,
          isVisible: true,
        };
      }
      if (scrollProgress <= peakEnd) {
        return { ...beat, opacity: 1, translateY: 0, isVisible: true };
      }
      // Fading out
      const t = (scrollProgress - peakEnd) / (endProgress - peakEnd);
      return {
        ...beat,
        opacity: Math.max(0, 1 - t),
        translateY: -t * 18,
        isVisible: true,
      };
    });
  }, [scrollProgress]);

  return (
    <>
      {/* 1. OUR STORY HEADING: normal flow above the cinematic sequence with seamless dark transition */}
      <div className="w-full bg-[#03070d] text-white relative z-10">
        <div className="our-story-heading wrap pt-8 sm:pt-10 pb-0 text-center">
          <SectionHeading
            eyebrow="A closer look"
            wordmarkText="Our Story"
            description="Where curiosity turns into engineering — bridging the gap between theoretical concepts and real implementation."
            className="mb-0 sm:mb-0"
          />
        </div>
      </div>

      {/* 2. SCROLL-STORY: parent provides deliberate scroll distance (430vh mobile, 560vh desktop) */}
      <section
        id="our-story"
        ref={scrollContainerRef}
        aria-label="aiDEAS Story cinematic sequence"
        className="scroll-story relative w-full h-[430vh] md:h-[560vh] bg-[#03070d]"
      >
        {/* 3. SCROLL-STORY-STICKY: the ENTIRE visual experience pinned to the viewport */}
        <div
          ref={stickyViewportRef}
          className="scroll-story-sticky sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#03070d]"
        >
          {/* Edge-to-edge Canvas */}
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none select-none block"
          />

          {/* Subtle cinematic vignette & top edge transition: approximately 80px feathered fade into background */}
          <div
            aria-hidden="true"
            className="cinematic-vignette-overlay absolute inset-0 pointer-events-none z-[1]"
            style={{
              background: `
                radial-gradient(ellipse 88% 82% at 50% 50%, transparent 50%, rgba(3, 7, 13, 0.25) 70%, rgba(3, 7, 13, 0.75) 88%, #03070d 100%),
                linear-gradient(to bottom, #03070d 0%, rgba(3, 7, 13, 0.5) 30px, transparent 80px, transparent calc(100% - 70px), rgba(3, 7, 13, 0.7) calc(100% - 25px), #03070d 100%),
                linear-gradient(to right, #03070d 0%, rgba(3, 7, 13, 0.5) 2%, transparent 8%, transparent 92%, rgba(3, 7, 13, 0.5) 98%, #03070d 100%)
              `,
            }}
          />

          {/* Subtle mobile backdrop gradient for bottom text readability, without obscuring the canvas artwork */}
          <div
            aria-hidden="true"
            className="md:hidden absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#03070d]/85 via-[#03070d]/30 to-transparent pointer-events-none z-[3]"
          />

          {/* Floating Editorial Typography across 5 alternating positions */}
          <div className="story-text-overlay absolute inset-0 z-10 w-full h-full pointer-events-none select-none">
            <div className="relative w-full h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
              {beatStates.map((beat) => {
                if (!beat.isVisible && beat.opacity === 0) return null;

                const isLeft = beat.position === 'left';
                const isRight = beat.position === 'right';
                const isCenter = beat.position === 'center';

                // Responsive positioning for each beat type
                let positionClasses = '';
                if (isLeft) {
                  // Beats 1 & 3: Left-aligned, clear of human arm and central ring
                  positionClasses =
                    'top-[60%] sm:top-[58%] md:top-1/2 -translate-y-1/2 left-6 sm:left-10 lg:left-16 text-left items-start max-w-[310px] sm:max-w-md lg:max-w-lg';
                } else if (isRight) {
                  // Beats 2 & 4: Right-aligned, clear of robotic arm and central ring
                  positionClasses =
                    'top-[60%] sm:top-[58%] md:top-1/2 -translate-y-1/2 right-6 sm:right-10 lg:right-16 text-right items-end ml-auto max-w-[310px] sm:max-w-md lg:max-w-lg';
                } else {
                  // Beat 5 (Climax): Horizontally centered in the open negative space directly below the finger touch
                  positionClasses =
                    'bottom-12 sm:bottom-14 md:bottom-16 lg:bottom-20 inset-x-6 sm:inset-x-10 lg:inset-x-16 mx-auto text-center items-center max-w-[360px] sm:max-w-xl lg:max-w-2xl';
                }

                return (
                  <article
                    key={beat.id}
                    aria-hidden={!beat.isVisible}
                    className={`absolute flex flex-col transition-none ${positionClasses}`}
                    style={{
                      opacity: beat.opacity,
                      transform: prefersReducedMotion ? 'none' : `translateY(${beat.translateY}px)`,
                    }}
                  >
                    {isCenter ? (
                      // Climax Beat 5 (The Future) — Visually elevated, framing the finger-touch moment
                      <>
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -inset-10 -z-10 rounded-full"
                          style={{
                            background:
                              'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(56, 189, 248, 0.08) 0%, rgba(168, 85, 247, 0.05) 50%, transparent 80%)',
                            filter: 'blur(32px)',
                          }}
                        />
                        <div className="inline-flex items-center justify-center gap-2.5 mb-2.5 sm:mb-3">
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{
                              backgroundColor: '#38bdf8',
                              boxShadow: '0 0 8px #38bdf8',
                            }}
                          />
                          <span
                            className="tracking-[0.28em] sm:tracking-[0.32em] uppercase font-bold text-[12px] sm:text-[13px] md:text-[14px]"
                            style={{
                              fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)',
                              background: 'linear-gradient(90deg, #93c5fd 0%, #ffffff 50%, #c4b5fd 100%)',
                              WebkitBackgroundClip: 'text',
                              backgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              color: 'transparent',
                              filter: 'drop-shadow(0 1px 8px rgba(0, 0, 0, 0.9))',
                            }}
                          >
                            {beat.eyebrow}
                          </span>
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{
                              backgroundColor: '#c084fc',
                              boxShadow: '0 0 8px #c084fc',
                            }}
                          />
                        </div>
                        <h3
                          className="font-extrabold tracking-tight text-white"
                          style={{
                            fontFamily: 'var(--font-inter, Inter, "Geist", system-ui, sans-serif)',
                            fontSize: 'clamp(30px, 4.2vw, 50px)',
                            lineHeight: '1.15',
                            color: '#ffffff',
                            textShadow:
                              '0 2px 20px rgba(0, 0, 0, 0.95), 0 0 40px rgba(0, 0, 0, 0.85), 0 0 24px rgba(147, 197, 253, 0.22)',
                          }}
                        >
                          {beat.statement}
                        </h3>
                      </>
                    ) : (
                      // Beats 1 to 4 — Cinematic chapter labels floating over the scene
                      <>
                        <div
                          className={`inline-flex items-center gap-2 mb-2 sm:mb-2.5 ${
                            isRight ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{
                              backgroundColor: beat.accent,
                              boxShadow: `0 0 8px ${beat.accent}`,
                            }}
                          />
                          <span
                            className="tracking-[0.24em] sm:tracking-[0.28em] uppercase font-semibold text-[11px] sm:text-[12px] md:text-[12.5px]"
                            style={{
                              fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)',
                              color: 'rgba(195, 210, 230, 0.92)',
                              textShadow: '0 1px 8px rgba(0, 0, 0, 0.9)',
                            }}
                          >
                            {beat.eyebrow}
                          </span>
                        </div>
                        <h3
                          className="font-bold tracking-tight text-white"
                          style={{
                            fontFamily: 'var(--font-inter, Inter, "Geist", system-ui, sans-serif)',
                            fontSize: 'clamp(26px, 3.4vw, 42px)',
                            lineHeight: '1.18',
                            color: '#f8fafc',
                            textShadow: '0 2px 18px rgba(0, 0, 0, 0.95), 0 0 32px rgba(0, 0, 0, 0.8)',
                          }}
                        >
                          {beat.statement}
                        </h3>
                      </>
                    )}
                  </article>
                );
              })}
            </div>
          </div>

          {/* Visible diagnostic if frame 1 asset fails to load */}
          {loadError && (
            <div className="absolute top-4 left-4 z-50 p-3 bg-red-950/80 border border-red-500 rounded text-red-200 text-xs font-mono">
              {loadError}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
