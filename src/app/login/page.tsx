'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useLanguage, type Language } from '@/context/LanguageContext';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.1, delay, ease },
});

const fadeIn = (delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 1.0, delay, ease },
});

const MUSIC_SRC = 'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/amlake-keberlnge.mp3';

const MAGIC_PASSWORD = 'Matthew19:6';

function SiteLoginPageInner() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { language, setLanguage, t } = useLanguage();
  const searchParams = useSearchParams();

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

  // Auto-fill password from long-lived cookie so returning guests just hit Enter
  useEffect(() => {
    const saved = document.cookie
      .split('; ')
      .find((c) => c.startsWith('site-access-token='))
      ?.split('=')[1];
    if (saved) setPassword(decodeURIComponent(saved));
  }, []);

  // Magic link: auto-login when ?pwd=Matthew19:6 is present
  useEffect(() => {
    const pwd = searchParams.get('pwd');
    const partyId = searchParams.get('partyId');
    if (pwd !== MAGIC_PASSWORD) return;

    setLoading(true);

    const run = async () => {
      try {
        const res = await fetch('/api/auth/site-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: MAGIC_PASSWORD }),
        });
        if (!res.ok) { setLoading(false); return; }

        // If a partyId is in the URL, track the click and drop the VIP cookie
        if (partyId) {
          try {
            await fetch('/api/rsvp/track-click', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ partyId }),
            });
          } catch { /* non-critical — proceed regardless */ }

          const expires = new Date();
          expires.setDate(expires.getDate() + 90);
          document.cookie = `vip_party_id=${encodeURIComponent(partyId)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
        }

        sessionStorage.setItem('wedding-music-pref', musicOn ? 'on' : 'off');
        window.location.href = '/';
      } catch {
        setLoading(false);
      }
    };

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/site-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        sessionStorage.setItem('wedding-music-pref', musicOn ? 'on' : 'off');
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

  const isAmharic = language === 'am';

  return (
    <div className="min-h-[100dvh] bg-[#0a0908] flex items-center justify-center px-6">
      <audio ref={audioRef} src={MUSIC_SRC} loop muted />

      {/* ── Centered focal content ───────────────────────────────── */}
      <div className="flex flex-col items-center gap-10 w-full max-w-xs sm:max-w-sm">

        {/* Names */}
        <motion.div {...fadeUp(0.3)} className="flex flex-col items-center gap-3 text-center">
          <motion.h1
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl text-[#E6D2B5] tracking-wide leading-tight"
          >
            Yonatan
            <span className="block text-[#D4A845]/70 text-3xl sm:text-4xl my-1 font-light not-italic">&</span>
            Saron
          </motion.h1>
          <p className="font-sans text-[#D4A845] text-[9px] sm:text-[10px] tracking-[0.45em] uppercase mt-1">
            A Private Celebration
          </p>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.8, ease }}
          className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4A845]/40 to-transparent"
        />

        {/* Form */}
        <motion.form
          {...fadeIn(1.1)}
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-6 w-full"
        >
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-red-400/80 text-xs text-center ${isAmharic ? 'font-ethiopic' : 'font-serif italic'}`}
            >
              {error}
            </motion.p>
          )}

          {/* Bottom-border-only password input */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full bg-transparent border-b border-white/20 py-3 text-center text-[#E6D2B5] tracking-[0.2em] placeholder:text-white/20 outline-none focus:border-white/50 transition-colors duration-300 ${isAmharic ? 'font-ethiopic' : 'font-serif'}`}
            placeholder={t('login.enterPassword')}
            required
          />

          {/* Hollow pill button */}
          <button
            type="submit"
            disabled={loading}
            className={`border border-[#D4A845] text-[#D4A845] bg-transparent hover:bg-[#D4A845]/10 px-12 py-3 rounded-full tracking-widest text-[10px] sm:text-xs uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans'}`}
          >
            {loading ? t('login.verifying') : t('login.enter')}
          </button>

          {/* Music toggle */}
          <button
            type="button"
            onClick={() => setMusicOn(v => !v)}
            className={`flex items-center gap-2.5 border rounded-full px-5 py-2 transition-all duration-300 ${
              musicOn
                ? 'border-[#D4A845]/60 text-[#D4A845] bg-[#D4A845]/5'
                : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white/90'
            }`}
          >
            <div className="flex items-end gap-[3px] h-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-[2px] rounded-full bg-current transition-all duration-300 ${musicOn ? 'bar-playing' : 'h-[3px]'}`}
                />
              ))}
            </div>
            <span className={`text-[10px] tracking-widest uppercase ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans'}`}>
              {musicOn ? t('login.worshipping') : t('login.worshipWithUs')}
            </span>
          </button>
        </motion.form>

      </div>

      {/* ── Language toggle — fixed bottom, text-only ─────────────── */}
      <motion.div
        {...fadeIn(1.6)}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {(['en', 'am'] as Language[]).map((lang, i) => (
          <span key={lang} className="inline-flex items-center gap-4">
            {i > 0 && <span className="text-white/15 text-xs select-none">|</span>}
            <button
              onClick={() => setLanguage(lang)}
              aria-pressed={language === lang}
              className={`text-xs transition-colors duration-300 ${
                lang === 'am' ? 'font-ethiopic' : 'font-sans tracking-widest uppercase'
              } ${
                language === lang ? 'text-white' : 'text-white/35 hover:text-white/65'
              }`}
            >
              {lang === 'en' ? t('login.english') : t('login.amharic')}
            </button>
          </span>
        ))}
      </motion.div>

      {/* ── Privacy link — very bottom ───────────────────────────── */}
      <motion.div {...fadeIn(2.0)} className="fixed bottom-4 left-1/2 -translate-x-1/2">
        <Link
          href="/legal"
          className="text-[10px] text-white/15 hover:text-white/40 tracking-widest uppercase transition-colors font-sans"
        >
          {t('login.privacyPolicy')}
        </Link>
      </motion.div>

    </div>
  );
}

export default function SiteLoginPage() {
  return (
    <Suspense>
      <SiteLoginPageInner />
    </Suspense>
  );
}
