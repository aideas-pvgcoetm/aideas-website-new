'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import DiyaFireworks from './DiyaFireworks';

export default function FloatingDiya() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0);
  const lastTriggerTimeRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasError) return;

    // React JSX 'muted' doesn't always set DOM property; explicitly set for browser autoplay permission
    video.muted = true;
    video.defaultMuted = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy handled gracefully
      });
    }
  }, [hasError]);

  // Hover trigger with guard to prevent duplicate rapid activations
  const handleHover = useCallback(() => {
    const now = Date.now();
    if (now - lastTriggerTimeRef.current > 750) {
      lastTriggerTimeRef.current = now;
      setTriggerCount((prev) => prev + 1);
    }
  }, []);

  // Keyboard accessibility and click support
  const handleClick = useCallback(() => {
    lastTriggerTimeRef.current = Date.now();
    setTriggerCount((prev) => prev + 1);
  }, []);

  if (hasError) {
    return null;
  }

  return (
    <>
      {/* Restored celebration fireworks effect */}
      <DiyaFireworks triggerCount={triggerCount} />

      <div
        className="hidden md:block fixed z-40 select-none pointer-events-none transition-all duration-300 left-2 md:left-3 lg:left-4 xl:left-5 bottom-2 md:bottom-3 lg:bottom-4 xl:bottom-5"
        style={{
          position: 'fixed',
          right: 'auto',
          top: 'auto',
        }}
      >
        {/* Interactive button wrapper for hover & keyboard interactions */}
        <button
          type="button"
          onClick={handleClick}
          onMouseEnter={handleHover}
          aria-label="Celebrate with fireworks"
          title="Celebrate with fireworks"
          className="group relative w-[220px] md:w-[250px] lg:w-[280px] xl:w-[310px] aspect-[16/9] flex items-end justify-center pointer-events-auto cursor-pointer bg-transparent border-0 p-0 m-0 outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06080c] rounded-2xl appearance-none transition-transform active:scale-[0.98]"
        >
          {/* Restored elegant hover & keyboard focus tooltip */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-8 sm:-top-9 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium tracking-wide text-[#e0f2fe] bg-[#090d16]/92 backdrop-blur-md border border-[#38bdf8]/35 shadow-[0_4px_16px_rgba(0,0,0,0.65),0_0_12px_rgba(56,189,248,0.2)] opacity-0 translate-y-1.5 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 motion-reduce:transition-none motion-reduce:transform-none select-none flex items-center gap-1.5"
          >
            <span>Light up the sky</span>
            <span className="text-[#38bdf8]">✨</span>
          </div>

          {/* Golden arrow animation video with subtle festive glow on hover */}
          <video
            ref={videoRef}
            src="/videos/golden-arrow.webm"
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
            className="w-full h-full object-contain pointer-events-none drop-shadow-[0_8px_20px_rgba(255,160,20,0.2)] transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-[1.03] group-hover:drop-shadow-[0_12px_28px_rgba(255,175,40,0.45)] motion-reduce:group-hover:transform-none motion-reduce:group-hover:transition-none"
          />
        </button>
      </div>
    </>
  );
}
