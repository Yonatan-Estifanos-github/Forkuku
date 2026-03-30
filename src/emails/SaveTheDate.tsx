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
  Link,
} from '@react-email/components';
import * as React from 'react';

interface SaveTheDateProps {
  guestName?: string;
  partyId?: string;
}

const BASE_URL = 'https://theestifanos.com';
const PWD = 'Matthew19:6';
const PHOTO_URL = 'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/engagement_photo_3.jpeg';

export const SaveTheDate = ({ 
  guestName = 'Dear Friend',
  partyId
}: SaveTheDateProps) => {
  const magicLink = partyId 
    ? `${BASE_URL}/?pwd=${PWD}&partyId=${partyId}`
    : `${BASE_URL}/?pwd=${PWD}`;

  return (
    <Html lang="en">
      <Head />
      <Preview>Save the Date — Yonatan &amp; Saron · September 4, 2026</Preview>

      <Body style={mainBody}>
        <Container style={mainContainer}>
          {/* ── Pre-header ── */}
          <Text style={preHeader}>SAVE THE DATE</Text>

          {/* ── Framing ── */}
          <Hr style={hairline} />

          {/* ── Stacked Names ── */}
          <Text style={names}>
            Yonatan
            <br />
            <span style={ampersand}>&amp;</span>
            <br />
            Saron
          </Text>

          {/* ── Date & Location ── */}
          <Text style={details}>
            SEPTEMBER 4, 2026&nbsp;&nbsp;·&nbsp;&nbsp;WRIGHTSVILLE, PA
          </Text>

          {/* ── Framing ── */}
          <Hr style={hairline} />

          {/* ── Salutation ── */}
          <Text style={salutation}>{guestName},</Text>

          {/* ── Main Message ── */}
          <Text style={message}>
            We are overjoyed to invite you to celebrate the beginning of our forever. 
            God has been so faithful in bringing us together, and we couldn&apos;t imagine 
            stepping into this marriage covenant without our favorite people in the room. 
            To receive your formal invitation with the exact location and weekend details, 
            please register your attendance on our website by May 1st.
          </Text>

          {/* ── Password Notice ── */}
          <Text style={passwordText}>
            Website Password: Matthew19:6
          </Text>

          {/* ── CTA ── */}
          <Section style={ctaSection}>
            <Link href={magicLink} style={ctaButton}>
              RSVP NOW
            </Link>
          </Section>

          {/* ── Hero Photo ── */}
          <Img
            src={PHOTO_URL}
            alt="Yonatan and Saron"
            width="440"
            style={photo}
          />

          {/* ── Monogram ── */}
          <Text style={monogram}>Y &amp; S</Text>

          {/* ── Legal/Footer ── */}
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

export default SaveTheDate;

// ── Styles ────────────────────────────────────────────────────────────────────

const mainBody: React.CSSProperties = {
  backgroundColor: '#0A0A0A',
  margin: '0',
  padding: '0',
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const mainContainer: React.CSSProperties = {
  margin: '0 auto',
  padding: '60px 20px',
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

const names: React.CSSProperties = {
  color: '#F9FAFB',
  fontSize: '48px',
  lineHeight: '1.1',
  margin: '0 0 20px',
  fontFamily: "Georgia, serif",
  fontWeight: '400',
};

const ampersand: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '0.7em',
};

const details: React.CSSProperties = {
  color: '#A1A1AA',
  fontSize: '11px',
  letterSpacing: '3px',
  textTransform: 'uppercase',
  margin: '0 0 10px',
};

const salutation: React.CSSProperties = {
  color: '#F9FAFB',
  fontSize: '16px',
  margin: '0 0 16px',
  fontFamily: "Georgia, serif",
};

const message: React.CSSProperties = {
  color: '#D1D5DB',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 auto 30px',
  textAlign: 'center',
  maxWidth: '440px',
};

const passwordText: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '13px',
  fontStyle: 'italic',
  margin: '0 0 40px',
  fontFamily: "Georgia, serif",
};

const ctaSection: React.CSSProperties = {
  margin: '0 0 60px',
};

const ctaButton: React.CSSProperties = {
  border: '1px solid #D4A845',
  color: '#D4A845',
  padding: '14px 40px',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  fontSize: '10px',
  textDecoration: 'none',
  display: 'inline-block',
  borderRadius: '100px',
};

const photo: React.CSSProperties = {
  width: '100%',
  maxWidth: '440px',
  height: 'auto',
  display: 'block',
  margin: '0 auto',
  borderRadius: '2px',
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
