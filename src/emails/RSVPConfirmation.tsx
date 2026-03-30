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

const PRAY_IMAGE_URL = 'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/prayforus.JPG';

export const RSVPConfirmation = ({ 
  guests = []
}: RSVPConfirmationProps) => {
  const attendingGuests = guests.filter(g => g.is_attending);
  const declinedGuests = guests.filter(g => !g.is_attending);

  return (
    <Html lang="en">
      <Head />
      <Preview>RSVP Confirmed — Yonatan &amp; Saron</Preview>

      <Body style={body}>
        <Container style={container}>

          {/* ── Header ── */}
          <Text style={headerLabel}>RSVP CONFIRMED</Text>

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

          {/* ── The Message ── */}
          <Text style={messageText}>
            Thank you for confirming your attendance. We are currently preparing your formal invitation suite, which will include the venue location, day-of details, and our full weekend itinerary. We will reach out to your party soon with these final details.
          </Text>

          {/* ── The Prayer Request ── */}
          <Hr style={rule} />
          <Text style={prayerTitle}>THE PRAYER REQUEST</Text>
          <Text style={prayerText}>
            More than anything, as we prepare to enter into this marriage covenant, our greatest request is your continued prayers. Please join us in praying over our relationship, our future together, and the beautiful day ahead.
          </Text>

          {/* ── Hero Image ── */}
          <Img
            src={PRAY_IMAGE_URL}
            alt="Praying over Yonatan and Saron"
            width="536"
            style={heroImage}
          />
          <Text style={caption}>
            Pastor Ashenafi praying over our upcoming marriage at our engagement celebration.
          </Text>

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

const body: React.CSSProperties = {
  backgroundColor: '#0A0908',
  margin: '0',
  padding: '0',
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const container: React.CSSProperties = {
  margin: '0 auto',
  padding: '64px 32px',
  maxWidth: '600px',
  textAlign: 'center',
  backgroundColor: '#0A0908',
};

const headerLabel: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '11px',
  letterSpacing: '6px',
  textTransform: 'uppercase',
  margin: '0 0 24px',
  textAlign: 'center',
};

const title: React.CSSProperties = {
  color: '#E6D2B5',
  fontSize: '32px',
  lineHeight: '1.2',
  margin: '0 0 40px',
  textAlign: 'center',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontWeight: '400',
};

const guestListSection: React.CSSProperties = {
  margin: '0 0 40px',
  textAlign: 'center',
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
  opacity: 0.8,
};

const guestStatusLabelDeclined: React.CSSProperties = {
  color: '#9C8C78',
  fontSize: '9px',
  letterSpacing: '3px',
  textTransform: 'uppercase',
  margin: '0 0 8px',
  opacity: 0.6,
};

const guestName: React.CSSProperties = {
  color: '#E6D2B5',
  fontSize: '18px',
  margin: '4px 0',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontStyle: 'italic',
};

const guestNameDeclined: React.CSSProperties = {
  color: '#6B5D4F',
  fontSize: '16px',
  margin: '4px 0',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontStyle: 'italic',
  textDecoration: 'line-through',
};

const messageText: React.CSSProperties = {
  color: '#9C8C78',
  fontSize: '15px',
  lineHeight: '1.8',
  margin: '0 auto 48px',
  textAlign: 'center',
  maxWidth: '480px',
};

const rule: React.CSSProperties = {
  borderColor: '#D4A845',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  opacity: 0.2,
  margin: '0 auto 40px',
  width: '60px',
};

const prayerTitle: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '11px',
  letterSpacing: '4px',
  textTransform: 'uppercase',
  margin: '0 0 16px',
};

const prayerText: React.CSSProperties = {
  color: '#E6D2B5',
  fontSize: '16px',
  lineHeight: '1.6',
  fontStyle: 'italic',
  margin: '0 auto 40px',
  textAlign: 'center',
  maxWidth: '440px',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
};

const heroImage: React.CSSProperties = {
  width: '100%',
  maxWidth: '600px',
  height: 'auto',
  display: 'block',
  margin: '0 auto 12px',
  borderRadius: '8px',
};

const caption: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontStyle: 'italic',
  fontSize: '12px',
  color: '#888888',
  textAlign: 'center',
  margin: '0 auto 40px',
  maxWidth: '440px',
};

const footer: React.CSSProperties = {
  color: '#3D342C',
  fontSize: '10px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  margin: '40px 0 0',
};
