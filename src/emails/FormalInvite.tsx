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
import { getGoogleCalendarUrl } from '@/lib/calendar';

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
  // partyId is routed through a path segment (not `?partyId=<uuid>`) since a
  // raw hex UUID directly after "=" gets silently corrupted by the outgoing
  // quoted-printable MIME encoding — see middleware.ts's /i/<partyId> handler.
  const magicLink = partyId
    ? `${BASE_URL}/i/${partyId}?view=final-invite`
    : `${BASE_URL}/?pwd=${PWD}&view=final-invite`;
  // Guests on this send already RSVPed via Save the Date, so the button
  // no longer says RSVP — it goes to the same site (story, timeline,
  // hotels, registry), just with a #registry anchor on the second link
  // to jump straight to the Cash App/Venmo cards.
  const registryLink = `${magicLink}#registry`;
  const icsLink = `${BASE_URL}/api/calendar`;
  const googleCalendarUrl = getGoogleCalendarUrl();

  return (
    <Html lang="en">
      <Head>
        {/* Without these, mobile Gmail's dark-mode adaptation layer treats
            this as an ordinary light-authored email and auto-inverts it —
            confirmed on a real device: background flipped to white AND the
            authored white/gold text flipped to dark, i.e. Gmail re-derived
            a whole alternate palette rather than just failing to apply one
            style. Declaring the email as dark-only tells it not to. */}
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>
      <Preview>You are invited to the wedding of Yonatan & Saron — September 4, 2026</Preview>

      <Body style={mainBody}>
        <Container style={outerContainer} bgcolor="#0A0A0A">
          {/* ── Hero — main pre-wedding photo, full-bleed ──
              A true CSS background-image with overlaid text is unreliable
              across email clients (Outlook in particular has no support
              without VML fallback markup), so this uses the well-supported
              equivalent: an edge-to-edge photo banner at the very top.
              The fade into the dark panel below is baked into the image
              file itself (not a CSS gradient) — confirmed via a real sent
              email that Gmail's web rendering strips both the `background`
              shorthand and negative margins from inline styles, so a CSS
              overlay silently did nothing. A pixel-level fade renders
              identically in every client since it's just image data. */}
          <Img
            src="https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/eng-main-image-email-hero.jpg"
            alt="Yonatan and Saron"
            width="600"
            style={heroPhoto}
          />

          <Section style={contentWrapper} bgcolor="#0A0A0A">
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
              SEPTEMBER 4, 2026&nbsp;·&nbsp;WRIGHTSVILLE, PA
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

          {/* ── Venue & Time ── */}
          <Section style={venueSection}>
            <Text style={venueName}>Japanese Garden</Text>
            <Text style={ceremonyLocation}>Ceremony at Lauxmont Gardens</Text>
            <Text style={venueDetail}>1155 Long Level Road, Wrightsville, PA 17368</Text>
            <Text style={venueDetail}>Guests welcomed at 2:00 PM &nbsp;·&nbsp; Ceremony at 2:30 PM</Text>
          </Section>

          {/* ── CTA ── */}
          <Section style={ctaSection}>
            <Button style={ctaButton} href={magicLink}>
              See Our Story &amp; Details
            </Button>
          </Section>
          <Section style={secondaryCtaSection}>
            <a href={registryLink} style={secondaryCtaLink}>
              View Registry (Cash App, Venmo &amp; Zelle)
            </a>
          </Section>
          <Section style={secondaryCtaSection}>
            <a href={googleCalendarUrl} style={secondaryCtaLink} target="_blank" rel="noopener noreferrer">
              Add to Google Calendar
            </a>
            &nbsp;&nbsp;·&nbsp;&nbsp;
            <a href={icsLink} style={secondaryCtaLink}>
              Add to Apple / Outlook
            </a>
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
        </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default FormalInvite;

// ── Styles ────────────────────────────────────────────────────────────────────

const mainBody: React.CSSProperties = {
  backgroundColor: '#0A0A0A',
  margin: '0',
  padding: '0',
  textAlign: 'center',
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const outerContainer: React.CSSProperties = {
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
};

const heroPhoto: React.CSSProperties = {
  width: '100%',
  maxWidth: '600px',
  height: 'auto',
  display: 'block',
  margin: '0 auto',
};

const contentWrapper: React.CSSProperties = {
  padding: '32px 20px 60px',
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
  letterSpacing: '1px',
  textTransform: 'uppercase',
  margin: '0 0 10px',
  whiteSpace: 'nowrap',
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

const venueSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '0 0 36px',
};

const venueName: React.CSSProperties = {
  color: '#D4A845',
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  fontSize: '20px',
  margin: '0 0 8px',
};

const ceremonyLocation: React.CSSProperties = {
  color: '#A1A1AA',
  fontSize: '10px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  margin: '0 0 12px',
};

const venueDetail: React.CSSProperties = {
  color: '#A1A1AA',
  fontSize: '11px',
  letterSpacing: '1px',
  margin: '0 0 4px',
};

const ctaSection: React.CSSProperties = {
  margin: '20px 0 40px',
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

const secondaryCtaSection: React.CSSProperties = {
  margin: '0 0 20px',
};

const secondaryCtaLink: React.CSSProperties = {
  color: '#A1A1AA',
  fontSize: '10px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  textDecoration: 'underline',
};

const monogram: React.CSSProperties = {
  color: '#D4A845',
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  fontSize: '24px',
  marginTop: '0',
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
