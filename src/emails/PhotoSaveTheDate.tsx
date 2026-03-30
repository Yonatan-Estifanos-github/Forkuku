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
    <Html>
      <Head />
      <Preview>Save the Date — Yonatan & Saron · September 4, 2026</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Hero image — full-width, responsive */}
          <Img
            src="https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui/engagement_photo_4.jpeg"
            alt="Yonatan & Saron"
            width="600"
            style={heroImage}
          />

          {/* Content area with padding */}
          <Section style={content}>
            <Text style={headline}>SAVE THE DATE</Text>

            <Text style={names}>Yonatan & Saron</Text>

            <Text style={date}>Friday · September 4, 2026</Text>

            {/* Gold divider */}
            <div style={divider} />

            <Text style={paragraph}>Dear {guestName},</Text>
            <Text style={paragraph}>
              With grateful hearts, we&apos;re excited to share that we&apos;ll be getting
              married. God has been so faithful in bringing our paths together, and
              we&apos;re looking forward to beginning this next chapter surrounded by
              the people we love. We hope you&apos;ll save the date and celebrate with
              us as we step into all that God has prepared.
            </Text>

            <Text style={locationText}>
              Wrightsville, Pennsylvania
              <br />
              <span style={subNote}>(Formal invitation to follow)</span>
            </Text>

            <Section style={btnContainer}>
              <Button style={button} href={magicLink}>
                Visit Wedding Website
              </Button>
            </Section>

            <Text style={footer}>The Estifanos Family</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PhotoSaveTheDate;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const main: React.CSSProperties = {
  backgroundColor: '#0A0908',
  fontFamily: '"Times New Roman", Times, serif',
  margin: '0',
  padding: '0',
};

const container: React.CSSProperties = {
  margin: '0 auto',
  maxWidth: '600px',
  backgroundColor: '#0A0908',
};

const heroImage: React.CSSProperties = {
  width: '100%',
  height: 'auto',
  display: 'block',
};

const content: React.CSSProperties = {
  padding: '48px 32px',
  textAlign: 'center',
};

const headline: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '11px',
  letterSpacing: '6px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  margin: '0 0 24px',
};

const names: React.CSSProperties = {
  color: '#E6D2B5',
  fontSize: '42px',
  fontStyle: 'italic',
  fontWeight: 'normal',
  margin: '0 0 16px',
  lineHeight: '1.2',
  fontFamily: 'Georgia, serif',
};

const date: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '18px',
  letterSpacing: '4px',
  textTransform: 'uppercase',
  margin: '0 0 28px',
};

const divider: React.CSSProperties = {
  width: '60px',
  height: '1px',
  backgroundColor: '#D4A845',
  margin: '0 auto 28px',
  opacity: 0.3,
};

const paragraph: React.CSSProperties = {
  color: '#9C8C78',
  fontSize: '16px',
  lineHeight: '1.8',
  margin: '0 0 24px',
  textAlign: 'center',
};

const locationText: React.CSSProperties = {
  color: '#E6D2B5',
  fontSize: '14px',
  textTransform: 'uppercase',
  letterSpacing: '3px',
  margin: '32px 0 0',
  lineHeight: '1.8',
};

const subNote: React.CSSProperties = {
  fontSize: '12px',
  letterSpacing: '1px',
  textTransform: 'none',
  color: '#6B5D4F',
  fontStyle: 'italic',
};

const btnContainer: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '40px',
  marginBottom: '40px',
};

const button: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: '#D4A845',
  fontSize: '11px',
  letterSpacing: '4px',
  textTransform: 'uppercase',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '14px 40px',
  border: '1px solid #D4A845',
  borderRadius: '100px',
};

const footer: React.CSSProperties = {
  color: '#3D342C',
  fontSize: '10px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  marginTop: '48px',
};
