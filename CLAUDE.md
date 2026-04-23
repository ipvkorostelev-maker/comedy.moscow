# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**comedy.moscow** — afisha (event listing) site for standup concerts in Russia. Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion. No database; data is served from JSON files with an optional remote file-based data source.

Production URL: `https://comedy.moscow`  
Production server: `root@89.111.171.180`, managed by PM2 (`smeshno` process, port 3001).

## Commands

```bash
npm run dev       # local dev server (localhost:3000)
npm run build     # production build
npm run lint      # ESLint via next lint
./deploy.sh       # commit + push + remote build + pm2 restart (always use this for deploys)
./deploy.sh "msg" # deploy with custom commit message
```

> **Deploy rule**: always use `./deploy.sh`. Never rsync manually.

## Architecture

### Data flow

All data access goes through `lib/data.ts`. It has two sources (checked in order):

1. **Remote (womanstandup)** — reads from a shared JSON file at `$WOMANSTANDUP_DATA_PATH/concerts.json` on the same server. Mapped to site types in `lib/womanstandup.ts`. Only concerts with `siteKeys: ['smeshno']` and `isDraft: false` are included.
2. **Local fallback** — `data/events.json`, `data/artists.json`, `data/venues.json`.

`isAvailable()` caches its result (singleton promise) for the process lifetime. Events are filtered to upcoming-only and sorted by datetime before being returned.

### Key lib files

| File | Purpose |
|---|---|
| `lib/types.ts` | All shared TypeScript interfaces (`Event`, `Artist`, `Venue`, `Review`, `TicketTier`) |
| `lib/data.ts` | Async data access functions (`getAllEvents`, `getEventBySlug`, `getAllArtists`, `getArtistBySlug`, etc.) |
| `lib/womanstandup.ts` | Maps raw womanstandup JSON → site types; handles `$WOMANSTANDUP_ASSETS_URL` prefix for images |
| `lib/utils.ts` | `cn()`, `formatDate*()`, `formatPrice()`, `minEventPrice()`, `BASE` constant |

### App router pages

```
app/
  page.tsx              # homepage — hero slider + upcoming events
  events/page.tsx       # event catalog
  events/[slug]/page.tsx
  artists/page.tsx
  artists/[slug]/page.tsx
  contacts/page.tsx
  offer/page.tsx
  privacy/page.tsx
  not-found.tsx
  api/events/route.ts   # JSON API endpoint
  feed.xml/route.ts     # RSS/Atom feed (5-min cache)
  rss.xml/route.ts
  sitemap.ts
  robots.ts
```

### Component structure

```
components/
  layout/     Nav, Footer
  sections/   HeroSlider, HomeEventsSection, EventHero, EventCalendar, StickyBuyBar
  cards/      EventCard, ArtistCard, ReviewCard, TicketCard
  ui/         Badge, BuyButton, CookieBanner, EventBadges, GalleryLightbox,
              MetaPill, ObfuscatedContact, SectionHeader, icons
```

### Ticket purchase flow

Each event has `ticketType: 'yandex' | 'external'` and optionally `ticketUrl` / `yandexWidgetId`. `BuyButton` handles both cases; `StickyBuyBar` on event pages mirrors the CTA.

### SEO / metadata

Root metadata and org/website JSON-LD schema live in `app/layout.tsx`. Each page exports its own `generateMetadata`. Canonical, OpenGraph, Twitter cards, and breadcrumb JSON-LD are applied per-page. `BASE = 'https://comedy.moscow'` is the canonical origin (from `lib/utils.ts`).

### Images

Remote image domains allowed in `next.config.mjs`: `images.unsplash.com`, `womanstandup.ru`. Use `next/image` for all images. The `$WOMANSTANDUP_ASSETS_URL` env var prefixes relative paths from the remote data source.

### Fonts

`Oswald` (`--font-oswald`) for headings, `Inter` (`--font-inter`) for body — both loaded via `next/font/google` with Cyrillic subsets.

## Environment variables

| Variable | Purpose |
|---|---|
| `WOMANSTANDUP_DATA_PATH` | Absolute path to shared JSON data dir on server; if unset, site uses local fallback data |
| `WOMANSTANDUP_ASSETS_URL` | Base URL prefix for relative image paths from remote data |

## Design system

- Dark cinematic aesthetic (near-black backgrounds, high-contrast text)
- Accent colors via Tailwind custom config (`tailwind.config.ts`)
- Use `cn()` from `lib/utils.ts` for conditional classnames
- Framer Motion for entrance animations; keep animations lightweight (server components have no JS budget)
- Prefer server components; add `'use client'` only when interactivity or browser APIs are required
