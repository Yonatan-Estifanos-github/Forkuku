import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import * as React from 'react';
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
    const { partyId, campaignId } = await req.json();

    if (!partyId || !campaignId) {
      return NextResponse.json({ error: 'partyId and campaignId are required' }, { status: 400 });
    }

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
    const recipients: Recipient[] = [];

    // 1. Add guests with specific emails
    if (party.guests && Array.isArray(party.guests)) {
      party.guests.forEach((g: any) => {
        if (g.email && g.email.includes('@')) {
          recipients.push({ email: g.email, name: g.name || party.party_name });
        }
      });
    }

    // 2. Fallback to party-level emails if no guest-specific emails found
    if (recipients.length === 0 && party.emails && Array.isArray(party.emails)) {
      const fallbackName = (party.guests as any[])?.[0]?.name || party.party_name || 'Friend';
      party.emails.forEach((e: string) => {
        if (e && e.includes('@')) {
          recipients.push({ email: e, name: fallbackName });
        }
      });
    }

    const subject = SUBJECTS[campaignId] || 'An update from Yonatan & Saron';
    const logEntries: { channel: string; status: string }[] = [];

    // ── Email ──
    if (recipients.length > 0 && campaign.priority !== 'sms') {
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

    return NextResponse.json({ success: true, results: logEntries });

  } catch (err) {
    console.error('Notify API unhandled error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
