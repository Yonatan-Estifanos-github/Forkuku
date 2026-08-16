// Single source of truth for the ceremony event details used by the
// Add to Calendar feature (Google Calendar link + downloadable .ics),
// consumed by both the light-mode website section and the Formal
// Invitation email/SMS. Times are stored in UTC to avoid needing a
// VTIMEZONE block in the .ics file — Wrightsville, PA is on EDT
// (UTC-4) in September, so 2:30 PM/10:30 PM local is 18:30/02:30(+1) UTC.
export const WEDDING_EVENT = {
  title: 'Yonatan & Saron’s Wedding',
  description: 'We can’t wait to celebrate with you! Guests welcomed at 2:30 PM, ceremony at 3:00 PM.',
  location: 'Lauxmont Gardens (Japanese Garden), 1155 Long Level Road, Wrightsville, PA 17368',
  startUtc: '2026-09-04T18:30:00Z',
  endUtc: '2026-09-05T02:30:00Z',
};
