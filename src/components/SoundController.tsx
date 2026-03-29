'use client';

import { useState, useRef, useEffect } from 'react';
import { useCountdown, formatNumber } from '@/hooks/useCountdown';
import { useLanguage } from '@/context/LanguageContext';

export default function SoundController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { timeRemaining, mounted } = useCountdown();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldResumeRef = useRef(false);
  const { language, setLanguage, t } = useLanguage();

  // Auto-start if user opted into music on the login page
  useEffect(() => {
    const pref = sessionStorage.getItem('wedding-music-pref');
    if (pref === 'on') {
      sessionStorage.removeItem('wedding-music-pref');
      // Small delay to let the audio element mount and browser allow playback
      const t = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.muted = false;
          audioRef.current.volume = 1;
          audioRef.current.play().then(() => {
            setIsPlaying(true);
            shouldResumeRef.current = true;
          }).catch(() => {});
        }
      }, 300);
      return () => clearTimeout(t);
    }
  }, []);

  // Handle visibility change (pause when hidden, resume if playing when shown)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!audioRef.current) return;

      if (document.hidden) {
        // Page is hidden
        if (isPlaying) {
          shouldResumeRef.current = true;
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          shouldResumeRef.current = false;
        }
      } else {
        // Page is visible
        if (shouldResumeRef.current) {
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch((e) => console.log('Resume prevented:', e));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPlaying]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        // currently Playing -> Pause & Mute
        audioRef.current.pause();
        audioRef.current.muted = true;
        setIsPlaying(false);
        shouldResumeRef.current = false; // User manually paused, don't auto-resume
      } else {
        // currently Muted/Paused -> Unmute & Play
        audioRef.current.muted = false;
        audioRef.current.volume = 1;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          shouldResumeRef.current = true; // User manually played, auto-resume if hidden later
        }).catch((e) => console.log('Playback prevented:', e));
      }
    }
  };

  const utilityPillClass = 'h-10 px-4 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-widest text-white/90 shadow-[0_12px_32px_rgba(0,0,0,0.18)]';
  const inlineCountdown = `${formatNumber(timeRemaining.days)}D : ${formatNumber(timeRemaining.hours)}H : ${formatNumber(timeRemaining.minutes)}M`;

  return (
    <div className="fixed left-0 right-0 top-[max(1rem,env(safe-area-inset-top))] z-50 px-4">
      <audio
        ref={audioRef}
        src="https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/amlake-keberlnge.mp3"
        loop
        muted={true}
        autoPlay={false}
      />

      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2">
        <div
          className={`${utilityPillClass} min-w-0 flex-1 justify-start sm:flex-none ${
            language === 'am' ? 'font-ethiopic normal-case tracking-normal' : 'font-sans'
          }`}
        >
          <button
            onClick={() => setLanguage('en')}
            className={`transition-colors duration-300 ${
              language === 'en' ? 'text-white' : 'text-white/45 hover:text-white/70'
            }`}
            aria-label="Switch to English"
            aria-pressed={language === 'en'}
          >
            EN
          </button>
          <span className="mx-2 text-white/35">|</span>
          <button
            onClick={() => setLanguage('am')}
            className={`transition-colors duration-300 ${
              language === 'am' ? 'text-white' : 'text-white/45 hover:text-white/70'
            }`}
            aria-label="Switch to Amharic"
            aria-pressed={language === 'am'}
          >
            አማ
          </button>
        </div>

        {mounted && (
          <div
            className={`${utilityPillClass} countdown-container min-w-0 flex-1 ${
              language === 'am' ? 'font-ethiopic normal-case tracking-normal text-[11px]' : 'font-sans'
            }`}
          >
            <span className="truncate text-center tabular-nums">
              {timeRemaining.isComplete ? '00D : 00H : 00M' : inlineCountdown}
            </span>
          </div>
        )}

        <button
          onClick={toggleAudio}
          className={`${utilityPillClass} min-w-0 flex-1 gap-2 transition-colors duration-300 hover:bg-black/30 sm:flex-none ${
            language === 'am' ? 'font-ethiopic normal-case tracking-normal' : 'font-sans'
          }`}
          aria-label={isPlaying ? 'Mute music' : 'Unmute music'}
          aria-pressed={isPlaying}
          >
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
          <span className="truncate">{t('hero.utilityMusic')}</span>
        </button>
      </div>
    </div>
  );
}
