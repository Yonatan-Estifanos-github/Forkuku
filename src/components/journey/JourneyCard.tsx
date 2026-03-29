'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Image from 'next/image';
import { JourneyItem } from './journeyData';
import { useLanguage } from '@/context/LanguageContext';

interface JourneyCardProps {
  item: JourneyItem;
  index: number;
}

function PromptBlock({
  text,
  isAmharic,
}: {
  text: string;
  isAmharic: boolean;
}) {
  const prompt = text.startsWith('[Yoni]')
    ? (isAmharic ? 'ዮኒ:' : 'yoni:')
    : (isAmharic ? 'ሳሮን:' : 'saron:');
  const body = text.replace(/^\[(?:Yoni|Saron)\]\s*/, '');

  return (
    <div className="pl-4">
      <p className="font-mono text-sm text-wedding-gold">{prompt}</p>
      <p className={`mt-2 text-sm leading-relaxed text-white/62 md:text-[15px] md:leading-7 ${isAmharic ? 'font-ethiopic' : 'font-sans'}`}>
        {body}
      </p>
    </div>
  );
}

function ParsedDescription({ text, isAmharic }: { text: string; isAmharic: boolean }) {
  const segments = text
    .split(/(?=\[(?:Yoni|Saron)\])/g)
    .map((segment) => segment.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5">
      {segments.map((segment, i) => {
        if (segment.startsWith('[Yoni]') || segment.startsWith('[Saron]')) {
          return <PromptBlock key={i} text={segment} isAmharic={isAmharic} />;
        }

        return (
          <p
            key={i}
            className={`pl-4 text-sm leading-relaxed text-white/62 md:text-[15px] md:leading-7 ${
              isAmharic ? 'font-ethiopic' : 'font-sans'
            }`}
          >
            {segment}
          </p>
        );
      })}
    </div>
  );
}

export default function JourneyCard({ item, index }: JourneyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isLeft = index % 2 === 0;
  const isInView = useInView(cardRef, { once: true, amount: 0.25 });
  const { language } = useLanguage();
  const isAmharic = language === 'am';

  const displayYear = isAmharic ? (item.amYear ?? item.year) : item.year;
  const displayTitle = isAmharic ? (item.amTitle ?? item.title) : item.title;
  const displayDescription = isAmharic ? (item.amDescription ?? item.description) : item.description;
  const displayCallout = isAmharic ? (item.amCallout ?? item.callout) : item.callout;
  const lineNumbers = ['01', '02', '03', ...(displayCallout ? ['04'] : [])];

  // Per-card scroll: drives image parallax within the museum frame
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  // Image translates -8% → +8% as card moves through the viewport
  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col md:flex-row ${
        !isLeft ? 'md:flex-row-reverse' : ''
      } items-center gap-8 md:gap-0 pt-6 pb-20 md:pb-36`}
    >
      {/* Thread dot — mobile: left edge, desktop: horizontal center */}
      <div className="absolute left-6 top-7 md:left-1/2 md:-translate-x-1/2 z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="w-3 h-3 rounded-full bg-wedding-gold"
          style={{ boxShadow: '0 0 12px 3px rgba(212,168,69,0.45)' }}
        />
      </div>

      {/* ── Museum frame side ── */}
      <div
        className={`w-full md:w-1/2 flex justify-center pl-14 md:pl-0 ${
          isLeft ? 'md:justify-end md:pr-16' : 'md:justify-start md:pl-16'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -30 : 30 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="relative"
          style={{ width: 340, maxWidth: '100%' }}
        >
          {/* Year watermark — massive, 7% opacity, sits behind the frame */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
            <span
              className="font-serif leading-none text-wedding-gold"
              style={{ fontSize: 170, opacity: 0.07 }}
            >
              {item.year.replace(/[^0-9]/g, '').slice(0, 4)}
            </span>
          </div>

          {/* Museum frame — generous padding, portrait orientation */}
          <div
            className="relative z-10 border border-wedding-gold/25 bg-[#0f0e0d] p-[18px]"
            style={{ aspectRatio: '3/4' }}
          >
            {/* Gold corner accents */}
            <div className="absolute top-1.5 left-1.5 w-5 h-5 border-t border-l border-wedding-gold/55" />
            <div className="absolute top-1.5 right-1.5 w-5 h-5 border-t border-r border-wedding-gold/55" />
            <div className="absolute bottom-1.5 left-1.5 w-5 h-5 border-b border-l border-wedding-gold/55" />
            <div className="absolute bottom-1.5 right-1.5 w-5 h-5 border-b border-r border-wedding-gold/55" />

            {/* Inner clipping container — overflow:hidden masks the parallax image */}
            <div className="relative w-full h-full overflow-hidden">
              {item.image ? (
                <motion.div
                  style={{
                    y: imageY,
                    position: 'absolute',
                    // Extend 10% beyond edges so Y translation never reveals empty space
                    top: '-10%',
                    left: '-5%',
                    right: '-5%',
                    bottom: '-10%',
                  }}
                >
                  <Image
                    src={item.image}
                    alt={displayTitle}
                    fill
                    sizes="340px"
                    // object-top preserves faces; no aggressive center-crop
                    className="object-cover object-top"
                  />
                </motion.div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1a1208] to-[#0a0908] flex items-center justify-center">
                  <span className="font-serif text-wedding-gold/20 text-5xl">{displayYear}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Text side — blur-to-focus reveal ── */}
      <div
        className={`w-full md:w-1/2 pl-14 md:pl-0 flex flex-col ${
          isLeft
            ? 'items-start md:items-start md:pl-16'
            : 'items-start md:items-end md:pr-16'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, filter: 'blur(10px)', x: isLeft ? 30 : -30 }}
          animate={
            isInView
              ? { opacity: 1, filter: 'blur(0px)', x: 0 }
              : { opacity: 0, filter: 'blur(10px)', x: isLeft ? 30 : -30 }
          }
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className={`w-full max-w-[380px] ${!isLeft ? 'md:self-end' : ''}`}
        >
          <div className="flex gap-4 border-l border-white/10 pl-4 md:pl-5">
            <div className="select-none pt-0.5 font-mono text-[11px] leading-8 text-white/20">
              {lineNumbers.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>

            <div className="flex-1 space-y-5">
              <p className="font-mono text-xs italic text-wedding-gold/58">
                {`// ${displayYear}`}
              </p>

              <div className="leading-tight">
                <span className="font-mono text-sm text-white/40">const chapter = </span>
                <span className={`text-2xl text-wedding-gold md:text-3xl ${isAmharic ? 'font-ethiopic font-light' : 'font-serif'}`}>
                  &quot;{displayTitle}&quot;
                </span>
                <span className="font-mono text-sm text-white/40">;</span>
              </div>

              <ParsedDescription text={displayDescription} isAmharic={isAmharic} />

              {displayCallout && (
                <a
                  href="#home"
                  className={`inline-flex w-fit items-center gap-3 pl-4 text-xs text-wedding-gold/60 transition-colors hover:text-wedding-gold ${
                    isAmharic ? 'font-ethiopic' : 'font-mono'
                  }`}
                >
                  <span className="h-px w-6 bg-current/60" />
                  <span>{displayCallout}</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
