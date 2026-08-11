'use client';

import { ReactNode, useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with luxurious, weighted scroll feel
    const lenis = new Lenis({
      duration: 1.8,           // Slow, heavy scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth expo easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,    // Slower wheel response for premium feel
      touchMultiplier: 1.5,    // Slightly faster touch for mobile usability
    });

    lenisRef.current = lenis;

    // RAF loop for smooth updates
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Lenis takes over scroll control, so the browser's native "jump to
    // #anchor on load" behavior no longer fires — honor it manually. Delayed
    // so heavier sections (3D hero, lazy content) have settled before we
    // measure the target's position.
    let hashScrollTimer: ReturnType<typeof setTimeout> | undefined;
    const hash = window.location.hash;
    if (hash) {
      hashScrollTimer = setTimeout(() => {
        const target = document.querySelector(hash);
        if (target) lenis.scrollTo(target as HTMLElement, { offset: 0 });
      }, 600);
    }

    // Cleanup on unmount
    return () => {
      if (hashScrollTimer) clearTimeout(hashScrollTimer);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
