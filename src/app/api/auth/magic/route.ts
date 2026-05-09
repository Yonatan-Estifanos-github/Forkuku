import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/auth/magic?token=<uuid>
// Validates an invite token and returns the associated partyId.
// Does NOT set auth cookies — the normal login flow handles that.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from('parties')
    .select('id')
    .eq('invite_token', token)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 404 });
  }

  return NextResponse.json({ partyId: data.id });
}
