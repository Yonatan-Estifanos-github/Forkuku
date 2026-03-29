'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { JOURNEY_DATA } from './journeyData';
import { useLanguage } from '@/context/LanguageContext';

const swipeConfidenceThreshold = 1200;

function wrapIndex(index: number, length: number) {
  return (index + length) % length;
}

function swipePower(offset: number, velocity: number) {
  return Math.abs(offset) * velocity;
}

function ParsedDescription({
  text,
  isAmharic,
}: {
  text: string;
  isAmharic: boolean;
}) {
  const parts = text.split(/(\[(?:Yoni|Saron)\])/g);

  return (
    <p
      className={`max-w-xl text-sm leading-7 md:text-base md:leading-8 ${
        isAmharic ? 'font-ethiopic text-stone-300/90' : 'font-sans text-stone-300/88'
      }`}
    >
      {parts.map((part, i) => {
        if (part === '[Yoni]') {
          return (
            <span key={i} className="font-semibold tracking-[0.08em] text-[#D4A845]">
              {isAmharic ? 'ዮኒ › ' : 'Yoni › '}
            </span>
          );
        }

        if (part === '[Saron]') {
          return (
            <span key={i} className="font-semibold tracking-[0.08em] text-[#d8bc72]">
              {isAmharic ? 'ሳሮን › ' : 'Saron › '}
            </span>
          );
        }

        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

function NavArrow({
  direction,
  onClick,
  label,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  label: string;
}) {
  const isPrev = direction === 'prev';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4A845]/18 bg-white/[0.03] text-[#D4A845]/82 backdrop-blur-md transition-all duration-300 hover:border-[#D4A845]/42 hover:text-[#F0D99F]"
    >
      <svg
        className={`h-4 w-4 ${isPrev ? '' : 'rotate-180'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 6l-6 6 6 6" />
      </svg>
    </button>
  );
}

export default function JourneyGallery() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const { t, language } = useLanguage();
  const isAmharic = language === 'am';

  const currentIndex = wrapIndex(page, JOURNEY_DATA.length);
  const item = JOURNEY_DATA[currentIndex];

  const displayYear = isAmharic ? (item.amYear ?? item.year) : item.year;
  const displayTitle = isAmharic ? (item.amTitle ?? item.title) : item.title;
  const displayDescription = isAmharic ? (item.amDescription ?? item.description) : item.description;
  const displayCallout = isAmharic ? (item.amCallout ?? item.callout) : item.callout;

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setPage((prevPage) => prevPage + newDirection);
  };

  return (
    <section id="story" className="relative overflow-hidden bg-[#0A0A0A] px-4 py-20 pb-40 md:px-6 md:py-24 md:pb-48">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,168,69,0.10),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_28%)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 grid gap-8 md:mb-16 md:grid-cols-[1.05fr_0.95fr] md:gap-12">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-[#D4A845] to-transparent" />
              <p
                className={`text-[11px] text-[#D4A845]/78 ${
                  isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans uppercase tracking-[0.32em]'
                }`}
              >
                {t('journey.scrollPrompt')}
              </p>
            </div>

            <h2 className={`max-w-xl text-[2.8rem] leading-[0.95] text-[#EAE5D9] md:text-[4.75rem] ${isAmharic ? 'font-ethiopic font-light' : 'font-serif italic'}`}>
              {t('journey.heading')}
            </h2>
          </div>

          <div className="flex flex-col justify-end">
            <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm md:p-7">
              <p className={`text-sm leading-7 text-stone-400 md:text-[15px] md:leading-8 ${isAmharic ? 'font-ethiopic' : 'font-sans'}`}>
                {t('journey.subtitle')}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between gap-5">
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#D4A845]/75">
                {String(currentIndex + 1).padStart(2, '0')} / {String(JOURNEY_DATA.length).padStart(2, '0')}
              </p>

              <div className="flex items-center gap-3">
                <NavArrow direction="prev" label={t('journey.prev')} onClick={() => paginate(-1)} />
                <NavArrow direction="next" label={t('journey.next')} onClick={() => paginate(1)} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative w-full max-w-6xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[#111111] shadow-[0_34px_120px_rgba(0,0,0,0.5)] min-h-[760px] md:h-[68vh] md:max-h-[760px] md:min-h-0">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.article
                key={item.id}
                custom={direction}
                initial={{ opacity: 0, x: direction >= 0 ? 80 : -80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction >= 0 ? -80 : 80 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={(_, info) => {
                  const swipe = swipePower(info.offset.x, info.velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute inset-0"
              >
                <div className="grid h-full grid-cols-1 md:grid-cols-[1.04fr_0.96fr]">
                  <div className="relative h-[40vh] min-h-[320px] md:h-full">
                    <div className="absolute inset-4 overflow-hidden rounded-[1.35rem] border border-white/10 md:inset-6">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={displayTitle}
                          fill
                          priority
                          sizes="(max-width: 768px) 100vw, 60vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#1d1711] to-[#0c0c0c]">
                          <span className="font-serif text-6xl text-[#D4A845]/20">{displayYear}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex h-full flex-col justify-center px-7 py-8 md:px-12 md:py-12 lg:px-14">
                    <div className="flex flex-1 flex-col justify-center">
                      <p
                        className={`mb-4 text-[11px] uppercase text-[#D4A845]/80 ${
                          isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans tracking-[0.34em]'
                        }`}
                      >
                        {displayYear}
                      </p>

                      <h3 className={`max-w-md text-[2rem] leading-tight text-[#EAE5D9] md:text-[2.65rem] ${isAmharic ? 'font-ethiopic font-light' : 'font-serif'}`}>
                        {displayTitle}
                      </h3>

                      <div className="my-6 h-px w-16 bg-gradient-to-r from-[#D4A845]/75 to-transparent" />

                      <ParsedDescription text={displayDescription} isAmharic={isAmharic} />

                      {displayCallout ? (
                        <a
                          href="#home"
                          className={`mt-7 inline-flex w-fit items-center gap-3 text-xs text-[#D4A845]/75 transition-colors hover:text-[#f0d99f] ${
                            isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans uppercase tracking-[0.24em]'
                          }`}
                        >
                          <span className="h-px w-8 bg-current/60" />
                          <span>{displayCallout}</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
            </div>

            <div className="mt-6 flex flex-col items-center gap-3">
              <p className={`text-center text-[10px] text-stone-400 md:hidden ${isAmharic ? 'font-ethiopic' : 'font-sans'}`}>
                {t('journey.swipeHint')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
