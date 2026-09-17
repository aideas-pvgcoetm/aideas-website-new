'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gsap.utils.toArray('.about-card') as HTMLElement[];

    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power4.out',
          delay: i * 0.2,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const handleMouseMove = (e: MouseEvent) => {
        const { width, height, left, top } = card.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        const rotateX = ((y - height / 2) / height) * -5;
        const rotateY = ((x - width / 2) / width) * 5;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      };
      const handleMouseLeave = () => {
        card.style.transform = '';
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, []);

  return (
    <section
      ref={containerRef}
      id="about"
      className="w-full px-6 sm:px-12 py-24 relative z-10"
    >
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-500">
          About aIDEAS
        </h2>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          Learn what drives us — our mission, our passion, and our commitment to the{' '}
          <br />
          AI & Data Science community.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* Card 1 */}
        <div className="about-card bg-gradient-to-br from-[#1e1e1e] to-[#111111] border border-purple-500 rounded-2xl shadow-xl p-6 transition duration-300 group">
          <h3 className="text-2xl font-semibold text-purple-400 mb-2">Who We Are</h3>
          <p className="text-gray-300 text-base">
            aIDEAS is a passionate student-led association at PVGCOET, bringing together enthusiasts of Artificial Intelligence and Data Science. We aim to bridge the gap between theoretical learning and practical implementation.
          </p>
        </div>

        {/* Card 2 */}
        <div className="about-card bg-gradient-to-br from-[#1e1e1e] to-[#111111] border border-sky-500 rounded-2xl shadow-xl p-6 transition duration-300 group">
          <h3 className="text-2xl font-semibold text-sky-400 mb-2">What We Do</h3>
          <p className="text-gray-300 text-base">
            We organize technical events, workshops, guest lectures, and project showcases to nurture real-world skills and collaborative innovation in AI and DS.
          </p>
        </div>

        {/* Card 3 */}
        <div className="about-card bg-gradient-to-br from-[#1e1e1e] to-[#111111] border border-purple-500 rounded-2xl shadow-xl p-6 transition duration-300 group">
          <h3 className="text-2xl font-semibold text-purple-400 mb-2">Vision & Mission</h3>
          <p className="text-gray-300 text-base">
            Our mission is to create an ecosystem where students not only learn but build. We envision a future where every student is AI-aware, AI-capable, and AI-empowered.
          </p>
        </div>

        {/* Card 4 */}
        <div className="about-card bg-gradient-to-br from-[#1e1e1e] to-[#111111] border border-sky-500 rounded-2xl shadow-xl p-6 transition duration-300 group">
          <h3 className="text-2xl font-semibold text-sky-400 mb-2">Our Values</h3>
          <p className="text-gray-300 text-base">
            We believe in innovation, inclusivity, curiosity, and teamwork. At aIDEAS, every idea matters — and every mind can shape the future.
          </p>
        </div>
      </div>
    </section>
  );
}
