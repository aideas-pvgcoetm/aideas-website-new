"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  image: string;
  objectPosition?: string;
  accent: "cyan" | "purple" | "gradient";
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.2,
    margin: "0px 0px -40px 0px",
  });

  const testimonials: Testimonial[] = [
    {
      name: "SRAJAL KUMAR MISHRA",
      role: "3rd Year · Frontend",
      quote:
        "Working on the frontend at aiDEAS gave me the opportunity to turn ideas into interfaces that people could actually use. Building the website and working alongside the rest of the team taught me how much better a product becomes when design, development and collaboration happen together.",
      image: "/assets/testimonials/srajal-kumar-mishra.jpg",
      objectPosition: "center 30%",
      accent: "cyan",
    },
    {
      name: "PRANAV PARDESHI",
      role: "3rd Year · Backend",
      quote:
        "Working on the backend at aiDEAS pushed me beyond writing individual pieces of code. I got to work on the systems and logic that power the projects, while learning how to build something reliable that connects smoothly with what the users see.",
      image: "/assets/testimonials/pranav-pardeshi.jpg",
      objectPosition: "center 22%",
      accent: "purple",
    },
    {
      name: "SAANIDHI GADE",
      role: "3rd Year · Joint Head · Former Member",
      quote:
        "I joined aiDEAS as a member and eventually took on the responsibility of Joint Head. Being part of that journey taught me how much a student community can grow through collaboration, shared knowledge and people willing to take responsibility for making things happen.",
      image: "/assets/testimonials/saanidhi-gade.jpg",
      objectPosition: "center 18%",
      accent: "gradient",
    },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <section ref={sectionRef} className="section-pad ambient-panel">
      <div className="wrap">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionHeading
            eyebrow="WHAT MEMBERS SAY"
            wordmarkText="Straight from the community."
          />
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {testimonials.map((t, i) => {
            const isCyan = t.accent === "cyan";
            const isPurple = t.accent === "purple";

            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 22 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
                transition={{
                  duration: 0.65,
                  delay: 0.15 + i * 0.14,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onMouseMove={handleMouseMove}
                className={`testimonial-card relative rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0d121c] p-6 sm:p-7 flex flex-col justify-between overflow-hidden group transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[rgba(255,255,255,0.22)] shadow-[0_24px_50px_-24px_rgba(0,0,0,0.85)] ${
                  isCyan
                    ? "hover:shadow-[0_22px_45px_-18px_rgba(56,209,255,0.22)]"
                    : isPurple
                    ? "hover:shadow-[0_22px_45px_-18px_rgba(176,107,255,0.22)]"
                    : "hover:shadow-[0_22px_45px_-18px_rgba(56,209,255,0.16),0_22px_45px_-18px_rgba(176,107,255,0.16)]"
                }`}
              >
                {/* Subtle static top-corner accent sheen */}
                <div
                  className={`pointer-events-none absolute -top-20 -right-20 w-44 h-44 rounded-full ${
                    isCyan
                      ? "bg-[radial-gradient(circle,rgba(56,209,255,0.08)_0%,transparent_70%)]"
                      : isPurple
                      ? "bg-[radial-gradient(circle,rgba(176,107,255,0.07)_0%,transparent_70%)]"
                      : "bg-[radial-gradient(circle,rgba(56,209,255,0.06)_0%,transparent_70%)]"
                  }`}
                  aria-hidden="true"
                />

                {/* Interactive cursor-following atmospheric light */}
                <div
                  className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isCyan
                      ? "bg-[radial-gradient(360px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(56,209,255,0.09),transparent_65%)]"
                      : isPurple
                      ? "bg-[radial-gradient(360px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(176,107,255,0.09),transparent_65%)]"
                      : "bg-[radial-gradient(360px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(56,209,255,0.07),rgba(176,107,255,0.06)_40%,transparent_65%)]"
                  }`}
                  aria-hidden="true"
                />

                {/* Top Row: aiDEAS Member badge (Number labels completely removed) */}
                <div className="testimonial-divider flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-[var(--text-faint)] uppercase">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isCyan
                          ? "bg-[var(--cyan-bright)] shadow-[0_0_6px_rgba(56,209,255,0.5)]"
                          : isPurple
                          ? "bg-[var(--purple-bright)] shadow-[0_0_6px_rgba(176,107,255,0.5)]"
                          : "bg-gradient-to-r from-[var(--cyan-bright)] to-[var(--purple-bright)] shadow-[0_0_6px_rgba(56,209,255,0.5)]"
                      }`}
                    />
                    aiDEAS Member
                  </span>
                </div>

                {/* Testimonial Quotation */}
                <p className="testimonial-quote text-[14.5px] sm:text-[15px] text-[#ccd3df] leading-[1.72] font-normal my-2 tracking-[0.01em] flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Subtle Divider */}
                <div className="testimonial-divider w-full h-[1px] bg-[rgba(255,255,255,0.06)] my-5" />

                {/* Author Info Row */}
                <div className="flex items-center gap-3.5">
                  <motion.div
                    initial={{ scale: 0.88, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.88, opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.25 + i * 0.14,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="shrink-0"
                  >
                    <img
                      src={t.image}
                      alt={t.name}
                      loading="lazy"
                      className="w-12 h-12 rounded-full object-cover border border-[rgba(255,255,255,0.12)] shadow-[0_0_14px_rgba(0,0,0,0.6)]"
                      style={{ objectPosition: t.objectPosition || "center center" }}
                    />
                  </motion.div>

                  <div className="min-w-0">
                    <div className="testimonial-author font-display font-bold text-[13.5px] sm:text-[14px] text-white tracking-wide truncate">
                      {t.name}
                    </div>
                    <div className="text-[11.5px] font-mono text-[var(--text-faint)] mt-0.5 truncate">
                      {t.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
