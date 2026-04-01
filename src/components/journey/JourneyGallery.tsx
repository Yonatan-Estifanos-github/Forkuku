'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import JourneyCard from './JourneyCard';
import { JOURNEY_DATA } from './journeyData';
import { useLanguage } from '@/context/LanguageContext';

export default function JourneyGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const isAmharic = language === 'am';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // The golden thread scales from origin-top as user scrolls through the section
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="story" ref={containerRef} className="relative bg-luxury-black py-24 md:py-40">
      {/* Section header */}
      <div className="text-center mb-20 md:mb-32 px-4 max-w-2xl mx-auto">
        <h2 className={`text-4xl md:text-6xl gold-shimmer mb-8 ${isAmharic ? 'font-ethiopic font-light' : 'font-serif'}`}>
          {t('journey.heading')}
        </h2>
        <div className="w-8 h-[1px] bg-wedding-gold/40 mx-auto mb-8" />
        <p className={`text-base md:text-lg text-white/60 leading-relaxed ${isAmharic ? 'font-ethiopic font-light' : 'font-serif italic'}`}>
          {t('journey.subtitle')}
        </p>
        <p className={`text-xs uppercase tracking-[0.35em] text-wedding-gold/50 mt-6 ${isAmharic ? 'font-ethiopic not-italic normal-case tracking-normal' : 'font-sans'}`}>
          {t('journey.scrollPrompt')}
        </p>
      </div>

      {/* Timeline body */}
      <div className="relative max-w-5xl mx-auto px-4 md:px-12">

        {/* The Golden Thread — 1px vertical center line that draws downward on scroll */}
        <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-[1px] overflow-hidden pointer-events-none">
          {/* Dim background track */}
          <div className="absolute inset-0 bg-wedding-gold/15" />
          {/* Animated gold fill — origin-top so it draws downward */}
          <motion.div
            className="absolute inset-x-0 top-0 w-full bg-wedding-gold origin-top"
            style={{ scaleY: lineScaleY, height: '100%' }}
          />
        </div>

        {/* Cards */}
        <div className="flex flex-col">
          {JOURNEY_DATA.map((item, index) => (
            <JourneyCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
