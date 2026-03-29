import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Fetch a full party + guests by party UUID (used by the vip_party_id cookie)
export async function POST(req: Request) {
  try {
    const { partyId } = await req.json();

    if (!partyId || typeof partyId !== 'string') {
      return NextResponse.json({ error: 'partyId required' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const { data: party, error } = await supabaseAdmin
      .from('parties')
      .select(`
        id,
        party_name,
        status,
        has_responded,
        guests (
          id,
          name,
          is_attending,
          is_plus_one
        )
      `)
      .eq('id', partyId)
      .single();

    if (error || !party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    }

    return NextResponse.json({ party });
  } catch (err) {
    console.error('lookup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
