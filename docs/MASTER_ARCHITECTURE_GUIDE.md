# Master Architecture Guide: 1M Ads Without Crashing

## 1. Infinite Scroll & Virtualization

This project uses `react-window` so only the visible rows plus one overscan row are mounted.  
Total logical ad slots: 1,000,000.  
Actual DOM ad rows: about 3–5 depending on viewport height.

File:

```txt
components/ads/VirtualizedAdWall.tsx
```

Key settings:

```ts
itemCount={1_000_000}
itemSize={290}
overscanCount={1}
```

## 2. Auto Scroll

The button scrolls at exactly half the visible ad-window height per second.

```ts
const speedPxPerSecond = height / 2;
```

Users can start or stop auto-scroll.

## 3. GPT / Google Publisher Tags

GPT is loaded only when an ad slot enters the viewport.

Files:

```txt
lib/gpt-client.ts
components/ads/GPTSlot.tsx
```

Architecture:

- `enableSingleRequest()` batches eligible slots.
- `enableLazyLoad()` reduces offscreen ad fetching.
- `disableInitialLoad()` prevents automatic requests.
- A micro-batcher refreshes visible slots every 180ms.
- `destroySlots()` runs when virtual rows unmount.

## 4. Strict Intersection Observer

Every GPT slot uses `IntersectionObserver` with `rootMargin: "450px 0px"`.

This means ads are requested shortly before entering view and destroyed when their virtual row unmounts.

## 5. Worker Threads / Partytown

For App Router, use `next/script` with `lazyOnload` as the safe default.

Partytown/worker strategy is not used directly in this production App Router code because Next.js worker strategy is not stable for the App Router. Use it only after testing in a separate branch.

## 6. SSAI vs CSAI

For display ad walls, CSAI with strict lazy loading is usually better than SSAI because each slot must be tracked, refreshed, and measured client-side.

Use SSAI only for server-selected ad metadata, placement rules, or sponsored card configs.

API example:

```txt
app/api/ad-metadata/route.ts
```

It uses:

- Vercel Edge Runtime
- Optional Upstash Redis REST cache
- CDN cache headers
- Fallback metadata when no external ad server is configured

## 7. Data Efficiency Rules

- Never render 1,000,000 iframes.
- Never request 1,000,000 ads.
- Render only visible rows.
- Request ads only when near viewport.
- Destroy old GPT slots when unmounted.
- Use CDN-cached metadata.
- Keep clean pages free of the one-million ad wall.
