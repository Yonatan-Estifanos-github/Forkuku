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

function ArrowButton({
  direction,
  label,
  onClick,
}: {
  direction: 'prev' | 'next';
  label: string;
  onClick: () => void;
}) {
  const isPrev = direction === 'prev';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-1/2 z-30 hidden -translate-y-1/2 items-center gap-3 rounded-full border border-[#D4A845]/18 bg-black/30 px-4 py-3 text-[11px] uppercase tracking-[0.28em] text-[#D4A845]/88 backdrop-blur-md transition-all duration-300 hover:border-[#D4A845]/40 hover:text-[#F0D99F] md:flex ${
        isPrev ? 'left-6 lg:left-8' : 'right-6 lg:right-8'
      }`}
      aria-label={label}
    >
      {isPrev ? <span className="text-lg leading-none">&lt;</span> : null}
      <span>{label}</span>
      {!isPrev ? <span className="text-lg leading-none">&gt;</span> : null}
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
    <section id="story" className="relative overflow-hidden bg-[#0A0A0A] px-4 py-24 md:px-6 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,168,69,0.10),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p
              className={`mb-5 text-[11px] uppercase text-[#D4A845]/75 ${
                isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans tracking-[0.32em]'
              }`}
            >
              {t('journey.scrollPrompt')}
            </p>
            <h2 className={`text-4xl text-[#EAE5D9] md:text-6xl ${isAmharic ? 'font-ethiopic font-light' : 'font-serif italic'}`}>
              {t('journey.heading')}
            </h2>
          </div>

          <p className={`max-w-xl text-sm leading-7 text-stone-400 md:text-base ${isAmharic ? 'font-ethiopic' : 'font-sans'}`}>
            {t('journey.subtitle')}
          </p>
        </div>

        <div className="relative">
          <ArrowButton direction="prev" label={t('journey.prev')} onClick={() => paginate(-1)} />
          <ArrowButton direction="next" label={t('journey.next')} onClick={() => paginate(1)} />

          <div className="pointer-events-none absolute right-0 top-0 z-20 hidden rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-[11px] uppercase tracking-[0.34em] text-[#D4A845]/75 backdrop-blur-sm md:block">
            {String(currentIndex + 1).padStart(2, '0')} / {String(JOURNEY_DATA.length).padStart(2, '0')}
          </div>

          <div className="relative min-h-[700px] overflow-hidden rounded-[2rem] border border-white/8 bg-[#111111] shadow-[0_40px_140px_rgba(0,0,0,0.55)] md:h-[80vh] md:max-h-[900px]">
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
                <div className="grid h-full grid-cols-1 md:grid-cols-[1.08fr_0.92fr]">
                  <div className="relative h-[42vh] min-h-[320px] md:h-full">
                    <div className="absolute inset-5 overflow-hidden rounded-[1.5rem] border border-white/10 md:inset-8">
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

                  <div className="flex h-full flex-col justify-center px-6 pb-20 pt-8 md:px-12 md:py-14 lg:px-16">
                    <p
                      className={`mb-5 text-[11px] uppercase text-[#D4A845]/80 ${
                        isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans tracking-[0.34em]'
                      }`}
                    >
                      {displayYear}
                    </p>

                    <h3 className={`max-w-lg text-3xl leading-tight text-[#EAE5D9] md:text-5xl ${isAmharic ? 'font-ethiopic font-light' : 'font-serif'}`}>
                      {displayTitle}
                    </h3>

                    <div className="my-7 h-px w-20 bg-gradient-to-r from-[#D4A845]/75 to-transparent" />

                    <ParsedDescription text={displayDescription} isAmharic={isAmharic} />

                    {displayCallout ? (
                      <a
                        href="#home"
                        className={`mt-8 inline-flex w-fit items-center gap-3 text-xs text-[#D4A845]/75 transition-colors hover:text-[#f0d99f] ${
                          isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans uppercase tracking-[0.24em]'
                        }`}
                      >
                        <span className="h-px w-8 bg-current/60" />
                        <span>{displayCallout}</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between border-t border-white/8 bg-black/28 px-5 py-4 backdrop-blur-md md:hidden">
              <button
                type="button"
                onClick={() => paginate(-1)}
                className={`text-[11px] text-[#D4A845]/88 ${
                  isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans uppercase tracking-[0.28em]'
                }`}
              >
                &lt; {t('journey.prev')}
              </button>

              <div className="text-center">
                <p className="text-[11px] uppercase tracking-[0.32em] text-[#D4A845]/80">
                  {String(currentIndex + 1).padStart(2, '0')} / {String(JOURNEY_DATA.length).padStart(2, '0')}
                </p>
                <p className={`mt-1 text-[10px] text-stone-400 ${isAmharic ? 'font-ethiopic' : 'font-sans'}`}>
                  {t('journey.swipeHint')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => paginate(1)}
                className={`text-[11px] text-[#D4A845]/88 ${
                  isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans uppercase tracking-[0.28em]'
                }`}
              >
                {t('journey.next')} &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
