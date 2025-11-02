# Haushaltsheld – Context Seed

This file gives a compact, copy‑pastable context for future chats. It summarizes what the app does, where things live, how auth and the household model work, and what’s deployed.

## What this app is
- React + TypeScript + Vite single‑page app
- Supabase for auth and database
- Multi‑household model: users belong to exactly one household; admins can invite others via invite code
- Deployed on Vercel as an SPA

## Key routes and files
- UI
  - `src/App.tsx`: Router and layout
  - `src/pages/LoginPage.tsx`: Email/password login + sign‑up (+ resend confirmation)
  - `src/pages/ResetPassword.tsx`: Request and perform password reset
  - `src/pages/OnboardingPage.tsx`: Create or join a household (via invite code)
  - `src/pages/Dashboard.tsx`: Shows current household; admins see invite code
- State
  - `src/context/HouseholdContext.tsx`: Resolves user’s household after login using RPC `get_my_household()` with fallback
- Supabase client
  - `src/lib/supabaseClient.ts` (if present): Initializes client; reads env; exports `SITE_URL`

## Environment variables (Vite)
Set these in Vercel (Production) and locally in `.env`:
- `VITE_SUPABASE_URL` – your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` – your Supabase anon key
- `VITE_SITE_URL` – your stable live domain, e.g. `https://<your-project>.vercel.app`

Tip: Use a stable Vercel domain (not preview URLs) for email redirects.

## Supabase URL configuration
In Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://<your-project>.vercel.app`
- Redirect URLs: include
  - `https://<your-project>.vercel.app/login`
  - `https://<your-project>.vercel.app/reset`
  - `http://localhost:5173/login`
  - `http://localhost:5173/reset`

## Database schema (tables)
- `profiles` – one row per auth user; RLS: users can see/update their own profile
- `households` – a household with name, invite_code, created_by
- `household_members` – membership rows `(household_id, user_id, role)`

## RLS policies (summary)
- profiles: user can select/update own row (auth.uid())
- household_members:
  - SELECT: users can view their own memberships: `user_id = auth.uid()` (non‑recursive)
  - INSERT: user can insert row for themself when joining/creating
  - DELETE/UPDATE: restricted appropriately (admin/owner only where needed)
- households:
  - SELECT: visible to members via membership check

Note: We replaced a previously recursive SELECT policy with a simple self‑membership policy to avoid recursion/authorization issues on first read.

## DB functions (SQL)
- `generate_invite_code()` – creates short unique code
- `create_household_with_admin(household_name, user_id)` – creates household + admin membership; returns household
- `join_household_by_code(code, user_id)` – adds a user to a household via invite code
- `get_my_household()` – returns the current user’s household and membership quickly (used by frontend)

Optional constraint to enforce single household per user:
- Unique index on `household_members(user_id)`; create only after cleaning duplicates if they exist

## Frontend flow
- Sign‑Up: uses `emailRedirectTo = ${SITE_URL}/login`; UI offers “resend confirmation”
- Login: on success, the app resolves household via `HouseholdContext`
- Onboarding: user can create a household or join with invite code; after success, the context `refetch()` runs, then navigate to `/dashboard`
- Dashboard: shows household name; if role = admin, shows invite code

## Build & deploy
- Built with Vite. On Vercel, this is configured as an SPA. Ensure env vars exist in Vercel Project Settings.
- Local dev: `npm run dev` (Vite at http://localhost:5173)
- Production build: `npm run build` then `npm run preview`

## Common troubleshooting
- After creating/joining a household you’re sent back to onboarding:
  - Ensure the new `household_members SELECT` policy (self‑view) is active
  - Confirm RPC `get_my_household()` exists
  - The app calls `refetch()` after onboarding; verify it returns household
- Unique constraint won’t create due to duplicates:
  - Deduplicate `household_members` by `user_id` (keep the latest row), then create the unique index
- Emails not redirecting correctly:
  - Use stable domain in `VITE_SITE_URL` and in Supabase URL Configuration; include `/login` and `/reset`

## What to verify after DB updates
1) Login with a confirmed user → auto‑lands on `/dashboard` if already in a household
2) Create a household → redirects to dashboard and shows invite code
3) Join via invite code with another account → both see same household

## Next steps (optional)
- Household member management (list/remove/leave)
- Ownership transfer / delete household
- Activity lists or tasks per household

— End of context seed —
