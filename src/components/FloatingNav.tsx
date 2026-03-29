'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const NAV_KEYS = [
  { key: 'home',     href: '/',               icon: HomeIcon,    sectionId: 'home' },
  { key: 'story',    href: '/#story',          icon: BookIcon,    sectionId: 'story' },
  { key: 'venue',    href: '/#venue',          icon: MapPinIcon,  sectionId: 'venue' },
  { key: 'party',    href: '/#wedding-party',  icon: PeopleIcon,  sectionId: 'wedding-party' },
  { key: 'rsvp',    href: '/#rsvp',           icon: EnvelopeIcon, sectionId: 'rsvp' },
  { key: 'registry', href: '/#registry',      icon: GiftIcon,    sectionId: 'registry' },
];

export default function FloatingNav() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('home');
  const { t, language } = useLanguage();

  // Track which section is in view on the home page.
  // Scroll-based midpoint detection is more reliable than IntersectionObserver
  // for sections of varying heights (e.g. tall timeline vs short hero).
  useEffect(() => {
    if (pathname !== '/') return;

    const sectionIds = ['home', 'story', 'venue', 'wedding-party', 'rsvp', 'registry'];

    const handleScroll = () => {
      // The "active" section is whichever section's top most recently passed
      // the 40%-down mark of the viewport.
      const midpoint = window.scrollY + window.innerHeight * 0.4;

      let active = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= midpoint) {
          active = id;
        }
      }
      setActiveSection(active);
    };

    // Delay so the DOM is fully laid out before we measure offsets
    const timer = setTimeout(() => {
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  const isActive = (href: string, sectionId: string | null) => {
    // On home page, check which section is active
    if (pathname === '/') {
      if (sectionId) {
        return activeSection === sectionId;
      }
    }
    return false;
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Check if we're on the home page
    const isHomePage = pathname === '/';

    // For home page with hash links, use smooth scrolling
    if (isHomePage && (href === '/' || href.startsWith('/#'))) {
      if (href === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Extract hash from "/#section" format
        const hashIndex = href.indexOf('#');
        if (hashIndex !== -1) {
          const hash = href.substring(hashIndex);
          const target = document.querySelector(hash);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
          // If target doesn't exist, let browser handle navigation normally
          // This will reload the page with the hash, triggering any scroll behavior
        }
      }
    }
    // For other pages, let the browser handle navigation normally
  };

  return (
    <div className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50">
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 2.5, ease: 'easeOut' }}
      aria-label="Main navigation"
    >
      <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-full border border-white/10 bg-black/20 backdrop-blur-md">
        {NAV_KEYS.map(({ key, href, icon: Icon, sectionId }) => {
          const active = isActive(href, sectionId);
          const label = t(`nav.${key}`);
          return (
            <a
              key={key}
              href={href}
              onClick={(e) => handleClick(e, href)}
              aria-current={active ? 'page' : undefined}
              title={label}
              className={`relative flex flex-col items-center justify-center gap-1 p-1 rounded-full transition-colors duration-300 ${
                active
                  ? 'text-[#D4A845]'
                  : 'text-white/50 hover:text-white/90'
              } ${language === 'am' ? 'font-ethiopic' : 'font-serif'}`}
            >
              {active && (
                <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#D4A845] shadow-[0_0_4px_#D4A845]" />
              )}
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              <span className="text-[8px] sm:text-[10px] whitespace-nowrap leading-none">{label}</span>
            </a>
          );
        })}
      </div>
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
    <svg
      className={className}
      aria-hidden={ariaHidden}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function BookIcon({ className, 'aria-hidden': ariaHidden }: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h6" />
    </svg>
  );
}

function MapPinIcon({ className, 'aria-hidden': ariaHidden }: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function EnvelopeIcon({ className, 'aria-hidden': ariaHidden }: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6L12 13 2 6" />
    </svg>
  );
}

function PeopleIcon({ className, 'aria-hidden': ariaHidden }: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-2a5 5 0 015-5h2a5 5 0 015 5v2" />
      <circle cx="17" cy="7" r="2.5" />
      <path d="M21 21v-1.5a4 4 0 00-3-3.87" />
    </svg>
  );
}

function GiftIcon({ className, 'aria-hidden': ariaHidden }: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="8" width="18" height="13" rx="1" />
      <path d="M12 8v13" />
      <path d="M3 12h18" />
      <path d="M19 8c0-1.7-1.3-4-4-4-1.4 0-2.6 1.3-3 2.5C11.6 5.3 10.4 4 9 4c-2.7 0-4 2.3-4 4" />
    </svg>
  );
}
