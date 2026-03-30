import {
  Body,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface RSVPConfirmationProps {
  guests: { name: string; is_attending: boolean }[];
}

const PRAY_IMAGE_URL = 'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/prayforus.JPG';

export const RSVPConfirmation = ({ 
  guests = []
}: RSVPConfirmationProps) => {
  const attendingGuests = guests.filter(g => g.is_attending);

  return (
    <Html lang="en">
      <Head />
      <Preview>RSVP Confirmed — Yonatan &amp; Saron</Preview>

      <Body style={mainBody}>
        {/* ── 1. Pre-header ── */}
        <Text style={preHeader}>RSVP CONFIRMED</Text>

        {/* ── 2. Main Title ── */}
        <Text style={mainTitle}>We can&apos;t wait to celebrate with you.</Text>

        {/* ── 3. Main Body Paragraph ── */}
        <Text style={bodyParagraph}>
          Thank you for confirming your attendance. We are currently preparing 
          your formal invitation suite, which will include the venue location, 
          day-of details, and our full weekend itinerary. We will reach out 
          to your party soon with these final details.
        </Text>

        {/* ── 4. Guest List Section ── */}
        {attendingGuests.length > 0 && (
          <Section style={guestListSection}>
            <Text style={attendingHeader}>ATTENDING</Text>
            {attendingGuests.map((g, i) => (
              <Text key={i} style={guestName}>{g.name}</Text>
            ))}
          </Section>
        )}

        {/* ── 5. The Prayer Request ── */}
        <Section style={prayerSection}>
          <Text style={prayerHeader}>THE PRAYER REQUEST</Text>
          <Text style={prayerBody}>
            More than anything, as we prepare to enter into this marriage covenant, 
            our greatest request is your continued prayers. Please join us in 
            praying over our relationship, our future together, and the beautiful 
            day ahead.
          </Text>
        </Section>

        {/* ── 6. Image & Caption ── */}
        <Img
          src={PRAY_IMAGE_URL}
          alt="Yonatan and Saron"
          width="500"
          style={heroImage}
        />
        <Text style={caption}>
          Pastor Ashenafi praying over our upcoming marriage at our engagement celebration.
        </Text>

        {/* ── 7. Footer ── */}
        <Section style={footerSection}>
          <Text style={monogram}>Y &amp; S</Text>
          <Text style={footerNames}>
            Yonatan &amp; Saron · September 4, 2026
          </Text>
          <Text style={noReplyNote}>
            (Please do not reply to this email)
          </Text>
        </Section>
      </Body>
    </Html>
  );
};

export default RSVPConfirmation;

// ── Styles ────────────────────────────────────────────────────────────────────

const mainBody: React.CSSProperties = {
  backgroundColor: '#0A0A0A',
  margin: '0 auto',
  padding: '60px 20px',
  textAlign: 'center',
  maxWidth: '600px',
};

const preHeader: React.CSSProperties = {
  color: '#A3A3A3',
  fontSize: '10px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  textAlign: 'center',
  margin: '0 0 24px',
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const mainTitle: React.CSSProperties = {
  color: '#D4A845',
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: '28px',
  textAlign: 'center',
  margin: '0 0 32px',
  fontWeight: 'normal',
};

const bodyParagraph: React.CSSProperties = {
  color: '#E5E5E5',
  fontFamily: 'Georgia, serif',
  fontSize: '14px',
  lineHeight: '1.8',
  textAlign: 'center',
  maxWidth: '500px',
  margin: '0 auto 40px auto',
};

const guestListSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '0 0 40px',
};

const attendingHeader: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '10px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  textAlign: 'center',
  margin: '0 0 16px',
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const guestName: React.CSSProperties = {
  color: '#FFFFFF',
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: '18px',
  textAlign: 'center',
  lineHeight: '1.6',
  margin: '0 0 8px',
};

const prayerSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '0 0 40px',
};

const prayerHeader: React.CSSProperties = {
  color: '#A3A3A3',
  fontSize: '10px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  textAlign: 'center',
  margin: '0 0 16px',
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const prayerBody: React.CSSProperties = {
  color: '#E5E5E5',
  fontFamily: 'Georgia, serif',
  fontSize: '14px',
  fontStyle: 'italic',
  lineHeight: '1.8',
  textAlign: 'center',
  maxWidth: '500px',
  margin: '0 auto',
};

const heroImage: React.CSSProperties = {
  borderRadius: '4px',
  width: '100%',
  maxWidth: '500px',
  margin: '0 auto',
  display: 'block',
};

const caption: React.CSSProperties = {
  color: '#888888',
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSize: '11px',
  textAlign: 'center',
  marginTop: '12px',
  marginBottom: '48px',
  fontStyle: 'italic',
};

const footerSection: React.CSSProperties = {
  textAlign: 'center',
};

const monogram: React.CSSProperties = {
  color: '#D4A845',
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: '24px',
  textAlign: 'center',
  margin: '0 0 16px',
};

const footerNames: React.CSSProperties = {
  color: '#888888',
  fontSize: '10px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  textAlign: 'center',
  margin: '0 0 8px',
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const noReplyNote: React.CSSProperties = {
  color: '#555555',
  fontSize: '10px',
  textAlign: 'center',
  margin: '0',
  fontFamily: 'Helvetica, Arial, sans-serif',
};
