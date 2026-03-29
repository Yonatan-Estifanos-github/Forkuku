import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { partyId } = await req.json();

    if (!partyId || typeof partyId !== 'string') {
      return NextResponse.json({ error: 'partyId required' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Atomically increment the counter via RPC
    const { error: rpcError } = await supabaseAdmin.rpc('increment_magic_link_clicks', {
      p_party_id: partyId,
    });

    if (rpcError) {
      console.error('RPC error:', rpcError);
      return NextResponse.json({ error: 'Failed to track click' }, { status: 500 });
    }

    // Fetch party_name so the caller can label the cookie
    const { data: party, error: fetchError } = await supabaseAdmin
      .from('parties')
      .select('party_name')
      .eq('id', partyId)
      .single();

    if (fetchError || !party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    }

    return NextResponse.json({ party_name: party.party_name });
  } catch (err) {
    console.error('track-click error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
