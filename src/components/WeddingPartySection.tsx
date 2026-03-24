'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// DATA — swap name / role / funFact / photo for any member. Zero layout changes.
// ─────────────────────────────────────────────────────────────────────────────
interface PartyMember {
  id: number;
  name: string;
  role: string;
  funFact: string;
  photo?: string;
  photoFit?: 'cover' | 'contain';
  photoPosition?: string;
}

const CDN_BASE =
  'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui';

const img = (filename: string) => `${CDN_BASE}/${encodeURIComponent(filename)}`;

const GROOMSMEN: PartyMember[] = [
  { id: 1,  name: 'Symney Cameron',    role: 'Best Man',  photoFit: 'contain', photo: img('gm1.png'),
    funFact: 'Most Likely to Freestyle for No Reason ... We Get It, Big Dawg, Just Chill' },
  { id: 2,  name: 'Yoseph Estifanos',  role: 'Groomsman', photo: img('gm2.jpg'),
    funFact: 'Most Likely to Bring Leave-In Conditioner to the Wedding Party' },
  { id: 3,  name: 'Kiran Pandey',      role: 'Groomsman', photo: img('gm3.jpg'),
    funFact: 'Most Likely to Have Allegedly Carried the Groom Through Math 250: Ordinary Differential Equations' },
  { id: 4,  name: 'Fikru Ashenafi',    role: 'Groomsman', photo: img('gm4.JPG'),
    funFact: 'Most Likely to Buy the Groom a Mac Studio with an M3 Ultra, 512GB of RAM, and 16TB of Storage' },
  { id: 5,  name: 'Ziam Jan',          role: 'Groomsman', photo: img('gm5.png'),
    funFact: 'Most Likely to Have All the Smell-Good Spray for the Crew' },
  { id: 6,  name: 'Daniel Hodeta',     role: 'Groomsman', photo: img('gm6.jpg'),
    funFact: 'Most Likely to Know How to Tie a Bow Tie' },
  { id: 7,  name: 'Amanuel Estifanos', role: 'Groomsman', photo: img('gm7.jpeg'),
    funFact: 'Most Likely to Be Off Beat but Fully Committed' },
  { id: 8,  name: 'Abel Gebre',        role: 'Groomsman', photo: img('gm8.png'),
    funFact: 'Most Likely to Remember Everything You\'ve Ever Said, Making Him a Vulnerability for the Cause' },
  { id: 9,  name: 'Kirollos Rezkalla', role: 'Groomsman', photo: img('gm9.png'),
    funFact: 'Most Likely to Start Stargazing, Hear a Sound in the Dark, Say "Guys, I Don\'t Have a Good Feeling About This," and Get Escorted Back to the Car by a Highly Motivated Group of Cats' },
  { id: 10, name: 'Samuel Guta',       role: 'Groomsman', photo: img('gm10.png'),
    funFact: 'Most Likely to Worship Hard Enough to Bring Down the Walls of Jericho' },
  { id: 11, name: 'Kaleab Mekonen',    role: 'Groomsman', photo: img('gm11.jpeg'),
    funFact: 'Most Likely to Cancel Last Minute with an Excuse So Ridiculous You Can\'t Even Be Mad' },
];

const BRIDESMAIDS: PartyMember[] = [
  { id: 1,  name: 'Abigael Gebremariam', role: 'Maid of Honor', funFact: '', photo: img('br1.png')  },
  { id: 2,  name: 'Hermella Gebre',      role: 'Bridesmaid',    funFact: '', photo: img('br2.png'),  photoPosition: 'bottom' },
  { id: 3,  name: 'Christina Alemayehu', role: 'Bridesmaid',    funFact: '', photo: img('br3.JPG')  },
  { id: 4,  name: 'Lydia Dawit',         role: 'Bridesmaid',    funFact: '', photo: img('br4.jpg')  },
  { id: 5,  name: 'Edom Wake',           role: 'Bridesmaid',    funFact: '', photo: img('br5.png')  },
  { id: 6,  name: 'Ruth Tefera',         role: 'Bridesmaid',    funFact: '', photo: img('br6.png')  },
  { id: 7,  name: 'Amen Tefera',         role: 'Bridesmaid',    funFact: '', photo: img('br7.png')  },
  { id: 8,  name: 'Maranatha Haile',     role: 'Bridesmaid',    funFact: '', photo: img('br8.png')  },
  { id: 9,  name: 'Sabrina Yohannes',    role: 'Bridesmaid',    funFact: '', photo: img('br9.png')  },
  { id: 10, name: "El'roi Gebre",        role: 'Bridesmaid',    funFact: '', photo: img('br10.jpeg') },
  { id: 11, name: 'Ariam Yohannes',      role: 'Bridesmaid',    funFact: '', photo: img('br11.JPG')  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Elegant continuous line-art objects — 1px gold stroke, no fill
// Groomsmen: Bowtie   |   Bridesmaids: Flower
// ─────────────────────────────────────────────────────────────────────────────
const G  = 'rgba(212,168,69,0.82)';   // main stroke

const lineProps = {
  fill: 'none',
  stroke: G,
  strokeWidth: '1',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Bowtie() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
      {/* Left wing */}
      <path {...lineProps}
        d="M38 38 Q26 30 12 28 Q6 34 8 40 Q6 46 12 52 Q26 50 38 42 Q36 40 38 38Z" />
      {/* Right wing */}
      <path {...lineProps}
        d="M42 38 Q54 30 68 28 Q74 34 72 40 Q74 46 68 52 Q54 50 42 42 Q44 40 42 38Z" />
      {/* Centre knot */}
      <path {...lineProps}
        d="M38 38 Q40 35 42 38 L42 42 Q40 45 38 42 Z" />
    </svg>
  );
}


function Flower() {
  return (
    <svg viewBox="0 0 100 120" fill="none" className="w-full h-full">
      {/* Petal 1 — top */}
      <path {...lineProps}
        d="M50 42 C46 34 42 22 50 14 C58 22 54 34 50 42Z" />
      {/* Petal 2 — top-right */}
      <path {...lineProps}
        d="M50 42 C58 38 68 30 72 22 C66 18 56 24 50 42Z" />
      {/* Petal 3 — bottom-right */}
      <path {...lineProps}
        d="M50 46 C58 48 70 46 76 40 C70 34 60 38 50 46Z" />
      {/* Petal 4 — bottom */}
      <path {...lineProps}
        d="M50 46 C46 54 42 66 50 74 C58 66 54 54 50 46Z" />
      {/* Petal 5 — bottom-left */}
      <path {...lineProps}
        d="M50 46 C42 48 30 46 24 40 C30 34 40 38 50 46Z" />
      {/* Petal 6 — top-left */}
      <path {...lineProps}
        d="M50 42 C42 38 32 30 28 22 C34 18 44 24 50 42Z" />
      {/* Outer centre ring */}
      <circle cx="50" cy="44" r="8" stroke={G} strokeWidth="1" fill="none" />
      {/* Inner centre */}
      <circle cx="50" cy="44" r="3.5" stroke={G} strokeWidth="0.8" fill="none" />
      {/* Centre dots */}
      <circle cx="50" cy="44" r="0.8" stroke={G} strokeWidth="0.8" fill="none" />
      {/* Stem */}
      <path {...lineProps} d="M50 74 C49 82 50 90 50 96" />
      {/* Right leaf */}
      <path {...lineProps} d="M50 84 C58 78 64 70 60 64 C54 68 50 78 50 84Z" />
      {/* Left leaf */}
      <path {...lineProps} d="M50 88 C42 82 36 74 40 68 C46 72 50 82 50 88Z" />
    </svg>
  );
}

const MALE_SILHOUETTES   = [Bowtie];
const FEMALE_SILHOUETTES = [Flower];

// ─────────────────────────────────────────────────────────────────────────────
// Animation variants
// ─────────────────────────────────────────────────────────────────────────────
const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

const flashVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 0.85, 0],
    transition: { duration: 0.75, times: [0, 0.12, 1], ease: 'easeOut' as const },
  },
};

// Shared border style used on both front and back face
const cardFaceStyle = {
  background:
    'linear-gradient(160deg, #141210 0%, #0a0908 100%) padding-box,' +
    'linear-gradient(135deg, rgba(212,168,69,0.55) 0%, rgba(212,168,69,0.12) 50%, transparent 100%) border-box',
  border: '1px solid transparent',
  backfaceVisibility: 'hidden' as const,
  WebkitBackfaceVisibility: 'hidden' as const,
};

// ─────────────────────────────────────────────────────────────────────────────
// SuperlativeOverlay — rendered inside groomsmen cards on hover / tap
// ─────────────────────────────────────────────────────────────────────────────
const SUPERLATIVE_PREFIX = 'Most Likely to ';

function SuperlativeOverlay({ text }: { text: string }) {
  const punchline = text.startsWith(SUPERLATIVE_PREFIX)
    ? text.slice(SUPERLATIVE_PREFIX.length)
    : text;

  return (
    <motion.div
      key="superlative"
      className="absolute inset-0 z-40 flex flex-col items-center justify-center px-2 py-3 text-center"
      style={{ background: 'rgba(6,5,4,0.78)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      {/* Gold micro-label */}
      <motion.p
        className="font-sans text-wedding-gold/70 tracking-[0.35em] uppercase mb-1.5 leading-none"
        style={{ fontSize: '5.5px' }}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.32, delay: 0.06 }}
      >
        Most Likely to
      </motion.p>

      {/* Thin gold rule */}
      <motion.div
        className="w-4 h-[0.5px] bg-wedding-gold/40 mb-2"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        exit={{ scaleX: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />

      {/* Punchline — italic Cormorant */}
      <motion.p
        className="font-serif italic text-white/90 leading-snug"
        style={{ fontSize: '8px' }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      >
        {punchline}
      </motion.p>

      {/* Tap-to-close hint */}
      <motion.p
        className="font-sans text-white/20 tracking-[0.25em] uppercase absolute bottom-1.5"
        style={{ fontSize: '5px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.22 }}
      >
        tap to close
      </motion.p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PartyCard — two variants:
//   default      → 3D tilt + flip to reveal fun fact (bridesmaids)
//   superlative  → hover/tap darkens photo, superlative fades in (groomsmen)
// ─────────────────────────────────────────────────────────────────────────────
function PartyCard({
  member,
  gender,
  silhouetteIndex,
  variant = 'default',
}: {
  member: PartyMember;
  gender: 'male' | 'female';
  silhouetteIndex: number;
  variant?: 'default' | 'superlative';
}) {
  const [isFlipped, setIsFlipped]   = useState(false);
  const [isActive,  setIsActive]    = useState(false);

  // ── 3D tilt (default variant, front face only) ──
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spring = { stiffness: 180, damping: 18 };
  const mouseXSpring = useSpring(mouseX, spring);
  const mouseYSpring = useSpring(mouseY, spring);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-14deg', '14deg']);

  // ── Glare follows cursor ──
  const glareBackground = useTransform(
    [mouseXSpring, mouseYSpring],
    ([mx, my]) =>
      `radial-gradient(circle at ${(Number(mx) + 0.5) * 100}% ${(Number(my) + 0.5) * 100}%, rgba(255,240,150,0.28) 0%, rgba(212,168,69,0.10) 30%, transparent 65%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (variant === 'superlative' || isFlipped) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleClick = () => {
    if (variant === 'superlative') {
      setIsActive(a => !a);
      return;
    }
    mouseX.set(0);
    mouseY.set(0);
    setIsFlipped(f => !f);
  };

  const Silhouette =
    gender === 'female'
      ? FEMALE_SILHOUETTES[silhouetteIndex % FEMALE_SILHOUETTES.length]
      : MALE_SILHOUETTES[silhouetteIndex % MALE_SILHOUETTES.length];

  // ── Shared photo / silhouette block ──
  const PhotoBlock = (
    <>
      {member.photo ? (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={member.photo}
            alt={member.name}
            className={`w-full h-full ${member.photoFit === 'contain' ? 'object-contain' : 'object-cover'}`}
            style={{ objectPosition: member.photoPosition ?? 'center' }}
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(10,9,8,0.92) 80%, rgba(10,9,8,1) 100%)' }} />
        </div>
      ) : (
        <div
          className="absolute inset-x-[8%] top-[5%] bottom-[24%] pointer-events-none"
          style={{ filter: 'drop-shadow(0 0 7px rgba(212,168,69,0.38))' }}
        >
          <Silhouette />
        </div>
      )}
    </>
  );

  // ── Bottom label (shared) ──
  const BottomLabel = (
    <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 text-center z-30">
      {member.name ? (
        <>
          <p className="font-serif text-[10px] md:text-xs text-white/85 leading-tight truncate">{member.name}</p>
          <p className="font-sans text-[7px] md:text-[9px] text-wedding-gold/60 tracking-[0.3em] uppercase mt-0.5 truncate">{member.role}</p>
        </>
      ) : (
        <p className="font-sans text-[7px] md:text-[9px] text-white/22 tracking-[0.3em] uppercase">{member.role}</p>
      )}
    </div>
  );

  // ────────────────────────────────────────────────────────
  // SUPERLATIVE VARIANT — hover/tap overlay, no 3D flip
  // ────────────────────────────────────────────────────────
  if (variant === 'superlative') {
    return (
      <motion.div
        variants={cardVariants}
        className="relative aspect-[3/4] cursor-pointer select-none"
        style={cardFaceStyle}
        onClick={handleClick}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
      >
        {/* Number watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-serif leading-none text-wedding-gold" style={{ fontSize: '4.5rem', opacity: 0.07 }}>
            {member.id}
          </span>
        </div>

        {PhotoBlock}

        {/* Edge vignette */}
        <div className="absolute inset-0 pointer-events-none z-10"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, transparent 50%, rgba(0,0,0,0.5) 100%)' }} />

        {/* Tap hint (only when not active) */}
        {!isActive && (
          <div className="absolute top-1.5 right-1.5 z-30">
            <span className="font-sans text-[6px] text-white/20 tracking-widest uppercase">tap</span>
          </div>
        )}

        {BottomLabel}

        {/* Gold flash on entrance */}
        <motion.div variants={flashVariants} className="absolute inset-0 z-40 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(255,240,130,0.9) 0%, rgba(212,168,69,0.6) 35%, transparent 70%)' }} />

        {/* Superlative overlay */}
        <AnimatePresence>
          {isActive && <SuperlativeOverlay text={member.funFact} />}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ────────────────────────────────────────────────────────
  // DEFAULT VARIANT — 3D tilt + flip (bridesmaids)
  // ────────────────────────────────────────────────────────
  return (
    <motion.div
      variants={cardVariants}
      className="relative aspect-[3/4] cursor-pointer"
      style={{ perspective: '700px' }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
    >
      {/* Flip container — rotates 180° on click */}
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ── FRONT FACE — headshot + tilt + glare ── */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{ ...cardFaceStyle, rotateX, rotateY }}
        >
          {/* Number watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="font-serif leading-none text-wedding-gold" style={{ fontSize: '4.5rem', opacity: 0.07 }}>
              {member.id}
            </span>
          </div>

          {PhotoBlock}

          {/* Glare */}
          <motion.div className="absolute inset-0 pointer-events-none z-20" style={{ background: glareBackground }} />

          {BottomLabel}

          {/* Tap hint */}
          <div className="absolute top-1.5 right-1.5 z-30">
            <span className="font-sans text-[6px] text-white/20 tracking-widest uppercase">tap</span>
          </div>

          {/* Edge vignette */}
          <div className="absolute inset-0 pointer-events-none z-10"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, transparent 50%, rgba(0,0,0,0.5) 100%)' }} />

          {/* Gold flash on entrance */}
          <motion.div variants={flashVariants} className="absolute inset-0 z-40 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(255,240,130,0.9) 0%, rgba(212,168,69,0.6) 35%, transparent 70%)' }} />
        </motion.div>

        {/* ── BACK FACE — fun fact ── */}
        <div
          className="absolute inset-0 overflow-hidden flex flex-col items-center justify-between py-3 px-2.5"
          style={{ ...cardFaceStyle, transform: 'rotateY(180deg)' }}
        >
          {/* Top ornament */}
          <div className="flex flex-col items-center gap-1 pt-0.5">
            <div className="w-5 h-[1px] bg-wedding-gold/40" />
            <p className="font-sans text-[6px] md:text-[7px] text-wedding-gold/60 tracking-[0.4em] uppercase">Fun Fact</p>
            <div className="w-5 h-[1px] bg-wedding-gold/40" />
          </div>

          {/* Fun fact text */}
          <p className="font-serif text-[8px] md:text-[9px] text-white/78 text-center leading-relaxed italic flex-1 flex items-center px-0.5 py-2">
            {member.funFact}
          </p>

          {/* Bottom hint */}
          <p className="font-sans text-[6px] text-white/20 tracking-[0.25em] uppercase">tap to close</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PartyColumn
// ─────────────────────────────────────────────────────────────────────────────
function PartyColumn({
  title,
  members,
  side,
  gender,
  variant = 'default',
}: {
  title: string;
  members: PartyMember[];
  side: 'left' | 'right';
  gender: 'male' | 'female';
  variant?: 'default' | 'superlative';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div className="flex-1 flex flex-col items-center min-w-0">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-8 md:mb-10"
      >
        <p className="font-sans text-wedding-gold/45 uppercase tracking-[0.5em] text-[10px] mb-2">
          {side === 'left' ? 'His' : 'Her'}
        </p>
        <h3 className="font-serif text-xl md:text-2xl text-white/90"
          style={{ filter: 'drop-shadow(0 0 12px rgba(212,168,69,0.2))' }}>
          {title}
        </h3>
        <div className="w-6 h-[1px] bg-wedding-gold/40 mx-auto mt-3" />
      </motion.div>

      {/* Split into rows of 3; last partial row is centered */}
      <motion.div
        ref={ref}
        variants={gridVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="flex flex-col gap-1.5 md:gap-2.5 w-full"
        style={{ perspective: '1200px' }}
      >
        {Array.from({ length: Math.ceil(members.length / 3) }, (_, rowIdx) => {
          const chunk = members.slice(rowIdx * 3, rowIdx * 3 + 3);
          const isPartial = chunk.length < 3;
          return (
            <div
              key={rowIdx}
              className={`flex gap-1.5 md:gap-2.5 ${isPartial ? 'justify-center' : ''}`}
            >
              {chunk.map((member) => (
                <div key={member.id} className="w-1/3">
                  <PartyCard
                    member={member}
                    gender={gender}
                    silhouetteIndex={member.id - 1}
                    variant={variant}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WeddingPartySection
// ─────────────────────────────────────────────────────────────────────────────
export default function WeddingPartySection() {
  return (
    <section id="wedding-party" className="relative bg-luxury-black py-24 md:py-40 px-4 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,168,69,0.04) 0%, transparent 70%)' }} />

      <div className="text-center mb-16 md:mb-24 relative z-10">
        <p className="font-sans text-wedding-gold/45 uppercase tracking-[0.55em] text-xs mb-6">Wedding Party</p>
        <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl gold-shimmer"
          style={{ filter: 'drop-shadow(0 0 60px rgba(212,168,69,0.28)) drop-shadow(0 2px 24px rgba(212,168,69,0.35))' }}>
          Yonatan &amp; Saron
        </h2>
        <p className="font-serif text-base md:text-lg italic mt-5"
          style={{ color: 'rgba(212,168,69,0.5)', filter: 'drop-shadow(0 0 20px rgba(212,168,69,0.2))' }}>
          The friends who&apos;ve been with us every step of the way
        </p>
        <p className="font-sans text-xs md:text-sm text-white/30 mt-3 italic">
          (Yes, there are 22 of them. No, we could not narrow it down. Yes, we tried.)
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="w-20 md:w-36 h-[1px] bg-gradient-to-r from-transparent to-wedding-gold/35" />
          <div className="w-1.5 h-1.5 rounded-full bg-wedding-gold/55" />
          <div className="w-20 md:w-36 h-[1px] bg-gradient-to-l from-transparent to-wedding-gold/35" />
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto z-10">
        <div className="flex flex-col md:flex-row gap-10 md:gap-6 lg:gap-10">
          <PartyColumn title="Groomsmen"  members={GROOMSMEN}   side="left"  gender="male"   variant="superlative" />
          <div className="hidden md:flex flex-col items-center self-stretch py-4">
            <div className="flex-1 w-[1px]"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,168,69,0.2) 20%, rgba(212,168,69,0.2) 80%, transparent)' }} />
          </div>
          <PartyColumn title="Bridesmaids" members={BRIDESMAIDS} side="right" gender="female" />
        </div>
      </div>
    </section>
  );
}
