'use client';

import { MotionValue, motion, useTransform } from 'framer-motion';
import Image from 'next/image';
import { JourneyItem } from './journeyData';

interface JourneyCardProps {
  item: JourneyItem;
  index: number;
  scrollProgress: MotionValue<number>;
}

export default function JourneyCard({
  item,
  index,
  scrollProgress,
}: JourneyCardProps) {
  // Alternating vertical parallax offset
  const direction = index % 2 === 0 ? 1 : -1;
  const y = useTransform(scrollProgress, [0, 1], [direction * 20, direction * -20]);

  // Image parallax within its clipped container
  const imageY = useTransform(scrollProgress, [0, 1], ['-5%', '5%']);

  return (
    <motion.div
      style={{ y }}
      className="group relative flex-shrink-0 w-[80vw] md:w-[400px] lg:w-[420px] aspect-[3/4]"
    >
      {/* Gold corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#D4A845]/40" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#D4A845]/40" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#D4A845]/40" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#D4A845]/40" />

      {item.image ? (
        /* Photo card */
        <div className="relative w-full h-full overflow-hidden">
          <motion.div style={{ y: imageY }} className="absolute inset-[-10%]">
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 80vw, 420px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
      ) : (
        /* Placeholder card */
        <div className="relative w-full h-full bg-gradient-to-br from-[#1B3B28] via-[#0a0908] to-[#1B3B28] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-4 border border-[#D4A845]/20" />
          <span className="font-serif text-[#D4A845]/30 text-7xl md:text-8xl select-none">
            {item.year}
          </span>
        </div>
      )}

      {/* Year badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className="font-sans text-xs tracking-[0.3em] uppercase text-[#D4A845]/80 bg-black/40 backdrop-blur-sm px-3 py-1">
          {item.year}
        </span>
      </div>

      {/* Bottom text overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
        <h3 className="font-serif text-2xl md:text-3xl text-white mb-2">
          {item.title}
        </h3>
        <p className="font-sans text-sm text-white/70 leading-relaxed line-clamp-3">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}
