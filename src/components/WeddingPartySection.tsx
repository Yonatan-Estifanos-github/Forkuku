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
function PartyCard({ member }: { member: PartyMember }) {
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
        // Gradient border trick: gold → transparent 1px border
        background:
          'linear-gradient(to bottom, #0e0d0c, #0a0908) padding-box,' +
          'linear-gradient(135deg, rgba(212,168,69,0.55), rgba(212,168,69,0) 55%) border-box',
        border: '1px solid transparent',
        backdropFilter: 'blur(12px)',
        transformStyle: 'preserve-3d',
        transformOrigin: 'bottom center',
      }}
    >
      {/* Cursor-following radial gold glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.18 }}
        style={{
          background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(212,168,69,0.18) 0%, transparent 65%)`,
        }}
      />

      {/* Abstract portrait silhouette */}
      <div className="absolute inset-0 flex flex-col items-center pt-[22%] pointer-events-none">
        {/* Head */}
        <div
          className="rounded-full border border-wedding-gold/12"
          style={{
            width: '38%',
            aspectRatio: '1',
            background: 'rgba(255,255,255,0.05)',
          }}
        />
        {/* Shoulders / torso */}
        <div
          className="mt-[5%] rounded-t-full border-t border-x border-wedding-gold/10"
          style={{
            width: '62%',
            height: '36%',
            background: 'rgba(255,255,255,0.03)',
          }}
        />
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

      {/* Top vignette for depth */}
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
}: {
  title: string;
  members: PartyMember[];
  side: 'left' | 'right';
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
          <PartyCard key={member.id} member={member} />
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
          The people who made us who we are
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
          <PartyColumn title="Groomsmen" members={GROOMSMEN} side="left" />

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

          <PartyColumn title="Bridesmaids" members={BRIDESMAIDS} side="right" />
        </div>
      </div>
    </section>
  );
}
