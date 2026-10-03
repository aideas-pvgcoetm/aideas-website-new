'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SplineScene } from '@/components/ui/splite';
import NeuralBackground from '@/components/ui/NeuralBackground';

const CAPABILITY_ITEMS = [
  {
    image: '/assets/img/hero/build-projects.png',
    primary: 'Projects',
    secondary: 'Built',
  },
  {
    image: '/assets/img/hero/workshops-and-session.png',
    primary: 'Workshops',
    secondary: '& Sessions',
  },
  {
    image: '/assets/img/hero/hackathons-and-competitions.png',
    primary: 'Hackathons',
    secondary: '& Competitions',
  },
  {
    image: '/assets/img/hero/tech-community.png',
    primary: 'Tech',
    secondary: 'Community',
  },
];

const WORDS = ['Researchers', 'Innovators', 'Builders', 'Creators', 'Future Leaders'];

function useTypewriter(words: string[]) {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx % words.length];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting) {
      if (displayed.length < word.length) {
        timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 55);
      } else {
        timeout = setTimeout(() => setDeleting(true), 1400);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
      } else {
        setDeleting(false);
        setWordIdx((i) => i + 1);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIdx, words]);

  return displayed;
}

function TypewriterText() {
  const word = useTypewriter(WORDS);
  return <span className="type-target">{word}</span>;
}

function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>('[data-reveal]');
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) (e.target as HTMLElement).classList.add('in');
        }),
      { threshold: 0.12 }
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, []);
  return ref;
}

export function Hero() {
  const sectionRef = useReveal() as React.RefObject<HTMLElement>;

  const handleScrollDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const next = document.querySelector('#home')?.nextElementSibling as HTMLElement;
    next?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" ref={sectionRef as React.RefObject<HTMLElement>} className="relative overflow-hidden">
      {/* Static deep black/graphite atmosphere (visible on all devices, zero CPU/GPU overhead) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 hero-ambient-atmosphere"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 25%, rgba(18, 24, 35, 0.45) 0%, rgba(6, 8, 12, 0.98) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Living neural network background canvas (Desktop >=768px with fine pointer only, completely unmounted on mobile) */}
      <NeuralBackground />

      <div className="wrap hero-inner relative z-[2]">
        {/* Left copy: z-index 4, tightly grouped editorial stack */}
        <div className="hero-copy relative z-[4] flex flex-col justify-center w-full max-w-full lg:max-w-[500px]">
          {/* Scoped style for hero accent refinement, scale & layout */}
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Isometra&display=swap');
            .empower-line .type-target {
              color: #38bdf8 !important;
            }
            .hero-actions {
              gap: 12px !important;
            }
            @media (min-width: 640px) {
              .hero-actions {
                gap: 13px !important;
              }
              .hero-actions .btn {
                padding: 13px 21px !important;
                font-size: 14.5px !important;
              }
            }
            @media (min-width: 1024px) {
              .hero-inner {
                grid-template-columns: minmax(0, 47%) minmax(0, 53%) !important;
                gap: 32px !important;
                align-items: center !important;
              }
            }
            @media (min-width: 1280px) {
              .hero-inner {
                grid-template-columns: minmax(0, 46%) minmax(0, 54%) !important;
                gap: 40px !important;
                align-items: center !important;
              }
            }
            @media (max-width: 960px) {
              .hero-wordmark-lockup {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                text-align: center !important;
                margin-left: auto !important;
                margin-right: auto !important;
              }
              .hero-wordmark-lockup .hero-brand-mark {
                margin-left: auto !important;
                margin-right: auto !important;
              }
              .hero-wordmark-lockup .hero-institutional-identity {
                text-align: center !important;
              }
            }
          `}</style>

          {/* 1 + 2. Shared fit-content block — BUILD eyebrow centers over aiDEAS wordmark */}
          <div className="hero-wordmark-lockup" style={{ width: 'fit-content' }}>

            {/* BUILD · BREAK · LEARN · REPEAT — no decorative dot, text-align:center within wordmark width */}
            <div
              data-reveal
              className="hero-eyebrow select-none pointer-events-none mb-1.5 sm:mb-2"
              style={{
                transitionDelay: '.06s',
                width: '100%',
                textAlign: 'center',
              }}
            >
              <span
                className="hero-eyebrow-text tracking-[0.18em] sm:tracking-[0.24em] uppercase font-semibold text-[11px] sm:text-[12.5px] md:text-[13px]"
                style={{
                  fontFamily: 'var(--font-inter, Inter, "Geist", system-ui, sans-serif)',
                  background: 'linear-gradient(90deg, #8bb4db 0%, #a4b2e6 50%, #b89fd9 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                }}
              >
                BUILD · BREAK · LEARN · REPEAT
              </span>
            </div>

            {/* MAIN HERO WORDMARK: aIDEAS — predominantly metallic silver/white with subtle brand-color reflections */}
            <div
              data-reveal
              className="hero-brand-mark select-none mb-1.5 sm:mb-2"
              style={{
                transitionDelay: '.14s',
                position: 'relative',
                display: 'block',
                width: 'fit-content',
              }}
            >
              {/* Layer 1 — Broad diffused outer atmospheric glow: cyan on left to violet on right */}
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '-35%',
                  left: '-16%',
                  right: '-16%',
                  bottom: '-30%',
                  borderRadius: '45%',
                  background:
                    'radial-gradient(ellipse 65% 60% at 28% 50%, rgba(56, 209, 255, 0.18) 0%, rgba(79, 143, 247, 0.08) 50%, transparent 80%), radial-gradient(ellipse 65% 60% at 72% 50%, rgba(176, 107, 255, 0.16) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 80%)',
                  filter: 'blur(56px)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
              {/* Layer 2 — Soft inner light field directly behind letters */}
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '-12%',
                  left: '-5%',
                  right: '-5%',
                  bottom: '-12%',
                  borderRadius: '35%',
                  background:
                    'radial-gradient(ellipse 55% 55% at 30% 50%, rgba(56, 209, 255, 0.25) 0%, rgba(79, 143, 247, 0.12) 40%, transparent 75%), radial-gradient(ellipse 55% 55% at 70% 50%, rgba(176, 107, 255, 0.22) 0%, rgba(139, 92, 246, 0.10) 40%, transparent 75%)',
                  filter: 'blur(28px)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
              {/* aIDEAS: Isometra typeface — metallic silver/white dominant, cyan+violet as faint reflected-light accents only */}
              <span
                className="hero-wordmark-text block relative"
                style={{
                  fontFamily: '"Isometra", var(--font-inter, Inter, "Geist", system-ui, sans-serif)',
                  fontSize: 'clamp(50px, 6.4vw, 91px)',
                  fontWeight: 400,
                  lineHeight: '0.94',
                  letterSpacing: '0.01em',
                  background:
                    'linear-gradient(90deg, #6a8898 0%, #98b2c4 14%, #c8dae8 28%, #eaf2f8 40%, #ffffff 48%, #eaf0f8 54%, #c0cedc 64%, #9898c4 76%, #8888b8 88%, #7878a8 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                  position: 'relative',
                  zIndex: 1,
                  display: 'inline-block',
                }}
              >
                aIDEAS
              </span>
            </div>

            {/* Institutional Identity Line: clearly identifies the organization directly below aiDEAS */}
            <div
              data-reveal
              className="hero-institutional-identity select-none mb-3 sm:mb-3.5"
              style={{
                transitionDelay: '.18s',
                width: '100%',
              }}
            >
              <span
                className="tracking-[0.16em] sm:tracking-[0.20em] uppercase font-semibold text-[10.5px] sm:text-[11.5px] md:text-[12px] block"
                style={{
                  fontFamily: 'var(--font-inter, Inter, "Geist", system-ui, sans-serif)',
                  color: 'rgba(156, 175, 198, 0.82)',
                }}
              >
                AI &amp; DATA SCIENCE STUDENT ASSOCIATION
              </span>
            </div>

          </div>

          {/* 3. Subtitle with typewriter */}
          <p
            className="empower-line mb-5 sm:mb-6"
            data-reveal
            style={{
              transitionDelay: '.24s',
              fontSize: 'clamp(14px, 1.1vw, 15.5px)',
              color: 'rgba(132, 148, 170, 0.85)',
              lineHeight: '1.65',
              margin: '0 0 20px',
            }}
          >
            Empowering&nbsp;
            <TypewriterText />
            <span className="cursor" aria-hidden="true" style={{ color: 'rgba(138, 98, 205, 0.62)' }}>
              |
            </span>
          </p>

          {/* 4. Call to Actions */}
          <div className="hero-actions" data-reveal style={{ transitionDelay: '.34s' }}>
            <Link href="/spotlight" className="btn btn-primary btn-pulse">
              Explore Now &rarr;
            </Link>
            <Link href="/contact" className="btn btn-outline-violet">
              Partner With Us &rarr;
            </Link>
          </div>

          {/* 5. Capability Strip: 4 lightweight items in 2x2 grid */}
          <div
            data-reveal
            className="hero-capabilities mt-7 sm:mt-8 lg:mt-9 select-none"
            style={{ transitionDelay: '.44s' }}
          >
            <div className="grid grid-cols-2 gap-x-6 sm:gap-x-8 md:gap-x-10 gap-y-3.5 sm:gap-y-4 max-w-[460px] mx-auto lg:mx-0">
              {CAPABILITY_ITEMS.map((item) => (
                <div
                  key={item.primary + item.secondary}
                  className="group flex items-center gap-3 text-left cursor-default"
                >
                  <div className="relative w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] shrink-0 flex items-center justify-center">
                    <Image
                      src={item.image}
                      alt=""
                      width={40}
                      height={40}
                      className="w-full h-full object-contain transition-all duration-300 ease-out group-hover:scale-[1.05] group-hover:drop-shadow-[0_0_10px_rgba(56,189,248,0.35)]"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex flex-col leading-[1.25] transition-transform duration-200 ease-out group-hover:-translate-y-[1px]">
                    <span
                      className="text-[15px] sm:text-[16px] font-semibold text-[#f1f5f9] tracking-tight"
                      style={{ fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)' }}
                    >
                      {item.primary}
                    </span>
                    <span
                      className="text-[13px] sm:text-[13.5px] font-normal text-[#94a3b8] tracking-normal"
                      style={{ fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)' }}
                    >
                      {item.secondary}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Spline 3D scene: seamlessly integrated into Hero background */}
        <div className="hero-visual relative z-[3] w-full flex flex-col items-center justify-center min-w-0" data-reveal style={{ transitionDelay: '.2s' }}>
          {/* Futuristic Metallic Headline above the robot: MAKING MACHINES INTELLIGENT */}
          <div
            data-reveal
            className="w-full flex items-center justify-center mb-1 sm:mb-2 z-20 pointer-events-none select-none"
            style={{ transitionDelay: '.30s' }}
          >
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Left secondary metallic accent */}
              <div className="hidden sm:flex items-center gap-1.5 opacity-50">
                <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] shadow-[0_0_4px_rgba(148,163,184,0.4)]" />
                <div className="w-5 sm:w-8 lg:w-10 h-[1px] bg-gradient-to-r from-[#94a3b8]/50 to-transparent" />
              </div>

              {/* Two-line metallic emblem headline */}
              <div className="flex flex-col items-center text-center">
                <span
                  className="text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] uppercase block"
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    background: 'linear-gradient(180deg, #d1d5db 0%, #9ca3af 55%, #4b5563 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                    marginBottom: '2px',
                  }}
                >
                  MAKING MACHINES
                </span>
                <span
                  className="text-[18px] sm:text-[21px] lg:text-[24px] font-extrabold tracking-[0.09em] uppercase leading-tight block"
                  style={{
                    fontFamily: 'var(--font-inter, Inter, "Geist", system-ui, sans-serif)',
                    background:
                      'linear-gradient(180deg, #5a6775 0%, #9fb0c0 22%, #eaf0f6 44%, #ffffff 52%, #b2c1cf 68%, #5b6976 86%, #3c4650 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                    filter:
                      'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.95)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.65))',
                  }}
                >
                  INTELLIGENT
                </span>
              </div>

              {/* Right secondary metallic accent */}
              <div className="hidden sm:flex items-center gap-1.5 opacity-50">
                <div className="w-5 sm:w-8 lg:w-10 h-[1px] bg-gradient-to-l from-[#94a3b8]/50 to-transparent" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] shadow-[0_0_4px_rgba(148,163,184,0.4)]" />
              </div>
            </div>
          </div>

          <div
            className="w-full max-w-[680px] lg:max-w-none h-[480px] sm:h-[530px] md:h-[580px] lg:h-[630px] relative flex items-center justify-center"
          >
            {/* Robot 3D canvas wrapper without restrictive mask clipping */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Atmospheric graphite/cool-gray illumination with subtle cyan/violet rim accents */}
              <div
                className="pointer-events-none absolute inset-0 z-0 hero-robot-glow"
                style={{
                  background:
                    'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(20, 26, 38, 0.45) 0%, rgba(56, 209, 255, 0.035) 30%, rgba(176, 107, 255, 0.02) 52%, transparent 72%)',
                  filter: 'blur(32px)',
                }}
                aria-hidden="true"
              />

              {/* Spline 3D Scene with proportional breathing room scale to prevent clipping of hands/arms */}
              <div
                className="w-full h-full relative z-10 flex items-center justify-center pointer-events-auto"
                style={{
                  transform: 'scale(0.85)',
                  transformOrigin: 'center center',
                }}
              >
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Technical Status & Machine Introduction (Anchored directly beneath the robot visual) */}
          <div className="flex flex-col items-center justify-center text-center mt-1 sm:mt-2 mb-14 md:mb-0 select-none pointer-events-none z-20">
            {/* Status Line */}
            <div
              data-reveal
              className="hero-status-text flex items-center justify-center gap-2 text-[10px] sm:text-[11px] tracking-[0.14em] sm:tracking-[0.18em]"
              style={{
                transitionDelay: '.80s',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                textTransform: 'uppercase',
                color: 'rgba(160, 175, 195, 0.68)',
                fontWeight: 500,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]/70 shadow-[0_0_6px_rgba(56,189,248,0.5)] shrink-0" />
              <span>CURRENT STATUS: STILL LEARNING.</span>
            </div>

            {/* Machine Introduction Easter Egg */}
            <div
              data-reveal="easter-egg"
              className="flex items-center justify-center gap-2.5 sm:gap-3 mt-1.5 sm:mt-2"
              style={{
                transitionDelay: '1.05s',
              }}
            >
              <div
                className="w-4 sm:w-6 h-[1px]"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.45))',
                }}
              />
              <span
                className="text-[12px] sm:text-[13.5px] tracking-[0.2em] sm:tracking-[0.24em] select-none"
                style={{
                  fontFamily: '"Orbitron", var(--font-display), sans-serif',
                  fontWeight: 700,
                  textIndent: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                <span style={{ color: 'rgba(160, 175, 195, 0.72)' }}>MEET </span>
                <span
                  style={{
                    background:
                      'linear-gradient(180deg, #5a6775 0%, #9fb0c0 22%, #eaf0f6 44%, #ffffff 52%, #b2c1cf 68%, #5b6976 86%, #3c4650 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                    filter:
                      'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.95)) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.6))',
                  }}
                >
                  R2D2
                </span>
              </span>
              <div
                className="w-4 sm:w-6 h-[1px]"
                style={{
                  background: 'linear-gradient(90deg, rgba(148, 163, 184, 0.45), transparent)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a href="#" className="scroll-cue" aria-label="Scroll down" onClick={handleScrollDown}>
        <span />
      </a>
    </section>
  );
}

export default Hero;
