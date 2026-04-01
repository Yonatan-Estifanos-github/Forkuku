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
import { useLanguage } from '@/context/LanguageContext';

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
    funFact: 'Most Likely to Have You in Tears Laughing and Not Even Know Why' },
];

const BRIDESMAIDS: PartyMember[] = [
  { id: 1,  name: 'Abigael Gebremariam', role: 'Maid of Honor', photo: img('br1.png'),
    funFact: 'Hidden Talent: Can aggressively negotiate a 70% discount on an item that isn\'t even for sale' },
  { id: 2,  name: 'Hermella Gebre',      role: 'Bridesmaid',    photo: img('br2.png'),  photoPosition: 'bottom',
    funFact: 'Hidden Talent: Can interrogate a literal rock and successfully extract its deepest, darkest secrets in under five minutes' },
  { id: 3,  name: 'Christina Alemayehu', role: 'Bridesmaid',    photo: img('br3.JPG'),
    funFact: 'Hidden Talent: Can escalate a "quick coffee catch-up" into an unhinged, 12-hour core memory' },
  { id: 4,  name: 'Lydia Dawit',         role: 'Bridesmaid',    photo: img('br4.jpg'),
    funFact: 'Hidden Talent: Can stare at three condiments and half an onion and miraculously produce a 5-star meal' },
  { id: 5,  name: 'Edom Wake',           role: 'Bridesmaid',    photo: img('br5.png'),
    funFact: 'Hidden Talent: Possesses terrifying FBI-level intuition ... can always tell when something is up' },
  { id: 6,  name: 'Ruth Tefera',         role: 'Bridesmaid',    photo: img('br6.png'),
    funFact: 'Hidden Talent: Can sweet-talk her way out of a parking ticket ... and somehow get the cop to apologize to her' },
  { id: 7,  name: 'Amen Tefera',         role: 'Bridesmaid',    photo: img('br7.png'),
    funFact: 'Hidden Talent: Can transform a simple "I went to Target" story into a 45-minute cinematic thriller with three plot twists' },
  { id: 8,  name: 'Maranatha Haile',     role: 'Bridesmaid',    photo: img('br8.png'),
    funFact: 'Hidden Talent: Will invite you to run a "quick errand" and accidentally hold you hostage on a 9-hour adventure' },
  { id: 9,  name: 'Sabrina Yohannes',    role: 'Bridesmaid',    photo: img('br9.png'),
    funFact: 'Hidden Talent: Can forcefully adopt a complete stranger and make them her best friend before they even realize they needed one' },
  { id: 10, name: "El'roi Gebre",        role: 'Bridesmaid',    photo: img('br10.jpeg'),
    funFact: 'Hidden Talent: Can laugh for absolutely no reason and somehow make the entire room cry laughing with her top-tier Amharic humor' },
  { id: 11, name: 'Ariam Yohannes',      role: 'Bridesmaid',    photo: img('br11.JPG'),
    funFact: 'Hidden Talent: Can make any situation 10 times more fun without even trying' },
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
const SUPERLATIVE_PREFIX    = 'Most Likely to ';
const HIDDEN_TALENT_PREFIX  = 'Hidden Talent: ';

function SuperlativeOverlay({ text }: { text: string }) {
  const { language } = useLanguage();
  const isAmharic = language === 'am';
  const isSuperlative   = text.startsWith(SUPERLATIVE_PREFIX);
  const isHiddenTalent  = text.startsWith(HIDDEN_TALENT_PREFIX);
  const label    = isSuperlative  ? 'Most Likely to'
                 : isHiddenTalent ? 'Hidden Talent'
                 : 'Fun Fact';
  const punchline = isSuperlative  ? text.slice(SUPERLATIVE_PREFIX.length)
                  : isHiddenTalent ? text.slice(HIDDEN_TALENT_PREFIX.length)
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
        className={`text-wedding-gold/70 tracking-[0.35em] uppercase mb-1.5 leading-none ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans'}`}
        style={{ fontSize: isAmharic ? '7px' : '5.5px' }}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.32, delay: 0.06 }}
      >
        {label}
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
        className={`italic text-white/90 leading-snug ${isAmharic ? 'font-ethiopic font-light not-italic' : 'font-serif'}`}
        style={{ fontSize: isAmharic ? '10px' : '8px' }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      >
        {punchline}
      </motion.p>

      {/* Tap-to-close hint */}
      <motion.p
        className={`text-white/20 tracking-[0.25em] uppercase absolute bottom-1.5 ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans'}`}
        style={{ fontSize: isAmharic ? '7px' : '5px' }}
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
  const { language } = useLanguage();
  const isAmharic = language === 'am';

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
          <p className={`text-[10px] md:text-xs text-white/85 leading-tight truncate ${isAmharic ? 'font-ethiopic font-light' : 'font-serif'}`}>{member.name}</p>
          <p className={`text-[7px] md:text-[9px] text-wedding-gold/60 tracking-[0.3em] uppercase mt-0.5 truncate ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans'}`}>{member.role}</p>
        </>
      ) : (
        <p className={`text-[7px] md:text-[9px] text-white/22 tracking-[0.3em] uppercase ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans'}`}>{member.role}</p>
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
          <span className={`leading-none text-wedding-gold ${isAmharic ? 'font-ethiopic font-light' : 'font-serif'}`} style={{ fontSize: '4.5rem', opacity: 0.07 }}>
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
            <span className={`text-[6px] text-white/20 tracking-widest uppercase ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans'}`}>tap</span>
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
            <span className={`leading-none text-wedding-gold ${isAmharic ? 'font-ethiopic font-light' : 'font-serif'}`} style={{ fontSize: '4.5rem', opacity: 0.07 }}>
              {member.id}
            </span>
          </div>

          {PhotoBlock}

          {/* Glare */}
          <motion.div className="absolute inset-0 pointer-events-none z-20" style={{ background: glareBackground }} />

          {BottomLabel}

          {/* Tap hint */}
          <div className="absolute top-1.5 right-1.5 z-30">
            <span className={`text-[6px] text-white/20 tracking-widest uppercase ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans'}`}>tap</span>
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
            <p className={`text-[6px] md:text-[7px] text-wedding-gold/60 tracking-[0.4em] uppercase ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans'}`}>Fun Fact</p>
            <div className="w-5 h-[1px] bg-wedding-gold/40" />
          </div>

          {/* Fun fact text */}
          <p className={`text-[8px] md:text-[9px] text-white/78 text-center leading-relaxed italic flex-1 flex items-center px-0.5 py-2 ${isAmharic ? 'font-ethiopic font-light not-italic' : 'font-serif'}`}>
            {member.funFact}
          </p>

          {/* Bottom hint */}
          <p className={`text-[6px] text-white/20 tracking-[0.25em] uppercase ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans'}`}>tap to close</p>
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
  const { t, language } = useLanguage();
  const isAmharic = language === 'am';
  const sideLabel = isAmharic ? '' : (side === 'left' ? t('party.his') : t('party.her'));

  return (
    <div className="flex-1 flex flex-col items-center min-w-0">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-8 md:mb-10"
      >
        {sideLabel ? (
          <p className="font-sans text-wedding-gold/45 uppercase tracking-[0.5em] text-[10px] mb-2">
            {sideLabel}
          </p>
        ) : null}
        <h3 className={`text-xl md:text-2xl text-white/90 ${isAmharic ? 'font-ethiopic font-light' : 'font-serif'}`}
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
  const { t, language } = useLanguage();
  const isAmharic = language === 'am';

  return (
    <section id="wedding-party" className="relative bg-luxury-black py-24 md:py-40 px-4 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,168,69,0.04) 0%, transparent 70%)' }} />

      <div className="text-center mb-20 md:mb-28 relative z-10">
        <h2
          className={`text-[2.9rem] md:text-7xl lg:text-[5.4rem] ${isAmharic ? 'font-ethiopic font-light tracking-normal text-stone-200' : 'font-serif italic font-normal tracking-tight text-[#EAE5D9]'}`}
          style={{ filter: 'drop-shadow(0 0 28px rgba(212,168,69,0.14))' }}
        >
          {t('party.heading')}
        </h2>
        <div className="flex items-center justify-center gap-4 mt-8 md:mt-10">
          <div className="w-16 md:w-28 h-[1px] bg-gradient-to-r from-transparent to-wedding-gold/35" />
          <div className="w-2 h-2 rounded-full bg-wedding-gold/60" />
          <div className="w-16 md:w-28 h-[1px] bg-gradient-to-l from-transparent to-wedding-gold/35" />
        </div>
        <p
          className={`mt-8 md:mt-10 max-w-3xl mx-auto text-xs md:text-sm leading-relaxed ${isAmharic ? 'font-ethiopic text-wedding-gold/95 tracking-normal' : 'font-sans uppercase tracking-[0.18em] text-wedding-gold'}`}
        >
          {t('party.subtitle')}
        </p>
        <p className={`mt-5 text-sm md:text-base text-stone-500 ${isAmharic ? 'font-ethiopic font-light' : 'font-serif italic'}`}>
          {t('party.count')}
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto z-10">
        <div className="flex flex-col md:flex-row gap-10 md:gap-6 lg:gap-10">
          <PartyColumn title={t('party.groomsmen')} members={GROOMSMEN}   side="left"  gender="male"   variant="superlative" />
          <div className="hidden md:flex flex-col items-center self-stretch py-4">
            <div className="flex-1 w-[1px]"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,168,69,0.2) 20%, rgba(212,168,69,0.2) 80%, transparent)' }} />
          </div>
          <PartyColumn title={t('party.bridesmaids')} members={BRIDESMAIDS} side="right" gender="female" variant="superlative" />
        </div>

        {/* --- PARENTS SECTION --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-24 md:mt-32 pt-16 border-t border-wedding-gold/15 flex flex-col items-center text-center"
        >
          <h3 className={`text-3xl md:text-4xl text-wedding-gold mb-8 ${isAmharic ? 'font-ethiopic font-light' : 'font-serif italic'}`}>
            {t('party.parentsHeading')}
          </h3>

          <div className="relative group max-w-4xl mx-auto mb-10">
            {/* Museum Frame for Parents Photo */}
            <div className="relative z-10 border border-wedding-gold/25 bg-[#0f0e0d] p-3 sm:p-5 shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]">
              {/* Gold corner accents */}
              <div className="absolute top-1.5 left-1.5 w-6 h-6 border-t border-l border-wedding-gold/55" />
              <div className="absolute top-1.5 right-1.5 w-6 h-6 border-t border-r border-wedding-gold/55" />
              <div className="absolute bottom-1.5 left-1.5 w-6 h-6 border-b border-l border-wedding-gold/55" />
              <div className="absolute bottom-1.5 right-1.5 w-6 h-6 border-b border-r border-wedding-gold/55" />

              <div className="relative overflow-hidden aspect-[16/10] sm:aspect-[16/9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/bothfamilyfromeng.JPG"
                  alt="Our Parents"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
            
            {/* Soft glow behind frame */}
            <div className="absolute inset-0 bg-wedding-gold/5 blur-3xl -z-10 rounded-full scale-110" />
          </div>

          <p className={`max-w-2xl mx-auto text-lg md:text-xl text-stone-300 leading-relaxed px-4 ${isAmharic ? 'font-ethiopic font-light' : 'font-serif italic'}`}>
            &ldquo;{t('party.parentsDescription')}&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  );
}
