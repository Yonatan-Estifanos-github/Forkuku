# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Estifanos Wedding (Forkuku) — a Next.js 14 (App Router) wedding website for Yonatan & Saron (Sept 4, 2026) with a guest-facing cinematic 3D site, RSVP flow, gift registry, and a CRM-style `/admin` dashboard for guest/campaign management. Live at theestifanos.com.

## Commands

- `npm run dev` — start dev server (localhost:3000; admin at `/admin`)
- `npm run lint` — ESLint (`next lint`)

There is no test suite configured (no test script, no test framework in package.json). CI (`.github/workflows/ci.yml`) runs `npm install`, `npm run lint`, `npm run build` on push/PR to `main`.

### Do not run npm locally — this machine has limited resources
Never run `npm install`, `npm run dev`, `npm run build`, `npm run lint`, or any other npm command locally. Commit and push to a branch instead — Vercel builds it automatically, and CI (`.github/workflows/ci.yml`) runs `npm install` + lint + build on the PR. Check results via the Vercel MCP tools (`mcp__vercel__get_deployment`, `mcp__vercel__get_deployment_build_logs`) or GitHub Actions/PR checks, not local commands. To verify a change actually works, use the `claude-in-chrome` browser skill (or computer use) against the resulting preview deployment URL rather than a local dev server.

## Architecture

### Supabase client split (critical)
`src/lib/supabase.ts` exports two clients:
- `supabase` — anon key, respects RLS. Use for client-side reads (e.g. name search).
- `supabaseAdmin` — service-role key, bypasses RLS, only non-null server-side. Use **only** inside Server Actions or `src/app/api/*` routes for writes/updates. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.

Note: several API routes (e.g. `registry/mark-purchased`) construct their own admin client inline via `createClient` rather than importing `supabaseAdmin` — follow that existing pattern in that file rather than mixing approaches within one route.

### Site-wide auth gate (`src/middleware.ts`)
The whole guest site sits behind a password (`SITE_PASSWORD`), enforced by middleware on every path except an explicit excluded list (`/api`, `/admin`, `/login`, static assets, etc.). Two invite mechanisms funnel guests to `/login`:
- New token-based magic link: `?token=<uuid>` → redirected to `/login?token=...`.
- Legacy magic link: `?pwd=` / `?partyId=` query params → redirected to `/login` with those params preserved.

Auth state is cookie-based (`site-access-token`, `site-entry-granted`); the entry-granted cookie is deleted after one pass-through so a page refresh bounces back to `/login`. If `SITE_PASSWORD` is unset, the gate is disabled (dev fallback). When adding new top-level routes that should bypass the password, add them to `excludedPaths` in `middleware.ts`.

### Notification system (email + SMS)
Two independent sender flows, both non-blocking (failures are caught and logged, never fail the parent request):
- **Campaigns** (`src/config/campaigns.ts` + `src/app/api/notify/route.ts`): predefined bulk messages (Save the Date, Formal Invite, RSVP Reminder, Logistics, Day-of Alert, Thank You) sent to parties from the admin dashboard. Each campaign has an SMS body + optional MMS image and an email template name (rendered from `src/emails/*`). All but `save-the-date` are currently `disabled: true`.
- **Transactional** (registry gift purchase, RSVP confirmation, etc.): triggered directly from their API route (e.g. `src/app/api/registry/mark-purchased/route.ts` sends an admin alert email, a buyer confirmation email, and a buyer confirmation SMS in sequence).

Email is Resend + `@react-email/render` rendering components from `src/emails/`. SMS is Twilio, sent via a hardcoded `TWILIO_MESSAGING_SERVICE_SID`; phone numbers are normalized to E.164 (US-only, 10 or 11-digit) before sending.

### Registry / gift flow
`src/app/api/registry/*` (`mark-purchased`, `undo-purchase`, `cash-gift`) mutate the `registry_items` table. Marking an item purchased is guarded with `.eq('is_purchased', false)` in the update so two guests can't claim the same gift concurrently — preserve that guard if touching this logic. Shipping address shown to buyers is read from a `site_settings` key/value row (`shipping_address`), with a hardcoded fallback address if the row is missing.

### i18n
`src/context/LanguageContext.tsx` provides a language context consumed by most guest-facing components (`Hero`, `Footer`, `RsvpEnvelope`, `RegistrySection`, `WeddingPartySection`, etc.). Translation strings live in `src/lib/i18n/en.json` and `src/lib/i18n/am.json` (English/Amharic). When adding user-facing copy to a component that already consumes `useLanguage`, add both locale keys rather than hardcoding English strings.

### Directory map
- `src/app` — App Router: guest site (`page.tsx`), `/admin` dashboard, `/login`, `/registry`, `/legal`, `/sms-optin-info`, and `/api/*` route handlers.
- `src/components` — guest-facing sections (`Hero.tsx` 3D scene, `Rsvp.tsx`/`RsvpEnvelope.tsx`, `RegistrySection.tsx`, `OurStory.tsx`/`journey/*`, `WeddingPartySection.tsx`, `SoundController.tsx`) plus shared primitives under `ui/`.
- `src/emails` — React Email templates sent via Resend.
- `src/config/campaigns.ts` — campaign definitions consumed by `/api/notify`.
- `src/lib` — Supabase client, i18n JSON.
- `src/context` — `LanguageContext`.
- `src/hooks/useCountdown.ts` — wedding countdown logic.

### Design constraints
Dark-mode-default "mobile-first luxury" aesthetic: background `luxury-black` (#0a0908), accent `wedding-gold` (#D4A845). Motion via `framer-motion`; smooth scroll via `lenis` (`src/components/providers/SmoothScroll.tsx`). The 3D hero (`src/components/Hero.tsx`, React Three Fiber) is performance-sensitive — keep `useFrame` loops optimized. Use `next/image` or Supabase Storage public URLs for media, not local unoptimized assets.

## Database (Supabase, project `foxezhxncpzzpbemdafa`)

Core tables: `parties`, `guests` (FK `party_id`), `campaign_logs` (FK `party_id`), `audit_logs` (FK `party_id`), `registry_items`, `site_settings`. See `README.md` for full column-level schema — it may drift from production, so verify against Supabase (`list_tables`) before relying on it for a migration.

## Required environment variables

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SITE_PASSWORD`, `RESEND_API_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, `ADMIN_EMAIL` (optional, defaults to a hardcoded address).

## Live infrastructure / MCP access

This repo is connected to live infrastructure via MCP — changes made through these tools affect production, not a local sandbox:
- **GitHub:** repo `Yonatan-Estifanos-github/Forkuku` — issues, PRs, branches, code search.
- **Supabase:** project ref `foxezhxncpzzpbemdafa` — SQL queries, schema inspection, migrations.
- **Vercel:** project `estifanos-wedding` (team `yonatans-projects-ebb2af7e`) — deployments, build logs, env vars.

### Connecting a new client to these MCP servers
Requires `GITHUB_PAT_TOKEN` (and for Codex, `CODEX_GITHUB_PERSONAL_ACCESS_TOKEN`) in `.env`, loaded via `export $(cat .env | xargs)`.

```bash
# Claude Code
claude mcp add-json github '{"type":"http","url":"https://api.githubcopilot.com/mcp","headers":{"Authorization":"Bearer $GITHUB_PAT_TOKEN"}}'
claude mcp add --transport http vercel-forkuku https://mcp.vercel.com/yonatans-projects-ebb2af7e/estifanos-wedding
claude mcp add --transport http supabase-forkuku "https://mcp.supabase.com/mcp?project_ref=foxezhxncpzzpbemdafa"

# Gemini CLI
gemini mcp add --transport http github https://api.githubcopilot.com/mcp/ --header "Authorization: Bearer $GITHUB_PAT_TOKEN"

# OpenAI Codex — add to ~/.codex/config.toml
# [mcp_servers.supabase-forkuku]
# url = "https://mcp.supabase.com/mcp?project_ref=foxezhxncpzzpbemdafa"
# [mcp_servers.vercel-forkuku]
# url = "https://mcp.vercel.com/yonatans-projects-ebb2af7e/estifanos-wedding"
# [mcp_servers.github]
# url = "https://api.githubcopilot.com/mcp/"
# bearer_token_env_var = "CODEX_GITHUB_PERSONAL_ACCESS_TOKEN"
```

## Deployment

Push to `main` triggers a Vercel deployment (Vercel + Cloudflare in front). Env vars are managed in Vercel Project Settings, not committed.
