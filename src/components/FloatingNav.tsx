'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: HomeIcon },
  { label: 'Story', href: '/#story', icon: BookIcon },
  { label: 'Venue', href: '/#venue', icon: MapPinIcon },
  { label: 'RSVP', href: '/#rsvp', icon: EnvelopeIcon },
  { label: 'Registry', href: '/registry', icon: GiftIcon },
];

export default function FloatingNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Registry page is active only when on /registry
    if (href === '/registry') {
      return pathname === '/registry';
    }
    // Only "Home" link is active on the home page
    // Hash links (Story, Venue, RSVP) are not marked active since we can't detect scroll position
    if (href === '/') {
      return pathname === '/';
    }
    // Hash links are never marked as "active" (they just navigate)
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
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 2.5, ease: 'easeOut' }}
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-8 pb-[max(2rem,env(safe-area-inset-bottom))]"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-1 sm:gap-4 rounded-full border border-white/10 bg-black/50 backdrop-blur-md px-3 sm:px-5 py-2 transition-all">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <a
              key={label}
              href={href}
              onClick={(e) => handleClick(e, href)}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full font-serif text-[10px] sm:text-sm transition-colors duration-300 hover:text-[#D4A845] ${
                active ? 'text-[#D4A845]' : 'text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
              <span>{label}</span>
            </a>
          );
        })}
      </div>
    </motion.nav>
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
