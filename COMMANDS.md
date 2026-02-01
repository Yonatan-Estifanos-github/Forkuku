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

## MCP Setup (Verified)

### 1. Environment Setup (Prerequisite)
All tools rely on the `.env` file.
```bash
# Add keys to .env (Do not commit this file!)
echo "GITHUB_PAT_TOKEN=ghp_..." >> .env
echo "CODEX_GITHUB_PERSONAL_ACCESS_TOKEN=ghp_..." >> .env # Required for Codex

# Load keys into current session
export $(cat .env | xargs)
```

### 2. Connect to Claude Code
Uses the `add-json` format to inject headers securely.
```bash
# GitHub
claude mcp add-json github '{"type":"http","url":"https://api.githubcopilot.com/mcp","headers":{"Authorization":"Bearer $GITHUB_PAT_TOKEN"}}'

# Vercel
claude mcp add --transport http vercel-forkuku https://mcp.vercel.com/yonatans-projects-ebb2af7e/estifanos-wedding

# Supabase
claude mcp add --transport http supabase-forkuku "https://mcp.supabase.com/mcp?project_ref=foxezhxncpzzpbemdafa"
```

### 3. Connect to Gemini CLI
Uses the `--header` flag.
```bash
gemini mcp add --transport http github https://api.githubcopilot.com/mcp/ --header "Authorization: Bearer $GITHUB_PAT_TOKEN"
```

### 4. Connect to OpenAI Codex
Codex requires a configuration file mapping. File: `~/.codex/config.toml`
```toml
[mcp_servers.supabase-forkuku]
url = "https://mcp.supabase.com/mcp?project_ref=foxezhxncpzzpbemdafa"

[mcp_servers.vercel-forkuku]
url = "https://mcp.vercel.com/yonatans-projects-ebb2af7e/estifanos-wedding"

[mcp_servers.github]
url = "https://api.githubcopilot.com/mcp/"
bearer_token_env_var = "CODEX_GITHUB_PERSONAL_ACCESS_TOKEN"
```
