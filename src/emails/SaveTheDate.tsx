import {
  Body,
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

        {/* ── Date Line ── */}
        <Text style={dateLine}>
          SEPTEMBER 4, 2026
        </Text>

        {/* ── Location Line ── */}
        <Text style={locationLine}>
          WRIGHTSVILLE, PENNSYLVANIA
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
      </Body>
    </Html>
  );
};

export default SaveTheDate;

// ── Styles ────────────────────────────────────────────────────────────────────

const mainBody: React.CSSProperties = {
  backgroundColor: '#FCFBF8',
  margin: '0 auto',
  padding: '60px 20px',
  textAlign: 'center',
  fontFamily: "Georgia, 'Times New Roman', serif",
  maxWidth: '600px', // Soft constraint for readability, but not a nested table container
};

const preHeader: React.CSSProperties = {
  color: '#B08D57',
  fontSize: '10px',
  letterSpacing: '6px',
  textTransform: 'uppercase',
  margin: '0 0 10px',
  fontFamily: "Georgia, 'Times New Roman', serif",
};

const hairline: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #D6D4D1',
  margin: '30px auto',
  width: '48px',
};

const names: React.CSSProperties = {
  color: '#423E37',
  fontSize: '48px',
  lineHeight: '1.1',
  margin: '0 0 20px',
  fontFamily: "'Playfair Display', Didot, Georgia, serif",
  fontWeight: '400',
  fontStyle: 'normal',
};

const ampersand: React.CSSProperties = {
  color: '#B08D57',
  fontSize: '0.7em',
  fontStyle: 'italic',
  fontFamily: "Georgia, 'Times New Roman', serif",
};

const dateLine: React.CSSProperties = {
  color: '#B08D57',
  fontSize: '11px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  margin: '0 0 8px',
  whiteSpace: 'nowrap',
  fontFamily: "Georgia, 'Times New Roman', serif",
};

const locationLine: React.CSSProperties = {
  color: '#888888',
  fontSize: '11px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  margin: '0 0 10px',
  whiteSpace: 'nowrap',
  fontFamily: "Georgia, 'Times New Roman', serif",
};

const salutation: React.CSSProperties = {
  color: '#423E37',
  fontSize: '16px',
  margin: '0 0 16px',
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontStyle: 'italic',
};

const message: React.CSSProperties = {
  color: '#5A544C',
  fontSize: '14px',
  lineHeight: '1.8',
  margin: '0 auto 30px',
  textAlign: 'center',
  maxWidth: '440px',
  fontFamily: "Georgia, 'Times New Roman', serif",
};

const passwordText: React.CSSProperties = {
  color: '#B08D57',
  fontSize: '13px',
  fontStyle: 'italic',
  margin: '0 0 40px',
  fontFamily: "Georgia, 'Times New Roman', serif",
};

const ctaSection: React.CSSProperties = {
  margin: '0 0 60px',
};

const ctaButton: React.CSSProperties = {
  border: '1px solid #B08D57',
  color: '#B08D57',
  padding: '14px 40px',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  fontSize: '10px',
  textDecoration: 'none',
  display: 'inline-block',
  borderRadius: '100px',
  fontFamily: "Georgia, 'Times New Roman', serif",
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
  color: '#B08D57',
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontStyle: 'italic',
  fontSize: '24px',
  marginTop: '60px',
  marginBottom: '20px',
};

const footer: React.CSSProperties = {
  color: '#A1A1AA',
  fontSize: '10px',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  margin: '0',
  fontFamily: "Georgia, 'Times New Roman', serif",
};
