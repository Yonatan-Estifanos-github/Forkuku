'use client';

import { motion } from 'framer-motion';
import { useNavView } from '@/context/ViewContext';

export default function ThemeToggle() {
  const { activeView, onToggleView } = useNavView();
  const isLight = activeView === 'final-invite';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 2.7, ease: 'easeOut' }}
      className="fixed left-0 right-0 top-[calc(max(1rem,env(safe-area-inset-top))+3.25rem)] z-40 flex justify-center px-4 pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center h-9 rounded-full bg-surface/50 backdrop-blur-md border border-hairline px-4 sm:px-5 gap-3 sm:gap-4 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
        <button
          type="button"
          onClick={() => onToggleView('save-the-date')}
          aria-pressed={!isLight}
          className={`text-[9px] sm:text-[10px] font-sans uppercase tracking-widest whitespace-nowrap transition-colors duration-300 ${
            !isLight ? 'text-accent' : 'text-ink/40 hover:text-ink/70'
          }`}
        >
          Dark Mode
        </button>

        <span className="h-3.5 w-px bg-hairline shrink-0" />

        <button
          type="button"
          onClick={() => onToggleView('final-invite')}
          aria-pressed={isLight}
          className={`text-[9px] sm:text-[10px] font-sans uppercase tracking-widest whitespace-nowrap transition-colors duration-300 ${
            isLight ? 'text-accent' : 'text-ink/40 hover:text-ink/70'
          }`}
        >
          Light Mode
        </button>
      </div>
    </motion.div>
  );
}
