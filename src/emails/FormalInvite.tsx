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
}

export const FormalInvite = ({ guestName = 'Friend' }: FormalInviteProps) => (
  <Html lang="en">
    <Head />
    <Preview>You are invited to the wedding of Yonatan &amp; Saron — September 4, 2026</Preview>

    <Body style={main}>
      <Container style={container}>

        {/* ── Hero Image ── */}
        <Section style={heroSection}>
          <Img
            src="https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/engagement_photo_2.jpeg"
            alt="Yonatan and Saron Engagement"
            width="560"
            style={heroImg}
          />
        </Section>

        {/* ── Monogram ── */}
        <Section style={centeredSection}>
          <Text style={monogram}>Y &amp; S</Text>
          <Text style={monogramSub}>EST. SEPTEMBER 4, 2026</Text>
        </Section>

        <Hr style={goldDivider} />

        {/* ── Header ── */}
        <Section style={centeredSection}>
          <Text style={header}>YOU ARE INVITED</Text>
        </Section>

        <Hr style={goldDivider} />

        {/* ── Details ── */}
        <Section style={centeredSection}>
          <Text style={detailsText}>September 4, 2026 &nbsp;|&nbsp; Wrightsville, Pennsylvania</Text>
        </Section>

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

        {/* ── CTA Button ── */}
        <Section style={btnSection}>
          <Button style={button} href="https://www.theestifanos.com">
            RSVP &amp; Explore Our Story
          </Button>
        </Section>

        <Hr style={thinDivider} />

        {/* ── Sign-off ── */}
        <Section style={signoffSection}>
          <Text style={signoffLine}>
            We can&apos;t wait to worship, celebrate, and break bread with you.
          </Text>
          <Text style={signoffWith}>With so much love,</Text>
          <Text style={signoffNames}>Yonatan &amp; Saron</Text>
        </Section>

        <Hr style={thinDivider} />

        {/* ── Footer ── */}
        <Section style={footerSection}>
          <Text style={footerText}>
            For travel details, registries, and FAQs, please visit our website.
          </Text>
          <Text style={footerLink}>
            <a href="https://www.theestifanos.com" style={footerAnchor}>
              www.theestifanos.com
            </a>
          </Text>
        </Section>

      </Container>
    </Body>
  </Html>
);

export default FormalInvite;

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const main: React.CSSProperties = {
  backgroundColor: '#F9F7F2',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  margin: '0',
  padding: '40px 0',
};

const container: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E8E3D9',
  borderRadius: '4px',
  margin: '0 auto',
  maxWidth: '600px',
  width: '100%',
};

// Hero
const heroSection: React.CSSProperties = {
  padding: '24px 20px 0',
};

const heroImg: React.CSSProperties = {
  borderRadius: '8px',
  display: 'block',
  width: '100%',
  maxWidth: '560px',
  border: '0',
};

// Monogram
const centeredSection: React.CSSProperties = {
  padding: '0 20px',
  textAlign: 'center',
};

const monogram: React.CSSProperties = {
  color: '#D4A845',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontSize: '36px',
  fontStyle: 'italic',
  fontWeight: 'normal',
  letterSpacing: '8px',
  margin: '28px 0 4px',
  lineHeight: '1',
};

const monogramSub: React.CSSProperties = {
  color: '#1B3B28',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  fontSize: '9px',
  fontWeight: '400',
  letterSpacing: '5px',
  margin: '0 0 24px',
};

// Dividers
const goldDivider: React.CSSProperties = {
  borderColor: '#D4A845',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  margin: '0 20px',
  width: 'auto',
};

const thinDivider: React.CSSProperties = {
  borderColor: '#E8E3D9',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  margin: '0 20px',
  width: 'auto',
};

// Header
const header: React.CSSProperties = {
  color: '#1B3B28',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  fontSize: '10px',
  fontWeight: '400',
  letterSpacing: '6px',
  margin: '20px 0',
  lineHeight: '1',
};

// Details
const detailsText: React.CSSProperties = {
  color: '#4A4A4A',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontSize: '14px',
  fontStyle: 'italic',
  letterSpacing: '1px',
  margin: '20px 0',
  lineHeight: '1.4',
};

// Body copy
const bodySection: React.CSSProperties = {
  padding: '8px 36px 0',
};

const salutation: React.CSSProperties = {
  color: '#1B3B28',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontSize: '17px',
  fontStyle: 'italic',
  margin: '24px 0 20px',
  lineHeight: '1.4',
};

const paragraph: React.CSSProperties = {
  color: '#4A4A4A',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  fontSize: '15px',
  fontWeight: '300',
  lineHeight: '1.8',
  margin: '0 0 18px',
};

// Button
const btnSection: React.CSSProperties = {
  padding: '28px 36px 32px',
  textAlign: 'center',
};

const button: React.CSSProperties = {
  backgroundColor: '#1B3B28',
  border: '1px solid #D4A845',
  borderRadius: '2px',
  color: '#D4A845',
  display: 'inline-block',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '3px',
  padding: '14px 32px',
  textDecoration: 'none',
  textTransform: 'uppercase' as const,
};

// Sign-off
const signoffSection: React.CSSProperties = {
  padding: '28px 36px 24px',
  textAlign: 'center',
};

const signoffLine: React.CSSProperties = {
  color: '#4A4A4A',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontSize: '15px',
  fontStyle: 'italic',
  fontWeight: 'normal',
  lineHeight: '1.7',
  margin: '0 0 20px',
};

const signoffWith: React.CSSProperties = {
  color: '#888888',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  fontSize: '13px',
  fontStyle: 'italic',
  margin: '0 0 6px',
};

const signoffNames: React.CSSProperties = {
  color: '#1B3B28',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontSize: '26px',
  fontStyle: 'italic',
  fontWeight: 'normal',
  letterSpacing: '1px',
  margin: '0',
};

// Footer
const footerSection: React.CSSProperties = {
  padding: '20px 36px 32px',
  textAlign: 'center',
};

const footerText: React.CSSProperties = {
  color: '#AAAAAA',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  fontSize: '11px',
  letterSpacing: '0.5px',
  lineHeight: '1.6',
  margin: '0 0 6px',
};

const footerLink: React.CSSProperties = {
  margin: '0',
};

const footerAnchor: React.CSSProperties = {
  color: '#D4A845',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  fontSize: '11px',
  letterSpacing: '2px',
  textDecoration: 'none',
};
