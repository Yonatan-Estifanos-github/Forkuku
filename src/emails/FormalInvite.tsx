import {
  Body,
  Button,
  Container,
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

      <Body style={main}>
        <Container style={container}>

          {/* ── Matted Hero Image ── */}
          <Section style={matSection}>
            <Img
              src="https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/engagement_photo_2.jpeg"
              alt="Yonatan and Saron"
              width="520"
              style={heroImg}
            />
          </Section>

          {/* ── Pre-header ── */}
          <Section style={centeredSection}>
            <Text style={preHeader}>YOU ARE CORDIALLY INVITED</Text>
          </Section>

          <Hr style={goldRule} />

          {/* ── Names ── */}
          <Section style={centeredSection}>
            <Text style={namesText}>
              Yonatan{' '}
              <span style={{ color: '#D4A845' }}>&amp;</span>
              {' '}Saron
            </Text>
          </Section>

          <Hr style={goldRule} />

          {/* ── Date & Location ── */}
          <Section style={centeredSection}>
            <Text style={detailsText}>
              September 4, 2026&nbsp;&nbsp;·&nbsp;&nbsp;Wrightsville, Pennsylvania
            </Text>
          </Section>

          <Hr style={softRule} />

          {/* ── Body Copy ── */}
          <Section style={bodySection}>
            <Text style={salutation}>Dear {guestName},</Text>
            <Text style={paragraph}>
              With joyful hearts and overwhelming gratitude for what the Lord has done,
              we are so excited to invite you to celebrate our marriage.
            </Text>
            <Text style={paragraph}>
              Your love, prayers, and support have deeply shaped our story. From the
              long-distance days to the quiet moments of faith that brought us here,
              you have been our village. We truly cannot imagine stepping into this
              next chapter without you by our side.
            </Text>
            <Text style={paragraph}>
              We have put together a website to share our journey, introduce our
              incredible wedding party, and provide all the details you need for
              the big day.
            </Text>
          </Section>

          {/* ── CTA ── */}
          <Section style={btnSection}>
            <Button style={ghostButton} href={magicLink}>
              RSVP &amp; Explore Our Story
            </Button>
          </Section>

          <Hr style={softRule} />

          {/* ── Sign-off ── */}
          <Section style={signoffSection}>
            <Text style={signoffLine}>
              We can&apos;t wait to worship, celebrate, and break bread with you.
            </Text>
            <Text style={signoffWith}>With so much love,</Text>
            <Text style={signoffNames}>
              Yonatan{' '}
              <span style={{ color: '#D4A845' }}>&amp;</span>
              {' '}Saron
            </Text>
          </Section>

          <Hr style={softRule} />

          {/* ── Footer ── */}
          <Section style={footerSection}>
            <Text style={footerText}>
              For travel details, registries, and FAQs, please visit our website.
              <br />
              (Please do not reply to this email)
            </Text>
            <Text style={footerLinkText}>
              <a href={magicLink} style={footerAnchor}>
                www.theestifanos.com
              </a>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
};

export default FormalInvite;

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const main: React.CSSProperties = {
  backgroundColor: '#0A0908',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  margin: '0',
  padding: '48px 0',
};

const container: React.CSSProperties = {
  backgroundColor: '#0A0908',
  margin: '0 auto',
  maxWidth: '600px',
  width: '100%',
};

// Hero — 40px padding on all sides creates the "matted" frame effect
const matSection: React.CSSProperties = {
  padding: '40px 40px 32px',
};

const heroImg: React.CSSProperties = {
  border: '0',
  borderRadius: '4px',
  display: 'block',
  width: '100%',
  maxWidth: '520px',
};

// Centered wrapper used for pre-header, names, and details
const centeredSection: React.CSSProperties = {
  padding: '0 40px',
  textAlign: 'center',
};

// "YOU ARE CORDIALLY INVITED"
const preHeader: React.CSSProperties = {
  color: '#D4A845',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  fontSize: '9px',
  fontWeight: '400',
  letterSpacing: '6px',
  margin: '20px 0',
  lineHeight: '1',
};

// Gold thin rule between pre-header / names / etc.
const goldRule: React.CSSProperties = {
  borderColor: '#D4A845',
  borderTopStyle: 'solid',
  borderTopWidth: '1px',
  margin: '0 40px',
  width: 'auto',
  opacity: 0.3,
};

// Soft neutral rule before/after body sections
const softRule: React.CSSProperties = {
  borderColor: '#D4A845',
  borderTopStyle: 'solid',
  borderTopWidth: '1px',
  margin: '0 40px',
  width: 'auto',
  opacity: 0.1,
};

// "Yonatan & Saron"
const namesText: React.CSSProperties = {
  color: '#FFFFFF',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontSize: '42px',
  fontStyle: 'italic',
  fontWeight: 'normal',
  letterSpacing: '1px',
  lineHeight: '1.15',
  margin: '20px 0',
};

// "September 4, 2026 · Wrightsville, Pennsylvania"
const detailsText: React.CSSProperties = {
  color: '#F2EFE9',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  fontSize: '12px',
  fontWeight: '300',
  letterSpacing: '2px',
  lineHeight: '1.5',
  margin: '20px 0',
};

// Body copy section
const bodySection: React.CSSProperties = {
  padding: '32px 48px 0',
};

const salutation: React.CSSProperties = {
  color: '#FFFFFF',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontSize: '18px',
  fontStyle: 'italic',
  lineHeight: '1.4',
  margin: '0 0 24px',
};

const paragraph: React.CSSProperties = {
  color: '#F2EFE9',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  fontSize: '15px',
  fontWeight: '300',
  lineHeight: '1.8',
  margin: '0 0 20px',
};

// CTA button
const btnSection: React.CSSProperties = {
  padding: '32px 48px 36px',
  textAlign: 'center',
};

const ghostButton: React.CSSProperties = {
  backgroundColor: 'transparent',
  border: '1px solid #D4A845',
  borderRadius: '100px',
  color: '#D4A845',
  display: 'inline-block',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  fontSize: '10px',
  fontWeight: '600',
  letterSpacing: '4px',
  padding: '14px 36px',
  textDecoration: 'none',
  textTransform: 'uppercase' as const,
};

// Sign-off
const signoffSection: React.CSSProperties = {
  padding: '32px 48px 28px',
  textAlign: 'center',
};

const signoffLine: React.CSSProperties = {
  color: '#F2EFE9',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontSize: '15px',
  fontStyle: 'italic',
  lineHeight: '1.8',
  margin: '0 0 24px',
};

const signoffWith: React.CSSProperties = {
  color: '#9C8C78',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  fontSize: '12px',
  fontStyle: 'italic',
  fontWeight: '300',
  margin: '0 0 8px',
};

const signoffNames: React.CSSProperties = {
  color: '#FFFFFF',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontSize: '32px',
  fontStyle: 'italic',
  fontWeight: 'normal',
  letterSpacing: '1px',
  lineHeight: '1.2',
  margin: '0',
};

// Footer
const footerSection: React.CSSProperties = {
  padding: '24px 48px 40px',
  textAlign: 'center',
};

const footerText: React.CSSProperties = {
  color: '#6B5D4F',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  fontSize: '11px',
  fontWeight: '300',
  letterSpacing: '0.5px',
  lineHeight: '1.6',
  margin: '0 0 6px',
};

const footerLinkText: React.CSSProperties = {
  margin: '0',
};

const footerAnchor: React.CSSProperties = {
  color: '#D4A845',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  fontSize: '11px',
  fontWeight: '300',
  letterSpacing: '2px',
  textDecoration: 'none',
  opacity: 0.8,
};
