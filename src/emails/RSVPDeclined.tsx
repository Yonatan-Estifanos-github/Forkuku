import {
  Body,
  Button,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface RSVPDeclinedProps {
  partyId?: string;
}

const BASE_URL = 'https://theestifanos.com';
const PWD = 'Matthew19:6';
const PRAY_IMAGE_URL = 'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/prayforus.JPG';

export const RSVPDeclined = ({ 
  partyId
}: RSVPDeclinedProps) => {
  const magicLink = partyId 
    ? `${BASE_URL}/?pwd=${PWD}&partyId=${partyId}`
    : `${BASE_URL}/?pwd=${PWD}`;

  return (
    <Html lang="en">
      <Head />
      <Preview>RSVP Received — Yonatan &amp; Saron</Preview>

      <Body style={mainBody}>
        {/* ── Header ── */}
        <Text style={preHeader}>RSVP RECEIVED</Text>

        {/* ── Framing ── */}
        <Hr style={hairline} />

        {/* ── Title ── */}
        <Text style={title}>We will miss you!</Text>

        {/* ── Main Message ── */}
        <Text style={messageText}>
          We are so sorry you won&apos;t be able to join us, but we completely 
          understand! Your love, prayers, and well-wishes are all we could 
          ever ask for as we prepare to step into this marriage covenant.
        </Text>

        {/* ── Escape Hatch ── */}
        <Text style={escapeHatchText}>
          If you selected &apos;Decline&apos; by mistake, or if your plans change, 
          you can update your response at any time using the link below.
        </Text>

        {/* ── CTA ── */}
        <Section style={ctaSection}>
          <Button style={ctaButton} href={magicLink}>
            UPDATE MY RSVP
          </Button>
        </Section>

        {/* ── Hero Image (Corrected Tag) ── */}
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
      </Body>
    </Html>
  );
};

export default RSVPDeclined;

// ── Styles ────────────────────────────────────────────────────────────────────

const mainBody: React.CSSProperties = {
  backgroundColor: '#0A0A0A',
  margin: '0 auto',
  padding: '60px 20px',
  textAlign: 'center',
  fontFamily: "Georgia, 'Times New Roman', serif",
  maxWidth: '600px',
};

const preHeader: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '10px',
  letterSpacing: '6px',
  textTransform: 'uppercase',
  margin: '0 0 10px',
  fontFamily: "Georgia, 'Times New Roman', serif",
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
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontWeight: '400',
};

const messageText: React.CSSProperties = {
  color: '#D1D5DB',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 auto 24px',
  maxWidth: '440px',
  fontFamily: "Georgia, 'Times New Roman', serif",
};

const escapeHatchText: React.CSSProperties = {
  color: '#9C8C78',
  fontSize: '13px',
  lineHeight: '1.6',
  fontStyle: 'italic',
  margin: '0 auto 40px',
  maxWidth: '400px',
  fontFamily: "Georgia, 'Times New Roman', serif",
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
  fontFamily: "Georgia, 'Times New Roman', serif",
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
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontStyle: 'italic',
  fontSize: '12px',
  color: '#888888',
  textAlign: 'center',
  margin: '0 auto 40px',
  maxWidth: '400px',
};

const monogram: React.CSSProperties = {
  color: '#D4A845',
  fontFamily: "Georgia, 'Times New Roman', serif",
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
  fontFamily: "Georgia, 'Times New Roman', serif",
};
