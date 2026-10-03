'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import CinematicSectionVideo from './CinematicSectionVideo';
import SectionHeading from '@/components/ui/SectionHeading';

export default function ZigzagSection() {
  const visionBlockRef = useRef<HTMLDivElement>(null);
  const isVisionInView = useInView(visionBlockRef, {
    once: true,
    amount: 0.2,
    margin: '0px 0px -40px 0px',
  });

  const missionBlockRef = useRef<HTMLDivElement>(null);
  const isMissionInView = useInView(missionBlockRef, {
    once: true,
    amount: 0.2,
    margin: '0px 0px -40px 0px',
  });

  const communityBlockRef = useRef<HTMLDivElement>(null);
  const isCommunityInView = useInView(communityBlockRef, {
    once: true,
    amount: 0.2,
    margin: '0px 0px -40px 0px',
  });

  const valuesBlockRef = useRef<HTMLDivElement>(null);
  const isValuesInView = useInView(valuesBlockRef, {
    once: true,
    amount: 0.2,
    margin: '0px 0px -40px 0px',
  });

  return (
    <section className="zigzag-section section-pad ambient-panel">
      <div className="wrap">
        <SectionHeading
          eyebrow="Why join"
          wordmarkText="Everything you need to start building."
          description="A community, a curriculum, and a reason to ship something real before you graduate."
        />

        {/* Block 1 — VISION: text left, video right */}
        <div className="zigzag-block learn-by-building-block" ref={visionBlockRef}>
          <motion.div
            className="zigzag-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={isVisionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3>Vision</h3>
            <p>
              A community where AI &amp; DS students learn by building — not just by attending.
            </p>
            <ul className="zigzag-list">
              <li>Make every student AI-capable, not just AI-aware</li>
              <li>Turn classroom theory into real, working projects</li>
              <li>Build a community that grows stronger every batch</li>
              <li>Become the go-to space for AI &amp; DS at PVGCOET</li>
            </ul>
            <Link href="/#our-story" className="zigzag-link">
              Read our story &rarr;
            </Link>
          </motion.div>
          <div className="zigzag-visual">
            <CinematicSectionVideo
              src="/assets/videos/home/vision/vision.mp4"
              isBlockInView={isVisionInView}
              objectFit="cover"
            />
          </div>
        </div>

        {/* Block 2 — MISSION: video left, text right */}
        <div className="zigzag-block reverse" ref={missionBlockRef}>
          <motion.div
            className="zigzag-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={isMissionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3>Mission</h3>
            <ul className="zigzag-list">
              <li>Build real projects, not just theory</li>
              <li>Connect students with industry mentors</li>
              <li>Learn from peers, not just professors</li>
              <li>Lead events, not just attend them</li>
            </ul>
            <Link href="/spotlight" className="zigzag-link">
              See events &rarr;
            </Link>
          </motion.div>
          <div className="zigzag-visual">
            <CinematicSectionVideo
              src="/assets/videos/home/mission/mission.mp4"
              isBlockInView={isMissionInView}
              objectFit="cover"
            />
          </div>
        </div>

        {/* Block 3 — A GROWING COMMUNITY: text left, video right (content unchanged) */}
        <div className="zigzag-block" ref={communityBlockRef}>
          <motion.div
            className="zigzag-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={isCommunityInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3>A growing community</h3>
            <p>
              A cross-year network of students who share resources, opportunities, and momentum —
              meet the core team running it.
            </p>
            <Link href="/members" className="zigzag-link">
              Meet the team →
            </Link>
          </motion.div>
          <div className="zigzag-visual">
            <CinematicSectionVideo
              src="/assets/videos/home/community/community.mp4"
              isBlockInView={isCommunityInView}
              objectFit="cover"
            />
          </div>
        </div>

        {/* Block 4 — VALUES: video left, text right */}
        <div className="zigzag-block reverse" ref={valuesBlockRef}>
          <motion.div
            className="zigzag-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={isValuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3>Values</h3>
            <ul className="zigzag-list">
              <li>
                <span className="zigzag-list-label">Curiosity</span> — Ask how, not just what
              </li>
              <li>
                <span className="zigzag-list-label">Collaboration</span> — Better built together
              </li>
              <li>
                <span className="zigzag-list-label">Inclusivity</span> — Beginners welcome
              </li>
              <li>
                <span className="zigzag-list-label">Impact</span> — Build things that outlast the
                semester
              </li>
            </ul>
            <Link href="/#our-story" className="zigzag-link">
              Our values &rarr;
            </Link>
          </motion.div>
          <div className="zigzag-visual">
            <CinematicSectionVideo
              src="/assets/videos/home/values/values.mp4"
              isBlockInView={isValuesInView}
              objectFit="cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
