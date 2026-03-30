import {
  Body,
  Button,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface GenericTemplateProps {
  heading: string;
  body: string;
  ctaText?: string;
  ctaLink?: string;
  partyId?: string;
}

const BASE_URL = 'https://theestifanos.com';
const PWD = 'Matthew19:6';

export const GenericTemplate = ({
  heading,
  body,
  ctaText = 'Visit Website',
  ctaLink,
  partyId,
}: GenericTemplateProps) => {
  const magicLink = ctaLink || (partyId 
    ? `${BASE_URL}/?pwd=${PWD}&partyId=${partyId}`
    : `${BASE_URL}/?pwd=${PWD}`);

  return (
    <Html lang="en">
      <Head />
      <Preview>{heading}</Preview>
      <Body style={mainBody}>
        {/* ── Pre-header ── */}
        <Text style={preHeader}>ESTIFANOS WEDDING</Text>

        {/* ── Framing ── */}
        <Hr style={hairline} />

        {/* ── Heading ── */}
        <Heading style={title}>{heading}</Heading>

        {/* ── Body ── */}
        <Text style={paragraph}>{body}</Text>

        {/* ── Framing ── */}
        <Hr style={hairline} />

        {/* ── CTA ── */}
        <Section style={ctaSection}>
          <Button style={ctaButton} href={magicLink}>
            {ctaText}
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
      </Body>
    </Html>
  );
};

export default GenericTemplate;

// ── Styles ────────────────────────────────────────────────────────────────────

const mainBody: React.CSSProperties = {
  backgroundColor: '#0A0A0A',
  margin: '0 auto',
  padding: '60px 20px',
  textAlign: 'center',
  fontFamily: 'Helvetica, Arial, sans-serif',
  maxWidth: '600px',
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
  margin: '0 0 30px',
  fontFamily: "Georgia, serif",
  fontWeight: '400',
  textAlign: 'center',
};

const paragraph: React.CSSProperties = {
  color: '#D1D5DB',
  fontSize: '15px',
  lineHeight: '1.8',
  margin: '0 auto 30px',
  textAlign: 'center',
  maxWidth: '440px',
};

const ctaSection: React.CSSProperties = {
  margin: '20px 0 60px',
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
