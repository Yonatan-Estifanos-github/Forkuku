# COMMANDS.md

## Development
- `npm run dev` - Start local server on port 3000.
- `npm run lint` - Run ESLint.

## Deployment
- **Push to Main:** Triggers Vercel deployment.
- **Environment Variables:**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (Critical for Admin API)
  - `RESEND_API_KEY` (Email)
  - `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` (SMS)
  - `NEXT_PUBLIC_SITE_PASSWORD` (Middleware protection)

## MCP Setup (AI Tools)
If tools are disconnected, run these commands to reconnect:

### Vercel (Logs & Deployments)
`claude mcp add --transport http vercel-forkuku https://mcp.vercel.com/yonatans-projects-ebb2af7e/estifanos-wedding`

### Supabase (Database)
`claude mcp add --transport http supabase-forkuku "https://mcp.supabase.com/mcp?project_ref=foxezhxncpzzpbemdafa"`

### Linear (Project Management)
`claude mcp add --transport http linear https://mcp.linear.app/mcp`
