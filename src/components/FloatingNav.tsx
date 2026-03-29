'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const NAV_KEYS = [
  { key: 'home',     href: '/',               icon: HomeIcon,     sectionId: 'home' },
  { key: 'story',    href: '/#story',          icon: BookIcon,     sectionId: 'story' },
  { key: 'venue',    href: '/#venue',          icon: MapPinIcon,   sectionId: 'venue' },
  { key: 'party',    href: '/#wedding-party',  icon: PeopleIcon,   sectionId: 'wedding-party' },
  { key: 'rsvp',     href: '/#rsvp',           icon: EnvelopeIcon, sectionId: 'rsvp' },
  { key: 'registry', href: '/#registry',       icon: GiftIcon,     sectionId: 'registry' },
];

export default function FloatingNav() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isExpanded, setIsExpanded] = useState(false);
  const collapseTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    if (pathname !== '/') return;
    const sectionIds = ['home', 'story', 'venue', 'wedding-party', 'rsvp', 'registry'];

    const handleScroll = () => {
      // Collapse nav on scroll so it gets out of the way immediately
      clearTimeout(collapseTimer.current);
      setIsExpanded(false);

      const midpoint = window.scrollY + window.innerHeight * 0.4;
      let active = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= midpoint) active = id;
      }
      setActiveSection(active);
    };

    const timer = setTimeout(() => {
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  const expand = () => {
    clearTimeout(collapseTimer.current);
    setIsExpanded(true);
  };

  const scheduleCollapse = () => {
    collapseTimer.current = setTimeout(() => setIsExpanded(false), 700);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== '/') return;
    if (href === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href.startsWith('/#')) {
      const target = document.querySelector(href.substring(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50">
      <motion.nav
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 2.5, ease: 'easeOut' }}
        // Desktop: hover to expand. onMouse* does NOT fire on touch,
        // so mobile users see the dots and tap them to expand.
        onMouseEnter={expand}
        onMouseLeave={scheduleCollapse}
        aria-label="Main navigation"
      >
        <AnimatePresence mode="popLayout" initial={false}>

          {/* ── MINIMIZED: column of tiny dots ─────────────────────────── */}
          {!isExpanded && (
            <motion.div
              key="dots"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2 }}
              // onClick lets mobile users tap to expand
              onClick={expand}
              className="flex flex-col items-center gap-4 py-3 px-2 cursor-pointer"
              aria-hidden="true"
            >
              {NAV_KEYS.map(({ sectionId }) => {
                const active = activeSection === sectionId;
                return (
                  <motion.span
                    key={sectionId}
                    animate={{
                      opacity: active ? 1 : 0.25,
                      scale:   active ? 1   : 0.6,
                    }}
                    transition={{ duration: 0.4 }}
                    className="block w-1.5 h-1.5 rounded-full bg-[#D4A845]"
                  />
                );
              })}

              {/* Current language hint */}
              <span className="mt-1 pt-2 border-t border-white/10 text-[7px] tracking-widest text-[#D4A845]/60 uppercase leading-none">
                {language === 'en' ? 'EN' : 'አማ'}
              </span>
            </motion.div>
          )}

          {/* ── EXPANDED: frosted glass pill with icons + labels ────────── */}
          {isExpanded && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.88, x: 8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.88, x: 8, transition: { duration: 0.2 } }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="flex flex-col items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-full border border-white/10 bg-black/20 backdrop-blur-md"
            >
              {NAV_KEYS.map(({ key, href, icon: Icon, sectionId }, i) => {
                const active = activeSection === sectionId;
                const label = t(`nav.${key}`);
                return (
                  <motion.a
                    key={key}
                    href={href}
                    onClick={(e) => { handleClick(e, href); scheduleCollapse(); }}
                    aria-current={active ? 'page' : undefined}
                    title={label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    className={`relative flex flex-col items-center gap-1 p-1 rounded-full transition-colors duration-200 ${
                      active ? 'text-[#D4A845]' : 'text-white/50 hover:text-white/90'
                    } ${language === 'am' ? 'font-ethiopic' : 'font-serif'}`}
                  >
                    {active && (
                      <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#D4A845] shadow-[0_0_4px_#D4A845]" />
                    )}
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                    <span className="text-[8px] sm:text-[10px] whitespace-nowrap leading-none">{label}</span>
                  </motion.a>
                );
              })}

              {/* Language switcher */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: NAV_KEYS.length * 0.03 + 0.05 }}
                className="mt-1 pt-2 border-t border-white/10 flex items-center gap-1.5"
              >
                <button
                  onClick={() => setLanguage('en')}
                  aria-pressed={language === 'en'}
                  className={`text-[9px] sm:text-[10px] tracking-widest uppercase transition-colors duration-200 font-sans ${
                    language === 'en' ? 'text-[#D4A845]' : 'text-white/35 hover:text-white/70'
                  }`}
                >
                  EN
                </button>
                <span className="text-white/20 text-[9px]">|</span>
                <button
                  onClick={() => setLanguage('am')}
                  aria-pressed={language === 'am'}
                  className={`text-[9px] sm:text-[10px] font-ethiopic transition-colors duration-200 ${
                    language === 'am' ? 'text-[#D4A845]' : 'text-white/35 hover:text-white/70'
                  }`}
                >
                  አማ
                </button>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.nav>
    </div>
  );
}

interface IconProps {
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

function HomeIcon({ className, 'aria-hidden': ariaHidden }: IconProps) {
  return (
    <svg className={className} aria-hidden={ariaHidden} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function BookIcon({ className, 'aria-hidden': ariaHidden }: IconProps) {
  return (
    <svg className={className} aria-hidden={ariaHidden} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h6" />
    </svg>
  );
}

function MapPinIcon({ className, 'aria-hidden': ariaHidden }: IconProps) {
  return (
    <svg className={className} aria-hidden={ariaHidden} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function EnvelopeIcon({ className, 'aria-hidden': ariaHidden }: IconProps) {
  return (
    <svg className={className} aria-hidden={ariaHidden} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6L12 13 2 6" />
    </svg>
  );
}

function PeopleIcon({ className, 'aria-hidden': ariaHidden }: IconProps) {
  return (
    <svg className={className} aria-hidden={ariaHidden} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-2a5 5 0 015-5h2a5 5 0 015 5v2" />
      <circle cx="17" cy="7" r="2.5" />
      <path d="M21 21v-1.5a4 4 0 00-3-3.87" />
    </svg>
  );
}

function GiftIcon({ className, 'aria-hidden': ariaHidden }: IconProps) {
  return (
    <svg className={className} aria-hidden={ariaHidden} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="13" rx="1" />
      <path d="M12 8v13" />
      <path d="M3 12h18" />
      <path d="M19 8c0-1.7-1.3-4-4-4-1.4 0-2.6 1.3-3 2.5C11.6 5.3 10.4 4 9 4c-2.7 0-4 2.3-4 4" />
    </svg>
  );
}
