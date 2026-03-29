'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCountdown, formatNumber } from '@/hooks/useCountdown';
import { useLanguage, type Language } from '@/context/LanguageContext';

const PRELOADER_DURATION = 20000; // 20 seconds total

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { timeRemaining, mounted } = useCountdown();
  const { language, setLanguage, t } = useLanguage();

  // Key incremented on language switch so the character animation restarts
  const [animKey, setAnimKey] = useState(0);

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
    setIsFadingOut(false);
    const fadeTimer = setTimeout(() => setIsFadingOut(true), PRELOADER_DURATION - 1000);
    const completeTimer = setTimeout(onComplete, PRELOADER_DURATION);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, animKey]);

  const handleSkip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsFadingOut(true);
    setTimeout(onComplete, 1000);
  };

  const handleLanguageSelect = (e: React.MouseEvent, lang: Language) => {
    e.stopPropagation();
    if (lang !== language) {
      setLanguage(lang);
      setAnimKey(k => k + 1);
    }
  };

  const paragraphs = [
    t('preloader.message1'),
    t('preloader.message2'),
    t('preloader.message3'),
    t('preloader.signature'),
  ];

  const countdownItems = [
    { labelKey: 'preloader.days', value: timeRemaining.days },
    { labelKey: 'preloader.hrs',  value: timeRemaining.hours },
    { labelKey: 'preloader.min',  value: timeRemaining.minutes },
    { labelKey: 'preloader.sec',  value: timeRemaining.seconds },
  ];

  const containerVariants = {
    show: { transition: { staggerChildren: 0.015, delayChildren: 0.5 } },
  };

  const characterVariants = {
    hidden: { opacity: 0, y: 10, filter: 'blur(8px)' },
    show: {
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] as const },
    },
  };

  const isAmharic = language === 'am';

  return (
    <motion.div
      initial={{ opacity: 1, backgroundColor: '#0a0908' }}
      animate={{
        opacity: isFadingOut ? 0 : 1,
        backgroundColor: ['#0a0908', '#12100e', '#0a0908'],
      }}
      transition={{
        opacity: { duration: 1, ease: 'easeInOut' },
        backgroundColor: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
      }}
      className="fixed inset-0 h-[100dvh] z-50 flex flex-col items-center justify-between overflow-hidden"
      onClick={() => handleSkip()}
    >
      {/* 1. Header Spacer */}
      <div className="w-full shrink-0 h-20 relative z-50" />

      {/* 2. Animated Message — identical to original */}
      <div className="flex-1 w-full max-w-[600px] px-6 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={animKey}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`text-base sm:text-xl md:text-2xl text-[#D4A845] leading-relaxed text-center ${
              isAmharic ? 'font-ethiopic font-light' : 'font-serif italic'
            }`}
          >
            {paragraphs.map((paragraph, pIndex) => (
              <span key={pIndex} className="block mb-6 sm:mb-8 last:mb-0">
                {paragraph.split('').map((char, cIndex) => (
                  <motion.span key={cIndex} variants={characterVariants}>
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Footer — Language Picker + Countdown */}
      <div className="shrink-0 w-full flex flex-col items-center pb-14 sm:pb-20 pt-4 z-40 gap-3">

        {/* Language Picker — above countdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex items-center gap-1 rounded-full border border-white/15 bg-black/30 backdrop-blur-sm px-2 py-1"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={(e) => handleLanguageSelect(e, 'en')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-sans transition-all duration-300 ${
              language === 'en' ? 'text-[#D4A845] font-bold' : 'text-white/40 hover:text-white/70'
            }`}
          >
            EN
          </button>
          <span className="text-white/20 text-xs select-none">|</span>
          <button
            onClick={(e) => handleLanguageSelect(e, 'am')}
            className={`px-2.5 py-0.5 rounded-full text-xs font-ethiopic transition-all duration-300 ${
              language === 'am' ? 'text-[#D4A845] font-bold' : 'text-white/40 hover:text-white/70'
            }`}
          >
            አማ
          </button>
        </motion.div>

        {mounted && !timeRemaining.isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex items-center gap-4 sm:gap-8"
          >
            {countdownItems.map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-white tabular-nums">
                  {formatNumber(item.value)}
                </span>
                <span className={`text-[9px] sm:text-xs text-[#D4A845]/70 tracking-[0.2em] uppercase mt-1 sm:mt-2 ${isAmharic ? 'font-ethiopic not-italic' : ''}`}>
                  {t(item.labelKey)}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Skip button — absolute, same as original */}
      <button
        onClick={handleSkip}
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-[#D4A845]/50 hover:text-[#D4A845] text-xs tracking-[0.3em] uppercase transition-colors duration-300 z-50 ${isAmharic ? 'font-ethiopic not-italic normal-case tracking-normal' : ''}`}
      >
        {t('preloader.skip')}
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#D4A845]/20 z-50">
        <motion.div
          key={animKey}
          className="h-full bg-[#D4A845]"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: PRELOADER_DURATION / 1000, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}
