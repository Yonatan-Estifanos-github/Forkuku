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

    // Atomic update: only succeeds if has_responded is still false
    // This prevents race conditions where two requests try to submit simultaneously
    const { data: updatedParty, error: partyError } = await supabaseAdmin
      .from('parties')
      .update({
        email,
        phone,
        status: 'replied',
        has_responded: true,
        admin_notes: message ? `User Message: ${message}` : undefined
      })
      .eq('id', party_id)
      .eq('has_responded', false)
      .select('id')
      .maybeSingle();

    if (partyError) {
      console.error('Error updating party:', partyError);
      return NextResponse.json({ error: 'Failed to update RSVP' }, { status: 500 });
    }

    // If no rows updated, either party doesn't exist or already responded
    if (!updatedParty) {
      return NextResponse.json({ error: 'RSVP has already been submitted or party not found' }, { status: 400 });
    }

    // 2. Update Guests (all in a single transaction via RPC)
    if (guests && Array.isArray(guests) && guests.length > 0) {
      // Validate that all guest IDs belong to this party
      const guestIds = guests.map((g: { id: string }) => g.id);
      const { data: validGuests, error: validationError } = await supabaseAdmin
        .from('guests')
        .select('id')
        .eq('party_id', party_id)
        .in('id', guestIds);

      if (validationError) {
        console.error('Error validating guests:', validationError);
        return NextResponse.json({ error: 'Failed to validate guests' }, { status: 500 });
      }

      // Check that all submitted guest IDs were found for this party
      if (!validGuests || validGuests.length !== guestIds.length) {
        console.error('Guest ID mismatch: some guests do not belong to this party');
        return NextResponse.json({ error: 'Invalid guest data' }, { status: 400 });
      }

      const { error: guestError } = await supabaseAdmin.rpc('update_guests_for_party', {
        p_party_id: party_id,
        p_guests: guests.map((g: { id: string; is_attending: boolean; name: string }) => ({
          id: g.id,
          is_attending: g.is_attending,
          name: g.name
        }))
      });

      if (guestError) {
        console.error('Error updating guests:', guestError);
        throw guestError;
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
