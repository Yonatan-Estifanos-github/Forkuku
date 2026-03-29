'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function LegalPage() {
  const { t, language } = useLanguage();
  const am = language === 'am';

  return (
    <div className={`min-h-screen bg-[#0a0908] text-[#E6D2B5] font-serif selection:bg-[#D4A845]/30 p-6 md:p-12 ${am ? 'font-ethiopic' : ''}`}>
      <div className="max-w-3xl mx-auto space-y-16 py-12">

        {/* Header */}
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4A845]" />
            <span className={`text-[#D4A845] text-xs tracking-[0.3em] uppercase ${am ? 'normal-case tracking-normal' : ''}`}>
              {t('legal.compliance')}
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4A845]" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
            {t('legal.heading')}
          </h1>
          <p className={`text-[#E6D2B5]/40 font-sans text-sm tracking-widest uppercase ${am ? 'font-ethiopic normal-case tracking-normal' : ''}`}>
            {t('legal.lastUpdated')}
          </p>
        </header>

        {/* Section 1: Privacy Policy */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl border-b border-[#D4A845]/20 pb-4 text-[#D4A845]">
            {t('legal.privacyPolicy')}
          </h2>
          <div className={`space-y-6 text-[#E6D2B5]/80 leading-relaxed tracking-wide ${am ? 'font-ethiopic' : 'font-sans'}`}>
            <div>
              <h3 className={`text-[#E6D2B5] font-serif text-lg mb-2 ${am ? 'font-ethiopic not-italic' : 'italic'}`}>
                {t('legal.dataCollectionTitle')}
              </h3>
              <p>{t('legal.dataCollectionBody')}</p>
            </div>

            <div>
              <h3 className={`text-[#E6D2B5] font-serif text-lg mb-2 ${am ? 'font-ethiopic not-italic' : 'italic'}`}>
                {t('legal.useOfInfoTitle')}
              </h3>
              <p>{t('legal.useOfInfoBody')}</p>
            </div>

            <div className="bg-[#1a1815] p-6 border border-[#D4A845]/10 rounded-sm">
              <h3 className="text-[#D4A845] font-serif text-lg mb-2">
                {t('legal.mobilePrivacyTitle')}
              </h3>
              <p className="font-medium text-[#E6D2B5]">
                {t('legal.mobilePrivacyBody')}
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: SMS Terms */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl border-b border-[#D4A845]/20 pb-4 text-[#D4A845]">
            {t('legal.smsTerms')}
          </h2>
          <div className={`space-y-6 text-[#E6D2B5]/80 leading-relaxed tracking-wide ${am ? 'font-ethiopic' : 'font-sans'}`}>
            <p className={`text-[#E6D2B5] text-lg ${am ? 'font-ethiopic font-light' : 'font-serif italic'}`}>
              {t('legal.smsProgramName')}
            </p>
            <ol className="list-decimal list-outside space-y-4 pl-6">
              <li>{t('legal.smsItem1')}</li>
              <li>{t('legal.smsItem2')}</li>
              <li>{t('legal.smsItem3')}</li>
              <li>{t('legal.smsItem4')}</li>
              <li>{t('legal.smsItem5')}</li>
              <li>{t('legal.smsItem6')}</li>
          <h2 className="text-2xl md:text-3xl border-b border-[#D4A845]/20 pb-4 text-[#D4A845]">SMS Terms & Conditions</h2>
          <div className="space-y-6 font-sans text-[#E6D2B5]/80 leading-relaxed tracking-wide">
            <p className="text-[#E6D2B5] font-serif text-lg italic">&ldquo;Yonatan &amp; Saron Wedding Alerts&rdquo;</p>
            <ol className="list-decimal list-outside space-y-4 pl-6">
              <li>You will receive transactional updates regarding the Yonatan &amp; Saron wedding, including RSVP reminders, schedule changes, and future family announcements.</li>
              <li>You can cancel the SMS service at any time. Just text <strong className="text-white">STOP</strong> to the short code. After you send the SMS message <strong className="text-white">STOP</strong> to us, we will send you an SMS message to confirm that you have been unsubscribed. After this, you will no longer receive SMS messages from us. If you want to join again, just sign up as you did the first time and we will start sending SMS messages to you again.</li>
              <li>If you are experiencing issues with the messaging program you can reply with the keyword <strong className="text-white">HELP</strong> for more assistance, or you can get help directly at theestifanos@gmail.com.</li>
              <li>Carriers are not liable for delayed or undelivered messages.</li>
              <li>As always, message and data rates may apply for any messages sent to you from us and to us from you. Message frequency varies. If you have any questions about your text plan or data plan, it is best to contact your wireless provider.</li>
              <li>If you have any questions regarding privacy, please read our privacy policy above.</li>
            </ol>
          </div>
        </section>

        {/* Footer Link */}
        <footer className="pt-12 text-center">
          <Link
            href="/"
            className={`text-xs uppercase tracking-widest text-[#D4A845]/60 hover:text-[#D4A845] transition-colors duration-300 ${am ? 'font-ethiopic normal-case tracking-normal text-base' : ''}`}
          >
            {t('legal.backToInvitation')}
          </Link>
        </footer>
      </div>
    </div>
  );
}
