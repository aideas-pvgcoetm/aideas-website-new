'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SplineScene } from '@/components/ui/splite';
import NeuralBackground from '@/components/ui/NeuralBackground';

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
  const word = useTypewriter(WORDS);
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
        <div className="hero-copy relative z-[4] flex flex-col justify-center max-w-[580px]">
          {/* 1. Compact technical eyebrow */}
          <div
            data-reveal
            className="hero-eyebrow inline-flex items-center gap-2 select-none pointer-events-none mb-1.5 sm:mb-2"
            style={{
              transitionDelay: '.06s',
              width: 'fit-content',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.85)] shrink-0"
              aria-hidden="true"
            />
            <span
              className="hero-eyebrow-text tracking-[0.22em] sm:tracking-[0.26em] uppercase font-semibold text-[11px] sm:text-[12px]"
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                color: 'rgba(180, 195, 215, 0.72)',
              }}
            >
              WELCOME TO
            </span>
          </div>

          {/* 2. Large Brand Wordmark: aiDEAS (second largest text element, slightly smaller than main headline) */}
          <div
            data-reveal
            className="hero-brand-mark mb-3.5 sm:mb-4 select-none"
            style={{
              transitionDelay: '.14s',
            }}
          >
            <span
              className="font-bold tracking-tight block"
              style={{
                fontFamily: '"Orbitron", var(--font-display), sans-serif',
                fontSize: 'clamp(24px, 3.4vw, 42px)',
                lineHeight: '1.1',
                letterSpacing: '-0.02em',
                filter: 'drop-shadow(0 0 20px rgba(56, 209, 255, 0.22))',
              }}
            >
              <span style={{ color: '#38d1ff' }}>aI</span>
              <span
                style={{
                  background: 'linear-gradient(90deg, #38d1ff 0%, #a855f7 65%, #b06bff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                DEAS
              </span>
            </span>
          </div>

          {/* 3. Primary Two-Line Headline (Dominant textual element, largest in left Hero) */}
          <h1
            data-reveal="zoom"
            className="hero-title mb-4 sm:mb-5"
            style={{
              transitionDelay: '.24s',
              fontFamily: '"Orbitron", sans-serif',
              lineHeight: '1.14',
              fontSize: 'clamp(28px, 4.2vw, 54px)',
              fontWeight: 800,
              letterSpacing: '-0.015em',
            }}
          >
            <span
              className="hero-title-main block sm:whitespace-nowrap"
              style={{
                color: 'rgba(215, 224, 235, 0.96)',
                letterSpacing: '-0.01em',
              }}
            >
              Build Intelligence.
            </span>
            <span
              className="block sm:whitespace-nowrap"
              style={{
                background: 'linear-gradient(90deg, #38bdf8 0%, #a855f7 68%, #b06bff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 24px rgba(56, 189, 248, 0.22))',
              }}
            >
              Shape What&apos;s Next.
            </span>
          </h1>

          {/* 4. Subtitle */}
          <p className="empower-line mb-5 sm:mb-6" data-reveal style={{ transitionDelay: '.34s' }}>
            Empowering&nbsp;
            <span className="type-target">{word}</span>
            <span className="cursor" aria-hidden="true">
              |
            </span>
          </p>

          {/* 5. Call to Actions */}
          <div className="hero-actions" data-reveal style={{ transitionDelay: '.44s' }}>
            <Link href="/about" className="btn btn-primary btn-pulse">
              Explore Now &rarr;
            </Link>
            <Link href="/events" className="btn btn-ghost">
              See Events
            </Link>
          </div>
        </div>

        {/* Right Spline 3D scene: seamlessly integrated into Hero background */}
        <div className="hero-visual relative z-[3] w-full flex flex-col items-center justify-center" data-reveal style={{ transitionDelay: '.2s' }}>
          {/* Small technical robot annotation (upper) */}
          <div
            className="hidden md:flex items-center gap-2.5 absolute top-4 left-2 lg:left-4 z-20 pointer-events-none select-none"
            data-reveal
            style={{
              transitionDelay: '.52s',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]/80 shadow-[0_0_6px_rgba(56,209,255,0.7)]" />
            <div
              className="flex flex-col"
              style={{
                fontSize: '11px',
                lineHeight: '1.3',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              <span className="hero-annotation-label" style={{ color: 'rgba(180, 190, 205, 0.72)' }}>MAKING MACHINES</span>
              <span className="hero-annotation-val" style={{ color: 'rgba(240, 245, 255, 0.92)' }}>INTELLIGENT</span>
            </div>
            <div className="hidden lg:flex items-center">
              <div
                style={{
                  width: '32px',
                  height: '1px',
                  background:
                    'linear-gradient(90deg, rgba(56, 189, 248, 0.5) 0%, rgba(56, 189, 248, 0.15) 70%, transparent 100%)',
                }}
              />
              <div
                style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(56, 189, 248, 0.6)',
                }}
              />
            </div>
          </div>

          <div
            className="w-full max-w-[780px] lg:max-w-[840px] h-[520px] sm:h-[560px] md:h-[600px] lg:h-[640px] relative flex items-center justify-center"
            style={{
              WebkitMaskImage: 'radial-gradient(ellipse 98% 95% at 50% 50%, #000000 85%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse 98% 95% at 50% 50%, #000000 85%, transparent 100%)',
            }}
          >
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
                  background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.45))',
                }}
              />
              <span
                className="text-[12px] sm:text-[13.5px] tracking-[0.2em] sm:tracking-[0.24em]"
                style={{
                  fontFamily: '"Orbitron", var(--font-display), sans-serif',
                  fontWeight: 700,
                  textIndent: '0.2em',
                  background:
                    'linear-gradient(90deg, rgba(225, 235, 245, 0.95) 0%, rgba(56, 189, 248, 0.92) 70%, rgba(168, 85, 247, 0.8) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textTransform: 'uppercase',
                  filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.25))',
                }}
              >
                MEET R2D2
              </span>
              <div
                className="w-4 sm:w-6 h-[1px]"
                style={{
                  background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.45), transparent)',
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
