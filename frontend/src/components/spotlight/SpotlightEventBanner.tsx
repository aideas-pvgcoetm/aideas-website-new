'use client';

import React, { useEffect, useState, useId } from 'react';

// Event Timestamps (Asia/Kolkata / IST: UTC+05:30)
// 24 October 2026, 10:00 AM IST => 2026-10-24T04:30:00.000Z
const EVENT_START_MS = 1792816200000;
// 24 October 2026, 05:00 PM IST => 2026-10-24T11:30:00.000Z
const EVENT_END_MS = 1792841400000;

interface SpotlightEventBannerProps {
  onViewDetails?: () => void;
}

export default function SpotlightEventBanner({ onViewDetails }: SpotlightEventBannerProps) {
  // Pure in-memory component state: dismisses only for current page view, restores on refresh/remount
  // Explicitly NO localStorage, sessionStorage, cookies, or persisted flags
  const [isVisible, setIsVisible] = useState(true);
  const [lifecycle, setLifecycle] = useState<'upcoming' | 'live' | 'ended'>('upcoming');
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  const headingId = useId();

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      if (now >= EVENT_END_MS) {
        setLifecycle('ended');
        return;
      }
      if (now >= EVENT_START_MS) {
        setLifecycle('live');
        return;
      }

      setLifecycle('upcoming');

      const diffSec = Math.max(0, Math.floor((EVENT_START_MS - now) / 1000));
      const days = Math.floor(diffSec / 86400);
      const hours = Math.floor((diffSec % 86400) / 3600);
      const minutes = Math.floor((diffSec % 3600) / 60);

      setTimeLeft({ days, hours, minutes });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onViewDetails) {
      onViewDetails();
    } else {
      const target = document.getElementById('neuroverse-event-card') || document.querySelector('.timeline-card');
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (!isVisible || lifecycle === 'ended') {
    return null;
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <aside
      aria-labelledby={headingId}
      className="relative z-20 w-full overflow-hidden transition-all duration-300"
      style={{
        background: 'linear-gradient(105deg, #071A35 0%, #0B3D82 55%, #1267C5 100%)',
        borderBottom: '1px solid rgba(115, 183, 255, 0.25)',
        borderTop: '1px solid rgba(115, 183, 255, 0.2)',
        boxShadow: '0 4px 20px -2px rgba(7, 26, 53, 0.5), inset 0 1px 0 0 rgba(115, 183, 255, 0.2)',
      }}
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-2.5 sm:py-3">
        {/* Desktop View (>= lg): single spacious, balanced horizontal strip edge-to-edge */}
        <div className="hidden lg:flex items-center justify-between gap-6 w-full">
          {/* Left: Tag & Event Title & Date */}
          <div className="flex items-center gap-3 shrink-0">
            {lifecycle === 'live' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-sm animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                LIVE NOW
              </span>
            ) : (
              <span
                id={headingId}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider shadow-sm"
                style={{
                  background: '#FFD447',
                  color: '#071A35',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#071A35]" />
                UPCOMING EVENT
              </span>
            )}

            <div className="flex items-center gap-2 text-[14.5px] sm:text-[15px] font-semibold tracking-tight">
              <span className="text-[#F8FAFC] font-bold tracking-normal" style={{ fontFamily: 'var(--font-display, inherit)' }}>
                NEUROVERSE Ideathon 2026
              </span>
              <span className="text-[#73B7FF]/50 font-normal">·</span>
              <span className="text-[#73B7FF] font-semibold text-xs sm:text-sm">24 Oct 2026</span>
            </div>
          </div>

          {/* Center: Live Countdown (DAYS, HOURS, MINUTES) in dark navy capsule */}
          {lifecycle === 'upcoming' && (
            <div
              className="flex items-center justify-center gap-3 sm:gap-4 px-4 sm:px-5 py-1.5 rounded-full shadow-inner"
              style={{
                background: '#071A35',
                border: '1px solid rgba(115, 183, 255, 0.35)',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.35)',
              }}
            >
              <div className="flex items-baseline gap-1.5">
                <span className="text-[#FFD447] font-bold text-base font-mono">{pad(timeLeft.days)}</span>
                <span className="text-[10px] sm:text-[11px] text-[#F8FAFC]/90 uppercase font-sans font-semibold tracking-wider">DAYS</span>
              </div>
              <span className="text-[#73B7FF]/40 font-bold select-none text-xs sm:text-sm">:</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[#FFD447] font-bold text-base font-mono">{pad(timeLeft.hours)}</span>
                <span className="text-[10px] sm:text-[11px] text-[#F8FAFC]/90 uppercase font-sans font-semibold tracking-wider">HOURS</span>
              </div>
              <span className="text-[#73B7FF]/40 font-bold select-none text-xs sm:text-sm">:</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[#FFD447] font-bold text-base font-mono">{pad(timeLeft.minutes)}</span>
                <span className="text-[10px] sm:text-[11px] text-[#F8FAFC]/90 uppercase font-sans font-semibold tracking-wider">MINUTES</span>
              </div>
            </div>
          )}

          {/* Right: Golden Yellow View Details + Understated Navy X Button */}
          <div className="flex items-center justify-end gap-3.5 sm:gap-4 shrink-0">
            <button
              onClick={handleDetailsClick}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447] shadow-sm cursor-pointer shrink-0"
              style={{
                background: '#FFD447',
                color: '#071A35',
                boxShadow: '0 2px 8px rgba(255, 212, 71, 0.3)',
              }}
            >
              <span>View Details</span>
              <span aria-hidden="true">&rarr;</span>
            </button>

            <button
              onClick={handleDismiss}
              aria-label="Dismiss event announcement"
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center rounded-full text-[#F8FAFC]/80 hover:text-[#F8FAFC] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#73B7FF] cursor-pointer shrink-0"
              style={{
                background: 'rgba(7, 26, 53, 0.5)',
                border: '1px solid rgba(115, 183, 255, 0.35)',
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile / Narrow Screen View (< lg): Two Clean Rows */}
        <div className="flex lg:hidden flex-col gap-2 w-full">
          {/* Row 1: Tag & Title & Date on Left, X button on Far Right */}
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex flex-wrap items-center gap-2">
              {lifecycle === 'live' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-sm animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  LIVE NOW
                </span>
              ) : (
                <span
                  id={`${headingId}-mobile`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm"
                  style={{
                    background: '#FFD447',
                    color: '#071A35',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#071A35]" />
                  UPCOMING
                </span>
              )}

              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-tight">
                <span className="text-[#F8FAFC] font-bold" style={{ fontFamily: 'var(--font-display, inherit)' }}>
                  NEUROVERSE
                </span>
                <span className="text-[#73B7FF]/50 font-normal">·</span>
                <span className="text-[#73B7FF] font-semibold text-xs">24 Oct</span>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              aria-label="Dismiss event announcement"
              className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full text-[#F8FAFC]/80 hover:text-[#F8FAFC] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#73B7FF] cursor-pointer"
              style={{
                background: 'rgba(7, 26, 53, 0.5)',
                border: '1px solid rgba(115, 183, 255, 0.35)',
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Row 2: Countdown & View Details */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 w-full">
            {lifecycle === 'upcoming' && (
              <div
                className="flex items-center gap-2 px-3 py-1 rounded-full shadow-inner"
                style={{
                  background: '#071A35',
                  border: '1px solid rgba(115, 183, 255, 0.35)',
                }}
              >
                <div className="flex items-baseline gap-1">
                  <span className="text-[#FFD447] font-bold text-xs sm:text-sm font-mono">{pad(timeLeft.days)}</span>
                  <span className="text-[9.5px] sm:text-[10px] text-[#F8FAFC]/90 uppercase font-sans font-semibold">DAYS</span>
                </div>
                <span className="text-[#73B7FF]/40 font-bold select-none text-xs">:</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-[#FFD447] font-bold text-xs sm:text-sm font-mono">{pad(timeLeft.hours)}</span>
                  <span className="text-[9.5px] sm:text-[10px] text-[#F8FAFC]/90 uppercase font-sans font-semibold">HOURS</span>
                </div>
                <span className="text-[#73B7FF]/40 font-bold select-none text-xs">:</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-[#FFD447] font-bold text-xs sm:text-sm font-mono">{pad(timeLeft.minutes)}</span>
                  <span className="text-[9.5px] sm:text-[10px] text-[#F8FAFC]/90 uppercase font-sans font-semibold">MIN</span>
                </div>
              </div>
            )}

            <button
              onClick={handleDetailsClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447] shadow-sm cursor-pointer ml-auto"
              style={{
                background: '#FFD447',
                color: '#071A35',
                boxShadow: '0 2px 8px rgba(255, 212, 71, 0.3)',
              }}
            >
              <span>View Details</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
