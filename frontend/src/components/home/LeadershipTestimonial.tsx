"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { cn } from "@/lib/utils";

export interface LeadershipTestimonialItem {
  id: string | number;
  name: string;
  badge: string;
  title: string;
  description: string;
  imageUrl: string;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    email?: string;
  };
}

const defaultLeadershipTestimonials: LeadershipTestimonialItem[] = [
  {
    id: "soham-muley",
    name: "Soham Muley",
    badge: "GENERAL SECRETARY",
    title: "General Secretary, aiDEAS · 3rd Year",
    description:
      "Being General Secretary of aiDEAS has taught me how to bring people and ideas together. Working with the team to organise events, support student initiatives, and create opportunities to learn has helped me grow as a leader. What makes the experience special is seeing members gain confidence, take ownership, and help the club move forward.",
    imageUrl: "/assets/testimonials/soham-muley.jpeg",
    socialLinks: {
      instagram: "https://www.instagram.com/_sohammmmmm_?stkn=MW5xeXAxZHkwYzN1Mg%3D%3D&utm_source=qr",
      linkedin: "https://www.linkedin.com/in/soham-muley-44b81430a?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    },
  },
  {
    id: "saumya-raut",
    name: "Saumya Raut",
    badge: "JOINT GENERAL SECRETARY",
    title: "Joint General Secretary, aiDEAS · 3rd Year",
    description:
      "Working behind the scenes at aiDEAS has shown me how much a committed team can achieve. From planning sessions to helping students share their first projects, every contribution matters. As Joint General Secretary, I want to help create a space where students feel welcome to ask questions, try something new, and take the lead.",
    imageUrl: "/assets/testimonials/saumya-raut.jpeg",
    socialLinks: {
      instagram: "https://www.instagram.com/sau_meow_?stkn=MWE2Y3kxbnhhMG96eA==",
      linkedin: "https://www.linkedin.com/in/saumya-raut-98474a37b",
    },
  },
];

interface LeadershipTestimonialProps {
  testimonials?: LeadershipTestimonialItem[];
  className?: string;
}

/**
 * LeadershipTestimonial Component:
 * Rebuilt using the reference composition with refined editorial proportions:
 * - Large portrait on the left with subtle cyan/violet hover glow & backlight
 * - Compact, ~10-15% narrower dark overlapping information card on the right
 * - Clean editorial role metadata (removed HUD/AI-style pill badge)
 * - Subtle oversized glowing double quotation marks “ ” behind the testimonial text
 * - Centered bottom carousel controls: Previous, 2 pagination dots, Next
 */
export default function LeadershipTestimonial({
  testimonials = defaultLeadershipTestimonials,
  className,
}: LeadershipTestimonialProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <div className={cn("relative w-full max-w-[1240px] mx-auto py-2", className)}>
      {/* === Main Featured Composition: Left Image + Overlapping Right Card === */}
      <div className="relative flex flex-col lg:flex-row items-center justify-center">
        {/* === Left: Large Portrait with Ambient Backlight & Hover Glow === */}
        <div className="group/portrait relative shrink-0 z-0 flex justify-center cursor-pointer">
          {/* Ambient Backlight Glow with smooth hover energization */}
          <div
            className="pointer-events-none absolute -inset-4 rounded-[36px] bg-gradient-to-tr from-[rgba(56,209,255,0.18)] to-[rgba(176,107,255,0.16)] blur-2xl opacity-75 group-hover/portrait:opacity-100 group-hover/portrait:from-[rgba(56,209,255,0.30)] group-hover/portrait:to-[rgba(176,107,255,0.28)] group-hover/portrait:scale-105 transition-all duration-300"
            aria-hidden="true"
          />

          {/* Portrait Container: gains subtle aiDEAS-colored outer halo on hover */}
          <div className="relative w-[290px] sm:w-[350px] lg:w-[380px] xl:w-[400px] h-[390px] sm:h-[430px] lg:h-[460px] xl:h-[470px] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.1)] group-hover/portrait:border-[rgba(56,209,255,0.45)] bg-[#0c1017] shadow-[0_20px_50px_rgba(0,0,0,0.65)] group-hover/portrait:shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_30px_rgba(56,209,255,0.24),0_0_55px_rgba(176,107,255,0.18)] group-hover/portrait:scale-[1.01] group-hover/portrait:-translate-y-0.5 transition-all duration-300 ease-out">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={current.imageUrl}
                  alt={current.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 290px, (max-width: 1024px) 350px, 400px"
                />
                {/* Subtle bottom vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* === Right: Overlapping Information Card (Narrower, Tighter Editorial Proportions) === */}
        <div className="relative z-10 w-full lg:w-auto lg:-ml-20 xl:-ml-24 mt-4 lg:mt-0 max-w-[480px] sm:max-w-[520px] lg:max-w-[530px] xl:max-w-[560px]">
          {/* 1px Dual-Tone Gradient Border Wrapper */}
          <div className="rounded-[26px] p-[1px] bg-gradient-to-br from-[rgba(56,209,255,0.25)] via-[rgba(255,255,255,0.08)] to-[rgba(176,107,255,0.22)] shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
            <div
              className="relative rounded-[25px] p-5 sm:p-7 lg:p-7 xl:p-8 overflow-hidden"
              style={{
                background:
                  "radial-gradient(circle at 10% 20%, rgba(56, 209, 255, 0.05) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(176, 107, 255, 0.05) 0%, transparent 45%), #0e131d",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  {/* Clean Editorial Role Label — AI/HUD capsule removed */}
                  <p className="text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase text-[var(--cyan-bright,#38d1ff)]/90 font-medium mb-1.5">
                    {current.badge}
                  </p>

                  {/* Name & Title */}
                  <h3 className="text-2xl sm:text-[28px] lg:text-[30px] font-display font-bold text-white tracking-tight">
                    {current.name}
                  </h3>
                  <p className="text-xs sm:text-[13px] font-mono text-[var(--text-dim,#9aa3b0)] mt-0.5 mb-3.5">
                    {current.title}
                  </p>

                  {/* Testimonial Quote with Subtle Glowing Double Quotation Marks “ ” */}
                  <div className="relative my-3.5">
                    {/* Opening Quote Mark “ */}
                    <span
                      className="absolute -top-7 -left-3.5 text-6xl sm:text-7xl font-serif text-[rgba(56,209,255,0.22)] select-none pointer-events-none -z-10 drop-shadow-[0_0_16px_rgba(56,209,255,0.28)]"
                      aria-hidden="true"
                    >
                      &ldquo;
                    </span>

                    {/* Closing Quote Mark ” */}
                    <span
                      className="absolute -bottom-10 -right-2 text-6xl sm:text-7xl font-serif text-[rgba(176,107,255,0.20)] select-none pointer-events-none -z-10 drop-shadow-[0_0_16px_rgba(176,107,255,0.25)]"
                      aria-hidden="true"
                    >
                      &rdquo;
                    </span>

                    <blockquote className="relative z-10 text-[14px] sm:text-[14.5px] lg:text-[15px] font-normal leading-[1.68] text-[#d6dde8]">
                      &ldquo;{current.description}&rdquo;
                    </blockquote>
                  </div>

                  {/* Social Links Row (White icons, brand-tinted background buttons) */}
                  <div className="flex items-center gap-2.5 mt-4 pt-3.5 border-t border-[rgba(255,255,255,0.06)]">
                    {current.socialLinks?.instagram && (
                      <Link
                        href={current.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${current.name} on Instagram`}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[rgba(225,48,108,0.20)] to-[rgba(131,58,180,0.18)] border border-[rgba(225,48,108,0.45)] hover:border-[rgba(225,48,108,0.85)] hover:from-[rgba(225,48,108,0.30)] hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                      >
                        <FaInstagram className="w-[18px] h-[18px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                      </Link>
                    )}
                    {current.socialLinks?.linkedin && (
                      <Link
                        href={current.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${current.name} on LinkedIn`}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[rgba(10,102,194,0.22)] to-[rgba(0,119,181,0.16)] border border-[rgba(10,102,194,0.48)] hover:border-[rgba(10,102,194,0.90)] hover:from-[rgba(10,102,194,0.32)] hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                      >
                        <FaLinkedin className="w-[18px] h-[18px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                      </Link>
                    )}
                    {current.socialLinks?.email && (
                      <Link
                        href={`mailto:${current.socialLinks.email}`}
                        aria-label={`Email ${current.name}`}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[rgba(56,209,255,0.18)] to-[rgba(0,163,255,0.12)] border border-[rgba(56,209,255,0.42)] hover:border-[var(--cyan-bright,#38d1ff)] hover:from-[rgba(56,209,255,0.28)] hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                      >
                        <Mail className="w-[18px] h-[18px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" strokeWidth={2} />
                      </Link>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* === Bottom Carousel Controls: Prev, 2 Dots, Next === */}
      <div className="flex items-center justify-center gap-3.5 mt-7">
        <button
          onClick={handlePrev}
          aria-label="Previous leadership testimonial"
          className="w-12 h-12 rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(18,24,36,0.9)] text-[#d5dee8] hover:text-white hover:border-[var(--cyan-bright,#38d1ff)]/60 hover:bg-[rgba(56,209,255,0.08)] active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* 2 Pagination Dots */}
        <div className="flex items-center gap-2 px-1">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
              className={cn(
                "rounded-full transition-all duration-300 cursor-pointer",
                currentIndex === idx
                  ? "w-6 h-2 bg-[var(--cyan-bright,#38d1ff)] shadow-[0_0_8px_rgba(56,209,255,0.7)]"
                  : "w-2 h-2 bg-white/25 hover:bg-white/50"
              )}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next leadership testimonial"
          className="w-12 h-12 rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(18,24,36,0.9)] text-[#d5dee8] hover:text-white hover:border-[var(--cyan-bright,#38d1ff)]/60 hover:bg-[rgba(56,209,255,0.08)] active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
