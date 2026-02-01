'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCountdown, formatNumber } from '@/hooks/useCountdown';

// ============================================================================
// PRELOADER MESSAGE (Typing Effect)
// ============================================================================
const PRELOADER_MESSAGE = `Glory to God for this beautiful season! We are so excited to share our story with you.

We have a strict guest limit we need to stick to, so if you did not receive a Save the Date via email or phone number, we unfortunately cannot accommodate you. We love you dearly and appreciate your understanding.

The Registry is open to everyone — no invite needed for that one.

- Yonatan & Saron`;

const PRELOADER_DURATION = 40000; // 40 seconds total
const TYPING_DURATION = 35000; // 35 seconds to type

// ============================================================================
// MAIN PRELOADER COMPONENT
// ============================================================================
interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
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
    const totalChars = PRELOADER_MESSAGE.length;
    const charDelay = TYPING_DURATION / totalChars;
    let currentCount = 0;
    let typingTimer: NodeJS.Timeout;

    const revealNextChar = () => {
      if (currentCount < totalChars) {
        currentCount++;
        setVisibleCount(currentCount);
        typingTimer = setTimeout(revealNextChar, charDelay);
      } else {
        setIsTypingComplete(true);
      }
    };

    // Start revealing after a brief pause
    typingTimer = setTimeout(revealNextChar, 500);

    // Fade out and complete after total duration
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, PRELOADER_DURATION - 1000);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, PRELOADER_DURATION);

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className={`fixed inset-0 z-50 bg-[#0a0908] flex flex-col items-center justify-center ${isTypingComplete ? 'cursor-pointer' : ''}`}
      onClick={() => {
        if (isTypingComplete) {
          setIsFadingOut(true);
          setTimeout(onComplete, 1000);
        }
      }}
    >
      {/* Container for typing text */}
      <div className="flex flex-col items-center max-w-[600px] px-8">
        {/* Typing Effect Message */}
        <p className="preloader-text font-serif italic text-xl sm:text-2xl text-[#D4A845] leading-relaxed text-center mb-12">
          {PRELOADER_MESSAGE.slice(0, visibleCount).split('\n\n').map((paragraph, index, array) => (
            <span key={index}>
              {paragraph.split('').map((char, charIdx) => (
                <motion.span
                  key={charIdx}
                  initial={{ opacity: 0, filter: 'blur(4px)', y: 5 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  transition={{ duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
                >
                  {char}
                </motion.span>
              ))}
              {index < array.length - 1 && <><br /><br /></>}
            </span>
          ))}
        </p>

        {/* Central Countdown */}
        {mounted && !timeRemaining.isComplete && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex items-center gap-4 sm:gap-8"
          >
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white tabular-nums">{formatNumber(timeRemaining.days)}</span>
              <span className="text-[10px] sm:text-xs text-[#D4A845]/70 tracking-[0.2em] uppercase mt-2">Days</span>
            </div>
            <span className="text-white/30 text-2xl sm:text-3xl font-serif italic pb-4">:</span>
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white tabular-nums">{formatNumber(timeRemaining.hours)}</span>
              <span className="text-[10px] sm:text-xs text-[#D4A845]/70 tracking-[0.2em] uppercase mt-2">Hrs</span>
            </div>
            <span className="text-white/30 text-2xl sm:text-3xl font-serif italic pb-4">:</span>
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white tabular-nums">{formatNumber(timeRemaining.minutes)}</span>
              <span className="text-[10px] sm:text-xs text-[#D4A845]/70 tracking-[0.2em] uppercase mt-2">Min</span>
            </div>
            <span className="text-white/30 text-2xl sm:text-3xl font-serif italic pb-4">:</span>
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white tabular-nums">{formatNumber(timeRemaining.seconds)}</span>
              <span className="text-[10px] sm:text-xs text-[#D4A845]/70 tracking-[0.2em] uppercase mt-2">Sec</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Skip button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsFadingOut(true);
          setTimeout(onComplete, 1000);
        }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[#D4A845]/50 hover:text-[#D4A845] text-xs tracking-[0.3em] uppercase transition-colors duration-300"
      >
        Skip
      </button>
    </motion.div>
  );
}
