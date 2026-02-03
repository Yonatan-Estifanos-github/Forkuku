import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { party_id, email, phone, message, guests } = await req.json();

    if (!party_id) {
      return NextResponse.json({ error: 'Party ID is required' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      console.error('Supabase Admin client not initialized');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Check if party has already responded
    const { data: existingParty, error: fetchError } = await supabaseAdmin
      .from('parties')
      .select('has_responded')
      .eq('id', party_id)
      .single();

    if (fetchError) {
      console.error('Error fetching party:', fetchError);
      return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    }

    if (existingParty?.has_responded) {
      return NextResponse.json({ error: 'RSVP has already been submitted for this party' }, { status: 400 });
    }

    // 1. Update Party Details
    // We update status to 'replied' and has_responded to true.
    // We store the message in admin_notes.
    const { error: partyError } = await supabaseAdmin
      .from('parties')
      .update({
        email,
        phone,
        status: 'replied',
        has_responded: true,
        admin_notes: message ? `User Message: ${message}` : undefined
      })
      .eq('id', party_id);

    if (partyError) {
      console.error('Error updating party:', partyError);
      throw partyError;
    }

    // 2. Update Guests
    if (guests && Array.isArray(guests)) {
      for (const guest of guests) {
        // Ensure we only update guests belonging to this party
        const { error: guestError } = await supabaseAdmin
          .from('guests')
          .update({
            is_attending: guest.is_attending,
            name: guest.name // Important for Plus Ones whose names might be added
          })
          .eq('id', guest.id)
          .eq('party_id', party_id);

        if (guestError) {
          console.error(`Error updating guest ${guest.id}:`, guestError);
          throw guestError;
        }
      }
    }

    // 3. Create Audit Log
    const { error: auditError } = await supabaseAdmin
      .from('audit_logs')
      .insert({
        party_id,
        action: 'RSVP_SUBMITTED',
        details: {
          email,
          phone,
          message,
          guests_updated: guests?.length || 0
        }
      });

    if (auditError) {
      console.warn('Failed to create audit log (non-critical):', auditError);
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Submit API unhandled error:', err);
    return NextResponse.json({ error: 'Failed to submit RSVP' }, { status: 500 });
  }
}
