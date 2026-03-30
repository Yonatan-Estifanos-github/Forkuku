import {
  Body,
  Button,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface FormalInviteProps {
  guestName?: string;
  partyId?: string;
}

const BASE_URL = 'https://theestifanos.com';
const PWD = 'Matthew19:6';

export const FormalInvite = ({ 
  guestName = 'Friend',
  partyId
}: FormalInviteProps) => {
  const magicLink = partyId 
    ? `${BASE_URL}/?pwd=${PWD}&partyId=${partyId}`
    : `${BASE_URL}/?pwd=${PWD}`;

  return (
    <Html lang="en">
      <Head />
      <Preview>You are invited to the wedding of Yonatan & Saron — September 4, 2026</Preview>

      <Body style={mainBody}>
        {/* ── Pre-header ── */}
        <Section style={centeredSection}>
          <Text style={preHeader}>FORMAL INVITATION</Text>
        </Section>

        {/* ── Framing ── */}
        <Hr style={hairline} />

        {/* ── Stacked Names ── */}
        <Section style={centeredSection}>
          <Text style={names}>
            Yonatan
            <br />
            <span style={ampersand}>&amp;</span>
            <br />
            Saron
          </Text>
        </Section>

        {/* ── Date & Location ── */}
        <Section style={centeredSection}>
          <Text style={details}>
            SEPTEMBER 4, 2026&nbsp;&nbsp;·&nbsp;&nbsp;WRIGHTSVILLE, PA
          </Text>
        </Section>

        {/* ── Framing ── */}
        <Hr style={hairline} />

        {/* ── Body Copy ── */}
        <Section style={bodySection}>
          <Text style={salutation}>Dear {guestName},</Text>
          <Text style={message}>
            With joyful hearts and overwhelming gratitude for what the Lord has done,
            we are so excited to invite you to celebrate our marriage.
          </Text>
          <Text style={message}>
            Your love, prayers, and support have deeply shaped our story. From the
            long-distance days to the quiet moments of faith that brought us here,
            you have been our village. We truly cannot imagine stepping into this
            next chapter without you by our side.
          </Text>
        </Section>

        {/* ── CTA ── */}
        <Section style={ctaSection}>
          <Button style={ctaButton} href={magicLink}>
            RSVP &amp; Explore Our Story
          </Button>
        </Section>

        {/* ── Hero Image ── */}
        <Section style={matSection}>
          <Img
            src="https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/engagement_photo_2.jpeg"
            alt="Yonatan and Saron"
            width="440"
            style={photo}
          />
        </Section>

        {/* ── Monogram ── */}
        <Text style={monogram}>Y &amp; S</Text>

        {/* ── Footer ── */}
        <Section style={footerSection}>
          <Text style={footer}>
            Yonatan &amp; Saron · September 4, 2026
            <br />
            (Please do not reply to this email)
          </Text>
        </Section>
      </Body>
    </Html>
  );
};

export default FormalInvite;

// ── Styles ────────────────────────────────────────────────────────────────────

const mainBody: React.CSSProperties = {
  backgroundColor: '#0A0A0A',
  margin: '0 auto',
  padding: '60px 20px',
  textAlign: 'center',
  fontFamily: 'Helvetica, Arial, sans-serif',
  maxWidth: '600px',
};

const centeredSection: React.CSSProperties = {
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
  fontFamily: "'Playfair Display', Georgia, serif",
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

const bodySection: React.CSSProperties = {
  padding: '20px 0',
  textAlign: 'center',
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
  margin: '0 auto 20px',
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

const matSection: React.CSSProperties = {
  padding: '0',
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

const footerSection: React.CSSProperties = {
  marginTop: '0',
};

const footer: React.CSSProperties = {
  color: '#3D3D3D',
  fontSize: '10px',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  margin: '0',
};
