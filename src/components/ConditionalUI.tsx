'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import FloatingNav from '@/components/FloatingNav';
import SoundController from '@/components/SoundController';

export default function ConditionalUI() {
  const pathname = usePathname();

  // Fire Supabase click-tracking when a magic link was just used
  useEffect(() => {
    const raw = document.cookie
      .split('; ')
      .find((c) => c.startsWith('track_magic_click='))
      ?.split('=')[1];
    if (!raw) return;

    // Consume the signal immediately so it never fires twice
    document.cookie = 'track_magic_click=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    fetch('/api/rsvp/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partyId: decodeURIComponent(raw) }),
    }).catch(() => {});
  }, []);

  // Hide nav and sound controller on admin and login routes
  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      <SoundController />
      <FloatingNav />
    </>
  );
}
