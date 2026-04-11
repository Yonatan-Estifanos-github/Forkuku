import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'SMS Program Review — Yonatan & Saron Wedding',
  description: 'Carrier and compliance review page for the Yonatan & Saron wedding SMS opt-in program.',
  robots: 'noindex',
};

export default function SmsOptinInfoPage() {
  return (
    <div className="min-h-screen bg-[#0a0908] text-[#E6D2B5] font-serif selection:bg-[#D4A845]/30 p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-16 py-12">

        {/* Header */}
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4A845]" />
            <span className="text-[#D4A845] text-xs tracking-[0.3em] uppercase">
              Compliance Review
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4A845]" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">
            Yonatan &amp; Saron Wedding SMS Program Review
          </h1>
        </header>

        {/* Intro */}
        <section>
          <p className="font-sans text-[#E6D2B5]/80 leading-relaxed tracking-wide text-lg">
            This page is provided for carrier and compliance review of our SMS opt-in process.
            Confirmed guests of the Yonatan &amp; Saron wedding may optionally consent to receive
            wedding-related text messages during the RSVP process.
          </p>
        </section>

        {/* How guests opt in */}
        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl border-b border-[#D4A845]/20 pb-4 text-[#D4A845]">
            How guests opt in
          </h2>
          <p className="font-sans text-[#E6D2B5]/80 leading-relaxed tracking-wide">
            Guests opt in when submitting their RSVP on our wedding website. On the RSVP form,
            users may optionally enter a mobile phone number and manually check a separate SMS
            consent box that is unchecked by default. The consent box is not required to submit
            an RSVP.
          </p>
        </section>

        {/* Consent language */}
        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl border-b border-[#D4A845]/20 pb-4 text-[#D4A845]">
            Consent language shown on the RSVP form
          </h2>
          <div className="bg-[#1a1815] border border-[#D4A845]/30 rounded-sm p-6 font-sans text-[#E6D2B5] leading-relaxed">
            &ldquo;I consent to receive wedding-related text messages regarding the Yonatan &amp; Saron
            wedding, including RSVP reminders and day-of updates. Message frequency varies.
            Msg &amp; data rates may apply. Reply HELP for help, STOP to opt out. Read our
            Privacy Policy &amp; Terms.&rdquo;
          </div>
        </section>

        {/* Screenshot */}
        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl border-b border-[#D4A845]/20 pb-4 text-[#D4A845]">
            Public proof of opt-in form
          </h2>
          <p className="font-sans text-[#E6D2B5]/80 leading-relaxed tracking-wide">
            The screenshot below shows the SMS consent checkbox as it appears on the RSVP form.
          </p>
          <div className="border border-[#D4A845]/20 rounded-sm overflow-hidden">
            <Image
              src="/sms-opt-in-proof.jpg"
              alt="Screenshot of the SMS opt-in checkbox on the RSVP form"
              width={900}
              height={600}
              className="w-full h-auto"
              unoptimized
            />
          </div>
          <p className="font-sans text-sm">
            <a
              href="/sms-opt-in-proof.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4A845] hover:underline"
            >
              View full-size image &rarr;
            </a>
          </p>
        </section>

        {/* Privacy Policy */}
        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl border-b border-[#D4A845]/20 pb-4 text-[#D4A845]">
            Privacy Policy and Terms
          </h2>
          <p className="font-sans text-[#E6D2B5]/80 leading-relaxed tracking-wide">
            Our full privacy policy and SMS terms are available at:
          </p>
          <Link
            href="/legal"
            className="inline-block text-[#D4A845] font-sans hover:underline"
          >
            theestifanos.com/legal &rarr;
          </Link>
        </section>

        {/* Additional note */}
        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl border-b border-[#D4A845]/20 pb-4 text-[#D4A845]">
            Additional note
          </h2>
          <p className="font-sans text-[#E6D2B5]/80 leading-relaxed tracking-wide">
            The live RSVP flow is accessible only to invited guests. This page is provided so
            reviewers can verify the messaging program and consent flow without authentication.
          </p>
        </section>

        {/* Footer */}
        <footer className="pt-12 text-center">
          <Link
            href="/"
            className="text-xs uppercase tracking-widest text-[#D4A845]/60 hover:text-[#D4A845] transition-colors duration-300"
          >
            Back to invitation
          </Link>
        </footer>

      </div>
    </div>
  );
}
