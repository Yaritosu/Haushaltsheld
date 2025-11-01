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

## Supabase setup (optional, recommended)
1. Create a Supabase project at https://supabase.com, then go to Settings → API to find:
   - Project URL
   - anon public key
2. Copy `.env.local.example` to `.env.local` and set:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```
3. Restart the dev server so env vars are picked up.

### What changes when configured?
- Login form uses `supabase.auth.signInWithPassword(email, password)`
- App listens to Supabase auth state and routes to /dashboard when logged in
- Logout calls `supabase.auth.signOut()`

If env vars are not set, the app falls back to a mock login (localStorage only).

## Structure
- `src/App.tsx` — routing + auth guarding
- `src/pages/LoginPage.tsx` — login form (Supabase or mock)
- `src/pages/Dashboard.tsx` — header + cards, logout
- `src/lib/supabaseClient.ts` — Supabase client initialization

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
