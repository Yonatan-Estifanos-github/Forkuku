import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { error } = await supabaseAdmin
      .from('registry_items')
      .update({
        is_purchased: false,
        purchaser_name: null,
        purchaser_email: null,
        purchaser_message: null,
      })
      .eq('id', id);

    if (error) {
      console.error('Undo purchase error:', error);
      return NextResponse.json({ error: 'Failed to undo purchase' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Undo purchase unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
