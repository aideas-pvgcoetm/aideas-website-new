import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import DownloadPdfButton from './DownloadPdfButton';
import { SelectedTeam } from '@/lib/generateResultsPdf';

export const metadata: Metadata = {
  title: 'Round 1 Results — NEUROVERSE Ideathon 2026 | aIDEAS',
  description:
    'Official Round 1 PPT submission and shortlisting results for NEUROVERSE Ideathon 2026 organized by aIDEAS at PVG’s COET&M, Pune. Congratulations to the 30 selected teams advancing to the Grand Finale on 24 October 2026.',
};

// Teams 1–15 (Authoritative source: NeuroVerse_Round1_Results.pdf, Page 2)
const teamsPart1: SelectedTeam[] = [
  { srNo: 1, teamName: 'POCDOC', teamLeader: 'Abhinav Kumar' },
  { srNo: 2, teamName: 'Quantum minds', teamLeader: 'Shivani Deshmukh' },
  { srNo: 3, teamName: 'Innov8ors', teamLeader: 'Srushti Mule' },
  { srNo: 4, teamName: '1st Sense', teamLeader: 'Omkar Shinde' },
  { srNo: 5, teamName: 'RadVault', teamLeader: 'Sarthak Kharade' },
  { srNo: 6, teamName: 'The Exceptions', teamLeader: 'Devang Patil' },
  { srNo: 7, teamName: 'Neurowell', teamLeader: 'Siddhi Jadhav' },
  { srNo: 8, teamName: 'MARS-5', teamLeader: 'Rishita Sagajkar' },
  { srNo: 9, teamName: 'Techidiots', teamLeader: 'Raghav Wadnerkar' },
  { srNo: 10, teamName: 'Team-N.TAP', teamLeader: 'Tejas Laxman Pawar' },
  { srNo: 11, teamName: 'AquaNex', teamLeader: 'Omkar Thombre' },
  { srNo: 12, teamName: 'Innov8', teamLeader: 'Parth Agre' },
  { srNo: 13, teamName: 'Ignitia', teamLeader: 'Arya Kulkarni' },
  { srNo: 14, teamName: 'OG', teamLeader: 'Vivek Sarode' },
  { srNo: 15, teamName: 'Team Econex', teamLeader: 'Surabhi bhoyar' },
];

// Teams 16–30 (Authoritative source: NeuroVerse_Round1_Results.pdf, Page 3)
const teamsPart2: SelectedTeam[] = [
  { srNo: 16, teamName: 'Team Innovexa', teamLeader: 'Rahul Kate' },
  { srNo: 17, teamName: 'Team VisionGrid', teamLeader: 'Om solanke' },
  { srNo: 18, teamName: 'NETRA', teamLeader: 'Tanay Gangshettiwar' },
  { srNo: 19, teamName: 'Neuroverse Innovators', teamLeader: 'Chavan Shreya Navnath' },
  { srNo: 20, teamName: 'AVINYA', teamLeader: 'Shrawani Lende' },
  { srNo: 21, teamName: 'ANCeption', teamLeader: 'Athang Gawai' },
  { srNo: 22, teamName: 'budYweiser', teamLeader: 'Siddhesh Chaudhari' },
  { srNo: 23, teamName: 'UTOPIA', teamLeader: 'Devendra Sahare' },
  { srNo: 24, teamName: 'Team 404', teamLeader: 'Sumit Yadav' },
  { srNo: 25, teamName: 'Team ResQ', teamLeader: 'Tanvi Anil Zagade' },
  { srNo: 26, teamName: 'Charlie 333', teamLeader: 'Vedant bijwal' },
  { srNo: 27, teamName: 'Biryani Paglus', teamLeader: 'Nishant Ninawe' },
  { srNo: 28, teamName: 'Innovative Roomies', teamLeader: 'Atharva Salunke' },
  { srNo: 29, teamName: 'Code Ninjas', teamLeader: 'Rushikesh Kurhe' },
  { srNo: 30, teamName: 'CATALYST', teamLeader: 'Aboli chavan' },
];

// Unified list of all 30 teams for single continuous mobile display
const allTeams: SelectedTeam[] = [...teamsPart1, ...teamsPart2];

function ResultsTable({
  title,
  teams,
}: {
  title: string;
  teams: SelectedTeam[];
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-blue-500/20 bg-[#080d1a]/95 backdrop-blur-sm shadow-xl shadow-black/40 flex flex-col">
      {/* Header section of the table card */}
      <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-white/[0.08] bg-gradient-to-r from-blue-950/60 via-slate-900/60 to-purple-950/40 flex items-center justify-between gap-3">
        <h2 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <span className="truncate">{title}</span>
        </h2>
        <span className="px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shrink-0">
          {teams.length} Teams
        </span>
      </div>

      {/* Semantic Table Container with natural document flow */}
      <div className="w-full overflow-x-auto md:overflow-x-visible [touch-action:pan-y]">
        <table className="w-full table-fixed text-left border-collapse">
          <colgroup>
            <col className="w-12 sm:w-16" />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.03] text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-slate-400">
              <th scope="col" className="py-2.5 sm:py-3 px-2 sm:px-4 text-center shrink-0">
                Sr. No.
              </th>
              <th scope="col" className="py-2.5 sm:py-3 px-2.5 sm:px-6">
                Team Name
              </th>
              <th scope="col" className="py-2.5 sm:py-3 px-2.5 sm:px-6">
                Team Leader
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05] text-xs sm:text-sm">
            {teams.map((team, index) => {
              const isEven = index % 2 === 0;
              return (
                <tr
                  key={team.srNo}
                  className={`transition-colors duration-150 hover:bg-cyan-500/[0.07] ${
                    isEven ? 'bg-transparent' : 'bg-white/[0.015]'
                  }`}
                >
                  <td className="py-2.5 sm:py-3 px-2 sm:px-4 text-center font-mono text-xs text-cyan-300/80 font-medium shrink-0">
                    <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      {team.srNo}
                    </span>
                  </td>
                  <td className="py-2.5 sm:py-3 px-2.5 sm:px-6 font-semibold text-white tracking-tight break-words whitespace-normal">
                    <span className="hover:text-cyan-300 transition-colors">
                      {team.teamName}
                    </span>
                  </td>
                  <td className="py-2.5 sm:py-3 px-2.5 sm:px-6 text-slate-300 break-words whitespace-normal">
                    <span className="font-medium text-slate-200">
                      {team.teamLeader}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function NeuroverseResultsPage() {
  return (
    <main className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[#04060c] text-slate-100 overflow-x-clip">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(14, 165, 233, 0.12), transparent 70%), radial-gradient(ellipse 50% 40% at 80% 60%, rgba(168, 85, 247, 0.08), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10">
        {/* Navigation Controls: Back to Event Details + Download Results PDF */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <Link
            href="/spotlight?event=neuroverse"
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 sm:py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-cyan-300 hover:border-cyan-500/30 transition-all duration-200 w-full sm:w-auto"
          >
            <span aria-hidden="true">&larr;</span>
            <span>Back to Event Details</span>
          </Link>

          <DownloadPdfButton teamsPart1={teamsPart1} teamsPart2={teamsPart2} />
        </div>

        {/* Institution & Organization Eyebrow Banner */}
        <div className="text-center space-y-2 pt-1 sm:pt-2">
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] sm:text-xs text-cyan-300 font-medium">
            <span>PUNE VIDYARTHI GRIHA’S COET&amp;M</span>
            <span className="text-blue-400/60">•</span>
            <span>aIDEAS STUDENT ASSOCIATION</span>
          </div>

          <div className="space-y-1 pt-1">
            <p className="text-xs sm:text-sm font-mono tracking-widest uppercase text-cyan-400 font-semibold">
              NEUROVERSE IDEATHON 2026
            </p>
            <h1
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight break-words px-2"
              style={{ fontFamily: 'var(--font-orbitron), sans-serif' }}
            >
              ROUND 1 RESULTS
            </h1>
            <p className="text-xs sm:text-sm italic text-blue-200/80 pt-0.5">
              Ideas Today. Impact Tomorrow.
            </p>
          </div>

          {/* Announcement text */}
          <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-slate-300 font-normal pt-2 px-2 leading-relaxed">
            Congratulations to the <strong className="text-white font-semibold">30 teams</strong> selected for the next round!
          </p>
        </div>

        {/* Key Summary Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto">
          <div className="p-3 sm:p-4 rounded-xl bg-[#080d1a]/80 border border-blue-500/20 text-center">
            <span className="block text-xl sm:text-3xl font-extrabold text-cyan-300">
              30
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5 block">
              Teams Selected
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-[#080d1a]/80 border border-blue-500/20 text-center">
            <span className="block text-xl sm:text-3xl font-extrabold text-white">
              Round 1
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5 block">
              PPT Shortlisting
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-[#080d1a]/80 border border-blue-500/20 text-center">
            <span className="block text-xl sm:text-3xl font-extrabold text-purple-300">
              24 Oct
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5 block">
              Grand Finale
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-[#080d1a]/80 border border-blue-500/20 text-center">
            <span className="block text-xl sm:text-3xl font-extrabold text-amber-300">
              ₹15,000
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5 block">
              Prize Pool
            </span>
          </div>
        </div>

        {/* Selected Teams Section */}
        <div>
          {/* Mobile View (< xl): Single Continuous Table containing all 30 teams */}
          <div className="block xl:hidden">
            <ResultsTable
              title="Selected Teams — Round 1 Results"
              teams={allTeams}
            />
          </div>

          {/* Desktop View (>= xl): Preserved Two-Column Presentation */}
          <div className="hidden xl:grid xl:grid-cols-2 gap-8 items-start">
            {/* Table 1: Teams 1–15 */}
            <ResultsTable
              title="Selected Teams 1–15"
              teams={teamsPart1}
            />

            {/* Table 2: Teams 16–30 */}
            <ResultsTable
              title="Selected Teams 16–30"
              teams={teamsPart2}
            />
          </div>
        </div>

        {/* Official Finale Notice & Motivation Banner */}
        <div className="max-w-3xl mx-auto rounded-2xl p-5 sm:p-8 text-center border border-cyan-500/30 bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-purple-950/40 shadow-xl shadow-cyan-950/20 space-y-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/30">
            All The Best !!
          </span>
          <h2
            className="text-lg sm:text-2xl font-bold text-white tracking-wide"
            style={{ fontFamily: 'var(--font-orbitron), sans-serif' }}
          >
            SEE YOU ON 24 OCT !!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed px-2">
            The selected teams will present and pitch their solutions live during the 6-hour NEUROVERSE Ideathon on 24th October 2026 at PVG’s COET&amp;M campus.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/spotlight?event=neuroverse"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-blue-600/30 transition-all duration-200"
            >
              <span>View Event Details &amp; Tracks</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
