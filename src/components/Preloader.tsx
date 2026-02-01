'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCountdown, formatNumber } from '@/hooks/useCountdown';

// ============================================================================
// PRELOADER MESSAGE
// ============================================================================
const PRELOADER_MESSAGE = `Glory to God for this beautiful season! We are so excited to share our story with you.

We have a strict guest limit we need to stick to, so if you did not receive a Save the Date via email or phone number, we unfortunately cannot accommodate you. We love you dearly and appreciate your understanding.

The Registry is open to everyone — no invite needed for that one.

- Yonatan & Saron`;

const PRELOADER_DURATION = 20000; // 20 seconds total

// ============================================================================
// MAIN PRELOADER COMPONENT
// ============================================================================
interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { timeRemaining, mounted } = useCountdown();

  // Hide scrollbar during preloader
  useEffect(() => {
    document.documentElement.classList.add('preloader-active');
    document.body.classList.add('preloader-active');
    return () => {
      document.documentElement.classList.remove('preloader-active');
      document.body.classList.remove('preloader-active');
    };
  }, []);

  useEffect(() => {
    // Fade out and complete after total duration
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, PRELOADER_DURATION - 1000);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, PRELOADER_DURATION);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleSkip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsFadingOut(true);
    setTimeout(onComplete, 1000);
  };

  // Text Variants
  const containerVariants = {
    show: {
      transition: {
        staggerChildren: 0.015,
        delayChildren: 0.5,
      },
    },
  };

  const characterVariants = {
    hidden: { opacity: 0, y: 10, filter: "blur(8px)" },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] }
    },
  };

  return (
    <motion.div
      initial={{ opacity: 1, backgroundColor: "#0a0908" }}
      animate={{ 
        opacity: isFadingOut ? 0 : 1,
        backgroundColor: ["#0a0908", "#12100e", "#0a0908"] // Breathing background
      }}
      transition={{ 
        opacity: { duration: 1, ease: 'easeInOut' },
        backgroundColor: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }}
      className="fixed inset-0 h-[100dvh] z-50 flex flex-col items-center justify-between overflow-hidden"
      onClick={() => handleSkip()}
    >
      {/* 1. Header Spacer - Prevents text from touching top area where SoundController lives */}
      <div className="w-full shrink-0 h-20 relative z-50" />

      {/* 2. Middle Text Area - Flexible & Scrollable if needed */}
      <div className="flex-1 w-full max-w-[600px] px-6 flex items-center justify-center overflow-hidden">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="font-serif italic text-base sm:text-xl md:text-2xl text-[#D4A845] leading-relaxed text-center"
        >
          {PRELOADER_MESSAGE.split('\n\n').map((paragraph, pIndex) => (
            <span key={pIndex} className="block mb-6 sm:mb-8 last:mb-0">
              {paragraph.split('').map((char, cIndex) => (
                <motion.span key={cIndex} variants={characterVariants}>
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* 3. Footer Area - Countdown & Space for Skip */}
      <div className="shrink-0 w-full flex flex-col items-center pb-24 sm:pb-32 pt-8 z-40">
        {mounted && !timeRemaining.isComplete && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex items-center gap-4 sm:gap-8"
          >
            {[
              { label: "Days", value: timeRemaining.days },
              { label: "Hrs", value: timeRemaining.hours },
              { label: "Min", value: timeRemaining.minutes },
              { label: "Sec", value: timeRemaining.seconds }
            ].map((item, i) => (
               <div key={i} className="flex flex-col items-center">
                 <span className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-white tabular-nums">
                   {formatNumber(item.value)}
                 </span>
                 <span className="text-[9px] sm:text-xs text-[#D4A845]/70 tracking-[0.2em] uppercase mt-1 sm:mt-2">
                   {item.label}
                 </span>
               </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Skip button - PRESERVED POSITION */}
      <button
        onClick={handleSkip}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[#D4A845]/50 hover:text-[#D4A845] text-xs tracking-[0.3em] uppercase transition-colors duration-300 z-50"
      >
        Skip
      </button>

      {/* Progress Bar - NEW */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#D4A845]/20 z-50">
        <motion.div
          className="h-full bg-[#D4A845]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: PRELOADER_DURATION / 1000, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}
