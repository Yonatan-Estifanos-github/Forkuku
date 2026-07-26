---
name: notifications
description: Builds and debugs email/SMS notification code in this repo — campaign sends from the admin dashboard, transactional confirmations (registry gifts, RSVP), and anything touching Resend or Twilio. Use when adding a new campaign, changing message copy, or fixing a notification bug. Encodes this repo's actual (non-obvious) wiring rather than generic Resend/Twilio advice.
tools: Read, Write, Edit, Grep, Glob, Bash
---

You work on the notification system for the Estifanos Wedding site. There are **two distinct, differently-wired notification paths** in this repo — know which one you're touching before changing anything.

## Path A: Campaigns (admin-triggered, bulk)

Flow: `src/app/admin/page.tsx` (campaign dropdown + send buttons) → `POST /api/notify` (`src/app/api/notify/route.ts`) → Resend (email) and/or Twilio (SMS).

- `src/config/campaigns.ts` defines the `CAMPAIGNS` array (id, label, `emailTemplate` name, `priority`, `disabled`) — this is what the admin dropdown reads.
- **`campaigns.ts`'s `smsBody` field is dead — route.ts never reads it.** The actual SMS copy per campaign lives in a separate hardcoded `buildSmsBody()` switch statement inside `route.ts`. If you're asked to change a campaign's SMS text, edit `buildSmsBody` in `route.ts`, not the `smsBody` string in `campaigns.ts` — editing only the config file will silently do nothing.
- Adding a brand-new campaign touches **all** of these, in `campaigns.ts` and `route.ts` — miss one and it'll partially work:
  1. `campaigns.ts`: add to `CAMPAIGNS[]` (id, label, emailTemplate, priority)
  2. `route.ts`: add a `SUBJECTS[id]` entry
  3. `route.ts`: add a case to `buildSmsBody()` for the SMS copy
  4. If reusing `GenericTemplate` for email: add a `GENERIC_CONTENT[id]` entry (heading/body) in `route.ts`
  5. If it needs its own email design: create a new component in `src/emails/` and wire it into the `campaign.emailTemplate === '...'` branch in `route.ts`
- `campaign.disabled: true` in `campaigns.ts` is the only lock — the admin dropdown still *shows* disabled campaigns (labeled "(Locked)"), but `route.ts` rejects the send with a 403. To enable one, just flip the flag; no other wiring needed.
- **The `has_responded` override**: regardless of which campaign was requested, if the party has already RSVPed, the SMS branch throws away the requested campaign message and sends a hardcoded "thanks for RSVPing" / "we'll miss you" acknowledgment instead (`buildAlreadyRsvpedSmsBody`). This is intentional and is what the admin's "Resend RSVP confirmation" button relies on (it just calls `campaignId: 'save-the-date'` and lets this override kick in) — don't "fix" this thinking it's a bug unless asked to change that behavior specifically.
- Every send writes exactly **one aggregate row to `campaign_logs`** per channel per call (`sent`/`partial`/`failed`) — not one row per recipient. Don't assume you can count individual sends from `campaign_logs`.
- Magic links: prefer the token link (`?token=<invite_token>`) if the party has one, else fall back to `?pwd=Matthew19:6&partyId=<id>`. Keep both branches if you touch link-building code — some parties still only have the legacy link.

## Path B: Transactional (inline, triggered by a specific user action)

Flow: a feature's own API route (e.g. `src/app/api/registry/mark-purchased/route.ts`) sends its emails/SMS directly and inline — no `campaigns.ts`, no `campaign_logs` row, no `/api/notify` involved.

- Pattern to follow: construct the email component, `render()` it, `resend.emails.send()`, and separately build the SMS body and `twilioClient.messages.create()` — all wrapped so failures are caught and logged, **never thrown** (a failed email/SMS must not fail the parent action, e.g. marking a gift purchased). Look at `mark-purchased/route.ts` as the reference implementation.
- Phone numbers must be normalized to E.164 before calling Twilio (10-digit US → `+1XXXXXXXXXX`; see `toE164()` in `mark-purchased/route.ts`) — Path A does its own separate US-number filtering, don't assume the two paths share a normalization helper.
- Both paths currently hardcode the same Twilio `messagingServiceSid` (`MG0851f4936a77e5efd5c0f1d4b69eed14`) independently in multiple files. If this ever needs to change, grep for it — there is no shared constant.

## Schema notes (don't trust the README here)

- The `parties` table actually has **array** columns `emails` and `phones` plus an `invite_token` column — the README/CLAUDE.md schema section only documents singular `email`/`phone` and is stale. Verify against Supabase (`list_tables`) if a query against `parties` isn't returning what you expect.

## Before finishing any task

1. If you changed campaign SMS copy, confirm you edited `buildSmsBody()` in `route.ts`, not (only) `campaigns.ts`.
2. If you added a campaign, confirm all 4 wiring points above are done (CAMPAIGNS entry, SUBJECTS entry, buildSmsBody case, template/content wiring).
3. If you touched a transactional send, confirm failures are caught non-blockingly and never bubble up to fail the parent request.
4. If you touched phone handling, confirm numbers are normalized/filtered to valid US E.164 before hitting Twilio.
5. Run `npm run lint` before considering the change done.
