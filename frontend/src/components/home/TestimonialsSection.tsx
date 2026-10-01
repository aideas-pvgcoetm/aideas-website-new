"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import LeadershipTestimonial from "./LeadershipTestimonial";
import { TestimonialSlider, type Review } from "@/components/ui/testimonial-slider";

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.2,
    margin: "0px 0px -40px 0px",
  });

  const reviews: Review[] = [
    {
      id: 1,
      name: "Srajal Kumar Mishra",
      shortName: "Srajal",
      designation: "Core Team Member · Frontend",
      quote:
        "Working on the frontend at aiDEAS gave me the opportunity to turn ideas into interfaces that people could actually use. Building the website and working alongside the rest of the team taught me how much better a product becomes when design, development and collaboration happen together.",
      imageSrc: "/assets/testimonials/srajal-kumar-mishra.jpg",
      thumbnailSrc: "/assets/testimonials/srajal-kumar-mishra.jpg",
    },
    {
      id: 2,
      name: "Pranav Pardeshi",
      shortName: "Pranav",
      designation: "Core Team Member · Backend",
      quote:
        "Working on the backend at aiDEAS pushed me beyond writing individual pieces of code. I got to work on the systems and logic that power the projects, while learning how to build something reliable that connects smoothly with what the users see.",
      imageSrc: "/assets/testimonials/pranav-pardeshi.jpg",
      thumbnailSrc: "/assets/testimonials/pranav-pardeshi.jpg",
    },
    {
      id: 3,
      name: "Saanidhi Gade",
      shortName: "Saanidhi",
      designation: "Technical Head",
      quote:
        "I joined aiDEAS as a member and eventually took on the responsibility of Joint Head. Being part of that journey taught me how much a student community can grow through collaboration, shared knowledge and people willing to take responsibility for making things happen.",
      imageSrc: "/assets/testimonials/saanidhi-gade.jpg",
      thumbnailSrc: "/assets/testimonials/saanidhi-gade.jpg",
      socials: {
        instagram: "https://www.instagram.com/_.saanidhi._",
        linkedin: "https://www.linkedin.com/in/saanidhi-gade/",
        email: "gadesaanidhi@gmail.com",
      },
    },
    {
      id: 4,
      name: "Ganesh Rokade",
      shortName: "Ganesh",
      designation: "Sponsorship & PR Head",
      quote:
        "Representing aiDEAS has taught me to start conversations, communicate our ideas clearly, and build relationships beyond campus. As Sponsorship & PR Head, I enjoy connecting people who believe in student potential with a team ready to turn that support into meaningful opportunities.",
      imageSrc: "/assets/testimonials/ganesh-rokade.jpg",
      thumbnailSrc: "/assets/testimonials/ganesh-rokade.jpg",
      socials: {
        instagram: "https://www.instagram.com/justfree2006?stkn=NGhzdHNraXhyM2lw",
        linkedin: "https://www.linkedin.com/in/ganeshrokade06?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        email: "rokadeganesh701@gmail.com",
      },
    },
    {
      id: 5,
      name: "Omkar Mulage",
      shortName: "Omkar",
      designation: "Documentation & Editorial",
      quote:
        "Every project and event has something worth sharing. At aiDEAS, I enjoy turning the team’s ideas and experiences into clear stories and useful documentation. It’s rewarding to know that what we record today can help the next batch learn, build, and take things further.",
      imageSrc: "/assets/testimonials/omkar-mulage.jpg",
      thumbnailSrc: "/assets/testimonials/omkar-mulage.jpg",
      socials: {
        instagram: "https://www.instagram.com/omkarmulage_?stkn=bjU3cTN3NjVyNGNj",
        linkedin: "https://www.linkedin.com/in/omkar-mulage-708b77320?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        email: "omkarmulage9@gmail.com",
      },
    },
  ];

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

        {/* Featured Leadership Testimonial (General Secretaries Carousel) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 mb-2"
        >
          <LeadershipTestimonial />
        </motion.div>

        {/* Subtle Divider between Leadership and Community Testimonials */}
        <div className="pt-8 pb-3 border-t border-[rgba(255,255,255,0.06)] mt-8 flex items-center justify-between">
          <span className="text-xs font-mono tracking-widest text-[var(--text-faint,#626b78)] uppercase font-semibold">
            COMMUNITY VOICES
          </span>
          <span className="text-[11px] font-mono tracking-widest text-[var(--text-faint,#626b78)] uppercase">
            05 PERSPECTIVES
          </span>
        </div>

        {/* 5-Person Editorial Voice Rail */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.65, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4"
        >
          <TestimonialSlider reviews={reviews} />
        </motion.div>
      </div>
    </section>
  );
}
