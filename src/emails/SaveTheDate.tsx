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

interface SaveTheDateProps {
  guestName?: string;
}

const MAGIC_LINK = 'https://theestifanos.com/?pwd=Matthew19:6';
const PHOTO_URL =
  'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/engagement_photo_3.jpeg';

export const SaveTheDate = ({ guestName = 'Dear Friend' }: SaveTheDateProps) => (
  <Html lang="en">
    <Head />
    <Preview>Save the Date — Yonatan &amp; Saron · September 4, 2026</Preview>

    <Body style={body}>
      <Container style={container}>

        {/* ── Pre-header label ── */}
        <Text style={preHeader}>SAVE THE DATE</Text>

        {/* ── Decorative rule ── */}
        <Hr style={rule} />

        {/* ── Names ── */}
        <Text style={names}>Yonatan &amp; Saron</Text>

        {/* ── Date & Location ── */}
        <Text style={dateLine}>September 4, 2026</Text>
        <Text style={locationLine}>Wrightsville, Pennsylvania</Text>

        {/* ── Decorative rule ── */}
        <Hr style={rule} />

        {/* ── Salutation ── */}
        <Text style={salutation}>{guestName},</Text>

        {/* ── Body copy ── */}
        <Text style={bodyText}>
          Please join us as we celebrate the beginning of our forever.
          To receive your official formal invitation — which will include
          venue details and weekend itineraries — please register your
          attendance on our website by <span style={emphasis}>May 1st, 2026</span>.
        </Text>

        {/* ── Password notice ── */}
        <Section style={passwordBox}>
          <Text style={passwordLabel}>WEBSITE ACCESS</Text>
          <Text style={passwordValue}>Matthew19:6</Text>
        </Section>

        {/* ── CTA ── */}
        <Section style={ctaSection}>
          {/*
            React Email's <Button> forces solid background.
            Use a plain <a> via dangerouslySetInnerHTML workaround
            or just an anchor styled inline.
          */}
          <a href={MAGIC_LINK} style={ctaButton} target="_blank" rel="noopener noreferrer">
            RSVP NOW
          </a>
        </Section>

        {/* ── Scripture note ── */}
        <Text style={scripture}>
          &quot;What therefore God has joined together, let no man separate.&quot;
          <br />
          <span style={scriptureRef}>— Matthew 19:6</span>
        </Text>

        {/* ── Engagement photo ── */}
        <Img
          src={PHOTO_URL}
          alt="Yonatan and Saron"
          width="560"
          style={photo}
        />

        {/* ── Footer ── */}
        <Text style={footer}>
          Yonatan &amp; Saron · September 4, 2026 · Wrightsville, PA
        </Text>

      </Container>
    </Body>
  </Html>
);

export default SaveTheDate;

// ── Styles ────────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: '#0A0908',
  margin: '0',
  padding: '0',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
};

const container: React.CSSProperties = {
  margin: '0 auto',
  padding: '48px 32px 0',
  maxWidth: '600px',
  textAlign: 'center',
  backgroundColor: '#0A0908',
};

const preHeader: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '11px',
  letterSpacing: '6px',
  textTransform: 'uppercase',
  margin: '0 0 24px',
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const rule: React.CSSProperties = {
  borderColor: '#D4A845',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  opacity: 0.25,
  margin: '0 auto 32px',
  width: '80px',
};

const names: React.CSSProperties = {
  color: '#E6D2B5',
  fontSize: '54px',
  fontStyle: 'italic',
  fontWeight: '400',
  margin: '0 0 16px',
  lineHeight: '1.15',
  letterSpacing: '1px',
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
  color: '#9C8C78',
  fontSize: '11px',
  letterSpacing: '3px',
  textTransform: 'uppercase',
  margin: '0 0 32px',
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const salutation: React.CSSProperties = {
  color: '#E6D2B5',
  fontSize: '18px',
  fontStyle: 'italic',
  margin: '0 0 12px',
};

const bodyText: React.CSSProperties = {
  color: '#9C8C78',
  fontSize: '15px',
  lineHeight: '1.8',
  margin: '0 0 36px',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
};

const emphasis: React.CSSProperties = {
  color: '#E6D2B5',
  fontStyle: 'italic',
};

const passwordBox: React.CSSProperties = {
  border: '1px solid rgba(212, 168, 69, 0.25)',
  borderRadius: '4px',
  padding: '16px 24px',
  margin: '0 auto 36px',
  maxWidth: '280px',
  backgroundColor: 'rgba(212, 168, 69, 0.04)',
};

const passwordLabel: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '9px',
  letterSpacing: '4px',
  textTransform: 'uppercase',
  margin: '0 0 6px',
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const passwordValue: React.CSSProperties = {
  color: '#E6D2B5',
  fontSize: '18px',
  fontStyle: 'italic',
  margin: '0',
  letterSpacing: '1px',
};

const ctaSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '0 0 40px',
};

const ctaButton: React.CSSProperties = {
  display: 'inline-block',
  border: '1px solid #D4A845',
  color: '#D4A845',
  backgroundColor: 'transparent',
  fontSize: '11px',
  letterSpacing: '4px',
  textTransform: 'uppercase',
  textDecoration: 'none',
  padding: '14px 40px',
  borderRadius: '100px',
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const scripture: React.CSSProperties = {
  color: '#6B5D4F',
  fontSize: '13px',
  fontStyle: 'italic',
  lineHeight: '1.7',
  margin: '0 0 40px',
};

const scriptureRef: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '1px',
  fontStyle: 'normal',
  color: '#5A4E43',
};

const photo: React.CSSProperties = {
  width: '100%',
  maxWidth: '560px',
  height: 'auto',
  display: 'block',
  margin: '0 auto',
  borderRadius: '4px',
};

const footer: React.CSSProperties = {
  color: '#3D342C',
  fontSize: '10px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  margin: '24px 0 32px',
  fontFamily: 'Helvetica, Arial, sans-serif',
};
