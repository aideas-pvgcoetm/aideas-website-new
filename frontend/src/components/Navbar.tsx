'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrolledRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 30;
      if (scrolled !== isScrolledRef.current) {
        isScrolledRef.current = scrolled;
        setIsScrolled(scrolled);
      }
    };
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

  // Ensure mobile drawer is closed on route navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Spotlight', path: '/spotlight' },
    { name: 'Team', path: '/members' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className={isScrolled && !isOpen ? 'header-floating' : ''} suppressHydrationWarning>
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
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

        {/* Controls: Mobile Menu Burger */}
        <div className="flex items-center gap-4">

          <button
            className={`burger md:hidden ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (uses globals.css .mobile-drawer for GPU-accelerated transform/opacity animation) */}
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