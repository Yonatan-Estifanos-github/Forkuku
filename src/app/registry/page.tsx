'use client';

import Script from 'next/script';
import Section from '@/components/ui/Section';
import FadeIn from '@/components/ui/FadeIn';
import Link from 'next/link';

export default function RegistryPage() {
  return (
    <main className="min-h-screen bg-luxury-black">
      <Section className="py-20 px-4">
        {/* Back to home link */}
        <FadeIn className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-wedding-gold transition-colors font-serif text-sm"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </FadeIn>

        {/* Page heading */}
        <FadeIn delay={0.1}>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-wedding-gold text-center mb-4">
            Registry
          </h1>
          <p className="font-serif text-white/70 text-center max-w-xl mx-auto mb-12">
            Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, we have registered at Zola.
          </p>
        </FadeIn>

        {/* Zola Embed Container */}
        <FadeIn delay={0.2}>
          <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 md:p-8">
            <div
              className="zola-registry-embed"
              data-registry-key="saronandyonatan"
            />
          </div>
        </FadeIn>
      </Section>

      {/* Zola Widget Script - loads after page is interactive */}
      <Script
        src="https://widget.zola.com/js/widget.js"
        strategy="afterInteractive"
      />
    </main>
  );
}
