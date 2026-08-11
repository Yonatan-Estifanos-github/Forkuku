'use client';

import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  enableTopFade?: boolean;
  enableBottomFade?: boolean;
}

export default function Section({
  children,
  className = "",
  id,
  enableTopFade = false,
  enableBottomFade = false
}: SectionProps) {
  return (
    <section id={id} className={`relative w-full ${className}`}>
      {/* Top Fade Gradient - blends seamlessly with the current theme's background */}
      {enableTopFade && (
        <div
          className="absolute top-0 left-0 right-0 h-40 z-30 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, var(--surface) 0%, transparent 100%)'
          }}
        />
      )}

      {children}

      {/* Bottom Fade Gradient - blends seamlessly with the current theme's background */}
      {enableBottomFade && (
        <div
          className="absolute bottom-0 left-0 right-0 h-40 z-30 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, var(--surface) 0%, transparent 100%)'
          }}
        />
      )}
    </section>
  );
}
