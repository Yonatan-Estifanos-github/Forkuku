'use client';

import { useRef } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

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
// Silhouette SVGs — 3 male poses, 3 female poses (rotated across the grid)
// Each has a subtle gold drop-shadow applied via the wrapper div
// ─────────────────────────────────────────────────────────────────────────────
const S = 'rgba(212,168,69,0.22)'; // stroke
const F1 = 'rgba(255,255,255,0.07)'; // head fill
const F2 = 'rgba(255,255,255,0.05)'; // body fill

function MaleUpright() {
  return (
    <svg viewBox="0 0 80 110" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="18" rx="12" ry="13" fill={F1} stroke={S} strokeWidth="0.8" />
      <rect x="36" y="29" width="8" height="8" rx="2" fill={F2} />
      {/* Wide-shouldered jacket */}
      <path d="M7 40 L17 36 Q27 33 35 37 L40 42 L45 37 Q53 33 63 36 L73 40 Q77 56 75 100 H5 Q3 56 7 40Z"
        fill={F2} stroke={S} strokeWidth="0.7" />
      {/* Left arm at side */}
      <path d="M9 44 Q3 58 4 76 Q6 79 9 75 Q9 60 13 46Z" fill={F2} />
      {/* Right arm at side */}
      <path d="M71 44 Q77 58 76 76 Q74 79 71 75 Q71 60 67 46Z" fill={F2} />
    </svg>
  );
}

function MaleAdjustingTie() {
  return (
    <svg viewBox="0 0 80 110" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="18" rx="12" ry="13" fill={F1} stroke={S} strokeWidth="0.8" />
      <rect x="36" y="29" width="8" height="8" rx="2" fill={F2} />
      <path d="M7 40 L17 36 Q27 33 35 37 L40 42 L45 37 Q53 33 63 36 L73 40 Q77 56 75 100 H5 Q3 56 7 40Z"
        fill={F2} stroke={S} strokeWidth="0.7" />
      {/* Left arm down */}
      <path d="M9 44 Q3 58 4 76 Q6 79 9 75 Q9 60 13 46Z" fill={F2} />
      {/* Right arm raised — elbow bent, forearm toward collar */}
      <path d="M65 37 Q74 32 77 22 Q75 16 71 19 Q69 26 62 37Z" fill={F2} stroke={S} strokeWidth="0.6" />
      <path d="M62 37 Q67 30 70 22 Q68 18 65 21 Q63 28 58 38Z" fill={F2} />
    </svg>
  );
}

function MaleArmsCrossed() {
  return (
    <svg viewBox="0 0 80 110" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="18" rx="12" ry="13" fill={F1} stroke={S} strokeWidth="0.8" />
      <rect x="36" y="29" width="8" height="8" rx="2" fill={F2} />
      <path d="M7 40 L17 36 Q27 33 35 37 L40 42 L45 37 Q53 33 63 36 L73 40 Q77 56 75 100 H5 Q3 56 7 40Z"
        fill={F2} stroke={S} strokeWidth="0.7" />
      {/* Left arm crossing right */}
      <path d="M14 46 Q24 52 40 55 Q38 59 36 60 Q20 58 8 50 Q8 46 14 46Z" fill={F2} stroke={S} strokeWidth="0.5" />
      {/* Right arm crossing left */}
      <path d="M66 46 Q56 52 40 57 Q42 61 44 62 Q60 59 72 50 Q72 46 66 46Z" fill={F2} stroke={S} strokeWidth="0.5" />
    </svg>
  );
}

function FemaleBouquet() {
  return (
    <svg viewBox="0 0 80 110" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="16" rx="11" ry="12" fill={F1} stroke={S} strokeWidth="0.8" />
      <rect x="37" y="27" width="6" height="7" rx="2" fill={F2} />
      {/* Bodice */}
      <path d="M22 35 Q28 32 36 34 L40 39 L44 34 Q52 32 58 35 Q63 47 58 62 Q52 65 40 65 Q28 65 22 62 Q17 47 22 35Z"
        fill={F2} stroke={S} strokeWidth="0.7" />
      {/* Skirt */}
      <path d="M22 62 Q28 65 40 65 Q52 65 58 62 Q65 78 68 100 H12 Q15 78 22 62Z"
        fill={F2} stroke={S} strokeWidth="0.6" />
      {/* Arms coming to center at waist */}
      <path d="M22 38 Q14 50 18 62 Q20 64 22 62 Q20 52 25 41Z" fill={F2} />
      <path d="M58 38 Q66 50 62 62 Q60 64 58 62 Q60 52 55 41Z" fill={F2} />
      {/* Bouquet */}
      <ellipse cx="40" cy="68" rx="9" ry="7"
        fill="rgba(212,168,69,0.07)" stroke="rgba(212,168,69,0.25)" strokeWidth="0.8" />
      <circle cx="37" cy="67" r="2.5" fill="rgba(212,168,69,0.1)" />
      <circle cx="43" cy="67" r="2.5" fill="rgba(212,168,69,0.1)" />
      <circle cx="40" cy="64" r="2.5" fill="rgba(212,168,69,0.1)" />
    </svg>
  );
}

function FemaleStanding() {
  return (
    <svg viewBox="0 0 80 110" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="16" rx="11" ry="12" fill={F1} stroke={S} strokeWidth="0.8" />
      <rect x="37" y="27" width="6" height="7" rx="2" fill={F2} />
      {/* Bodice */}
      <path d="M24 35 Q30 32 37 34 L40 39 L43 34 Q50 32 56 35 Q60 47 56 61 Q50 64 40 64 Q30 64 24 61 Q20 47 24 35Z"
        fill={F2} stroke={S} strokeWidth="0.7" />
      {/* Wide flowing skirt */}
      <path d="M20 61 Q28 64 40 64 Q52 64 60 61 Q68 77 72 100 H8 Q12 77 20 61Z"
        fill={F2} stroke={S} strokeWidth="0.6" />
      {/* Arms flowing at sides */}
      <path d="M24 38 Q15 52 14 70 Q16 73 19 70 Q19 56 26 42Z" fill={F2} />
      <path d="M56 38 Q65 52 66 70 Q64 73 61 70 Q61 56 54 42Z" fill={F2} />
    </svg>
  );
}

function FemaleHandOnHip() {
  return (
    <svg viewBox="0 0 80 110" fill="none" className="w-full h-full">
      <ellipse cx="40" cy="16" rx="11" ry="12" fill={F1} stroke={S} strokeWidth="0.8" />
      <rect x="37" y="27" width="6" height="7" rx="2" fill={F2} />
      {/* Bodice */}
      <path d="M24 35 Q30 32 37 34 L40 39 L43 34 Q50 32 56 35 Q60 47 56 61 Q50 64 40 64 Q30 64 24 61 Q20 47 24 35Z"
        fill={F2} stroke={S} strokeWidth="0.7" />
      {/* Skirt */}
      <path d="M20 61 Q28 64 40 64 Q52 64 60 61 Q68 77 72 100 H8 Q12 77 20 61Z"
        fill={F2} stroke={S} strokeWidth="0.6" />
      {/* Left arm at side */}
      <path d="M24 38 Q15 52 14 70 Q16 73 19 70 Q19 56 26 42Z" fill={F2} />
      {/* Right arm bent — hand on hip */}
      <path d="M56 36 Q67 38 70 50 Q68 54 65 52 Q64 44 58 40Z" fill={F2} stroke={S} strokeWidth="0.5" />
      <path d="M63 50 Q67 61 61 65 Q59 63 61 58 Q65 57 63 50Z" fill={F2} />
    </svg>
  );
}

const MALE_SILHOUETTES = [MaleUpright, MaleAdjustingTie, MaleArmsCrossed];
const FEMALE_SILHOUETTES = [FemaleBouquet, FemaleStanding, FemaleHandOnHip];

// ─────────────────────────────────────────────────────────────────────────────
// Animation variants
// ─────────────────────────────────────────────────────────────────────────────
const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

// Scale-up entrance: 0.5 → 1 — FIFA card pack reveal energy
const cardVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

// Gold flash fires on entrance via variant name propagation from gridVariants
const flashVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 0.85, 0],
    transition: { duration: 0.75, times: [0, 0.12, 1], ease: 'easeOut' as const },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PartyCard — FIFA Ultimate Team card: 3D tilt + glare + spinning border + flash
// ─────────────────────────────────────────────────────────────────────────────
function PartyCard({
  member,
  gender,
  silhouetteIndex,
}: {
  member: PartyMember;
  gender: 'male' | 'female';
  silhouetteIndex: number;
}) {
  // ── 3D Tilt ──
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 180, damping: 18 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-14deg', '14deg']);

  // ── Glare overlay tracks cursor ──
  const glareBackground = useTransform(
    [mouseXSpring, mouseYSpring],
    ([mx, my]) =>
      `radial-gradient(circle at ${(Number(mx) + 0.5) * 100}% ${(Number(my) + 0.5) * 100}%, rgba(255,240,150,0.28) 0%, rgba(212,168,69,0.1) 30%, transparent 65%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const Silhouette =
    gender === 'female'
      ? FEMALE_SILHOUETTES[silhouetteIndex % FEMALE_SILHOUETTES.length]
      : MALE_SILHOUETTES[silhouetteIndex % MALE_SILHOUETTES.length];

  return (
    // Outer wrapper: handles entrance variant + perspective for children
    <motion.div
      variants={cardVariants}
      className="relative aspect-[3/4]"
      style={{ perspective: '600px' }}
    >
      {/* Tilt container — responds to mouse in real time */}
      <motion.div
        className="absolute inset-0"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* ── Animated glowing border (conic-gradient comet) ── */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            background:
              'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, rgba(212,168,69,0.45) 310deg, rgba(255,240,150,0.85) 345deg, rgba(212,168,69,0.45) 360deg)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
        />

        {/* ── Card surface (1px inset exposes the spinning border) ── */}
        <div
          className="absolute inset-[1px] z-10 overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #141210 0%, #0a0908 60%, #0d0b09 100%)' }}
        >
          {/* Jersey number watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span
              className="font-serif leading-none text-wedding-gold"
              style={{ fontSize: '4.5rem', opacity: 0.07 }}
            >
              {member.id}
            </span>
          </div>

          {/* Silhouette with gold drop-shadow */}
          <div
            className="absolute inset-x-[10%] top-[6%] bottom-[26%] pointer-events-none"
            style={{ filter: 'drop-shadow(0 0 6px rgba(212,168,69,0.35))' }}
          >
            <Silhouette />
          </div>

          {/* Glare overlay — moves with mouse */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            style={{ background: glareBackground }}
          />

          {/* Bottom label */}
          <div className="absolute bottom-0 left-0 right-0 px-2 pb-2.5 text-center z-30">
            {member.name ? (
              <>
                <p className="font-serif text-[10px] md:text-xs text-white/85 leading-tight truncate">
                  {member.name}
                </p>
                <p className="font-sans text-[7px] md:text-[9px] text-wedding-gold/60 tracking-[0.3em] uppercase mt-0.5 truncate">
                  {member.role}
                </p>
              </>
            ) : (
              <p className="font-sans text-[7px] md:text-[9px] text-white/22 tracking-[0.3em] uppercase">
                {member.role}
              </p>
            )}
          </div>

          {/* Edge vignette */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, transparent 50%, rgba(0,0,0,0.5) 100%)',
            }}
          />
        </div>

        {/* ── Gold flash on entrance — sits above the card surface ── */}
        <motion.div
          variants={flashVariants}
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(255,240,130,0.9) 0%, rgba(212,168,69,0.6) 35%, transparent 70%)',
          }}
        />
      </motion.div>
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
  const isInView = useInView(ref, { once: true, amount: 0.1 });

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
        <h3
          className="font-serif text-xl md:text-2xl text-white/90"
          style={{ filter: 'drop-shadow(0 0 12px rgba(212,168,69,0.2))' }}
        >
          {title}
        </h3>
        <div className="w-6 h-[1px] bg-wedding-gold/40 mx-auto mt-3" />
      </motion.div>

      {/* Card grid — perspective for scale-in depth */}
      <motion.div
        ref={ref}
        variants={gridVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid grid-cols-3 gap-1.5 md:gap-2.5 w-full"
        style={{ perspective: '1200px' }}
      >
        {members.map((member) => (
          <PartyCard
            key={member.id}
            member={member}
            gender={gender}
            silhouetteIndex={member.id - 1}
          />
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212,168,69,0.04) 0%, transparent 70%)',
        }}
      />

      {/* ── Section header ── */}
      <div className="text-center mb-16 md:mb-24 relative z-10">
        <p className="font-sans text-wedding-gold/45 uppercase tracking-[0.55em] text-xs mb-6">
          Wedding Party
        </p>

        {/* Names — gold shimmer + amplified glow */}
        <h2
          className="font-serif text-5xl md:text-7xl lg:text-8xl gold-shimmer"
          style={{
            filter:
              'drop-shadow(0 0 60px rgba(212,168,69,0.28)) drop-shadow(0 2px 24px rgba(212,168,69,0.35))',
          }}
        >
          Yonatan &amp; Saron
        </h2>

        {/* Subtitle — shimmering gold hint */}
        <p
          className="font-serif text-base md:text-lg italic mt-5"
          style={{
            color: 'rgba(212,168,69,0.5)',
            filter: 'drop-shadow(0 0 20px rgba(212,168,69,0.2))',
          }}
        >
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
