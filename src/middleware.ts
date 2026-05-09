import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const sitePassword = process.env.SITE_PASSWORD;

  // ── Paths excluded from password protection (checked first) ─────────────
  // Must be before magic-link checks so ?token= on /api/* isn't intercepted.
  const excludedPaths = [
    '/_next', '/api', '/static', '/login', '/admin',
    '/legal', '/sms-optin-info', '/favicon.ico', '/images', '/audio', '/fonts', '/textures', '/videos',
    '/sms-opt-in-proof.jpg',
  ];

  if (excludedPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ── Already authenticated: let them through regardless of query params ───
  const accessTokenEarly  = request.cookies.get('site-access-token')?.value;
  const entryGrantedEarly = request.cookies.get('site-entry-granted')?.value;
  if (sitePassword && accessTokenEarly === sitePassword && entryGrantedEarly === '1') {
    const res = NextResponse.next();
    res.cookies.delete('site-entry-granted');
    return res;
  }

  // ── Token-based magic link: ?token=<uuid> ────────────────────────────────
  // Opaque invite token — no password exposed in URL.
  const inviteToken = searchParams.get('token');
  if (inviteToken && pathname !== '/login') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('token', inviteToken);
    return NextResponse.redirect(loginUrl);
  }

  // ── Legacy magic link: ?pwd= or ?partyId= ────────────────────────────────
  const magicPwd = searchParams.get('pwd');
  const partyId  = searchParams.get('partyId');

  if (magicPwd || partyId) {
    if (pathname !== '/login') {
      const loginUrl = new URL('/login', request.url);
      if (magicPwd) loginUrl.searchParams.set('pwd', magicPwd);
      if (partyId) loginUrl.searchParams.set('partyId', partyId);
      return NextResponse.redirect(loginUrl);
    }
    // If already on /login, just let it through
  }

  // If no password is configured, allow access (development fallback)
  if (!sitePassword) {
    return NextResponse.next();
  }

  // ── Standard cookie-based auth ───────────────────────────────────────────
  const accessToken  = request.cookies.get('site-access-token')?.value;
  const entryGranted = request.cookies.get('site-entry-granted')?.value;

  // If we have the token AND just logged in (entryGranted), let them in
  // but delete the entry-granted signal so a refresh bounces them back to login.
  if (accessToken === sitePassword && entryGranted === '1') {
    const res = NextResponse.next();
    res.cookies.delete('site-entry-granted');
    return res;
  }

  // Otherwise, bounce to login. 
  // The login page will see 'site-access-token' and pre-fill the password.
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
