import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths to exclude from password protection
  const excludedPaths = [
    '/_next',
    '/api',
    '/static',
    '/login',
    '/admin',
    '/legal',
    '/favicon.ico',
    '/images',
    '/audio',
    '/fonts',
    '/textures',
    '/videos',
  ];

  // Check if the path should be excluded
  const isExcluded = excludedPaths.some((path) => pathname.startsWith(path));

  if (isExcluded) {
    return NextResponse.next();
  }

  // Check for the site access token cookie
  const sitePassword = process.env.SITE_PASSWORD;
  const accessToken = request.cookies.get('site-access-token')?.value;

  // If no password is set, allow access (development fallback)
  if (!sitePassword) {
    return NextResponse.next();
  }

  // If cookie matches password, allow access
  if (accessToken === sitePassword) {
    return NextResponse.next();
  }

  // Redirect to login page
  const loginUrl = new URL('/login', request.url);
  return NextResponse.redirect(loginUrl);
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
