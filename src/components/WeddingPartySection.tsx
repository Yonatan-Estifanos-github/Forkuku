'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// DATA — swap name / role / photo for any member. Layout is fully data-driven.
// ─────────────────────────────────────────────────────────────────────────────
interface PartyMember {
  id: number;
  name: string;
  role: string;
  photo?: string;
}

const GROOMSMEN: PartyMember[] = [
  { id: 1,  name: '', role: 'Best Man' },
  { id: 2,  name: '', role: 'Groomsman' },
  { id: 3,  name: '', role: 'Groomsman' },
  { id: 4,  name: '', role: 'Groomsman' },
  { id: 5,  name: '', role: 'Groomsman' },
  { id: 6,  name: '', role: 'Groomsman' },
  { id: 7,  name: '', role: 'Groomsman' },
  { id: 8,  name: '', role: 'Groomsman' },
  { id: 9,  name: '', role: 'Groomsman' },
  { id: 10, name: '', role: 'Groomsman' },
  { id: 11, name: '', role: 'Groomsman' },
];

const BRIDESMAIDS: PartyMember[] = [
  { id: 1,  name: '', role: 'Maid of Honor' },
  { id: 2,  name: '', role: 'Bridesmaid' },
  { id: 3,  name: '', role: 'Bridesmaid' },
  { id: 4,  name: '', role: 'Bridesmaid' },
  { id: 5,  name: '', role: 'Bridesmaid' },
  { id: 6,  name: '', role: 'Bridesmaid' },
  { id: 7,  name: '', role: 'Bridesmaid' },
  { id: 8,  name: '', role: 'Bridesmaid' },
  { id: 9,  name: '', role: 'Bridesmaid' },
  { id: 10, name: '', role: 'Bridesmaid' },
  { id: 11, name: '', role: 'Bridesmaid' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Silhouette SVGs — football lineup card style
// ─────────────────────────────────────────────────────────────────────────────
function MaleSilhouette() {
  return (
    <svg viewBox="0 0 80 105" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Head */}
      <ellipse cx="40" cy="21" rx="13" ry="14"
        fill="rgba(255,255,255,0.06)" stroke="rgba(212,168,69,0.18)" strokeWidth="0.8" />
      {/* Neck */}
      <rect x="35.5" y="33" width="9" height="8" rx="2"
        fill="rgba(255,255,255,0.05)" />
      {/* Jersey torso — wide shoulders like a kit */}
      <path d="M6 48 L16 44 Q26 41 34 44 L40 49 L46 44 Q54 41 64 44 L74 48
               Q78 62 76 100 H4 Q2 62 6 48Z"
        fill="rgba(255,255,255,0.05)" stroke="rgba(212,168,69,0.13)" strokeWidth="0.8" />
    </svg>
  );
}

function FemaleSilhouette() {
  return (
    <svg viewBox="0 0 80 105" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Head */}
      <ellipse cx="40" cy="19" rx="12" ry="13"
        fill="rgba(255,255,255,0.06)" stroke="rgba(212,168,69,0.18)" strokeWidth="0.8" />
      {/* Neck */}
      <rect x="36" y="30" width="8" height="7" rx="2"
        fill="rgba(255,255,255,0.05)" />
      {/* Dress bodice — narrower, elegant shoulders */}
      <path d="M22 39 Q28 37 36 38 L40 44 L44 38 Q52 37 58 39
               Q64 50 60 64 Q52 67 40 67 Q28 67 20 64 Q16 50 22 39Z"
        fill="rgba(255,255,255,0.05)" stroke="rgba(212,168,69,0.13)" strokeWidth="0.8" />
      {/* Skirt — flares outward like a gown */}
      <path d="M20 64 Q28 67 40 67 Q52 67 60 64
               Q66 78 70 100 H10 Q14 78 20 64Z"
        fill="rgba(255,255,255,0.04)" stroke="rgba(212,168,69,0.10)" strokeWidth="0.8" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Animation variants — staggered 3D fold-up entrance
// ─────────────────────────────────────────────────────────────────────────────
const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.065, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, rotateX: -78, y: 28 },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PartyCard — glassmorphic silhouette with cursor-following radial glow
// ─────────────────────────────────────────────────────────────────────────────
function PartyCard({ member, gender }: { member: PartyMember; gender: 'male' | 'female' }) {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative aspect-[3/4] overflow-hidden cursor-default"
      style={{
        background:
          'linear-gradient(to bottom, #0e0d0c, #0a0908) padding-box,' +
          'linear-gradient(135deg, rgba(212,168,69,0.55), rgba(212,168,69,0) 55%) border-box',
        border: '1px solid transparent',
        backdropFilter: 'blur(12px)',
        transformStyle: 'preserve-3d',
        transformOrigin: 'bottom center',
      }}
    >
      {/* Jersey number watermark — football card style */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="font-serif leading-none text-wedding-gold"
          style={{ fontSize: '4.5rem', opacity: 0.06 }}
        >
          {member.id}
        </span>
      </div>

      {/* Cursor-following radial gold glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.18 }}
        style={{
          background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(212,168,69,0.18) 0%, transparent 65%)`,
        }}
      />

      {/* Gender-appropriate silhouette */}
      <div className="absolute inset-x-[12%] top-[8%] bottom-[28%] pointer-events-none">
        {gender === 'female' ? <FemaleSilhouette /> : <MaleSilhouette />}
      </div>

      {/* Bottom label */}
      <div className="absolute bottom-0 left-0 right-0 px-2 pb-2.5 text-center">
        {member.name ? (
          <>
            <p className="font-serif text-[10px] md:text-xs text-white/80 leading-tight truncate">
              {member.name}
            </p>
            <p className="font-sans text-[8px] md:text-[9px] text-wedding-gold/55 tracking-[0.3em] uppercase mt-0.5 truncate">
              {member.role}
            </p>
          </>
        ) : (
          <p className="font-sans text-[8px] md:text-[9px] text-white/20 tracking-[0.3em] uppercase">
            {member.role}
          </p>
        )}
      </div>

      {/* Vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, transparent 55%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PartyColumn — column header + staggered card grid
// ─────────────────────────────────────────────────────────────────────────────
function PartyColumn({
  title,
  members,
  side,
  gender,
}: {
  title: string;
  members: PartyMember[];
  side: 'left' | 'right';
  gender: 'male' | 'female';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.12 });

  return (
    <div className="flex-1 flex flex-col items-center min-w-0">
      {/* Column header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-8 md:mb-10"
      >
        <p className="font-sans text-wedding-gold/45 uppercase tracking-[0.5em] text-[10px] mb-2">
          {side === 'left' ? 'His' : 'Her'}
        </p>
        <h3 className="font-serif text-xl md:text-2xl text-white/90">{title}</h3>
        <div className="w-6 h-[1px] bg-wedding-gold/40 mx-auto mt-3" />
      </motion.div>

      {/* Card grid with perspective set for 3D fold effect */}
      <motion.div
        ref={ref}
        variants={gridVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid grid-cols-3 gap-1.5 md:gap-2.5 w-full"
        style={{ perspective: '900px' }}
      >
        {members.map((member) => (
          <PartyCard key={member.id} member={member} gender={gender} />
        ))}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WeddingPartySection
// ─────────────────────────────────────────────────────────────────────────────
export default function WeddingPartySection() {
  return (
    <section
      id="wedding-party"
      className="relative bg-luxury-black py-24 md:py-40 px-4 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(212,168,69,0.035) 0%, transparent 70%)',
        }}
      />

      {/* ── Section header ── */}
      <div className="text-center mb-16 md:mb-24 relative z-10">
        <p className="font-sans text-wedding-gold/45 uppercase tracking-[0.55em] text-xs mb-6">
          Wedding Party
        </p>

        {/* Names — gold shimmer + extra glow */}
        <h2
          className="font-serif text-5xl md:text-7xl lg:text-8xl gold-shimmer"
          style={{
            filter:
              'drop-shadow(0 0 50px rgba(212,168,69,0.22)) drop-shadow(0 2px 20px rgba(212,168,69,0.28))',
          }}
        >
          Yonatan &amp; Saron
        </h2>

        <p className="font-serif text-white/35 text-base md:text-lg italic mt-5">
          The friends who&apos;ve been with us every step of the way
        </p>

        {/* Luxury divider */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="w-20 md:w-36 h-[1px] bg-gradient-to-r from-transparent to-wedding-gold/35" />
          <div className="w-1.5 h-1.5 rounded-full bg-wedding-gold/55" />
          <div className="w-20 md:w-36 h-[1px] bg-gradient-to-l from-transparent to-wedding-gold/35" />
        </div>
      </div>

      {/* ── Two-column party layout ── */}
      <div className="relative max-w-5xl mx-auto z-10">
        <div className="flex flex-col md:flex-row gap-10 md:gap-6 lg:gap-10">
          <PartyColumn title="Groomsmen" members={GROOMSMEN} side="left" gender="male" />

          {/* Vertical center divider — desktop only */}
          <div className="hidden md:flex flex-col items-center self-stretch py-4">
            <div
              className="flex-1 w-[1px]"
              style={{
                background:
                  'linear-gradient(to bottom, transparent, rgba(212,168,69,0.2) 20%, rgba(212,168,69,0.2) 80%, transparent)',
              }}
            />
          </div>

          <PartyColumn title="Bridesmaids" members={BRIDESMAIDS} side="right" gender="female" />
        </div>
      </div>
    </section>
  );
}
