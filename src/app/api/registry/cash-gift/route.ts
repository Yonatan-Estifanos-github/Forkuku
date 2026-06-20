import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import * as React from 'react';
import { CashGiftAlert } from '@/emails/CashGiftAlert';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'yonatanestifanos58850@gmail.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, giftType } = body as {
      name: string;
      email?: string;
      message?: string;
      giftType: 'cashapp' | 'venmo';
    };

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!giftType || !['cashapp', 'venmo'].includes(giftType)) {
      return NextResponse.json({ error: 'Invalid gift type' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const platform = giftType === 'cashapp' ? 'Cash App' : 'Venmo';

    const html = await render(
      React.createElement(CashGiftAlert, {
        giftType,
        senderName: name.trim(),
        senderEmail: email?.trim() || undefined,
        message: message?.trim() || undefined,
      })
    );

    const { error } = await resend.emails.send({
      from: 'Yonatan & Saron (No Reply) <wedding@theestifanos.com>',
      to: ADMIN_EMAIL,
      subject: `💸 Cash Gift via ${platform} — ${name.trim()}`,
      html,
    });

    if (error) {
      console.error('Resend error (cash gift alert):', error);
      return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Cash gift route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
