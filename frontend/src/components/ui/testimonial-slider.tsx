"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { cn } from "@/lib/utils";

// Define the type for a community review
export type Review = {
  id: string | number;
  name: string;
  shortName?: string;
  designation: string;
  quote: string;
  imageSrc: string;
  thumbnailSrc?: string;
  socials?: {
    instagram?: string;
    linkedin?: string;
    email?: string;
  };
};

// Define the props for the slider component
export interface TestimonialSliderProps {
  reviews: Review[];
  className?: string;
}

/**
 * TestimonialSlider component:
 * 5-Person Editorial Voice Rail for Community Voices.
 * Visual Polish Features:
 * - Subtle dual-tone panel (cyan atmospheric tint on left, violet atmospheric tint on right, dark graphite center)
 * - Restrained dual-tone border (cyan upper-left, muted center, violet lower-right)
 * - Highly visible, branded, compact social badges (Instagram, LinkedIn, Email) only when real data exists
 * - Enlarged, ergonomic carousel buttons (48px–52px desktop, 44px–48px mobile)
 * - Enhanced decorative quotation glyph with soft cyan/violet glow behind the quote
 * - Coordinated smooth transitions with zero horizontal overflow
 */
export const TestimonialSlider = ({
  reviews,
  className,
}: TestimonialSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const activeReview = reviews[currentIndex] || reviews[0];

  const handleNext = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleSelect = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  // Image transition variants
  const imageVariants = {
    initial: (dir: "left" | "right") => ({
      opacity: 0,
      x: dir === "right" ? 16 : -16,
      scale: 0.98,
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    exit: (dir: "left" | "right") => ({
      opacity: 0,
      x: dir === "right" ? -16 : 16,
      scale: 0.98,
    }),
  };

  // Text transition variants
  const textVariants = {
    initial: (dir: "left" | "right") => ({
      opacity: 0,
      y: dir === "right" ? 10 : -10,
    }),
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: (dir: "left" | "right") => ({
      opacity: 0,
      y: dir === "right" ? -10 : 10,
    }),
  };

  // Check if active review has any real social/contact link
  const hasSocials =
    activeReview.socials &&
    (activeReview.socials.instagram ||
      activeReview.socials.linkedin ||
      activeReview.socials.email);

  return (
    <div className={cn("relative w-full text-foreground max-w-[1240px] mx-auto", className)}>
      {/* === Dual-Tone Editorial Panel Container (1px subtle cyan/violet gradient border) === */}
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-[rgba(56,209,255,0.22)] via-[rgba(255,255,255,0.06)] to-[rgba(176,107,255,0.20)] shadow-[0_16px_36px_rgba(0,0,0,0.45)]">
        {/* Inner Panel: Dark graphite core with restrained cyan/violet atmospheric tints */}
        <div
          className="relative rounded-[15px] p-5 sm:p-7 lg:p-8 overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at 10% 20%, rgba(56, 209, 255, 0.05) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(176, 107, 255, 0.05) 0%, transparent 45%), #0c1017",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-9 items-center">
            {/* === Left: Active Member Portrait === */}
            <div className="md:col-span-4 lg:col-span-3 flex justify-center md:justify-start">
              <div className="relative w-[170px] sm:w-[195px] lg:w-[215px] h-[215px] sm:h-[245px] lg:h-[265px] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#0b0f17] shadow-[0_12px_28px_rgba(0,0,0,0.5)] shrink-0">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={activeReview.id}
                    custom={direction}
                    variants={imageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src={activeReview.imageSrc}
                      alt={activeReview.name}
                      fill
                      sizes="(max-width: 640px) 170px, (max-width: 1024px) 195px, 215px"
                      className="object-cover object-top"
                      priority={false}
                    />
                    {/* Subtle vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* === Right: Editorial Identity & Quote === */}
            <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-between min-h-[215px] sm:min-h-[245px] lg:min-h-[265px]">
              {/* Header info & Quote container */}
              <div className="relative">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={activeReview.id}
                    custom={direction}
                    variants={textVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="relative z-10"
                  >
                    {/* Top Line: Designation & Branded Real Socials */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <p className="text-[11px] sm:text-xs font-mono tracking-wider uppercase text-[var(--cyan-bright,#38d1ff)] font-medium">
                        {activeReview.designation}
                      </p>

                      {/* Display ONLY real, non-empty social icons with bright, high-contrast recognizable glyphs */}
                      {hasSocials && (
                        <div className="flex items-center gap-2.5">
                          {activeReview.socials?.instagram && (
                            <Link
                              href={activeReview.socials.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${activeReview.name} on Instagram`}
                              className="w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-xl bg-gradient-to-br from-[rgba(225,48,108,0.20)] to-[rgba(131,58,180,0.18)] border border-[rgba(225,48,108,0.45)] hover:border-[rgba(225,48,108,0.85)] hover:from-[rgba(225,48,108,0.30)] hover:to-[rgba(131,58,180,0.28)] hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                            >
                              <FaInstagram className="w-[19px] h-[19px] sm:w-5 sm:h-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                            </Link>
                          )}
                          {activeReview.socials?.linkedin && (
                            <Link
                              href={activeReview.socials.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${activeReview.name} on LinkedIn`}
                              className="w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-xl bg-gradient-to-br from-[rgba(10,102,194,0.22)] to-[rgba(0,119,181,0.16)] border border-[rgba(10,102,194,0.48)] hover:border-[rgba(10,102,194,0.90)] hover:from-[rgba(10,102,194,0.32)] hover:to-[rgba(0,119,181,0.26)] hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                            >
                              <FaLinkedin className="w-[19px] h-[19px] sm:w-5 sm:h-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                            </Link>
                          )}
                          {activeReview.socials?.email && (
                            <Link
                              href={`mailto:${activeReview.socials.email}`}
                              aria-label={`Email ${activeReview.name}`}
                              className="w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-xl bg-gradient-to-br from-[rgba(56,209,255,0.18)] to-[rgba(0,163,255,0.12)] border border-[rgba(56,209,255,0.42)] hover:border-[var(--cyan-bright,#38d1ff)] hover:from-[rgba(56,209,255,0.28)] hover:to-[rgba(0,163,255,0.22)] hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                            >
                              <Mail className="w-[19px] h-[19px] sm:w-5 sm:h-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" strokeWidth={2} />
                            </Link>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Member Name */}
                    <h3 className="text-xl sm:text-2xl font-display font-semibold text-white tracking-tight">
                      {activeReview.name}
                    </h3>

                    {/* Quotation area with larger, glowing cyan/violet decorative quotation mark */}
                    <div className="relative mt-3.5">
                      <svg
                        className="absolute -top-5 -left-4 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 pointer-events-none select-none -z-10 drop-shadow-[0_2px_14px_rgba(56,209,255,0.16)]"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient id="commQuoteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#38d1ff" stopOpacity="0.22" />
                            <stop offset="100%" stopColor="#b06bff" stopOpacity="0.18" />
                          </linearGradient>
                        </defs>
                        <path
                          fill="url(#commQuoteGrad)"
                          d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
                        />
                      </svg>
                      <blockquote className="relative z-10 text-[13.5px] sm:text-[14.5px] lg:text-[15px] font-normal leading-[1.65] text-[#ccd3df] max-w-[720px]">
                        &ldquo;{activeReview.quote}&rdquo;
                      </blockquote>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Row inside card: Ergonomic, enlarged 48px–52px Carousel Buttons */}
              <div className="flex items-center justify-end gap-2.5 mt-6 pt-3.5 border-t border-[rgba(255,255,255,0.06)]">
                <button
                  onClick={handlePrev}
                  aria-label="Previous community perspective"
                  className="w-11 h-11 sm:w-12 sm:h-12 lg:w-[50px] lg:h-[50px] rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(18,24,36,0.9)] text-[#d5dee8] hover:text-white hover:border-[var(--cyan-bright,#38d1ff)]/60 hover:bg-[rgba(56,209,255,0.08)] active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next community perspective"
                  className="w-11 h-11 sm:w-12 sm:h-12 lg:w-[50px] lg:h-[50px] rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(18,24,36,0.9)] text-[#d5dee8] hover:text-white hover:border-[var(--cyan-bright,#38d1ff)]/60 hover:bg-[rgba(56,209,255,0.08)] active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === PEOPLE RAIL: Horizontal 5-Person Selection Rail === */}
      <div className="mt-4 pt-1">
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
          {reviews.map((person, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={person.id}
                onClick={() => handleSelect(idx)}
                aria-label={`View perspective from ${person.name}`}
                className={cn(
                  "group relative flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer shrink-0 text-left",
                  isActive
                    ? "bg-[rgba(56,209,255,0.08)] border border-[rgba(56,209,255,0.4)] shadow-[0_0_12px_rgba(56,209,255,0.12)]"
                    : "bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.22)] hover:bg-[rgba(255,255,255,0.05)]"
                )}
              >
                {/* Small thumbnail avatar */}
                <div
                  className={cn(
                    "relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden transition-all duration-200 shrink-0",
                    isActive
                      ? "ring-2 ring-[var(--cyan-bright,#38d1ff)] opacity-100"
                      : "opacity-60 group-hover:opacity-100 ring-1 ring-white/10"
                  )}
                >
                  <Image
                    src={person.thumbnailSrc || person.imageSrc}
                    alt={person.name}
                    fill
                    sizes="32px"
                    className="object-cover object-top"
                  />
                </div>

                {/* Name Label */}
                <span
                  className={cn(
                    "text-[12px] sm:text-[12.5px] tracking-tight whitespace-nowrap transition-colors duration-200",
                    isActive
                      ? "text-white font-semibold"
                      : "text-[#8e98a8] group-hover:text-[#e2e8f0] font-normal"
                  )}
                >
                  {person.shortName || person.name}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan-bright,#38d1ff)] shadow-[0_0_6px_var(--cyan-bright,#38d1ff)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
