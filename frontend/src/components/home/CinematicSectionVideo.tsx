'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface CinematicSectionVideoProps {
  src: string;
  /** Whether the parent block is in view (from ZigzagSection's useInView) */
  isBlockInView: boolean;
  className?: string;
  objectFit?: 'cover' | 'contain';
}

/**
 * CinematicSectionVideo
 *
 * Viewport-aware video player for the homepage zig-zag sections.
 *
 * Lifecycle:
 *  - Off-screen: src not set, no download triggered.
 *  - Approaching (rootMargin 200px): src is attached, preload="metadata".
 *  - In viewport (50% visible): autoplay starts.
 *  - Out of viewport: paused.
 *
 * At most one section video plays at any given time because each video
 * independently pauses when it leaves the viewport.
 *
 * Never uses requestAnimationFrame, canvas, WebGL, or global event listeners.
 * Respects prefers-reduced-motion.
 */
export default function CinematicSectionVideo({
  src,
  isBlockInView,
  className = '',
  objectFit = 'cover',
}: CinematicSectionVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Whether the src has been attached (lazy — only when approaching viewport)
  const [srcLoaded, setSrcLoaded] = useState(false);
  // Whether video is in the active play zone
  const [playing, setPlaying] = useState(false);
  // prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect prefers-reduced-motion once on mount
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  // Observer 1: "approach" — large rootMargin fires early to attach src + preload metadata
  useEffect(() => {
    if (srcLoaded) return;
    const el = wrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSrcLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px 200px 0px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [srcLoaded]);

  // Observer 2: "play zone" — fires when ≥40% of the video is visible
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPlaying(entry.isIntersecting);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Drive play / pause from the `playing` state flag
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !srcLoaded) return;

    if (playing && !reducedMotion) {
      // Guard: video might not be ready yet — play() returns a Promise
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // Autoplay blocked by browser policy — silently ignore
        });
      }
    } else {
      video.pause();
    }
  }, [playing, srcLoaded, reducedMotion]);

  return (
    <motion.div
      ref={wrapRef}
      className={`cinematic-video-wrap ${className}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={isBlockInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
    >
      {srcLoaded ? (
        <video
          ref={videoRef}
          src={src}
          preload="metadata"
          autoPlay={false} // controlled manually via play()/pause()
          loop
          muted
          playsInline
          // Explicitly suppress all controls
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          className="cinematic-video"
          style={{ objectFit }}
          aria-hidden="true"
        />
      ) : (
        // Placeholder that holds layout space before src is attached
        <div className="cinematic-video-placeholder" aria-hidden="true" />
      )}

      {/* Edge-fade vignette — blends video into the dark background */}
      <div className="cinematic-video-vignette" aria-hidden="true" />
    </motion.div>
  );
}
