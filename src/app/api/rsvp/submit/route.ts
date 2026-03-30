import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
import RSVPConfirmation from '@/emails/RSVPConfirmation';

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

    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

    // Fetch current contact arrays so we can merge without duplicates
    const { data: currentParty } = await supabaseAdmin
      .from('parties')
      .select('emails, phones, party_name')
      .eq('id', party_id)
      .single();

    const existingEmails: string[] = currentParty?.emails || [];
    const existingPhones: string[] = currentParty?.phones || [];
    const mergedEmails = email && !existingEmails.includes(email)
      ? [...existingEmails, email]
      : existingEmails;
    const mergedPhones = phone && !existingPhones.includes(phone)
      ? [...existingPhones, phone]
      : existingPhones;

    // Atomic update: only succeeds if has_responded is still false
    // This prevents race conditions where two requests try to submit simultaneously
    const { data: updatedParty, error: partyError } = await supabaseAdmin
      .from('parties')
      .update({
        emails: mergedEmails,
        phones: mergedPhones,
        status: 'replied',
        has_responded: true,
        admin_notes: message ? `User Message: ${message}` : undefined
      })
      .eq('id', party_id)
      .eq('has_responded', false)
      .select('id, party_name, emails, guests(email)')
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
        p_guests: guests.map((g: { id: string; is_attending: boolean; name: string; dietary_notes?: string }) => ({
          id: g.id,
          is_attending: g.is_attending,
          name: g.name,
          dietary_notes: g.dietary_notes
        }))
      });

      if (guestError) {
        console.error('Error updating guests:', guestError);
        throw guestError;
      }
    }

    // 3. Send Internal Alert and Guest Confirmation
    if (resend) {
      interface GuestResponse {
        name: string;
        is_attending: boolean;
        dietary_notes?: string;
      }
      const attending = (guests as GuestResponse[]).filter(g => g.is_attending).map(g => g.name);
      const declined = (guests as GuestResponse[]).filter(g => !g.is_attending).map(g => g.name);
      const dietary = (guests as GuestResponse[]).filter(g => g.dietary_notes).map(g => `${g.name}: ${g.dietary_notes}`);

      // Internal Alert
      await resend.emails.send({
        from: 'RSVP Alert <notifications@theestifanos.com>',
        to: 'theestifanos@gmail.com',
        subject: `New RSVP: The ${updatedParty.party_name} Family`,
        html: `
          <h1>New RSVP Submission</h1>
          <p><strong>Party:</strong> ${updatedParty.party_name}</p>
          <p><strong>Attending:</strong> ${attending.length > 0 ? attending.join(', ') : 'None'}</p>
          <p><strong>Declined:</strong> ${declined.length > 0 ? declined.join(', ') : 'None'}</p>
          ${dietary.length > 0 ? `<p><strong>Dietary Restrictions:</strong><br/>${dietary.join('<br/>')}</p>` : ''}
          ${message ? `<p><strong>Message for Couple:</strong><br/>"${message}"</p>` : ''}
          <p><a href="https://theestifanos.com/admin">View in Dashboard</a></p>
        `
      }).catch(err => console.error('Internal Alert Error:', err));

      // Guest Confirmation (send to all unique emails in party and guests)
      const allEmails = new Set<string>();
      if (updatedParty.emails) updatedParty.emails.forEach(e => e && e.includes('@') && allEmails.add(e.toLowerCase()));
      
      interface GuestWithEmail {
        email?: string;
      }
      if (updatedParty.guests) (updatedParty.guests as GuestWithEmail[]).forEach(g => g.email && g.email.includes('@') && allEmails.add(g.email.toLowerCase()));

      for (const guestEmail of Array.from(allEmails)) {
        await resend.emails.send({
          from: 'Yonatan & Saron (No Reply) <hello@theestifanos.com>',
          to: guestEmail,
          subject: 'RSVP Confirmed — Yonatan & Saron',
          react: RSVPConfirmation({
            guests: guests
          })
        }).catch(err => console.error(`Guest Confirmation Error (${guestEmail}):`, err));
      }
    }

    // 4. Create Audit Log
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
