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

interface GenericTemplateProps {
  heading: string;
  body: string;
  ctaText?: string;
  ctaLink?: string;
  partyId?: string;
}

const BASE_URL = 'https://theestifanos.com';
const PWD = 'Matthew19:6';

export const GenericTemplate = ({
  heading,
  body,
  ctaText = 'Visit Website',
  ctaLink,
  partyId,
}: GenericTemplateProps) => {
  const magicLink = ctaLink || (partyId 
    ? `${BASE_URL}/?pwd=${PWD}&partyId=${partyId}`
    : `${BASE_URL}/?pwd=${PWD}`);

  return (
    <Html>
      <Head />
      <Preview>{heading}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={header}>ESTIFANOS WEDDING</Text>
          <Heading style={title}>{heading}</Heading>
          <Text style={paragraph}>{body}</Text>
          <Section style={btnContainer}>
            <Button style={button} href={magicLink}>{ctaText}</Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default GenericTemplate;

const main = {
  backgroundColor: '#0A0908',
  fontFamily: '"Times New Roman", Times, serif',
};

const container = {
  margin: '0 auto',
  padding: '64px 20px',
  maxWidth: '600px',
  textAlign: 'center' as const,
  backgroundColor: '#0A0908',
};

const header = {
  color: '#D4A845',
  fontSize: '11px',
  letterSpacing: '6px',
  marginBottom: '32px',
  textTransform: 'uppercase' as const,
};

const title = {
  color: '#E6D2B5',
  fontSize: '32px',
  margin: '0 0 24px',
  fontWeight: '400',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
};

const paragraph = {
  color: '#9C8C78',
  fontSize: '16px',
  lineHeight: '1.8',
  margin: '0 0 32px',
};

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '40px',
};

const button = {
  backgroundColor: 'transparent',
  color: '#D4A845',
  fontSize: '11px',
  letterSpacing: '4px',
  textTransform: 'uppercase' as const,
  textDecoration: 'none',
  padding: '14px 40px',
  border: '1px solid #D4A845',
  borderRadius: '100px',
};
