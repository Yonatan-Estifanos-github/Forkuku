import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface FormalInviteProps {
  guestName?: string;
}

export const FormalInvite = ({
  guestName = 'Friend',
}: FormalInviteProps) => (
  <Html lang="en">
    <Head />
    <Preview>We can&apos;t wait to celebrate what the Lord has done with you...</Preview>

    <Body style={main}>
      <Container style={wrapper}>

        {/* ── Outer border frame ── */}
        <Section style={frame}>

          {/* ── Top ornament ── */}
          <Section style={topOrnament}>
            <Text style={ornamentLine}>─────────────</Text>
          </Section>

          {/* ── Monogram ── */}
          <Section style={monogramSection}>
            <Text style={monogramLabel}>Y &amp; S</Text>
            <Text style={monogramSub}>Est. September 4, 2026</Text>
          </Section>

          <Hr style={goldRule} />

          {/* ── Pre-heading ── */}
          <Section style={centeredSection}>
            <Text style={preHeading}>YOU ARE CORDIALLY INVITED</Text>
          </Section>

          {/* ── Names ── */}
          <Section style={centeredSection}>
            <Text style={namesDisplay}>Yonatan</Text>
            <Text style={ampersand}>&amp;</Text>
            <Text style={namesDisplay}>Saron</Text>
          </Section>

          <Hr style={goldRule} />

          {/* ── Date & Venue ── */}
          <Section style={detailsBlock}>
            <Text style={detailsDate}>September 4, 2026</Text>
            <Text style={detailsPipe}>|</Text>
            <Text style={detailsLocation}>Wrightsville, Pennsylvania</Text>
          </Section>

          <Hr style={thinRule} />

          {/* ── Salutation ── */}
          <Section style={bodySection}>
            <Text style={salutation}>Dear {guestName},</Text>

            <Text style={bodyText}>
              With joyful hearts and overwhelming gratitude for what the Lord has done,
              we are so excited to invite you to celebrate our marriage.
            </Text>

            <Text style={bodyText}>
              Your love, prayers, and support have deeply shaped our story. From the
              long-distance days to the quiet moments of faith that brought us here,
              you have been our village. We truly cannot imagine stepping into this
              next chapter without you by our side.
            </Text>

            <Text style={bodyText}>
              We have put together a website to share our journey, introduce our
              incredible wedding party, and provide all the details you need for
              the big day.
            </Text>
          </Section>

          {/* ── CTA Button ── */}
          <Section style={btnSection}>
            <Button style={ctaButton} href="https://www.theestifanos.com">
              RSVP &amp; Explore Our Story
            </Button>
          </Section>

          <Hr style={thinRule} />

          {/* ── Sign-off ── */}
          <Section style={signoffSection}>
            <Text style={signoffLine}>
              We can&apos;t wait to worship, celebrate, and break bread with you.
            </Text>
            <Text style={signoffWith}>With so much love,</Text>
            <Text style={signoffNames}>Yonatan &amp; Saron</Text>
          </Section>

          <Hr style={goldRule} />

          {/* ── Footer ── */}
          <Section style={centeredSection}>
            <Text style={footerText}>
              For travel details, registries, and FAQs, please visit our website.
            </Text>
            <Text style={footerLink}>
              <a href="https://www.theestifanos.com" style={footerAnchor}>
                www.theestifanos.com
              </a>
            </Text>
          </Section>

          {/* ── Bottom ornament ── */}
          <Section style={topOrnament}>
            <Text style={ornamentLine}>─────────────</Text>
          </Section>

        </Section>
        {/* end frame */}

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
  padding: '0',
};

const wrapper: React.CSSProperties = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '580px',
};

// Outer decorative border frame
const frame: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #D4A845',
  padding: '48px 40px',
  textAlign: 'center',
};

// Top / bottom ornament
const topOrnament: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '0',
};

const ornamentLine: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '10px',
  letterSpacing: '4px',
  margin: '0',
  lineHeight: '1',
};

// Monogram
const monogramSection: React.CSSProperties = {
  textAlign: 'center',
  padding: '24px 0 20px',
};

const monogramLabel: React.CSSProperties = {
  color: '#1B3B28',
  fontSize: '42px',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontStyle: 'italic',
  fontWeight: 'normal',
  letterSpacing: '10px',
  margin: '0 0 6px',
  lineHeight: '1.1',
};

const monogramSub: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '10px',
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  letterSpacing: '5px',
  textTransform: 'uppercase' as const,
  margin: '0',
};

// Dividers
const goldRule: React.CSSProperties = {
  borderColor: '#D4A845',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  margin: '0',
  width: '60%',
};

const thinRule: React.CSSProperties = {
  borderColor: '#E8E4DC',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  margin: '0',
  width: '100%',
};

// Pre-heading
const centeredSection: React.CSSProperties = {
  textAlign: 'center',
  padding: '0',
};

const preHeading: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '10px',
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  fontWeight: '400',
  letterSpacing: '5px',
  textTransform: 'uppercase' as const,
  margin: '24px 0',
  lineHeight: '1',
};

// Names
const namesDisplay: React.CSSProperties = {
  color: '#1B3B28',
  fontSize: '44px',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontStyle: 'italic',
  fontWeight: 'normal',
  margin: '0',
  lineHeight: '1.15',
};

const ampersand: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '28px',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontStyle: 'italic',
  fontWeight: 'normal',
  margin: '4px 0',
  lineHeight: '1',
};

// Date & venue details block
const detailsBlock: React.CSSProperties = {
  textAlign: 'center',
  padding: '28px 0',
};

const detailsDate: React.CSSProperties = {
  color: '#1B3B28',
  fontSize: '18px',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontStyle: 'italic',
  fontWeight: 'normal',
  margin: '0 0 4px',
  letterSpacing: '1px',
};

const detailsPipe: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '16px',
  margin: '0',
  lineHeight: '1',
};

const detailsLocation: React.CSSProperties = {
  color: '#1B3B28',
  fontSize: '11px',
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  letterSpacing: '4px',
  textTransform: 'uppercase' as const,
  fontWeight: '400',
  margin: '4px 0 0',
};

// Body copy
const bodySection: React.CSSProperties = {
  textAlign: 'left',
  padding: '36px 8px 0',
};

const salutation: React.CSSProperties = {
  color: '#1B3B28',
  fontSize: '18px',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontStyle: 'italic',
  margin: '0 0 24px',
  lineHeight: '1.4',
};

const bodyText: React.CSSProperties = {
  color: '#2C2C2C',
  fontSize: '15px',
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  lineHeight: '1.75',
  margin: '0 0 20px',
  fontWeight: '300',
};

// CTA button
const btnSection: React.CSSProperties = {
  textAlign: 'center',
  padding: '32px 0 36px',
};

const ctaButton: React.CSSProperties = {
  backgroundColor: '#1B3B28',
  color: '#D4A845',
  fontSize: '11px',
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  fontWeight: '600',
  letterSpacing: '3px',
  textTransform: 'uppercase' as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 36px',
  border: '1px solid #D4A845',
};

// Sign-off
const signoffSection: React.CSSProperties = {
  textAlign: 'center',
  padding: '36px 8px 32px',
};

const signoffLine: React.CSSProperties = {
  color: '#2C2C2C',
  fontSize: '15px',
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  fontStyle: 'italic',
  lineHeight: '1.7',
  margin: '0 0 24px',
  fontWeight: '300',
};

const signoffWith: React.CSSProperties = {
  color: '#888888',
  fontSize: '13px',
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  fontStyle: 'italic',
  margin: '0 0 6px',
};

const signoffNames: React.CSSProperties = {
  color: '#1B3B28',
  fontSize: '28px',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontStyle: 'italic',
  fontWeight: 'normal',
  margin: '0',
  letterSpacing: '1px',
};

// Footer
const footerText: React.CSSProperties = {
  color: '#999999',
  fontSize: '11px',
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  margin: '24px 0 6px',
  letterSpacing: '0.5px',
  lineHeight: '1.6',
};

const footerLink: React.CSSProperties = {
  margin: '0 0 24px',
};

const footerAnchor: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '11px',
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  textDecoration: 'none',
  letterSpacing: '2px',
};
