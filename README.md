# Estifanos Wedding Website

A wedding website with an immersive 3D hero experience, guest RSVP system, admin dashboard with campaign management, and multi-channel notifications (Email + SMS).

**Live:** [theestifanos.com](https://theestifanos.com)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 |
| 3D Graphics | Three.js, React Three Fiber, Drei |
| Animation | Framer Motion, Lenis Smooth Scroll |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Authentication |
| Email | Resend (React Email templates) |
| SMS | Twilio |
| Deployment | Vercel + Cloudflare |

---

## Features

### Guest Experience
- **3D Hero Section** - Parallax photo slideshow with 350 animated fireflies, bloom effects, and mouse interaction
- **Smooth Scrolling** - Lenis-powered weighted scroll with easing
- **Our Story Timeline** - Interactive carousel from 2021-2026
- **RSVP System** - Search by name, per-guest attendance tracking, plus-one support
- **Audio Player** - Background music with visualizer and countdown timer
- **Responsive Design** - Mobile-first luxury aesthetic

### Admin Dashboard (`/admin`)
- **Campaign Manager** - 6 pre-built campaigns (Save the Date, Formal Invite, RSVP Reminder, Logistics, Day-of Alert, Thank You)
- **Guest Management** - Add/edit/delete parties, manage individual guests
- **CSV Import** - Bulk upload parties with case-insensitive column matching
- **Multi-channel Notifications** - Send emails via Resend, SMS via Twilio (US numbers only)
- **Analytics** - Total parties, guests, confirmed attending, sent status

---

## Production Infrastructure Setup

This project uses a high-performance stack protected by Cloudflare.

### 1. Cloudflare (DNS & Security)
- **Plan:** Free
- **SSL/TLS:** Full (Strict) Mode
- **Security:** "Bot Fight Mode" Enabled (Blocks AI scrapers)
- **DNS Records:**
  - `A` Record (@) -> `76.76.21.21` (Proxied)
  - `CNAME` Record (www) -> Vercel Dedicated Address (Proxied)

### 2. Namecheap (Registrar)
- **Nameservers:** Custom DNS pointed to Cloudflare (e.g., `ishaan.ns.cloudflare.com`)
- **DNSSEC:** Disabled (Handled by Cloudflare)

### 3. Vercel (Hosting)
- **Framework Preset:** Next.js
- **Environment Variables:** See below
- **Git Integration:** Connected to `ForKuku` repo (Main branch)

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with fonts & providers
│   ├── page.tsx                # Landing page (Hero, Story, Venue, RSVP)
│   ├── main.css                # Global styles (film grain, animations)
│   ├── admin/
│   │   └── page.tsx            # Admin dashboard
│   ├── login/
│   │   └── page.tsx            # Supabase auth
│   └── api/
│       ├── notify/route.ts     # Email & SMS dispatch
│       └── rsvp/
│           ├── search/route.ts # Party lookup by name
│           └── submit/route.ts # RSVP submission
├── components/
│   ├── Hero.tsx                # 3D landing with fireflies
│   ├── OurStory.tsx            # Timeline carousel
│   ├── Rsvp.tsx                # RSVP flow (search → form → success)
│   ├── GoogleEarthVideo.tsx    # Venue showcase
│   ├── FloatingNav.tsx         # Bottom navigation
│   ├── SoundController.tsx     # Audio + countdown
│   └── ui/                     # Section, FadeIn primitives
├── emails/
│   ├── SaveTheDate.tsx         # Save the date template
│   ├── FormalInvite.tsx        # Formal invitation template
│   └── GenericTemplate.tsx     # Reusable template
├── config/
│   └── campaigns.ts            # Campaign definitions
├── lib/
│   └── supabase.ts             # Supabase client initialization
└── hooks/
    └── useCountdown.ts         # Countdown to wedding date

public/
├── images/                     # Engagement photos
├── audio/                      # Background music
├── fonts/                      # Custom fonts (TTF + JSON)
├── textures/                   # Background textures
└── videos/                     # Venue video content
```

---

## Database Schema

### parties
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| party_name | text | Display name (e.g., "The Smiths") |
| email | text | Contact email |
| phone | text | Contact phone |
| status | text | `pending` \| `invited` \| `replied` |
| has_responded | boolean | RSVP submitted flag |
| admin_notes | text | Guest messages, internal notes |
| search_tags | text[] | Lowercase names for search |

### guests
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| party_id | bigint | Foreign key → parties |
| name | text | Guest name |
| is_attending | boolean | Attendance status |
| is_plus_one | boolean | Plus-one flag |

### campaign_logs
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| party_id | bigint | Foreign key → parties |
| campaign_id | text | Campaign identifier |
| channel | text | `email` \| `sms` |
| status | text | `sent` \| `failed` |

### audit_logs
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| party_id | bigint | Foreign key → parties |
| action | text | Action type (e.g., `RSVP_SUBMITTED`) |
| details | jsonb | Action metadata |

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- npm 8+
- Supabase account
- Resend account (for email)
- Twilio account (for SMS, optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/Yonatan-Estifanos-github/ForKuku.git
cd ForKuku

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your credentials (see below)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the guest site and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Site Protection (required)
NEXT_PUBLIC_SITE_PASSWORD=your_password

# Resend (required for email)
RESEND_API_KEY=re_your_api_key

# Twilio (optional, for SMS)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1your_phone_number
```

---

## API Reference

### POST `/api/rsvp/search`
Find a party by guest name.

**Request:**
```json
{ "name": "Sarah Fortune" }
```

**Response:**
```json
{
  "id": 1,
  "party_name": "The Fortunes",
  "status": "invited",
  "guests": [
    { "id": 1, "name": "Sarah Fortune", "is_attending": false, "is_plus_one": false }
  ]
}
```

### POST `/api/rsvp/submit`
Submit RSVP response.

**Request:**
```json
{
  "party_id": 1,
  "email": "sarah@example.com",
  "phone": "(555) 123-4567",
  "message": "Can't wait!",
  "guests": [
    { "id": 1, "name": "Sarah Fortune", "is_attending": true }
  ]
}
```

### POST `/api/notify`
Send campaign notification to a party.

**Request:**
```json
{
  "partyId": 1,
  "campaignId": "formal-invitation"
}
```

**Available Campaigns:**
- `save-the-date`
- `formal-invitation`
- `rsvp-reminder`
- `logistics-update`
- `day-of-alert`
- `thank-you`

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables in Project Settings → Environment Variables
4. Deploy

Vercel automatically builds and deploys on every push to `main`.

---

## License

MIT License - see [LICENSE](LICENSE) for details.
