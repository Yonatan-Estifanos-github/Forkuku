import { WEDDING_EVENT } from '@/config/wedding';

function toIcsUtc(iso: string): string {
  return iso.replace(/[-:]/g, '');
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

export function getGoogleCalendarUrl(): string {
  const { title, description, location, startUtc, endUtc } = WEDDING_EVENT;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${toIcsUtc(startUtc)}/${toIcsUtc(endUtc)}`,
    details: description,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsContent(): string {
  const { title, description, location, startUtc, endUtc } = WEDDING_EVENT;
  const dtstamp = toIcsUtc(new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'));

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Estifanos Wedding//theestifanos.com//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:yonatan-saron-wedding@theestifanos.com',
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${toIcsUtc(startUtc)}`,
    `DTEND:${toIcsUtc(endUtc)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
