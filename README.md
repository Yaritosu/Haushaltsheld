# Haushaltsheld

A React + TypeScript + Vite app. Login + Dashboard scaffolded. Supabase-ready via environment variables.

## Quick start

```bash
# install deps
npm install

# run dev server
npm run dev
```

Open http://localhost:3000.

## Supabase setup (required for multi-household features)

### 1. Create Supabase project

1. Go to https://supabase.com and create a new project
2. Settings → API: copy **Project URL** and **anon public key**
3. Copy `.env.local.example` to `.env.local` and set:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SITE_URL=https://haushaltsheld.vercel.app   # WICHTIG: Produktions-URL für Einladungslinks!
```

### 2. Initialize database

1. Open **SQL Editor** in your Supabase project
2. Copy the contents of `supabase-schema.sql`
3. Run the script to create tables, RLS policies, and functions

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed instructions.

### 3. Restart dev server

```bash
npm run dev
```

### What changes when configured?

- Login form uses `supabase.auth.signInWithPassword(email, password)`
- App listens to Supabase auth state and routes to /dashboard when logged in
- Logout calls `supabase.auth.signOut()`

If env vars are not set, the app falls back to a mock login (localStorage only).

## Features

### Multi-Household System

- **Create household:** After signup, create a new household and become admin
- **Join household:** Enter an 8-digit invite code from an admin
- **Invite codes:** Admins can view and share unique codes in the dashboard
- **Automatic assignment:** Once joined, users always see their household on login

### Structure

- `src/App.tsx` — routing + auth guarding + household provider
- `src/pages/LoginPage.tsx` — login + signup form (Supabase or mock)
- `src/pages/OnboardingPage.tsx` — household creation/joining after signup
- `src/pages/Dashboard.tsx` — household overview, invite code (admin), logout
- `src/context/HouseholdContext.tsx` — household state management
- `src/lib/supabaseClient.ts` — Supabase client initialization
- `supabase-schema.sql` — database schema (households, profiles, members)

## Build

```bash
npm run build
npm run preview
```

## Deployment (Vercel)

This repo includes `vercel.json` configured for Vite + React and SPA routing.

### Option A: Vercel CLI (fastest)

```bash
# 1) Login (opens browser)
npx vercel login

# 2) Link or create a new Vercel project in this folder
npx vercel link

# 3) Add environment variables (add for Production and Preview)
npx vercel env add VITE_SUPABASE_URL
npx vercel env add VITE_SUPABASE_ANON_KEY
npx vercel env add VITE_SITE_URL   # z.B. https://haushaltsheld.vercel.app

# 4) Deploy
npx vercel --prod
```

### Option B: GitHub → Vercel

1. Commit + push to GitHub
2. Import the repo at https://vercel.com/import
3. In Project Settings → Environment Variables, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

### Supabase Auth URLs

If you use Magic Links/OAuth, add your domains in Supabase → Authentication → URL Configuration:

- Local dev: `http://localhost:3000` (and the actual port Vite prints, e.g. 3001)
- Production: your Vercel URL (e.g. `https://your-app.vercel.app`)

Tip: If you set `VITE_SITE_URL` to your Vercel domain, password reset emails will always point to `https://your-app.vercel.app/reset` in production, while local development keeps using `http://localhost:PORT/reset`.
