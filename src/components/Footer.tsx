'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, language } = useLanguage();
  const isAmharic = language === 'am';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-surface pt-10 pb-24 border-t border-accent/20 flex flex-col items-center justify-center gap-6 z-20 transition-colors duration-500">

      {/* Return to Top Button */}
      <button
        onClick={scrollToTop}
        className="group flex flex-col items-center gap-4 transition-opacity hover:opacity-80"
        aria-label="Return to top"
      >
        <span className={`text-accent text-[10px] tracking-[0.3em] uppercase font-bold group-hover:underline underline-offset-4 ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : ''}`}>
          {t('footer.returnToTop')}
        </span>
        <motion.div whileHover={{ y: -5 }} className="text-accent">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" />
          </svg>
        </motion.div>
      </button>

      {/* Vertical Divider */}
      <div className="w-[1px] h-12 bg-gradient-to-b from-accent/50 to-transparent opacity-50" />

      {/* Signature & Copyright */}
      <div className="flex flex-col items-center gap-4 text-center">
        <p className={`text-ink/90 text-base ${isAmharic ? 'font-ethiopic font-light' : 'font-serif italic'}`}>
          {t('footer.madeWith')}
        </p>
        <p className={`text-ink/40 text-xs tracking-wider uppercase ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans'}`}>
          {t('footer.copyright')} &copy; {currentYear}
        </p>
      </div>

      {/* Source Code Link */}
      <a
        href="https://github.com/Yonatan-Estifanos-github/ForKuku"
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-4 px-6 py-2 rounded-full border border-accent/30 bg-accent/5 hover:bg-accent/10 text-accent text-[10px] tracking-[0.2em] uppercase font-bold transition-all duration-300 backdrop-blur-sm ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : ''}`}
      >
        {t('footer.sourceCode')}
      </a>

    </footer>
  );
}
