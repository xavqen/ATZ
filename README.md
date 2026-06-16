# aTz Final Ready-to-Host Website

This is the final ready-to-host version of aTz.

## Included Features

- Clean and responsive UI
- A-Z pages
- Icon-based header
- User profile icon
- Login, signup, logout, and forgot password
- Supabase authentication
- XP profile system
- Country and state leaderboard
- Privacy Policy, Terms and Conditions, and About pages
- Sitemap and robots.txt
- Vercel configuration
- All provided ad formats integrated:
  - Popunder
  - Native Banner
  - Social Bar
  - Smartlink
  - 468x60
  - 300x250
  - 160x300
  - 160x600
  - 320x50
  - 728x90

## Important Ad Policy Note

XP is not awarded for ad clicks, ad views, popunders, or forced ad activity.
XP is awarded only for genuine site engagement.

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Run:

```txt
supabase/schema.sql
```

4. Open:

```txt
js/supabase-config.js
```

5. Paste your Supabase Project URL and anon public key.

## Vercel Deploy Settings

- Framework Preset: Other
- Build Command: empty or `npm run build`
- Output Directory: empty
- Environment Variables: none required for this static version

## Google Search Console

After deployment, submit:

```txt
https://atz-pages.vercel.app/sitemap.xml
```

If you use a custom domain, update `sitemap.xml` and `robots.txt` with your real domain.


## v9 Update

- Added Adsterra referral image banners to every page.
- All pages now show ads first.
- Main content and A-Z page navigation start after the ad section.
- This encourages scrolling before users reach page content or navigation.
