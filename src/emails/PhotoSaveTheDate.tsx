import {
  Body,
  Button,
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

interface PhotoSaveTheDateProps {
  guestName?: string;
  partyId?: string;
}

const BASE_URL = 'https://theestifanos.com';
const PWD = 'Matthew19:6';

export const PhotoSaveTheDate = ({
  guestName = 'Guest',
  partyId,
}: PhotoSaveTheDateProps) => {
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

          {/* ── Hero image ── */}
          <Img
            src="https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/engagement_photo_4.jpeg"
            alt="Yonatan &amp; Saron"
            width="440"
            style={heroImage}
          />

          {/* ── Framing ── */}
          <Hr style={hairline} />

          {/* ── Names ── */}
          <Text style={names}>
            Yonatan
            <br />
            <span style={ampersand}>&amp;</span>
            <br />
            Saron
          </Text>

          {/* ── Date & Location ── */}
          <Text style={dateLine}>FRIDAY · SEPTEMBER 4, 2026</Text>
          <Text style={locationLine}>WRIGHTSVILLE, PENNSYLVANIA</Text>

          {/* ── Framing ── */}
          <Hr style={hairline} />

          {/* ── Content Area ── */}
          <Section style={contentSection}>
            <Text style={salutation}>Dear {guestName},</Text>
            <Text style={paragraph}>
              With grateful hearts, we&apos;re excited to share that we&apos;ll be getting
              married. God has been so faithful in bringing our paths together, and
              we&apos;re looking forward to beginning this next chapter surrounded by
              the people we love.
            </Text>
            <Text style={paragraph}>
              We hope you&apos;ll save the date and celebrate with
              us as we step into all that God has prepared.
            </Text>
            <Text style={subNote}>(Formal invitation to follow)</Text>
          </Section>

          {/* ── CTA ── */}
          <Section style={ctaSection}>
            <Button style={ctaButton} href={magicLink}>
              Visit Wedding Website
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

export default PhotoSaveTheDate;

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
  margin: '0 0 30px',
};

const heroImage: React.CSSProperties = {
  width: '100%',
  maxWidth: '440px',
  height: 'auto',
  display: 'block',
  margin: '0 auto',
  borderRadius: '2px',
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

const dateLine: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '16px',
  letterSpacing: '4px',
  textTransform: 'uppercase',
  margin: '0 0 8px',
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const locationLine: React.CSSProperties = {
  color: '#A1A1AA',
  fontSize: '11px',
  letterSpacing: '3px',
  textTransform: 'uppercase',
  margin: '0 0 10px',
};

const contentSection: React.CSSProperties = {
  padding: '20px 0',
};

const salutation: React.CSSProperties = {
  color: '#F9FAFB',
  fontSize: '16px',
  margin: '0 0 16px',
  fontFamily: "Georgia, serif",
};

const paragraph: React.CSSProperties = {
  color: '#D1D5DB',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 auto 20px',
  maxWidth: '440px',
};

const subNote: React.CSSProperties = {
  fontSize: '12px',
  letterSpacing: '1px',
  color: '#6B5D4F',
  fontStyle: 'italic',
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
