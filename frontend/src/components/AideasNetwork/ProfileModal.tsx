'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, GraduationCap } from 'lucide-react';
import { FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { Member } from './networkData';

interface ProfileModalProps {
  member: Member | null;
  onClose: () => void;
}

export default function ProfileModal({ member, onClose }: ProfileModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!member) return null;

  return (
    <AnimatePresence>
      {member && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          {/* Backdrop Click area */}
          <div
            className="absolute inset-0"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative z-10 w-full max-w-md bg-slate-900 border border-sky-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(56,189,248,0.25)] select-none text-white"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Avatar & Header */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-sky-400 shadow-xl"
                />
                <div className="absolute -bottom-2 right-0 px-2.5 py-0.5 rounded-full bg-slate-950 border border-sky-400/50 text-[10px] font-bold text-sky-300 shadow-md">
                  aIDEAS
                </div>
              </div>

              {/* Name */}
              <h3 className="text-2xl font-black text-white tracking-tight">
                {member.name}
              </h3>

              {/* Role */}
              <p className="text-sm font-semibold text-sky-400 mt-1">
                {member.role}
              </p>

              {/* Department Badge */}
              <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
                <span>{member.department}</span>
              </div>
            </div>

            {/* Bio Description */}
            <p className="mt-5 text-sm text-slate-300 leading-relaxed text-center bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              {member.bio}
            </p>

            {/* Social Links Footer */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-3">
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-600/20 border border-sky-500/40 text-sky-300 hover:bg-sky-600 hover:text-white transition-all text-xs font-bold"
                >
                  <FaLinkedinIn className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              )}

              {member.instagram && (
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-xs font-bold"
                >
                  <FaInstagram className="w-4 h-4 text-pink-400" />
                  <span>Instagram</span>
                </a>
              )}

              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-xs font-bold"
                >
                  <Mail className="w-4 h-4 text-sky-400" />
                  <span>Email</span>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
