import {
  Body,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface RegistryGiftConfirmationProps {
  purchaserName: string;
  itemName: string;
  shippingAddress: string;
}

export const RegistryGiftConfirmation = ({
  purchaserName,
  itemName,
  shippingAddress,
}: RegistryGiftConfirmationProps) => (
  <Html lang="en">
    <Head />
    <Preview>Thank you for your gift — Yonatan & Saron</Preview>
    <Body style={body}>
      <Text style={label}>GIFT CONFIRMED</Text>
      <Text style={title}>God bless you, {purchaserName}.</Text>

      <Text style={message}>
        We are so grateful for your generosity and love. The{' '}
        <span style={itemHighlight}>{itemName}</span> means the world to us —
        thank you for helping us build our home.
      </Text>

      <Section style={card}>
        <Text style={cardLabel}>PLEASE SEND TO</Text>
        <Text style={address}>{shippingAddress}</Text>
      </Section>

      <Text style={message}>
        If you have any questions or need to reach us personally, don&rsquo;t
        hesitate — we&rsquo;re just a text or call away.
      </Text>

      <Text style={footer}>
        With so much love &amp; gratitude,{'\n'}Yonatan &amp; Saron · September 4, 2026
      </Text>
    </Body>
  </Html>
);

export default RegistryGiftConfirmation;

const body: React.CSSProperties = {
  backgroundColor: '#0A0A0A',
  margin: '0 auto',
  padding: '60px 20px',
  maxWidth: '560px',
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const label: React.CSSProperties = {
  color: '#A3A3A3',
  fontSize: '10px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  textAlign: 'center',
  margin: '0 0 16px',
};

const title: React.CSSProperties = {
  color: '#D4A845',
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: '28px',
  textAlign: 'center',
  margin: '0 0 32px',
  fontWeight: 'normal',
};

const message: React.CSSProperties = {
  color: '#D4D4D4',
  fontFamily: 'Georgia, serif',
  fontSize: '15px',
  lineHeight: '1.8',
  textAlign: 'center',
  margin: '0 0 28px',
};

const itemHighlight: React.CSSProperties = {
  color: '#D4A845',
};

const card: React.CSSProperties = {
  backgroundColor: '#1A1A1A',
  border: '1px solid #2A2A2A',
  borderRadius: '8px',
  padding: '20px 24px',
  marginBottom: '28px',
  textAlign: 'center',
};

const cardLabel: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '9px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  margin: '0 0 10px',
};

const address: React.CSSProperties = {
  color: '#FFFFFF',
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-line',
};

const footer: React.CSSProperties = {
  color: '#666666',
  fontSize: '12px',
  fontFamily: 'Georgia, serif',
  fontStyle: 'italic',
  textAlign: 'center',
  marginTop: '40px',
  lineHeight: '1.8',
  whiteSpace: 'pre-line',
};
