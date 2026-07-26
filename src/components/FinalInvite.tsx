'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import FadeIn from '@/components/ui/FadeIn';
import type { NavState } from '@/context/ViewContext';

interface FinalInviteProps extends NavState {
  guestName?: string;
  isCheckingGuest?: boolean;
}

const BUCKET =
  'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui';
const asset = (name: string) => `${BUCKET}/${encodeURIComponent(name)}`;

const GALLERY: { src: string; alt: string; className: string }[] = [
  { src: asset('on afield.jpg'), alt: 'Yonatan and Saron walking together in an open field', className: 'col-span-2 row-span-2' },
  { src: asset('hereyes.jpg'), alt: 'Close-up portrait of Saron smiling', className: 'col-span-1 row-span-1' },
  { src: asset('laughing.jpg'), alt: 'Yonatan and Saron laughing together', className: 'col-span-1 row-span-2' },
  { src: asset('closeuphors.jpg'), alt: 'Close-up of a horse in the field', className: 'col-span-1 row-span-1' },
  { src: asset('looking at each other.jpg'), alt: 'Yonatan and Saron looking at each other', className: 'col-span-2 row-span-1' },
  { src: asset('horses.jpg'), alt: 'Horses grazing in the pasture', className: 'col-span-1 row-span-1' },
  { src: asset('enjoyingeachother.jpg'), alt: 'Yonatan and Saron embracing outdoors', className: 'col-span-1 row-span-2' },
];

const navLinkClass = (isActive: boolean) =>
  `font-display text-xs sm:text-sm tracking-[0.25em] uppercase pb-1 border-b transition-colors duration-300 ${
    isActive
      ? 'text-[#D4AF37] border-[#D4AF37]'
      : 'text-neutral-400 border-transparent hover:text-neutral-500'
  }`;

export default function FinalInvite({
  activeView,
  onToggleView,
  guestName,
  isCheckingGuest = false,
}: FinalInviteProps) {
  return (
    <div className="bg-[#FDFDF9] text-[#1B3B2A]">
      {/* Top Navigation */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#D4AF37]/20 bg-[#FDFDF9]/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-8 px-6 py-4 sm:gap-14">
          <button
            type="button"
            onClick={() => onToggleView('save-the-date')}
            aria-current={activeView === 'save-the-date' ? 'page' : undefined}
            className={navLinkClass(activeView === 'save-the-date')}
          >
            Save the Date
          </button>
          <button
            type="button"
            onClick={() => onToggleView('final-invite')}
            aria-current={activeView === 'final-invite' ? 'page' : undefined}
            className={navLinkClass(activeView === 'final-invite')}
          >
            Final Invite
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex h-[100svh] w-full items-end overflow-hidden">
        <Image
          src={asset('eng-main-image.jpg')}
          alt="Yonatan and Saron"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(253,253,249,0.55) 55%, #FDFDF9 100%)',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-16 text-center sm:pb-24"
        >
          <p className="font-sans text-xs uppercase tracking-[0.4em] text-[#D4AF37]">
            Yonatan &amp; Saron
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-[#1B3B2A] sm:text-6xl">
            The Next Chapter
          </h1>
          <p className="mt-3 font-serif text-lg italic text-[#1B3B2A]/80 sm:text-2xl">
            You&apos;re Invited
          </p>
        </motion.div>
      </section>

      {/* Story & Details */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-20 sm:py-28 md:grid-cols-2 md:gap-16">
        <FadeIn>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={asset('oldbuilding.jpg')}
              alt="The wedding venue"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.15} className="flex flex-col justify-center">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            The Details
          </p>
          <h2 className="mt-3 font-display text-3xl text-[#1B3B2A] sm:text-4xl">
            Join Us As We Say &ldquo;I Do&rdquo;
          </h2>

          <dl className="mt-10 space-y-8">
            <div className="border-l-2 border-[#D4AF37]/40 pl-5">
              <dt className="font-sans text-xs uppercase tracking-[0.3em] text-[#1B3B2A]/50">
                When
              </dt>
              <dd className="mt-1 font-serif text-xl text-[#1B3B2A]">
                September 4, 2026
              </dd>
            </div>
            <div className="border-l-2 border-[#D4AF37]/40 pl-5">
              <dt className="font-sans text-xs uppercase tracking-[0.3em] text-[#1B3B2A]/50">
                Where
              </dt>
              <dd className="mt-1 font-serif text-xl text-[#1B3B2A]">
                Wrightsville, Pennsylvania
              </dd>
              <dd className="mt-1 font-sans text-sm text-[#1B3B2A]/60">
                Full address to follow
              </dd>
            </div>
            <div className="border-l-2 border-[#D4AF37]/40 pl-5">
              <dt className="font-sans text-xs uppercase tracking-[0.3em] text-[#1B3B2A]/50">
                Dress Code
              </dt>
              <dd className="mt-1 font-serif text-xl text-[#1B3B2A]">
                Formal Attire
              </dd>
            </div>
          </dl>
        </FadeIn>
      </section>

      {/* Photo Gallery */}
      <section className="mx-auto max-w-6xl px-6 pb-20 sm:pb-28">
        <FadeIn className="mb-10 text-center">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            Moments
          </p>
          <h2 className="mt-3 font-display text-3xl text-[#1B3B2A] sm:text-4xl">
            A Few of Our Favorites
          </h2>
        </FadeIn>

        <div className="grid auto-rows-[140px] grid-cols-2 gap-3 sm:auto-rows-[180px] sm:grid-cols-4 sm:gap-4">
          {GALLERY.map((item, i) => (
            <FadeIn
              key={item.src}
              delay={i * 0.05}
              className={`relative overflow-hidden rounded-xl ${item.className}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover"
              />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Personal Welcome / Schedule */}
      <section className="mx-auto max-w-2xl px-6 pb-24 sm:pb-32">
        <FadeIn>
          <div className="rounded-3xl border border-[#D4AF37]/40 bg-white/60 p-8 shadow-sm sm:p-12">
            {isCheckingGuest ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <span
                  className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37]/30 border-t-[#D4AF37]"
                  role="status"
                  aria-label="Checking your invitation"
                />
                <p className="font-sans text-sm uppercase tracking-[0.3em] text-[#1B3B2A]/50">
                  Checking your invitation…
                </p>
              </div>
            ) : (
              <>
                <p className="font-sans text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
                  Your Invitation
                </p>
                <h2 className="mt-3 font-display text-3xl text-[#1B3B2A]">
                  Welcome back{guestName ? `, ${guestName}` : ''}
                </h2>
                <p className="mt-3 font-serif text-base text-[#1B3B2A]/70">
                  We&apos;re so glad you&apos;re part of our story. Here&apos;s what to
                  expect on the day.
                </p>

                <ul className="mt-8 space-y-5">
                  <li className="flex items-baseline justify-between border-b border-[#D4AF37]/20 pb-3">
                    <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#1B3B2A]/50">
                      Ceremony
                    </span>
                    <span className="font-serif text-[#1B3B2A]">Time to follow</span>
                  </li>
                  <li className="flex items-baseline justify-between border-b border-[#D4AF37]/20 pb-3">
                    <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#1B3B2A]/50">
                      Reception
                    </span>
                    <span className="font-serif text-[#1B3B2A]">Time to follow</span>
                  </li>
                  <li className="flex items-baseline justify-between pb-1">
                    <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#1B3B2A]/50">
                      Dress Code
                    </span>
                    <span className="font-serif text-[#1B3B2A]">Formal Attire</span>
                  </li>
                </ul>
              </>
            )}
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
