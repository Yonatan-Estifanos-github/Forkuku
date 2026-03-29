'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

// ============================================================================
// TYPES
// ============================================================================
interface Guest {
  id: string;
  name: string;
  is_attending: boolean;
  is_plus_one: boolean;
}

interface Party {
  id: string;
  party_name: string;
  status: string;
  has_responded: boolean;
  guests: Guest[];
}

// ============================================================================
// LUXURY INPUT — animated center-expand underline
// ============================================================================
function LuxuryInput({
  label,
  id,
  ...props
}: { label: string; id: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs tracking-widest uppercase font-medium text-wedding-gold/80">
        {label}
      </label>
      <div className="luxury-input relative">
        <input
          id={id}
          className="w-full bg-transparent border-0 py-3 text-lg font-serif tracking-wide outline-none text-stone-200 placeholder:text-stone-600 placeholder:italic"
          {...props}
        />
        <span className="luxury-input-line" />
      </div>
    </div>
  );
}

function LuxuryTextarea({
  label,
  id,
  ...props
}: { label: string; id: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs tracking-widest uppercase font-medium text-wedding-gold/80">
        {label}
      </label>
      <div className="luxury-input relative">
        <textarea
          id={id}
          className="w-full bg-transparent border-0 py-3 text-lg font-serif tracking-wide outline-none text-stone-200 resize-none placeholder:text-stone-600 placeholder:italic"
          {...props}
        />
        <span className="luxury-input-line" />
      </div>
    </div>
  );
}

// ============================================================================
// BUTTON
// ============================================================================
const btnClass =
  'px-10 py-4 font-serif text-sm tracking-widest uppercase transition-all duration-300 bg-wedding-gold hover:bg-harvest-wheat text-luxury-black rounded disabled:opacity-50 disabled:cursor-not-allowed';

// ============================================================================
// SEARCH SCREEN
// ============================================================================
function SearchScreen({
  onFound,
  onMultiple,
}: {
  onFound: (party: Party) => void;
  onMultiple: (parties: Party[]) => void;
}) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedQuery = query.trim();
    const lowercaseQuery = trimmedQuery.toLowerCase();

    // Magic Search for Carrier Verification
    if (lowercaseQuery === 'carrier test' || lowercaseQuery === 'twilio test') {
      onFound({
        id: 'mock-id-verification',
        party_name: 'Carrier Verification',
        status: 'pending',
        has_responded: false,
        guests: [
          { id: 'mock-1', name: 'Reviewer One', is_attending: false, is_plus_one: false },
          { id: 'mock-2', name: 'Reviewer Two', is_attending: false, is_plus_one: false }
        ]
      });
      return;
    }

    if (!trimmedQuery) {
      setError(t('rsvp.errorRequired'));
      return;
    }

    if (trimmedQuery.length < 2) {
      setError(t('rsvp.errorMinLength'));
      return;
    }

    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch('/api/rsvp/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedQuery }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Search failed');
      }

      const matches: Party[] = (data.parties || []).map((p: Party) => ({
        ...p,
        guests: Array.isArray(p.guests) ? p.guests : [],
        has_responded: typeof p.has_responded === 'boolean' ? p.has_responded : false,
      }));

      if (matches.length === 0) {
        throw new Error(t('rsvp.notFound'));
      }

      if (matches.length === 1) {
        onFound(matches[0]);
      } else {
        onMultiple(matches);
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      console.error(err);
      let msg = t('rsvp.notFound');
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          msg = t('rsvp.timeout');
        } else {
          msg = err.message;
        }
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg text-center">
      <p className="font-serif text-base md:text-lg mb-10 leading-relaxed px-4 text-stone-400">
        {t('rsvp.searchPrompt')}
      </p>

      <form onSubmit={handleSearch} className="flex flex-col gap-6">
        <div className="text-left">
          <LuxuryInput
            label={t('rsvp.namePlaceholder')}
            id="search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            placeholder={t('rsvp.nameExample')}
          />
        </div>

        {error && (
          <p className="text-sm font-serif italic text-left text-red-500">
            {error}
          </p>
        )}

        <button type="submit" disabled={isLoading} className={btnClass}>
          {isLoading ? t('rsvp.searching') : t('rsvp.findButton')}
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// SELECT SCREEN — disambiguation when multiple parties match the same name
// ============================================================================
function SelectScreen({
  parties,
  onSelect,
  onBack,
}: {
  parties: Party[];
  onSelect: (party: Party) => void;
  onBack: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-lg">
      <div className="w-full flex justify-start">
        <button
          onClick={onBack}
          className="mb-8 font-serif text-sm tracking-wide flex items-center gap-2 text-stone-500 hover:text-stone-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('rsvp.searchAgain')}
        </button>
      </div>

      <p className="font-serif text-base md:text-lg mb-8 leading-relaxed text-stone-400 text-center">
        {t('rsvp.multipleFound')}
      </p>

      <div className="flex flex-col gap-4">
        {parties.map((party) => {
          const guestNames = party.guests
            .filter(g => g.name?.trim())
            .map(g => g.name.trim())
            .join(', ');
          return (
            <button
              key={party.id}
              onClick={() => onSelect(party)}
              className="text-left w-full px-6 py-5 rounded-xl border border-white/10 bg-stone-800 hover:border-wedding-gold/50 hover:bg-stone-700 transition-all group"
            >
              <p className="font-serif text-lg text-stone-200 group-hover:text-wedding-gold transition-colors mb-1">
                {party.party_name}
              </p>
              {guestNames && (
                <p className="text-sm text-stone-500 font-serif italic">{guestNames}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// RSVP FORM SCREEN
// ============================================================================
function FormScreen({
  party,
  onSubmit,
  onBack,
}: {
  party: Party;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const [guests, setGuests] = useState<Guest[]>(
    party.guests.map((g) => ({ ...g }))
  );
  const [contact, setContact] = useState({ email: '', phone: '', message: '' });
  const [smsConsent, setSmsConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { t } = useLanguage();

  // Ref to prevent double-submission (synchronous check before React state updates)
  const isSubmittingRef = useRef(false);

  const toggleGuest = (index: number, attending: boolean) => {
    setGuests((prev) =>
      prev.map((g, i) => (i === index ? { ...g, is_attending: attending } : g))
    );
  };

  const handleNameChange = (index: number, newName: string) => {
    setGuests((prev) =>
      prev.map((g, i) => (i === index ? { ...g, name: newName } : g))
    );
  };

  const validateForm = (): string | null => {
    // Check for empty guest list
    if (!guests || guests.length === 0) {
      return t('rsvp.noGuests');
    }

    // Email validation - stricter regex
    // Requires: 2+ chars before @, 2+ chars domain, 2+ chars TLD
    const email = contact.email.trim().toLowerCase();
    const emailRegex = /^[a-z0-9._%+-]{2,}@[a-z0-9.-]{2,}\.[a-z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      return t('rsvp.errorEmail');
    }

    // Phone validation (10-15 digits for domestic/international)
    const phoneDigits = contact.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return t('rsvp.errorPhone');
    }

    // SMS Consent validation
    if (!smsConsent) {
      return t('rsvp.errorConsent');
    }

    // Plus-one name validation: if attending, name is required
    for (const guest of guests) {
      if (guest.is_plus_one && guest.is_attending && !guest.name?.trim()) {
        return t('rsvp.errorGuestName');
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Synchronous check to prevent double-submission
    if (isSubmittingRef.current) {
      return;
    }
    isSubmittingRef.current = true;

    setSubmitError('');

    // Validate form before submitting
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      isSubmittingRef.current = false;
      return;
    }

    setIsSubmitting(true);

    // Create abort controller with 20 second timeout (longer for submission)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const res = await fetch('/api/rsvp/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          party_id: party.id,
          email: contact.email,
          phone: contact.phone,
          message: contact.message,
          guests
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      onSubmit();
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      console.error('RSVP Submit Error:', err);
      let msg = t('rsvp.submitError');
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          msg = t('rsvp.timeout');
        } else {
          msg = err.message;
        }
      }
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="w-full max-w-xl">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-8 font-serif text-sm tracking-wide flex items-center gap-2 text-stone-500 hover:text-stone-300 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t('rsvp.searchAgain')}
      </button>

      {/* Welcome Header */}
      <div className="text-center mb-10">
        <p className="text-xs tracking-widest uppercase mb-2 text-wedding-gold/80">
          {t('rsvp.youreInvited')}
        </p>
        <h3 className="font-display text-3xl md:text-4xl tracking-wide text-stone-200">
          {t('rsvp.welcome').replace('{name}', party.party_name)}
        </h3>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Guest List */}
        <div className="mb-10">
          <p className="text-xs tracking-widest uppercase font-medium text-wedding-gold/80 mb-6">
            {t('rsvp.respondForEach')}
          </p>

          {/* Empty guests message */}
          {guests.length === 0 && (
            <div className="text-center py-8 border border-white/10 rounded-lg">
              <p className="font-serif text-stone-400 italic">
                {t('rsvp.noGuests')}
              </p>
              <p className="font-serif text-stone-500 text-sm mt-2">
                {t('rsvp.contactCouple')}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {guests.map((guest, idx) => (
              <div
                key={guest.id}
                className="flex flex-col gap-3 py-4 border-b border-white/10"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg tracking-wide text-stone-200">
                    {guest.is_plus_one && !guest.name ? `Guest ${idx + 1}` : guest.name}
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => toggleGuest(idx, true)}
                      className={`px-4 py-2 text-xs tracking-widest uppercase border rounded-full transition-all duration-300 ${
                        guest.is_attending
                          ? 'bg-wedding-gold text-luxury-black border-wedding-gold'
                          : 'bg-transparent border-white/20 text-white/60 hover:border-wedding-gold/50 hover:text-wedding-gold'
                      }`}
                    >
                      {t('rsvp.accept')}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleGuest(idx, false)}
                      className={`px-4 py-2 text-xs tracking-widest uppercase border rounded-full transition-all duration-300 ${
                        !guest.is_attending
                          ? 'bg-wedding-gold text-luxury-black border-wedding-gold'
                          : 'bg-transparent border-white/20 text-white/60 hover:border-wedding-gold/50 hover:text-wedding-gold'
                      }`}
                    >
                      {t('rsvp.decline')}
                    </button>
                  </div>
                </div>

                {/* Edit Plus One Name */}
                {guest.is_plus_one && (
                  <div className="luxury-input relative">
                    <input
                      type="text"
                      placeholder={t('rsvp.guestName')}
                      value={guest.name || ''}
                      onChange={(e) => handleNameChange(idx, e.target.value)}
                      className="w-full bg-transparent border-0 text-sm font-serif py-1 outline-none text-stone-200 placeholder:italic placeholder:text-stone-600"
                    />
                    <span className="luxury-input-line" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
          <LuxuryInput
            label={t('rsvp.emailLabel')}
            id="email"
            type="email"
            value={contact.email}
            onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
            required
            placeholder={t('rsvp.emailPlaceholder')}
          />
          <LuxuryInput
            label={t('rsvp.phoneLabel')}
            id="phone"
            type="tel"
            value={contact.phone}
            onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
            required
            placeholder={t('rsvp.phonePlaceholder')}
          />
        </div>

        {/* SMS Consent */}
        <div className="mb-8 flex items-start gap-3 bg-white/5 p-4 rounded-lg border border-white/5">
          <input
            type="checkbox"
            id="sms-consent"
            checked={smsConsent}
            onChange={(e) => setSmsConsent(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-white/20 bg-transparent text-wedding-gold focus:ring-wedding-gold focus:ring-offset-0"
          />
          <label htmlFor="sms-consent" className="text-xs leading-relaxed text-stone-400 font-sans tracking-wide cursor-pointer">
            {t('rsvp.smsConsent')}
            <Link
              href="/legal"
              className="ml-1 text-wedding-gold/80 hover:text-wedding-gold underline transition-colors"
            >
              {t('rsvp.privacyPolicy')}
            </Link>
          </label>
        </div>

        {/* Message */}
        <div className="mb-10">
          <LuxuryTextarea
            label={t('rsvp.noteLabel')}
            id="message"
            value={contact.message}
            onChange={(e) => setContact((p) => ({ ...p, message: e.target.value }))}
            rows={3}
            placeholder={t('rsvp.notePlaceholder')}
          />
        </div>

        {/* Error Message */}
        {submitError && (
          <p className="text-sm font-serif italic text-center mb-6 text-red-500">
            {submitError}
          </p>
        )}

        {/* Submit */}
        <div className="flex justify-center">
          <button type="submit" disabled={isSubmitting || guests.length === 0} className={btnClass}>
            {isSubmitting ? t('rsvp.submitting') : t('rsvp.submitButton')}
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// SUCCESS SCREEN
// ============================================================================
function SuccessScreen({ partyName, onBack }: { partyName: string; onBack: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      {/* Back Button */}
      <div className="w-full flex justify-start">
        <button
          onClick={onBack}
          className="mb-8 font-serif text-sm tracking-wide flex items-center gap-2 text-stone-500 hover:text-stone-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('rsvp.goBack')}
        </button>
      </div>

      <div className="text-center">
        {/* Checkmark icon */}
        <div className="w-20 h-20 rounded-full border border-wedding-gold/30 flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-wedding-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Thank you message */}
        <h3 className="font-display text-3xl md:text-4xl mb-4 text-stone-200">
          {t('rsvp.thankYouTitle')}
        </h3>
        <p className="font-serif text-lg italic leading-relaxed text-stone-400">
          {t('rsvp.thankYouMessage').replace('{name}', partyName)}
        </p>

        {/* Registry note */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <p className="font-serif text-base leading-relaxed text-stone-400 mb-6">
            {t('rsvp.registryNote')}
          </p>

          <a
            href="/#registry"
            className="inline-block px-8 py-3 font-medium text-sm tracking-widest uppercase transition-all duration-300 border border-wedding-gold/50 text-wedding-gold rounded hover:bg-wedding-gold/10 hover:border-wedding-gold"
          >
            {t('rsvp.viewRegistry')}
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ALREADY RESPONDED SCREEN
// ============================================================================
function AlreadyRespondedScreen({ partyName, onBack }: { partyName: string; onBack: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      {/* Back Button */}
      <div className="w-full flex justify-start">
        <button
          onClick={onBack}
          className="mb-8 font-serif text-sm tracking-wide flex items-center gap-2 text-stone-500 hover:text-stone-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('rsvp.goBack')}
        </button>
      </div>

      <div className="text-center">
        <div className="w-20 h-20 rounded-full border border-wedding-gold/30 flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-wedding-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="font-display text-3xl md:text-4xl mb-4 text-stone-200">
          {t('rsvp.alreadyRespondedTitle')}
        </h3>
        <p className="font-serif text-lg italic leading-relaxed text-stone-400">
          {t('rsvp.alreadyRespondedMessage').replace('{name}', partyName)}
        </p>

        <div className="mt-10 pt-8 border-t border-white/10">
          <p className="font-serif text-base leading-relaxed text-stone-400 mb-6">
            {t('rsvp.alreadyRespondedNote')}
          </p>

          <a
            href="/#registry"
            className="inline-block px-8 py-3 font-medium text-sm tracking-widest uppercase transition-all duration-300 border border-wedding-gold/50 text-wedding-gold rounded hover:bg-wedding-gold/10 hover:border-wedding-gold"
          >
            {t('rsvp.viewRegistry')}
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
type View = 'search' | 'select' | 'form' | 'success' | 'already_responded';

export default function Rsvp() {
  const [view, setView] = useState<View>('search');
  const [party, setParty] = useState<Party | null>(null);
  const [candidates, setCandidates] = useState<Party[]>([]);
  const { t } = useLanguage();

  const handleFound = (p: Party) => {
    setParty(p);
    if (p.has_responded) {
      setView('already_responded');
    } else {
      setView('form');
    }
  };

  const reset = () => {
    setView('search');
    setParty(null);
    setCandidates([]);
  };

  return (
    <section className="relative min-h-screen w-full bg-stone-950">
      <div className="relative z-10 flex flex-col items-center pt-60 md:pt-64 pb-20 px-6 min-h-screen">
        {/* Card container — fades in on scroll */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="rsvp-card-noise relative max-w-xl w-full mx-auto bg-stone-900 border border-white/10 rounded-2xl p-8 md:p-12 flex flex-col items-center overflow-hidden"
        >
          {/* Content sits above the noise pseudo-element */}
          <div className="relative z-10 flex flex-col items-center w-full">
            {/* Header */}
            <h2 className="font-display text-6xl tracking-wide mb-4 text-wedding-gold">
              {t('rsvp.heading')}
            </h2>
            <p className="font-serif italic text-base md:text-lg tracking-wide mb-12 text-stone-400">
              {t('rsvp.deadline')}
            </p>

            {/* View Router */}
            {view === 'search' && (
              <SearchScreen
                onFound={handleFound}
                onMultiple={(matches) => {
                  setCandidates(matches);
                  setView('select');
                }}
              />
            )}

            {view === 'select' && (
              <SelectScreen
                parties={candidates}
                onSelect={handleFound}
                onBack={reset}
              />
            )}

            {view === 'form' && party && (
              <FormScreen
                party={party}
                onSubmit={() => setView('success')}
                onBack={reset}
              />
            )}

            {view === 'success' && party && (
              <SuccessScreen
                partyName={party.party_name}
                onBack={reset}
              />
            )}

            {view === 'already_responded' && party && (
              <AlreadyRespondedScreen
                partyName={party.party_name}
                onBack={reset}
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
