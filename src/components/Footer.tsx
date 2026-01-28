'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="relative w-full bg-[#0a0908] py-10 border-t border-[#D4A845]/20 flex flex-col items-center justify-center gap-6 z-20">
      
      {/* Return to Top Button */}
      <button 
        onClick={scrollToTop}
        className="group flex flex-col items-center gap-4 transition-opacity hover:opacity-80"
        aria-label="Return to top"
      >
        <span className="text-[#D4A845] text-[10px] tracking-[0.3em] uppercase font-bold group-hover:underline underline-offset-4">
          Return to Top
        </span>
        <motion.div
          whileHover={{ y: -5 }}
          className="text-[#D4A845]"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" />
          </svg>
        </motion.div>
      </button>

      {/* Vertical Divider */}
      <div className="w-[1px] h-12 bg-gradient-to-b from-[#D4A845]/50 to-transparent opacity-50" />

      {/* Signature & Copyright */}
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="font-serif text-[#FFF5E6]/90 text-base italic">
          Made with <span className="text-[#D4A845]">♥</span> by Yonatan
        </p>
        <p className="font-sans text-[#FFF5E6]/40 text-xs tracking-wider uppercase">
          The Estifanos &copy; {currentYear}
        </p>
      </div>

      {/* Source Code Link */}
      <a
        href="https://github.com/Yonatan-Estifanos-github/ForKuku"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 px-6 py-2 rounded-full border border-[#D4A845]/30 bg-[#D4A845]/5 hover:bg-[#D4A845]/10 text-[#D4A845] text-[10px] tracking-[0.2em] uppercase font-bold transition-all duration-300 backdrop-blur-sm"
      >
        Source Code
      </a>

    </footer>
  );
}
