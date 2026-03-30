import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface RSVPConfirmationProps {
  guests: { name: string; is_attending: boolean }[];
}

const PRAY_IMAGE_URL = 'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/prayforus.png';

export const RSVPConfirmation = ({ 
  guests = []
}: RSVPConfirmationProps) => {
  const attendingGuests = guests.filter(g => g.is_attending);
  const declinedGuests = guests.filter(g => !g.is_attending);

  return (
    <Html lang="en">
      <Head />
      <Preview>RSVP Confirmed — Yonatan &amp; Saron</Preview>

      <Body style={mainBody}>
        <Container style={mainContainer}>
          {/* ── Header ── */}
          <Text style={preHeader}>RSVP CONFIRMED</Text>

          {/* ── Framing ── */}
          <Hr style={hairline} />

          {/* ── Title ── */}
          <Text style={title}>We can&apos;t wait to celebrate with you.</Text>

          {/* ── Dynamic Guest List ── */}
          <Section style={guestListSection}>
            {attendingGuests.length > 0 && (
              <div style={guestGroup}>
                <Text style={guestStatusLabel}>ATTENDING</Text>
                {attendingGuests.map((g, i) => (
                  <Text key={i} style={guestName}>{g.name}</Text>
                ))}
              </div>
            )}
            
            {declinedGuests.length > 0 && (
              <div style={guestGroup}>
                <Text style={guestStatusLabelDeclined}>DECLINED</Text>
                {declinedGuests.map((g, i) => (
                  <Text key={i} style={guestNameDeclined}>{g.name}</Text>
                ))}
              </div>
            )}
          </Section>

          {/* ── Framing ── */}
          <Hr style={hairline} />

          {/* ── Message ── */}
          <Text style={messageText}>
            Thank you for confirming your attendance. We are currently preparing 
            your formal invitation suite, which will include the venue location, 
            day-of details, and our full weekend itinerary. We will reach out 
            to your party soon with these final details.
          </Text>

          {/* ── Prayer Request ── */}
          <Text style={prayerTitle}>THE PRAYER REQUEST</Text>
          <Text style={prayerText}>
            More than anything, as we prepare to enter into this marriage covenant, 
            our greatest request is your continued prayers. Please join us in 
            praying over our relationship, our future together, and the beautiful 
            day ahead.
          </Text>

          {/* ── Hero Image ── */}
          <Img
            src={PRAY_IMAGE_URL}
            alt="Praying over Yonatan and Saron"
            width="440"
            style={heroImage}
          />
          <Text style={caption}>
            Pastor Ashenafi praying over our upcoming marriage at our engagement celebration.
          </Text>

          {/* ── Monogram ── */}
          <Text style={monogram}>Y &amp; S</Text>

          {/* ── Footer ── */}
          <Text style={footer}>
            Yonatan &amp; Saron · September 4, 2026
            <br />
            (Please do not reply to this email)
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default RSVPConfirmation;

// ── Styles ────────────────────────────────────────────────────────────────────

const mainBody: React.CSSProperties = {
  backgroundColor: '#000000',
  margin: '0',
  padding: '40px 0',
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const mainContainer: React.CSSProperties = {
  maxWidth: '520px',
  margin: '0 auto',
  backgroundColor: '#0A0A0A',
  border: '1px solid #1A1A1A',
  padding: '60px 40px',
  textAlign: 'center',
};

const preHeader: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '10px',
  letterSpacing: '6px',
  textTransform: 'uppercase',
  margin: '0 0 10px',
};

const hairline: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #332911',
  margin: '30px auto',
  width: '40px',
};

const title: React.CSSProperties = {
  color: '#F9FAFB',
  fontSize: '32px',
  lineHeight: '1.2',
  margin: '0 0 40px',
  fontFamily: 'Georgia, serif',
  fontWeight: '400',
};

const guestListSection: React.CSSProperties = {
  margin: '0 0 40px',
};

const guestGroup: React.CSSProperties = {
  margin: '0 0 20px',
};

const guestStatusLabel: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '9px',
  letterSpacing: '3px',
  textTransform: 'uppercase',
  margin: '0 0 8px',
};

const guestStatusLabelDeclined: React.CSSProperties = {
  color: '#6B5D4F',
  fontSize: '9px',
  letterSpacing: '3px',
  textTransform: 'uppercase',
  margin: '0 0 8px',
};

const guestName: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: '18px',
  margin: '4px 0',
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
};

const guestNameDeclined: React.CSSProperties = {
  color: '#6B5D4F',
  fontSize: '16px',
  margin: '4px 0',
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  textDecoration: 'line-through',
};

const messageText: React.CSSProperties = {
  color: '#D1D5DB',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 auto 40px',
  maxWidth: '440px',
};

const prayerTitle: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '10px',
  letterSpacing: '4px',
  textTransform: 'uppercase',
  margin: '0 0 16px',
};

const prayerText: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: '15px',
  lineHeight: '1.6',
  fontStyle: 'italic',
  margin: '0 auto 40px',
  maxWidth: '400px',
  fontFamily: 'Georgia, serif',
};

const heroImage: React.CSSProperties = {
  width: '100%',
  maxWidth: '440px',
  height: 'auto',
  display: 'block',
  margin: '0 auto 12px',
  borderRadius: '8px',
};

const caption: React.CSSProperties = {
  fontFamily: "Georgia, serif",
  fontStyle: 'italic',
  fontSize: '12px',
  color: '#888888',
  textAlign: 'center',
  margin: '0 auto 40px',
  maxWidth: '400px',
};

const monogram: React.CSSProperties = {
  color: '#D4A845',
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  fontSize: '24px',
  marginTop: '60px',
  marginBottom: '20px',
};

const footer: React.CSSProperties = {
  color: '#3D3D3D',
  fontSize: '10px',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  margin: '0',
};
