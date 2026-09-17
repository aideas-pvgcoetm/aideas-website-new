'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import AiModelWorkspace from './AiModelWorkspace';
import WorkshopConsole from './WorkshopConsole';
import CommunityNetwork from './CommunityNetwork';
import SectionHeading from '@/components/ui/SectionHeading';

export default function ZigzagSection() {
  const learnBlockRef = useRef<HTMLDivElement>(null);
  const isLearnBlockInView = useInView(learnBlockRef, {
    once: true,
    amount: 0.25,
    margin: '0px 0px -40px 0px',
  });

  const workshopsBlockRef = useRef<HTMLDivElement>(null);
  const isWorkshopsInView = useInView(workshopsBlockRef, {
    once: true,
    amount: 0.25,
    margin: '0px 0px -40px 0px',
  });

  const communityBlockRef = useRef<HTMLDivElement>(null);
  const isCommunityInView = useInView(communityBlockRef, {
    once: true,
    amount: 0.25,
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

        {/* Block 1 */}
        <div className="zigzag-block learn-by-building-block" ref={learnBlockRef}>
          <motion.div
            className="zigzag-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={isLearnBlockInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3>Learn by building</h3>
            <p>
              Workshops and reading groups are just the start — every track ends with a real project, reviewed by peers and mentors, not a quiz.
            </p>
            <Link href="/about" className="zigzag-link">
              Read our story →
            </Link>
          </motion.div>
          <div className="zigzag-visual">
            <AiModelWorkspace isTriggered={isLearnBlockInView} />
          </div>
        </div>

        {/* Block 2 (Reverse) */}
        <div className="zigzag-block reverse" ref={workshopsBlockRef}>
          <motion.div
            className="zigzag-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={isWorkshopsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3>Workshops & hackathons</h3>
            <p>
              From weekend build nights to a full 24-hour hack day — hands-on sessions run through the semester, open to every year and branch.
            </p>
            <Link href="/events" className="zigzag-link">
              See events →
            </Link>
          </motion.div>
          <div className="zigzag-visual">
            <WorkshopConsole isTriggered={isWorkshopsInView} />
          </div>
        </div>

        {/* Block 3 */}
        <div className="zigzag-block" ref={communityBlockRef}>
          <motion.div
            className="zigzag-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={isCommunityInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3>A growing community</h3>
            <p>
              A cross-year network of students who share resources, opportunities, and momentum — meet the core team running it.
            </p>
            <Link href="/members" className="zigzag-link">
              Meet the team →
            </Link>
          </motion.div>
          <div className="zigzag-visual">
            <CommunityNetwork isTriggered={isCommunityInView} />
          </div>
        </div>
      </div>
    </section>
  );
}
