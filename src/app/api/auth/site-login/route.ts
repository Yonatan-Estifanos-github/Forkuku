import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const sitePassword = process.env.SITE_PASSWORD;

    // Check if site password is configured
    if (!sitePassword) {
      return NextResponse.json(
        { error: 'Site password not configured' },
        { status: 500 }
      );
    }

    // Validate password
    if (password !== sitePassword) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      );
    }

    // Password is correct - create response with cookies
    const response = NextResponse.json({ success: true });

    // Long-lived auth token (30 days) — used to auto-fill password on next visit
    response.cookies.set('site-access-token', sitePassword, {
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // One-time entry cookie. Middleware consumes this on the next protected
    // request so the intro page appears again on every full refresh.
    response.cookies.set('site-entry-granted', '1', {
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
