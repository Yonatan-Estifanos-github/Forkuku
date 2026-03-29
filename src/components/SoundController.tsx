'use client';

import { useState, useRef, useEffect } from 'react';
import { useCountdown, formatNumber } from '@/hooks/useCountdown';

export default function SoundController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { timeRemaining, mounted } = useCountdown();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldResumeRef = useRef(false);

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

  // Speaker High Icon (with sound waves)
  const SpeakerHighIcon = () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D4A845"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#D4A845" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );

  // Speaker Muted Icon (with X)
  const SpeakerMutedIcon = () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D4A845"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#D4A845" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-row-reverse items-center gap-3">
      <audio
        ref={audioRef}
        src="https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/amlake-keberlnge.mp3"
        loop
        muted={true}
        autoPlay={false}
      />

      <button
        onClick={toggleAudio}
        className="group flex items-center gap-3 px-4 py-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/10 transition-all duration-300"
        aria-label={isPlaying ? "Mute music" : "Unmute music"}
      >
        {/* Waveform Visualizer */}
        <div className="flex items-end justify-center gap-[3px] h-5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-[2px] bg-[#D4A845] rounded-full transition-all duration-300 ${
                isPlaying ? 'bar-playing' : 'h-[2px]'
              }`}
            />
          ))}
        </div>

        {/* Speaker Icon */}
        {isPlaying ? <SpeakerHighIcon /> : <SpeakerMutedIcon />}

        {/* Encouraging text - only shows when muted */}
        {!isPlaying && (
          <span className="text-[10px] sm:text-xs text-white font-medium tracking-widest uppercase animate-pulse">
            Worship with us
          </span>
        )}
      </button>

      {/* Countdown Timer */}
      {mounted && !timeRemaining.isComplete && (
        <div className="countdown-container flex items-center gap-1 px-3 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
          <div className="flex flex-col items-center">
            <span className="font-serif text-sm sm:text-base font-light text-white tabular-nums">{formatNumber(timeRemaining.days)}</span>
            <span className="text-[8px] text-[#D4A845]/70 tracking-wider uppercase">Days</span>
          </div>
          <span className="text-white/30 text-xs mx-1">:</span>
          <div className="flex flex-col items-center">
            <span className="font-serif text-sm sm:text-base font-light text-white tabular-nums">{formatNumber(timeRemaining.hours)}</span>
            <span className="text-[8px] text-[#D4A845]/70 tracking-wider uppercase">Hrs</span>
          </div>
          <span className="text-white/30 text-xs mx-1">:</span>
          <div className="flex flex-col items-center">
            <span className="font-serif text-sm sm:text-base font-light text-white tabular-nums">{formatNumber(timeRemaining.minutes)}</span>
            <span className="text-[8px] text-[#D4A845]/70 tracking-wider uppercase">Min</span>
          </div>
          <span className="text-white/30 text-xs mx-1">:</span>
          <div className="flex flex-col items-center">
            <span className="font-serif text-sm sm:text-base font-light text-white tabular-nums">{formatNumber(timeRemaining.seconds)}</span>
            <span className="text-[8px] text-[#D4A845]/70 tracking-wider uppercase">Sec</span>
          </div>
        </div>
      )}

      {/* Celebration message when countdown complete */}
      {mounted && timeRemaining.isComplete && (
        <div className="px-3 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
          <span className="font-serif text-sm text-[#D4A845] italic">The Celebration Begins</span>
        </div>
      )}
    </div>
  );
}
