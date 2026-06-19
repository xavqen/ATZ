# aTz Next.js Virtualized Ads + Supabase Auth

This is a production-oriented Next.js App Router project.

## Added

- Auto-scroll button at 0.5 page per second
- Supabase login/signup with email and password
- Supabase profile page
- Virtualized 1,000,000-slot ad wall
- Only 3–5 ad rows rendered at a time
- GPT-style lazy slot lifecycle
- Batched GPT refreshes
- `enableSingleRequest()` SRA pattern
- Strict Intersection Observer lazy loading
- Slot cleanup with `destroySlots()`
- Fast ad loading with iframe isolation and fallback ads
- Edge API route for Redis-cached ad metadata
- Clean pages without 1M ad wall:
  - About
  - Leaderboard
  - Profile
  - Privacy
  - Terms
  - Login
  - Signup
  - Forgot Password

## Install

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Vercel

```txt
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
```

Do not set Output Directory to `public`.

## Environment Variables

```txt
NEXT_PUBLIC_SITE_URL=https://atz-pages.vercel.app
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

NEXT_PUBLIC_GAM_NETWORK_CODE=1234567
NEXT_PUBLIC_GAM_AD_UNIT_PREFIX=/1234567/atz

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
AD_METADATA_ORIGIN=
```

## Supabase

Run:

```txt
supabase/schema.sql
```

## Important

Do not render one million live ads at once. This project renders a one-million logical ad platform safely through virtualization.


## v14 Compact Wall
- Ads are grouped into dense clusters so users can see many ads in one screen.
- Each virtual cluster contains 10 ads.
- Better desktop visibility with tight spacing similar to a compact ad dashboard.
