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

    // 1. Call fuzzy search RPC function
    const { data: fuzzyMatches, error: searchError } = await supabaseAdmin
      .rpc('search_guests_fuzzy', { search_term: searchTerm });

    if (searchError) {
      console.error('Fuzzy search error:', searchError);
      return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }

    if (!fuzzyMatches || fuzzyMatches.length === 0) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    // 2. Fetch full details including guests for the matched IDs
    interface FuzzyMatch {
      id: string;
    }
    const matchedIds = (fuzzyMatches as FuzzyMatch[]).map((m) => m.id);
    const { data: parties, error: fetchError } = await supabaseAdmin
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
      .in('id', matchedIds);

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Sort parties based on the original fuzzy match similarity order
    const sortedParties = parties?.sort((a, b) => 
      matchedIds.indexOf(a.id) - matchedIds.indexOf(b.id)
    );

    // Return array of all matching parties (caller handles disambiguation)
    return NextResponse.json({ parties: sortedParties });

  } catch (err) {
    console.error('Search API unhandled error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
