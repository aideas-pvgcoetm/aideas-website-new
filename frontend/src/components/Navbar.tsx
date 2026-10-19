'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import TwineOrbit from '@/components/ui/TwineOrbit';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrolledRef = useRef(false);

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop, { passive: true });
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 30;
      if (scrolled !== isScrolledRef.current) {
        isScrolledRef.current = scrolled;
        setIsScrolled(scrolled);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Spotlight', path: '/spotlight' },
    { name: 'Team', path: '/members' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className={isScrolled && !isOpen ? 'header-floating' : ''} suppressHydrationWarning>
      {/* Far-Left Golden Mandala Easter Egg (expanded state only) */}
      {!isScrolled && <GoldenMandalaEasterEgg />}

      {/* Far-Right Shree Ram Archer Ornament (expanded state only, desktop only) */}
      {!isScrolled && isDesktop && <ShreeRamArcher />}

      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="brand group relative flex items-center gap-3 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/50 rounded-lg"
          aria-label="aiDEAS Home"
        >
          <Image
            src="/assets/img/logo-icon.png"
            alt="aiDEAS logo"
            width={42}
            height={42}
            className="rounded-full shadow-md shrink-0"
            priority
          />
          <span className="brand-name font-extrabold text-xl tracking-tight">
            <span className="ai text-cyan-400">aI</span>
            <span className="deas bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">DEAS</span>
          </span>

          {/* Identity hover/focus tooltip */}
          <span
            role="tooltip"
            className="pointer-events-none absolute left-0 top-[calc(100%+6px)] z-50 whitespace-nowrap rounded-md border border-white/10 bg-[#0c1017]/95 px-2.5 py-1 text-[10px] font-medium tracking-[0.14em] uppercase text-gray-300 opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 -translate-y-1"
            style={{
              fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)',
              boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            }}
          >
            PVG AI &amp; DS DEPARTMENT CLUB
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navLinks.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative transition-all duration-300 ${
                  isActive
                    ? 'text-cyan-400 font-semibold'
                    : 'text-gray-300 hover:text-cyan-300'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Controls: TwineOrbit Helix Accent & Mobile Menu Burger */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="w-[34px] h-[34px] md:w-[42px] md:h-[42px] flex items-center justify-center shrink-0">
            <TwineOrbit
              size={36}
              speed={68}
              color="#38d1ff"
              accent="#b06bff"
              advanced={{
                slotMs: 4200,
                backMid: "#7c3aed",
                midColor: "#1d4ed8",
                frontMid: "#22b8f0",
              }}
              style={{
                width: '100%',
                height: '100%',
                minWidth: 'unset',
                minHeight: 'unset',
              }}
            />
          </div>

          <button
            className={`burger md:hidden ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (uses globals.css .mobile-drawer for smooth max-height animation) */}
      <div className={`mobile-drawer md:hidden ${isOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            onClick={() => setIsOpen(false)}
            className={pathname === link.path ? 'active' : ''}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </header>
  );
}

function GoldenMandalaEasterEgg() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const burstTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastClickTimeRef = useRef<number>(0);
  const suppressHoverRef = useRef<boolean>(false);

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [burstActive, setBurstActive] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }

    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
      if (burstTimerRef.current) {
        clearTimeout(burstTimerRef.current);
        burstTimerRef.current = null;
      }
      video.pause();
    };
  }, []);

  const handleInteraction = () => {
    const now = Date.now();
    // Debounce rapid repeated clicks/taps (prevent stacking bursts within 600ms)
    if (now - lastClickTimeRef.current < 600) return;
    lastClickTimeRef.current = now;

    // Temporarily suppress hover so the message automatically dismisses after ~2.5s
    // even if the cursor/touch focus remains resting on the figure
    suppressHoverRef.current = true;
    setIsHovered(false);

    // Trigger one miniature circular burst of golden sparkles (< 700ms)
    setBurstActive(true);
    setBurstKey((prev) => prev + 1);

    if (burstTimerRef.current) {
      clearTimeout(burstTimerRef.current);
    }
    burstTimerRef.current = setTimeout(() => {
      setBurstActive(false);
      burstTimerRef.current = null;
    }, 700);

    // Show the hidden Easter egg message for approximately 2.5 seconds
    setIsClicked(true);
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }
    clickTimerRef.current = setTimeout(() => {
      setIsClicked(false);
      clickTimerRef.current = null;
    }, 2500);
  };

  const handleMouseEnter = () => {
    if (!suppressHoverRef.current) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    suppressHoverRef.current = false;
    setIsHovered(false);
  };

  const handleFocus = () => {
    if (!suppressHoverRef.current) {
      setIsHovered(true);
    }
  };

  const handleBlur = () => {
    suppressHoverRef.current = false;
    setIsHovered(false);
  };

  // 7 tiny golden particles radiating outward in a subtle circular arc from the visible mandala core
  const mandalaBurstParticles = [
    { dx: '38px', dy: '-24px', delay: '0ms', color: '#ffd700', size: 3.5 },
    { dx: '46px', dy: '-8px', delay: '30ms', color: '#fbbf24', size: 3 },
    { dx: '48px', dy: '10px', delay: '60ms', color: '#f59e0b', size: 3 },
    { dx: '36px', dy: '26px', delay: '20ms', color: '#fef08a', size: 3.5 },
    { dx: '18px', dy: '36px', delay: '50ms', color: '#ffd700', size: 2.5 },
    { dx: '16px', dy: '-34px', delay: '10ms', color: '#fbbf24', size: 3 },
    { dx: '30px', dy: '0px', delay: '40ms', color: '#ffd700', size: 3 },
  ];

  return (
    <>
      {/* Decorative mandala video layer (clipped inside expanded navbar) */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0 hidden md:block"
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          src="/videos/mandala-navbar.webm"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute top-1/2 -translate-y-1/2 object-contain pointer-events-none select-none shrink-0 max-w-none transition-[filter] duration-300 ease-out"
          style={{
            left: '-160px',
            width: '320px',
            height: '180px',
            filter: isHovered
              ? 'brightness(1.2) drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))'
              : 'brightness(1)',
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Interactive layer & Easter egg overlay (unclipped for tooltip visibility) */}
      <div className="absolute inset-0 pointer-events-none z-20 select-none hidden md:block">
        {/* Semantic accessible button target precisely matching visible mandala area */}
        <button
          type="button"
          onClick={handleInteraction}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label="Reveal golden mandala Easter egg"
          className="pointer-events-auto absolute top-1/2 -translate-y-1/2 cursor-pointer rounded-r-full focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:outline-none transition-all duration-200"
          style={{
            left: '0px',
            width: '64px',
            height: '60px',
          }}
        />

        {/* Subtle golden shimmer / twinkles on hover around visible ornamental edge */}
        {isHovered && (
          <div
            className="pointer-events-none absolute top-1/2 -translate-y-1/2"
            style={{ left: '0px', width: '80px', height: '64px' }}
            aria-hidden="true"
          >
            {/* Twinkle 1: Upper ornamental curve */}
            <svg
              className="festive-sparkle absolute"
              style={{
                top: '6px',
                left: '44px',
                width: '10px',
                height: '10px',
                animation: 'festive-sparkle 1.5s ease-in-out infinite',
              }}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                fill="#fbbf24"
              />
            </svg>

            {/* Twinkle 2: Outer apex */}
            <svg
              className="festive-sparkle absolute"
              style={{
                top: '26px',
                left: '60px',
                width: '11px',
                height: '11px',
                animation: 'festive-sparkle 1.8s ease-in-out infinite 0.3s',
              }}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                fill="#fde047"
              />
            </svg>

            {/* Twinkle 3: Lower ornamental curve */}
            <svg
              className="festive-sparkle absolute"
              style={{
                bottom: '8px',
                left: '46px',
                width: '9px',
                height: '9px',
                animation: 'festive-sparkle 1.6s ease-in-out infinite 0.6s',
              }}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                fill="#f59e0b"
              />
            </svg>
          </div>
        )}

        {/* Miniature circular golden particle burst on click/tap */}
        {burstActive && (
          <div
            key={burstKey}
            className="pointer-events-none absolute top-1/2 -translate-y-1/2"
            style={{
              left: '28px',
              width: '0px',
              height: '0px',
            }}
            aria-hidden="true"
          >
            {mandalaBurstParticles.map((p, i) => (
              <span
                key={i}
                className="festive-particle absolute rounded-full"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  boxShadow: `0 0 6px ${p.color}`,
                  ['--dx' as string]: p.dx,
                  ['--dy' as string]: p.dy,
                  animation: `festive-burst 650ms cubic-bezier(0.12, 0.8, 0.32, 1) both ${p.delay}`,
                }}
              />
            ))}
          </div>
        )}

        {/* Floating Easter Egg Tooltip: "The light within always wins. ✨" */}
        <div
          role="status"
          aria-live="polite"
          className={`pointer-events-none absolute top-[calc(100%+8px)] left-4 z-50 whitespace-nowrap rounded-full border border-amber-500/30 bg-[#0c1017]/95 px-3.5 py-1 text-xs font-medium tracking-wide shadow-lg backdrop-blur-md transition-all duration-300 ease-out ${
            isClicked
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-1'
          }`}
          style={{
            boxShadow: '0 4px 18px -2px rgba(245, 158, 11, 0.28), 0 0 0 1px rgba(245, 158, 11, 0.12)',
            fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)',
          }}
        >
          <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent font-semibold">
            The light within always wins. ✨
          </span>
        </div>
      </div>
    </>
  );
}

function ShreeRamArcher() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const restartTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const burstTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastClickTimeRef = useRef<number>(0);
  const suppressHoverRef = useRef<boolean>(false);

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [burstActive, setBurstActive] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset to beginning, set 0.75x playback speed, and initiate playback
    video.currentTime = 0;
    video.playbackRate = 0.75;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Gracefully handle browser autoplay policies
      });
    }

    const handlePlay = () => {
      if (videoRef.current) {
        videoRef.current.playbackRate = 0.75;
      }
    };

    const handleEnded = () => {
      // Clear any existing timer to prevent duplicates
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
      }
      // Hold the final frame for exactly 6 seconds, then restart from beginning at 0.75x speed
      restartTimerRef.current = setTimeout(() => {
        restartTimerRef.current = null;
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.playbackRate = 0.75;
          const retryPromise = videoRef.current.play();
          if (retryPromise !== undefined) {
            retryPromise.catch(() => {});
          }
        }
      }, 6000);
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('loadedmetadata', handlePlay);

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('loadedmetadata', handlePlay);
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
      if (burstTimerRef.current) {
        clearTimeout(burstTimerRef.current);
        burstTimerRef.current = null;
      }
      video.pause();
    };
  }, []);

  const handleInteraction = () => {
    const now = Date.now();
    // Debounce rapid repeated clicks/taps (prevent stacking bursts within 600ms)
    if (now - lastClickTimeRef.current < 600) return;
    lastClickTimeRef.current = now;

    // Temporarily suppress hover so the greeting automatically dismisses after ~2.5s
    // even if the cursor/touch focus remains resting on the figure
    suppressHoverRef.current = true;
    setIsHovered(false);

    // Trigger one miniature golden firework burst (< 700ms)
    setBurstActive(true);
    setBurstKey((prev) => prev + 1);

    if (burstTimerRef.current) {
      clearTimeout(burstTimerRef.current);
    }
    burstTimerRef.current = setTimeout(() => {
      setBurstActive(false);
      burstTimerRef.current = null;
    }, 700);

    // Show the "Happy Dussehra ✨" greeting for approximately 2.5 seconds
    setIsClicked(true);
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }
    clickTimerRef.current = setTimeout(() => {
      setIsClicked(false);
      clickTimerRef.current = null;
    }, 2500);
  };

  const handleMouseEnter = () => {
    if (!suppressHoverRef.current) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    suppressHoverRef.current = false;
    setIsHovered(false);
  };

  const handleFocus = () => {
    if (!suppressHoverRef.current) {
      setIsHovered(true);
    }
  };

  const handleBlur = () => {
    suppressHoverRef.current = false;
    setIsHovered(false);
  };

  const isGreetingVisible = isHovered || isClicked;

  // 8 tiny golden particles radiating outward in a subtle miniature burst around the figure
  const burstParticles = [
    { dx: '34px', dy: '-26px', delay: '0ms', color: '#ffd700', size: 3.5 },
    { dx: '44px', dy: '6px', delay: '30ms', color: '#fbbf24', size: 3 },
    { dx: '28px', dy: '32px', delay: '60ms', color: '#f59e0b', size: 3 },
    { dx: '-8px', dy: '38px', delay: '20ms', color: '#fef08a', size: 3.5 },
    { dx: '-34px', dy: '24px', delay: '50ms', color: '#ffd700', size: 2.5 },
    { dx: '-42px', dy: '-14px', delay: '10ms', color: '#fbbf24', size: 3 },
    { dx: '-20px', dy: '-36px', delay: '40ms', color: '#f59e0b', size: 3.5 },
    { dx: '12px', dy: '-42px', delay: '70ms', color: '#ffd700', size: 2.5 },
  ];

  return (
    <>
      {/* Decorative video layer clipped inside expanded navbar */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0 hidden lg:block"
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          src="/videos/shree-ram-navbar.webm"
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute top-1/2 -translate-y-1/2 object-contain pointer-events-none select-none shrink-0 max-w-none"
          style={{
            right: '0px',
            width: '160px',
            height: '90px',
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Interactive layer & festive greeting overlay (unclipped for tooltip visibility) */}
      <div className="absolute inset-0 pointer-events-none z-20 select-none hidden lg:block">
        {/* Semantic accessible button target over the visible figure */}
        <button
          type="button"
          onClick={handleInteraction}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label="Show Happy Dussehra greeting"
          className="pointer-events-auto absolute top-1/2 -translate-y-1/2 cursor-pointer rounded-full focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:outline-none transition-all duration-200"
          style={{
            right: '0px',
            width: '96px',
            height: '56px',
          }}
        />

        {/* Tiny golden sparkles on hover */}
        {isHovered && (
          <div
            className="pointer-events-none absolute top-1/2 -translate-y-1/2"
            style={{ right: '0px', width: '130px', height: '64px' }}
            aria-hidden="true"
          >
            {/* Sparkle 1: Near bow tip */}
            <svg
              className="festive-sparkle absolute"
              style={{
                top: '4px',
                right: '28px',
                width: '12px',
                height: '12px',
                animation: 'festive-sparkle 1.4s ease-in-out infinite',
              }}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                fill="#fbbf24"
              />
            </svg>

            {/* Sparkle 2: Near figure crown/head */}
            <svg
              className="festive-sparkle absolute"
              style={{
                top: '12px',
                right: '80px',
                width: '10px',
                height: '10px',
                animation: 'festive-sparkle 1.8s ease-in-out infinite 0.3s',
              }}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                fill="#fde047"
              />
            </svg>

            {/* Sparkle 3: Lower ambient sparkle */}
            <svg
              className="festive-sparkle absolute"
              style={{
                bottom: '10px',
                right: '54px',
                width: '9px',
                height: '9px',
                animation: 'festive-sparkle 1.6s ease-in-out infinite 0.7s',
              }}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                fill="#f59e0b"
              />
            </svg>
          </div>
        )}

        {/* Miniature firework burst on click/tap */}
        {burstActive && (
          <div
            key={burstKey}
            className="pointer-events-none absolute top-1/2 -translate-y-1/2"
            style={{
              right: '48px',
              width: '0px',
              height: '0px',
            }}
            aria-hidden="true"
          >
            {burstParticles.map((p, i) => (
              <span
                key={i}
                className="festive-particle absolute rounded-full"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  boxShadow: `0 0 6px ${p.color}`,
                  ['--dx' as string]: p.dx,
                  ['--dy' as string]: p.dy,
                  animation: `festive-burst 650ms cubic-bezier(0.12, 0.8, 0.32, 1) both ${p.delay}`,
                }}
              />
            ))}
          </div>
        )}

        {/* Floating "Happy Dussehra ✨" greeting */}
        <div
          role="status"
          aria-live="polite"
          className={`pointer-events-none absolute top-[calc(100%+8px)] right-4 z-50 whitespace-nowrap rounded-full border border-amber-500/30 bg-[#0c1017]/95 px-3 py-1 text-xs font-medium tracking-wide shadow-lg backdrop-blur-md transition-all duration-300 ease-out ${
            isGreetingVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-1'
          }`}
          style={{
            boxShadow: '0 4px 18px -2px rgba(245, 158, 11, 0.28), 0 0 0 1px rgba(245, 158, 11, 0.12)',
            fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)',
          }}
        >
          <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent font-semibold">
            Happy Dussehra ✨
          </span>
        </div>
      </div>
    </>
  );
}
