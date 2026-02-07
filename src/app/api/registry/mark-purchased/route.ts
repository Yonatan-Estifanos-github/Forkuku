import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use admin client to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, message } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Your name is required' },
        { status: 400 }
      );
    }

    // Update the registry item
    const { data, error } = await supabaseAdmin
      .from('registry_items')
      .update({
        is_purchased: true,
        purchaser_name: name.trim(),
        purchaser_email: email?.trim() || null,
        purchaser_message: message?.trim() || null,
      })
      .eq('id', id)
      .eq('is_purchased', false) // Only update if not already purchased
      .select()
      .single();

    if (error) {
      console.error('Error marking item as purchased:', error);
      return NextResponse.json(
        { error: 'Failed to mark item as purchased' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Item not found or already purchased' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item marked as purchased',
      item: data,
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
