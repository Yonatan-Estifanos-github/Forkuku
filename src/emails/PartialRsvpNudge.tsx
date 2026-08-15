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

interface PartialRsvpNudgeProps {
  partyId?: string;
  acceptedNames: string[];
  pendingNames: string[];
}

const BASE_URL = 'https://theestifanos.com';
const PWD = 'Matthew19:6';

function joinNames(names: string[]): string {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

export const PartialRsvpNudge = ({
  partyId,
  acceptedNames,
  pendingNames,
}: PartialRsvpNudgeProps) => {
  // partyId is routed through a path segment (not `?partyId=<uuid>`) since a
  // raw hex UUID directly after "=" gets silently corrupted by the outgoing
  // quoted-printable MIME encoding — see middleware.ts's /i/<partyId> handler.
  const magicLink = (partyId
    ? `${BASE_URL}/i/${partyId}`
    : `${BASE_URL}/?pwd=${PWD}`) + '#rsvp';

  const acceptedText = joinNames(acceptedNames);
  const pendingText = joinNames(pendingNames);

  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>
      <Preview>RSVP Update — Yonatan &amp; Saron · September 4, 2026</Preview>

      <Body style={mainBody}>
        {/* ── Pre-header ── */}
        <Text style={preHeader}>RSVP UPDATE</Text>

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

        {/* ── Main Message ── */}
        <Text style={message}>
          {acceptedText ? `${acceptedText} ${acceptedNames.length === 1 ? 'is' : 'are'} confirmed for our wedding on September 4, 2026` : 'Great news — your party is confirmed for our wedding on September 4, 2026'} —
          but we haven&apos;t heard from {pendingText} yet.
        </Text>

        {/* ── Urgency ── */}
        <Text style={urgency}>
          Can you confirm {pendingText}&apos;s RSVP within the next 48 hours?
        </Text>

        {/* ── CTA ── */}
        <Section style={ctaSection}>
          <Link href={magicLink} style={ctaButton}>
            UPDATE RSVP
          </Link>
        </Section>

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

export default PartialRsvpNudge;

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

const message: React.CSSProperties = {
  color: '#5A544C',
  fontSize: '14px',
  lineHeight: '1.8',
  margin: '0 auto 20px',
  textAlign: 'center',
  maxWidth: '440px',
  fontFamily: "Georgia, 'Times New Roman', serif",
};

const urgency: React.CSSProperties = {
  color: '#423E37',
  fontSize: '13px',
  fontWeight: 'bold',
  letterSpacing: '0.05em',
  margin: '0 0 30px',
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
