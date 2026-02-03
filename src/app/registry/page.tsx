'use client';

import { useState } from 'react';
import Script from 'next/script';
import Section from '@/components/ui/Section';
import FadeIn from '@/components/ui/FadeIn';
import Link from 'next/link';

export default function RegistryPage() {
  const [scriptStatus, setScriptStatus] = useState<'loading' | 'ready' | 'error'>('loading');

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
            {/* Loading state */}
            {scriptStatus === 'loading' && (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-2 border-wedding-gold/30 border-t-wedding-gold rounded-full animate-spin mb-4" />
                <p className="font-serif text-white/50">Loading registry...</p>
              </div>
            )}

            {/* Error fallback */}
            {scriptStatus === 'error' && (
              <div className="text-center py-12">
                <p className="font-serif text-white/70 mb-6">
                  Unable to load the registry widget. Please visit our registry directly:
                </p>
                <a
                  href="https://www.zola.com/registry/saronandyonatan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 font-medium text-sm tracking-widest uppercase transition-all duration-300 border border-amber-500/50 text-amber-500 rounded hover:bg-amber-500/10 hover:border-amber-500"
                >
                  View Registry on Zola
                </a>
              </div>
            )}

            {/* Zola embed - hidden until loaded */}
            <div
              className={`zola-registry-embed ${scriptStatus !== 'ready' ? 'hidden' : ''}`}
              data-registry-key="saronandyonatan"
            />
          </div>
        </FadeIn>
      </Section>

      {/* Zola Widget Script - loads after page is interactive */}
      <Script
        src="https://widget.zola.com/js/widget.js"
        strategy="afterInteractive"
        onLoad={() => setScriptStatus('ready')}
        onError={() => setScriptStatus('error')}
      />
    </main>
  );
}
