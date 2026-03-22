import Hero from '@/components/Hero';
import ScriptureSection from '@/components/ScriptureSection';
import Rsvp from '@/components/Rsvp';
import GoogleEarthVideo from '@/components/GoogleEarthVideo';
import JourneyGallery from '@/components/journey/JourneyGallery';
import WeddingPartySection from '@/components/WeddingPartySection';
import Section from '@/components/ui/Section';
import Footer from '@/components/Footer';
import RegistrySection from '@/components/RegistrySection';

export default function Home() {
  return (
    <main>
      <Section id="home">
        <Hero />
      </Section>

      <JourneyGallery />

      <Section id="venue">
        <GoogleEarthVideo />
      </Section>

      <WeddingPartySection />

      <Section id="rsvp">
        <Rsvp />
      </Section>

      <Section id="registry">
        <RegistrySection />
      </Section>

      <Section id="scripture">
        <ScriptureSection />
      </Section>

      <Footer />
    </main>
  );
}
