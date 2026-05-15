# SEO Action Plan — comedy.moscow

**Date:** 2026-05-15  
**Overall SEO Health Score:** 65/100  
**Target after fixes:** 82/100

---

## CRITICAL — Fix Immediately (this week)

### 1. Fix ISR disabled by `searchParams` in homepage metadata

**File:** `app/page.tsx` lines 15-35  
**Problem:** `generateMetadata({ searchParams })` accesses `searchParams.date`, which forces Next.js into dynamic rendering. This overrides `export const revalidate = 300` and causes every page to return `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`. No CDN caching. No browser caching. Bad TTFB on every request.

**Fix:** Remove `searchParams` from `generateMetadata` — date filtering doesn't change metadata:
```tsx
// Before:
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const dateFilter = searchParams.date ?? null
  return {
    ...(dateFilter ? { robots: { index: false, follow: true } } : {}),
    // ...
  }
}

// After:
export async function generateMetadata(): Promise<Metadata> {
  return {
    // ... same metadata, no searchParams dependency
  }
}
```
Move the `noindex` logic to the page component using `<meta name="robots">` in the rendered JSX or handle it differently. The metadata cache is worth more than dynamic noindex on date filters.

**Impact:** Restores ISR, CDN caching, improves TTFB by ~200-500ms.

---

### 2. Fix www subdomain duplicate (nginx)

**Problem:** `http://www.comedy.moscow` serves the full site (200 OK) instead of 301-redirecting to `https://comedy.moscow`. This means all content is accessible at two domains — duplicate content risk.

**Fix:** Add to production nginx config:
```nginx
server {
    server_name www.comedy.moscow;
    return 301 https://comedy.moscow$request_uri;
}
```

**Impact:** Eliminates duplicate content risk. All link equity consolidated to apex domain.

---

### 3. Fix noscript tracking pixels competing for LCP

**File:** `app/layout.tsx` lines 95-97  
**Problem:** Three `<noscript><div><img ...></div></noscript>` tags (Mail.ru counter, Yandex Metrika ×2) are auto-detected by Next.js's preload scanner as potential LCP images. They compete with the hero image for bandwidth.

**Fix:** Replace the noscript images with a single client component that only renders when JS is disabled:
```tsx
// components/ui/NoScriptPixels.tsx (new client component)
'use client'
export default function NoScriptPixels() {
  return null
}
```
Or move them to after the main content in the body. Browsers prioritize resources earlier in the DOM.

**Impact:** LCP improvement ~200-400ms on slow connections.

---

### 4. Add `<lastmod>` to sitemap

**File:** `app/sitemap.ts`  
**Problem:** All 101 URLs lack modification dates. Search engines can't detect which pages changed.

**Fix:**
```tsx
...events.map((e) => ({
  url: `${BASE}/events/${e.slug}`,
  lastModified: new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.8,  // also raise from 0.7
})),
```

**Impact:** Faster indexing of new events. Event pages are revenue pages — should be indexed quickly.

---

### 5. Make homepage h1 visible

**File:** `app/page.tsx` line 48  
**Problem:** `<h1 className="sr-only">Стендап-концерты в Москве</h1>` — search engines see it but users don't. Borderline cloaking risk.

**Fix:** Replace `sr-only` with visible styling above the hero slider.

**Impact:** Eliminates cloaking risk, improves on-page UX.

---

## HIGH — Fix Within 1 Week

### 6. Add Content-Security-Policy header

**File:** `next.config.mjs`  
**Problem:** No CSP means no XSS protection. 4 third-party scripts.

**Fix:** Start with report-only mode, then enforce:
```js
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://top-fwz1.mail.ru https://mc.yandex.ru https://widget.afisha.yandex.ru https://s3.intickets.ru; style-src 'self' 'unsafe-inline' https://s3.intickets.ru; img-src 'self' data: https:; connect-src 'self' https://mc.yandex.ru; frame-src https://widget.afisha.yandex.ru",
},
```

---

### 7. Fix render-blocking intickets CSS

**File:** `app/layout.tsx` line 92  
**Problem:** `<link rel="stylesheet" href="//s3.intickets.ru/intickets.min.css">` blocks first paint.

**Fix:** Use async CSS loading pattern:
```html
<link rel="preload" href="https://s3.intickets.ru/intickets.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
<noscript><link rel="stylesheet" href="https://s3.intickets.ru/intickets.min.css" /></noscript>
```
Also fix the protocol-relative URL (`//` → `https://`).

---

### 8. Add preconnect hints for external origins

**File:** `app/layout.tsx`  
**Fix:** Add inside `<head>`:
```html
<link rel="preconnect" href="https://s3.intickets.ru" />
<link rel="preconnect" href="https://mc.yandex.ru" />
<link rel="preconnect" href="https://top-fwz1.mail.ru" />
<link rel="preconnect" href="https://images.unsplash.com" />
```

**Impact:** LCP -100 to -250ms.

---

### 9. Replace plain `<img>` with `next/image` in EventHero cast

**File:** `components/sections/EventHero.tsx` line 105  
**Problem:** `<img src={artist.photo} ...>` bypasses all next/image optimizations — no WebP/AVIF, no srcset, no lazy loading. Causes CLS if image fails.

**Fix:**
```tsx
// Replace:
<img src={artist.photo} alt={artist.name} className="w-full h-full object-cover" />
// With:
<Image src={artist.photo} alt={artist.name} fill sizes="56px" className="object-cover" />
```

---

### 10. Enable AVIF format

**File:** `next.config.mjs` line 11  
**Fix:**
```js
formats: ['image/avif', 'image/webp'],
```

**Impact:** 20-30% smaller images on supported browsers (>95% global support in 2026).

---

### 11. Add Cache-Control headers for static assets

**File:** `next.config.mjs`  
**Fix:**
```js
{
  source: '/_next/static/(.*)',
  headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
},
```

---

### 12. Remove Date.now() cache-busting from Yandex Dealer

**File:** `app/layout.tsx` line 147  
**Problem:** `s.src = 'https://widget.afisha.yandex.ru/dealer/dealer.js?' + Date.now()` — script re-downloaded on every page visit.

**Fix:** Remove `+ Date.now()`.

---

## MEDIUM — Fix Within 1 Month

### 13. Reduce HeroSlider image quality

**File:** `components/sections/HeroSlider.tsx` line 108  
**Fix:** `quality={100}` → `quality={85}`. No visual difference, 2-3x smaller files.

---

### 14. Add llms.txt for AI search visibility

**New file:** `app/llms.txt/route.ts`  
**Why:** AI crawlers (ChatGPT, Perplexity, Google AI) use llms.txt to understand site structure. Critical for AI search visibility.

See SEO-GEO-AUDIT.md for full specification.

---

### 15. Add AI-specific robots.txt rules

**File:** `app/robots.ts`  
**Fix:**
```ts
{
  userAgent: ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot'],
  allow: '/',
},
{
  userAgent: ['CCBot', 'anthropic-ai', 'cohere-ai'],
  disallow: '/',
},
```

---

### 16. Create About Us page

**New page:** `/about`  
**Why:** Zero information about who runs the platform is the biggest E-E-A-T gap. Include: organizer background, mission, event production experience, photos from past shows.

---

### 17. Add ItemList schema to listing pages

**Files:** `app/events/page.tsx`, `app/artists/page.tsx`  
**Why:** Qualifies for Google carousel rich results. Tell search engines these are collections.

---

### 18. Disable WebVisor on second Yandex Metrika counter

**File:** `app/layout.tsx` line 132  
**Fix:** Remove `webvisor:true` from counter 94359734. Doubled DOM mutation overhead on every interaction.

---

### 19. Add visible breadcrumb navigation

**Files:** Event pages, artist pages  
**Why:** BreadcrumbList exists in JSON-LD only. Visible breadcrumbs improve UX and internal linking.

---

### 20. Fix past events schema (missing ratings/reviews)

**File:** `app/events/[slug]/page.tsx` lines 104-128  
**Problem:** Past events skip adding `aggregateRating` and `review` to schema (code exists for upcoming, just not copied to past branch).

---

### 21. Change `performer` from PerformingGroup to Person

**File:** `app/events/[slug]/page.tsx` lines 127 and 267-271  
**Why:** Individual comedians are Person, not PerformingGroup. Use `@id` to link to artist pages.

---

### 22. Add FAQ page

**New page:** `/faq`  
**Content:** How to buy tickets, age verification, refunds, cancelled events, dress code, arrival time. High AI citation value.

---

### 23. Create venue pages

**New pages:** `/venues/[slug]`  
**Why:** "Standup venues in Moscow" has search volume. Use existing venue data (4 venues in local data).

---

### 24. Implement IndexNow pinging

**Why:** `public/indexnow-key.txt` exists but no code pings search engines on content updates. Yandex and Bing support IndexNow.

---

## LOW — Backlog

### 25. Remove unused framer-motion dependency
**File:** `package.json` — verify it's unused and remove. Saves bundle size.

### 26. Add theme-color meta tag
**File:** `app/layout.tsx` — `<meta name="theme-color" content="#0c0c10" />`

### 27. Add `<time datetime>` elements for dates/times
**Files:** EventHero, EventCard, MetaPill components — improves AI citability.

### 28. Replace `@mail.ru` email with branded domain email
Setup `hello@comedy.moscow` forwarding.

### 29. Fix Organization schema address
**File:** `app/layout.tsx` — add `addressLocality: 'Москва'`, use E.164 phone format.

### 30. Add semantic `<dl>` for sidebar event details
**File:** `app/events/[slug]/page.tsx` sidebar section — replace `<div>`/`<span>` pairs with `<dl>`/`<dt>`/`<dd>`.

### 31. Start a blog
Event recaps, comedian interviews, "best shows this month" — captures long-tail informational queries.

### 32. Add `EventSeries` schema for recurring events
For events like "Большой девчачий стендап" that appear multiple times.

### 33. Consider redirecting very old past events (90+ days)
To `/events` catalog to prevent index bloat.

---

## Implementation Order by Impact/Effort

```
Now (1 afternoon):
  1. Fix searchParams in generateMetadata → restores ISR
  2. Fix www→apex redirect (nginx)
  3. Fix noscript tracking pixels
  4. Add lastmod to sitemap
  5. Make h1 visible
  → Score: 65 → 72

Week 1:
  6. Add CSP header
  7. Defer intickets CSS
  8. Add preconnect hints
  9. Replace <img> with next/image
  10. Enable AVIF
  11. Cache-Control for static assets
  12. Remove Date.now() cache-busting
  → Score: 72 → 78

Month 1:
  13-24. Schema, content, AI readiness improvements
  → Score: 78 → 82

Backlog:
  25-33. Polish and long-term improvements
  → Score: 82 → 85+
```

---

## Files to Modify (Complete List)

| # | File | Change |
|---|---|---|
| 1 | `app/page.tsx` | Remove searchParams from generateMetadata |
| 2 | Nginx config (server) | www→apex 301 redirect |
| 3 | `app/layout.tsx` | Fix noscript pixels, defer intickets CSS, add preconnect, remove Date.now(), add theme-color |
| 4 | `app/sitemap.ts` | Add lastModified, raise event priority |
| 5 | `next.config.mjs` | Add CSP, Cache-Control for static assets, AVIF format |
| 6 | `components/sections/HeroSlider.tsx` | quality=100 → 85 |
| 7 | `components/sections/EventHero.tsx:105` | `<img>` → `next/image` |
| 8 | `app/robots.ts` | Add AI-specific bot rules |
| 9 | `app/llms.txt/route.ts` | NEW — llms.txt dynamic route |
| 10 | `app/llms-full.txt/route.ts` | NEW — full content for AI |
| 11 | `app/events/[slug]/page.tsx` | Fix past event schema, Person type, visible breadcrumbs |
| 12 | `app/events/page.tsx` | ItemList schema + breadcrumbs |
| 13 | `app/artists/page.tsx` | ItemList schema + breadcrumbs |
| 14 | `app/artists/[slug]/page.tsx` | Visible breadcrumbs, h2 for bio |
| 15 | `app/about/page.tsx` | NEW — About Us page |
| 16 | `app/faq/page.tsx` | NEW — FAQ page |
| 17 | `app/venues/[slug]/page.tsx` | NEW — Venue pages |

---

*Generated 2026-05-15. Full audit report: FULL-AUDIT-REPORT.md*
