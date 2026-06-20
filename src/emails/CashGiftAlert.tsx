import {
  Body,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface CashGiftAlertProps {
  giftType: 'cashapp' | 'venmo';
  senderName: string;
  senderEmail?: string;
  message?: string;
}

const HANDLE: Record<string, string> = {
  cashapp: '$theestifanos',
  venmo: '7179635535',
};

export const CashGiftAlert = ({
  giftType,
  senderName,
  senderEmail,
  message,
}: CashGiftAlertProps) => (
  <Html lang="en">
    <Head />
    <Preview>💸 {senderName} sent a cash gift via {giftType === 'cashapp' ? 'Cash App' : 'Venmo'}!</Preview>
    <Body style={body}>
      <Text style={label}>CASH GIFT ALERT</Text>
      <Text style={title}>
        A cash gift was sent via {giftType === 'cashapp' ? 'Cash App' : 'Venmo'}!
      </Text>

      <Section style={card}>
        <Text style={cardLabel}>PLATFORM</Text>
        <Text style={cardValue}>{giftType === 'cashapp' ? 'Cash App' : 'Venmo'}</Text>
        <Text style={cardSub}>{HANDLE[giftType]}</Text>
      </Section>

      <Section style={card}>
        <Text style={cardLabel}>FROM</Text>
        <Text style={cardValue}>{senderName}</Text>
        {senderEmail && (
          <Text style={cardSub}>{senderEmail}</Text>
        )}
      </Section>

      {message && (
        <Section style={card}>
          <Text style={cardLabel}>THEIR NOTE</Text>
          <Text style={noteText}>&ldquo;{message}&rdquo;</Text>
        </Section>
      )}

      <Text style={footer}>Yonatan &amp; Saron · September 4, 2026</Text>
    </Body>
  </Html>
);

export default CashGiftAlert;

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
  fontSize: '26px',
  textAlign: 'center',
  margin: '0 0 40px',
  fontWeight: 'normal',
};

const card: React.CSSProperties = {
  backgroundColor: '#1A1A1A',
  border: '1px solid #2A2A2A',
  borderRadius: '8px',
  padding: '20px 24px',
  marginBottom: '16px',
};

const cardLabel: React.CSSProperties = {
  color: '#D4A845',
  fontSize: '9px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  margin: '0 0 8px',
};

const cardValue: React.CSSProperties = {
  color: '#FFFFFF',
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: '20px',
  margin: '0 0 4px',
  fontWeight: 'normal',
};

const cardSub: React.CSSProperties = {
  color: '#888888',
  fontSize: '13px',
  margin: '0',
};

const noteText: React.CSSProperties = {
  color: '#E5E5E5',
  fontFamily: 'Georgia, serif',
  fontSize: '14px',
  fontStyle: 'italic',
  lineHeight: '1.7',
  margin: '0',
};

const footer: React.CSSProperties = {
  color: '#555555',
  fontSize: '10px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  textAlign: 'center',
  marginTop: '40px',
  margin: '40px 0 0',
};
