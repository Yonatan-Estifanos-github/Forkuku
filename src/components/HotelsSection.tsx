'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useNavView } from '@/context/ViewContext';
import FadeIn from '@/components/ui/FadeIn';

interface Hotel {
  key: 'hilton' | 'yorktowne' | 'hampton';
  url: string;
}

const HOTELS: Hotel[] = [
  { key: 'hilton', url: 'https://www.hilton.com/en/hotels/mdthhhf-hilton-harrisburg/' },
  { key: 'yorktowne', url: 'https://yorktowne.com/' },
  { key: 'hampton', url: 'https://www.hilton.com/en/hotels/yrkpahx-hampton-york/' },
];

export default function HotelsSection() {
  const { activeView } = useNavView();
  const { t, language } = useLanguage();
  const isAmharic = language === 'am';

  if (activeView !== 'final-invite') return null;

  return (
    <div className="py-24 px-6">
      <FadeIn>
        <h2 className={`text-4xl md:text-5xl lg:text-6xl text-wedding-gold text-center mb-4 ${isAmharic ? 'font-ethiopic font-light' : 'font-serif'}`}>
          {t('hotels.heading')}
        </h2>
        <p className={`text-center max-w-xl mx-auto mb-14 ${isAmharic ? 'font-ethiopic text-ink/80' : 'font-serif text-ink/70'}`}>
          {t('hotels.description')}
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {HOTELS.map(({ key, url }) => (
            <div
              key={key}
              className="flex flex-col border border-hairline bg-surface-alt rounded-xl p-6 text-center"
            >
              <p className={`text-xs tracking-widest uppercase text-accent/70 mb-3 ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans'}`}>
                {t(`hotels.${key}.note`)}
              </p>
              <h3 className={`text-2xl text-ink-heading mb-3 ${isAmharic ? 'font-ethiopic font-light' : 'font-serif'}`}>
                {t(`hotels.${key}.name`)}
              </h3>
              <div className="w-8 h-[1px] bg-wedding-gold/40 mx-auto mb-4" />
              <p className={`text-sm text-ink/60 mb-6 leading-relaxed ${isAmharic ? 'font-ethiopic' : 'font-sans'}`}>
                {t(`hotels.${key}.address`)}
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-auto border border-accent text-accent bg-transparent hover:bg-accent/10 px-8 py-2.5 rounded-full text-[10px] tracking-widest uppercase transition-all duration-300 ${isAmharic ? 'font-ethiopic normal-case tracking-normal' : 'font-sans'}`}
              >
                {t('hotels.viewHotel')}
              </a>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
