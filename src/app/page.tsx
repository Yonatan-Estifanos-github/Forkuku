import Hero from '@/components/Hero';
import ScriptureSection from '@/components/ScriptureSection';
import Rsvp from '@/components/Rsvp';
import GoogleEarthVideo from '@/components/GoogleEarthVideo';
import JourneyGallery from '@/components/journey/JourneyGallery';
import Section from '@/components/ui/Section';
import Footer from '@/components/Footer';

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

      <Section id="rsvp">
        <Rsvp />
      </Section>

      <Section id="scripture">
        <ScriptureSection />
      </Section>

      <Footer />
    </main>
  );
}
