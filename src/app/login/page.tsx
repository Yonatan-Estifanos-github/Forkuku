'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage, type Language } from '@/context/LanguageContext';

const MUSIC_SRC =
  'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/amlake-keberlnge.mp3';

export default function SiteLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-fill password from long-lived cookie so returning guests just hit Enter
  useEffect(() => {
    const saved = document.cookie
      .split('; ')
      .find((c) => c.startsWith('site-access-token='))
      ?.split('=')[1];
    if (saved) setPassword(decodeURIComponent(saved));
  }, []);

  // Keep audio in sync with toggle
  useEffect(() => {
    if (!audioRef.current) return;
    if (musicOn) {
      audioRef.current.muted = false;
      audioRef.current.volume = 0.7;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [musicOn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Persist music preference so SoundController picks it up on the main page
    sessionStorage.setItem('wedding-music-pref', musicOn ? 'on' : 'off');

    try {
      const response = await fetch('/api/auth/site-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        setError(t('login.incorrectPassword'));
        setLoading(false);
      }
    } catch {
      setError(t('login.somethingWentWrong'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-dvh bg-[#0a0908] flex items-start sm:items-center justify-center overflow-y-auto p-2.5 sm:p-4">
      <audio ref={audioRef} src={MUSIC_SRC} loop muted />

      <div className="w-full max-w-[20rem] sm:max-w-md my-2 sm:my-0 sm:max-h-[calc(100dvh-2rem)] sm:overflow-y-auto flex flex-col gap-0">

        {/* ── Step 1: Preferences card ───────────────────────────── */}
        <div className="bg-[#0f0e0c] border border-[#D4A845]/20 rounded-t-2xl px-4 pt-5 pb-4 sm:px-8 sm:pt-10 sm:pb-8">

          {/* Title */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-4 sm:mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4A845]/40" />
            <span className={`text-[#D4A845] text-[10px] tracking-[0.3em] uppercase ${language === 'am' ? 'font-ethiopic normal-case tracking-normal' : 'font-sans'}`}>
              {t('login.beforeYouEnter')}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4A845]/40" />
          </div>

          {/* Language choice */}
          <div className="mb-4 sm:mb-8">
            <p className={`text-[#E6D2B5]/40 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-center mb-2.5 sm:mb-4 ${language === 'am' ? 'font-ethiopic normal-case tracking-normal' : 'font-sans'}`}>
              {t('login.chooseLanguage')}
            </p>
            <div className="flex gap-2 sm:gap-3 justify-center">
              {(['en', 'am'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`flex-1 py-2 sm:py-3 rounded-xl border text-[13px] sm:text-sm font-medium tracking-wide transition-all duration-300 ${
                    language === lang
                      ? 'border-[#D4A845] text-[#D4A845] bg-[#D4A845]/10'
                      : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/60'
                  } ${lang === 'am' ? 'font-ethiopic' : 'font-sans'}`}
                >
                  {lang === 'en' ? t('login.english') : t('login.amharic')}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#D4A845]/10 mb-4 sm:mb-8" />

          {/* Music toggle */}
          <div className="mb-2">
            <p className={`text-[#E6D2B5]/40 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-center mb-2.5 sm:mb-4 ${language === 'am' ? 'font-ethiopic normal-case tracking-normal' : 'font-sans'}`}>
              {t('login.worshipMusic')}
            </p>
            <button
              onClick={() => setMusicOn(v => !v)}
              className={`w-full py-3 sm:py-4 rounded-xl border flex items-center justify-center gap-2.5 sm:gap-3 transition-all duration-300 ${
                musicOn
                  ? 'border-[#D4A845]/60 bg-[#D4A845]/10 text-[#D4A845]'
                  : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/60'
              }`}
            >
              {/* Waveform bars */}
              <div className="flex items-end gap-[3px] h-4 sm:h-5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-[2px] rounded-full transition-all duration-300 ${
                      musicOn ? 'bar-playing bg-[#D4A845]' : 'h-[3px] bg-current'
                    }`}
                  />
                ))}
              </div>

              {/* Speaker icon */}
              {musicOn ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              )}

              <span className={`text-[12px] sm:text-sm tracking-[0.2em] sm:tracking-widest uppercase ${language === 'am' ? 'font-ethiopic normal-case tracking-normal' : 'font-sans'}`}>
                {musicOn ? t('login.worshipping') : t('login.worshipWithUs')}
              </span>
            </button>
          </div>
        </div>

        {/* ── Step 2: Password card ──────────────────────────────── */}
        <div className="bg-[#0a0908] border-x border-b border-[#D4A845]/20 rounded-b-2xl px-4 pt-4 pb-5 sm:px-8 sm:pt-8 sm:pb-10 shadow-2xl">

          <h1 className="font-serif text-[1.45rem] sm:text-3xl text-[#E6D2B5] text-center mb-1">
            Yonatan & Saron
          </h1>
          <p className={`text-center text-[#E6D2B5]/40 text-[11px] sm:text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase mb-4 sm:mb-8 ${language === 'am' ? 'font-ethiopic normal-case tracking-normal' : ''}`}>
            {t('login.privateEvent')}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
            {error && (
              <div className="bg-red-900/20 text-red-400 p-3 rounded text-sm text-center border border-red-900/30">
                {error}
              </div>
            )}

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 sm:p-4 bg-[#1a1815] border border-[#D4A845]/30 rounded-xl outline-none focus:border-[#D4A845] transition-colors text-[#E6D2B5] text-center tracking-[0.15em] sm:tracking-widest placeholder:text-[#E6D2B5]/30"
              placeholder={t('login.enterPassword')}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 bg-[#D4A845] text-[#0a0908] font-serif text-[15px] sm:text-base tracking-[0.18em] sm:tracking-widest uppercase hover:bg-[#E6D2B5] transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl"
            >
              {loading ? t('login.verifying') : t('login.enter')}
            </button>
          </form>

          <div className="mt-4 sm:mt-8 flex flex-col items-center gap-2.5 sm:gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#D4A845]/30 to-transparent" />
            <Link
              href="/legal"
              className="text-[10px] text-[#E6D2B5]/20 hover:text-[#D4A845] transition-colors tracking-widest uppercase"
            >
              {t('login.privacyPolicy')}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
