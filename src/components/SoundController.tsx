'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCountdown, formatNumber } from '@/hooks/useCountdown';
import { useLanguage } from '@/context/LanguageContext';

// ── Slot-machine flip for a single countdown unit ────────────────────────────
function CountdownUnit({
  value,
  suffix,
  showSep,
}: {
  value: string;
  suffix: string;
  showSep?: boolean;
}) {
  return (
    <span className="inline-flex items-center leading-none">
      {/* Fixed-size box clips the sliding digit */}
      <span
        className="relative inline-block overflow-hidden"
        style={{ height: '1.15em', minWidth: '2ch', verticalAlign: 'middle' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={value}
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-110%' }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center tabular-nums"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="opacity-50 ml-px">{suffix}</span>
      {showSep && <span className="opacity-20 mx-1.5">·</span>}
    </span>
  );
}

export default function SoundController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { timeRemaining, mounted } = useCountdown();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldResumeRef = useRef(false);
  const { t } = useLanguage();

  // Auto-start if user opted into music on the login page
  useEffect(() => {
    const pref = sessionStorage.getItem('wedding-music-pref');
    if (pref === 'on') {
      sessionStorage.removeItem('wedding-music-pref');
      const timer = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.muted = false;
          audioRef.current.volume = 1;
          audioRef.current.play().then(() => {
            setIsPlaying(true);
            shouldResumeRef.current = true;
          }).catch(() => {});
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  // Pause when tab is hidden, resume when visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!audioRef.current) return;
      if (document.hidden) {
        if (isPlaying) {
          shouldResumeRef.current = true;
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          shouldResumeRef.current = false;
        }
      } else {
        if (shouldResumeRef.current) {
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPlaying]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.muted = true;
      setIsPlaying(false);
      shouldResumeRef.current = false;
    } else {
      audioRef.current.muted = false;
      audioRef.current.volume = 1;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        shouldResumeRef.current = true;
      }).catch(() => {});
    }
  };

  const pillBase =
    'h-9 px-3 sm:h-10 sm:px-4 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-md border border-white/10 text-[8px] sm:text-[10px] uppercase tracking-[0.22em] sm:tracking-widest text-white/90 shadow-[0_12px_32px_rgba(0,0,0,0.18)]';

  return (
    <div className="fixed left-0 right-0 top-[max(1rem,env(safe-area-inset-top))] z-50 px-4">
      <audio
        ref={audioRef}
        src="https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/amlake-keberlnge.mp3"
        loop
        muted
        autoPlay={false}
      />

      {/* Countdown centered, music button right */}
      <div className="mx-auto flex w-full max-w-5xl items-center">

        {/* Left spacer so countdown stays centered */}
        <div className="flex-1" />

        {/* ── Countdown ────────────────────────────────────────────── */}
        {mounted && (
          <div className={`${pillBase} gap-0 font-sans shrink-0`}>
            {timeRemaining.isComplete ? (
              <span className="tabular-nums">00D · 00H · 00M · 00S</span>
            ) : (
              <>
                <CountdownUnit value={formatNumber(timeRemaining.days)}    suffix="D" showSep />
                <CountdownUnit value={formatNumber(timeRemaining.hours)}   suffix="H" showSep />
                <CountdownUnit value={formatNumber(timeRemaining.minutes)} suffix="M" showSep />
                <CountdownUnit value={formatNumber(timeRemaining.seconds)} suffix="S" />
              </>
            )}
          </div>
        )}

        {/* ── Music button ─────────────────────────────────────────── */}
        <div className="flex-1 flex justify-end">
          <motion.button
            onClick={toggleAudio}
            aria-label={isPlaying ? 'Mute music' : 'Unmute music'}
            aria-pressed={isPlaying}
            className={`${pillBase} relative shrink-0 gap-1.5 sm:gap-2 overflow-visible transition-colors duration-300 hover:bg-black/30 font-sans`}
          >
            {/* Pulsing glow rings when playing */}
            {isPlaying && (
              <>
                <motion.span
                  className="absolute inset-0 rounded-full border border-[#D4A845]/50 pointer-events-none"
                  animate={{ scale: [1, 1.45], opacity: [0.5, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                />
                <motion.span
                  className="absolute inset-0 rounded-full border border-[#D4A845]/25 pointer-events-none"
                  animate={{ scale: [1, 1.75], opacity: [0.35, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.45 }}
                />
              </>
            )}

            {/* Waveform bars */}
            <div className="flex h-4 items-end justify-center gap-[3px] text-[#D4A845]">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-[2px] rounded-full bg-current transition-all duration-300 ${
                    isPlaying ? 'bar-playing' : 'h-[3px]'
                  }`}
                />
              ))}
            </div>

            {/* Label — shimmers gold when playing */}
            <motion.span
              animate={isPlaying ? { opacity: [0.8, 1, 0.8] } : { opacity: 0.9 }}
              transition={isPlaying ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : {}}
              className={`hidden whitespace-nowrap sm:inline ${isPlaying ? 'text-[#D4A845]' : ''}`}
            >
              {t('hero.utilityMusic')}
            </motion.span>
          </motion.button>
        </div>

      </div>
    </div>
  );
}
