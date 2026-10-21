'use client';

import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';
import { SelectedTeam, downloadResultsPdf } from '@/lib/generateResultsPdf';

interface DownloadPdfButtonProps {
  teamsPart1: SelectedTeam[];
  teamsPart2: SelectedTeam[];
}

export default function DownloadPdfButton({
  teamsPart1,
  teamsPart2,
}: DownloadPdfButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    try {
      setDownloading(true);
      downloadResultsPdf(teamsPart1, teamsPart2, 'NeuroVerse_Round1_Results.pdf');
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    } catch (err) {
      console.error('Failed to generate results PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={downloading}
      aria-label="Download Results PDF"
      className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 sm:py-1.5 rounded-xl text-xs sm:text-sm font-bold text-white transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 shadow-md cursor-pointer shrink-0 w-full sm:w-auto"
      style={{
        background: 'linear-gradient(135deg, #071A35 0%, #0B3D82 50%, #1267C5 100%)',
        border: '1px solid rgba(115, 183, 255, 0.45)',
        boxShadow: '0 3px 12px rgba(7, 26, 53, 0.5)',
      }}
    >
      {downloaded ? (
        <>
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-emerald-300">Downloaded PDF</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-cyan-300 shrink-0" />
          <span>Download Results PDF</span>
        </>
      )}
    </button>
  );
}
