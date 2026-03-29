'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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

export default function SiteLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Auto-fill password from long-lived cookie so returning guests just hit Enter
  useEffect(() => {
    const saved = document.cookie
      .split('; ')
      .find((c) => c.startsWith('site-access-token='))
      ?.split('=')[1];
    if (saved) setPassword(decodeURIComponent(saved));
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
