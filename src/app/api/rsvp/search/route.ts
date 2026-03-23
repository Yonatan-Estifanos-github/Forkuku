import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      console.error('Supabase Admin client not initialized. Check server environment variables.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const searchTerm = name.toLowerCase().trim();

    // Query parties where search_tags (array) contains the searchTerm
    const { data: parties, error } = await supabaseAdmin
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
      .contains('search_tags', [searchTerm]);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!parties || parties.length === 0) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    // Return array of all matching parties (caller handles disambiguation)
    return NextResponse.json({ parties });

  } catch (err) {
    console.error('Search API unhandled error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
