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

  // ── Magic Link: intercept ?pwd= or ?partyId on any path ──────────────────
  // If magic params are present, we want to ensure the user ends up on /login
  // so they can see the "VIP" welcome message and intentionally enter.
  const magicPwd = searchParams.get('pwd');
  const partyId  = searchParams.get('partyId');

  if (magicPwd || partyId) {
    if (pathname !== '/login') {
      const loginUrl = new URL('/login', request.url);
      if (magicPwd) loginUrl.searchParams.set('pwd', magicPwd);
      if (partyId) loginUrl.searchParams.set('partyId', partyId);
      return NextResponse.redirect(loginUrl);
    }
    // If already on /login, just let it through (will be handled by excludedPaths)
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

  if (accessToken === sitePassword) {
    return NextResponse.next();
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
