'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCountdown, formatNumber } from '@/hooks/useCountdown';
import { useLanguage, type Language } from '@/context/LanguageContext';

const PRELOADER_DURATION = 20000; // 20 seconds total

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { timeRemaining, mounted } = useCountdown();
  const { language, setLanguage, t } = useLanguage();

  // Key changes when language switches so the character animation restarts
  const [animKey, setAnimKey] = useState(0);
  const prevLang = useRef(language);

  useEffect(() => {
    if (prevLang.current !== language) {
      prevLang.current = language;
      setAnimKey(k => k + 1);
    }
  }, [language]);

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
    const fadeTimer = setTimeout(() => setIsFadingOut(true), PRELOADER_DURATION - 1000);
    const completeTimer = setTimeout(onComplete, PRELOADER_DURATION);
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

  const handleLanguageSelect = (e: React.MouseEvent, lang: Language) => {
    e.stopPropagation();
    setLanguage(lang);
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

      {/* 2. Animated Message */}
      <div className="flex-1 w-full max-w-[600px] px-6 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={animKey}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`text-base sm:text-xl md:text-2xl text-[#D4A845] leading-relaxed text-center ${
              isAmharic
                ? 'font-ethiopic font-light'
                : 'font-serif italic'
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

      {/* 3. Footer — Countdown + Language Picker */}
      <div className="shrink-0 w-full flex flex-col items-center pb-24 sm:pb-32 pt-8 z-40 gap-8">

        {/* Countdown */}
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

        {/* Language Picker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex items-center gap-3"
          onClick={e => e.stopPropagation()}
        >
          {(['en', 'am'] as Language[]).map((lang) => {
            const isSelected = language === lang;
            return (
              <button
                key={lang}
                onClick={(e) => handleLanguageSelect(e, lang)}
                className={`px-4 py-1.5 rounded-full text-xs tracking-[0.2em] uppercase transition-all duration-300 border ${
                  isSelected
                    ? 'border-[#D4A845] text-[#D4A845] bg-[#D4A845]/10'
                    : 'border-white/20 text-white/40 hover:border-white/40 hover:text-white/60'
                } ${lang === 'am' ? 'font-ethiopic not-italic normal-case tracking-normal text-sm' : 'font-sans'}`}
              >
                {lang === 'en' ? 'English' : 'አማርኛ'}
              </button>
            );
          })}
        </motion.div>

      </div>

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 text-[#D4A845]/50 hover:text-[#D4A845] text-xs tracking-[0.3em] uppercase transition-colors duration-300 z-50 ${isAmharic ? 'font-ethiopic not-italic normal-case tracking-normal' : ''}`}
      >
        {t('preloader.skip')}
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#D4A845]/20 z-50">
        <motion.div
          className="h-full bg-[#D4A845]"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: PRELOADER_DURATION / 1000, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}
