'use client';

import dynamic from 'next/dynamic';

const AideasNetwork = dynamic(() => import('@/components/AideasNetwork/AideasNetwork'), {
  ssr: false,
});

export default function MembersPage() {
  return (
    <main className="min-h-screen text-white bg-[#090b11]">
      <AideasNetwork />
    </main>
  );
}
