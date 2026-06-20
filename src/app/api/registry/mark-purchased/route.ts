import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import * as React from 'react';
import { RegistryPurchaseAlert } from '@/emails/RegistryPurchaseAlert';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'yonatanestifanos58850@gmail.com';

// Lazy init to avoid build-time errors when env vars aren't set
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await request.json();
    const { id, name, email, phone, message } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and phone number are required' },
        { status: 400 }
      );
    }

    // Update the registry item
    const { data, error } = await supabaseAdmin
      .from('registry_items')
      .update({
        is_purchased: true,
        purchaser_name: name.trim(),
        purchaser_email: email.trim(),
        purchaser_phone: phone.trim(),
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

    // Fire admin alert email (non-blocking — don't fail the request if email fails)
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const html = await render(
          React.createElement(RegistryPurchaseAlert, {
            itemName: data.name,
            itemPrice: data.price,
            purchaserName: name.trim(),
            purchaserEmail: email.trim(),
            purchaserPhone: phone.trim(),
            purchaserMessage: message?.trim() || undefined,
          })
        );
        await resend.emails.send({
          from: 'Yonatan & Saron (No Reply) <wedding@theestifanos.com>',
          to: ADMIN_EMAIL,
          subject: `🎁 Registry Gift: ${data.name} — from ${name.trim()}`,
          html,
        });
      } catch (emailErr) {
        console.error('Admin alert email failed (non-fatal):', emailErr);
      }
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
