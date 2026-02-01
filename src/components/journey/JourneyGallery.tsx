'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import JourneyCard from './JourneyCard';
import { JOURNEY_DATA } from './journeyData';

export default function JourneyGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [endX, setEndX] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Calculate exact pixel distance so the last card's right edge meets the viewport's right edge
  useEffect(() => {
    function measure() {
      if (!trackRef.current) return;
      const trackScrollWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const overflow = trackScrollWidth - viewportWidth;
      if (overflow > 0) {
        setEndX(-overflow);
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, endX]);

  return (
    <section id="story" ref={containerRef} className="relative h-[250vh] md:h-[300vh]">
      {/* Sticky viewport — dvh for mobile address bar, touch-pan-y for swipe */}
      <div className="sticky top-0 h-[100dvh] overflow-hidden flex flex-col justify-center touch-pan-y">
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
          className="flex gap-6 md:gap-8 pl-[5vw] md:pl-[10vw] pr-[5vw] md:pr-[10vw]"
        >
          {JOURNEY_DATA.map((item, index) => (
            <JourneyCard
              key={item.year}
              item={item}
              index={index}
              scrollProgress={scrollYProgress}
            />
          ))}
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
