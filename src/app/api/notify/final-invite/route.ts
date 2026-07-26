import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getCampaign } from '@/config/campaigns';
import { sendCampaignToParty } from '../route';

const CAMPAIGN_ID = 'final-invite';

interface TargetParty {
  id: string;
  party_name: string;
  emails: string[] | null;
  phones: string[] | null;
}

interface PartyDispatchResult {
  partyId: string;
  partyName: string;
  success: boolean;
  error?: string;
  results?: { channel: string; status: string }[];
}

// Bulk dispatcher for the "Final Invite" campaign. Builds its own target list
// (parties that haven't RSVPed yet) and sends each one through the same
// campaign path as the single-party admin flow (sendCampaignToParty), so the
// has_responded override, campaign_logs bookkeeping, and magic-link fallback
// all behave identically to a one-off /api/notify call.
export async function POST(req: Request) {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase admin client not initialised — SUPABASE_SERVICE_ROLE_KEY missing');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const campaign = getCampaign(CAMPAIGN_ID);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    if (campaign.disabled) {
      return NextResponse.json({ error: 'This campaign is currently locked' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const force: boolean = body?.force === true;
    const channel: 'email' | 'sms' | undefined = body?.channel;

    // Target list: parties that have not yet RSVPed and have some way to reach them.
    const { data: parties, error: partiesError } = await supabaseAdmin
      .from('parties')
      .select('id, party_name, emails, phones')
      .eq('has_responded', false);

    if (partiesError) {
      console.error('Target list fetch error:', partiesError);
      return NextResponse.json({ error: 'Failed to load target list' }, { status: 500 });
    }

    let targets = ((parties || []) as TargetParty[]).filter(
      (p) => (p.emails && p.emails.length > 0) || (p.phones && p.phones.length > 0)
    );

    // Skip parties that already received this campaign, unless explicitly forced.
    if (!force && targets.length > 0) {
      const { data: alreadySent, error: alreadySentError } = await supabaseAdmin
        .from('campaign_logs')
        .select('party_id')
        .eq('campaign_id', CAMPAIGN_ID)
        .in('status', ['sent', 'partial'])
        .in('party_id', targets.map((p) => p.id));

      if (alreadySentError) {
        console.error('campaign_logs lookup error:', alreadySentError);
        return NextResponse.json({ error: 'Failed to check prior sends' }, { status: 500 });
      }

      const sentIds = new Set((alreadySent || []).map((r: { party_id: string }) => r.party_id));
      targets = targets.filter((p) => !sentIds.has(p.id));
    }

    const dispatchResults: PartyDispatchResult[] = [];

    for (const party of targets) {
      const result = await sendCampaignToParty(party.id, CAMPAIGN_ID, channel);
      dispatchResults.push({
        partyId: party.id,
        partyName: party.party_name,
        success: result.success,
        error: result.error,
        results: result.results,
      });
    }

    const sentCount = dispatchResults.filter((r) => r.success).length;
    const failedCount = dispatchResults.length - sentCount;

    return NextResponse.json({
      success: true,
      targeted: targets.length,
      sent: sentCount,
      failed: failedCount,
      results: dispatchResults,
    });

  } catch (err) {
    console.error('Final Invite broadcast unhandled error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
