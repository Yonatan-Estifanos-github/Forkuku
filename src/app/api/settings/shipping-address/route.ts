import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET() {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'shipping_address')
      .single();

    if (error) {
      console.error('Error fetching shipping address:', error);
      return NextResponse.json(
        { error: 'Failed to fetch shipping address' },
        { status: 500 }
      );
    }

    return NextResponse.json(data?.value || null);
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
