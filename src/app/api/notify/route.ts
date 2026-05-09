import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import * as React from 'react';
import twilio from 'twilio';
import { supabaseAdmin } from '@/lib/supabase';
import { getCampaign } from '@/config/campaigns';
import { FormalInvite } from '@/emails/FormalInvite';
import { SaveTheDate } from '@/emails/SaveTheDate';
import { PhotoSaveTheDate } from '@/emails/PhotoSaveTheDate';
import { GenericTemplate } from '@/emails/GenericTemplate';

const SUBJECTS: Record<string, string> = {
  'save-the-date':       'Save the Date — Yonatan & Saron · September 4, 2026',
  'formal-invitation':   'You are invited to the wedding of Yonatan & Saron',
  'rsvp-reminder':       'Reminder: RSVP by June 1st — Yonatan & Saron',
  'logistics-update':    'Wedding Week Details — Yonatan & Saron',
  'day-of-alert':        'Day-of Update — Yonatan & Saron',
  'thank-you':           'Thank You — Yonatan & Saron',
};

const BASE_URL = 'https://theestifanos.com';
const PWD = 'Matthew19:6';
const COMPLIANCE = 'You are subscribed to receive wedding updates. Message frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to opt out.';

function buildSmsBody(campaignId: string, guestName: string, partyId: string): string {
  const magicLink = `${BASE_URL}/?pwd=${PWD}&partyId=${partyId}`;

  switch (campaignId) {
    case 'save-the-date':
      return [
        'SAVE THE DATE',
        '',
        'Yonatan & Saron',
        'SEPTEMBER 4, 2026',
        'WRIGHTSVILLE, PENNSYLVANIA',
        '',
        `${guestName},`,
        '',
        "We are overjoyed to invite you to celebrate the beginning of our forever. God has been so faithful in bringing us together, and we couldn't imagine stepping into this marriage covenant without our favorite people in the room. To receive your formal invitation with the exact location and weekend details, please register your attendance on our website by June 1st.",
        '',
        'Website Password: Matthew19:6',
        `RSVP: ${magicLink}`,
        '',
        COMPLIANCE,
      ].join('\n');

    case 'formal-invitation':
      return [
        'FORMAL INVITATION',
        '',
        'Yonatan & Saron',
        'SEPTEMBER 4, 2026  ·  WRIGHTSVILLE, PA',
        '',
        `Dear ${guestName},`,
        '',
        "With joyful hearts and overwhelming gratitude for what the Lord has done, we are so excited to invite you to celebrate our marriage.",
        '',
        "Your love, prayers, and support have deeply shaped our story. From the long-distance days to the quiet moments of faith that brought us here, you have been our village. We truly cannot imagine stepping into this next chapter without you by our side.",
        '',
        `RSVP & Explore Our Story: ${magicLink}`,
        '',
        COMPLIANCE,
      ].join('\n');

    case 'rsvp-reminder':
      return [
        'RSVP REMINDER',
        '',
        `${guestName},`,
        '',
        `This is a friendly reminder to RSVP for Yonatan & Saron's wedding by June 1st, 2026. We'd love to know if you can make it!`,
        '',
        `RSVP here: ${magicLink}`,
        '',
        COMPLIANCE,
      ].join('\n');

    case 'logistics-update':
      return [
        'WEDDING WEEK DETAILS',
        '',
        'Yonatan & Saron · September 4, 2026',
        '',
        `${guestName},`,
        '',
        "Here are the details you'll need for the big weekend. Visit our website for parking, hotel accommodations, and the full day-of schedule.",
        '',
        `Details: ${magicLink}`,
        '',
        COMPLIANCE,
      ].join('\n');

    case 'day-of-alert':
      return [
        'TODAY IS THE DAY!',
        '',
        "We're so excited to celebrate with you today! Check our website for any last-minute updates.",
        '',
        `Updates: ${magicLink}`,
        '',
        COMPLIANCE,
      ].join('\n');

    case 'thank-you':
      return [
        'THANK YOU',
        '',
        `${guestName},`,
        '',
        "Thank you so much for celebrating our wedding with us. Your presence, love, and support meant everything. We are so grateful to have you in our lives.",
        '',
        '— Yonatan & Saron',
        '',
        COMPLIANCE,
      ].join('\n');

    default:
      return `Update from Yonatan & Saron. Visit: ${magicLink}\n\n${COMPLIANCE}`;
  }
}

const GENERIC_CONTENT: Record<string, { heading: string; body: string }> = {
  'rsvp-reminder': {
    heading: 'Please RSVP by June 1st',
    body: 'This is a friendly reminder to RSVP for Yonatan & Saron\'s wedding by June 1st, 2026. We\'d love to know if you can make it!',
  },
  'logistics-update': {
    heading: 'Wedding Week Logistics',
    body: 'Here are the details you\'ll need for the big weekend. Visit our website for parking, hotel accommodations, and the full day-of schedule.',
  },
  'day-of-alert': {
    heading: 'Today is the Day!',
    body: 'We\'re so excited to celebrate with you today! Check our website for any last-minute updates.',
  },
  'thank-you': {
    heading: 'Thank You',
    body: 'Thank you so much for celebrating our wedding with us. Your presence, love, and support meant everything. We are so grateful to have you in our lives.',
  },
};

export async function POST(req: Request) {
  try {
    const { partyId, campaignId, channel } = await req.json();

    if (!partyId || !campaignId) {
      return NextResponse.json({ error: 'partyId and campaignId are required' }, { status: 400 });
    }

    // channel: 'email' | 'sms' | undefined (undefined = send both)
    const sendEmail = !channel || channel === 'email';
    const sendSms   = !channel || channel === 'sms';

    if (!supabaseAdmin) {
      console.error('Supabase admin client not initialised — SUPABASE_SERVICE_ROLE_KEY missing');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // ── Fetch party + guests ──
    const { data: party, error: partyError } = await supabaseAdmin
      .from('parties')
      .select('id, party_name, emails, phones, guests(id, name, email)')
      .eq('id', partyId)
      .single();

    if (partyError || !party) {
      console.error('Party fetch error:', partyError);
      return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    }

    const campaign = getCampaign(campaignId);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaign.disabled) {
      return NextResponse.json({ error: 'This campaign is currently locked' }, { status: 403 });
    }

    // Identify all recipients
    interface Recipient {
      email: string;
      name: string;
    }
    interface GuestInfo {
      name?: string;
      email?: string;
    }
    const recipients: Recipient[] = [];

    // 1. Add guests with specific emails
    if (party.guests && Array.isArray(party.guests)) {
      (party.guests as GuestInfo[]).forEach((g) => {
        if (g.email && g.email.includes('@')) {
          recipients.push({ email: g.email, name: g.name || party.party_name });
        }
      });
    }

    // 2. Fallback to party-level emails if no guest-specific emails found
    if (recipients.length === 0 && party.emails && Array.isArray(party.emails)) {
      const fallbackName = (party.guests as GuestInfo[])?.[0]?.name || party.party_name || 'Friend';
      party.emails.forEach((e: string) => {
        if (e && e.includes('@')) {
          recipients.push({ email: e, name: fallbackName });
        }
      });
    }

    const subject = SUBJECTS[campaignId] || 'An update from Yonatan & Saron';
    const logEntries: { channel: string; status: string }[] = [];

    // ── Email ──
    if (sendEmail && recipients.length > 0 && campaign.priority !== 'sms') {
      let sentCount = 0;
      let failCount = 0;

      for (const recipient of recipients) {
        const guestName = recipient.name;
        let html = '';

        if (campaign.emailTemplate === 'FormalInvite') {
          html = await render(React.createElement(FormalInvite, { guestName, partyId }));
        } else if (campaign.emailTemplate === 'SaveTheDate') {
          html = await render(React.createElement(SaveTheDate, { guestName, partyId }));
        } else if (campaign.emailTemplate === 'PhotoSaveTheDate') {
          html = await render(React.createElement(PhotoSaveTheDate, { guestName, partyId }));
        } else {
          const content = GENERIC_CONTENT[campaignId] || {
            heading: 'Update from Yonatan & Saron',
            body: 'Visit our website for the latest details.',
          };
          html = await render(
            React.createElement(GenericTemplate, {
              heading: content.heading,
              body: `Dear ${guestName}, ${content.body}`,
              partyId,
            })
          );
        }

        const { error: emailError } = await resend.emails.send({
          from: 'Yonatan & Saron (No Reply) <wedding@theestifanos.com>',
          to: recipient.email,
          subject,
          html,
        });

        if (emailError) {
          console.error(`Resend error for ${recipient.email}:`, emailError);
          failCount++;
        } else {
          sentCount++;
        }
      }

      const finalStatus = failCount === 0 ? 'sent' : sentCount > 0 ? 'partial' : 'failed';
      logEntries.push({ channel: 'email', status: finalStatus });

      await supabaseAdmin.from('campaign_logs').insert({
        party_id: partyId,
        campaign_id: campaignId,
        channel: 'email',
        status: finalStatus,
        sent_at: new Date().toISOString(),
      });

      if (finalStatus === 'failed') {
        return NextResponse.json({ error: 'Email send failed for all recipients' }, { status: 500 });
      }
    }

    // ── SMS ──
    if (sendSms && campaign.priority !== 'email') {
      const usPhones = (party.phones as string[] || []).filter(
        (p) => p && (p.startsWith('+1') || (p.replace(/\D/g, '').length === 11 && p.replace(/\D/g, '').startsWith('1')))
      );

      if (usPhones.length > 0 && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        let smsSentCount = 0;
        let smsFailCount = 0;

        // Use first guest name for personalization
        const guestName = (party.guests as { name?: string }[])?.[0]?.name || party.party_name || 'Friend';
        const smsBody = buildSmsBody(campaignId, guestName, partyId);

        for (const phone of usPhones) {
          try {
            await twilioClient.messages.create({
              to: phone,
              messagingServiceSid: 'MG0851f4936a77e5efd5c0f1d4b69eed14',
              body: smsBody,
              ...(campaign.smsMediaUrl ? { mediaUrl: [campaign.smsMediaUrl] } : {}),
            });
            smsSentCount++;
          } catch (smsErr) {
            console.error(`Twilio error for ${phone}:`, smsErr);
            smsFailCount++;
          }
        }

        const smsStatus = smsFailCount === 0 ? 'sent' : smsSentCount > 0 ? 'partial' : 'failed';
        logEntries.push({ channel: 'sms', status: smsStatus });

        await supabaseAdmin.from('campaign_logs').insert({
          party_id: partyId,
          campaign_id: campaignId,
          channel: 'sms',
          status: smsStatus,
          sent_at: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({ success: true, results: logEntries });

  } catch (err) {
    console.error('Notify API unhandled error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
