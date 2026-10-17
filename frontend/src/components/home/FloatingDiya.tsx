'use client';

import { useEffect, useRef, useState } from 'react';
import DiyaFireworks from './DiyaFireworks';

export default function FloatingDiya() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0);

  useEffect(() => {
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

  const handleCelebrate = () => {
    setTriggerCount((prev) => prev + 1);
  };

  if (hasError) {
    return null;
  }

  return (
    <>
      <DiyaFireworks triggerCount={triggerCount} />
      <div
        className="hidden md:block fixed z-40 select-none transition-all duration-300 left-[-32px] lg:left-[-38px] xl:left-[-42px] bottom-[-128px] lg:bottom-[-142px] xl:bottom-[-152px]"
        style={{
          position: 'fixed',
          right: 'auto',
          top: 'auto',
        }}
      >
        <button
          type="button"
          onClick={handleCelebrate}
          aria-label="Celebrate with fireworks"
          title="Celebrate with fireworks"
          className="group relative w-[190px] lg:w-[215px] xl:w-[228px] flex items-end justify-center pointer-events-auto cursor-pointer bg-transparent border-0 p-0 m-0 outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06080c] rounded-2xl appearance-none transition-transform active:scale-[0.98]"
        >
          {/* Elegant Hover / Keyboard Focus Tooltip */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-9 sm:-top-10 left-[48px] sm:left-[54px] lg:left-[60px] z-50 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium tracking-wide text-[#e0f2fe] bg-[#090d16]/92 backdrop-blur-md border border-[#38bdf8]/35 shadow-[0_4px_16px_rgba(0,0,0,0.65),0_0_12px_rgba(56,189,248,0.2)] opacity-0 translate-y-1.5 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 motion-reduce:transition-none motion-reduce:transform-none select-none flex items-center gap-1.5"
          >
            <span>Light up the sky</span>
            <span className="text-[#38bdf8]">✨</span>
          </div>

          <video
            ref={videoRef}
            src="/videos/animated-hands-diya.webm"
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            preload="auto"
            onError={() => setHasError(true)}
            aria-hidden="true"
            className="w-full h-auto object-contain pointer-events-none drop-shadow-[0_8px_20px_rgba(255,160,20,0.3)] transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:scale-[1.04] group-hover:drop-shadow-[0_12px_28px_rgba(255,175,40,0.55)] motion-reduce:group-hover:transform-none motion-reduce:group-hover:transition-none"
          />
        </button>
      </div>
    </>
  );
}
