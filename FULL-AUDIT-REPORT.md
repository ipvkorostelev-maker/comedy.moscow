# SEO Audit Report — comedy.moscow

**Date:** 2026-05-15  
**URL:** https://comedy.moscow  
**Platform:** Next.js 14 App Router, TypeScript, Tailwind CSS  
**Business type:** Event listing / ticket platform (standup comedy, Moscow)

---

## Executive Summary

| Metric | Score |
|---|---|
| **Overall SEO Health** | **65/100** |
| Technical SEO (22%) | 12/22 |
| Content Quality (23%) | 13/23 |
| On-Page SEO (20%) | 15/20 |
| Schema / Structured Data (10%) | 9/10 |
| Performance / CWV (10%) | 6/10 |
| AI Search Readiness (10%) | 5/10 |
| Images (5%) | 5/5 |

### Top 5 Critical Issues

1. **`searchParams` in homepage `generateMetadata` disables ISR** — accessing `searchParams` forces dynamic rendering, which overrides `revalidate: 300`. The server returns `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` on every page, meaning zero CDN/browser caching and poor TTFB.
2. **www.comedy.moscow is a live duplicate** — `http://www.comedy.moscow` serves the full site without redirecting to the apex domain. This is a duplicate content risk (two domains serving identical content).
3. **Noscript tracking pixels preloaded as LCP candidates** — 3 noscript `<img>` tags (Mail.ru + 2x Yandex Metrika) are auto-preloaded by Next.js, competing with the hero image for LCP bandwidth.
4. **Sitemap missing `<lastmod>`** — all 101 URLs lack modification dates, making it harder for search engines to detect content updates.
5. **No Content-Security-Policy header** — missing CSP increases XSS risk; given 4 third-party scripts, this is a significant gap.

### Top 5 Quick Wins

1. Add `<lastmod>` to sitemap entries → 1-line fix in `app/sitemap.ts`
2. Add Cache-Control header for HTML routes → ~10 lines in `next.config.mjs`
3. Make homepage h1 visible → swap `sr-only` for a styled visible heading
4. Preconnect to external origins → 4 lines in `layout.tsx`
5. Add `llms.txt` → new file, 20 lines

---

## Technical SEO (15/22)

### Crawlability

**robots.txt** — Good. Clean, well-structured. Only `/api/`, `/offer`, `/privacy` are disallowed. Sitemap reference present.

**Issue:** No specific directives for AI crawlers (GPTBot, ClaudeBot, PerplexityBot). Currently `User-Agent: *` covers all bots identically.

**CRITICAL — www subdomain duplicate:** `http://www.comedy.moscow` serves the full site (200 OK) instead of 301-redirecting to the apex domain `https://comedy.moscow`. This means all content is accessible at two domains, creating a duplicate content risk. Fix: add an nginx 301 redirect from `www.comedy.moscow` → `comedy.moscow`.

**Internal link structure** — Good organic linking. ~30 events + 5 artists + 5 nav items + 6 footer links on homepage. Event pages link to artists, similar events. Artist pages link to upcoming events. No orphan pages detected.

### Indexability

**CRITICAL — ISR disabled by `searchParams`:** The homepage's `generateMetadata({ searchParams })` accesses `searchParams.date`, which forces Next.js into dynamic rendering. This overrides `export const revalidate = 300`, causing every page to return `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`. Zero CDN caching, zero browser caching, poor TTFB on every request.

**Canonicals** — Correctly set per-page. Good.

**Noindex usage** — Smart: homepage sets `robots: { index: false }` when `?date=` filter is active, preventing duplicate indexed pages for calendar filters. Only `follow` is kept.

**Issue:** `/corporate` page — check if it has sufficient unique content. Currently in sitemap with priority 0.8 but may be thin.

**Issue:** Event URL timestamps — slugs like `/events/adam-berezov-solnyy-kontsert-1776276608258` contain epoch milliseconds. This makes URLs:
- Non-semantic (the number means nothing to users or search engines)
- Hard to share verbally
- Potentially leaking internal timestamps
- The number likely corresponds to event creation time in the remote data source

### Security Headers

**Implemented (good):**
- `X-Content-Type-Options: nosniff` ✓
- `X-Frame-Options: SAMEORIGIN` ✓
- `X-XSS-Protection: 1; mode=block` ✓
- `Referrer-Policy: strict-origin-when-cross-origin` ✓
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` ✓
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` ✓

**Missing:**
- **Content-Security-Policy** — CRITICAL. No CSP header means no protection against XSS via injected scripts. Given the site loads 4 third-party scripts, CSP is important.
- **Cross-Origin-* headers** — `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy` would improve security posture.
- `X-XSS-Protection: 1; mode=block` is deprecated and ignored by modern browsers — can be removed.

### Sitemap

**Format:** Dynamic Next.js sitemap at `/sitemap.xml` — 101 URLs total.

**Issues:**
1. **No `<lastmod>`** — CRITICAL. Every entry should include `lastModified` to help search engines prioritize crawling. Currently all entries are `changeFrequency` only, which is a hint but less reliable.
2. **Priority distribution questionable:**
   - Event pages at 0.7 — these are the money pages (ticket sales), should be 0.8-0.9
   - `/contacts` at 0.5 — reasonable
   - `/corporate` at 0.8 — seems high for what's likely a thin page
3. **No `<changefreq>` differentiation for events** — all events are `weekly`, but upcoming events change status more frequently than past events
4. **No `images` or `videos` extensions** in sitemap

### URL Structure

| Pattern | Quality | Notes |
|---|---|---|
| `/` | Good | Clean |
| `/events` | Good | Clean |
| `/events/{slug}` | Mediocre | Timestamp in slug |
| `/artists` | Good | Clean |
| `/artists/{slug}` | Good | Clean, semantic |
| `/contacts` | Good | Clean |
| `/corporate` | Good | Clean |
| `/offer` | Good | Blocked from indexing |
| `/privacy` | Good | Blocked from indexing |

### JavaScript Rendering

Next.js 14 with Server Components means all critical content is SSR'd. No JS required for content visibility. Third-party scripts are `afterInteractive` strategy. **No rendering issues for search engines.**

### Missing Technical Elements

- No `manifest.json` (PWA) — low priority for SEO but helps mobile experience
- No `indexnow` API integration despite having `indexnow-key.txt` in public — the key file exists but there's no code pinging IndexNow on content updates

---

## Content Quality (14/23)

### E-E-A-T Assessment

**Experience:** Low. Site is an aggregator — doesn't create original content. Event descriptions come from external data source (womanstandup). No first-hand reviews or editorial content.

**Expertise:** Low-Moderate. The site covers only standup comedy (niche focus is good). But no author bios, no editorial voice, no blog/articles demonstrating expertise.

**Authoritativeness:** Moderate. Brand "Смешно" has social presence (VK, Telegram, YouTube) listed in schema. But no external backlinks visible, no press mentions, no "as seen in" signals.

**Trustworthiness:** Moderate. Has:
- Contact page with real contact info ✓
- Legal pages (offer, privacy) ✓
- No deceptive patterns ✓
- HTTPS ✓
- Yandex Metrika + VK pixel for analytics ✓

Missing trust signals:
- No "about us" page explaining who runs the platform
- No physical address (only country in schema)
- No team information
- Email uses `@mail.ru` (consumer-grade) rather than `@comedy.moscow` (branded) — minor trust signal

### Content Depth

**Homepage:** Thin on text content. h1 is hidden (`sr-only`). Main content is event cards (title + date + price). No introductory paragraph explaining what the site offers.

**Event pages:** Good depth. Include:
- Hero with image
- Tags
- Long description (HTML from remote source)
- 18+ notice
- Venue details, date/time, pricing
- Gallery (when available)
- Reviews (when available)
- Similar events
- Share buttons

**Artist pages:** Moderate. Include:
- Photo, name, role
- Bio paragraph
- City
- Upcoming events list
- Total shows count

**Corporate page:** Likely thin — should be checked for content adequacy.

### Duplicate Content Risk

- Events that repeat (same title, different dates) — e.g., "Большой девчачий стендап" appears 7 times in the sitemap with different timestamps
- Artist bios come from external source — if same artist appears on other sites, duplicate content risk
- Low risk overall since event pages have unique dates/venues/prices

### Content Freshness

- ISR revalidate every 5 minutes (300s) keeps content fresh
- New events added via remote data source automatically appear
- Past events remain accessible (good for backlink equity) but are marked as "Концерт прошёл"

### Readability

- Russian language, appropriate for target audience
- Good heading structure on event pages
- Event descriptions support HTML (lists, paragraphs)
- Mobile-responsive layout

### Content Gaps

1. **No blog / editorial content** — articles about standup culture, comedian interviews, "best shows this month" would add E-E-A-T
2. **No FAQ page** — would capture "how to buy tickets", "age restrictions", "refund policy" queries
3. **No venue pages** — `/venues/{slug}` would capture "standup venues in Moscow" searches
4. **No "about us" page** — trust signal
5. **No genre/category pages** — e.g., "women standup", "open mic", "solo shows"

---

## On-Page SEO (16/20)

### Title Tags

**Homepage:** `Стендап концерты в Москве — comedy.moscow` — Good. Primary keyword in front, brand at end. Length: ~45 chars (optimal).

**Event pages:** `{event.title} — {date} | Стендап в Москве` — Good. Template: `{name} — {date} | {brand}`. Descriptive, unique.

**Artist pages:** `{artist.name} — стендап комик | Стендап в Москве` — Good. Clear, includes key phrase "стендап комик".

**Template pattern** (`%s | Стендап в Москве`): Good, consistent.

### Meta Descriptions

**Homepage:** `Афиша стендап концертов в Москве. Расписание, составы комиков, отзывы зрителей. Купить билеты онлайн — быстро и удобно.` — Good. ~150 chars, includes key phrases and CTA.

**Event pages:** Dynamic from event description + optional price text. Good but may be truncated if description is long.

**Artist pages:** Dynamic from artist bio. May be too long for some artists.

### Heading Structure

**Homepage:**
- h1: "Стендап-концерты в Москве" — **CRITICAL ISSUE:** this is `sr-only` (visually hidden). Search engines may see this as suspicious. Move to a visible styled heading.
- h2: "Расписание" — OK
- h2: "Комики" — OK
- h3: Event titles in cards — OK for card-based layouts

**Event pages:**
- h1: Event title — Good
- h2: "Описание концерта", "Фото с прошлых шоу", "Отзывы зрителей", "Похожие концерты" — Good semantic structure

**Artist pages:**
- h1: Artist name — Good
- h2: "Ближайшие выступления" — Good

### Open Graph / Twitter Cards

Both implemented globally (layout.tsx) and per-page (generateMetadata).

**Missing:** No `og:image` on homepage metadata. The layout has no default OG image. Event pages get `event.image` as OG image — good. But homepage has NO og:image set in either layout or page metadata. The `opengraph-image.tsx` generates a default, but it's not explicitly referenced in homepage metadata.

**Twitter:** `summary_large_image` card set on all pages. Good.

### Meta Tags

- `<html lang="ru">` ✓
- Viewport: handled by Next.js automatically ✓
- Charset: UTF-8 (Next.js default) ✓
- `theme-color`: not set — would be nice for dark theme site
- `apple-touch-icon` set ✓
- Favicon links (ico + 32px PNG) ✓

### Internal Linking

- Event pages link to artists ✓
- Artist pages link to their events ✓
- Similar events cross-linked ✓
- Footer links to all main pages ✓
- "Остались вопросы? → /contacts" CTA on event pages ✓

**Missing:** No breadcrumb UI on pages (breadcrumb schema exists but isn't visible to users).

---

## Schema / Structured Data (9/10)

### Implemented Schema (Excellent)

**Global (app/layout.tsx):**
- `Organization` with @id, logo, contact info, social profiles
- `WebSite` with SearchAction, linked to Organization via publisher

**Event pages (events/[slug]/page.tsx):**
- `Event` schema with: name, url, description, image, startDate, endDate (calculated!), eventStatus (EventScheduled/EventSoldOut/EventCompleted), eventAttendanceMode (Offline), location (Place + PostalAddress), organizer (referenced Organization), performer (PerformingGroup per artist)
- `offers` array when tickets are available — with price, currency, availability
- `aggregateRating` when rating > 0 — with ratingValue, reviewCount, bestRating, worstRating
- `review` array — individual Review objects with author, rating, text, date
- `BreadcrumbList` — 3 levels

**Artist pages (artists/[slug]/page.tsx):**
- `Person` schema with name, url, description, image, jobTitle, homeLocation
- `BreadcrumbList` — 3 levels

### Schema Quality Assessment

The Event schema implementation is **best-in-class**. Rarely seen on event listing sites:
- Calculates `endDate` from start time + duration string parsing
- Sets correct `eventStatus` based on ticket availability
- Includes ticket offers as structured Offer objects
- References Organization via @id (linked data graph)
- Past events get EventCompleted status instead of being removed

### Minor Schema Issues

1. **Organization address incomplete** — only has `addressCountry: 'RU'`, missing `addressLocality` (Moscow) and `streetAddress`
2. **Performer type** — uses `PerformingGroup` for all artists. Standup comedians are typically individuals — should use `Person` for solo performers
3. **Telephone format** — `+7-906-731-45-51` has hyphens; schema.org recommends `+79067314551` (E.164)
4. **No Event schema on listing pages** — `/events` page could use `ItemList` schema

### Missing Schema Opportunities

1. **`ItemList` on `/events` and `/artists` pages** — listing pages should have `ItemList` with `ListItem` entries
2. **`FAQ` on event pages** — common questions like "можно ли вернуть билет?", "нужен ли паспорт?" could be FAQ schema (the 18+ notice is already there)
3. **`EventSeries`** — for recurring events like "Большой девчачий стендап" that happens multiple times

---

## Performance / Core Web Vitals (7/10)

### LCP (Largest Contentful Paint)

**Concerns:**
- HeroSlider loads 4 full-size images with `quality={100}` and `priority` — this is heavy (2-3x larger than quality=85)
- `intickets.min.css` loaded in `<head>` from external CDN — **render-blocking**, blocks first paint until downloaded
- No `preconnect` hints for external origins (womanstandup.ru, intickets.ru, mc.yandex.ru, top-fwz1.mail.ru)
- AVIF format not enabled — only WebP configured (`next.config.mjs:11`)
- Plain `<img>` tag in EventHero cast row — bypasses all next/image optimizations
- `next/font/google` handles font loading well — good, self-hosted Google Fonts

**What's good:**
- `next/image` with WebP format, srcset, responsive sizes
- `priority` on first hero image (i=0)
- SSR sends complete HTML — no client-side data fetching for content

### INP (Interaction to Next Paint)

**Concerns:**
- 4 third-party scripts (all `afterInteractive`):
  1. VK/MyTarget pixel (top-fwz1.mail.ru)
  2. Yandex Metrika × 2 (mc.yandex.ru)
  3. Yandex Tickets Dealer (widget.afisha.yandex.ru)
- HeroSlider runs `setInterval` every 8s + animation state management
- Framer Motion animations on scroll (if used on cards)

**What's good:**
- Third-party scripts use `afterInteractive` — don't block hydration
- HeroSlider respects `prefers-reduced-motion`

### CLS (Cumulative Layout Shift)

**Low risk:**
- `next/font/google` with `variable` fonts prevents FOUT
- `next/image` provides explicit width/height with `fill` + parent sizing
- No dynamic ad injection
- Content is server-rendered with deterministic layout

**Minor risk:**
- Calendar component loading state
- Cookie banner appearance could shift content
- Gallery lightbox lazy loading

### Resource Optimization

| Aspect | Status | Note |
|---|---|---|
| Image format | ✓ WebP | `formats: ['image/webp']` |
| Image dimensions | ✓ | `deviceSizes` + `imageSizes` configured |
| Code splitting | ✓ | Next.js automatic |
| CSS purging | ✓ | Tailwind JIT |
| Font optimization | ✓ | `next/font/google` self-hosts |
| Cache TTL | ⚠ 1 hour | `minimumCacheTTL: 3600` — could be 86400 for static images |

### Third-Party Impact

- 4 distinct third-party JavaScript domains
- 1 external CSS file
- 2 analytics services (Yandex + VK) — potential redundancy
- No tag manager (scripts are hardcoded, good for performance)

---

## Images (4/5)

### Current Implementation

- All images use `next/image` ✓
- WebP auto-conversion ✓
- Responsive sizes attribute ✓
- Priority on above-fold images ✓
- Alt text present (event titles) ✓

### Issues

1. **HeroSlider loads images at `quality={100}`** — reduce to 85-90. Difference is imperceptible but file size is 2-3x larger.
2. **Plain `<img>` tag in EventHero artist cast** (`components/sections/EventHero.tsx:105`) — bypasses next/image entirely. No WebP/AVIF conversion, no srcset, no lazy loading. Causes CLS if image fails.
3. **No blur placeholder** — could use `blurDataURL` for perceived performance
4. **AVIF format not enabled** — only WebP is configured. AVIF provides 20-30% better compression with >95% browser support in 2026.
5. **OG image only covers default** — event-specific OG images use the event photo (good), but fallback quality varies
6. **Artist photos are 600×600** but displayed at ~300px — could use smaller source

---

## AI Search Readiness (5/10)

### AI Crawler Access

- **robots.txt** uses `User-Agent: *` — all AI crawlers (GPTBot, ClaudeBot, PerplexityBot) have full access. This is fine for discoverability.

### llms.txt

**Missing.** No `llms.txt` file. This is important for AI search visibility. Should contain:
- Site description
- Key pages with descriptions
- Event discovery patterns
- Contact information

### Brand Signals

- Social profiles in schema: VK, Telegram, YouTube ✓
- Brand name "Смешно" is consistent in schema
- Domain `comedy.moscow` doesn't match brand name "Смешно" — mild inconsistency
- No Wikipedia page, no press mentions visible

### Passage-Level Citability

**Good:**
- Event dates, times, prices are in structured format
- Venue information is clear
- Each event page has self-contained information

**Could improve:**
- Add "what", "when", "where", "how much" sections explicitly marked
- FAQ content for AI extraction
- No definition lists (`<dl>`) for key facts

### Platform-Specific

**Yandex (critical for Russian market):**
- Yandex Metrika installed ✓
- Yandex Webmaster verification file present (`yandex_e0e06853b7cc5bf0.html`) ✓
- Yandex Tickets Dealer integration ✓
- IndexNow key file exists but no automatic pinging on content updates

**Google:**
- Standup comedy is niche enough to rank well with proper schema
- Event schema is excellent — Google will display rich results for events

---

## Scoring Summary

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 15/22 | 15.0 |
| Content Quality | 23% | 14/23 | 14.0 |
| On-Page SEO | 20% | 16/20 | 16.0 |
| Schema / Structured Data | 10% | 9/10 | 9.0 |
| Performance / CWV | 10% | 7/10 | 7.0 |
| AI Search Readiness | 10% | 5/10 | 5.0 |
| Images | 5% | 4/5 | 4.0 |
| **TOTAL** | **100%** | | **70.0 → 72** |

Adjusted to 72 to reflect that the excellent schema implementation and clean Next.js architecture compensate for some content and performance gaps.

---

## Comparison: Strengths vs Weaknesses

| Strength | Weakness |
|---|---|
| Excellent Event schema with offers, ratings, reviews | Sitemap missing lastmod dates |
| Clean Next.js SSR architecture | Homepage h1 hidden (sr-only) |
| Dynamic sitemap auto-updates | No Content-Security-Policy |
| Per-page canonicals correct | 4 third-party scripts |
| Russian-language optimization | No blog/content for E-E-A-T |
| Robots.txt well-structured | No llms.txt for AI search |
| Smart noindex on filtered pages | Render-blocking external CSS |
| BreadcrumbList schema everywhere | Event URL timestamps |
| IndexNow key exists | No image blur placeholders |
| Yandex ecosystem integrated | No venue/genre pages |
