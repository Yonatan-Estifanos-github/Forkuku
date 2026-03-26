import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface SaveTheDateProps {
  guestName?: string;
}

export const SaveTheDate = ({
  guestName = 'Guest',
}: SaveTheDateProps) => (
  <Html>
    <Head />
    <Preview>Save the Date: Yonatan & Saron</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={header}>SAVE THE DATE</Text>
        
        <Heading style={title}>Yonatan & Saron</Heading>
        
        <Text style={date}>September 4, 2026</Text>
        <Text style={location}>Wrightsville, PA</Text>
        
        <Text style={paragraph}>Dear {guestName},</Text>
        <Text style={paragraph}>
          We are overjoyed to invite you to celebrate our wedding.
          Address and day-of itinerary will be sent after RSVP.
        </Text>
        
        <Section style={btnContainer}>
          <Button style={button} href="https://www.theestifanos.com">
            Visit Website
          </Button>
        </Section>
        

      </Container>
    </Body>
  </Html>
);

export default SaveTheDate;

const main = {
  backgroundColor: '#F9F7F2',
  fontFamily: '"Times New Roman", Times, serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
  textAlign: 'center' as const,
};

const header = {
  color: '#D4A845',
  fontSize: '14px',
  letterSpacing: '4px',
  fontWeight: 'bold',
  marginBottom: '20px',
  textTransform: 'uppercase' as const,
};

const title = {
  color: '#1B3B28',
  fontSize: '48px',
  fontStyle: 'italic',
  margin: '0 0 20px',
  fontWeight: 'normal',
};

const date = {
  color: '#D4A845',
  fontSize: '24px',
  margin: '0 0 10px',
};

const location = {
  color: '#1B3B28',
  fontSize: '16px',
  textTransform: 'uppercase' as const,
  letterSpacing: '2px',
  margin: '0 0 40px',
};

const paragraph = {
  color: '#1B3B28',
  fontSize: '18px',
  lineHeight: '1.6',
  margin: '0 0 20px',
};

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '30px',
  marginBottom: '30px',
};

const button = {
  backgroundColor: '#1B3B28',
  color: '#D4A845',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '14px',
  border: '1px solid #D4A845',
  margin: '0 auto',
  letterSpacing: '1px',
};

const footer = {
  color: '#888888',
  fontSize: '12px',
  marginTop: '40px',
};