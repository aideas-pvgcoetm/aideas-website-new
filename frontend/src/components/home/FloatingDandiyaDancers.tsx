'use client';

import { useEffect, useRef, useState } from 'react';

export default function FloatingDandiyaDancers() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionPreferenceChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener?.('change', handleMotionPreferenceChange);
    return () => {
      mediaQuery.removeEventListener?.('change', handleMotionPreferenceChange);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasError) return;

    if (prefersReducedMotion) {
      video.pause();
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy or video decoding pause: handled gracefully without throwing
        });
      }
    }
  }, [prefersReducedMotion, hasError]);

  if (hasError) {
    return null;
  }

  return (
    <div
      className="hidden md:block fixed right-0 bottom-0 z-40 pointer-events-none select-none transition-all duration-300"
      style={{
        position: 'fixed',
        right: '-16px',
        bottom: '0px',
        left: 'auto',
        top: 'auto',
      }}
      aria-hidden="true"
    >
      <div className="relative w-[240px] md:w-[260px] lg:w-[280px] xl:w-[300px] aspect-video flex items-end justify-end drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
        <video
          ref={videoRef}
          src="/videos/dandiya-dancers.webm"
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          onError={() => setHasError(true)}
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>
    </div>
  );
}
