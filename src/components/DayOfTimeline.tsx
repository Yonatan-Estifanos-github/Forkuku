'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useNavView } from '@/context/ViewContext';
import FadeIn from '@/components/ui/FadeIn';

interface TimelineEvent {
  time: string;
  label: string;
}

function TimelineRow({ event }: { event: TimelineEvent }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rowRef, { once: true, amount: 0.5 });
  const { language } = useLanguage();
  const isAmharic = language === 'am';

  return (
    <div ref={rowRef} className="relative flex items-start gap-6 pb-10 last:pb-0">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="w-3 h-3 rounded-full bg-wedding-gold shrink-0 relative z-10"
        style={{ boxShadow: '0 0 12px 3px rgba(var(--accent-rgb), 0.45)' }}
      />

      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 -mt-1"
      >
        <p className={`w-24 shrink-0 text-accent/80 uppercase tracking-[0.2em] text-xs ${isAmharic ? 'font-ethiopic not-italic normal-case tracking-normal' : 'font-sans'}`}>
          {event.time}
        </p>
        <p className={`text-xl md:text-2xl text-ink-heading ${isAmharic ? 'font-ethiopic font-light' : 'font-serif'}`}>
          {event.label}
        </p>
      </motion.div>
    </div>
  );
}

export default function DayOfTimeline() {
  const { activeView } = useNavView();
  const { t, language } = useLanguage();
  const isAmharic = language === 'am';
  const listRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 0.8', 'end 0.6'],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (activeView !== 'final-invite') return null;

  const events: TimelineEvent[] = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
    time: t(`timeline.event${n}Time`),
    label: t(`timeline.event${n}Label`),
  }));

  return (
    <div className="py-24 px-6">
      <FadeIn>
        <h2 className={`text-4xl md:text-5xl lg:text-6xl text-wedding-gold text-center mb-4 font-semibold ${isAmharic ? 'font-ethiopic font-light' : 'font-serif'}`}>
          {t('timeline.heading')}
        </h2>
        <p className={`text-center max-w-xl mx-auto mb-16 ${isAmharic ? 'font-ethiopic text-ink/80' : 'font-serif text-ink/70'}`}>
          {t('timeline.subtitle')}
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div ref={listRef} className="relative max-w-lg mx-auto">
          {/* Golden thread — dim track + scroll-driven gold fill drawing downward */}
          <div className="absolute left-1.5 top-1.5 bottom-1.5 w-px overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-wedding-gold/15" />
            <motion.div
              className="absolute inset-x-0 top-0 w-full bg-wedding-gold origin-top"
              style={{ scaleY: lineScaleY, height: '100%' }}
            />
          </div>

          {events.map((event, i) => (
            <TimelineRow key={i} event={event} />
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
