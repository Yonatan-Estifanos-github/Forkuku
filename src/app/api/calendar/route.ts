import { NextResponse } from 'next/server';
import { buildIcsContent } from '@/lib/calendar';

export async function GET() {
  return new NextResponse(buildIcsContent(), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="yonatan-and-saron-wedding.ics"',
    },
  });
}
