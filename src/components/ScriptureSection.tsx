'use client';

import FadeIn from '@/components/ui/FadeIn';

export default function ScriptureSection() {
  return (
    <section className="relative w-full min-h-[70vh] py-32 md:py-40 px-6 bg-stone-950 overflow-hidden">
      {/* God Ray — rotating conic gradient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] rounded-full opacity-40 blur-[100px] animate-spin-slow pointer-events-none"
        style={{
          background:
            'conic-gradient(from 90deg at 50% 50%, #0c0a09 0%, #451a03 50%, #0c0a09 100%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* Reference — above the verse */}
        <FadeIn>
          <p className="text-xs tracking-widest uppercase font-medium text-amber-600/80 mb-8">
            Psalm 118:24
          </p>
        </FadeIn>

        {/* English Verse — Primary */}
        <FadeIn delay={0.15}>
          <p className="font-display text-3xl md:text-5xl text-white leading-tight mb-8">
            &ldquo;This is the day that the Lord has made;
            <br />
            let us rejoice and be glad in it.&rdquo;
          </p>
        </FadeIn>

        {/* Golden divider */}
        <FadeIn delay={0.3}>
          <div className="w-12 h-px bg-amber-500 mx-auto mb-8" />
        </FadeIn>

        {/* Amharic Verse — Secondary */}
        <FadeIn delay={0.4}>
          <p className="font-serif text-xl md:text-2xl font-light text-stone-400 leading-relaxed">
            እግዚአብሔር የሠራች ቀን ይህች ናት፤
            <br />
            በእርስዋ ሐሴትን እናድርግ፥ ደስም ይበለን።
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
