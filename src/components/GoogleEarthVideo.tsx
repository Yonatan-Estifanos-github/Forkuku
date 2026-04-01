'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const VIDEO_SRC = "/videos/wedding_venue.mp4";

export default function GoogleEarthVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
  const [canPlay, setCanPlay] = useState(false);
  const { t, language } = useLanguage();
  const isAmharic = language === 'am';

  const CAPTIONS = [
    { text: [t('venue.caption1')] },
    { text: [t('venue.caption2')] },
    { text: [t('venue.caption3_1'), t('venue.caption3_2')] },
    { text: [t('venue.caption4_1'), t('venue.caption4_2')] }
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visibleEnough = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        setCanPlay(visibleEnough);
      },
      { threshold: [0, 0.5, 1] }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (canPlay) {
      video.play().catch(() => null);
    } else {
      video.pause();
    }
  }, [canPlay]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    
    // Cycle through 4 captions in 15 seconds
    const index = Math.floor(time / 3.75);
    const clampedIndex = Math.min(index, CAPTIONS.length - 1);
    if (clampedIndex !== currentCaptionIndex) {
      setCurrentCaptionIndex(clampedIndex);
    }
  };

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay={false}
        muted
        loop
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Centered Captions */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCaptionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {CAPTIONS[currentCaptionIndex].text.map((line, i) => (
              <h2 
                key={i}
                className={`italic text-2xl md:text-4xl lg:text-5xl text-[#D4A845] mb-2 leading-tight drop-shadow-xl ${isAmharic ? 'font-ethiopic font-light' : 'font-serif'}`}
              >
                {line}
              </h2>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Scroll Hint */}
      <div className="absolute bottom-12 left-0 w-full z-30 flex flex-col items-center justify-center px-6 text-center">
        <span className={`text-[#D4A845] text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold mb-4 opacity-90 drop-shadow-md max-w-md leading-relaxed ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : ''}`}>
          {t('venue.rsvpHint')}
        </span>
        
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-[#D4A845] drop-shadow-lg"
        >
          <svg 
            className="w-8 h-8 md:w-10 md:h-10" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
