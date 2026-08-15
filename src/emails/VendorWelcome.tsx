import {
  Body,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
} from '@react-email/components';
import * as React from 'react';

interface VendorWelcomeProps {
  vendorName?: string;
}

const SITE_LINK = 'https://theestifanos.com/?pwd=Matthew19:6';

export const VendorWelcome = ({
  vendorName = 'Friend',
}: VendorWelcomeProps) => {
  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>
      <Preview>We're so excited to have you — Yonatan &amp; Saron · September 4, 2026</Preview>

      <Body style={mainBody}>
        {/* ── Pre-header ── */}
        <Text style={preHeader}>YOU&apos;RE PART OF OUR DAY</Text>

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
        <Text style={dateLine}>SEPTEMBER 4, 2026</Text>

        {/* ── Framing ── */}
        <Hr style={hairline} />

        {/* ── Salutation ── */}
        <Text style={salutation}>Hi {vendorName},</Text>

        {/* ── Main Message ── */}
        <Text style={message}>
          We just wanted to reach out and say how excited we are to have you
          as part of our wedding day! Thank you for being part of making it
          such a special celebration.
        </Text>
        <Text style={message}>
          We&apos;d love for you to get to know us a little better before the
          big day — take a look at our website for our story and all the
          details of what we&apos;re celebrating.
        </Text>

        {/* ── CTA ── */}
        <Section style={ctaSection}>
          <Link href={SITE_LINK} style={ctaButton}>
            VISIT OUR WEBSITE
          </Link>
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

export default VendorWelcome;

// ── Styles ────────────────────────────────────────────────────────────────────

const mainBody: React.CSSProperties = {
  backgroundColor: '#FCFBF8',
  margin: '0 auto',
  padding: '60px 20px',
  textAlign: 'center',
  fontFamily: "Georgia, 'Times New Roman', serif",
  maxWidth: '600px',
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
  margin: '0 auto 20px',
  textAlign: 'center',
  maxWidth: '440px',
  fontFamily: "Georgia, 'Times New Roman', serif",
};

const ctaSection: React.CSSProperties = {
  margin: '20px 0 60px',
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

const monogram: React.CSSProperties = {
  color: '#B08D57',
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontStyle: 'italic',
  fontSize: '24px',
  marginTop: '0',
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
