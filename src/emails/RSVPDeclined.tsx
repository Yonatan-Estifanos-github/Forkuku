import {
  Body,
  Button,
  Container,
  Head,
  Html,
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
        <Container style={mainContainer}>
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

export default RSVPDeclined;

// ── Styles ────────────────────────────────────────────────────────────────────

const mainBody: React.CSSProperties = {
  backgroundColor: '#0A0A0A',
  margin: '0',
  padding: '0',
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const mainContainer: React.CSSProperties = {
  maxWidth: '520px',
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

const title: React.CSSProperties = {
  color: '#F9FAFB',
  fontSize: '32px',
  lineHeight: '1.2',
  margin: '0 0 40px',
  fontFamily: 'Georgia, serif',
  fontWeight: '400',
};

const messageText: React.CSSProperties = {
  color: '#D1D5DB',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 auto 24px',
  maxWidth: '440px',
};

const escapeHatchText: React.CSSProperties = {
  color: '#9C8C78',
  fontSize: '13px',
  lineHeight: '1.6',
  fontStyle: 'italic',
  margin: '0 auto 40px',
  maxWidth: '400px',
  fontFamily: 'Georgia, serif',
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
