# Supabase Setup Guide

## Creating a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from Settings > API

## Running Migrations

### Option A: Supabase CLI (recommended for local dev)

```bash
# Install the CLI
brew install supabase/tap/supabase

# Link to your project
supabase link --project-ref pqhebbvanrqvghvtzefu

# Push migrations
supabase db push
```

### Option B: Dashboard SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run `supabase/migrations/001_initial_schema.sql` first
4. Then run `supabase/migrations/002_schema_enhancements.sql`

## Configuring Auth Redirect URLs

In your Supabase dashboard, go to Authentication > URL Configuration:

### Redirect URLs

Add these URLs for each environment:

**Local development:**
- `http://localhost:3000/account/confirm`
- `http://localhost:3000/account/reset`

**Vercel Preview:**
- `https://*-<your-vercel-team>.vercel.app/account/confirm`
- `https://*-<your-vercel-team>.vercel.app/account/reset`

**Production:**
- `https://your-domain.com/account/confirm`
- `https://your-domain.com/account/reset`

### Site URL

Set to your production URL (e.g., `https://your-domain.com`).

## Environment Variables

### Local Development

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Vercel Deployment

In your Vercel project settings, add these environment variables:

| Variable | Value | Environments |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project>.supabase.co` | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key | All |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | All |
| `NEXT_PUBLIC_SITE_URL` | Your production URL | Production |

For preview deployments, set `NEXT_PUBLIC_SITE_URL` to your Vercel preview URL pattern or use `VERCEL_URL`.

## Local Development with Supabase

```bash
# Start local Supabase (Docker required)
supabase start

# This gives you local URLs and keys
# Update .env.local with the local values

# Stop when done
supabase stop
```

## Database Schema

### Tables

- **profiles**: User birth data profiles (date, time, location)
- **saved_charts**: Persisted reading results linked to profiles

### Row Level Security

Both tables have RLS policies ensuring users can only access their own data. The policies use `auth.uid()` to match against the `user_id` column.

### Triggers

- **updated_at**: Auto-updates timestamp on row modification
- **mark_charts_stale**: Sets `is_stale = true` on saved charts when associated profile birth data changes
- **verify_profile_ownership**: Prevents saving charts against profiles owned by other users

## Manual RLS Verification

To verify RLS is working correctly:

1. Create two test users via the auth UI
2. Sign in as User A, create a profile and save a chart
3. Sign in as User B, verify you cannot see User A's profiles or charts
4. Attempt to query User A's data via the API with User B's session — should get 404 (RLS filters it out)
