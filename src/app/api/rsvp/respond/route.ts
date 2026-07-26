import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

const VIP_COOKIE = 'vip_party_id';

interface Guest {
  id: string;
  name: string;
  is_attending: boolean;
}

// Backs submitRSVP (see src/lib/rsvp.ts) for the simplified single-name
// accept/decline flow. Party identity comes from the vip_party_id cookie
// (the same cookie Rsvp.tsx/lookup already use) since the RSVPPayload
// contract carries only { name, response } — no party/guest id. The
// submitted name is matched against that party's existing guest rows;
// writing an UPDATE to the matched row (never an INSERT) is what keeps
// re-submission idempotent — there's no separate "prior response" table
// to dedupe against, has_responded/is_attending on the existing rows are it.
export async function POST(req: Request) {
  try {
    const { name, response } = await req.json();

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (response !== 'accept' && response !== 'decline') {
      return NextResponse.json({ error: 'Response must be "accept" or "decline"' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      console.error('Supabase Admin client not initialized');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const partyId = cookies().get(VIP_COOKIE)?.value;
    if (!partyId) {
      return NextResponse.json(
        { error: "We couldn't find your invitation. Please search for it first." },
        { status: 404 }
      );
    }

    const { data: party, error: partyError } = await supabaseAdmin
      .from('parties')
      .select('id, guests(id, name, is_attending)')
      .eq('id', partyId)
      .single();

    if (partyError || !party) {
      console.error('Party fetch error:', partyError);
      return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    }

    const searchName = name.trim().toLowerCase();
    const guest = (party.guests as Guest[] || []).find(
      (g) => g.name?.trim().toLowerCase() === searchName
    );

    if (!guest) {
      return NextResponse.json(
        { error: `We couldn't find "${name}" on this invitation.` },
        { status: 404 }
      );
    }

    const isAttending = response === 'accept';

    const { error: guestError } = await supabaseAdmin
      .from('guests')
      .update({ is_attending: isAttending })
      .eq('id', guest.id);

    if (guestError) {
      console.error('Error updating guest:', guestError);
      return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 500 });
    }

    const { error: partyUpdateError } = await supabaseAdmin
      .from('parties')
      .update({ has_responded: true, status: 'replied' })
      .eq('id', partyId);

    if (partyUpdateError) {
      console.error('Error updating party:', partyUpdateError);
      return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 500 });
    }

    const { error: auditError } = await supabaseAdmin.from('audit_logs').insert({
      party_id: partyId,
      action: 'RSVP_QUICK_SUBMITTED',
      details: { guest_id: guest.id, name: guest.name, response },
    });
    if (auditError) {
      console.warn('Failed to create audit log (non-critical):', auditError);
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Respond API unhandled error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
