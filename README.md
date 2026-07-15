# VE Cookie Board

Fun team board: click whoever led the daily standup to award them a cookie.
Live leaderboard highlights whoever has the fewest cookies.

## Setup

1. Create a Supabase project.
2. In the Supabase SQL editor, run `supabase/schema.sql`.
3. Copy `.env.example` to `.env` and fill in:
   - `VITE_APP_PASSWORD` — shared unlock password (team value: `your-shared-password`)
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — from Supabase project settings
4. `npm install && npm run dev`

## Deploy (Vercel)

Import the repo in Vercel and set the three `VITE_*` env vars in project settings.

## Security note

The shared password gates the UI only. The Supabase anon key lives in the client
and RLS write rules are open, so this is a latch, not a vault — acceptable for an
internal fun tool.
