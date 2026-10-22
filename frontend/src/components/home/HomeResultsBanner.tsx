'use client';

import React, { useState, useEffect, useId } from 'react';
import Link from 'next/link';

export default function HomeResultsBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [headerHeight, setHeaderHeight] = useState<number | null>(null);
  const headingId = useId();

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight, { passive: true });
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="absolute top-[67px] sm:top-[70px] md:top-[74px] inset-x-0 z-30 w-full pointer-events-none"
      style={{
        top: headerHeight !== null ? `${headerHeight}px` : undefined,
      }}
    >
      <aside
        aria-labelledby={headingId}
        className="pointer-events-auto relative z-20 w-full overflow-hidden transition-all duration-300"
        style={{
          background: 'linear-gradient(105deg, #071A35 0%, #0B3D82 55%, #1267C5 100%)',
          borderBottom: '1px solid rgba(115, 183, 255, 0.25)',
          borderTop: '1px solid rgba(115, 183, 255, 0.2)',
          boxShadow: '0 4px 20px -2px rgba(7, 26, 53, 0.5), inset 0 1px 0 0 rgba(115, 183, 255, 0.2)',
        }}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-2 sm:py-2.5">
          {/* Desktop View (>= md): single balanced horizontal strip edge-to-edge */}
          <div className="hidden md:flex items-center justify-between gap-6 w-full">
            {/* Left: Tag Label + Bold ROUND 1 RESULTS ARE OUT */}
            <div className="flex items-center gap-3 shrink-0">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider shadow-sm"
                style={{
                  background: 'rgba(7, 26, 53, 0.6)',
                  border: '1px solid rgba(115, 183, 255, 0.35)',
                  color: '#73B7FF',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#73B7FF] animate-pulse" />
                NEUROVERSE IDEATHON 2026
              </span>

              <h2
                id={headingId}
                className="text-[#F8FAFC] font-extrabold text-[13.5px] sm:text-[14.5px] tracking-wide uppercase m-0 leading-none"
                style={{ fontFamily: 'var(--font-display, inherit)' }}
              >
                ROUND 1 RESULTS ARE OUT
              </h2>
            </div>

            {/* Right: View Results Button matching Spotlight styling + Close Button */}
            <div className="flex items-center justify-end gap-3.5 sm:gap-4 shrink-0">
              <Link
                href="/neuroverse-results"
                id="hero-results-cta"
                className="btn-pulse inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] hover:brightness-105 shadow-[0_0_14px_rgba(56,209,255,0.35),0_2px_6px_rgba(255,212,71,0.25)] hover:shadow-[0_8px_30px_-6px_rgba(56,209,255,0.55),0_0_16px_rgba(56,209,255,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447] cursor-pointer shrink-0"
                style={{
                  background: '#FFD447',
                  color: '#071A35',
                }}
              >
                <span>View Results</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>

              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss results announcement"
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-[#F8FAFC]/80 hover:text-[#F8FAFC] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#73B7FF] cursor-pointer shrink-0"
                style={{
                  background: 'rgba(7, 26, 53, 0.5)',
                  border: '1px solid rgba(115, 183, 255, 0.35)',
                }}
                title="Dismiss"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile / Narrow Screen View (< md): Single Clean Row */}
          <div className="flex md:hidden items-center justify-between gap-2 w-full">
            <div className="flex flex-col min-w-0 pr-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#73B7FF] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#73B7FF] truncate">
                  NEUROVERSE IDEATHON 2026
                </span>
              </div>
              <span
                id={`${headingId}-mobile`}
                className="text-[#F8FAFC] font-extrabold text-xs sm:text-sm tracking-wide uppercase leading-tight"
                style={{ fontFamily: 'var(--font-display, inherit)' }}
              >
                ROUND 1 RESULTS ARE OUT
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/neuroverse-results"
                id="hero-results-cta-mobile"
                className="btn-pulse inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] hover:brightness-105 shadow-[0_0_12px_rgba(56,209,255,0.35),0_2px_6px_rgba(255,212,71,0.25)] hover:shadow-[0_6px_24px_-4px_rgba(56,209,255,0.55),0_0_14px_rgba(56,209,255,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447] cursor-pointer shrink-0"
                style={{
                  background: '#FFD447',
                  color: '#071A35',
                }}
              >
                <span>View Results</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>

              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss results announcement"
                className="w-7 h-7 flex items-center justify-center rounded-full text-[#F8FAFC]/80 hover:text-[#F8FAFC] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#73B7FF] cursor-pointer shrink-0"
                style={{
                  background: 'rgba(7, 26, 53, 0.5)',
                  border: '1px solid rgba(115, 183, 255, 0.35)',
                }}
                title="Dismiss"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
