/*
"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import EventCard from "@/components/EventCard";
import EventModal from "@/components/EventModal";
import { motion } from "framer-motion";

const events = [
  {
    title: "Avinya",
    date: "5th May 2023",
    description: "Group of events taken in this",
    image: "/Avinya.png",
    longDescription: " Avinya – A Celebration of Innovation and Talent  Avinya was a flagship event organized by the aIDEAS Student Association at PVG's College of Engineering and Technology, bringing together students from diverse backgrounds to engage in a variety of technical and non-technical activities on campus.The event served as a vibrant platform for students to showcase their creativity, collaborate with peers, and step beyond academics to explore new dimensions of learning and fun. From planning to participation, Avinya successfully fostered a sense of community, innovation, and enthusiasm among all involved. It was not just an event — it was an experience that celebrated ideas, talent, and togetherness.  "
  },
  {
    title: "Murder Mystery",
    date: "5th May 2023",
    description: "A thrilling problem-solving challenge.",
    image: "/mystry.png",
    longDescription: "Our 'Murder Mystery' event challenged participants to put on their detective hats. Teams worked together to analyze clues, interrogate virtual suspects, and solve a complex fictional crime. This event was designed to promote critical thinking, teamwork, and deductive reasoning in a fun and engaging format."
  },
  {
    title: "Tug of War",
    date: "5th May 2023",
    description: "A classic test of strength and teamwork.",
    image: "/war.png",
    longDescription: "More than just a physical contest, the annual Tug of War brought students and faculty together for a spirited competition. It emphasized collaboration, strategy, and collective effort, proving that strength lies in unity. The event was a highlight of our college fest, fostering a sense of community and friendly rivalry."
  },
  {
    title: "Escape Room",
    date: "5th May 2023",
    description: "An immersive puzzle-solving adventure.",
    image: "/Room.png",
    longDescription: "The Escape Room event locked teams in a themed room with a series of intricate puzzles and hidden clues. They had to race against the clock to solve the mysteries and find the key to escape. This activity tested problem-solving skills, communication under pressure, and attention to detail."
  },
  {
    title: "Salvation Army Visit",
    date: "18th Oct 2023",
    description: "A day of community service and giving back.",
    image: "/army.png",
    longDescription: "Our visit to the Salvation Army was a heartwarming experience focused on community outreach. Volunteers spent the day assisting with daily operations, organizing donations, and interacting with the residents. This event underscored our commitment to social responsibility and making a positive impact beyond our campus."
  },
  {
    title: "Masterchef PVG",
    date: "17th Oct 2023",
    description: "A culinary competition for food lovers.",
    image: "/vlog.JPG",
    longDescription: "Masterchef PVG was a delicious showdown where our campus's best amateur chefs competed. Participants were challenged with mystery boxes and technical skills tests, showcasing their creativity and culinary talent to a panel of judges. The aroma of competition and great food filled the air!"
  },
  {
    title: "Googler Talk",
    date: "17th Oct 2023",
    description: "Insights from an industry expert on AI.",
    image: "/Goo.JPG",
    longDescription: "We had the honor of hosting a senior software engineer from Google for an inspiring talk on the future of Artificial Intelligence. The speaker shared valuable insights into current industry trends, career pathways in AI/ML, and the ethical considerations shaping the future of technology. The session concluded with an interactive Q&A."
  },
  {
    title: "Flip the Code",
    date: "5th Jan 2024",
    description: "An unconventional coding challenge.",
    image: "/FLIP.jpg",
    longDescription: "'Flip the Code' turned traditional coding competitions on their head. Participants were given a working piece of code and its output, but with the logic flipped or reversed. Their task was to debug and reconstruct the original logic, testing their understanding of code flow and problem-solving from a different perspective."
  },
  {
    title: "Code Clash",
    date: "2nd April 2025",
    description: "A competitive programming showdown.",
    image: "/code.png",
    longDescription: "Code Clash is our flagship annual coding competition, attracting the brightest minds to solve a series of complex algorithmic problems. Contestants compete in a high-stakes environment to write efficient and accurate code under tight deadlines, battling for prizes and bragging rights as the top coder on campus."
  },
];

type Event = (typeof events)[0];

export default function EventsPage() {
  const titleRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    gsap.from(titleRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-purple-900 to-black py-10 overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px] animate-[moveStars_50s_linear_infinite]" />
        <style jsx>{`
          @keyframes moveStars {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: 1000px 1000px;
            }
          }
        `}</style>
      </div>

      <main className="relative z-10 px-4 sm:px-6 py-8 sm:py-12 max-w-6xl mx-auto">
        <h1
          ref={titleRef}
          className="page-title text-3xl sm:text-5xl font-bold mb-12 text-center text-gradient bg-gradient-to-r from-purple-600 via-pink-500 to-red-400 bg-clip-text text-transparent"
        >
          Our Past Events
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-black/60 border border-fuchsia-700 rounded-2xl overflow-hidden 
              md:shadow-none md:hover:scale-105 md:hover:border-cyan-400 md:hover:shadow-[0_0_20px_#0ff] 
              transition-all duration-300"
            >
              <EventCard {...event} onLearnMore={() => handleOpenModal(event)} />
            </motion.div>
          ))}
        </div>
      </main>

      {selectedEvent && <EventModal event={selectedEvent} onClose={handleCloseModal} />}
    </div>
  );
}
*/


/*NEW PAGE 1*/

/*'use client';

import React, { useState } from 'react';

// Achievements Data Structure
const achievementsData = [
  {
    id: 1,
    students: ['Padmaraj Pawar', 'Aditya Tilekar', 'Aariya Vora', 'Aishwarya Kavhekar', 'Krish Chobe'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    title: '3rd Position at PICT IMPETUS Project Exhibition',
    details: 'Domain: Digital Image/Speech/Video Processing. Project: VoiceShield - A Real-Time Hybrid AI Framework for Detecting Generative Voice-Cloning and Scam Intent.',
    badge: 'Exhibition Winner'
  },
  {
    id: 2,
    students: ['Padmaraj Pawar'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    title: 'Bhagirath Karandak Award',
    details: 'Team member (Actor) in award-winning performance at the prestigious Purushottam Karandak Competition.',
    badge: 'Cultural'
  },
  {
    id: 3,
    students: ['Soham Mule', 'Aditya Ajay Tilekar', 'Komal'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    title: 'Winners - VOIS INNOVATION MARATHON 2.0',
    details: 'Built a centralized urban mobility solution helping users select optimized routes to solve urban commute problems.',
    badge: 'Hackathon Winner'
  },
  {
    id: 4,
    students: ['Soham Mule', 'Aditya Ajay Tilekar', 'Komal'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    title: '2nd Rank - IBM SkillsBuild Hacknexus 2025',
    details: 'Secured 2nd rank at IBM SkillsBuild Hacknexus 2025 powered by EDUNET.',
    badge: 'Hackathon Winner'
  },
  {
    id: 5,
    students: ['Saanidhi Gade'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    title: '3rd Rank - HardHack Forge Hackathon 2026',
    details: 'Developed a Smart Mirror AI Assistant with seamless hardware–ML integration at PCCOE.',
    badge: 'Hackathon Winner'
  }
];

// Timeline Events Data
const timelineEvents = [
  {
    date: 'Sep 2025',
    title: 'Think-Prompt-Build Event',
    description: 'Flagship prompt engineering and rapid AI prototyping competition organized by AiDeas.',
    status: 'Latest'
  },
  {
    date: 'Dec 2025',
    title: 'Event 2 (Upcoming)',
    description: 'Upcoming hands-on workshop on generative AI agents and model evaluation.',
    status: 'Upcoming'
  },
  {
    date: 'Mar 2026',
    title: 'Event 3 (Upcoming)',
    description: 'National level hackathon bringing together AI innovators and builders.',
    status: 'Upcoming'
  }
];

export default function SpotlightPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'achievements'>('events');
  const [selectedBatch, setSelectedBatch] = useState<string>('All');

  const batches = ['All', '2028 (SE)', '2027 (TE)', '2029 (FE)'];

  const filteredAchievements = selectedBatch === 'All'
    ? achievementsData
    : achievementsData.filter(item => item.batch === selectedBatch);

  return (
    <div className="min-h-screen bg-[#05050A] text-white pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Spotlight
        </h1>
        <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
          Highlighting our key historical events, upcoming initiatives, and major student achievements.
        </p>

        <div className="flex justify-center mt-8">
          <div className="bg-[#0D0D18] p-1.5 rounded-full border border-gray-800 flex gap-2">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === 'events'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Events Timeline
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === 'achievements'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Major Achievements
            </button>
          </div>
        </div>
      </div>

      
      {activeTab === 'events' && (
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10 text-cyan-300">
            Key Historical Milestones & Upcoming Events
          </h2>

          <div className="relative border-l-2 border-purple-900/60 ml-4 md:ml-32 pl-6 md:pl-10 space-y-12">
            {timelineEvents.map((event, index) => (
              <div key={index} className="relative group">
                
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-6 h-6 rounded-full border-2 border-purple-500 bg-[#0A0A14] group-hover:bg-purple-600 group-hover:scale-125 transition-all duration-300 flex items-center justify-center shadow-md shadow-purple-500/50">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                </div>

                
                <div className="bg-[#0B0C16] border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-900/20 transition-all duration-300">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-bold text-purple-400 tracking-wider">
                      {event.date}
                    </span>
                    {event.status === 'Latest' ? (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        {event.status}
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                        {event.status}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      
      {activeTab === 'achievements' && (
        <div className="mt-8">
          
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <span className="text-sm text-gray-400 font-medium mr-2">Filter Batch:</span>
            {batches.map((batch) => (
              <button
                key={batch}
                onClick={() => setSelectedBatch(batch)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  selectedBatch === batch
                    ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/30'
                    : 'bg-[#0E0F1D] border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                }`}
              >
                {batch}
              </button>
            ))}
          </div>

         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((item) => (
              <div
                key={item.id}
                className="bg-[#0B0C16] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-900/10 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-cyan-950/40 text-cyan-400 border border-cyan-800/30">
                      Academic Year 2025-26
                    </span>
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      {item.batch}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
                    {item.details}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-800/80 mt-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                    Student / Team:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.students.map((student, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium bg-[#14162B] text-gray-200 px-2.5 py-1 rounded-md border border-gray-700/50"
                      >
                        {student}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

*/

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeuralBackground from '@/components/ui/NeuralBackground';

// Achievements Data Structure
const achievementsData = [
  {
    id: 1,
    students: ['Padmaraj Pawar', 'Aditya Tilekar', 'Aariya Vora', 'Aishwarya Kavhekar', 'Krish Chobe'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    date: 'Mar 2025',
    title: '3rd Position at PICT IMPETUS Project Exhibition',
    details: 'Domain: Digital Image/Speech/Video Processing. Project: VoiceShield - A Real-Time Hybrid AI Framework for Detecting Generative Voice-Cloning and Scam Intent.',
    badge: 'Exhibition Winner',
    images: [
      '/achievements/impetus-ceremony.jpg',
      '/achievements/impetus-group.jpg',
      '/achievements/impetus-certificates.jpg',
    ]
  },
  {
    id: 2,
    students: ['Padmaraj Pawar'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    date: 'Oct 2025',
    title: 'Bhagirath Karandak Award',
    details: 'Team member (Actor) in award-winning performance at the prestigious Purushottam Karandak Competition.',
    badge: 'Cultural',
    images: [
      '/achievements/bhagirath-karandak.jpg',
    ]
  },
  {
    id: 3,
    students: ['Soham Mule', 'Aditya Ajay Tilekar', 'Komal'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    date: 'Nov 2025',
    title: 'Winners - VOIS INNOVATION MARATHON 2.0',
    details: 'Built a centralized urban mobility solution helping users select optimized routes to solve urban commute problems.',
    badge: 'Hackathon Winner',
    images: [
      '/achievements/vois-award-ceremony.jpg',
      '/achievements/vois-cheque.jpg',
    ]
  },
  {
    id: 4,
    students: ['Soham Mule', 'Aditya Ajay Tilekar', 'Komal'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    date: 'Jan 2025',
    title: '2nd Rank - IBM SkillsBuild Hacknexus 2025',
    details: 'Secured 2nd rank at IBM SkillsBuild Hacknexus 2025 powered by EDUNET.',
    badge: 'Hackathon Winner',
    images: [
      '/achievements/ibm-hacknexus.jpg',
    ]
  },
  {
    id: 5,
    students: ['Saanidhi Gade'],
    class: 'SE',
    year: '2025-26',
    batch: '2028 (SE)',
    date: 'Feb 2026',
    title: '3rd Rank - HardHack Forge Hackathon 2026',
    details: 'Developed a Smart Mirror AI Assistant with seamless hardware–ML integration at PCCOE.',
    badge: 'Hackathon Winner',
    images: [
      '/achievements/hardhack-pccoe.jpg',
      '/achievements/hardhack-certificate.jpg',
    ]
  }
];

// Lightbox Component
function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c + 1) % images.length);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-md"
        onClick={onClose}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xl transition-all"
        >
          ✕
        </button>

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-gray-400 bg-black/50 px-3 py-1 rounded-full">
            {current + 1} / {images.length}
          </div>
        )}

        {/* Prev */}
        {images.length > 1 && (
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white text-lg transition-all"
          >
            ‹
          </button>
        )}

        {/* Image */}
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-[90vw] max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={images[current]}
            alt={`Photo ${current + 1}`}
            className="object-contain max-h-[85vh] max-w-[90vw] rounded-2xl"
          />
        </motion.div>

        {/* Next */}
        {images.length > 1 && (
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white text-lg transition-all"
          >
            ›
          </button>
        )}

        {/* Dot Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? 'bg-cyan-400 scale-125' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Timeline Events Data — newest at top, oldest at bottom
const timelineEvents = [
  {
    date: '24th Oct 2026',
    year: '2026',
    title: 'NEUROVERSE Ideathon 2026',
    description: 'A one-day student ideathon focused on practical ideas built around AI and data.',
    longDescription: (
      <div className="space-y-4">
        <p>Teams from colleges across Pune will develop, refine and present solutions with mentoring, evaluation and prizes as part of a focused innovation experience.</p>
        <div>
          <strong className="text-[var(--text)]">Themes:</strong>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>01 INTELLIGENCE & INNOVATION IN HEALTHCARE</li>
            <li>02 SMART CITIES & SUSTAINABLE DEVELOPMENT</li>
            <li>03 OPEN INNOVATION</li>
          </ul>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="bg-[var(--bg-soft)] p-3 rounded-xl border border-[var(--border)]">
            <span className="block text-xs font-semibold text-[var(--cyan-bright)] uppercase tracking-wider mb-1">Time & Venue</span>
            <span className="text-[var(--text)] text-sm">10:00 AM - 5:00 PM<br/>PVG’s COET&M, Pune</span>
          </div>
          <div className="bg-[var(--bg-soft)] p-3 rounded-xl border border-[var(--border)]">
            <span className="block text-xs font-semibold text-[var(--purple-bright)] uppercase tracking-wider mb-1">Participation</span>
            <span className="text-[var(--text)] text-sm">50+ teams (3-4 members)<br/>Open to all colleges</span>
          </div>
        </div>
        <div className="p-3 rounded-xl border mt-4" style={{ background: 'var(--panel-grad)', borderColor: 'var(--cyan-bright)' }}>
          <span className="block text-xs font-bold text-[var(--text)] uppercase tracking-wider mb-1 flex items-center gap-2">
            🏆 Prize Pool
          </span>
          <span className="text-[var(--cyan-bright)] font-semibold">Rs. 15,000+ in cash prizes, plus goodies</span>
        </div>
      </div>
    ),
    photos: [],
    status: 'Upcoming'
  },
  {
    date: '14th Sep 2025',
    year: '2025',
    title: 'Think-Prompt-Build',
    description: 'Flagship prompt engineering and rapid AI prototyping competition organized by AiDeas.',
    longDescription: 'Think-Prompt-Build challenged participants to leverage modern generative AI models and intelligent prompt engineering to rapidly architect and prototype functioning real-world solutions. Teams competed across domains including Accessibility, Sustainability, Education, and Productivity to demonstrate high-velocity AI craftsmanship.',
    photos: ['/code.png'],
    status: 'Latest'
  },
  {
    date: '2nd April 2025',
    year: '2025',
    title: 'Code Clash',
    description: 'A competitive programming showdown that attracted the brightest minds on campus.',
    longDescription: 'Code Clash is our flagship annual coding competition, attracting the brightest minds to solve a series of complex algorithmic problems. Contestants competed in a high-stakes environment to write efficient and accurate code under tight deadlines, battling for prizes and bragging rights as the top coder on campus.',
    photos: ['/code.png'],
    status: 'Past'
  },
  {
    date: '5th Jan 2024',
    year: '2024',
    title: 'Flip the Code',
    description: 'An unconventional coding challenge where participants decoded reversed logic.',
    longDescription: `"Flip the Code" turned traditional coding competitions on their head. Participants were given a working piece of code and its output, but with the logic flipped or reversed. Their task was to debug and reconstruct the original logic, testing their understanding of code flow and problem-solving from a different perspective.`,
    photos: ['/FLIP.jpg'],
    status: 'Past'
  },
];

type TimelineEvent = (typeof timelineEvents)[0];

// Event Detail Modal
function EventModal({ event, onClose }: { event: TimelineEvent; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        key="event-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 24 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          className="relative max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all text-sm"
          >
            ✕
          </button>

          {/* Photo */}
          {event.photos && event.photos.length > 0 && (
            <div className="w-full h-52 overflow-hidden relative">
              <img src={event.photos[0]} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--panel), transparent)' }} />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {/* Title + badge */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="text-xl font-extrabold text-[var(--text)] leading-snug" style={{ fontFamily: 'var(--font-display)' }}>{event.title}</h2>
              <span className="shrink-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-full mt-1" style={event.status === 'Latest' ? { background: 'rgba(56,209,255,0.1)', color: 'var(--cyan-bright)', border: '1px solid rgba(56,209,255,0.3)' } : { background: 'rgba(176,107,255,0.08)', color: 'var(--purple-bright)', border: '1px solid rgba(176,107,255,0.25)' }}>
                {event.status}
              </span>
            </div>
            {/* Date */}
            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded" style={{ color: 'var(--text-dim)', background: 'var(--border)' }}>
              {event.date}
            </span>
            {/* Detailed description */}
            <div className="mt-4 text-[var(--text-dim)] text-sm leading-relaxed">{event.longDescription}</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Achievement Detail Modal
function AchievementModal({
  item,
  onClose,
}: {
  item: (typeof achievementsData)[0];
  onClose: () => void;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="relative rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            ✕
          </button>

          {/* Photo Gallery */}
          {item.images && item.images.length > 0 && (
            <div className="w-full h-56 sm:h-64 overflow-hidden rounded-t-3xl relative group">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setLightboxIndex(0)}
              />
              {/* Thumbnail row */}
              {item.images.length > 1 && (
                <div className="absolute bottom-3 left-3 flex gap-2">
                  {item.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxIndex(i)}
                      className="w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shadow"
                      style={{ borderColor: 'var(--border)' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor='var(--cyan-bright)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor='var(--border)')}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-md" style={{ background: 'rgba(56,209,255,0.1)', color: 'var(--cyan-bright)', border: '1px solid rgba(56,209,255,0.3)' }}>
                Academic Year {item.year}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded border" style={{ background: 'rgba(56,209,255,0.15)', color: 'var(--cyan-bright)', borderColor: 'rgba(56,209,255,0.4)' }}>
                {item.batch}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded border ml-auto" style={{ background: 'rgba(176,107,255,0.15)', color: 'var(--purple-bright)', borderColor: 'rgba(176,107,255,0.4)' }}>
                {item.badge}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text)] mb-4 leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
              {item.title}
            </h2>

            {/* Details */}
            <p className="text-[var(--text-dim)] text-sm leading-relaxed mb-6">
              {item.details}
            </p>

            {/* Students */}
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <span className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider block mb-3">
                Student / Team:
              </span>
              <div className="flex flex-wrap gap-2">
                {item.students.map((student, idx) => (
                  <span
                    key={idx}
                    className="text-sm font-medium text-[var(--text)] px-3 py-1.5 rounded-lg border transition-colors"
                    style={{ background: 'var(--bg-soft)', borderColor: 'var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor='var(--cyan-bright)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor='var(--border)')}
                  >
                    {student}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Lightbox inside modal */}
      {lightboxIndex !== null && item.images && (
        <Lightbox
          images={item.images}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </AnimatePresence>
  );
}

export default function SpotlightPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'achievements'>('events');
  const [selectedBatch, setSelectedBatch] = useState<string>('All');
  const [selectedAchievement, setSelectedAchievement] = useState<(typeof achievementsData)[0] | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<(typeof timelineEvents)[0] | null>(null);

  const batches = ['All', '2028 (SE)', '2027 (TE)', '2029 (FE)'];

  const filteredAchievements = selectedBatch === 'All'
    ? achievementsData
    : achievementsData.filter(item => item.batch === selectedBatch);

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden ambient-panel">

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title Header */}
        <div className="section-head mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-heading-title"
          >
            <span className="grad-text">Spotlight</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-heading-description mx-auto"
          >
            Highlighting our key historical events, upcoming initiatives, and major student achievements.
          </motion.p>

          {/* Tab Switcher */}
          <div className="flex justify-center mt-8">
            <div className="p-1.5 rounded-full border flex gap-2" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
              <button
                onClick={() => setActiveTab('events')}
                className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'events'
                    ? 'text-black'
                    : 'text-[var(--text-dim)] hover:text-[var(--text)]'
                }`}
              >
                {activeTab === 'events' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full" style={{ background: 'var(--grad)', boxShadow: '0 0 18px rgba(56,209,255,0.3)' }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">Events Timeline</span>
              </button>

              <button
                onClick={() => setActiveTab('achievements')}
                className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'achievements'
                    ? 'text-black'
                    : 'text-[var(--text-dim)] hover:text-[var(--text)]'
                }`}
              >
                {activeTab === 'achievements' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full" style={{ background: 'var(--grad)', boxShadow: '0 0 18px rgba(56,209,255,0.3)' }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">Major Achievements</span>
              </button>
            </div>
          </div>
        </div>

        {/* EVENTS TAB CONTENT */}
        {activeTab === 'events' && (
          <div className="mt-12 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-14 tracking-wide text-[var(--cyan-bright)]" style={{ fontFamily: 'var(--font-display)' }}>
              Key Historical Milestones & Events
            </h2>

            {/* Central Timeline Container */}
            <div className="relative">
              {/* Central Vertical Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px hidden md:block" style={{ background: 'var(--grad)', boxShadow: '0 0 12px rgba(176,107,255,0.5)' }} />
              {/* Mobile left line */}
              <div className="absolute left-6 top-0 bottom-0 w-px md:hidden" style={{ background: 'var(--grad)' }} />

              <div className="space-y-16 md:space-y-20">
                {timelineEvents.map((event, index) => {
                  const isEven = index % 2 === 0;

                  return (
                    <div key={index} className="relative flex flex-col md:flex-row items-start md:items-center">
                      {/* Central Glowing Orb Node */}
                      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center" style={{ border: '2px solid var(--cyan-bright)', background: 'var(--bg)', boxShadow: '0 0 16px rgba(56,209,255,0.6)' }}>
                        <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: 'var(--cyan-bright)' }} />
                      </div>

                      {/* Content Card Wrapper */}
                      <div className={`w-full md:w-[46%] pl-14 md:pl-0 ${
                        isEven ? 'md:pr-10 md:mr-auto' : 'md:pl-10 md:ml-auto'
                      }`}>
                        <div
                          className="timeline-card group backdrop-blur-md rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                          style={{
                            background: 'var(--panel)',
                            border: '1px solid var(--border)',
                            transform: isEven ? 'translateX(-48px)' : 'translateX(48px)',
                            opacity: 0,
                            transition: `opacity 0.5s ease ${index * 0.15}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 0.15}s, border-color 0.2s ease, box-shadow 0.2s ease`
                          }}
                          ref={(el) => {
                            if (el) {
                              const isMobile = () => window.innerWidth < 768;
                              const initialTransform = isMobile()
                                ? 'translateY(40px)'
                                : isEven ? 'translateX(-48px)' : 'translateX(48px)';
                              el.style.transform = initialTransform;
                              el.style.opacity = '0';
                              const obs = new IntersectionObserver(([e]) => {
                                if (e.isIntersecting) {
                                  el.style.opacity = '1';
                                  el.style.transform = isMobile() ? 'translateY(0)' : 'translateX(0)';
                                  obs.disconnect();
                                }
                              }, { threshold: 0.12 });
                              obs.observe(el);
                            }
                          }}
                          onClick={() => setSelectedEvent(event)}
                          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--cyan-bright)'; el.style.boxShadow = '0 0 30px rgba(56,209,255,0.12)'; }}
                          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.boxShadow = ''; }}
                        >
                          {/* Card body — title, description, date */}
                          <div className="p-5">
                            <h3 className="text-lg font-bold text-[var(--text)] leading-snug mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                              {event.title}
                            </h3>
                            <p className="text-[var(--text-dim)] text-sm leading-relaxed mb-3">
                              {event.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[11px] px-1.5 py-0.5 rounded" style={{ color: 'var(--text-dim)', background: 'var(--border)' }}>
                                {event.date}
                              </span>
                              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={event.status === 'Latest' ? { background: 'rgba(56,209,255,0.1)', color: 'var(--cyan-bright)', border: '1px solid rgba(56,209,255,0.3)' } : { background: 'rgba(176,107,255,0.08)', color: 'var(--purple-bright)', border: '1px solid rgba(176,107,255,0.25)' }}>
                                {event.status}
                              </span>
                            </div>
                          </div>

                          {/* Hover-reveal: photo + detail panel */}
                          <div
                            className="overflow-hidden"
                            style={{ maxHeight: 0, transition: 'max-height 0.4s cubic-bezier(0.22,1,0.36,1)' }}
                            ref={(el) => {
                              if (!el) return;
                              const card = el.closest('.timeline-card') as HTMLElement;
                              if (!card) return;
                              const show = () => { el.style.maxHeight = el.scrollHeight + 'px'; };
                              const hide = () => { el.style.maxHeight = '0px'; };
                              card.addEventListener('mouseenter', show);
                              card.addEventListener('mouseleave', hide);

                              // Expand on scroll for mobile
                              const obs = new IntersectionObserver(([e]) => {
                                if (window.innerWidth < 768) {
                                  if (e.isIntersecting) {
                                    show();
                                  } else {
                                    hide();
                                  }
                                }
                              }, { rootMargin: '-15% 0px -15% 0px', threshold: 0 });
                              obs.observe(card);
                            }}
                          >
                            {/* Photo */}
                            {event.photos && event.photos.length > 0 && (
                              <div className="w-full h-40 overflow-hidden relative">
                                <img src={event.photos[0]} alt={event.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--panel), transparent)' }} />
                              </div>
                            )}
                            {/* Detail text */}
                            <div className="px-5 pb-5 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                              <div className="text-[var(--text-dim)] text-xs leading-relaxed">
                                {event.longDescription}
                              </div>
                              <p className="mt-3 text-[11px] font-medium" style={{ color: 'var(--cyan-bright)' }}>
                                Click to view full details →
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS TAB CONTENT */}
        {activeTab === 'achievements' && (
          <div className="mt-8">
            {/* Batch Filter Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              <span className="text-sm text-[var(--text-dim)] font-medium mr-2">Filter Batch:</span>
              {batches.map((batch) => (
                <button
                  key={batch}
                  onClick={() => setSelectedBatch(batch)}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200"
                  style={selectedBatch === batch
                    ? { background: 'var(--grad)', borderColor: 'transparent', color: 'black', boxShadow: '0 0 12px rgba(56,209,255,0.3)' }
                    : { background: 'var(--panel)', borderColor: 'var(--border)', color: 'var(--text-dim)' }}
                >
                  {batch}
                </button>
              ))}
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredAchievements.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    onClick={() => setSelectedAchievement(item)}
                    className="backdrop-blur-md rounded-2xl overflow-hidden flex flex-col shadow-md cursor-pointer group" style={{ background: 'var(--panel)', border: '1px solid var(--border)', transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-5px) scale(1.02)'; el.style.borderColor = 'var(--cyan-bright)'; el.style.boxShadow = '0 10px 30px rgba(56,209,255,0.12)'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.borderColor = 'var(--border)'; el.style.boxShadow = ''; }}
                  >
                    {/* Photo thumbnail */}
                    <div className="relative w-full h-48 overflow-hidden" style={{ background: 'var(--bg-soft)' }}>
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-faint)] text-4xl">
                          🏆
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(0,0,0,0.3)' }}>
                        <span className="text-[var(--text)] text-xs px-4 py-1.5 rounded-full border font-medium" style={{ background: 'var(--header-bg)', borderColor: 'var(--border)' }}>
                          View Details →
                        </span>
                      </div>
                    </div>

                    {/* Minimal card info: title + date */}
                    <div className="p-5 flex flex-col gap-1.5">
                      <h3 className="text-base font-bold text-[var(--text)] leading-snug transition-colors" style={{ fontFamily: 'var(--font-display)' }} onMouseEnter={e => (e.currentTarget.style.color='var(--cyan-bright)')} onMouseLeave={e => (e.currentTarget.style.color='var(--text)')}>
                        {item.title}
                      </h3>
                      {item.date && (
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded self-start" style={{ color: 'var(--text-dim)', background: 'var(--border)' }}>
                          {item.date}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <AchievementModal
          item={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}