'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// TYPES
// ============================================================================
interface Guest {
  id: number;
  name: string;
  is_attending: boolean;
  is_plus_one: boolean;
}

interface Party {
  id: number;
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
      <label htmlFor={id} className="text-xs tracking-widest uppercase font-medium text-amber-500/80">
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
      <label htmlFor={id} className="text-xs tracking-widest uppercase font-medium text-amber-500/80">
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
  'px-10 py-4 font-medium text-sm tracking-widest uppercase transition-all duration-300 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded shadow-lg shadow-amber-900/20 disabled:opacity-50 disabled:cursor-not-allowed';

// ============================================================================
// SEARCH SCREEN
// ============================================================================
function SearchScreen({ onFound }: { onFound: (party: Party) => void }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!query.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/rsvp/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: query }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Search failed');
      }

      onFound(data);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "We couldn't find your invitation. Please try a different spelling or contact the couple.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg text-center">
      <p className="font-serif text-base md:text-lg mb-10 leading-relaxed px-4 text-stone-400">
        Please enter the first and last name of one member of your party below.
        If you&apos;re responding for you and a guest (or your family), you&apos;ll
        be able to RSVP for your entire group on the next page.
      </p>

      <form onSubmit={handleSearch} className="flex flex-col gap-6">
        <div className="text-left">
          <LuxuryInput
            label="First and Last Name"
            id="search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            placeholder="Ex. Sarah Fortune"
          />
        </div>

        {error && (
          <p className="text-sm font-serif italic text-left text-red-500">
            {error}
          </p>
        )}

        <button type="submit" disabled={isLoading} className={btnClass}>
          {isLoading ? 'Searching...' : 'Find My Invitation'}
        </button>
      </form>
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

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
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      onSubmit();
    } catch (err: unknown) {
      console.error('RSVP Submit Error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to submit RSVP. Please try again.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
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
        Search Again
      </button>

      {/* Welcome Header */}
      <div className="text-center mb-10">
        <p className="text-xs tracking-widest uppercase mb-2 text-amber-500/80">
          You&apos;re Invited
        </p>
        <h3 className="font-display text-3xl md:text-4xl tracking-wide text-stone-200">
          Welcome, {party.party_name}!
        </h3>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Guest List */}
        <div className="mb-10">
          <p className="text-xs tracking-widest uppercase font-medium text-amber-500/80 mb-6">
            Please respond for each guest
          </p>

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
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-600 shadow-lg shadow-amber-900/20'
                          : 'bg-transparent border-stone-700 text-stone-400 hover:border-amber-500/50'
                      }`}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleGuest(idx, false)}
                      className={`px-4 py-2 text-xs tracking-widest uppercase border rounded-full transition-all duration-300 ${
                        !guest.is_attending
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-600 shadow-lg shadow-amber-900/20'
                          : 'bg-transparent border-stone-700 text-stone-400 hover:border-amber-500/50'
                      }`}
                    >
                      Decline
                    </button>
                  </div>
                </div>

                {/* Edit Plus One Name */}
                {guest.is_plus_one && (
                  <div className="luxury-input relative">
                    <input
                      type="text"
                      placeholder="Guest Full Name"
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
            label="Email Address"
            id="email"
            type="email"
            value={contact.email}
            onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
            required
            placeholder="your@email.com"
          />
          <LuxuryInput
            label="Phone Number"
            id="phone"
            type="tel"
            value={contact.phone}
            onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
            required
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Message */}
        <div className="mb-10">
          <LuxuryTextarea
            label="Note to the Couple (Optional)"
            id="message"
            value={contact.message}
            onChange={(e) => setContact((p) => ({ ...p, message: e.target.value }))}
            rows={3}
            placeholder="Share a message or well-wishes..."
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
          <button type="submit" disabled={isSubmitting} className={btnClass}>
            {isSubmitting ? 'Sending...' : 'Submit RSVP'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// SUCCESS SCREEN
// ============================================================================
function SuccessScreen({ partyName }: { partyName: string }) {
  return (
    <div className="text-center max-w-md">
      {/* Checkmark icon */}
      <div className="w-20 h-20 rounded-full border border-amber-500/30 flex items-center justify-center mx-auto mb-8">
        <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Thank you message */}
      <h3 className="font-display text-3xl md:text-4xl mb-4 text-stone-200">
        Thank You!
      </h3>
      <p className="font-serif text-lg italic leading-relaxed text-stone-400">
        {partyName}, your response has been recorded.
        <br />
        We look forward to celebrating with you!
      </p>

      {/* Registry note */}
      <div className="mt-10 pt-8 border-t border-white/10">
        <p className="font-serif text-base leading-relaxed text-stone-400 mb-6">
          Your presence at our celebration means the world to us and is truly all we need.
          For those who have kindly asked about gifts, we&apos;ve put together a{' '}
          <span className="text-wedding-gold">registry</span> to help with coordination.
        </p>

        {/* Registry button - luxury gold-bordered style */}
        <a
          href="/registry"
          className="inline-block px-8 py-3 font-medium text-sm tracking-widest uppercase transition-all duration-300 border border-amber-500/50 text-amber-500 rounded hover:bg-amber-500/10 hover:border-amber-500"
        >
          View Registry
        </a>
      </div>
    </div>
  );
}

// ============================================================================
// ALREADY RESPONDED SCREEN
// ============================================================================
function AlreadyRespondedScreen({ partyName }: { partyName: string }) {
  return (
    <div className="text-center max-w-md">
      <div className="w-20 h-20 rounded-full border border-amber-500/30 flex items-center justify-center mx-auto mb-8">
        <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h3 className="font-display text-3xl md:text-4xl mb-4 text-stone-200">
        Already Responded
      </h3>
      <p className="font-serif text-lg italic leading-relaxed text-stone-400">
        {partyName}, we&apos;ve already received your RSVP.
        <br />
        Thank you for confirming!
      </p>

      {/* Registry note */}
      <div className="mt-10 pt-8 border-t border-white/10">
        <p className="font-serif text-base leading-relaxed text-stone-400 mb-6">
          If you need to make changes to your response, please contact us directly.
        </p>

        <a
          href="/registry"
          className="inline-block px-8 py-3 font-medium text-sm tracking-widest uppercase transition-all duration-300 border border-amber-500/50 text-amber-500 rounded hover:bg-amber-500/10 hover:border-amber-500"
        >
          View Registry
        </a>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
type View = 'search' | 'form' | 'success' | 'already_responded';

export default function Rsvp() {
  const [view, setView] = useState<View>('search');
  const [party, setParty] = useState<Party | null>(null);

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
            <h2 className="font-display text-6xl tracking-wide mb-4 text-amber-500">
              RSVP
            </h2>
            <p className="font-serif italic text-base md:text-lg tracking-wide mb-12 text-stone-400">
              Kindly reply by March 1st
            </p>

            {/* View Router */}
            {view === 'search' && (
              <SearchScreen
                onFound={(p) => {
                  setParty(p);
                  if (p.has_responded) {
                    setView('already_responded');
                  } else {
                    setView('form');
                  }
                }}
              />
            )}

            {view === 'form' && party && (
              <FormScreen
                party={party}
                onSubmit={() => setView('success')}
                onBack={() => {
                  setView('search');
                  setParty(null);
                }}
              />
            )}

            {view === 'success' && party && (
              <SuccessScreen partyName={party.party_name} />
            )}

            {view === 'already_responded' && party && (
              <AlreadyRespondedScreen partyName={party.party_name} />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
