'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, Quote, ChevronRight, UserCheck } from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa';
import { Member } from './networkData';

interface LeftDataPanelProps {
  stageName: string;
  stageStep: number;
  totalSteps: number;
  activeMember: Member | null;
  onOpenModal: (member: Member) => void;
}

export default function LeftDataPanel({
  stageName,
  stageStep,
  totalSteps,
  activeMember,
  onOpenModal,
}: LeftDataPanelProps) {
  if (!activeMember) return null;

  return (
    <div className="w-full lg:w-[450px] xl:w-[480px] shrink-0 select-none z-40 pointer-events-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMember.id}
          initial={{ opacity: 0, x: -35, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 35, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-black/95 border-2 border-blue-500/50 rounded-3xl p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(59,130,246,0.3)] backdrop-blur-2xl flex flex-col sm:flex-row gap-5 overflow-hidden"
        >
          {/* LEFT HALF: Clean Humanized Portrait Photo */}
          <div className="relative w-full sm:w-[190px] h-[240px] sm:h-auto min-h-[250px] shrink-0 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl group">
            <img
              src={activeMember.image}
              alt={activeMember.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* RIGHT HALF: Structured Data Column */}
          <div className="flex-1 flex flex-col justify-between space-y-4 py-1 pr-1">
            {/* Header: Name, Role & Department */}
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                {activeMember.name}
              </h3>
              <p className="text-xs sm:text-sm font-extrabold text-blue-400 mt-1">
                {activeMember.role}
              </p>
              {activeMember.department && (
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300">
                  {activeMember.department}
                </span>
              )}
            </div>

            {/* Bio / Quote Box */}
            <div className="relative bg-[#09090b] border border-zinc-800/80 rounded-xl p-3.5 text-zinc-300">
              <Quote className="absolute top-2.5 right-2.5 w-4 h-4 text-blue-500/20" />
              <p className="text-xs sm:text-sm leading-relaxed font-normal italic relative z-10">
                "{activeMember.bio}"
              </p>
            </div>

            {/* Actions: Solid Blue Button & Social Links */}
            <div className="pt-2 flex items-center gap-2.5 border-t border-zinc-800/80">
              <button
                onClick={() => onOpenModal(activeMember)}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"
              >
                <span>View Full Profile</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {activeMember.linkedin && (
                <a
                  href={activeMember.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-blue-400 hover:text-white hover:bg-blue-600 transition-all shadow-md"
                  title="LinkedIn Profile"
                >
                  <FaLinkedinIn className="w-4 h-4" />
                </a>
              )}

              {activeMember.email && (
                <a
                  href={`mailto:${activeMember.email}`}
                  className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-blue-400 hover:text-white hover:bg-blue-600 transition-all shadow-md"
                  title="Send Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
