'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import JourneyCard from './JourneyCard';
import { JOURNEY_DATA } from './journeyData';

export default function JourneyGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [endPercent, setEndPercent] = useState(-100);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Calculate how far to translate based on track width vs viewport
  useEffect(() => {
    function measure() {
      if (!trackRef.current) return;
      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const overflow = trackWidth - viewportWidth;
      if (overflow > 0) {
        setEndPercent(-(overflow / trackWidth) * 100);
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `${endPercent}%`]
  );

  return (
    <section id="story" ref={containerRef} className="relative h-[250vh] md:h-[300vh]">
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        {/* Section header */}
        <div className="text-center mb-8 md:mb-12 px-4 z-10">
          <p className="font-sans text-[#D4A845]/60 uppercase tracking-[0.4em] text-xs mb-3">
            Our Story
          </p>
          <h2 className="font-serif text-4xl md:text-6xl gold-shimmer">
            Our Journey
          </h2>
        </div>

        {/* Horizontal scrolling track */}
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-6 md:gap-8 pl-[5vw] md:pl-[10vw]"
        >
          {JOURNEY_DATA.map((item, index) => (
            <JourneyCard
              key={item.year}
              item={item}
              index={index}
              scrollProgress={scrollYProgress}
            />
          ))}
          {/* End spacer so last card can reach center */}
          <div className="flex-shrink-0 w-[10vw]" />
        </motion.div>

        {/* Progress bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-[#D4A845]/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#D4A845] origin-left"
            style={{ scaleX: scrollYProgress }}
          />
        </div>
      </div>
    </section>
  );
}
