# AGENTS.md

## Project Context
**Name:** Estifanos Wedding (Forkuku)
**Goal:** A cinematic, luxury wedding website for Yonatan & Saron (Sept 4, 2026) with a CRM-style admin dashboard.
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase, React Three Fiber (R3F).

## Critical Rules
1.  **Database Security:**
    - Use `supabase` (` @/lib/supabase`) for CLIENT-SIDE read operations (e.g., searching names).
    - Use `supabaseAdmin` (` @/lib/supabase`) **ONLY** in Server Actions or API routes (`src/app/api/*`) for writes/updates.
    - **Never** expose `SUPABASE_SERVICE_ROLE_KEY` to the client.
2.  **Design & Aesthetics:**
    - **Vibe:** "Mobile-first luxury aesthetic." Cinematic, smooth, dark mode default.
    - **Colors:** Strict adherence to `luxury-black` (#0a0908) background and `wedding-gold` (#D4A845) accents.
    - **Motion:** Use `framer-motion` for UI transitions and `lenis` for smooth scrolling.
3.  **Performance:**
    - The 3D Hero (`src/components/Hero.tsx`) is heavy. Ensure `useFrame` loops are optimized.
    - Use `next/image` or Supabase Storage public URLs for all media assets.

## Directory Structure
- `src/app`: App Router (Guest facing + `/admin` dashboard + `/api` routes).
- `src/components`: UI components. `Hero.tsx` (3D), `Rsvp.tsx` (Logic).
- `src/lib`: Supabase client initialization.
- `src/emails`: React Email templates (Resend).
- `src/config`: Campaign definitions (`campaigns.ts`).

## Available Tools (MCP)
You have direct access to the following live infrastructure via Model Context Protocol:
- **Vercel:** Can access deployments, build logs, and environment variables for the `estifanos-wedding` project.
- **Supabase:** Can run SQL queries and inspect schemas for project `foxezhxncpzzpbemdafa`.
- **Linear:** Can access project issues and roadmap (if configured).

## References
- @import "./PROJECT.md"
- @import "./STYLE.md"
- @import "./COMMANDS.md"
- @import "./ARCHITECTURE.md"
