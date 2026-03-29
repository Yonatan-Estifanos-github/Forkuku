import { NextRequest, NextResponse } from 'next/server';

const COOKIE_OPTS = (maxAge: number) => ({
  path: '/',
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge,
});

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const sitePassword = process.env.SITE_PASSWORD;

  // ── Magic Link: intercept ?pwd= on ANY path ──────────────────────────────
  // Must run before excluded-path checks so guests aren't bounced to /login
  // with their params stripped.
  const magicPwd = searchParams.get('pwd');
  const partyId  = searchParams.get('partyId');

  if (sitePassword && magicPwd === sitePassword) {
    const cleanUrl = new URL('/', request.url);
    const res = NextResponse.redirect(cleanUrl);

    // Auth cookies
    res.cookies.set('site-access-token', sitePassword, COOKIE_OPTS(60 * 60 * 24 * 30));
    res.cookies.set('site-entry-granted', '1',          COOKIE_OPTS(60));

    // VIP party cookies
    if (partyId) {
      res.cookies.set('vip_party_id',     partyId, COOKIE_OPTS(60 * 60 * 24 * 90));
      // Short-lived signal so ConditionalUI can fire the Supabase click tracker
      res.cookies.set('track_magic_click', partyId, COOKIE_OPTS(120));
    }

    return res;
  }

  // ── Paths excluded from password protection ──────────────────────────────
  const excludedPaths = [
    '/_next', '/api', '/static', '/login', '/admin',
    '/legal', '/favicon.ico', '/images', '/audio', '/fonts', '/textures', '/videos',
  ];

  if (excludedPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // If no password is configured, allow access (development fallback)
  if (!sitePassword) {
    return NextResponse.next();
  }

  // ── Standard cookie-based auth ───────────────────────────────────────────
  const accessToken  = request.cookies.get('site-access-token')?.value;
  const entryGranted = request.cookies.get('site-entry-granted')?.value;

  if (accessToken === sitePassword && entryGranted === '1') {
    const res = NextResponse.next();
    res.cookies.delete('site-entry-granted');
    return res;
  }

  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
